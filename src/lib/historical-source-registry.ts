/**
 * Reads the WP-007 canonical historical-source data from `data/historical/`.
 *
 * The JSON file is the single source of truth. This loader is used by tests and
 * by the documentation generator only; no route imports it, so no filesystem
 * access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HistoricalSourceRecord } from "@/domain/historical-source";

const DATA_DIR = join(process.cwd(), "data", "historical");

export interface HistoricalSourceFile {
  schema_version: string;
  generated_on: string;
  universe_boundary: string;
  records: HistoricalSourceRecord[];
}

export function loadHistoricalSourceFile(): HistoricalSourceFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "historical-sources.json"), "utf8"),
  ) as HistoricalSourceFile;
}

export function loadHistoricalSources(): HistoricalSourceRecord[] {
  return loadHistoricalSourceFile().records;
}

export function loadHistoricalSourceSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "HISTORICAL_SOURCE_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}
