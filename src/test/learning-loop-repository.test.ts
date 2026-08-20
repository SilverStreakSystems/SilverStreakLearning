import { beforeEach, describe, expect, it } from "vitest";

import {
  createSeedDocument,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import {
  BrowserLearningLoopRepository,
  ENVELOPE_VERSION,
  InMemoryLearningLoopRepository,
  LEARNING_LOOP_BACKUP_KEY,
  LEARNING_LOOP_STORAGE_KEY,
  MAX_IMPORT_BYTES,
  isEnvelope,
  type StorageEnvelope,
} from "@/lib/learning-loop/repository";

const AT = "2026-03-01T10:00:00.000Z";

/** A minimal Storage that can be made to fail on demand. */
class FakeStorage implements Storage {
  private map = new Map<string, string>();
  failWrites = false;
  /** Reads start working (so the constructor probe passes) and can fail later. */
  failReads = false;
  failRemovals = false;

  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  key(index: number) {
    return Array.from(this.map.keys())[index] ?? null;
  }
  getItem(key: string) {
    if (this.failReads) throw new Error("blocked");
    return this.map.get(key) ?? null;
  }

  /** A byte-exact copy of everything stored, for unchanged-bytes assertions. */
  snapshot(): Array<[string, string]> {
    return Array.from(this.map.entries());
  }
  removeItem(key: string) {
    if (this.failRemovals && !key.endsWith(".probe")) throw new Error("blocked");
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    if (this.failWrites && !key.endsWith(".probe")) throw new Error("quota");
    this.map.set(key, value);
  }
}

function seed(): LearningLoopDocument {
  return createSeedDocument();
}

describe("in-memory repository", () => {
  it("advances the revision on commit and rejects a stale expected revision", () => {
    const repository = new InMemoryLearningLoopRepository();
    const first = repository.commit(null, seed(), AT);
    expect(first.status).toBe("ok");
    if (first.status !== "ok") return;
    expect(first.document.revision).toBe(1);

    const stale = repository.commit(null, first.document, AT);
    expect(stale.status).toBe("conflict");
    if (stale.status === "conflict") expect(stale.currentRevision).toBe(1);
  });

  it("refuses a change that would break an invariant, leaving the stored value alone", () => {
    const repository = new InMemoryLearningLoopRepository(seed());
    const before = repository.read();
    const broken = seed();
    broken.goals.push({ ...broken.goals[0]! });
    const outcome = repository.commit(0, broken, AT);
    expect(outcome.status).toBe("invalid");
    expect(repository.read()).toEqual(before);
  });
});

describe("browser repository storage states", () => {
  let storage: FakeStorage;

  beforeEach(() => {
    storage = new FakeStorage();
  });

  it("reports empty, then ready", () => {
    const repository = new BrowserLearningLoopRepository(storage);
    expect(repository.read().status).toBe("empty");
    expect(repository.commit(null, seed(), AT).status).toBe("ok");
    expect(repository.read().status).toBe("ready");
  });

  it("reports unavailable rather than empty when storage is absent", () => {
    const repository = new BrowserLearningLoopRepository(null);
    expect(repository.available).toBe(false);
    expect(repository.read().status).toBe("unavailable");
    expect(repository.commit(null, seed(), AT).status).toBe("unavailable");
  });

  it("reports corrupt rather than empty, and commit refuses to overwrite it", () => {
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, "{not json");
    const repository = new BrowserLearningLoopRepository(storage);
    expect(repository.read().status).toBe("corrupt");

    const outcome = repository.commit(null, seed(), AT);
    expect(outcome.status).toBe("conflict");
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe("{not json");
  });

  it("reports unsupported-version for a newer schema and refuses to overwrite it", () => {
    const newer = { ...seed(), schemaVersion: 99 };
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, JSON.stringify(newer));
    const repository = new BrowserLearningLoopRepository(storage);
    expect(repository.read().status).toBe("unsupported-version");
    expect(repository.commit(null, seed(), AT).status).toBe("conflict");
    expect(JSON.parse(storage.getItem(LEARNING_LOOP_STORAGE_KEY)!).schemaVersion).toBe(99);
  });

  it("reports write-failed and changes nothing when the browser refuses the write", () => {
    const repository = new BrowserLearningLoopRepository(storage);
    storage.failWrites = true;
    const outcome = repository.commit(null, seed(), AT);
    expect(outcome.status).toBe("write-failed");
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBeNull();
  });
});

/** The stored value, parsed as the one-key envelope it is supposed to be. */
function envelopeIn(storage: FakeStorage): StorageEnvelope {
  const raw = storage.getItem(LEARNING_LOOP_STORAGE_KEY);
  expect(raw).not.toBeNull();
  const parsed: unknown = JSON.parse(raw!);
  expect(isEnvelope(parsed)).toBe(true);
  return parsed as StorageEnvelope;
}

