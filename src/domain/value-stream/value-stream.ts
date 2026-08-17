/**
 * Enterprise Value Stream object model.
 *
 * A value stream is an end-to-end flow of governed work that produces a
 * meaningful outcome. It is not a department, a team, a dashboard, a feature
 * list, or a project plan.
 *
 * Authority is declared, never derived from implementation status.
 */
import type { AuthorityClass } from "../authority";
import type { CapabilityScaleStage } from "../capability-architecture";
import type { SharedObjectTypeId } from "../shared-object/object-types";
import type { EnterpriseCapabilityId, ValueStreamId } from "./ids";
import type { EnterpriseFunctionId } from "./functions";
import type { ValueStreamStage } from "./stage";

/** Whether the stream describes work that may happen now, or target state. */
export const STREAM_OPERATING_STATUS = ["candidate-internal", "gated-future"] as const;
export type StreamOperatingStatus = (typeof STREAM_OPERATING_STATUS)[number];

export const STREAM_OPERATING_STATUS_META: Record<
  StreamOperatingStatus,
  { label: string; marker: string; meaning: string }
> = {
  "candidate-internal": {
    label: "Candidate, internal only",
    marker: "[CANDIDATE]",
    meaning:
      "Modeled for the founder or developer operator working with synthetic data. Not an operating business process.",
  },
  "gated-future": {
    label: "Gated future architecture",
    marker: "[GATED]",
    meaning:
      "Target state only. It cannot be run, and no part of it is active, staffed, or authorized.",
  },
};

export const IMPLEMENTATION_STATUSES = ["not-implemented", "modeled", "partially-modeled"] as const;
export type ValueStreamImplementationStatus = (typeof IMPLEMENTATION_STATUSES)[number];

export interface ValueStream {
  valueStreamId: ValueStreamId;
  name: string;
  description: string;
  purpose: string;
  northStarContribution: string;
  humanBeneficiaries: string[];
  enterpriseBeneficiaries: string[];
  trigger: string;
  entryCriteria: string[];
  exitCriteria: string[];
  stages: ValueStreamStage[];

  /** Declared authority. Never inferred from whether stages exist. */
  currentAuthority: AuthorityClass;
  currentMaturity: CapabilityScaleStage;
  targetMaturity: CapabilityScaleStage;
  operatingStatus: StreamOperatingStatus;
  implementationStatus: ValueStreamImplementationStatus;

  requiredCapabilities: EnterpriseCapabilityId[];
  primaryFunction: EnterpriseFunctionId;
  supportingFunctions: EnterpriseFunctionId[];
  accountableRoleCandidate: string;
  decisionAuthorities: EnterpriseFunctionId[];
  validationAuthorities: EnterpriseFunctionId[];
  stopAuthorities: EnterpriseFunctionId[];

  requiredSharedObjects: SharedObjectTypeId[];
  requiredDeliverableTypes: string[];
  evidenceRequirements: string[];
  gateIds: string[];
  dependencyIds: string[];
  handoffIds: string[];
  escalations: string[];
  refusalConditions: string[];
  rollbackRecovery: string;

  metricIds: string[];
  outcomeMeasures: string[];
  /** Where the stream's learning goes. Every stream closes a loop somewhere. */
  learningLoopDestination: ValueStreamId;

  risks: string[];
  assumptions: string[];
  unknowns: string[];
  relatedRequirements: string[];
  relatedDecisions: string[];
  relatedFindings: string[];
  relatedEvidence: string[];
  reviewTrigger: string;
  supersession: string;
  notes: string;
  /** All examples are invented. Nothing is drawn from real operations. */
  synthetic: true;
}

export type ValueStreamViolationKind =
  | "missing-purpose"
  | "missing-outcome"
  | "missing-entry-criteria"
  | "missing-exit-criteria"
  | "no-stages"
  | "missing-learning-loop"
  | "no-stop-authority"
  | "gated-stream-claims-implementation";

export interface ValueStreamViolation {
  valueStreamId: ValueStreamId;
  kind: ValueStreamViolationKind;
  detail: string;
}

export function validateValueStreams(streams: ValueStream[]): ValueStreamViolation[] {
  const violations: ValueStreamViolation[] = [];
  for (const stream of streams) {
    const push = (kind: ValueStreamViolationKind, detail: string) =>
      violations.push({ valueStreamId: stream.valueStreamId, kind, detail });

    if (stream.purpose.trim() === "") push("missing-purpose", "Stream has no stated purpose.");
    if (stream.outcomeMeasures.length === 0)
      push("missing-outcome", "Stream produces no stated outcome measure.");
    if (stream.entryCriteria.length === 0) push("missing-entry-criteria", "Stream has no entry criteria.");
    if (stream.exitCriteria.length === 0) push("missing-exit-criteria", "Stream has no exit criteria.");
    if (stream.stages.length === 0) push("no-stages", "Stream has no stages.");
    if (stream.learningLoopDestination.trim() === "")
      push("missing-learning-loop", "Stream does not say where its learning goes.");
    if (stream.stopAuthorities.length === 0)
      push("no-stop-authority", "No function may stop this stream.");
    if (stream.operatingStatus === "gated-future" && stream.implementationStatus !== "not-implemented")
      push(
        "gated-stream-claims-implementation",
        "A gated future stream may not report any implementation status other than not implemented.",
      );
  }
  return violations;
}

export function isGatedFuture(stream: ValueStream): boolean {
  return stream.operatingStatus === "gated-future";
}
