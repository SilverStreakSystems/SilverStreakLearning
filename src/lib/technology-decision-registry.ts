/**
 * Technology decision registry — the one place this application reads the
 * normalized future-state analysis, the TDP-001 contract, and the Product
 * Alpha fit assessment.
 *
 * Everything here is planning scope. Nothing in this module activates a role,
 * authorizes an implementation, closes a finding, or changes Gate A. Supplied
 * source text and derived analysis are kept in separate fields so a reader can
 * always tell which is which.
 */
import decisionProcessJson from "../../data/technology-decisions/decision-process.json";
import productAlphaJson from "../../data/technology-decisions/product-alpha-assessment.json";
import sourcesJson from "../../data/technology-decisions/sources.json";
import registerJson from "../../data/technology-decisions/workflow-decisions.json";
import {
  type DecisionAnswers,
  type DecisionProcess,
  type DerivedAnswers,
  type DriftAssessment,
  type EvaluationResult,
  type OptionId,
  type WorkflowRecord,
  type WorkflowRegister,
  type WorksheetSummary,
  type ComparisonResult,
  type SourceExpression,
  CLASSIFIER_VERSION,
  PARSER_VERSION,
  classifyWorkflow,
  compareRecommendation,
  contentFingerprint,
  decisionAnswersSchema,
  decisionProcessSchema,
  evaluate,
  parseSourceRecommendation,
  toDecisionAnswers,
  workflowRegisterSchema,
} from "../domain/technology-decisions";

export const DECISION_PROCESS: DecisionProcess = decisionProcessSchema.parse(decisionProcessJson);
export const WORKFLOW_REGISTER: WorkflowRegister = workflowRegisterSchema.parse(registerJson);

export interface SourceArtifact {
  source_artifact_id: string;
  filename: string;
  media_type: string;
  byte_size: number;
  sha256: string;
  declared_version: string;
  declared_date: string;
  authority_role: string;
  canonical_status: string;
  acquisition_method: string;
  retention_state: string;
  locator: string;
  role: string;
  normalized_into: string;
  limitations: string[];
}

export interface SourceRegister {
  schema_version: string;
  registered_on: string;
  register_id: string;
  source_boundary: string;
  retention_limitation: string;
  records: SourceArtifact[];
  reconciliation: {
    performed_on: string;
    method: string;
    expected_vs_observed: string;
    explained_difference: string;
    unresolved: string[];
  };
}

export const SOURCE_REGISTER = sourcesJson as SourceRegister;

/** A workflow row with its verbatim source and its independently derived analysis. */
export interface AnalyzedWorkflow {
  record: WorkflowRecord;
  derived: DerivedAnswers;
  answers: DecisionAnswers;
  evaluation: EvaluationResult;
  /** How the supplied recommendation was read. Never a replacement for it. */
  expression: SourceExpression;
  /** The single resolved relation between supplied and derived option sets. */
  comparison: ComparisonResult;
  /** Legacy coarse status, derived from `comparison`. Kept for existing views. */
  drift: DriftAssessment;
}

/**
 * The coarse legacy status is a projection of the resolved relation, so the two
 * can never disagree.
 */
function toLegacyStatus(comparison: ComparisonResult): DriftAssessment {
  const shared = {
    suppliedOptionIds: comparison.suppliedOptionIds,
    derivedOptionIds: comparison.derivedOptionIds,
    explanation: comparison.explanation,
  };
  switch (comparison.relation) {
    case "EXACT":
      return { status: "agrees", ...shared };
    case "DERIVED-PROPER-SUBSET":
      return { status: "derived-narrower", ...shared };
    case "DERIVED-PROPER-SUPERSET":
      return { status: "derived-broader", ...shared };
    case "SOURCE-UNPARSEABLE":
      return { status: "source-unreadable", ...shared };
    case "DERIVED-ABSTAIN":
      return { status: "derived-unresolved", ...shared };
    default:
      return { status: "differs", ...shared };
  }
}

function analyze(record: WorkflowRecord): AnalyzedWorkflow {
  const derived = classifyWorkflow(record.source);
  const answers = decisionAnswersSchema.parse(toDecisionAnswers(derived));
  const evaluation = evaluate(answers);
  const expression = parseSourceRecommendation(record.source.recommended_solution);
  const comparison = compareRecommendation(expression, evaluation);
  return {
    record,
    derived,
    answers,
    evaluation,
    expression,
    comparison,
    drift: toLegacyStatus(comparison),
  };
}

/**
 * The fingerprint of every input the analysis depends on.
 *
 * The cache is keyed by this value rather than held in a bare module variable,
 * so a changed register, a changed TDP contract, or a changed parser version
 * cannot serve a stale analysis. Reordering source rows changes nothing but the
 * order of the output, so the fingerprint is computed over sorted records.
 */
export function analysisFingerprint(): string {
  return contentFingerprint({
    parser_version: PARSER_VERSION,
    classifier_version: CLASSIFIER_VERSION,
    decision_process: DECISION_PROCESS,
    records: [...WORKFLOW_REGISTER.records].sort((a, b) =>
      a.workflow_id.localeCompare(b.workflow_id),
    ),
  });
}

const analyzedCache = new Map<string, AnalyzedWorkflow[]>();

