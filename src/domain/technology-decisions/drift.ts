/**
 * Drift analysis over the technology-decision register.
 *
 * This module produces ANALYSIS, not decisions. Every record it emits carries
 * `owner_disposition: null` and `review_status: "NOT-REVIEWED"`, and nothing in
 * this file can set either to anything else. A proposal here is an engineering
 * reading offered to the owner for review. It closes no gate, activates no
 * workflow, and authorizes no implementation.
 *
 * The model is deliberately orthogonal: how the source was read, how the two
 * sides compare, what the workflow's own facts demand, what evidence exists,
 * and what might explain the difference are five separate axes. Collapsing them
 * into one "cause" label would hide the disagreement the owner needs to see.
 */
import { type OptionId, type QuestionId } from "./decision-process";
import { type EvaluationResult } from "./evaluator";
import { contentFingerprint } from "./fingerprint";
import { type ComparisonRelation, type ComparisonResult } from "./comparison";
import { type SourceExpression } from "./source-expression";
import { type DerivedAnswers, type WorkflowRecord } from "./workflow";

export const ANALYSIS_SCHEMA_VERSION = "1.0.0";
export const CLASSIFIER_VERSION = "1.0.0";
export const SAMPLE_ALGORITHM_VERSION = "1.0.0";

/** What the workflow's own facts demand, independent of either recommendation. */
export const DECISION_DRIVERS = [
  "HUMAN-PROCESS-SUFFICIENT",
  "WORKSPACE-SUFFICIENT",
  "DETERMINISTIC-PRECEDENCE",
  "RULES-AUTOMATION",
  "RECORD-AUTHORITY",
  "RELATIONAL-DATA",
  "LONGITUDINAL-DATA",
  "PERMISSION-COMPLEXITY",
  "AUDIT-REQUIREMENT",
  "CROSS-ROLE-WORKFLOW",
  "AI-BOUNDARY",
  "HYBRID-NEED",
] as const;
export type DecisionDriver = (typeof DECISION_DRIVERS)[number];

export const EVIDENCE_STATES = ["SUFFICIENT", "AMBIGUOUS", "MISSING", "CONTRADICTORY"] as const;
export type EvidenceState = (typeof EVIDENCE_STATES)[number];

export const DEFECT_STATES = [
  "NONE",
  "SUSPECTED-PARSER",
  "SUSPECTED-COMPARISON",
  "SUSPECTED-EVALUATOR",
  "POSSIBLE-POLICY-ISSUE",
] as const;
export type DefectState = (typeof DEFECT_STATES)[number];

/** Non-exclusive explanations a reviewer should consider. Never a verdict. */
export const CANDIDATE_CAUSES = [
  "SOURCE-MORE-COMPLEX",
  "DERIVED-MORE-COMPLEX",
  "DETERMINISTIC-PRECEDENCE",
  "RECORD-AUTHORITY",
  "AI-BOUNDARY",
  "HUMAN-PROCESS-SUFFICIENT",
  "INSUFFICIENT-EVIDENCE",
  "SOURCE-AMBIGUITY",
  "STAGED-ADOPTION",
  "POLICY-CHOICE",
] as const;
export type CandidateCause = (typeof CANDIDATE_CAUSES)[number];

/** Engineering proposals. Deliberately NOT the owner's disposition vocabulary. */
export const PROPOSED_RESOLUTIONS = [
  "RETAIN-SUPPLIED",
  "ACCEPT-DERIVED",
  "MERGE-OPTIONS",
  "CORRECT-IMPLEMENTATION-DEFECT",
  "NEEDS-EVIDENCE",
  "OWNER-POLICY-DECISION",
  "OUT-OF-SCOPE",
  "NO-PROPOSAL",
] as const;
export type ProposedResolution = (typeof PROPOSED_RESOLUTIONS)[number];

