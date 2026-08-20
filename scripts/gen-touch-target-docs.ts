/**
 * WP-007 Cycle 7 documentation projection.
 *
 * The canonical data lives in `data/accessibility/touch-target-rule.json`.
 * This document is generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadTouchTargetRule } from "../src/lib/touch-target-registry";

const OUT_DIR = join(process.cwd(), "docs", "accessibility");

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function main() {
  const rule = loadTouchTargetRule();

  const body = [
    `# ${rule.title} — ${rule.rule_id} v${rule.rule_version}`,
    "",
    "> Generated from `data/accessibility/touch-target-rule.json` by",
    "> `scripts/gen-touch-target-docs.ts`. Do not edit by hand.",
    "",
    `Authority: ${rule.authority.authority_class}. Controlling decision: ${rule.controlling_decision}.`,
    `Lifecycle state: ${rule.lifecycle_state}. Verification execution state: ${rule.verification.execution_state}.`,
    "",
    "## Scope and exclusions",
    "",
    rule.authority.authority_statement,
    "",
    rule.authority.scope,
    "",
    ...rule.authority.exclusions.map((entry) => `- ${entry}`),
    "",
    "## Acceptance rule",
    "",
    "| Element | Obligation | Size | Applies to |",
    "| --- | --- | --- | --- |",
    `| SSLS default | ${rule.default_target.obligation} | ${rule.default_target.width_css_px} by ${rule.default_target.height_css_px} CSS px | ${esc(rule.default_target.applies_to)} |`,
    `| Measurable floor | ${rule.measurable_floor.obligation} | ${rule.measurable_floor.width_css_px} by ${rule.measurable_floor.height_css_px} CSS px | ${esc(rule.measurable_floor.applies_to)} |`,
    "",
    rule.default_target.statement,
    "",
    rule.measurable_floor.statement,
    "",
    "### Compact-target departure",
    "",
    rule.compact_target_departure.statement,
    "",
    ...rule.compact_target_departure.acceptance_criteria.map((entry) => `- ${entry}`),
    "",
    "### Below-floor targets",
    "",
    rule.below_floor_target.statement,
    "",
    "### Precedence",
    "",
    ...rule.precedence.map((entry) => `- ${entry}`),
    "",
    "## Documented exceptions",
    "",
    "| Type | Condition | Determination | Record required |",
    "| --- | --- | --- | --- |",
    ...rule.exceptions.map(
      (entry) =>
        `| ${entry.exception_type} | ${esc(entry.condition)} | ${entry.determination} | ${esc(entry.required_record.join("; "))} |`,
    ),
    "",
    "## Verification protocol — defined, not run",
    "",
    rule.verification.method,
    "",
    `Viewport widths: ${rule.verification.viewports_css_px.join(", ")} CSS pixels.`,
    "",
    `Classifications: ${rule.verification.classifications.join(", ")}.`,
    "",
    "| Field | Requirement | Description |",
    "| --- | --- | --- |",
    ...rule.verification.record_fields.map(
      (entry) => `| ${entry.field} | ${entry.requirement} | ${esc(entry.description)} |`,
    ),
    "",
    "### Spacing check",
    "",
    rule.verification.spacing_check.centering,
    "",
    rule.verification.spacing_check.pass_condition,
    "",
    rule.verification.spacing_check.statement,
    "",
    `Manual review is required for: ${rule.verification.manual_review_required_for.join(", ")}.`,
    "",
    rule.verification.boundary,
    "",
    "## Sources, treated as inputs only",
    "",
    "| Source | Title | URL | Role |",
    "| --- | --- | --- | --- |",
    ...rule.sources.map(
      (entry) => `| ${entry.source_id} | ${esc(entry.title)} | ${entry.url} | ${entry.role} |`,
    ),
    "",
    "## Non-claims",
    "",
    ...rule.non_claims.map((entry) => `- ${entry}`),
    "",
    "## History",
    "",
    "| Version | Recorded | Decision | Change | Boundary |",
    "| --- | --- | --- | --- | --- |",
    ...rule.history.map(
      (entry) =>
        `| ${entry.rule_version} | ${entry.recorded_on} | ${entry.decision} | ${esc(entry.change)} | ${esc(entry.boundary)} |`,
    ),
    "",
  ].join("\n");

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "TOUCH_TARGET_ACCEPTANCE.md"), body, "utf8");
  console.log(
    `WP-007: projected ${rule.rule_id} v${rule.rule_version} with ${rule.exceptions.length} exceptions into 1 document.`,
  );
}

main();
