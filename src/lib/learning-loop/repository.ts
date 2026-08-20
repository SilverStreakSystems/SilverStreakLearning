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
/** Exactly one bounded recovery snapshot. Backups never accumulate. */
export const LEARNING_LOOP_BACKUP_KEY = "ssls.product-alpha-001.learning-loop.backup.v1";
/** Refuse oversized imports before the file is ever read into memory. */
export const MAX_IMPORT_BYTES = 1024 * 1024;

export type ReadOutcome =
  | { status: "empty" }
  | { status: "ready"; document: LearningLoopDocument }
  | { status: "corrupt"; message: string; raw: string | null }
  | { status: "unsupported-version"; message: string; raw: string | null }
  | { status: "unavailable"; message: string };

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

export type ClearOutcome = { status: "ok" } | { status: "write-failed"; message: string };

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
  clear(): ClearOutcome;
  /** The raw stored text, for recovery export when the document will not parse. */
  readRaw(): string | null;
  /** The single recovery snapshot taken before the last destructive replace. */
  readBackup(): string | null;
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

  readRaw(): string | null {
    return this.document ? serializeDocument(this.document) : null;
  }

  readBackup(): string | null {
    return this.backup;
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
    if (this.document) this.backup = serializeDocument(this.document);
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

  readRaw(): string | null {
    try {
      return this.storage?.getItem(LEARNING_LOOP_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  readBackup(): string | null {
    try {
      return this.storage?.getItem(LEARNING_LOOP_BACKUP_KEY) ?? null;
    } catch {
      return null;
    }
  }

  read(): ReadOutcome {
    if (!this.storage)
      return {
        status: "unavailable",
        message: "This browser is not allowing local storage.",
      };
    const raw = this.readRaw();
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

  commit(expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome {
    if (!this.storage)
      return {
        status: "unavailable",
        message: "This browser is not allowing local storage, so nothing was saved.",
      };

    // Re-read the persisted revision immediately before writing.
    const current = this.read();
    if (current.status === "corrupt" || current.status === "unsupported-version")
      return {
        status: "conflict",
        message: `${current.message} Nothing was written.`,
        currentRevision: null,
      };
    const currentRevision = current.status === "ready" ? current.document.revision : null;
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

    const priorRaw = current.status === "ready" ? this.readRaw() : null;
    try {
      if (priorRaw !== null) this.storage.setItem(LEARNING_LOOP_BACKUP_KEY, priorRaw);
      this.storage.setItem(LEARNING_LOOP_STORAGE_KEY, serializeDocument(result.document));
    } catch {
      return {
        status: "write-failed",
        message:
          "This browser refused to save the change, so nothing was written. Storage may be full or blocked.",
      };
    }
    return { status: "ok", document: result.document };
  }

  clear(): ClearOutcome {
    if (!this.storage) return { status: "ok" };
    try {
      const raw = this.readRaw();
      if (raw !== null) this.storage.setItem(LEARNING_LOOP_BACKUP_KEY, raw);
      this.storage.removeItem(LEARNING_LOOP_STORAGE_KEY);
      return { status: "ok" };
    } catch {
      return { status: "write-failed", message: "This browser refused to remove the saved data." };
    }
  }
}

/** Creates a repository already carrying the deterministic synthetic seed. */
export function seededInMemoryRepository(): InMemoryLearningLoopRepository {
  return new InMemoryLearningLoopRepository(createSeedDocument());
}