export interface DriftAnalysisRecord {
  workflow_id: string;
  role_group_id: string;
  role_group_name: string;
  role: string;
  workflow: string;
  /** Verbatim supplied recommendation. Never rewritten. */
  source_recommendation_verbatim: string;
  source_risk_level_verbatim: string;
  source_ai_necessity_verbatim: string;

  expression_type: SourceExpression["expressionType"];
  parse_status: SourceExpression["parseStatus"];
  parse_diagnostics: string[];
  supplied_option_ids: OptionId[];
  supplied_deferred_option_ids: OptionId[];
  supplied_excluded_option_ids: OptionId[];

  derived_option_ids: OptionId[];
  derived_outcome: EvaluationResult["outcome"];
  deciding_step: string | null;
  evaluator_rationale: string[];
  invariants_applied: string[];
  ai_boundary: EvaluationResult["aiBoundary"];
  unresolved_questions: QuestionId[];

  comparison_relation: ComparisonRelation;
  comparison_explanation: string;

  risk_level: RiskLevel;
  program_areas: string[];
  student_or_family_facing: boolean;
  consequential: boolean;
  cross_role: boolean;
  record_authority_needed: boolean;
  longitudinal_needed: boolean;

  decision_drivers: DecisionDriver[];
  evidence_state: EvidenceState;
  defect_state: DefectState;
  candidate_causes: CandidateCause[];
  unresolved_question: string | null;

  mandatory_review: boolean;
  mandatory_review_reasons: string[];
  batch_eligible: boolean;

  proposed_resolution: ProposedResolution;
  proposal_basis: string;
  proposal_basis_fingerprint: string;

  /** Always null here. Only a recorded owner decision may ever set these. */
  owner_disposition: null;
  review_status: "NOT-REVIEWED";
  owner_decision_id: null;
}

export type RiskLevel = "high" | "moderate" | "low" | "unstated";

export function readRiskLevel(verbatim: string): RiskLevel {
  const text = verbatim.toLowerCase();
  if (text.includes("high")) return "high";
  if (text.includes("moderate") || text.includes("medium")) return "moderate";
  if (text.includes("low")) return "low";
  return "unstated";
}

const PROGRAM_AREA_MARKERS: Array<[string, RegExp]> = [
  ["special-education", /\b(sped|special education|iep|504|disabilit)/i],
  ["el-eld", /\b(english learner|\bel\b|eld|elpac|multilingual|translation|interpret)/i],
  ["mtss", /\b(mtss|tier\s*[123]|intervention|progress monitor)/i],
  ["administration", /\b(principal|superintendent|administrat|board|governance|compliance)/i],
  ["operations", /\b(transport|nutrition|facilit|payroll|purchas|inventory|maintenance|health)/i],
  ["general-education", /\b(classroom|teacher|grade|instruction|curricul|lesson)/i],
];

export function readProgramAreas(record: WorkflowRecord): string[] {
  const haystack = [
    record.role_group_name,
    record.source.role,
    record.source.responsibilities,
    record.source.workflow,
  ].join(" \u00b7 ");
  const areas = PROGRAM_AREA_MARKERS.filter(([, pattern]) => pattern.test(haystack)).map(
    ([area]) => area,
  );
  return areas.length > 0 ? areas : ["unclassified"];
}

const STUDENT_FAMILY_PATTERN =
  /\b(student|pupil|child|children|family|families|parent|guardian|caregiver)/i;

export function isStudentOrFamilyFacing(record: WorkflowRecord): boolean {
  return STUDENT_FAMILY_PATTERN.test(
    [record.source.workflow, record.source.outputs, record.source.inputs].join(" "),
  );
}

function answerIs(derived: DerivedAnswers, question: QuestionId, value: string): boolean {
  return derived[question]?.value === value;
}

