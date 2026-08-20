/**
 * Reads the SSLS touch-target acceptance rule from `data/accessibility/`.
 *
 * The JSON file is the single source of truth. This loader is used by tests and
 * by the documentation generator only; no route imports it, so no filesystem
 * access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { TouchTargetRuleRecord } from "@/domain/touch-target";

const DATA_DIR = join(process.cwd(), "data", "accessibility");

export function loadTouchTargetRule(): TouchTargetRuleRecord {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "touch-target-rule.json"), "utf8"),
  ) as TouchTargetRuleRecord;
}

export function loadTouchTargetRuleSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "TOUCH_TARGET_RULE_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}
