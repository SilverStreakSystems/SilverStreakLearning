/**
 * Gates, handoffs, dependencies, commitments, metrics, burdens, transitions,
 * refusals, and escalation paths derived from the seeded value streams.
 *
 * These are generated from the stage seeds so the operating records cannot
 * drift from the streams they describe. Everything is synthetic and nothing is
 * enforced at runtime.
 */
import type {
  BurdenAssessment,
  Commitment,
  DependencyRecord,
  EnterpriseFunctionId,
  EscalationPath,
  HandoffContract,
  RefusalRecord,
  StateTransition,
  ValueStream,
  ValueStreamGate,
  ValueStreamId,
  ValueStreamMetric,
} from "@/domain";

const AUDIT =
  "Recorded with actor, acting capacity, timestamp, inputs, disposition, and rationale.";

/** Gates sit on stages whose exit requires an explicit disposition. */
export function buildGates(streams: ValueStream[]): ValueStreamGate[] {
  const gates: ValueStreamGate[] = [];
  for (const stream of streams) {
    // A gate needs something to examine. A stage that requires no evidence is
    // not gated; treating it as gated would create a formality that always passes.
    const gated = stream.stages.filter(
      (stage) =>
        stage.evidence.length > 0 &&
        (stage.approvals.length > 0 ||
          /decision|authoriz|gate|disposition|approval|review/i.test(stage.name)),
    );
    gated.forEach((stage, index) => {
      const gateId = `${stream.valueStreamId}-G${String(index + 1).padStart(2, "0")}`;
      const closedByAiGate = stream.operatingStatus === "gated-future";
      gates.push({
        gateId,
        valueStreamId: stream.valueStreamId,
        stageId: stage.stageId,
        name: `${stage.name} gate`,
        purpose: `Decide whether ${stream.name} may advance past ${stage.name.toLowerCase()}.`,
        entryCriteria: stage.entryCriteria,
        requiredDeliverables: stage.requiredDeliverables,
        requiredEvidence: stage.evidence.map((item) => item.proposition),
        owner: stage.stageOwner,
        reviewers: stage.participatingFunctions,
        stopConditions: stream.refusalConditions,
        residualRiskAuthority: stream.decisionAuthorities[0] ?? null,
        dispositionOptions: closedByAiGate
          ? ["blocked", "refused"]
          : ["pass", "hold", "blocked", "refused", "revise"],
        exitCriteria: stage.exitCriteria,
        auditRequirement:
          AUDIT + " Silence is not passage: a gate with no recorded disposition has not passed.",
        nextStageId: stage.handoffRecipientStageId,
        exampleDisposition: closedByAiGate ? "blocked" : "hold",
        exampleRationale: closedByAiGate
          ? "The AI trigger gate is closed, so no AI capability may advance."
          : "Illustrative disposition only. No real work has passed this gate.",
      });
    });
  }
  return gates;
}

/** One handoff contract per consecutive stage pair. */
export function buildHandoffs(streams: ValueStream[]): HandoffContract[] {
  const handoffs: HandoffContract[] = [];
  for (const stream of streams) {
    stream.stages.forEach((stage, index) => {
      const next = stream.stages[index + 1];
      if (!next) return;
      handoffs.push({
        handoffId: `${stage.stageId}-H`,
        sourceStageId: stage.stageId,
        destinationStageId: next.stageId,
        sourceOwner: stage.stageOwner,
        receivingOwner: next.stageOwner,
        objectsTransferred: stage.outputObjects,
        requiredState: `Exit criteria of ${stage.name} are recorded as met.`,
        requiredDeliverables: stage.requiredDeliverables,
        requiredEvidence: stage.evidence.map((item) => item.proposition),
        contextPackagePurpose: next.requiredContext,
        acceptanceCriteria: next.entryCriteria,
        expectedTiming: "Within one working cycle of the source stage recording its exit.",
        receiverAccepted: false,
        refusalReason: null,
        escalation: next.escalation,
        auditRequirement: AUDIT,
        outcome: "pending",
      });
    });
  }
  return handoffs;
}

