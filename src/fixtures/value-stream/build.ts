/**
 * Value stream fixture builder.
 *
 * Seeds stay compact and the builder applies governance defaults, so no stream
 * can be seeded without entry criteria, exit criteria, refusal states, an audit
 * requirement, a stop authority, or a learning loop destination.
 *
 * Everything produced here is synthetic.
 */
import type {
  DecisionPoint,
  EnterpriseCapabilityId,
  EnterpriseFunctionId,
  StageEvidenceRequirement,
  StreamOperatingStatus,
  ValueStream,
  ValueStreamImplementationStatus,
  ValueStreamStage,
} from "@/domain";
import type { AuthorityClass, ScaleStage, SharedObjectTypeId, WorkType } from "@/domain";

export interface StageSeed {
  name: string;
  purpose: string;
  owner: EnterpriseFunctionId;
  functions?: EnterpriseFunctionId[];
  capabilities?: EnterpriseCapabilityId[];
  capacities?: string[];
  inputs: SharedObjectTypeId[];
  outputs: SharedObjectTypeId[];
  context?: string | null;
  entry: string[];
  exit: string[];
  workTypes?: WorkType[];
  deliverables?: string[];
  decisions?: DecisionPoint[];
  approvals?: string[];
  validation?: string | null;
  evidence?: StageEvidenceRequirement[];
  refusals: string[];
  escalation?: string;
  maxWait?: string | null;
  audit?: string;
}

export interface ValueStreamSeed {
  id: string;
  name: string;
  description: string;
  purpose: string;
  northStar: string;
  humanBeneficiaries: string[];
  enterpriseBeneficiaries: string[];
  trigger: string;
  entry: string[];
  exit: string[];
  operatingStatus?: StreamOperatingStatus;
  authority?: AuthorityClass;
  currentMaturity?: ScaleStage;
  targetMaturity?: ScaleStage;
  implementationStatus?: ValueStreamImplementationStatus;
  capabilities: EnterpriseCapabilityId[];
  primaryFunction: EnterpriseFunctionId;
  supportingFunctions: EnterpriseFunctionId[];
  accountableRoleCandidate: string;
  decisionAuthorities: EnterpriseFunctionId[];
  validationAuthorities: EnterpriseFunctionId[];
  stopAuthorities: EnterpriseFunctionId[];
  objects: SharedObjectTypeId[];
  deliverableTypes: string[];
  evidenceRequirements: string[];
  escalations?: string[];
  refusalConditions: string[];
  rollbackRecovery: string;
  outcomeMeasures: string[];
  learningLoop: string;
  risks: string[];
  assumptions: string[];
  unknowns: string[];
  reviewTrigger: string;
  supersession?: string;
  notes?: string;
  stages: StageSeed[];
}

const DEFAULT_AUDIT =
  "Record who acted, in which capacity, on which objects, under which rule, and when.";

function buildStages(streamId: string, seeds: StageSeed[]): ValueStreamStage[] {
  return seeds.map((seed, index) => {
    const sequence = index + 1;
    const stageId = `${streamId}-S${String(sequence).padStart(2, "0")}`;
    const nextSeed = seeds[index + 1];
    return {
      stageId,
      valueStreamId: streamId,
      sequence,
      name: seed.name,
      purpose: seed.purpose,
      stageOwner: seed.owner,
      participatingCapabilities: seed.capabilities ?? [],
      participatingFunctions: seed.functions ?? [seed.owner],
      allowedActingCapacities: seed.capacities ?? ["founder-operator (synthetic runtime)"],
      inputObjects: seed.inputs,
      requiredContext: seed.context ?? null,
      entryCriteria: seed.entry,
      workTypes: seed.workTypes ?? ["task"],
      requiredDeliverables: seed.deliverables ?? [],
      decisionPoints: (seed.decisions ?? []).map((point) => ({ ...point, stageId })),
      approvals: seed.approvals ?? [],
      validation: seed.validation ?? null,
      evidence: seed.evidence ?? [],
      handoffRecipientStageId: nextSeed
        ? `${streamId}-S${String(sequence + 1).padStart(2, "0")}`
        : null,
      exitCriteria: seed.exit,
      refusalStates: seed.refusals,
      escalation: seed.escalation ?? "Escalate to the stream's stop authority with the blocking reason named.",
      maximumWaitingState: seed.maxWait ?? "Ten working days waiting without movement requires escalation.",
      outputObjects: seed.outputs,
      auditRequirement: seed.audit ?? DEFAULT_AUDIT,
    } satisfies ValueStreamStage;
  });
}

