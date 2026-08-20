/**
 * Product Alpha 001 — canonical learning-loop record schemas.
 *
 * These are PRODUCT records, not governance records. A LearningObservationRecord
 * is never a governance Evidence record, a GoalReviewRecord is never a
 * governance Validation, and a SupportActionRecord is never an Action Center
 * item. The namespaces are deliberately separate so neither model can silently
 * absorb the other.
 *
 * Every record in this namespace is synthetic by construction. There is no path
 * in this module, or in anything that consumes it, that accepts a real learner.
 */
import { z } from "zod";

export const LEARNING_LOOP_APPLICATION = "ssls-product-alpha-001";
export const LEARNING_LOOP_SCHEMA_VERSION = 1;
export const LEARNING_LOOP_SEED_VERSION = 1;

/** Record-id prefixes. Distinct from every governance prefix (DEC-, EV-, FND-). */
export const ID_PREFIX = {
  learner: "LRN",
  goal: "GOL",
  observation: "OBS",
  supportAction: "SUP",
  goalReview: "REV",
} as const;

/** Prefixes this namespace must never mint, because governance owns them. */
export const RESERVED_GOVERNANCE_PREFIXES = ["EV", "EVD", "DEC", "FND", "WP", "CHECKPOINT"] as const;

const RFC_3339 =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;

export const timestamp = z
  .string()
  .regex(RFC_3339, "must be an RFC 3339 timestamp")
  .refine((value) => !Number.isNaN(Date.parse(value)), "must be a real instant");

function identifier(prefix: string) {
  return z.string().regex(new RegExp(`^${prefix}-[A-Za-z0-9]{1,32}$`), `must be a ${prefix}- id`);
}

const syntheticFlag = z.literal(true);
const shortText = z.string().trim().min(1).max(160);
const longText = z.string().trim().min(1).max(2000);

export const GRADE_BANDS = [
  "early-elementary",
  "upper-elementary",
  "middle",
  "high",
  "transition",
  "unspecified",
] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export const GRADE_BAND_LABEL: Record<GradeBand, string> = {
  "early-elementary": "Early elementary",
  "upper-elementary": "Upper elementary",
  middle: "Middle school",
  high: "High school",
  transition: "Transition",
  unspecified: "Not specified",
};

export const LEARNER_STATES = ["active", "archived"] as const;
export const LEARNER_ORIGINS = ["seed", "founder-operator"] as const;

