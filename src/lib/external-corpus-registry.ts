/**
 * Reads external corpus observation records from `data/external-corpora/`.
 *
 * The JSON files are the single source of truth. This loader is used by tests
 * and by the documentation generator only; no route imports it, so no
 * filesystem access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { ExternalCorpusObservation } from "@/domain/external-corpus";

const DATA_DIR = join(process.cwd(), "data", "external-corpora");

/** File names of the committed observation records, in projection order. */
export const EXTERNAL_CORPUS_FILES = ["ssls-3.0-foundation.json"] as const;

export function loadExternalCorpus(fileName: string): ExternalCorpusObservation {
  return JSON.parse(readFileSync(join(DATA_DIR, fileName), "utf8")) as ExternalCorpusObservation;
}

export function loadExternalCorpora(): ExternalCorpusObservation[] {
  return EXTERNAL_CORPUS_FILES.map((file) => loadExternalCorpus(file));
}

export function loadExternalCorpusSchema(): Record<string, unknown> {
  return JSON.parse(readFileSync(join(DATA_DIR, "EXTERNAL_CORPUS_SCHEMA.json"), "utf8")) as Record<
    string,
    unknown
  >;
}
