/**
 * Pure document transformations.
 *
 * Every command takes a document plus an explicit context and returns either a
 * new document or a structured failure. None of them touch storage, read the
 * clock, or generate randomness.
 *
 * Preconditions are checked here and reported: a command that cannot be applied
 * returns `ok: false` with a code, and the caller must not write. Silently
 * returning an unchanged document would advance the revision for nothing.
 *
 * Observations and reviews are append-only. A correction appends a new record
 * that supersedes the old one; nothing is edited in place or deleted.
 */
import {
  ID_PREFIX,
  type GoalStatus,
  type GradeBand,
  type LearningLoopDocument,
  type ObservationSourceKind,
  type ReviewResult,
} from "@/domain/learning-loop";
import type { CommandContext } from "./context";

export type CommandFailureCode =
  | "unknown-learner"
  | "unknown-goal"
  | "unknown-support"
  | "unknown-observation"
  | "ownership-mismatch"
  | "goal-state"
  | "support-state"
  | "invalid-input";

export type CommandResult<T = unknown> =
  | ({ ok: true; document: LearningLoopDocument } & T)
  | { ok: false; code: CommandFailureCode; message: string };

function fail(code: CommandFailureCode, message: string): CommandResult<never> {
  return { ok: false, code, message };
}

function learner(document: LearningLoopDocument, learnerId: string) {
  return document.learners.find((row) => row.learnerId === learnerId) ?? null;
}

function goalOf(document: LearningLoopDocument, goalId: string) {
  return document.goals.find((row) => row.goalId === goalId) ?? null;
}

