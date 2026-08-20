/**
 * LearningLoopRepository — the only way product data is read or written.
 *
 * It is a real transaction boundary, not a thin wrapper over a storage call:
 *
 * - every write re-parses the proposed document against the strict schema and
 *   the cross-record invariants at runtime, because a TypeScript type is not
 *   runtime validation;
 * - every write carries an expected revision, the persisted revision is re-read
 *   immediately before the write, and a mismatch returns a conflict and changes
 *   nothing;
 * - an accepted write stamps `currentRevision + 1` exactly once, never
 *   `incoming.revision + 1`;
 * - outcomes are structured. Corrupt data, data written by a newer schema, and
 *   unavailable storage are three different answers and none of them is "empty".
 *
 * Two adapters implement it: an in-memory one used by tests, by the server
 * render, and as the live fallback when browser storage is unavailable, and a
 * browser-local one used in the client.
 */
import {
  canonicalizeDocument,
  createSeedDocument,
  migrateDocument,
  parseDocumentShape,
  serializeDocument,
  validateDocumentInvariants,
  type InvariantProblem,
  type LearningLoopDocument,
  type SchemaProblem,
} from "@/domain/learning-loop";

/** Namespaced so nothing else in the origin can collide with it. */
export const LEARNING_LOOP_STORAGE_KEY = "ssls.product-alpha-001.learning-loop.v1";
/**
 * The pre-envelope backup key. Nothing writes it any more; it is still read so
 * a recovery copy written by an earlier build is migrated rather than lost.
 */
export const LEARNING_LOOP_BACKUP_KEY = "ssls.product-alpha-001.learning-loop.backup.v1";
/** Refuse oversized imports before the file is ever read into memory. */
export const MAX_IMPORT_BYTES = 1024 * 1024;

/** Envelope format marker. Legacy raw documents are read and migrated. */
export const ENVELOPE_VERSION = 1;

/**
 * One key, one value, one write.
 *
 * Current bytes and the single recovery copy live in the same stored value, so
 * a destructive replace is a single `setItem`. There is no window in which the
 * backup has moved and the document has not, and a refused write leaves both
 * exactly as they were.
 */
export interface StorageEnvelope {
  envelopeVersion: typeof ENVELOPE_VERSION;
  /** Raw document text, or null when nothing is held. */
  current: string | null;
  /** The single prior raw value kept for recovery. Never accumulates. */
  backup: string | null;
}

export type ReadOutcome =
  | { status: "empty" }
  | { status: "ready"; document: LearningLoopDocument }
  | { status: "corrupt"; message: string; raw: string | null }
  | { status: "unsupported-version"; message: string; raw: string | null }
  | { status: "unavailable"; message: string };

/** Raw access is an outcome too: a read that threw is never reported as "nothing". */
export type RawOutcome =
  { status: "ok"; raw: string | null } | { status: "unavailable"; message: string };

export type CommitOutcome =
  | { status: "ok"; document: LearningLoopDocument }
  | { status: "conflict"; message: string; currentRevision: number | null }
  | {
      status: "invalid";
      message: string;
      schemaProblems: SchemaProblem[];
      invariantProblems: InvariantProblem[];
    }
  | { status: "write-failed"; message: string }
  | { status: "unavailable"; message: string };

export type ClearOutcome =
  | { status: "ok" }
  | { status: "write-failed"; message: string }
  | { status: "unavailable"; message: string };

/**
 * What a destructive replacement believes about the stored value.
 *
 * It is captured when the confirmation or preview opens, and re-checked against
 * one fresh snapshot immediately before the single write. `token` is the exact
 * stored bytes at that moment — for a readable document, for corrupt bytes, and
 * for a newer-schema value alike — so a stale confirmation can never overwrite
 * a change another tab made in the meantime.
 */
export interface RecoveryExpectation {
  /** Exact bytes stored under the canonical key, or null for nothing stored. */
  token: string | null;
  /** Revision of the readable document at capture time, or null. */
  revision: number | null;
}

/**
 * An expectation and the decoded document it was captured from, taken from one
 * snapshot.
 *
 * The two are handed back together on purpose: a preview built from a document
 * read at a different moment than the token it is protected by would describe
 * a base that the confirmation does not actually guard.
 */
