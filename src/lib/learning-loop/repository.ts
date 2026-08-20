/**
 * LearningLoopRepository — the only way product data is read or written.
 *
 * Two adapters implement it: an in-memory one used by tests and by the server
 * render, and a browser-local one used in the client. Nothing above this
 * boundary knows which is in play, so the storage medium can change without
 * touching the domain or the interface.
 *
 * Every write validates shape AND cross-record invariants before it is
 * accepted. A rejected write leaves the stored document untouched.
 */
import {
  canonicalizeDocument,
  createSeedDocument,
  migrateDocument,
  serializeDocument,
  validateDocumentInvariants,
  type InvariantProblem,
  type LearningLoopDocument,
} from "@/domain/learning-loop";

export type WriteResult =
  | { ok: true; document: LearningLoopDocument }
  | { ok: false; message: string; problems: InvariantProblem[] };

export interface LearningLoopRepository {
  /** Reads the stored document, or null when nothing is stored yet. */
  read(): LearningLoopDocument | null;
  /** Validates, stamps a new revision, and stores. Rejects invalid documents. */
  write(next: LearningLoopDocument, at: string): WriteResult;
  /** Removes stored data entirely. */
  clear(): void;
  /** True when the underlying medium is not available in this environment. */
  readonly available: boolean;
  readonly kind: "browser-local" | "in-memory";
}

export function stampRevision(document: LearningLoopDocument, at: string): LearningLoopDocument {
  return canonicalizeDocument({ ...document, revision: document.revision + 1, lastUpdatedAt: at });
}

function validate(document: LearningLoopDocument): WriteResult {
  const problems = validateDocumentInvariants(document);
  if (problems.length > 0)
    return {
      ok: false,
      message: "That change was not saved because it would leave the records inconsistent.",
      problems,
    };
  return { ok: true, document };
}

export class InMemoryLearningLoopRepository implements LearningLoopRepository {
  readonly kind = "in-memory" as const;
  readonly available = true;
  private document: LearningLoopDocument | null;

  constructor(initial: LearningLoopDocument | null = null) {
    this.document = initial ? canonicalizeDocument(initial) : null;
  }

  read(): LearningLoopDocument | null {
    return this.document;
  }

  write(next: LearningLoopDocument, at: string): WriteResult {
    const stamped = stampRevision(next, at);
    const result = validate(stamped);
    if (!result.ok) return result;
    this.document = result.document;
    return result;
  }

  clear(): void {
    this.document = null;
  }
}

/** Namespaced so nothing else in the origin can collide with it. */
export const LEARNING_LOOP_STORAGE_KEY = "ssls.product-alpha-001.learning-loop.v1";

export class BrowserLearningLoopRepository implements LearningLoopRepository {
  readonly kind = "browser-local" as const;
  readonly available: boolean;
  private readonly storage: Storage | null;
  private lastReadError: string | null = null;

  constructor(storage?: Storage | null) {
    let resolved: Storage | null = storage ?? null;
    if (storage === undefined) {
      try {
        resolved = typeof window === "undefined" ? null : window.localStorage;
      } catch {
        resolved = null;
      }
    }
    this.storage = resolved;
    this.available = resolved !== null;
  }

  /** The reason the last read returned null, when it was not simply empty. */
  get readError(): string | null {
    return this.lastReadError;
  }

  read(): LearningLoopDocument | null {
    this.lastReadError = null;
    if (!this.storage) return null;
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(LEARNING_LOOP_STORAGE_KEY);
    } catch {
      this.lastReadError = "Saved data could not be read from this browser.";
      return null;
    }
    if (raw === null) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      this.lastReadError =
        "The saved data is not readable. It has been left in place rather than overwritten.";
      return null;
    }
    const result = migrateDocument(parsed);
    if (!result.ok) {
      this.lastReadError = `${result.message} The saved data has been left in place rather than overwritten.`;
      return null;
    }
    return result.document;
  }

  write(next: LearningLoopDocument, at: string): WriteResult {
    const stamped = stampRevision(next, at);
    const result = validate(stamped);
    if (!result.ok) return result;
    if (!this.storage)
      return {
        ok: false,
        message: "This browser is not allowing local storage, so nothing was saved.",
        problems: [],
      };
    try {
      this.storage.setItem(LEARNING_LOOP_STORAGE_KEY, serializeDocument(result.document));
    } catch {
      return {
        ok: false,
        message: "This browser refused to save the change. Storage may be full or blocked.",
        problems: [],
      };
    }
    return result;
  }

  clear(): void {
    try {
      this.storage?.removeItem(LEARNING_LOOP_STORAGE_KEY);
    } catch {
      /* nothing stored, nothing to remove */
    }
  }
}

/** Creates a repository already carrying the deterministic synthetic seed. */
export function seededInMemoryRepository(): InMemoryLearningLoopRepository {
  return new InMemoryLearningLoopRepository(createSeedDocument());
}
