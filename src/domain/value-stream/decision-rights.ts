/**
 * Decision rights.
 *
 * Shared accountability is not accountability. Every decision point names one
 * decision authority; every other participant holds a lesser, explicit right.
 */
import type { EnterpriseFunctionId } from "./functions";

export const DECISION_RIGHTS = [
  "recommend",
  "input",
  "decide",
  "approve",
  "execute",
  "validate",
  "veto-stop",
] as const;

export type DecisionRight = (typeof DECISION_RIGHTS)[number];

export interface DecisionRightMeta {
  id: DecisionRight;
  label: string;
  meaning: string;
  /** What holding this right does not entitle the holder to do. */
  doesNotGrant: string;
}

export const DECISION_RIGHT_META: Record<DecisionRight, DecisionRightMeta> = {
  recommend: {
    id: "recommend",
    label: "Recommend",
    meaning: "Propose a course of action with reasoning and evidence.",
    doesNotGrant: "Does not decide, and does not obligate the decision authority.",
  },
  input: {
    id: "input",
    label: "Input",
    meaning: "Must be consulted before the decision is taken.",
    doesNotGrant: "Does not confer a veto, and silence is not consent.",
  },
  decide: {
    id: "decide",
    label: "Decide",
    meaning: "Chooses the outcome and owns the rationale on the record.",
    doesNotGrant: "Does not confer approval of downstream release or claim.",
  },
  approve: {
    id: "approve",
    label: "Approve",
    meaning: "Confirms a decision or deliverable may proceed under a named rule.",
    doesNotGrant: "Does not confer validation that the thing actually works.",
  },
  execute: {
    id: "execute",
    label: "Execute",
    meaning: "Carries out the authorized work.",
    doesNotGrant: "Does not confer authority to change scope or requirement.",
  },
  validate: {
    id: "validate",
    label: "Validate",
    meaning: "Determines, independently of the builder, whether the requirement is met.",
    doesNotGrant: "Does not confer release authority or claim authority.",
  },
  "veto-stop": {
    id: "veto-stop",
    label: "Veto or stop",
    meaning: "May halt the flow on a named safety, legal, privacy, accessibility, or evidence ground.",
    doesNotGrant: "Does not confer authority to redesign the work being stopped.",
  },
};

export interface DecisionRightAssignment {
  functionId: EnterpriseFunctionId;
  right: DecisionRight;
  /** Why this function holds this right at this point. */
  basis: string;
}

export interface DecisionPoint {
  decisionPointId: string;
  stageId: string;
  question: string;
  /** Exactly one assignment may hold `decide`. Enforced by validation and by test. */
  assignments: DecisionRightAssignment[];
  reversibility: "reversible" | "costly-to-reverse" | "irreversible";
  revisitTrigger: string;
  /** What must be recorded when the decision is taken. */
  requiredRecord: string[];
}

export type DecisionPointViolationKind =
  | "no-decision-authority"
  | "multiple-decision-authorities"
  | "missing-revisit-trigger"
  | "missing-required-record";

export interface DecisionPointViolation {
  decisionPointId: string;
  kind: DecisionPointViolationKind;
  detail: string;
}

export function validateDecisionPoints(points: DecisionPoint[]): DecisionPointViolation[] {
  const violations: DecisionPointViolation[] = [];
  for (const point of points) {
    const deciders = point.assignments.filter((a) => a.right === "decide");
    if (deciders.length === 0) {
      violations.push({
        decisionPointId: point.decisionPointId,
        kind: "no-decision-authority",
        detail: "No function holds the decide right, so accountability is ambiguous.",
      });
    }
    if (deciders.length > 1) {
      violations.push({
        decisionPointId: point.decisionPointId,
        kind: "multiple-decision-authorities",
        detail: `${deciders.length} functions hold the decide right.`,
      });
    }
    if (point.revisitTrigger.trim() === "") {
      violations.push({
        decisionPointId: point.decisionPointId,
        kind: "missing-revisit-trigger",
        detail: "A decision with no revisit trigger becomes permanent by accident.",
      });
    }
    if (point.requiredRecord.length === 0) {
      violations.push({
        decisionPointId: point.decisionPointId,
        kind: "missing-required-record",
        detail: "A decision with no required record cannot be audited.",
      });
    }
  }
  return violations;
}