export type ExpectationOutcome =
  | { status: "ok"; expectation: RecoveryExpectation; read: ReadOutcome }
  | { status: "unavailable"; message: string };

export interface LearningLoopRepository {
  readonly kind: "browser-local" | "in-memory";
  /** True when the underlying medium accepted at least a probe write. */
  readonly available: boolean;
  /** True when nothing written here survives a reload. */
  readonly ephemeral: boolean;
  read(): ReadOutcome;
  /**
   * Validates, checks the expected revision against the persisted revision, and
   * stores. `expectedRevision` is null when the caller expects no document.
   */
  commit(expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome;
  /**
   * The explicit destructive-recovery transaction. Used only after the person
   * has confirmed a replacement, and the only path that can overwrite corrupt
   * or newer-schema stored data. It preserves the exact prior bytes as the
   * single bounded backup, validates the incoming document in full, and
   * replaces the stored value in one write. On failure the stored value is
   * unchanged. Normal `commit` never does this: it conflicts instead.
   *
   * `expected` is mandatory. It is compared against one fresh snapshot before
   * the write, and anything changed returns a conflict and writes nothing.
   * There is no unguarded recovery: the first write into empty storage is an
   * ordinary `commit(null, ...)`, which conflicts if anything appears meanwhile.
   */
  recover(next: LearningLoopDocument, at: string, expected: RecoveryExpectation): CommitOutcome;
  /** Captures what a pending destructive replacement is being decided against. */
  expectation(): ExpectationOutcome;
  clear(): ClearOutcome;
  /** The raw stored text, for recovery export when the document will not parse. */
  readRaw(): RawOutcome;
  /** The single recovery snapshot taken before the last destructive replace. */
  readBackup(): RawOutcome;
}

/** Recognises the envelope format. Anything else is a legacy raw document. */
export function isEnvelope(value: unknown): value is StorageEnvelope {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (candidate["envelopeVersion"] !== ENVELOPE_VERSION) return false;
  const current = candidate["current"];
  const backup = candidate["backup"];
  return (
    (typeof current === "string" || current === null) &&
    (typeof backup === "string" || backup === null)
  );
}

/**
 * The declared envelope version of a parsed stored value, or null when the
 * value does not declare one at all (a legacy bare document).
 */
export function declaredEnvelopeVersion(value: unknown): number | null {
  if (!value || typeof value !== "object") return null;
  const declared = (value as Record<string, unknown>)["envelopeVersion"];
  return typeof declared === "number" && Number.isFinite(declared) ? declared : null;
}

const CONFLICT_MESSAGE =
  "The saved records changed since this form was opened, so nothing was written. Reload and try again.";

/**
 * One decoded view of the stored value, taken exactly once per transaction.
 *
 * `token` is the exact bytes read, and is the thing a pending destructive
 * replacement is re-checked against before its single write.
 */
interface EnvelopeSnapshot {
  token: string | null;
  current: string | null;
  backup: string | null;
  /** The stored value declares an envelope version this build cannot decode. */
  unsupportedEnvelope: boolean;
}

/** Deep copy at the boundary so no caller holds a reference to stored state. */
function detach(document: LearningLoopDocument): LearningLoopDocument {
  return JSON.parse(JSON.stringify(document)) as LearningLoopDocument;
}

interface Validated {
  ok: boolean;
  document: LearningLoopDocument | null;
  schemaProblems: SchemaProblem[];
  invariantProblems: InvariantProblem[];
}

/** Runtime shape validation followed by cross-record invariant validation. */
function validateRuntime(candidate: unknown): Validated {
  const shape = parseDocumentShape(candidate);
  if (!shape.ok)
    return { ok: false, document: null, schemaProblems: shape.problems, invariantProblems: [] };
  const invariantProblems = validateDocumentInvariants(shape.document);
  if (invariantProblems.length > 0)
    return { ok: false, document: null, schemaProblems: [], invariantProblems };
  return { ok: true, document: shape.document, schemaProblems: [], invariantProblems: [] };
}

function invalidOutcome(result: Validated): CommitOutcome {
  return {
    status: "invalid",
    message: "That change was not saved because it would leave the records inconsistent.",
    schemaProblems: result.schemaProblems,
    invariantProblems: result.invariantProblems,
  };
}

/** Builds the document that would be persisted: canonical, revision advanced once. */
function stamp(
  next: LearningLoopDocument,
  currentRevision: number | null,
  at: string,
): LearningLoopDocument {
  return canonicalizeDocument({
    ...detach(next),
    revision: (currentRevision ?? 0) + 1,
    lastUpdatedAt: at,
  });
}

export class InMemoryLearningLoopRepository implements LearningLoopRepository {
  readonly kind = "in-memory" as const;
  readonly available = true;
  readonly ephemeral = true;
  private document: LearningLoopDocument | null;
  private backup: string | null = null;