interface DependencySeed {
  stream: ValueStreamId;
  stage: number;
  kind: DependencyRecord["kind"];
  description: string;
  dependsOn: string;
  owner: EnterpriseFunctionId | null;
  state: DependencyRecord["state"];
  blocking: boolean;
  criticality: DependencyRecord["criticality"];
  fallback: string | null;
}

const dependencySeeds: DependencySeed[] = [
  {
    stream: "research-requirement",
    stage: 2,
    kind: "external",
    description: "Access to licensed literature is required before source collection can complete.",
    dependsOn: "External publisher access",
    owner: "F02",
    state: "not-started",
    blocking: true,
    criticality: "high",
    fallback: "Restrict the question to openly available sources and record the narrowed scope.",
  },
  {
    stream: "decision-build",
    stage: 4,
    kind: "decision",
    description: "Build cannot start until the authorizing decision is recorded as accepted.",
    dependsOn: "requirement-decision",
    owner: "F01",
    state: "in-progress",
    blocking: true,
    criticality: "critical",
    fallback: null,
  },
  {
    stream: "build-validation",
    stage: 3,
    kind: "capability",
    description:
      "Independent validation capacity does not exist while one operator builds and checks.",
    dependsOn: "CAP-D07-002",
    owner: null,
    state: "at-risk",
    blocking: false,
    criticality: "critical",
    fallback: "Record the independence limitation on every validation result.",
  },
  {
    stream: "validation-release",
    stage: 3,
    kind: "evidence",
    description: "Accessibility evidence must be current for the exact release candidate.",
    dependsOn: "Accessibility conformance evidence",
    owner: "F05",
    state: "not-started",
    blocking: true,
    criticality: "critical",
    fallback: null,
  },
  {
    stream: "contract-implementation",
    stage: 2,
    kind: "external",
    description: "Customer-side prerequisites are outside SSLS control and are commonly unowned.",
    dependsOn: "Customer readiness owner",
    owner: null,
    state: "not-started",
    blocking: true,
    criticality: "high",
    fallback: "Refuse go-live and record the missing prerequisite.",
  },
  {
    stream: "adoption-outcome",
    stage: 3,
    kind: "object",
    description: "Outcome analysis depends on a defined intended outcome recorded before use.",
    dependsOn: "requirement",
    owner: "F04",
    state: "not-started",
    blocking: true,
    criticality: "high",
    fallback: "Record that no pre-defined outcome exists and refuse the analysis.",
  },
  {
    stream: "hire-develop-retain",
    stage: 4,
    kind: "external",
    description: "Every role depends on funding that does not currently exist.",
    dependsOn: "Funding decision",
    owner: "F13",
    state: "not-started",
    blocking: true,
    criticality: "critical",
    fallback: "Keep the role as a candidate definition and record the gap.",
  },
  {
    stream: "vendor-lifecycle",
    stage: 3,
    kind: "stage",
    description: "Contracting depends on a viable exit plan produced in the prior stage.",
    dependsOn: "vendor-lifecycle-S03",
    owner: "F14",
    state: "not-started",
    blocking: true,
    criticality: "high",
    fallback: null,
  },
  {
    stream: "ai-capability-lifecycle",
    stage: 1,
    kind: "decision",
    description:
      "Every stage depends on a governed decision to open the AI trigger gate. None exists.",
    dependsOn: "AI trigger gate opening decision",
    owner: "F01",
    state: "not-started",
    blocking: true,
    criticality: "critical",
    fallback: null,
  },
];

