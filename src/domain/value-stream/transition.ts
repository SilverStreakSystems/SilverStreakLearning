/**
 * Workflow state transition contract.
 *
 * Current state → preconditions → authorized actor → action → resulting state
 * → side effects → evidence → audit → refusal → escalation → recovery.
 *
 * This is a contract definition. Nothing here has been executed, and no
 * database enforcement exists yet.
 */
import type { EnterpriseFunctionId } from "./functions";
import type { EnterpriseCapabilityId } from "./ids";

export interface StateTransition {
  transitionId: string;
  valueStreamId: string;
  /** Human-readable current state of the governed object. */
  currentState: string;
  preconditions: string[];
  authorizedFunctions: EnterpriseFunctionId[];
  requiredCapabilities: EnterpriseCapabilityId[];
  action: string;
  resultingState: string;
  sideEffects: string[];
  evidenceProduced: string[];
  auditRecord: string;
  /** How the transition fails, and what refusal looks like. */
  failureModes: string[];
  refusalState: string;
  escalation: string;
  recovery: string;
  /** Contract only. Set to true if and when enforcement is actually built. */
  enforced: false;
}

export const CROSS_AXIS_PROHIBITIONS = [
  {
    id: "complete-implies-approved",
    statement: "Work marked complete does not imply approval.",
    reason: "Completion is a workflow state. Approval is a separate authority act.",
  },
  {
    id: "implemented-implies-validated",
    statement: "Implementation complete does not imply validation.",
    reason: "Validation is an independent determination against the requirement.",
  },
  {
    id: "validated-implies-released",
    statement: "Validation does not imply release.",
    reason: "Release requires cross-cutting gate review and release authorization.",
  },
  {
    id: "released-implies-claimable",
    statement: "Release does not imply a claim may be made.",
    reason: "A claim requires evidence linkage and claims review of its exact wording.",
  },
  {
    id: "sequence-implies-authority",
    statement: "Stage order does not imply authority to advance.",
    reason: "Advancement depends on exit criteria and gate disposition, not position.",
  },
  {
    id: "silence-implies-passage",
    statement: "Silence at a gate does not imply passage.",
    reason: "A disposition must be recorded by the gate owner.",
  },
] as const;

export type TransitionViolationKind =
  | "missing-preconditions"
  | "no-authorized-actor"
  | "missing-refusal-state"
  | "missing-audit-record"
  | "claims-enforcement";

export interface TransitionViolation {
  transitionId: string;
  kind: TransitionViolationKind;
  detail: string;
}

export function validateTransitions(transitions: StateTransition[]): TransitionViolation[] {
  const violations: TransitionViolation[] = [];
  for (const transition of transitions) {
    if (transition.preconditions.length === 0) {
      violations.push({
        transitionId: transition.transitionId,
        kind: "missing-preconditions",
        detail: "A transition with no precondition can always fire.",
      });
    }
    if (transition.authorizedFunctions.length === 0) {
      violations.push({
        transitionId: transition.transitionId,
        kind: "no-authorized-actor",
        detail: "No function is authorized to perform this transition.",
      });
    }
    if (transition.refusalState.trim() === "") {
      violations.push({
        transitionId: transition.transitionId,
        kind: "missing-refusal-state",
        detail: "The transition has no representable refusal outcome.",
      });
    }
    if (transition.auditRecord.trim() === "") {
      violations.push({
        transitionId: transition.transitionId,
        kind: "missing-audit-record",
        detail: "The transition would leave no provenance.",
      });
    }
  }
  return violations;
}

/**
 * Would this transition be permitted? Preconditions are supplied by the
 * caller as satisfied statements; nothing is inferred.
 */
export function isTransitionPermitted(
  transition: StateTransition,
  actor: EnterpriseFunctionId,
  satisfiedPreconditions: string[],
): { permitted: boolean; reason: string } {
  if (!transition.authorizedFunctions.includes(actor)) {
    return { permitted: false, reason: "Actor is not authorized for this transition." };
  }
  const unmet = transition.preconditions.filter((p) => !satisfiedPreconditions.includes(p));
  if (unmet.length > 0) {
    return { permitted: false, reason: `Unmet precondition: ${unmet[0]}` };
  }
  return { permitted: true, reason: "Authorized actor and all preconditions satisfied." };
}