export function buildValueStream(seed: ValueStreamSeed): ValueStream {
  const stages = buildStages(seed.id, seed.stages);
  const gated = (seed.operatingStatus ?? "candidate-internal") === "gated-future";
  return {
    valueStreamId: seed.id,
    name: seed.name,
    description: seed.description,
    purpose: seed.purpose,
    northStarContribution: seed.northStar,
    humanBeneficiaries: seed.humanBeneficiaries,
    enterpriseBeneficiaries: seed.enterpriseBeneficiaries,
    trigger: seed.trigger,
    entryCriteria: seed.entry,
    exitCriteria: seed.exit,
    stages,
    currentAuthority: seed.authority ?? "research-candidate",
    currentMaturity: seed.currentMaturity ?? "S0",
    targetMaturity: seed.targetMaturity ?? "S2",
    operatingStatus: seed.operatingStatus ?? "candidate-internal",
    implementationStatus: gated ? "not-implemented" : (seed.implementationStatus ?? "modeled"),
    requiredCapabilities: seed.capabilities,
    primaryFunction: seed.primaryFunction,
    supportingFunctions: seed.supportingFunctions,
    accountableRoleCandidate: seed.accountableRoleCandidate,
    decisionAuthorities: seed.decisionAuthorities,
    validationAuthorities: seed.validationAuthorities,
    stopAuthorities: seed.stopAuthorities,
    requiredSharedObjects: seed.objects,
    requiredDeliverableTypes: seed.deliverableTypes,
    evidenceRequirements: seed.evidenceRequirements,
    gateIds: [],
    dependencyIds: [],
    handoffIds: [],
    escalations: seed.escalations ?? [
      "A stalled stage escalates to the stream stop authority.",
      "A refused gate escalates to the decision authority named for that gate.",
    ],
    refusalConditions: seed.refusalConditions,
    rollbackRecovery: seed.rollbackRecovery,
    metricIds: [],
    outcomeMeasures: seed.outcomeMeasures,
    learningLoopDestination: seed.learningLoop,
    risks: seed.risks,
    assumptions: seed.assumptions,
    unknowns: seed.unknowns,
    relatedRequirements: [],
    relatedDecisions: [],
    relatedFindings: [],
    relatedEvidence: [],
    reviewTrigger: seed.reviewTrigger,
    supersession: seed.supersession ?? "Superseded only by a governed decision that names this stream.",
    notes: seed.notes ?? "",
    synthetic: true,
  } satisfies ValueStream;
}

/** Attaches gate, dependency, handoff, and metric identifiers after seeding. */
export function linkStreamRecords(
  streams: ValueStream[],
  links: {
    gateIds: Record<string, string[]>;
    dependencyIds: Record<string, string[]>;
    handoffIds: Record<string, string[]>;
    metricIds: Record<string, string[]>;
  },
): ValueStream[] {
  return streams.map((stream) => ({
    ...stream,
    gateIds: links.gateIds[stream.valueStreamId] ?? [],
    dependencyIds: links.dependencyIds[stream.valueStreamId] ?? [],
    handoffIds: links.handoffIds[stream.valueStreamId] ?? [],
    metricIds: links.metricIds[stream.valueStreamId] ?? [],
  }));
}
