/**
 * Handoff contract.
 *
 * A handoff is not complete because a message was sent. It is complete when the
 * receiving party has accepted an authorized, complete input they can act on.
 */
import type { SharedObjectTypeId } from "../shared-object/object-types";
import type { EnterpriseFunctionId } from "./functions";

export const HANDOFF_OUTCOMES = ["pending", "accepted", "refused", "returned", "escalated"] as const;
export type HandoffOutcome = (typeof HANDOFF_OUTCOMES)[number];

export interface HandoffContract {
  handoffId: string;
  sourceStageId: string;
  destinationStageId: string;
  sourceOwner: EnterpriseFunctionId;
  receivingOwner: EnterpriseFunctionId;
  objectsTransferred: SharedObjectTypeId[];
  /** The state each transferred object must be in before transfer is legitimate. */
  requiredState: string;
  requiredDeliverables: string[];
  requiredEvidence: string[];
  /** Context package purpose, when the receiver needs a bounded contextual view. */
  contextPackagePurpose: string | null;
  acceptanceCriteria: string[];
  expectedTiming: string;
  /** Receiver acceptance is the only thing that completes a handoff. */
  receiverAccepted: boolean;
  refusalReason: string | null;
  escalation: string;
  auditRequirement: string;
  outcome: HandoffOutcome;
}

export type HandoffViolationKind =
  | "missing-acceptance-criteria"
  | "accepted-without-acceptance-criteria"
  | "complete-without-receiver-acceptance"
  | "refused-without-reason"
  | "missing-escalation";

export interface HandoffViolation {
  handoffId: string;
  kind: HandoffViolationKind;
  detail: string;
}

export function validateHandoffs(handoffs: HandoffContract[]): HandoffViolation[] {
  const violations: HandoffViolation[] = [];
  for (const handoff of handoffs) {
    if (handoff.acceptanceCriteria.length === 0) {
      violations.push({
        handoffId: handoff.handoffId,
        kind: "missing-acceptance-criteria",
        detail: "The receiver has no stated basis for accepting or refusing.",
      });
    }
    if (handoff.outcome === "accepted" && !handoff.receiverAccepted) {
      violations.push({
        handoffId: handoff.handoffId,
        kind: "complete-without-receiver-acceptance",
        detail: "Outcome says accepted but the receiver never accepted.",
      });
    }
    if (handoff.outcome === "refused" && !handoff.refusalReason) {
      violations.push({
        handoffId: handoff.handoffId,
        kind: "refused-without-reason",
        detail: "A refusal without a reason cannot be resolved or appealed.",
      });
    }
    if (handoff.escalation.trim() === "") {
      violations.push({
        handoffId: handoff.handoffId,
        kind: "missing-escalation",
        detail: "No escalation path if the handoff stalls.",
      });
    }
  }
  return violations;
}

/** A handoff counts as delivered only on explicit receiver acceptance. */
export function isHandoffComplete(handoff: HandoffContract): boolean {
  return handoff.outcome === "accepted" && handoff.receiverAccepted;
}
