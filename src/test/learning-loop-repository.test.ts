import { beforeEach, describe, expect, it } from "vitest";

import {
  createSeedDocument,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import {
  BrowserLearningLoopRepository,
  InMemoryLearningLoopRepository,
  LEARNING_LOOP_BACKUP_KEY,
  LEARNING_LOOP_STORAGE_KEY,
  MAX_IMPORT_BYTES,
} from "@/lib/learning-loop/repository";

const AT = "2026-03-01T10:00:00.000Z";

/** A minimal Storage that can be made to fail on demand. */
class FakeStorage implements Storage {
  private map = new Map<string, string>();
  failWrites = false;

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
    return this.map.get(key) ?? null;
  }
  removeItem(key: string) {
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

describe("destructive recovery transaction", () => {
  it("is the only path that can replace corrupt stored data, and keeps the prior bytes", () => {
    const storage = new FakeStorage();
    storage.setItem(LEARNING_LOOP_STORAGE_KEY, "{not json");
    const repository = new BrowserLearningLoopRepository(storage);

    expect(repository.commit(null, seed(), AT).status).toBe("conflict");

    const recovered = repository.recover(seed(), AT);
    expect(recovered.status).toBe("ok");
    expect(repository.read().status).toBe("ready");
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBe("{not json");
  });

  it("replaces the single backup instead of accumulating backups", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.recover(seed(), AT);
    const firstStored = storage.getItem(LEARNING_LOOP_STORAGE_KEY)!;

    repository.recover(seed(), "2026-03-02T10:00:00.000Z");
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBe(firstStored);

    repository.recover(seed(), "2026-03-03T10:00:00.000Z");
    const keys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) keys.push(storage.key(index)!);
    expect(keys.filter((key) => key.includes("backup"))).toEqual([LEARNING_LOOP_BACKUP_KEY]);
  });

  it("refuses an invalid replacement and leaves the stored value untouched", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    const before = storage.getItem(LEARNING_LOOP_STORAGE_KEY);

    const broken = seed();
    broken.goals.push({ ...broken.goals[0]! });
    expect(repository.recover(broken, AT).status).toBe("invalid");
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(before);
  });

  it("does not take a recovery snapshot on an ordinary edit", () => {
    const storage = new FakeStorage();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, seed(), AT);
    expect(storage.getItem(LEARNING_LOOP_BACKUP_KEY)).toBeNull();
  });
});

describe("import size limit", () => {
  it("is smaller than a serialized seed export by a wide margin", () => {
    expect(MAX_IMPORT_BYTES).toBe(1024 * 1024);
    expect(serializeDocument(seed()).length).toBeLessThan(MAX_IMPORT_BYTES);
  });
});
