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
  classifyWorkflow,
  decisionAnswersSchema,
  decisionProcessSchema,
  evaluate,
  readSuppliedOptions,
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
  drift: DriftAssessment;
}

function sameSet(a: OptionId[], b: OptionId[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function subsetOf(a: OptionId[], b: OptionId[]): boolean {
  return a.every((id) => b.includes(id));
}

function assessDrift(supplied: OptionId[], evaluation: EvaluationResult): DriftAssessment {
  const derived = evaluation.optionIds;
  if (supplied.length === 0) {
    return {
      status: "source-unreadable",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      explanation:
        "The supplied recommendation does not name an option number that can be read mechanically, so the two cannot be compared.",
    };
  }
  if (evaluation.outcome === "unresolved") {
    return {
      status: "derived-unresolved",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      explanation:
        "The evaluator abstained, so there is no derived result to compare against the supplied recommendation.",
    };
  }
  if (sameSet(supplied, derived)) {
    return {
      status: "agrees",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      explanation: "The derived option set matches the supplied recommendation.",
    };
  }
  if (subsetOf(derived, supplied)) {
    return {
      status: "derived-narrower",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      explanation: "The evaluator reaches a smaller option set than the source recommended.",
    };
  }
  if (subsetOf(supplied, derived)) {
    return {
      status: "derived-broader",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      explanation: "The evaluator reaches a larger option set than the source recommended.",
    };
  }
  return {
    status: "differs",
    suppliedOptionIds: supplied,
    derivedOptionIds: derived,
    explanation: "The evaluator and the source recommend different options.",
  };
}

function analyze(record: WorkflowRecord): AnalyzedWorkflow {
  const derived = classifyWorkflow(record.source);
  const answers = decisionAnswersSchema.parse(toDecisionAnswers(derived));
  const evaluation = evaluate(answers);
  return {
    record,
    derived,
    answers,
    evaluation,
    drift: assessDrift(readSuppliedOptions(record.source.recommended_solution), evaluation),
  };
}

let analyzedCache: AnalyzedWorkflow[] | null = null;

/** Every analyzed workflow, derived once and memoized. */
export function analyzedWorkflows(): AnalyzedWorkflow[] {
  analyzedCache ??= WORKFLOW_REGISTER.records.map(analyze);
  return analyzedCache;
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
