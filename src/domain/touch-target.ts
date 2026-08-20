/**
 * Shape and structural invariants of the SSLS touch-target acceptance rule.
 *
 * The record itself lives in `data/accessibility/touch-target-rule.json`, which
 * is the single source of truth. This module defines the type and the pure
 * invariant checks; it reads no file and states no conformance.
 */

export type TouchTargetExceptionType =
  "SPACING" | "EQUIVALENT-CONTROL" | "INLINE" | "USER-AGENT-CONTROL" | "ESSENTIAL";

export const TOUCH_TARGET_EXCEPTION_TYPES: readonly TouchTargetExceptionType[] = [
  "SPACING",
  "EQUIVALENT-CONTROL",
  "INLINE",
  "USER-AGENT-CONTROL",
  "ESSENTIAL",
] as const;

export type TouchTargetClassification =
  "PASS-44-DEFAULT" | "PASS-24-FLOOR" | "PASS-EXCEPTION" | "FAIL" | "NOT-APPLICABLE";

export const TOUCH_TARGET_CLASSIFICATIONS: readonly TouchTargetClassification[] = [
  "PASS-44-DEFAULT",
  "PASS-24-FLOOR",
  "PASS-EXCEPTION",
  "FAIL",
  "NOT-APPLICABLE",
] as const;

export interface TouchTargetException {
  exception_type: TouchTargetExceptionType;
  label: string;
  condition: string;
  determination: "MECHANICAL" | "MANUAL-REVIEW";
  required_record: string[];
}

export interface TouchTargetDimensionRule {
  obligation: "SHOULD" | "MUST";
  width_css_px: number;
  height_css_px: number;
  applies_to: string;
  statement: string;
}

export interface TouchTargetRuleRecord {
  schema_version: string;
  rule_id: string;
  rule_version: string;
  title: string;
  authority: {
    authority_class: string;
    authority_statement: string;
    scope: string;
    exclusions: string[];
  };
  lifecycle_state: "DEFINED-NOT-VERIFIED";
  controlling_decision: string;
  default_target: TouchTargetDimensionRule;
  measurable_floor: TouchTargetDimensionRule;
  exceptions: TouchTargetException[];
  compact_target_departure: {
    lower_bound_css_px: number;
    upper_bound_css_px: number;
    acceptance_criteria: string[];
    may_authorize_below_floor: boolean;
    statement: string;
  };
  below_floor_target: {
    threshold_css_px: number;
    only_route: string;
    compact_rationale_accepted: boolean;
    statement: string;
  };
  precedence: string[];
  verification: {
    method: string;
    execution_state: "NOT-RUN";
    viewports_css_px: number[];
    classifications: TouchTargetClassification[];
    record_fields: {
      field: string;
      requirement: "REQUIRED" | "CONDITIONAL";
      description: string;
    }[];
    spacing_check: {
      circle_diameter_css_px: number;
      centering: string;
      pass_condition: string;
      statement: string;
    };
    manual_review_required_for: TouchTargetExceptionType[];
    boundary: string;
  };
  sources: { source_id: string; title: string; url: string; role: "INPUT-ONLY" }[];
  non_claims: string[];
  history: {
    rule_version: string;
    recorded_on: string;
    decision: string;
    change: string;
    boundary: string;
  }[];
}

/** Phrases the rule record may never contain. Enforced by test. */
export const PROHIBITED_TOUCH_TARGET_CLAIMS = [
  "wcag conformant",
  "wcag compliant",
  "conformance verified",
  "audit passed",
  "accessible product",
  "production ready",
] as const;

/**
 * Structural invariants only. Returns violation strings; an empty array means
 * the record is internally consistent. It asserts nothing about the interface.
 */