export const GOAL_STATUSES = ["active", "paused", "achieved", "withdrawn"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_STATUS_LABEL: Record<GoalStatus, string> = {
  active: "Working on it",
  paused: "Paused",
  achieved: "Criterion met",
  withdrawn: "Withdrawn",
};

export const OBSERVATION_SOURCE_KINDS = [
  "direct-observation",
  "work-sample",
  "progress-check",
  "staff-note",
  "learner-self-report",
] as const;
export type ObservationSourceKind = (typeof OBSERVATION_SOURCE_KINDS)[number];

export const OBSERVATION_SOURCE_LABEL: Record<ObservationSourceKind, string> = {
  "direct-observation": "Something I watched happen",
  "work-sample": "A piece of learner work",
  "progress-check": "A short progress check",
  "staff-note": "A note from another staff member",
  "learner-self-report": "What the learner said about it",
};

export const SUPPORT_STATUSES = ["planned", "completed", "cancelled"] as const;
export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

export const SUPPORT_STATUS_LABEL: Record<SupportStatus, string> = {
  planned: "Planned",
  completed: "Done",
  cancelled: "Cancelled",
};

export const REVIEW_RESULTS = [
  "criterion-met",
  "progress-observed",
  "no-progress-observed",
  "mixed",
  "insufficient-evidence",
] as const;
export type ReviewResult = (typeof REVIEW_RESULTS)[number];

export const REVIEW_RESULT_LABEL: Record<ReviewResult, string> = {
  "criterion-met": "The success criterion was met",
  "progress-observed": "Progress, criterion not met yet",
  "no-progress-observed": "No progress observed",
  mixed: "Mixed — it depended on the situation",
  "insufficient-evidence": "Not enough to tell yet",
};

export const syntheticLearnerRecordSchema = z
  .object({
    learnerId: identifier(ID_PREFIX.learner),
    displayLabel: shortText,
    gradeBand: z.enum(GRADE_BANDS),
    state: z.enum(LEARNER_STATES),
    synthetic: syntheticFlag,
    origin: z.enum(LEARNER_ORIGINS),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict();

export const learningGoalRecordSchema = z
  .object({
    goalId: identifier(ID_PREFIX.goal),
    learnerId: identifier(ID_PREFIX.learner),
    title: shortText,
    successCriterion: longText,
    status: z.enum(GOAL_STATUSES),
    isFocusGoal: z.boolean(),
    targetReviewDate: timestamp.nullable(),
    createdAt: timestamp,
    updatedAt: timestamp,
    synthetic: syntheticFlag,
  })
  .strict();

export const learningObservationRecordSchema = z
  .object({
    observationId: identifier(ID_PREFIX.observation),
    learnerId: identifier(ID_PREFIX.learner),
    goalId: identifier(ID_PREFIX.goal),
    supportActionId: identifier(ID_PREFIX.supportAction).nullable(),
    observedAt: timestamp,
    sourceKind: z.enum(OBSERVATION_SOURCE_KINDS),
    observationText: longText,
    supersedesObservationId: identifier(ID_PREFIX.observation).nullable(),
    createdAt: timestamp,
    synthetic: syntheticFlag,
  })
  .strict();

export const supportActionRecordSchema = z
  .object({
    supportActionId: identifier(ID_PREFIX.supportAction),
    learnerId: identifier(ID_PREFIX.learner),
    goalId: identifier(ID_PREFIX.goal),
    basedOnObservationIds: z.array(identifier(ID_PREFIX.observation)).min(1),
    title: shortText,
    rationale: longText,
    intendedEvidence: longText,
    status: z.enum(SUPPORT_STATUSES),
    plannedAt: timestamp,
    completedAt: timestamp.nullable(),
    completionNote: longText.nullable(),
    createdAt: timestamp,
    updatedAt: timestamp,
    synthetic: syntheticFlag,
  })
  .strict();

export const goalReviewRecordSchema = z
  .object({
    goalReviewId: identifier(ID_PREFIX.goalReview),
    learnerId: identifier(ID_PREFIX.learner),
    goalId: identifier(ID_PREFIX.goal),
    supportActionId: identifier(ID_PREFIX.supportAction),
    observationIds: z.array(identifier(ID_PREFIX.observation)).min(1),
    reviewedAt: timestamp,
    result: z.enum(REVIEW_RESULTS),
    rationale: longText,
    supersedesGoalReviewId: identifier(ID_PREFIX.goalReview).nullable(),
    createdAt: timestamp,
    synthetic: syntheticFlag,
  })
  .strict();

export const learningLoopDocumentSchema = z
  .object({
    application: z.literal(LEARNING_LOOP_APPLICATION),
    schemaVersion: z.literal(LEARNING_LOOP_SCHEMA_VERSION),
    datasetId: z.string().regex(/^[A-Za-z0-9-]{4,64}$/),
    seedVersion: z.literal(LEARNING_LOOP_SEED_VERSION),
    revision: z.number().int().min(0),
    lastUpdatedAt: timestamp,
    syntheticOnly: z.literal(true),
    learners: z.array(syntheticLearnerRecordSchema),
    goals: z.array(learningGoalRecordSchema),
    observations: z.array(learningObservationRecordSchema),
    supportActions: z.array(supportActionRecordSchema),
    goalReviews: z.array(goalReviewRecordSchema),
  })
  .strict();

export type SyntheticLearnerRecord = z.infer<typeof syntheticLearnerRecordSchema>;
export type LearningGoalRecord = z.infer<typeof learningGoalRecordSchema>;
export type LearningObservationRecord = z.infer<typeof learningObservationRecordSchema>;
export type SupportActionRecord = z.infer<typeof supportActionRecordSchema>;
export type GoalReviewRecord = z.infer<typeof goalReviewRecordSchema>;
export type LearningLoopDocument = z.infer<typeof learningLoopDocumentSchema>;

export interface SchemaProblem {
  path: string;
  message: string;
}

/** Strict shape parse. Cross-record invariants are checked separately. */
export function parseDocumentShape(
  value: unknown,
): { ok: true; document: LearningLoopDocument } | { ok: false; problems: SchemaProblem[] } {
  const result = learningLoopDocumentSchema.safeParse(value);
  if (result.success) return { ok: true, document: result.data };
  return {
    ok: false,
    problems: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}
