/**
 * Canonical serialization and the schema-version migration dispatcher.
 *
 * Export is byte-stable: object keys are emitted in sorted order and every
 * record array is sorted by its own identifier. Two exports of an unchanged
 * document are byte-identical, so a diff means the data changed. There is
 * deliberately no `exportedAt` field: a changing timestamp would defeat that.
 */
import {
  LEARNING_LOOP_SCHEMA_VERSION,
  parseDocumentShape,
  type LearningLoopDocument,
  type SchemaProblem,
} from "./records";
import { validateDocumentInvariants, type InvariantProblem } from "./invariants";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) sorted[key] = sortValue(source[key]);
    return sorted;
  }
  return value;
}

function by<T>(pick: (row: T) => string) {
  return (a: T, b: T) => pick(a).localeCompare(pick(b));
}

/** Deterministic ordering of records. Content, never presentation. */
export function canonicalizeDocument(document: LearningLoopDocument): LearningLoopDocument {
  return {
    ...document,
    learners: [...document.learners].sort(by((row) => row.learnerId)),
    goals: [...document.goals].sort(by((row) => row.goalId)),
    observations: [...document.observations].sort(by((row) => row.observationId)),
    supportActions: [...document.supportActions].sort(by((row) => row.supportActionId)),
    goalReviews: [...document.goalReviews].sort(by((row) => row.goalReviewId)),
  };
}

export function serializeDocument(document: LearningLoopDocument): string {
  return `${JSON.stringify(sortValue(canonicalizeDocument(document)), null, 2)}\n`;
}

export interface DocumentLoadFailure {
  ok: false;
  reason: "not-json" | "unsupported-version" | "schema" | "invariant";
  message: string;
  schemaProblems?: SchemaProblem[];
  invariantProblems?: InvariantProblem[];
}

export type DocumentLoadResult = { ok: true; document: LearningLoopDocument } | DocumentLoadFailure;

/**
 * Pure migration dispatcher. Version 1 is the only schema this build has ever
 * written, so there is no version-zero migration to invent. A newer version is
 * refused rather than guessed at, and the caller must not erase it.
 */
export function migrateDocument(value: unknown): DocumentLoadResult {
  if (!value || typeof value !== "object")
    return { ok: false, reason: "schema", message: "The saved data is not an object." };

  const version = (value as { schemaVersion?: unknown }).schemaVersion;
  if (typeof version !== "number" || !Number.isInteger(version))
    return { ok: false, reason: "schema", message: "The saved data declares no schema version." };
  if (version > LEARNING_LOOP_SCHEMA_VERSION)
    return {
      ok: false,
      reason: "unsupported-version",
      message: `This data was written by a newer version of the preview (schema ${version}). It has been left untouched.`,
    };
  if (version < LEARNING_LOOP_SCHEMA_VERSION)
    return {
      ok: false,
      reason: "unsupported-version",
      message: `Schema version ${version} predates this preview and has no migration path.`,
    };

  const shape = parseDocumentShape(value);
  if (!shape.ok)
    return {
      ok: false,
      reason: "schema",
      message: "The data does not match the expected shape.",
      schemaProblems: shape.problems,
    };

  const invariantProblems = validateDocumentInvariants(shape.document);
  if (invariantProblems.length > 0)
    return {
      ok: false,
      reason: "invariant",
      message: "The data is internally inconsistent.",
      invariantProblems,
    };

  return { ok: true, document: canonicalizeDocument(shape.document) };
}

export function parseDocumentText(text: string): DocumentLoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: "not-json", message: "That file is not valid JSON." };
  }
  return migrateDocument(parsed);
}

export function describeLoadFailure(failure: DocumentLoadFailure): string[] {
  const details = [
    ...(failure.schemaProblems ?? []).map(
      (problem) => `${problem.path || "document"}: ${problem.message}`,
    ),
    ...(failure.invariantProblems ?? []).map((problem) => problem.message),
  ];
  return details.slice(0, 8);
}

/**
 * The same decoder reads stored bytes and chosen files, but its messages are
 * written about the saved data. Reported unchanged on the import path they
 * misattribute the fault to the records already in this browser, which is the
 * opposite of what happened: a refused import changes nothing. This restates
 * the failure with the file as its subject and keeps the decoder's own wording
 * as the first detail line, so nothing is lost.
 */
export function describeImportFailure(failure: DocumentLoadFailure): {
  message: string;
  details: string[];
} {
  const subject: Record<DocumentLoadFailure["reason"], string> = {
    "not-json": "That file is not valid JSON, so it was not imported.",
    "unsupported-version":
      "That file was written for a different schema version of this preview, so it was not imported.",
    schema: "That file does not match the shape this preview can read, so it was not imported.",
    invariant:
      "That file breaks a rule this preview enforces on every record, so it was not imported.",
  };
  return {
    message: `${subject[failure.reason]} The records saved in this browser were not changed.`,
    details: [failure.message, ...describeLoadFailure(failure)].slice(0, 8),
  };
}
