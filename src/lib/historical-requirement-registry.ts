/**
 * Reads the WP-007 cycle 2 canonical requirement-candidate data from
 * `data/historical/`.
 *
 * The JSON file is the single source of truth. This loader is used by tests and
 * by the documentation generator only; no route imports it, so no filesystem
 * access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HistoricalRequirementRecord } from "@/domain/historical-requirement";

const DATA_DIR = join(process.cwd(), "data", "historical");

export interface HistoricalRequirementFile {
  schema_version: string;
  generated_on: string;
  extraction_boundary: string;
  source_selection_rationale: string;
  records: HistoricalRequirementRecord[];
}

export function loadHistoricalRequirementFile(): HistoricalRequirementFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "historical-requirements.json"), "utf8"),
  ) as HistoricalRequirementFile;
}

export function loadHistoricalRequirements(): HistoricalRequirementRecord[] {
  return loadHistoricalRequirementFile().records;
}

export function loadHistoricalRequirementSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "HISTORICAL_REQUIREMENT_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}