describe("storage envelope: one key, one value, one write", () => {
  it("writes current and backup inside a single stored value", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);

    const keys = storage.snapshot().map(([key]) => key);
    expect(keys).toEqual([LEARNING_LOOP_STORAGE_KEY]);
    const envelope = envelopeIn(storage);
    expect(envelope.envelopeVersion).toBe(ENVELOPE_VERSION);
    expect(envelope.backup).toBeNull();
    expect(repository.readRaw()).toEqual({ status: "ok", raw: envelope.current });
    expect(repository.readBackup()).toEqual({ status: "ok", raw: null });
  });

  it("reads a legacy bare document and a legacy backup key without destroying either", () => {
    const storage = new FakeStorage();
    const legacyDocument = serializeDocument({ ...seed(), revision: 4 });
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, legacyDocument);
    storage.setItem(LEARNING_LOOP_BACKUP_KEY, "{legacy backup bytes");
    const repository = new BrowserLearningLoopRepository(storage);

    const read = repository.read();
    expect(read.status).toBe("ready");
    expect(repository.readRaw()).toEqual({ status: "ok", raw: legacyDocument });
    expect(repository.readBackup()).toEqual({ status: "ok", raw: "{legacy backup bytes" });
    // Reading migrates nothing: the legacy bytes are still exactly where they were.
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(legacyDocument);
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBe("{legacy backup bytes");
  });

  it("migrates the legacy pair into the envelope on the first successful write", () => {
    const storage = new FakeStorage();
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, serializeDocument({ ...seed(), revision: 4 }));
    storage.setItem(LEARNING_LOOP_BACKUP_KEY, "{legacy backup bytes");
    const repository = new BrowserLearningLoopRepository(storage);

    expect(repository.commit(4, seed(), AT).status).toBe("ok");
    expect(storage.snapshot().map(([key]) => key)).toEqual([LEARNING_LOOP_STORAGE_KEY]);
    // The legacy recovery copy was carried across, not dropped.
    expect(envelopeIn(storage).backup).toBe("{legacy backup bytes");
  });

  it("trusts the envelope's own backup even when the legacy key could not be removed", () => {
    const storage = new FakeStorage();
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, serializeDocument({ ...seed(), revision: 4 }));
    storage.setItem(LEARNING_LOOP_BACKUP_KEY, "{stale legacy backup");
    const repository = new BrowserLearningLoopRepository(storage);

    // The tidy-up of the superseded legacy key fails; the write itself succeeds.
    storage.failRemovals = true;
    expect(repository.recover(seed(), AT).status).toBe("ok");
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBe("{stale legacy backup");

    // The envelope is authoritative: the snapshot is the value that was actually
    // replaced, not the stale key that survived the failed removal.
    const envelope = envelopeIn(storage);
    expect(envelope.backup).toBe(serializeDocument({ ...seed(), revision: 4 }));
    expect(repository.readBackup()).toEqual({ status: "ok", raw: envelope.backup });
  });

  it("does not resurrect a legacy backup when the envelope says there is none", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    // A stale key reappears (another tab, a failed removal in an earlier build).
    storage.setItem(LEARNING_LOOP_BACKUP_KEY, "{stale legacy backup");

    expect(repository.readBackup()).toEqual({ status: "ok", raw: null });
  });

  it("leaves every stored byte unchanged when the envelope write is refused", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    const before = storage.snapshot();

    storage.failWrites = true;
    const edited = seed();
    edited.learners[0]!.displayLabel = "Sample Learner A (fictional) edited";
    expect(repository.commit(1, edited, AT).status).toBe("write-failed");
    expect(repository.recover(seed(), AT).status).toBe("write-failed");
    expect(repository.clear().status).toBe("write-failed");
    expect(storage.snapshot()).toEqual(before);
  });

  it("reports unavailable, never empty, when a read fails after the probe succeeded", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    expect(repository.available).toBe(true);

    storage.failReads = true;
    expect(repository.read().status).toBe("unavailable");
    expect(repository.readRaw().status).toBe("unavailable");
    expect(repository.readBackup().status).toBe("unavailable");
    expect(repository.commit(1, seed(), AT).status).toBe("unavailable");
    expect(repository.recover(seed(), AT).status).toBe("unavailable");
    expect(repository.clear().status).toBe("unavailable");
  });

  it("does not report a clear as ok when storage is unavailable or refuses the write", () => {
    expect(new BrowserLearningLoopRepository(null).clear()).toEqual({
      status: "unavailable",
      message: expect.stringContaining("not allowing local storage"),
    });

    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    storage.failWrites = true;
    expect(repository.clear().status).toBe("write-failed");
    expect(repository.read().status).toBe("ready");
  });

  it("keeps the cleared document as the single recovery copy", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    const stored = envelopeIn(storage).current;

    expect(repository.clear().status).toBe("ok");
    expect(repository.read().status).toBe("empty");
    expect(repository.readBackup()).toEqual({ status: "ok", raw: stored });
  });
});

