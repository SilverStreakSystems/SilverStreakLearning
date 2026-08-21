/**
 * The normalized workflow register — one record per analyzed workflow row.
 *
 * Everything under `source` is verbatim owner-supplied text. It is never
 * edited, never corrected, and never overwritten by anything this application
 * derives. Derived values live in a separate namespace so the two can always be
 * told apart on screen and in tests.
 */
import { z } from "zod";
import { type OptionId, type QuestionId } from "./decision-process";

export const SOURCE_FIELDS = [
  "role",
  "responsibilities",
  "workflow",
  "inputs",
  "outputs",
  "system_of_record",
  "rules_based_option",
  "google_workspace_option",
  "automation_option",
  "ssls_application_need",
  "ai_contribution",
  "ai_necessity",
  "human_approval",
  "permissions",
  "risk_level",
  "audit_evidence",
  "recommended_solution",
  "future_maturity_provisional",
] as const;
export type SourceField = (typeof SOURCE_FIELDS)[number];

const sourceText = z.string();

export const workflowSourceSchema = z.object({
  role: sourceText,
  responsibilities: sourceText,
  workflow: sourceText,
  inputs: sourceText,
  outputs: sourceText,
  system_of_record: sourceText,
  rules_based_option: sourceText,
  google_workspace_option: sourceText,
  automation_option: sourceText,
  ssls_application_need: sourceText,
  ai_contribution: sourceText,
  ai_necessity: sourceText,
  human_approval: sourceText,
  permissions: sourceText,
  risk_level: sourceText,
  audit_evidence: sourceText,
  recommended_solution: sourceText,
  future_maturity_provisional: sourceText,
});
export type WorkflowSource = z.infer<typeof workflowSourceSchema>;

export const workflowRecordSchema = z.object({
  workflow_id: z.string().regex(/^TDW-[A-R]-\d{3}$/),
  role_group_id: z.string().regex(/^[A-R]$/),
  role_group_name: z.string().min(1),
  source_artifact_id: z.literal("TDS-001"),
  source_worksheet: z.string().min(1),
  source_row: z.number().int().min(2),
  source_row_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  source: workflowSourceSchema,
});
export type WorkflowRecord = z.infer<typeof workflowRecordSchema>;

export const worksheetSummarySchema = z.object({
  worksheet: z.string().min(1),
  role_group_id: z.string().regex(/^[A-R]$/),
  role_group_name: z.string().min(1),
  header_fields: z.array(z.string()).length(18),
  workflow_rows: z.number().int().min(1),
  roles_counted_in_group: z.number().int().min(1),
  roles_declared_in_inventory: z.number().int().nullable(),
  worksheet_sha256: z.string().regex(/^[0-9a-f]{64}$/),
});
export type WorksheetSummary = z.infer<typeof worksheetSummarySchema>;

export const workflowRegisterSchema = z.object({
  schema_version: z.literal("1.0.0"),
  register_id: z.string().min(1),
  source_artifact_id: z.literal("TDS-001"),
  field_order: z.array(z.enum(SOURCE_FIELDS)).length(18),
  authority_note: z.string().min(1),
  totals: z.object({
    worksheets: z.number().int(),
    groups: z.number().int(),
    workflows: z.number().int(),
    fields: z.number().int(),
    rolesCountedInGroups: z.number().int(),
    rolesGloballyDistinct: z.number().int(),
    aiNecessity: z.record(z.string(), z.number().int()),
    riskLevel: z.record(z.string(), z.number().int()),
  }),
  worksheets: z.array(worksheetSummarySchema).min(1),
  records: z.array(workflowRecordSchema).min(1),
});
export type WorkflowRegister = z.infer<typeof workflowRegisterSchema>;

/** One derived answer, always carrying the source field it was derived from. */
export interface DerivedAnswer<T extends string = string> {
  value: T;
  basis: string;
  basisFields: SourceField[];
}

export type DerivedAnswers = Record<QuestionId, DerivedAnswer>;

export const DRIFT_STATUSES = [
  "agrees",
  "derived-narrower",
  "derived-broader",
  "differs",
  "derived-unresolved",
  "source-unreadable",
] as const;
export type DriftStatus = (typeof DRIFT_STATUSES)[number];

export interface DriftAssessment {
  status: DriftStatus;
  suppliedOptionIds: OptionId[];
  derivedOptionIds: OptionId[];
  explanation: string;
}
