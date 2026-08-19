/**
 * Reads the WP-007 cycle 4 cross-source restatement index from
 * `data/historical/`.
 *
 * The JSON file is the single source of truth. This loader is used by tests and
 * by the documentation generator only; no route imports it, so no filesystem
 * access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { RestatementRelation, UnmatchedRelatedCandidate } from "@/domain/restatement";

const DATA_DIR = join(process.cwd(), "data", "historical");

export interface RestatementIndexFile {
  schema_version: string;
  generated_on: string;
  index_boundary: string;
  relationship_vocabulary_note: string;
  relations: RestatementRelation[];
  unmatched_related_candidates: UnmatchedRelatedCandidate[];
}

export function loadRestatementIndexFile(): RestatementIndexFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "restatement-index.json"), "utf8"),
  ) as RestatementIndexFile;
}

export function loadRestatementRelations(): RestatementRelation[] {
  return loadRestatementIndexFile().relations;
}

export function loadRestatementIndexSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "RESTATEMENT_INDEX_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}