  constructor(initial: LearningLoopDocument | null = null) {
    this.document = initial ? canonicalizeDocument(detach(initial)) : null;
  }

  read(): ReadOutcome {
    if (!this.document) return { status: "empty" };
    return { status: "ready", document: detach(this.document) };
  }

  readRaw(): RawOutcome {
    return { status: "ok", raw: this.document ? serializeDocument(this.document) : null };
  }

  readBackup(): RawOutcome {
    return { status: "ok", raw: this.backup };
  }

  commit(expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome {
    const currentRevision = this.document?.revision ?? null;
    if (currentRevision !== expectedRevision)
      return {
        status: "conflict",
        message:
          "The saved records changed since this form was opened, so nothing was written. Reload and try again.",
        currentRevision,
      };
    const candidate = stamp(next, currentRevision, at);
    const result = validateRuntime(candidate);
    if (!result.ok || !result.document) return invalidOutcome(result);
    this.document = result.document;
    return { status: "ok", document: detach(result.document) };
  }

  expectation(): ExpectationOutcome {
    return {
      status: "ok",
      expectation: {
        token: this.document ? serializeDocument(this.document) : null,
        revision: this.document?.revision ?? null,
      },
      read: this.read(),
    };
  }

  recover(next: LearningLoopDocument, at: string, expected: RecoveryExpectation): CommitOutcome {
    const priorRaw = this.document ? serializeDocument(this.document) : null;
    const currentRevision = this.document?.revision ?? null;
    if (expected.token !== priorRaw || expected.revision !== currentRevision)
      return { status: "conflict", message: CONFLICT_MESSAGE, currentRevision };
    const candidate = stamp(next, currentRevision, at);
    const result = validateRuntime(candidate);
    if (!result.ok || !result.document) return invalidOutcome(result);
    if (priorRaw !== null) this.backup = priorRaw;
    this.document = result.document;
    return { status: "ok", document: detach(result.document) };
  }

  clear(): ClearOutcome {
    if (this.document) this.backup = serializeDocument(this.document);
    this.document = null;
    return { status: "ok" };
  }
}

function probeStorage(storage: Storage): boolean {
  const probe = `${LEARNING_LOOP_STORAGE_KEY}.probe`;
  try {
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export class BrowserLearningLoopRepository implements LearningLoopRepository {
  readonly kind = "browser-local" as const;
  readonly available: boolean;
  readonly ephemeral = false;
  private readonly storage: Storage | null;

  constructor(storage?: Storage | null) {
    let resolved: Storage | null = storage ?? null;
    if (storage === undefined) {
      try {
        resolved = typeof window === "undefined" ? null : window.localStorage;
      } catch {
        resolved = null;
      }
    }
    this.storage = resolved && probeStorage(resolved) ? resolved : null;
    this.available = this.storage !== null;
  }

  /**
   * Reads the single stored value once and normalises it to an envelope view.
   *
   * Every transaction takes exactly one snapshot and decides from it, so a
   * read, a revision check, and a write can never disagree about what was
   * stored. `token` is the exact bytes seen, and is what a pending destructive
   * replacement is later re-checked against.
   *
   * A value written by an earlier build is a bare document, and an earlier
   * build may also have left a separate backup key; both are folded in here.
   * Nothing is deleted: legacy bytes stay put until a successful write migrates
   * them. Once the primary value parses as a v1 envelope, that envelope alone
   * says what the current and backup values are and the legacy keys are
   * irrelevant. A stored value declaring a newer envelope version is not
   * decoded at all: it is reported as unsupported with its bytes preserved.
   */
  private readSnapshot():
    { status: "ok"; snapshot: EnvelopeSnapshot } | { status: "unavailable"; message: string } {
    if (!this.storage)
      return { status: "unavailable", message: "This browser is not allowing local storage." };
    let stored: string | null;
    let legacyBackup: string | null;
    try {
      stored = this.storage.getItem(LEARNING_LOOP_STORAGE_KEY);
      legacyBackup = this.storage.getItem(LEARNING_LOOP_BACKUP_KEY);
    } catch {
      return {
        status: "unavailable",
        message: "This browser refused to read the saved data, so its state is unknown.",
      };
    }
    const legacy = (current: string | null): EnvelopeSnapshot => ({
      token: stored,
      current,
      backup: legacyBackup,
      unsupportedEnvelope: false,
    });
    if (stored === null) return { status: "ok", snapshot: legacy(null) };

    let parsed: unknown = undefined;
    try {
      parsed = JSON.parse(stored);
    } catch {
      // Unreadable bytes are the current value. They are never discarded.
      return { status: "ok", snapshot: legacy(stored) };
    }
    if (isEnvelope(parsed))
      return {
        status: "ok",
        snapshot: {
          token: stored,
          current: parsed.current,
          backup: parsed.backup,
          unsupportedEnvelope: false,
        },
      };
    const declared = declaredEnvelopeVersion(parsed);
    if (declared !== null && declared > ENVELOPE_VERSION)
      return {
        status: "ok",
        snapshot: {
          token: stored,
          // The whole stored value is the thing to preserve: this build cannot
          // tell which part of it is the document and which is the backup.
          current: stored,
          backup: null,
          unsupportedEnvelope: true,
        },
      };
    return { status: "ok", snapshot: legacy(stored) };
  }

  /** Decodes one already-taken snapshot. No second storage read happens here. */
  private decode(snapshot: EnvelopeSnapshot): ReadOutcome {
    if (snapshot.unsupportedEnvelope)
      return {
        status: "unsupported-version",
        message:
          "The saved data was written by a newer version of this product and cannot be read here. It has been left in place rather than overwritten.",
        raw: snapshot.token,
      };
    const raw = snapshot.current;
    if (raw === null) return { status: "empty" };
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        status: "corrupt",
        message:
          "The saved data is not readable. It has been left in place rather than overwritten.",
        raw,
      };
    }
    const result = migrateDocument(parsed);
    if (!result.ok)
      return {
        status: result.reason === "unsupported-version" ? "unsupported-version" : "corrupt",
        message: `${result.message} The saved data has been left in place rather than overwritten.`,
        raw,
      };
    return { status: "ready", document: result.document };
  }

  /**
   * The only write path. One `setItem` moves current and backup together, so a
   * refused write leaves both byte-for-byte unchanged.
   */
  private writeEnvelope(envelope: StorageEnvelope): { ok: true } | { ok: false } {
    if (!this.storage) return { ok: false };
    try {
      this.storage.setItem(
        LEARNING_LOOP_STORAGE_KEY,
        JSON.stringify({
          envelopeVersion: ENVELOPE_VERSION,
          current: envelope.current,
          backup: envelope.backup,
        }),
      );
    } catch {
      return { ok: false };
    }
    // Best effort tidy-up of the superseded legacy backup key. Its content is
    // already inside the envelope that was just written, so a failure here
    // cannot lose anything and must not be reported as a failed write.
    try {
      this.storage.removeItem(LEARNING_LOOP_BACKUP_KEY);
    } catch {
      /* ignore: the envelope already carries the backup */
    }
    return { ok: true };
  }

  readRaw(): RawOutcome {
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok") return snapshot;
    return { status: "ok", raw: snapshot.snapshot.current };
  }

  readBackup(): RawOutcome {
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok") return snapshot;
    return { status: "ok", raw: snapshot.snapshot.backup };
  }

  read(): ReadOutcome {
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok") return { status: "unavailable", message: snapshot.message };
    return this.decode(snapshot.snapshot);
  }

  expectation(): ExpectationOutcome {
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok") return snapshot;
    const current = this.decode(snapshot.snapshot);
    return {
      status: "ok",
      expectation: {
        token: snapshot.snapshot.token,
        revision: current.status === "ready" ? current.document.revision : null,
      },
      // The same snapshot the token came from, decoded once.
      read: current,
    };
  }

  commit(expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome {
    if (!this.storage)
      return {
        status: "unavailable",
        message: "This browser is not allowing local storage, so nothing was saved.",
      };

    // One snapshot decides the read, the revision check, and the write.
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok")
      return { status: "unavailable", message: `${snapshot.message} Nothing was written.` };

    const current = this.decode(snapshot.snapshot);
    if (current.status === "unavailable")
      return { status: "unavailable", message: `${current.message} Nothing was written.` };
    if (current.status === "corrupt" || current.status === "unsupported-version")
      return {
        status: "conflict",
        message: `${current.message} Nothing was written.`,
        currentRevision: null,
      };
    const currentRevision = current.status === "ready" ? current.document.revision : null;
    if (currentRevision !== expectedRevision)
      return { status: "conflict", message: CONFLICT_MESSAGE, currentRevision };

    const candidate = stamp(next, currentRevision, at);
    const result = validateRuntime(candidate);
    if (!result.ok || !result.document) return invalidOutcome(result);

    // A normal save never disturbs the recovery copy.
    const written = this.writeEnvelope({
      envelopeVersion: ENVELOPE_VERSION,
      current: serializeDocument(result.document),
      backup: snapshot.snapshot.backup,
    });
    if (!written.ok)
      return {
        status: "write-failed",
        message:
          "This browser refused to save the change, so nothing was written. Storage may be full or blocked.",
      };
    return { status: "ok", document: result.document };
  }

  recover(next: LearningLoopDocument, at: string, expected: RecoveryExpectation): CommitOutcome {
    if (!this.storage)
      return {
        status: "unavailable",
        message: "This browser is not allowing local storage, so nothing was saved.",
      };
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok")
      return { status: "unavailable", message: `${snapshot.message} Nothing was written.` };

    const current = this.decode(snapshot.snapshot);
    if (current.status === "unavailable")
      return { status: "unavailable", message: `${current.message} Nothing was written.` };
    const currentRevision = current.status === "ready" ? current.document.revision : null;

    // A confirmation decided against bytes that no longer exist is stale, and a
    // stale confirmation must never overwrite what another tab just wrote.
    if (expected.token !== snapshot.snapshot.token || expected.revision !== currentRevision)
      return { status: "conflict", message: CONFLICT_MESSAGE, currentRevision };

    const candidate = stamp(next, currentRevision, at);
    const result = validateRuntime(candidate);
    if (!result.ok || !result.document) return invalidOutcome(result);

    const priorRaw = snapshot.snapshot.current;
    const written = this.writeEnvelope({
      envelopeVersion: ENVELOPE_VERSION,
      current: serializeDocument(result.document),
      // Exactly the prior bytes, and only ever one of them.
      backup: priorRaw ?? snapshot.snapshot.backup,
    });
    if (!written.ok)
      return {
        status: "write-failed",
        message:
          "This browser refused to save the replacement, so the saved records were left exactly as they were. Storage may be full or blocked.",
      };
    return { status: "ok", document: result.document };
  }

  clear(): ClearOutcome {
    if (!this.storage)
      return {
        status: "unavailable",
        message: "This browser is not allowing local storage, so nothing was removed.",
      };
    const snapshot = this.readSnapshot();
    if (snapshot.status !== "ok")
      return { status: "unavailable", message: `${snapshot.message} Nothing was removed.` };
    const written = this.writeEnvelope({
      envelopeVersion: ENVELOPE_VERSION,
      current: null,
      backup: snapshot.snapshot.current ?? snapshot.snapshot.backup,
    });
    if (!written.ok)
      return { status: "write-failed", message: "This browser refused to remove the saved data." };
    return { status: "ok" };
  }
}

/** Creates a repository already carrying the deterministic synthetic seed. */
export function seededInMemoryRepository(): InMemoryLearningLoopRepository {
  return new InMemoryLearningLoopRepository(createSeedDocument());
}