describe("destructive recovery transaction", () => {
  it("is the only path that can replace corrupt stored data, and keeps the prior bytes", () => {
    const storage = new FakeStorage();
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, "{not json");
    const repository = new BrowserLearningLoopRepository(storage);

    expect(repository.commit(null, seed(), AT).status).toBe("conflict");
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe("{not json");

    const recovered = repository.recover(seed(), AT);
    expect(recovered.status).toBe("ok");
    expect(repository.read().status).toBe("ready");
    // The unreadable bytes survive verbatim as the single recovery copy.
    expect(repository.readBackup()).toEqual({ status: "ok", raw: "{not json" });
    expect(envelopeIn(storage).backup).toBe("{not json");
  });

  it("replaces the single backup instead of accumulating backups", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.recover(seed(), AT);
    const firstStored = envelopeIn(storage).current;

    repository.recover(seed(), "2026-03-02T10:00:00.000Z");
    expect(envelopeIn(storage).backup).toBe(firstStored);
    const secondStored = envelopeIn(storage).current;

    repository.recover(seed(), "2026-03-03T10:00:00.000Z");
    // Still one key, still exactly one backup: the immediately prior value.
    expect(storage.snapshot().map(([key]) => key)).toEqual([LEARNING_LOOP_STORAGE_KEY]);
    expect(envelopeIn(storage).backup).toBe(secondStored);
  });

  it("refuses an invalid replacement and leaves the stored value untouched", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    const before = storage.snapshot();

    const broken = seed();
    broken.goals.push({ ...broken.goals[0]! });
    expect(repository.recover(broken, AT).status).toBe("invalid");
    expect(storage.snapshot()).toEqual(before);
  });

  it("does not take a recovery snapshot on an ordinary edit", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    expect(repository.readBackup()).toEqual({ status: "ok", raw: null });

    const edited = seed();
    edited.learners[0]!.displayLabel = "Sample Learner A (fictional) edited";
    expect(repository.commit(1, edited, AT).status).toBe("ok");
    expect(repository.readBackup()).toEqual({ status: "ok", raw: null });
  });
});

describe("import size limit", () => {
  it("is smaller than a serialized seed export by a wide margin", () => {
    expect(MAX_IMPORT_BYTES).toBe(1024 * 1024);
    expect(serializeDocument(seed()).length).toBeLessThan(MAX_IMPORT_BYTES);
  });
});

describe("one-snapshot concurrency across two views of the same storage", () => {
  it("refuses a stale confirmed replacement after another tab committed", () => {
    const storage = new FakeStorage();
    const tabA = new BrowserLearningLoopRepository(storage);
    const tabB = new BrowserLearningLoopRepository(storage);
    tabA.commit(null, seed(), AT);

    // Tab A opens a confirmation against what it can see right now.
    const captured = tabA.expectation();
    expect(captured.status).toBe("ok");
    const expectation = captured.status === "ok" ? captured.expectation : null;

    // Tab B saves an ordinary edit in the meantime.
    const edited = seed();
    edited.learners[0]!.displayLabel = "Sample Learner A (fictional) edited elsewhere";
    expect(tabB.commit(1, edited, AT).status).toBe("ok");
    const afterOtherTab = storage.snapshot();

    const replacement = seed();
    replacement.learners[0]!.displayLabel = "Sample Learner A (fictional) stale replacement";
    const outcome = tabA.recover(replacement, AT, expectation!);
    expect(outcome.status).toBe("conflict");
    // Not one byte of the other tab's write was disturbed.
    expect(storage.snapshot()).toEqual(afterOtherTab);
  });

  it("refuses a stale replacement of corrupt bytes that another tab already replaced", () => {
    const storage = new FakeStorage();
    const tabA = new BrowserLearningLoopRepository(storage);
    const tabB = new BrowserLearningLoopRepository(storage);
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, "{not json");

    const captured = tabA.expectation();
    const expectation = captured.status === "ok" ? captured.expectation : null;
    expect(expectation?.token).toBe("{not json");
    expect(expectation?.revision).toBeNull();

    expect(tabB.recover(seed(), AT).status).toBe("ok");
    const afterOtherTab = storage.snapshot();

    expect(tabA.recover(seed(), AT, expectation!).status).toBe("conflict");
    expect(storage.snapshot()).toEqual(afterOtherTab);
  });

  it("accepts a confirmed replacement when nothing changed since it was opened", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    const before = storage.getItem(LEARNING_LOOP_STORAGE_KEY);

    const captured = repository.expectation();
    const expectation = captured.status === "ok" ? captured.expectation : null;
    const replacement = seed();
    replacement.learners[0]!.displayLabel = "Sample Learner A (fictional) replaced";
    expect(repository.recover(replacement, AT, expectation!).status).toBe("ok");

    const stored = JSON.parse(storage.getItem(LEARNING_LOOP_STORAGE_KEY)!) as StorageEnvelope;
    expect(isEnvelope(stored)).toBe(true);
    expect(stored.envelopeVersion).toBe(ENVELOPE_VERSION);
    // The prior bytes are kept exactly, as the single recovery copy.
    expect(stored.backup).toBe((JSON.parse(before!) as StorageEnvelope).current);
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBeNull();
  });
});
