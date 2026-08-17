/**
 * Raw fact, derived status, and human approval.
 *
 * These are three different things and the architecture keeps them apart.
 * A derived value may never overwrite the facts it was computed from, and an
 * approval may never be inferred from completion, inactivity, or a passing test.
 */

export const VALUE_ORIGINS = ["raw-fact", "derived-status", "human-approval"] as const;
export type ValueOrigin = (typeof VALUE_ORIGINS)[number];

export const VALUE_ORIGIN_META: Record<
  ValueOrigin,
  { id: ValueOrigin; label: string; marker: string; meaning: string; editable: string }
> = {
  "raw-fact": {
    id: "raw-fact",
    label: "Raw fact",
    marker: "[FACT]",
    meaning: "Directly recorded by a source, an environment, a check, or an authorized human.",
    editable: "Corrected only at the source, and the correction is audited.",
  },
  "derived-status": {
    id: "derived-status",
    label: "Derived status",
    marker: "[DERIVED]",
    meaning: "Computed from named source facts by a versioned deterministic rule.",
    editable: "Never edited. Change the facts or the rule, then recompute.",
  },
  "human-approval": {
    id: "human-approval",
    label: "Human approval",
    marker: "[APPROVAL]",
    meaning: "An explicit recorded act by an authorized human.",
    editable: "Never inferred, never defaulted, never back-filled.",
  },
};

/** A deterministic rule. Versioned, because a result is meaningless without one. */
export interface DerivationRule {
  ruleId: string;
  name: string;
  version: string;
  /** Plain-language statement of what the rule computes. */
  statement: string;
  inputFactTypes: string[];
  /** Whether a human must review the result before it may be acted on. */
  humanReviewRequired: boolean;
  reviewRationale: string;
  deterministic: true;
}

export interface DerivedValue {
  derivedValueId: string;
  subjectObjectId: string;
  ruleId: string;
  ruleVersion: string;
  /** Identifiers of the raw facts used. Never a summary of them. */
  sourceFactIds: string[];
  result: string;
  /** Why the rule produced this result, readable without reading the rule. */
  explanation: string;
  computedAt: string;
  humanReviewRequired: boolean;
  humanReviewedBy: string | null;
  humanReviewedAt: string | null;
  synthetic: boolean;
}

export const DERIVATION_RULES_OF_USE: { id: string; rule: string }[] = [
  { id: "DRV-01", rule: "A derived value always names its rule, its rule version, and its source facts." },
  { id: "DRV-02", rule: "A derived value never writes back over a source fact." },
  { id: "DRV-03", rule: "A derived value carries an explanation a human can read without the rule." },
  { id: "DRV-04", rule: "Where human review is required, an unreviewed derived value may not be acted on." },
  { id: "DRV-05", rule: "Approval is never derived. There is no rule that produces an approval." },
  { id: "DRV-06", rule: "Recomputing under a new rule version produces a new derived value, not an edit." },
];