export function buildDependencies(streams: ValueStream[]): DependencyRecord[] {
  const byId = new Map(streams.map((stream) => [stream.valueStreamId, stream]));
  return dependencySeeds.map((seed, index) => {
    const stream = byId.get(seed.stream);
    const stage = stream?.stages[seed.stage - 1];
    return {
      dependencyId: `DEP-${String(index + 1).padStart(3, "0")}`,
      kind: seed.kind,
      valueStreamId: seed.stream,
      dependentStageId: stage?.stageId ?? `${seed.stream}-S01`,
      description: `${seed.description} Depends on: ${seed.dependsOn}.`,
      owner: seed.owner,
      state: seed.state,
      blocking: seed.blocking,
      criticality: seed.criticality,
      fallback: seed.fallback,
      reviewDate: "Reviewed each governance cycle.",
      evidence: null,
      escalation: "Escalate to the stream stop authority when a blocking dependency stays unowned.",
    } satisfies DependencyRecord;
  });
}

/** Four metric classes, kept unblended by construction. */
export function buildMetrics(streams: ValueStream[]): ValueStreamMetric[] {
  const metrics: ValueStreamMetric[] = [];
  for (const stream of streams) {
    const owner = stream.primaryFunction;
    const base = stream.valueStreamId;
    metrics.push(
      {
        metricId: `${base}-M01`,
        valueStreamId: base,
        stageId: null,
        metricClass: "flow",
        name: "Items waiting beyond their maximum waiting state",
        questionAnswered: "Where is work sitting still without a recorded reason?",
        source: "Stage records",
        numerator: "Items past their stage maximum waiting state",
        denominator: "Items in the stream",
        calculation: "Counted per stage; never averaged across stages.",
        freshness: "Recomputed each governance cycle.",
        owner,
        interpretation: "Indicates where the stream stalls.",
        prohibitedInterpretation: "Does not measure the productivity of any individual.",
        actionTriggered: "Escalate the stalled item to the stream stop authority.",
        perverseIncentiveRisk: "Could encourage closing items without a recorded outcome.",
      },
      {
        metricId: `${base}-M02`,
        valueStreamId: base,
        stageId: null,
        metricClass: "quality",
        name: "Items returned for correction",
        questionAnswered: "How often does work move forward before it is ready?",
        source: "Stage refusal and return records",
        numerator: "Items returned by a downstream stage",
        denominator: "Items handed off",
        calculation: "Counted per handoff pair.",
        freshness: "Recomputed each governance cycle.",
        owner,
        interpretation: "Points at unclear entry criteria or premature handoff.",
        prohibitedInterpretation: "A return is not a failure of the person who sent it.",
        actionTriggered: "Review the handoff contract's acceptance criteria.",
        perverseIncentiveRisk: "Could discourage legitimate refusals.",
      },
      {
        metricId: `${base}-M03`,
        valueStreamId: base,
        stageId: null,
        metricClass: "evidence",
        name: "Gate dispositions recorded",
        questionAnswered: "Did each gate produce an explicit disposition rather than silence?",
        source: "Gate records",
        numerator: "Gates with a recorded disposition",
        denominator: "Gates reached",
        calculation: "Counted per gate; a missing disposition counts as not recorded.",
        freshness: "Recomputed each governance cycle.",
        owner,
        interpretation: "Shows whether governance is actually being exercised.",
        prohibitedInterpretation: "A recorded pass is not evidence that the work is correct.",
        actionTriggered: "Raise a finding for any gate reached without a disposition.",
        perverseIncentiveRisk: "Could encourage rubber-stamping to raise the count.",
      },
      {
        metricId: `${base}-M04`,
        valueStreamId: base,
        stageId: null,
        metricClass: "outcome",
        name: "Refusals with a recorded ground",
        questionAnswered: "When the stream said no, was the reason recorded?",
        source: "Refusal records",
        numerator: "Refusals with a governing rule named",
        denominator: "Refusals recorded",
        calculation: "Counted per refusal.",
        freshness: "Recomputed each governance cycle.",
        owner,
        interpretation: "Refusal is a successful outcome when it is grounded.",
        prohibitedInterpretation: "A low refusal count is not a sign of health.",
        actionTriggered: "Return ungrounded refusals for a stated reason.",
        perverseIncentiveRisk: "Could be misread as a target to minimize.",
      },
    );
  }
  return metrics;
}