export function readDecisionDrivers(
  derived: DerivedAnswers,
  evaluation: EvaluationResult,
): DecisionDriver[] {
  const drivers: DecisionDriver[] = [];
  const add = (driver: DecisionDriver) => {
    if (!drivers.includes(driver)) drivers.push(driver);
  };
  if (answerIs(derived, "human_process_sufficient", "yes")) add("HUMAN-PROCESS-SUFFICIENT");
  if (answerIs(derived, "workspace_tool_fits", "yes")) add("WORKSPACE-SUFFICIENT");
  if (answerIs(derived, "output_predictable", "yes")) add("DETERMINISTIC-PRECEDENCE");
  if (answerIs(derived, "deterministic_core_available", "yes")) add("DETERMINISTIC-PRECEDENCE");
  if (answerIs(derived, "repeatable_routing", "yes")) add("RULES-AUTOMATION");
  if (answerIs(derived, "authoritative_record_required", "yes")) add("RECORD-AUTHORITY");
  if (answerIs(derived, "relational_data_required", "yes")) add("RELATIONAL-DATA");
  if (answerIs(derived, "longitudinal_data_required", "yes")) add("LONGITUDINAL-DATA");
  if (answerIs(derived, "permission_complexity", "restricted")) add("PERMISSION-COMPLEXITY");
  if (answerIs(derived, "audit_history_required", "yes")) add("AUDIT-REQUIREMENT");
  if (answerIs(derived, "cross_role_workflow", "yes")) add("CROSS-ROLE-WORKFLOW");
  if (evaluation.aiBoundary === "prohibited") {
    add("AI-BOUNDARY");
  }
  if (evaluation.decidedAtStep === "STEP-HYBRID") add("HYBRID-NEED");
  return drivers;
}

export function readEvidenceState(
  expression: SourceExpression,
  derived: DerivedAnswers,
  evaluation: EvaluationResult,
): EvidenceState {
  if (expression.parseStatus === "contradictory") return "CONTRADICTORY";
  const suppliedUsesAi = expression.primaryOptionIds.some((id) => id === "OPT-5" || id === "OPT-6");
  if (suppliedUsesAi && evaluation.aiBoundary === "prohibited") return "CONTRADICTORY";
  if (expression.parseStatus === "unparseable") return "MISSING";
  if (evaluation.outcome === "unresolved") return "MISSING";
  if (expression.parseStatus === "ambiguous") return "AMBIGUOUS";
  if (Object.values(derived).some((answer) => answer.value === "uncertain")) return "AMBIGUOUS";
  return "SUFFICIENT";
}

export function readDefectState(
  expression: SourceExpression,
  evaluation: EvaluationResult,
): DefectState {
  const suppliedUsesAi = expression.primaryOptionIds.some((id) => id === "OPT-5" || id === "OPT-6");
  if (suppliedUsesAi && evaluation.aiBoundary === "prohibited") return "POSSIBLE-POLICY-ISSUE";
  return "NONE";
}

export function readCandidateCauses(
  comparison: ComparisonResult,
  expression: SourceExpression,
  evidence: EvidenceState,
  drivers: DecisionDriver[],
): CandidateCause[] {
  const causes: CandidateCause[] = [];
  const add = (cause: CandidateCause) => {
    if (!causes.includes(cause)) causes.push(cause);
  };
  const supplied = comparison.suppliedOptionIds;
  const derived = comparison.derivedOptionIds;
  const has = (set: OptionId[], id: OptionId) => set.includes(id);

  if (comparison.relation === "DERIVED-PROPER-SUBSET") add("SOURCE-MORE-COMPLEX");
  if (comparison.relation === "DERIVED-PROPER-SUPERSET") add("DERIVED-MORE-COMPLEX");
  if (has(supplied, "OPT-4") && !has(derived, "OPT-4")) {
    add("DETERMINISTIC-PRECEDENCE");
    add("RECORD-AUTHORITY");
  }
  if (!has(supplied, "OPT-4") && has(derived, "OPT-4")) add("RECORD-AUTHORITY");
  const aiOptions: OptionId[] = ["OPT-5", "OPT-6"];
  if (aiOptions.some((id) => has(supplied, id) !== has(derived, id))) add("AI-BOUNDARY");
  if (has(derived, "OPT-7") || drivers.includes("HUMAN-PROCESS-SUFFICIENT")) {
    add("HUMAN-PROCESS-SUFFICIENT");
  }
  if (expression.deferredOptionIds.length > 0) add("STAGED-ADOPTION");
  if (expression.parseStatus === "ambiguous") add("SOURCE-AMBIGUITY");
  if (evidence === "MISSING" || evidence === "CONTRADICTORY") add("INSUFFICIENT-EVIDENCE");
  if (comparison.relation === "PARTIAL-OVERLAP" && evidence === "SUFFICIENT") add("POLICY-CHOICE");
  if (comparison.relation === "DISJOINT") add("POLICY-CHOICE");
  return causes;
}