function supportOf(document: LearningLoopDocument, supportActionId: string) {
  return document.supportActions.find((row) => row.supportActionId === supportActionId) ?? null;
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

// --- goals -----------------------------------------------------------------

export interface CreateGoalInput {
  learnerId: string;
  title: string;
  successCriterion: string;
  targetReviewDate: string | null;
  makeFocus: boolean;
}

export function createGoal(
  document: LearningLoopDocument,
  input: CreateGoalInput,
  context: CommandContext,
): CommandResult<{ goalId: string }> {
  const owner = learner(document, input.learnerId);
  if (!owner) return fail("unknown-learner", "That learner is not in the saved records.");
  if (!nonEmpty(input.title) || !nonEmpty(input.successCriterion))
    return fail("invalid-input", "A goal needs a title and a success criterion.");
  if (input.makeFocus && owner.state === "archived")
    return fail(
      "goal-state",
      "That learner is archived, so no goal can be set as the one being worked on.",
    );

  const goalId = context.newId(ID_PREFIX.goal);
  const cleared = input.makeFocus
    ? document.goals.map((row) =>
        row.learnerId === input.learnerId && row.isFocusGoal
          ? { ...row, isFocusGoal: false, updatedAt: context.now }
          : row,
      )
    : document.goals;

  return {
    ok: true,
    goalId,
    document: {
      ...document,
      goals: [
        ...cleared,
        {
          goalId,
          learnerId: input.learnerId,
          title: input.title.trim(),
          successCriterion: input.successCriterion.trim(),
          status: "active",
          isFocusGoal: input.makeFocus,
          targetReviewDate: input.targetReviewDate,
          createdAt: context.now,
          updatedAt: context.now,
          synthetic: true,
        },
      ],
    },
  };
}

/** Exactly one focus goal per learner: setting one clears the others. */
export function setFocusGoal(
  document: LearningLoopDocument,
  learnerId: string,
  goalId: string,
  context: CommandContext,
): CommandResult {
  const owner = learner(document, learnerId);
  if (!owner) return fail("unknown-learner", "That learner is not in the saved records.");
  if (owner.state === "archived")
    return fail("goal-state", "That learner is archived, so no goal can be worked on.");
  const goal = goalOf(document, goalId);
  if (!goal) return fail("unknown-goal", "That goal is not in the saved records.");
  if (goal.learnerId !== learnerId)
    return fail("ownership-mismatch", "That goal belongs to a different learner.");
  if (goal.status !== "active")
    return fail("goal-state", "Only an active goal can be the one being worked on.");

  return {
    ok: true,
    document: {
      ...document,
      goals: document.goals.map((row) => {
        if (row.learnerId !== learnerId) return row;
        const isFocusGoal = row.goalId === goalId;
        if (row.isFocusGoal === isFocusGoal) return row;
        return { ...row, isFocusGoal, updatedAt: context.now };
      }),
    },
  };
}

export function setGoalStatus(
  document: LearningLoopDocument,
  goalId: string,
  status: GoalStatus,
  context: CommandContext,
): CommandResult {
  const goal = goalOf(document, goalId);
  if (!goal) return fail("unknown-goal", "That goal is not in the saved records.");
  if (goal.status === status) return fail("goal-state", "That goal is already in that state.");
  const owner = learner(document, goal.learnerId);
  if (status === "active" && owner?.state === "archived")
    return fail("goal-state", "That learner is archived, so the goal cannot be reactivated.");

  return {
    ok: true,
    document: {
      ...document,
      goals: document.goals.map((row) =>
        row.goalId === goalId
          ? {
              ...row,
              status,
              isFocusGoal: status === "active" ? row.isFocusGoal : false,
              updatedAt: context.now,
            }
          : row,
      ),
    },
  };
}

export function setLearnerState(
  document: LearningLoopDocument,
  learnerId: string,
  state: "active" | "archived",
  context: CommandContext,
): CommandResult {
  const owner = learner(document, learnerId);
  if (!owner) return fail("unknown-learner", "That learner is not in the saved records.");
  if (owner.state === state) return fail("goal-state", "That learner is already in that state.");

  return {
    ok: true,
    document: {
      ...document,
      learners: document.learners.map((row) =>
        row.learnerId === learnerId ? { ...row, state, updatedAt: context.now } : row,
      ),
      // An archived learner cannot carry a goal that is being worked on.
      goals:
        state === "archived"
          ? document.goals.map((row) =>
              row.learnerId === learnerId && row.isFocusGoal
                ? { ...row, isFocusGoal: false, updatedAt: context.now }
                : row,
            )
          : document.goals,
    },
  };
}

// --- observations ----------------------------------------------------------

export interface RecordObservationInput {
  learnerId: string;
  goalId: string;
  supportActionId: string | null;
  observedAt: string;
  sourceKind: ObservationSourceKind;
  observationText: string;
  supersedesObservationId: string | null;
}

export function recordObservation(
  document: LearningLoopDocument,
  input: RecordObservationInput,
  context: CommandContext,
): CommandResult<{ observationId: string }> {
  if (!learner(document, input.learnerId))
    return fail("unknown-learner", "That learner is not in the saved records.");
  const goal = goalOf(document, input.goalId);
  if (!goal) return fail("unknown-goal", "That goal is not in the saved records.");
  if (goal.learnerId !== input.learnerId)
    return fail("ownership-mismatch", "That goal belongs to a different learner.");
  if (!nonEmpty(input.observationText))
    return fail("invalid-input", "An observation needs a description of what was seen.");
  if (Number.isNaN(Date.parse(input.observedAt)))
    return fail("invalid-input", "That observation time is not a real instant.");

  if (input.supportActionId) {
    const support = supportOf(document, input.supportActionId);
    if (!support) return fail("unknown-support", "That support is not in the saved records.");
    if (support.goalId !== input.goalId || support.learnerId !== input.learnerId)
      return fail("ownership-mismatch", "That support belongs to a different learner or goal.");
    if (support.status !== "completed" || !support.completedAt)
      return fail("support-state", "A follow-up can only be linked to a support that is done.");
    if (Date.parse(input.observedAt) < Date.parse(support.completedAt))
      return fail(
        "invalid-input",
        "A follow-up observation cannot be dated before the support was carried out.",
      );
  }

  if (input.supersedesObservationId) {
    const target = document.observations.find(
      (row) => row.observationId === input.supersedesObservationId,
    );
    if (!target) return fail("unknown-observation", "The record being corrected does not exist.");
    if (target.goalId !== input.goalId || target.learnerId !== input.learnerId)
      return fail("ownership-mismatch", "That record belongs to a different learner or goal.");
    if (
      document.observations.some(
        (row) => row.supersedesObservationId === input.supersedesObservationId,
      )
    )
      return fail("invalid-input", "That record has already been corrected once.");
    if (Date.parse(context.now) < Date.parse(target.createdAt))
      return fail("invalid-input", "A correction cannot be dated before the record it replaces.");
  }

  const observationId = context.newId(ID_PREFIX.observation);
  return {
    ok: true,
    observationId,
    document: {
      ...document,
      observations: [
        ...document.observations,
        {
          observationId,
          learnerId: input.learnerId,
          goalId: input.goalId,
          supportActionId: input.supportActionId,
          observedAt: input.observedAt,
          sourceKind: input.sourceKind,
          observationText: input.observationText.trim(),
          supersedesObservationId: input.supersedesObservationId,
          createdAt: context.now,
          synthetic: true,
        },
      ],
    },
  };
}

// --- support actions -------------------------------------------------------

export interface PlanSupportInput {
  learnerId: string;
  goalId: string;
  basedOnObservationIds: string[];
  title: string;
  rationale: string;
  intendedEvidence: string;
  plannedAt: string;
}

export function planSupport(
  document: LearningLoopDocument,
  input: PlanSupportInput,
  context: CommandContext,
): CommandResult<{ supportActionId: string }> {
  if (!learner(document, input.learnerId))
    return fail("unknown-learner", "That learner is not in the saved records.");
  const goal = goalOf(document, input.goalId);
  if (!goal) return fail("unknown-goal", "That goal is not in the saved records.");
  if (goal.learnerId !== input.learnerId)
    return fail("ownership-mismatch", "That goal belongs to a different learner.");
  if (goal.status !== "active")
    return fail("goal-state", "Support can only be planned against an active goal.");
  if (!nonEmpty(input.title) || !nonEmpty(input.rationale) || !nonEmpty(input.intendedEvidence))
    return fail("invalid-input", "A support needs what you will do, why, and what you expect.");

  const basis = [...new Set(input.basedOnObservationIds)];
  if (basis.length === 0)
    return fail("invalid-input", "A support has to be based on at least one observation.");
  for (const observationId of basis) {
    const observation = document.observations.find((row) => row.observationId === observationId);
    if (!observation)
      return fail("unknown-observation", "One of the cited observations does not exist.");
    if (observation.goalId !== input.goalId || observation.learnerId !== input.learnerId)
      return fail("ownership-mismatch", "One of the cited observations belongs elsewhere.");
    if (Date.parse(input.plannedAt) < Date.parse(observation.observedAt))
      return fail(
        "invalid-input",
        "A support cannot be planned before the observations it is based on.",
      );
  }

  const supportActionId = context.newId(ID_PREFIX.supportAction);
  return {
    ok: true,
    supportActionId,
    document: {
      ...document,
      supportActions: [
        ...document.supportActions,
        {
          supportActionId,
          learnerId: input.learnerId,
          goalId: input.goalId,
          basedOnObservationIds: basis,
          title: input.title.trim(),
          rationale: input.rationale.trim(),
          intendedEvidence: input.intendedEvidence.trim(),
          status: "planned",
          plannedAt: input.plannedAt,
          completedAt: null,
          completionNote: null,
          createdAt: context.now,
          updatedAt: context.now,
          synthetic: true,
        },
      ],
    },
  };
}

export function completeSupport(
  document: LearningLoopDocument,
  supportActionId: string,
  completedAt: string,
  completionNote: string | null,
  context: CommandContext,
): CommandResult {
  const support = supportOf(document, supportActionId);
  if (!support) return fail("unknown-support", "That support is not in the saved records.");
  if (support.status !== "planned")
    return fail("support-state", "Only a planned support can be marked done.");
  if (Number.isNaN(Date.parse(completedAt)))
    return fail("invalid-input", "That completion time is not a real instant.");
  if (Date.parse(completedAt) < Date.parse(support.plannedAt))
    return fail("invalid-input", "A support cannot be completed before it was planned.");

  return {
    ok: true,
    document: {
      ...document,
      supportActions: document.supportActions.map((row) =>
        row.supportActionId === supportActionId
          ? {
              ...row,
              status: "completed" as const,
              completedAt,
              completionNote,
              updatedAt: context.now,
            }
          : row,
      ),
    },
  };
}

export function cancelSupport(
  document: LearningLoopDocument,
  supportActionId: string,
  reason: string,
  context: CommandContext,
): CommandResult {
  const support = supportOf(document, supportActionId);
  if (!support) return fail("unknown-support", "That support is not in the saved records.");
  if (support.status !== "planned")
    return fail("support-state", "Only a planned support can be cancelled.");
  if (!nonEmpty(reason)) return fail("invalid-input", "Say why it was cancelled.");

  return {
    ok: true,
    document: {
      ...document,
      supportActions: document.supportActions.map((row) =>
        row.supportActionId === supportActionId
          ? {
              ...row,
              status: "cancelled" as const,
              completedAt: null,
              completionNote: reason.trim(),
              updatedAt: context.now,
            }
          : row,
      ),
    },
  };
}

// --- results ---------------------------------------------------------------

export interface RecordReviewInput {
  learnerId: string;
  goalId: string;
  supportActionId: string;
  observationIds: string[];
  reviewedAt: string;
  result: ReviewResult;
  rationale: string;
  supersedesGoalReviewId: string | null;
}

export function recordGoalReview(
  document: LearningLoopDocument,
  input: RecordReviewInput,
  context: CommandContext,
): CommandResult<{ goalReviewId: string }> {
  if (!learner(document, input.learnerId))
    return fail("unknown-learner", "That learner is not in the saved records.");
  const goal = goalOf(document, input.goalId);
  if (!goal) return fail("unknown-goal", "That goal is not in the saved records.");
  if (goal.learnerId !== input.learnerId)
    return fail("ownership-mismatch", "That goal belongs to a different learner.");
  const support = supportOf(document, input.supportActionId);
  if (!support) return fail("unknown-support", "That support is not in the saved records.");
  if (support.goalId !== input.goalId || support.learnerId !== input.learnerId)
    return fail("ownership-mismatch", "That support belongs to a different learner or goal.");
  if (support.status !== "completed" || !support.completedAt)
    return fail("support-state", "A result can only be recorded for a support that is done.");
  if (!nonEmpty(input.rationale))
    return fail("invalid-input", "A result needs a reason written against the evidence.");

  const cited = [...new Set(input.observationIds)];
  if (cited.length === 0)
    return fail("invalid-input", "Pick at least one observation to judge from.");
  for (const observationId of cited) {
    const observation = document.observations.find((row) => row.observationId === observationId);
    if (!observation)
      return fail("unknown-observation", "One of the cited observations does not exist.");
    if (observation.goalId !== input.goalId || observation.learnerId !== input.learnerId)
      return fail("ownership-mismatch", "One of the cited observations belongs elsewhere.");
    if (observation.supportActionId !== input.supportActionId)
      return fail(
        "invalid-input",
        "Only follow-up observations linked to that support can be judged from.",
      );
    if (Date.parse(input.reviewedAt) < Date.parse(observation.observedAt))
      return fail("invalid-input", "A result cannot be dated before the evidence it cites.");
  }
  if (Date.parse(input.reviewedAt) < Date.parse(support.completedAt))
    return fail("invalid-input", "A result cannot be dated before the support was carried out.");

  if (input.supersedesGoalReviewId) {
    const target = document.goalReviews.find(
      (row) => row.goalReviewId === input.supersedesGoalReviewId,
    );
    if (!target) return fail("unknown-observation", "The result being corrected does not exist.");
    if (target.goalId !== input.goalId || target.learnerId !== input.learnerId)
      return fail("ownership-mismatch", "That result belongs to a different learner or goal.");
    if (
      document.goalReviews.some(
        (row) => row.supersedesGoalReviewId === input.supersedesGoalReviewId,
      )
    )
      return fail("invalid-input", "That result has already been corrected once.");
  }

  const goalReviewId = context.newId(ID_PREFIX.goalReview);
  return {
    ok: true,
    goalReviewId,
    document: {
      ...document,
      goalReviews: [
        ...document.goalReviews,
        {
          goalReviewId,
          learnerId: input.learnerId,
          goalId: input.goalId,
          supportActionId: input.supportActionId,
          observationIds: cited,
          reviewedAt: input.reviewedAt,
          result: input.result,
          rationale: input.rationale.trim(),
          supersedesGoalReviewId: input.supersedesGoalReviewId,
          createdAt: context.now,
          synthetic: true,
        },
      ],
    },
  };
}
