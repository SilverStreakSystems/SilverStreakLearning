/**
 * TDP-001 — the governed technology decision process.
 *
 * This module holds the CONTRACT: the seven options, the precedence order, the
 * questions, and the invariants that constrain any answer. It is planning
 * scope. Nothing here authorizes building, activates a role, creates an
 * obligation, or makes an operational determination about a person.
 *
 * TDP-001 is deliberately separate from the governance namespace. A decision
 * option is never a governance Decision (DEC-), an invariant here is never a
 * governance Finding (FND-), and an evaluator result is never Evidence (EV-).
 */
import { z } from "zod";

export const DECISION_PROCESS_ID = "TDP-001";

export const OPTION_IDS = ["OPT-1", "OPT-2", "OPT-3", "OPT-4", "OPT-5", "OPT-6", "OPT-7"] as const;
export type OptionId = (typeof OPTION_IDS)[number];

export const AI_BOUNDARY_CLASSES = [
  "prohibited",
  "unnecessary",
  "optional",
  "helpful",
  "required",
] as const;
export type AiBoundaryClass = (typeof AI_BOUNDARY_CLASSES)[number];

export const DATA_SENSITIVITY_CLASSES = [
  "public",
  "operational",
  "personal",
  "highly-sensitive-personal",
  "unclear",
] as const;
export type DataSensitivityClass = (typeof DATA_SENSITIVITY_CLASSES)[number];

export const PERMISSION_COMPLEXITY_LEVELS = [
  "simple",
  "role-based",
  "restricted",
  "unclear",
] as const;
export type PermissionComplexity = (typeof PERMISSION_COMPLEXITY_LEVELS)[number];

export const CONSEQUENCE_CLASSES = [
  "none",
  "eligibility",
  "placement",
  "grading",
  "discipline",
  "safety",
  "employment",
  "medical",
  "legal",
] as const;
export type ConsequenceClass = (typeof CONSEQUENCE_CLASSES)[number];

/** A consequence class other than `none` is a determination AI may not make. */
export function isConsequential(value: ConsequenceClass): boolean {
  return value !== "none";
}

export const QUESTION_IDS = [
  "human_process_sufficient",
  "workspace_tool_fits",
  "output_predictable",
  "repeatable_routing",
  "authoritative_record_required",
  "relational_data_required",
  "longitudinal_data_required",
  "cross_role_workflow",
  "permission_complexity",
  "audit_history_required",
  "interpretation_required",
  "deterministic_core_available",
  "consequence_class",
  "student_facing_output",
  "data_sensitivity",
] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export type Ternary = "yes" | "no" | "uncertain";

/** One complete set of answers. Every question must be answered, including with `uncertain`. */
export interface DecisionAnswers {
  human_process_sufficient: Ternary;
  workspace_tool_fits: Ternary;
  output_predictable: Ternary;
  repeatable_routing: Ternary;
  authoritative_record_required: Ternary;
  relational_data_required: Ternary;
  longitudinal_data_required: Ternary;
  cross_role_workflow: Ternary;
  permission_complexity: PermissionComplexity | "uncertain";
  audit_history_required: Ternary;
  interpretation_required: Ternary;
  deterministic_core_available: Ternary;
  consequence_class: ConsequenceClass | "uncertain";
  student_facing_output: Ternary;
  data_sensitivity: DataSensitivityClass | "uncertain";
}

const ternary = z.enum(["yes", "no", "uncertain"]);

export const decisionAnswersSchema = z.object({
  human_process_sufficient: ternary,
  workspace_tool_fits: ternary,
  output_predictable: ternary,
  repeatable_routing: ternary,
  authoritative_record_required: ternary,
  relational_data_required: ternary,
  longitudinal_data_required: ternary,
  cross_role_workflow: ternary,
  permission_complexity: z.enum([...PERMISSION_COMPLEXITY_LEVELS, "uncertain"]),
  audit_history_required: ternary,
  interpretation_required: ternary,
  deterministic_core_available: ternary,
  consequence_class: z.enum([...CONSEQUENCE_CLASSES, "uncertain"]),
  student_facing_output: ternary,
  data_sensitivity: z.enum([...DATA_SENSITIVITY_CLASSES, "uncertain"]),
}) satisfies z.ZodType<DecisionAnswers>;

export const decisionOptionSchema = z.object({
  option_id: z.enum(OPTION_IDS),
  ordinal: z.number().int().min(1).max(7),
  name: z.string().min(1),
  short_name: z.string().min(1),
  use_when: z.string().min(1),
  determinism: z.enum(["deterministic", "non-deterministic", "mixed", "not-applicable"]),
  implementation_burden: z.enum(["none", "low", "moderate", "high"]),
  human_review_burden: z.enum(["unchanged", "increased"]),
});
export type DecisionOption = z.infer<typeof decisionOptionSchema>;

export const precedenceStepSchema = z.object({
  step: z.number().int().min(1),
  step_id: z.string().min(1),
  question_id: z.enum(QUESTION_IDS).nullable(),
  decides: z.string().min(1),
  explanation: z.string().min(1),
});
export type PrecedenceStep = z.infer<typeof precedenceStepSchema>;

export const decisionQuestionSchema = z.object({
  question_id: z.enum(QUESTION_IDS),
  prompt: z.string().min(1),
  help: z.string().min(1).optional(),
  answers: z.array(z.string().min(1)).min(2),
});
export type DecisionQuestion = z.infer<typeof decisionQuestionSchema>;

export const decisionInvariantSchema = z.object({
  invariant_id: z.string().regex(/^TDP-INV-\d{2}$/),
  statement: z.string().min(1),
  enforced_by: z.string().min(1),
});
export type DecisionInvariant = z.infer<typeof decisionInvariantSchema>;

const labelledClassSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  meaning: z.string().min(1),
});

export const decisionProcessSchema = z.object({
  schema_version: z.literal("1.0.0"),
  process_id: z.literal(DECISION_PROCESS_ID),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  adopted_on: z.string().min(1),
  authority_note: z.string().min(1),
  source_reference: z.string().min(1),
  options: z.array(decisionOptionSchema).length(7),
  precedence: z.array(precedenceStepSchema).min(1),
  questions: z.array(decisionQuestionSchema).min(1),
  invariants: z.array(decisionInvariantSchema).min(1),
  ai_boundary_classes: z.array(labelledClassSchema).min(1),
  data_sensitivity_classes: z.array(labelledClassSchema).min(1),
  permission_complexity_levels: z.array(labelledClassSchema).min(1),
  override_requirements: z.object({
    requires_rationale: z.literal(true),
    requires_reviewer: z.literal(true),
    mutates_derived_result: z.literal(false),
    mutates_source_recommendation: z.literal(false),
    statement: z.string().min(1),
  }),
  abstention: z.object({
    outcome_id: z.literal("UNRESOLVED"),
    statement: z.string().min(1),
  }),
});
export type DecisionProcess = z.infer<typeof decisionProcessSchema>;

/**
 * An override of a derived result. It is an ADDITIONAL record placed beside the
 * derived result: it never edits the derived result and never edits the
 * supplied source recommendation.
 */
export const decisionOverrideSchema = z.object({
  workflow_id: z.string().min(1),
  chosen_option_ids: z.array(z.enum(OPTION_IDS)).min(1),
  rationale: z.string().trim().min(1, "an override requires a written rationale"),
  reviewer: z.string().trim().min(1, "an override requires a named reviewer"),
  recorded_on: z.string().min(1),
});
export type DecisionOverride = z.infer<typeof decisionOverrideSchema>;