export interface MandatoryReviewVerdict {
  mandatory: boolean;
  reasons: string[];
}

/**
 * Records that must be read one at a time by the owner.
 *
 * Nothing in this cohort may be batch-proposed, no matter how similar it looks
 * to another record. Similarity is not a safety argument.
 */
export function readMandatoryReview(input: {
  risk: RiskLevel;
  consequential: boolean;
  studentOrFamilyFacing: boolean;
  aiBoundaryConflict: boolean;
  aiProhibitedInSource: boolean;
  evidence: EvidenceState;
  relation: ComparisonRelation;
}): MandatoryReviewVerdict {
  const reasons: string[] = [];
  if (input.risk === "high") reasons.push("The source rates this workflow high risk.");
  if (input.consequential) {
    reasons.push("This workflow contributes to a consequential determination about a person.");
  }
  if (input.studentOrFamilyFacing) {
    reasons.push("The workflow's inputs or outputs involve students or families.");
  }
  if (input.aiBoundaryConflict) {
    reasons.push("The supplied and derived readings disagree about whether AI may take part.");
  }
  if (input.aiProhibitedInSource) reasons.push("The source states AI is prohibited here.");
  if (input.evidence === "CONTRADICTORY") {
    reasons.push("The available evidence contradicts itself.");
  }
  if (input.relation === "DISJOINT") {
    reasons.push("The two readings share no option at all.");
  }
  return { mandatory: reasons.length > 0, reasons };
}

export function readProposedResolution(input: {
  relation: ComparisonRelation;
  evidence: EvidenceState;
  defect: DefectState;
  mandatory: boolean;
}): { resolution: ProposedResolution; basis: string } {
  if (input.defect === "POSSIBLE-POLICY-ISSUE") {
    return {
      resolution: "OWNER-POLICY-DECISION",
      basis:
        "The supplied recommendation involves AI in a workflow the source itself treats as closed to AI. Only the owner may resolve that.",
    };
  }
  if (input.evidence === "MISSING" || input.evidence === "CONTRADICTORY") {
    return {
      resolution: "NEEDS-EVIDENCE",
      basis: "The source fields do not support a reliable reading, so no proposal is defensible.",
    };
  }
  if (input.relation === "SOURCE-UNPARSEABLE" || input.relation === "DERIVED-ABSTAIN") {
    return {
      resolution: "NEEDS-EVIDENCE",
      basis:
        "Either the source could not be read as one committed set or the evaluator abstained. Neither is a disagreement to resolve.",
    };
  }
  if (input.relation === "EXACT") {
    return {
      resolution: "NO-PROPOSAL",
      basis: "Both readings agree. Nothing needs resolving.",
    };
  }
  if (input.mandatory) {
    return {
      resolution: "OWNER-POLICY-DECISION",
      basis:
        "This record is in the mandatory-review cohort. Risk, consequence, AI boundary, or student and family exposure makes this the owner's call, not an engineering one.",
    };
  }
  if (input.relation === "DERIVED-PROPER-SUBSET") {
    return {
      resolution: "ACCEPT-DERIVED",
      basis:
        "The derived set is contained in the supplied set, evidence is sufficient, and no safety condition applies. The smaller set is the minimum effective one on the evidence available.",
    };
  }
  if (input.relation === "DERIVED-PROPER-SUPERSET") {
    return {
      resolution: "RETAIN-SUPPLIED",
      basis:
        "The derived set adds technology beyond what the source asked for, with no safety condition requiring it. The supplied recommendation is the more restrained reading.",
    };
  }
  if (input.relation === "PARTIAL-OVERLAP") {
    return {
      resolution: "MERGE-OPTIONS",
      basis:
        "Both readings share ground and each names something the other omits. A merged set is a candidate, subject to owner judgement.",
    };
  }
  return { resolution: "NO-PROPOSAL", basis: "No defensible proposal follows from this evidence." };
}