/** Every analyzed workflow, derived once per distinct input fingerprint. */
export function analyzedWorkflows(): AnalyzedWorkflow[] {
  const key = analysisFingerprint();
  const cached = analyzedCache.get(key);
  if (cached) return cached;
  const computed = WORKFLOW_REGISTER.records.map(analyze);
  analyzedCache.set(key, computed);
  return computed;
}

export function workflowById(workflowId: string): AnalyzedWorkflow | undefined {
  return analyzedWorkflows().find((item) => item.record.workflow_id === workflowId);
}

export interface RoleGroupSummary extends WorksheetSummary {
  workflows: AnalyzedWorkflow[];
}

export function roleGroups(): RoleGroupSummary[] {
  const groups = WORKFLOW_REGISTER.worksheets;
  return groups.map((sheet) => ({
    ...sheet,
    workflows: analyzedWorkflows().filter(
      (item) => item.record.role_group_id === sheet.role_group_id,
    ),
  }));
}

export function roleGroupById(groupId: string): RoleGroupSummary | undefined {
  return roleGroups().find((group) => group.role_group_id === groupId);
}

/** Distinct role labels within each group, summed. Matches the declared inventory. */
export function rolesCountedInGroups(): number {
  return WORKFLOW_REGISTER.worksheets.reduce(
    (total, sheet) => total + sheet.roles_counted_in_group,
    0,
  );
}

/** Distinct role labels across the whole register. One lower, because one label spans two groups. */
export function rolesGloballyDistinct(): number {
  return new Set(analyzedWorkflows().map((item) => item.record.source.role.trim())).size;
}

function tally<T extends string>(values: T[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

export interface RegisterTotals {
  workflows: number;
  groups: number;
  rolesCountedInGroups: number;
  rolesGloballyDistinct: number;
  aiNecessity: Record<string, number>;
  riskLevel: Record<string, number>;
  derivedOptions: Record<string, number>;
  drift: Record<string, number>;
  abstentions: number;
  aiProhibited: number;
  requiresNamedApprover: number;
}

export function registerTotals(): RegisterTotals {
  const items = analyzedWorkflows();
  const derivedOptions: Record<string, number> = {};
  for (const item of items) {
    const key = item.evaluation.optionIds.join(" + ") || "UNRESOLVED";
    derivedOptions[key] = (derivedOptions[key] ?? 0) + 1;
  }
  return {
    workflows: items.length,
    groups: WORKFLOW_REGISTER.worksheets.length,
    rolesCountedInGroups: rolesCountedInGroups(),
    rolesGloballyDistinct: rolesGloballyDistinct(),
    aiNecessity: tally(items.map((item) => item.record.source.ai_necessity.trim() || "unstated")),
    riskLevel: tally(items.map((item) => item.record.source.risk_level.trim() || "unstated")),
    derivedOptions,
    drift: tally(items.map((item) => item.drift.status)),
    abstentions: items.filter((item) => item.evaluation.outcome === "unresolved").length,
    aiProhibited: items.filter((item) => item.evaluation.aiBoundary === "prohibited").length,
    requiresNamedApprover: items.filter((item) => item.evaluation.requiresNamedApprover).length,
  };
}

export interface ProductAlphaStep {
  step_id: string;
  step: string;
  surface: string;
  belongs_in_ssls: "yes" | "no" | "partly" | "only-as-a-view";
  reason: string;
  data_needs: string;
  audit_needs: string;
  deterministic_boundary: string;
  human_review: string;
  prohibited_interpretation: string;
  answers: DecisionAnswers;
}

interface ProductAlphaAssessmentJson {
  schema_version: string;
  assessment_id: string;
  assessed_on: string;
  subject: string;
  authority_note: string;
  method: string;
  records: ProductAlphaStep[];
}

const PRODUCT_ALPHA = productAlphaJson as ProductAlphaAssessmentJson;

export interface AssessedProductAlphaStep extends ProductAlphaStep {
  evaluation: EvaluationResult;
}

export function productAlphaAssessment(): {
  meta: Omit<ProductAlphaAssessmentJson, "records">;
  steps: AssessedProductAlphaStep[];
} {
  const { records, ...meta } = PRODUCT_ALPHA;
  return {
    meta,
    steps: records.map((step) => ({
      ...step,
      evaluation: evaluate(decisionAnswersSchema.parse(step.answers)),
    })),
  };
}

export function optionById(optionId: OptionId) {
  const option = DECISION_PROCESS.options.find((item) => item.option_id === optionId);
  if (!option) throw new Error(`unknown option ${optionId}`);
  return option;
}

/** The verbatim decision-process prompt for a question identifier. */
export function questionPrompt(questionId: string): string {
  return (
    DECISION_PROCESS.questions.find((item) => item.question_id === questionId)?.prompt ??
    questionId.replaceAll("_", " ")
  );
}

/** Alias kept explicit so route modules read as intent, not lookup mechanics. */
export function analyzedWorkflowById(workflowId: string): AnalyzedWorkflow | undefined {
  return workflowById(workflowId);
}

/** Short label for an option set, e.g. "Option 2 + Option 3". */
export function describeOptions(optionIds: OptionId[]): string {
  if (optionIds.length === 0) return "No recommendation — evaluator abstained";
  return optionIds.map((id) => `Option ${optionById(id).ordinal}`).join(" + ");
}