export const VALUE_STREAM_COMMITMENTS: Commitment[] = [
  {
    commitmentId: "COM-001",
    valueStreamId: "validation-release",
    stageId: "validation-release-S05",
    committingParty: "F01",
    receivingParty: "Founder operator, acting as governance record keeper",
    purpose: "Ensure release authorization is explicit rather than inferred.",
    promisedOutcome: "Every release candidate receives a recorded authorization decision.",
    dueDate: "Each release review.",
    sourceAuthority: "Release authority decision rights, recorded in this stream.",
    relatedDeliverable: "Release record",
    dependencyIds: ["DEP-004"],
    status: "proposed",
    evidence: null,
    escalation: "An unauthorized release is an incident and enters incident handling.",
    fulfillment: null,
    supersededBy: null,
  },
  {
    commitmentId: "COM-002",
    valueStreamId: "feedback-decision",
    stageId: "feedback-decision-S06",
    committingParty: "F12",
    receivingParty: "The person who submitted the feedback",
    purpose: "Ensure feedback is answered even when refused.",
    promisedOutcome: "Every feedback item receives a recorded disposition the originator can see.",
    dueDate: "Within one review cycle of intake.",
    sourceAuthority: "Feedback triage decision rights, recorded in this stream.",
    relatedDeliverable: "Disposition record",
    dependencyIds: [],
    status: "proposed",
    evidence: null,
    escalation: "Unanswered feedback escalates to the decision authority.",
    fulfillment: null,
    supersededBy: null,
  },
  {
    commitmentId: "COM-003",
    valueStreamId: "incident-recovery-learning",
    stageId: "incident-recovery-learning-S04",
    committingParty: "F13",
    receivingParty: "Affected people and obligated parties",
    purpose: "Ensure notification is never suppressed for reputational reasons.",
    promisedOutcome: "Required notifications are made and recorded, including unreachable parties.",
    dueDate: "As fast as the obligation requires, and no slower.",
    sourceAuthority: "Incident notification refusal condition recorded in this stream.",
    relatedDeliverable: "Incident record",
    dependencyIds: [],
    status: "proposed",
    evidence: null,
    escalation: "Suppressed notification is escalated to the governance authority immediately.",
    fulfillment: null,
    supersededBy: null,
  },
];

export const VALUE_STREAM_BURDENS: BurdenAssessment[] = [
  {
    burdenId: "BUR-001",
    valueStreamId: "contract-implementation",
    burdenType: "setup",
    bearer: "district-leader",
    level: "high",
    description:
      "Configuration and readiness evidence require district staff time before any benefit appears.",
    offset: "SSLS supplies templates and performs configuration where scope allows.",
    mitigation: "Readiness evidence is scoped to what a small district can realistically produce.",
  },
  {
    burdenId: "BUR-002",
    valueStreamId: "implementation-adoption",
    burdenType: "training",
    bearer: "educator",
    level: "moderate",
    description: "Educators must learn a new tool during instructional time.",
    offset: "Enablement is delivered in short segments inside existing meetings.",
    mitigation: "Barriers are recorded as system problems, not as educator failure.",
  },
  {
    burdenId: "BUR-003",
    valueStreamId: "build-validation",
    burdenType: "review",
    bearer: "founder-operator",
    level: "high",
    description: "One operator carries both build and validation review load.",
    offset: null,
    mitigation: "The independence limitation is recorded on every validation result.",
  },
  {
    burdenId: "BUR-004",
    valueStreamId: "evidence-claim",
    burdenType: "documentation",
    bearer: "founder-operator",
    level: "moderate",
    description: "Every claim requires evidence linkage and limitations before use.",
    offset: "Reused evidence links reduce the cost of subsequent claims.",
    mitigation: "Claims are batched into review cycles rather than reviewed ad hoc.",
  },
];

