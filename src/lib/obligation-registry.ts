/**
 * Reads the WP-038 canonical governance data from `data/governance/`.
 *
 * The JSON files are the single source of truth. This loader is used by tests
 * and by the documentation generator only; no route imports it, so no
 * filesystem access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  DataTriggerRecord,
  ExternalAuthorityRecord,
  ObligationConflictRecord,
  ObligationRecord,
  StaleReferenceRecord,
} from "@/domain/obligation";

const DATA_DIR = join(process.cwd(), "data", "governance");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")) as T;
}

export function loadAuthorities(): ExternalAuthorityRecord[] {
  return readJson<{ records: ExternalAuthorityRecord[] }>("external-authorities.json").records;
}

export function loadObligations(): ObligationRecord[] {
  return readJson<{ records: ObligationRecord[] }>("obligations.json").records;
}

export function loadObligationContext(): {
  conflicts: ObligationConflictRecord[];
  stale_references: StaleReferenceRecord[];
  data_triggers: DataTriggerRecord[];
} {
  return readJson("obligation-context.json");
}
