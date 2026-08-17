/**
 * Value stream stage model.
 *
 * A stage is a bounded unit of governed work with its own entry and exit
 * criteria. Sequence position is not authority: a stage never advances merely
 * because the preceding stage was marked complete.
 */
import type { SharedObjectTypeId } from "../shared-object/object-types";
import type { WorkType } from "../shared-object/work";
import type { EnterpriseCapabilityId } from "./ids";
import type { EnterpriseFunctionId } from "./functions";
import type { DecisionPoint } from "./decision-rights";

export interface StageEvidenceRequirement {
  /** The proposition that must be proved before the stage may exit. */
  proposition: string;
  evidenceType: string;
  /** Version or environment the evidence must be bound to. */
  versionBinding: string;
  reviewer: EnterpriseFunctionId;
  reuseLimit: string;
  revalidation: string;
  /** What the absence of this evidence blocks downstream. */
  effectIfMissing: string;
}

export interface ValueStreamStage {
  stageId: string;
  valueStreamId: string;
  sequence: number;
  name: string;
  purpose: string;
  /** Function accountable for the stage. Candidate only; nothing is staffed. */
  stageOwner: EnterpriseFunctionId;
  participatingCapabilities: EnterpriseCapabilityId[];
  participatingFunctions: EnterpriseFunctionId[];
  /** The capacities a person must be acting in to work this stage. */
  allowedActingCapacities: string[];
  inputObjects: SharedObjectTypeId[];
  /** Context package purpose, when the stage needs a bounded contextual view. */
  requiredContext: string | null;
  entryCriteria: string[];
  workTypes: WorkType[];
  requiredDeliverables: string[];
  decisionPoints: DecisionPoint[];
  approvals: string[];
  validation: string | null;
  evidence: StageEvidenceRequirement[];
  /** The stage that receives the output, or null when the stream ends here. */
  handoffRecipientStageId: string | null;
  exitCriteria: string[];
  refusalStates: string[];
  escalation: string;
  /** How long the stage may sit waiting before it must be escalated. */
  maximumWaitingState: string | null;
  outputObjects: SharedObjectTypeId[];
  auditRequirement: string;
}

export type StageViolationKind =
  | "missing-purpose"
  | "missing-entry-criteria"
  | "missing-exit-criteria"
  | "missing-input-or-output"
  | "sequence-used-as-authority"
  | "missing-audit-requirement";

export interface StageViolation {
  stageId: string;
  kind: StageViolationKind;
  detail: string;
}

/** Phrases that would make advancement depend on task status rather than criteria. */
const SEQUENCE_AS_AUTHORITY = [
  "previous stage complete",
  "prior task complete",
  "preceding stage done",
  "task marked complete",
];

export function validateStages(stages: ValueStreamStage[]): StageViolation[] {
  const violations: StageViolation[] = [];
  for (const stage of stages) {
    if (stage.purpose.trim() === "") {
      violations.push({ stageId: stage.stageId, kind: "missing-purpose", detail: "Stage has no purpose." });
    }
    if (stage.entryCriteria.length === 0) {
      violations.push({
        stageId: stage.stageId,
        kind: "missing-entry-criteria",
        detail: "Stage can be entered without any stated condition.",
      });
    }
    if (stage.exitCriteria.length === 0) {
      violations.push({
        stageId: stage.stageId,
        kind: "missing-exit-criteria",
        detail: "Stage can be exited without any stated condition.",
      });
    }
    if (stage.inputObjects.length === 0 || stage.outputObjects.length === 0) {
      violations.push({
        stageId: stage.stageId,
        kind: "missing-input-or-output",
        detail: "Stage does not declare both what it consumes and what it produces.",
      });
    }
    const onlyCriterion = stage.entryCriteria.length === 1 ? stage.entryCriteria[0]!.toLowerCase() : "";
    if (SEQUENCE_AS_AUTHORITY.some((phrase) => onlyCriterion.includes(phrase))) {
      violations.push({
        stageId: stage.stageId,
        kind: "sequence-used-as-authority",
        detail: "Completion of the previous stage is the only entry criterion.",
      });
    }
    if (stage.auditRequirement.trim() === "") {
      violations.push({
        stageId: stage.stageId,
        kind: "missing-audit-requirement",
        detail: "Stage records no provenance requirement.",
      });
    }
  }
  return violations;
}
