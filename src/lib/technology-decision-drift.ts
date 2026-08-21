/**
 * Drift analysis over the whole workflow register.
 *
 * This module assembles analysis records. It cannot record an owner decision:
 * every record it emits has `owner_disposition: null`, `review_status:
 * "NOT-REVIEWED"`, and `owner_decision_id: null`, and there is no code path
 * here that sets any of the three to anything else. Regenerating the analysis
 * therefore cannot overwrite a decision, because no decision is ever stored in
 * it.
 */
import {
  type DriftAnalysisRecord,
  type ProposalBatch,
  type SampleSelection,
  ANALYSIS_SCHEMA_VERSION,
  CLASSIFIER_VERSION,
  FINGERPRINT_ALGORITHM,
  PARSER_VERSION,
  buildProposalBatches,
  contentFingerprint,
  isStudentOrFamilyFacing,
  proposalBasisFingerprint,
  readCandidateCauses,
  readDecisionDrivers,
  readDefectState,
  readEvidenceState,
  readMandatoryReview,
  readProgramAreas,
  readProposedResolution,
  readRiskLevel,
  selectRepresentativeSample,
} from "../domain/technology-decisions";
import {
  type AnalyzedWorkflow,
  DECISION_PROCESS,
  WORKFLOW_REGISTER,
  analysisFingerprint,
  analyzedWorkflows,
} from "./technology-decision-registry";

export const EVALUATOR_VERSION = DECISION_PROCESS.version;

/** Categories that may never be resolved as part of a batch. */
function batchProhibited(record: DriftAnalysisRecord): boolean {
  return (
    record.mandatory_review ||
    record.evidence_state !== "SUFFICIENT" ||
    record.defect_state !== "NONE" ||
    record.candidate_causes.includes("POLICY-CHOICE") ||
    record.unresolved_question !== null
  );
}

export function toAnalysisRecord(item: AnalyzedWorkflow): DriftAnalysisRecord {
  const { record, derived, evaluation, expression, comparison } = item;
  const risk = readRiskLevel(record.source.risk_level);
  const consequential =
    derived.consequence_class?.value !== "none" && derived.consequence_class?.value !== "uncertain";
  const studentOrFamilyFacing = isStudentOrFamilyFacing(record);
  const drivers = readDecisionDrivers(derived, evaluation);
  const evidence = readEvidenceState(expression, derived, evaluation);
  const defect = readDefectState(expression, evaluation);
  const causes = readCandidateCauses(comparison, expression, evidence, drivers);
  const aiOptions = ["OPT-5", "OPT-6"];
  const aiBoundaryConflict = aiOptions.some(
    (id) =>
      comparison.suppliedOptionIds.includes(id as never) !==
      comparison.derivedOptionIds.includes(id as never),
  );
  const aiProhibitedInSource = /prohibit/i.test(record.source.ai_necessity);
  const mandatory = readMandatoryReview({
    risk,
    consequential,
    studentOrFamilyFacing,
    aiBoundaryConflict,
    aiProhibitedInSource,
    evidence,
    relation: comparison.relation,
  });
  const unresolvedQuestion =
    evaluation.unresolvedQuestions.length > 0
      ? `The evaluator could not answer: ${evaluation.unresolvedQuestions.join(", ")}.`
      : expression.parseStatus !== "parsed"
        ? "The supplied recommendation cannot be read as one committed option set."
        : null;
  const proposal = readProposedResolution({
    relation: comparison.relation,
    evidence,
    defect,
    mandatory: mandatory.mandatory,
  });
  const fingerprint = proposalBasisFingerprint({
    relation: comparison.relation,
    evidence,
    defect,
    drivers,
    causes,
    risk,
    resolution: proposal.resolution,
    suppliedOptionIds: comparison.suppliedOptionIds,
    derivedOptionIds: comparison.derivedOptionIds,
  });

  const analysis: DriftAnalysisRecord = {
    workflow_id: record.workflow_id,
    role_group_id: record.role_group_id,
    role_group_name: record.role_group_name,
    role: record.source.role,
    workflow: record.source.workflow,
    source_recommendation_verbatim: record.source.recommended_solution,
    source_risk_level_verbatim: record.source.risk_level,
    source_ai_necessity_verbatim: record.source.ai_necessity,
    expression_type: expression.expressionType,
    parse_status: expression.parseStatus,
    parse_diagnostics: expression.diagnostics,
    supplied_option_ids: expression.primaryOptionIds,
    supplied_deferred_option_ids: expression.deferredOptionIds,
    supplied_excluded_option_ids: expression.excludedOptionIds,
    derived_option_ids: evaluation.optionIds,
    derived_outcome: evaluation.outcome,
    deciding_step: evaluation.decidedAtStep,
    evaluator_rationale: evaluation.rationale,
    invariants_applied: evaluation.invariantsApplied,
    ai_boundary: evaluation.aiBoundary,
    unresolved_questions: evaluation.unresolvedQuestions,
    comparison_relation: comparison.relation,
    comparison_explanation: comparison.explanation,
    risk_level: risk,
    program_areas: readProgramAreas(record),
    student_or_family_facing: studentOrFamilyFacing,
    consequential,
    cross_role: derived.cross_role_workflow?.value === "yes",
    record_authority_needed: derived.authoritative_record_required?.value === "yes",
    longitudinal_needed: derived.longitudinal_data_required?.value === "yes",
    decision_drivers: drivers,
    evidence_state: evidence,
    defect_state: defect,
    candidate_causes: causes,
    unresolved_question: unresolvedQuestion,
    mandatory_review: mandatory.mandatory,
    mandatory_review_reasons: mandatory.reasons,
    batch_eligible: false,
    proposed_resolution: proposal.resolution,
    proposal_basis: proposal.basis,
    proposal_basis_fingerprint: fingerprint,
    owner_disposition: null,
    review_status: "NOT-REVIEWED",
    owner_decision_id: null,
  };
  return { ...analysis, batch_eligible: !batchProhibited(analysis) };
}