/**
 * The basis fingerprint. Two records may only be batched when this value is
 * identical: same relation, same evidence, same drivers, same risk boundary,
 * same causes, same rule.
 */
export function proposalBasisFingerprint(input: {
  relation: ComparisonRelation;
  evidence: EvidenceState;
  defect: DefectState;
  drivers: DecisionDriver[];
  causes: CandidateCause[];
  risk: RiskLevel;
  resolution: ProposedResolution;
  suppliedOptionIds: OptionId[];
  derivedOptionIds: OptionId[];
}): string {
  return contentFingerprint({
    classifier_version: CLASSIFIER_VERSION,
    relation: input.relation,
    evidence: input.evidence,
    defect: input.defect,
    drivers: [...input.drivers].sort(),
    causes: [...input.causes].sort(),
    risk: input.risk,
    resolution: input.resolution,
    supplied: [...input.suppliedOptionIds].sort(),
    derived: [...input.derivedOptionIds].sort(),
  });
}

// ---------------------------------------------------------------------------
// Sampling and batching
// ---------------------------------------------------------------------------

export interface SampleStratum {
  dimension: string;
  value: string;
}

/** Every stratum a record belongs to. Coverage is measured against these. */
export function strataOf(record: DriftAnalysisRecord): SampleStratum[] {
  const strata: SampleStratum[] = [
    { dimension: "role_group", value: record.role_group_id },
    { dimension: "risk_level", value: record.risk_level },
    { dimension: "comparison_relation", value: record.comparison_relation },
    { dimension: "evidence_state", value: record.evidence_state },
    { dimension: "parse_status", value: record.parse_status },
    { dimension: "expression_type", value: record.expression_type },
    { dimension: "ai_boundary", value: record.ai_boundary },
    { dimension: "source_ai_necessity", value: record.source_ai_necessity_verbatim.toLowerCase() },
    { dimension: "cross_role", value: String(record.cross_role) },
    { dimension: "record_authority", value: String(record.record_authority_needed) },
    { dimension: "longitudinal", value: String(record.longitudinal_needed) },
    { dimension: "student_or_family_facing", value: String(record.student_or_family_facing) },
    { dimension: "proposed_resolution", value: record.proposed_resolution },
  ];
  for (const area of record.program_areas) strata.push({ dimension: "program_area", value: area });
  for (const option of [...record.supplied_option_ids, ...record.derived_option_ids]) {
    strata.push({ dimension: "option_present", value: option });
  }
  for (const cause of record.candidate_causes) {
    strata.push({ dimension: "candidate_cause", value: cause });
  }
  return strata;
}

const stratumKey = (stratum: SampleStratum) => `${stratum.dimension}=${stratum.value}`;

export interface SampleSelection {
  algorithm_version: string;
  population_fingerprint: string;
  population_size: number;
  cap: number;
  floor: number;
  selected: Array<{ workflow_id: string; inclusion_reason: string; strata_added: string[] }>;
  strata_covered: string[];
  strata_uncovered: string[];
}

