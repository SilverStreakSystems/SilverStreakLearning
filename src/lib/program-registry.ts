/**
 * Filesystem reader for the controlling program registers.
 *
 * Tests and generators use this to read the same bytes the application
 * projection reads, so a contradiction between the register and the projection
 * is mechanically detectable. It records nothing and decides nothing.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { RawCheckpointRegister, RawProgramPolicy } from "@/domain/program-state-derivation";

const DATA_DIR = join(process.cwd(), "data", "program");

export function loadCheckpointRegister(): RawCheckpointRegister {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "checkpoints.json"), "utf8"),
  ) as RawCheckpointRegister;
}

export function loadProgramPolicy(): RawProgramPolicy {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "program-policy.json"), "utf8"),
  ) as RawProgramPolicy;
}