export const VALUE_STREAM_TRANSITIONS: StateTransition[] = [
  {
    transitionId: "TRN-001",
    valueStreamId: "decision-build",
    currentState: "in-progress",
    preconditions: ["Internal review is recorded.", "Work items name their served objects."],
    authorizedFunctions: ["F06"],
    requiredCapabilities: ["CAP-D04-001"],
    action: "Record implementation as complete.",
    resultingState: "implemented",
    sideEffects: ["The candidate becomes eligible to be offered for validation."],
    evidenceProduced: ["Internal review record"],
    auditRecord: AUDIT,
    failureModes: ["Completion read as proof of correctness."],
    refusalState: "Refused: attempt to record validation from the implementation axis.",
    escalation: "Escalate to the validation authority.",
    recovery: "Reverse the state and record the correction.",
    enforced: false,
  },
  {
    transitionId: "TRN-002",
    valueStreamId: "build-validation",
    currentState: "planned",
    preconditions: [
      "Preconditions for each check are confirmed.",
      "The validator is not the builder.",
    ],
    authorizedFunctions: ["F08"],
    requiredCapabilities: ["CAP-D07-001"],
    action: "Record executed checks and their actual results.",
    resultingState: "validated-partial",
    sideEffects: ["Findings may be raised."],
    evidenceProduced: ["Validation result bound to a version"],
    auditRecord: AUDIT,
    failureModes: ["Planned tests counted as evidence."],
    refusalState: "Not executed: preconditions unmet.",
    escalation: "Escalate to the stop authority when independence cannot be established.",
    recovery: "Mark results void and re-run under correct conditions.",
    enforced: false,
  },
  {
    transitionId: "TRN-003",
    valueStreamId: "evidence-claim",
    currentState: "pending",
    preconditions: [
      "Every assertion maps to evidence.",
      "Limitations are written into the wording.",
    ],
    authorizedFunctions: ["F01"],
    requiredCapabilities: ["CAP-D01-007"],
    action: "Record approval or refusal of the exact wording.",
    resultingState: "approved",
    sideEffects: ["The claim becomes usable only in its approved wording."],
    evidenceProduced: ["Claims review record"],
    auditRecord: AUDIT,
    failureModes: ["Wording changed after approval."],
    refusalState: "Refused: claim exceeds evidence.",
    escalation: "Escalate altered wording to the governance authority.",
    recovery: "Withdraw the claim and publish a correction.",
    enforced: false,
  },
  {
    transitionId: "TRN-004",
    valueStreamId: "validation-release",
    currentState: "internal",
    preconditions: [
      "Every gate recorded a disposition permitting advance.",
      "The candidate is frozen.",
    ],
    authorizedFunctions: ["F01"],
    requiredCapabilities: ["CAP-D07-005"],
    action: "Authorize release.",
    resultingState: "released",
    sideEffects: ["Hypercare monitoring begins."],
    evidenceProduced: ["Release record"],
    auditRecord: AUDIT,
    failureModes: ["Release inferred from completed work."],
    refusalState: "Held: a stop condition is unresolved.",
    escalation: "Escalate to the stop authority.",
    recovery: "Roll back and open an incident.",
    enforced: false,
  },
];