let cache: { key: string; records: DriftAnalysisRecord[] } | null = null;

/** One analysis record for every workflow in the register, in register order. */
export function driftAnalysisRecords(): DriftAnalysisRecord[] {
  const key = analysisFingerprint();
  if (cache?.key === key) return cache.records;
  const records = analyzedWorkflows().map(toAnalysisRecord);
  cache = { key, records };
  return records;
}

export function nonIdenticalRecords(): DriftAnalysisRecord[] {
  return driftAnalysisRecords().filter((record) => record.comparison_relation !== "EXACT");
}

export function mandatoryCohort(): DriftAnalysisRecord[] {
  return nonIdenticalRecords().filter((record) => record.mandatory_review);
}

export function samplePopulation(): DriftAnalysisRecord[] {
  return nonIdenticalRecords().filter((record) => !record.mandatory_review);
}

export const SAMPLE_CAP = 48;
export const SAMPLE_FLOOR = 36;

export function representativeSample(): SampleSelection {
  return selectRepresentativeSample(samplePopulation(), SAMPLE_CAP, SAMPLE_FLOOR);
}

export function proposalBatches(): ProposalBatch[] {
  return buildProposalBatches(nonIdenticalRecords());
}

/**
 * A deterministic negative control drawn from the agreements: if the mechanism
 * were producing spurious relations, these records would not stay EXACT.
 */
export function negativeControls(): DriftAnalysisRecord[] {
  return driftAnalysisRecords()
    .filter((record) => record.comparison_relation === "EXACT")
    .sort((a, b) =>
      contentFingerprint(["negative-control", a.workflow_id]).localeCompare(
        contentFingerprint(["negative-control", b.workflow_id]),
      ),
    )
    .slice(0, 12)
    .sort((a, b) => a.workflow_id.localeCompare(b.workflow_id));
}

export interface DriftAnalysisDocument {
  authority_status: "GENERATED-NONAUTHORITATIVE";
  authority_note: string;
  schema_version: string;
  analysis_schema_version: string;
  fingerprint_algorithm: string;
  generation_fingerprint: string;
  workflow_register_fingerprint: string;
  decision_process_id: string;
  decision_process_version: string;
  parser_version: string;
  evaluator_version: string;
  classifier_version: string;
  totals: {
    workflows: number;
    non_identical: number;
    mandatory_review: number;
    batch_eligible: number;
    relations: Record<string, number>;
    evidence_states: Record<string, number>;
    candidate_causes: Record<string, number>;
    proposed_resolutions: Record<string, number>;
  };
  records: DriftAnalysisRecord[];
  batches: ProposalBatch[];
}

function tally(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

export function driftAnalysisDocument(): DriftAnalysisDocument {
  const records = driftAnalysisRecords();
  const batches = proposalBatches();
  const body = {
    authority_status: "GENERATED-NONAUTHORITATIVE" as const,
    authority_note:
      "Generated analysis and engineering proposals. No entry here is an owner disposition, and nothing here authorizes implementation, activates a workflow, or closes a gate.",
    schema_version: "1.0.0",
    analysis_schema_version: ANALYSIS_SCHEMA_VERSION,
    fingerprint_algorithm: FINGERPRINT_ALGORITHM,
    workflow_register_fingerprint: contentFingerprint(WORKFLOW_REGISTER),
    decision_process_id: DECISION_PROCESS.process_id,
    decision_process_version: DECISION_PROCESS.version,
    parser_version: PARSER_VERSION,
    evaluator_version: EVALUATOR_VERSION,
    classifier_version: CLASSIFIER_VERSION,
    totals: {
      workflows: records.length,
      non_identical: records.filter((record) => record.comparison_relation !== "EXACT").length,
      mandatory_review: records.filter((record) => record.mandatory_review).length,
      batch_eligible: records.filter((record) => record.batch_eligible).length,
      relations: tally(records.map((record) => record.comparison_relation)),
      evidence_states: tally(records.map((record) => record.evidence_state)),
      candidate_causes: tally(records.flatMap((record) => record.candidate_causes)),
      proposed_resolutions: tally(records.map((record) => record.proposed_resolution)),
    },
    records,
    batches,
  };
  return { ...body, generation_fingerprint: contentFingerprint(body) };
}
