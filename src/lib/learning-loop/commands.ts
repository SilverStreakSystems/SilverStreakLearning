/**
 * Pure document transformations.
 *
 * Every command takes a document and returns a new one. None of them touch
 * storage, read the clock, or generate randomness: the caller supplies `now`.
 * That keeps the whole write path testable and reproducible.
 *
 * Observations and reviews are append-only. A correction appends a new record
 * that supersedes the old one; nothing is ever edited in place or deleted.
 */
import {
  ID_PREFIX,
  type GoalStatus,
  type LearningLoopDocument,
  type ObservationSourceKind,
  type ReviewResult,
} from "@/domain/learning-loop";

function mintId(prefix: string, existing: string[]): string {
  const taken = new Set(existing);
  let counter = existing.length + 1;
  let candidate = `${prefix}-${String(counter).padStart(3, "0")}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${prefix}-${String(counter).padStart(3, "0")}`;
  }
  return candidate;
}

export interface CreateLearnerInput {
  displayLabel: string;
  gradeBand: LearningLoopDocument["learners"][number]["gradeBand"];
}

export function createLearner(
  document: LearningLoopDocument,
  input: CreateLearnerInput,
  now: string,
): { document: LearningLoopDocument; learnerId: string } {
  const learnerId = mintId(
    ID_PREFIX.learner,
    document.learners.map((row) => row.learnerId),
  );
  return {
    learnerId,
    document: {
      ...document,
      learners: [
        ...document.learners,
        {
          learnerId,
          displayLabel: input.displayLabel,
          gradeBand: input.gradeBand,
          state: "active",
          synthetic: true,
          origin: "founder-operator",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
  };
}

export function setLearnerState(
  document: LearningLoopDocument,
  learnerId: string,
  state: "active" | "archived",
  now: string,
): LearningLoopDocument {
  return {
    ...document,
    learners: document.learners.map((row) =>
      row.learnerId === learnerId ? { ...row, state, updatedAt: now } : row,
    ),
  };
}

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
  now: string,
): { document: LearningLoopDocument; goalId: string } {
  const goalId = mintId(
    ID_PREFIX.goal,
    document.goals.map((row) => row.goalId),
  );
  const cleared = input.makeFocus
    ? document.goals.map((row) =>
        row.learnerId === input.learnerId && row.isFocusGoal
          ? { ...row, isFocusGoal: false, updatedAt: now }
          : row,
      )
    : document.goals;
  return {
    goalId,
    document: {
      ...document,
      goals: [
        ...cleared,
        {
          goalId,
          learnerId: input.learnerId,
          title: input.title,
          successCriterion: input.successCriterion,
          status: "active",
          isFocusGoal: input.makeFocus,
          targetReviewDate: input.targetReviewDate,
          createdAt: now,
          updatedAt: now,
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
  now: string,
): LearningLoopDocument {
  return {
    ...document,
    goals: document.goals.map((row) => {
      if (row.learnerId !== learnerId) return row;
      const isFocusGoal = row.goalId === goalId;
      if (row.isFocusGoal === isFocusGoal) return row;
      return { ...row, isFocusGoal, updatedAt: now };
    }),
  };
}

export function setGoalStatus(
  document: LearningLoopDocument,
  goalId: string,
  status: GoalStatus,
  now: string,
): LearningLoopDocument {
  return {
    ...document,
    goals: document.goals.map((row) =>
      row.goalId === goalId
        ? { ...row, status, isFocusGoal: status === "active" ? row.isFocusGoal : false, updatedAt: now }
        : row,
    ),
  };
}

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
  now: string,
): { document: LearningLoopDocument; observationId: string } {
  const observationId = mintId(
    ID_PREFIX.observation,
    document.observations.map((row) => row.observationId),
  );
  return {
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
          observationText: input.observationText,
          supersedesObservationId: input.supersedesObservationId,
          createdAt: now,
          synthetic: true,
        },
      ],
    },
  };
}

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
  now: string,
): { document: LearningLoopDocument; supportActionId: string } {
  const supportActionId = mintId(
    ID_PREFIX.supportAction,
    document.supportActions.map((row) => row.supportActionId),
  );
  return {
    supportActionId,
    document: {
      ...document,
      supportActions: [
        ...document.supportActions,
        {
          supportActionId,
          learnerId: input.learnerId,
          goalId: input.goalId,
          basedOnObservationIds: input.basedOnObservationIds,
          title: input.title,
          rationale: input.rationale,
          intendedEvidence: input.intendedEvidence,
          status: "planned",
          plannedAt: input.plannedAt,
          completedAt: null,
          completionNote: null,
          createdAt: now,
          updatedAt: now,
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
  now: string,
): LearningLoopDocument {
  return {
    ...document,
    supportActions: document.supportActions.map((row) =>
      row.supportActionId === supportActionId
        ? { ...row, status: "completed" as const, completedAt, completionNote, updatedAt: now }
        : row,
    ),
  };
}

export function cancelSupport(
  document: LearningLoopDocument,
  supportActionId: string,
  reason: string,
  now: string,
): LearningLoopDocument {
  return {
    ...document,
    supportActions: document.supportActions.map((row) =>
      row.supportActionId === supportActionId
        ? {
            ...row,
            status: "cancelled" as const,
            completedAt: null,
            completionNote: reason,
            updatedAt: now,
          }
        : row,
    ),
  };
}

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
  now: string,
): { document: LearningLoopDocument; goalReviewId: string } {
  const goalReviewId = mintId(
    ID_PREFIX.goalReview,
    document.goalReviews.map((row) => row.goalReviewId),
  );
  return {
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
          observationIds: input.observationIds,
          reviewedAt: input.reviewedAt,
          result: input.result,
          rationale: input.rationale,
          supersedesGoalReviewId: input.supersedesGoalReviewId,
          createdAt: now,
          synthetic: true,
        },
      ],
    },
  };
}