export function validateTouchTargetRule(record: TouchTargetRuleRecord): string[] {
  const problems: string[] = [];

  if (record.rule_id !== "TTR-001") problems.push("unexpected rule id");
  if (!/^\d+\.\d+\.\d+$/.test(record.rule_version)) problems.push("malformed rule version");
  if (record.lifecycle_state !== "DEFINED-NOT-VERIFIED")
    problems.push("rule may not leave the defined-not-verified lifecycle state");
  if (!/^DEC-\d{3}$/.test(record.controlling_decision))
    problems.push("controlling decision is not a decision identifier");

  if (record.default_target.obligation !== "SHOULD")
    problems.push("the 44 by 44 default must remain a SHOULD");
  if (record.default_target.width_css_px !== 44 || record.default_target.height_css_px !== 44)
    problems.push("default target is not 44 by 44 CSS pixels");
  if (record.measurable_floor.obligation !== "MUST")
    problems.push("the 24 by 24 floor must remain a MUST");
  if (record.measurable_floor.width_css_px !== 24 || record.measurable_floor.height_css_px !== 24)
    problems.push("measurable floor is not 24 by 24 CSS pixels");
  if (record.default_target.width_css_px === record.measurable_floor.width_css_px)
    problems.push("the default and the floor have been conflated");

  const types = record.exceptions.map((entry) => entry.exception_type);
  for (const expected of TOUCH_TARGET_EXCEPTION_TYPES) {
    const count = types.filter((type) => type === expected).length;
    if (count !== 1) problems.push(`exception ${expected} is enumerated ${count} times, not once`);
  }
  if (types.length !== TOUCH_TARGET_EXCEPTION_TYPES.length)
    problems.push("the exception set is not exactly the five documented types");

  const departure = record.compact_target_departure;
  if (departure.lower_bound_css_px !== 24 || departure.upper_bound_css_px !== 43)
    problems.push("compact-target departure band is not 24 to 43 CSS pixels");
  if (departure.may_authorize_below_floor)
    problems.push("a compact-context rationale may never authorize a below-floor target");
  if (record.below_floor_target.compact_rationale_accepted)
    problems.push("below-floor targets may not pass on a compact-context rationale");
  if (record.below_floor_target.only_route !== "DOCUMENTED-EXCEPTION")
    problems.push("below-floor targets must route through a documented exception only");
  if (record.below_floor_target.threshold_css_px !== record.measurable_floor.width_css_px)
    problems.push("below-floor threshold does not match the declared floor");

  const verification = record.verification;
  if (verification.execution_state !== "NOT-RUN")
    problems.push("defining the protocol may not record it as executed");
  const viewports = [...verification.viewports_css_px].sort((a, b) => a - b);
  if (viewports.join(",") !== "320,768,1366")
    problems.push("declared viewports are not 320, 768, 1366");
  for (const classification of TOUCH_TARGET_CLASSIFICATIONS) {
    if (verification.classifications.filter((entry) => entry === classification).length !== 1)
      problems.push(`classification ${classification} is not enumerated exactly once`);
  }
  if (verification.spacing_check.circle_diameter_css_px !== 24)
    problems.push("the spacing check circle is not 24 CSS pixels in diameter");
  for (const type of verification.manual_review_required_for) {
    const exception = record.exceptions.find((entry) => entry.exception_type === type);
    if (!exception) problems.push(`manual-review exception ${type} is not enumerated`);
    else if (exception.determination !== "MANUAL-REVIEW")
      problems.push(`exception ${type} is listed for manual review but marked mechanical`);
  }

  if (record.sources.length < 2) problems.push("fewer than two source references");
  for (const source of record.sources) {
    if (!source.url.startsWith("https://www.w3.org/")) problems.push("source is not a W3C URL");
    if (source.role !== "INPUT-ONLY") problems.push("a source is treated as more than an input");
  }
  if (record.non_claims.length < 5) problems.push("the non-claim set is too thin");
  if (record.history.length < 1) problems.push("no change history recorded");

  const text = JSON.stringify(record).toLowerCase();
  for (const phrase of PROHIBITED_TOUCH_TARGET_CLAIMS) {
    if (text.includes(phrase)) problems.push(`prohibited claim present: ${phrase}`);
  }

  return problems;
}

/**
 * Pure classification helper used by tests to prove the rule cannot be bent.
 * It classifies a declared measurement; it measures nothing itself.
 */
export function classifyDeclaredTarget(input: {
  widthCssPx: number;
  heightCssPx: number;
  standaloneAuthorControlled: boolean;
  compactContextRationale: boolean;
  documentedException: TouchTargetExceptionType | null;
}): TouchTargetClassification {
  const smallest = Math.min(input.widthCssPx, input.heightCssPx);
  if (smallest >= 44) return "PASS-44-DEFAULT";
  if (smallest >= 24) {
    if (!input.standaloneAuthorControlled) return "PASS-24-FLOOR";
    return input.compactContextRationale ? "PASS-24-FLOOR" : "FAIL";
  }
  return input.documentedException ? "PASS-EXCEPTION" : "FAIL";
}