export const VALUE_STREAM_REFUSALS: RefusalRecord[] = [
  {
    refusalId: "REF-001",
    valueStreamId: "research-requirement",
    stageId: "research-requirement-S08",
    ground: "insufficient-evidence",
    refusedThing:
      "A proposed requirement asserting a general instructional rule from one small study.",
    reason: "The finding does not generalize to the populations SSLS serves.",
    governingRule: "A requirement may not exceed what its evidence supports.",
    refusedBy: "F01",
    resolutionPath: "Queue a broader research question before reconsidering.",
    appealAvailable: true,
    appealRoute: "Resubmit with additional evidence to the governance authority.",
    escalation: "None required; the refusal is the outcome.",
  },
  {
    refusalId: "REF-002",
    valueStreamId: "evidence-claim",
    stageId: "evidence-claim-S06",
    ground: "invalid-claim",
    refusedThing: "Wording asserting that SSLS improves student outcomes.",
    reason: "No outcome evidence exists. SSLS has no users and no results.",
    governingRule: "A claim may not assert more than its linked evidence supports.",
    refusedBy: "F01",
    resolutionPath: "No resubmission until outcome evidence exists and is validated.",
    appealAvailable: false,
    appealRoute: null,
    escalation: "None required; the refusal is the outcome.",
  },
  {
    refusalId: "REF-003",
    valueStreamId: "ai-capability-lifecycle",
    stageId: "ai-capability-lifecycle-S01",
    ground: "ai-use-not-justified",
    refusedThing: "Any proposal to add an AI capability to SSLS.",
    reason: "The AI trigger gate has never been opened by a governed decision.",
    governingRule: "No AI capability may be built before its trigger gate is opened.",
    refusedBy: "F01",
    resolutionPath: "A governed decision would have to open the gate first.",
    appealAvailable: true,
    appealRoute: "Propose opening the gate as a governance decision, with evidence.",
    escalation: "None required; the block is the outcome.",
  },
  {
    refusalId: "REF-004",
    valueStreamId: "implementation-adoption",
    stageId: "implementation-adoption-S05",
    ground: "privacy-stop",
    refusedThing: "A request to rank individual teachers by system usage.",
    reason: "Surveillance-style measurement of individuals is prohibited by design.",
    governingRule: "Prohibited metrics may not be produced, even on request.",
    refusedBy: "F09",
    resolutionPath: "Offer system-level barrier analysis instead.",
    appealAvailable: false,
    appealRoute: null,
    escalation: "None required; the refusal is the outcome.",
  },
  {
    refusalId: "REF-005",
    valueStreamId: "validation-release",
    stageId: "validation-release-S03",
    ground: "accessibility-stop",
    refusedThing: "Release of a candidate with an unresolved keyboard trap.",
    reason: "An accessibility barrier blocks release regardless of other readiness.",
    governingRule: "Accessibility is a stop condition, not a weighting factor.",
    refusedBy: "F05",
    resolutionPath: "Remediate and re-validate the exact candidate.",
    appealAvailable: false,
    appealRoute: null,
    escalation: "None required; the refusal is the outcome.",
  },
];

export const VALUE_STREAM_ESCALATIONS: EscalationPath[] = [
  {
    escalationId: "ESC-001",
    trigger: "A blocking dependency has no owner.",
    fromFunction: "F06",
    toFunction: "F14",
    timeBox: "One governance cycle.",
    authorityOfEscalation: "Escalation does not transfer decision rights; it requests a decision.",
  },
  {
    escalationId: "ESC-002",
    trigger: "A stage exceeds its maximum waiting state.",
    fromFunction: "F14",
    toFunction: "F01",
    timeBox: "One governance cycle.",
    authorityOfEscalation: "Escalation does not transfer decision rights; it requests a decision.",
  },
  {
    escalationId: "ESC-003",
    trigger: "A stop authority halts work and the halt is disputed.",
    fromFunction: "F09",
    toFunction: "F01",
    timeBox: "Immediately for potential harm.",
    authorityOfEscalation: "A halt stays in force until explicitly lifted.",
  },
  {
    escalationId: "ESC-004",
    trigger: "A finding has no recorded outcome after its review interval.",
    fromFunction: "F15",
    toFunction: "F01",
    timeBox: "One learning cycle.",
    authorityOfEscalation: "Escalation does not transfer decision rights; it requests a decision.",
  },
];