/**
 * Deterministic maximum-marginal-coverage selection.
 *
 * At each step the record that adds the most previously uncovered strata wins;
 * ties break on the SHA-256 of (algorithm version, population fingerprint,
 * workflow id), so the outcome cannot depend on the order rows happen to sit in
 * the register.
 */
export function selectRepresentativeSample(
  population: DriftAnalysisRecord[],
  cap: number,
  floor = 0,
): SampleSelection {
  const fingerprint = contentFingerprint({
    algorithm_version: SAMPLE_ALGORITHM_VERSION,
    ids: population.map((record) => record.workflow_id).sort(),
    bases: population.map((record) => record.proposal_basis_fingerprint).sort(),
  });
  const allStrata = new Set<string>();
  for (const record of population) {
    for (const stratum of strataOf(record)) allStrata.add(stratumKey(stratum));
  }

  const remaining = [...population].sort((a, b) => a.workflow_id.localeCompare(b.workflow_id));
  const covered = new Set<string>();
  const selected: SampleSelection["selected"] = [];

  while (selected.length < cap && remaining.length > 0) {
    let best: { record: DriftAnalysisRecord; added: string[]; tie: string } | null = null;
    for (const record of remaining) {
      const added = strataOf(record)
        .map(stratumKey)
        .filter((key) => !covered.has(key));
      const unique = [...new Set(added)].sort();
      const tie = contentFingerprint([SAMPLE_ALGORITHM_VERSION, fingerprint, record.workflow_id]);
      if (
        !best ||
        unique.length > best.added.length ||
        (unique.length === best.added.length && tie < best.tie)
      ) {
        best = { record, added: unique, tie };
      }
    }
    if (!best) break;
    if (best.added.length === 0 && selected.length >= Math.min(floor, population.length)) break;
    selected.push({
      workflow_id: best.record.workflow_id,
      inclusion_reason:
        best.added.length > 0
          ? `Adds ${best.added.length} previously uncovered strata.`
          : "Strata coverage is already saturated; included deterministically to reach the minimum sample size.",
      strata_added: best.added,
    });
    for (const key of best.added) covered.add(key);
    remaining.splice(
      remaining.findIndex((record) => record.workflow_id === best!.record.workflow_id),
      1,
    );
  }

  return {
    algorithm_version: SAMPLE_ALGORITHM_VERSION,
    population_fingerprint: fingerprint,
    population_size: population.length,
    cap,
    floor,
    selected,
    strata_covered: [...covered].sort(),
    strata_uncovered: [...allStrata].filter((key) => !covered.has(key)).sort(),
  };
}

export interface ProposalBatch {
  batch_id: string;
  proposal_basis_fingerprint: string;
  proposed_resolution: ProposedResolution;
  proposal_basis: string;
  member_workflow_ids: string[];
}

/**
 * Batches of records whose basis is identical in every recorded dimension.
 *
 * Mandatory-review records are excluded by construction, not by filtering after
 * the fact. A batch is a convenience for reading, never for deciding.
 */
export function buildProposalBatches(records: DriftAnalysisRecord[]): ProposalBatch[] {
  const groups = new Map<string, DriftAnalysisRecord[]>();
  for (const record of records) {
    if (!record.batch_eligible) continue;
    const existing = groups.get(record.proposal_basis_fingerprint) ?? [];
    existing.push(record);
    groups.set(record.proposal_basis_fingerprint, existing);
  }
  return [...groups.entries()]
    .filter(([, members]) => members.length > 1)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fingerprint, members], index) => ({
      batch_id: `DRIFT-BATCH-${String(index + 1).padStart(3, "0")}`,
      proposal_basis_fingerprint: fingerprint,
      proposed_resolution: members[0]!.proposed_resolution,
      proposal_basis: members[0]!.proposal_basis,
      member_workflow_ids: members.map((record) => record.workflow_id).sort(),
    }));
}
