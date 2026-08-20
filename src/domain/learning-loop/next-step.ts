/**
 * LLR-001 v1.0.0 — Learning Loop Next-Step Rule.
 *
 * A pure, deterministic, total function over (document, learnerId, asOf). It
 * recommends the next step in the loop and always cites the records that
 * produced the recommendation.
 *
 * This engine is NOT an AI system, NOT a clinical or eligibility judgement, and
 * NOT an approval mechanism. It restates the state of the loop in one sentence.
 * Precedence is fixed and documented: the first rule whose condition holds
 * wins, and no later rule can override it.
 */
import {
  effectiveGoalReviews,
  effectiveObservations,
  validateDocumentInvariants,
} from "./invariants";
import type {
  GoalReviewRecord,
  LearningGoalRecord,
  LearningLoopDocument,
  LearningObservationRecord,
  SupportActionRecord,
} from "./records";

export const NEXT_STEP_RULE_ID = "LLR-001";
export const NEXT_STEP_RULE_VERSION = "1.0.0";

export const NEXT_STEP_CODES = [
  "REVIEW_DATA_INTEGRITY",
  "SELECT_OR_CREATE_FOCUS_GOAL",
  "RECORD_BASELINE_OBSERVATION",
  "PLAN_SUPPORT",
  "COMPLETE_OR_CANCEL_SUPPORT",
  "RECORD_FOLLOW_UP_OBSERVATION",
  "REVIEW_OBSERVATIONS",
  "CLOSE_GOAL_AS_ACHIEVED",
  "PLAN_NEXT_SUPPORT_CYCLE",
  "CHANGE_APPROACH",
  "GATHER_MORE_EVIDENCE",
  "REVIEW_LOOP_MANUALLY",
] as const;
export type NextStepCode = (typeof NEXT_STEP_CODES)[number];

export interface NextStepRecommendation {
  ruleId: typeof NEXT_STEP_RULE_ID;
  ruleVersion: typeof NEXT_STEP_RULE_VERSION;
  /** 1-based position in the fixed precedence order that produced this result. */
  precedence: number;
  stepCode: NextStepCode;
  /** Plain-language instruction. No jargon, no abbreviations. */
  title: string;
  /** Why this step, stated from the records. */
  why: string;
  /** Every record identifier the recommendation depends on. */
  basisRecordIds: string[];
  focusGoalId: string | null;
  activeSupportActionId: string | null;
}

function byTime<T>(pick: (row: T) => string) {
  return (a: T, b: T) => pick(a).localeCompare(pick(b));
}

function latest<T>(rows: T[], pick: (row: T) => string, tieBreak: (row: T) => string): T | null {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => {
    const time = pick(a).localeCompare(pick(b));
    return time !== 0 ? time : tieBreak(a).localeCompare(tieBreak(b));
  })[rows.length - 1] as T;
}

export interface LearnerLoopSnapshot {
  learnerId: string;
  focusGoal: LearningGoalRecord | null;
  goals: LearningGoalRecord[];
  observations: LearningObservationRecord[];
  supportActions: SupportActionRecord[];
  reviews: GoalReviewRecord[];
  latestObservation: LearningObservationRecord | null;
  activeSupport: SupportActionRecord | null;
  latestCompletedSupport: SupportActionRecord | null;
  latestReview: GoalReviewRecord | null;
}

/**
 * Everything the rule reads, exposed so the interface can show the same facts
 * the recommendation was computed from.
 */
export function readLoopSnapshot(
  document: LearningLoopDocument,
  learnerId: string,
  asOf: string,
): LearnerLoopSnapshot {
  const upTo = (moment: string) => moment.localeCompare(asOf) <= 0;
  const goals = document.goals
    .filter((goal) => goal.learnerId === learnerId)
    .sort(byTime((goal) => goal.createdAt));
  const focusGoal = goals.find((goal) => goal.isFocusGoal && goal.status === "active") ?? null;

  const observations = focusGoal
    ? effectiveObservations(document)
        .filter((row) => row.goalId === focusGoal.goalId && upTo(row.observedAt))
        .sort(byTime((row) => row.observedAt))
    : [];
  const supportActions = focusGoal
    ? document.supportActions
        .filter((row) => row.goalId === focusGoal.goalId && row.status !== "cancelled")
        .sort(byTime((row) => row.plannedAt))
    : [];
  const reviews = focusGoal
    ? effectiveGoalReviews(document)
        .filter((row) => row.goalId === focusGoal.goalId && upTo(row.reviewedAt))
        .sort(byTime((row) => row.reviewedAt))
    : [];

  const latestObservation = latest(
    observations,
    (row) => row.observedAt,
    (row) => row.observationId,
  );
  const activeSupport = latest(
    supportActions.filter((row) => row.status === "planned"),
    (row) => row.plannedAt,
    (row) => row.supportActionId,
  );
  const latestCompletedSupport = latest(
    supportActions.filter((row) => row.status === "completed" && row.completedAt),
    (row) => row.completedAt as string,
    (row) => row.supportActionId,
  );
  const latestReview = latest(
    reviews,
    (row) => row.reviewedAt,
    (row) => row.goalReviewId,
  );

  return {
    learnerId,
    focusGoal,
    goals,
    observations,
    supportActions,
    reviews,
    latestObservation,
    activeSupport,
    latestCompletedSupport,
    latestReview,
  };
}

/**
 * The rule. Total: every reachable state resolves to exactly one step, and the
 * final clause is a real fallback rather than an assumption.
 */
export function recommendNextStep(
  document: LearningLoopDocument,
  learnerId: string,
  asOf: string,
): NextStepRecommendation {
  const base = {
    ruleId: NEXT_STEP_RULE_ID,
    ruleVersion: NEXT_STEP_RULE_VERSION,
  } as const;

  // 1 — integrity before advice.
  const integrity = validateDocumentInvariants(document);
  const learner = document.learners.find((row) => row.learnerId === learnerId);
  if (integrity.length > 0 || !learner) {
    return {
      ...base,
      precedence: 1,
      stepCode: "REVIEW_DATA_INTEGRITY",
      title: "Check the saved data before going further",
      why: !learner
        ? "This learner is not in the saved data, so no step can be recommended."
        : `The saved data has ${integrity.length} inconsistency to resolve: ${integrity[0]?.message}`,
      basisRecordIds: [learnerId],
      focusGoalId: null,
      activeSupportActionId: null,
    };
  }

  const snapshot = readLoopSnapshot(document, learnerId, asOf);
  const goalId = snapshot.focusGoal?.goalId ?? null;

  // 2 — no focus goal.
  if (!snapshot.focusGoal) {
    return {
      ...base,
      precedence: 2,
      stepCode: "SELECT_OR_CREATE_FOCUS_GOAL",
      title: "Pick the one goal to work on now",
      why:
        snapshot.goals.length === 0
          ? "This learner has no goals yet."
          : "This learner has goals, but none is marked as the one being worked on now.",
      basisRecordIds: [learnerId, ...snapshot.goals.map((goal) => goal.goalId)],
      focusGoalId: null,
      activeSupportActionId: null,
    };
  }

  // 3 — no observation yet.
  if (!snapshot.latestObservation) {
    return {
      ...base,
      precedence: 3,
      stepCode: "RECORD_BASELINE_OBSERVATION",
      title: "Record what you are seeing right now",
      why: "There is a goal but nothing observed against it yet, so there is no starting point to compare to.",
      basisRecordIds: [snapshot.focusGoal.goalId],
      focusGoalId: goalId,
      activeSupportActionId: null,
    };
  }

  // 4 — newest observation not yet acted on.
  const citedObservationIds = new Set(
    snapshot.supportActions.flatMap((row) => row.basedOnObservationIds),
  );
  if (!citedObservationIds.has(snapshot.latestObservation.observationId) && !snapshot.activeSupport) {
    const reviewedIds = new Set(snapshot.reviews.flatMap((row) => row.observationIds));
    if (!reviewedIds.has(snapshot.latestObservation.observationId)) {
      return {
        ...base,
        precedence: 4,
        stepCode: "PLAN_SUPPORT",
        title: "Decide what you will change based on that observation",
        why: "The most recent observation has not been used to plan anything yet.",
        basisRecordIds: [snapshot.focusGoal.goalId, snapshot.latestObservation.observationId],
        focusGoalId: goalId,
        activeSupportActionId: null,
      };
    }
  }

  // 5 — support planned but not carried out.
  if (snapshot.activeSupport) {
    return {
      ...base,
      precedence: 5,
      stepCode: "COMPLETE_OR_CANCEL_SUPPORT",
      title: "Mark the planned support done, or cancel it",
      why: `"${snapshot.activeSupport.title}" is still planned, so nothing can be judged from it yet.`,
      basisRecordIds: [snapshot.focusGoal.goalId, snapshot.activeSupport.supportActionId],
      focusGoalId: goalId,
      activeSupportActionId: snapshot.activeSupport.supportActionId,
    };
  }

  const completed = snapshot.latestCompletedSupport;
  if (!completed) {
    return {
      ...base,
      precedence: 4,
      stepCode: "PLAN_SUPPORT",
      title: "Decide what you will change based on what you observed",
      why: "There is an observation on this goal but no support has been planned from it.",
      basisRecordIds: [snapshot.focusGoal.goalId, snapshot.latestObservation.observationId],
      focusGoalId: goalId,
      activeSupportActionId: null,
    };
  }

  // 6 — support done, no follow-up observation.
  const followUps = snapshot.observations.filter(
    (row) =>
      row.supportActionId === completed.supportActionId &&
      row.observedAt.localeCompare(completed.completedAt as string) >= 0,
  );
  if (followUps.length === 0) {
    return {
      ...base,
      precedence: 6,
      stepCode: "RECORD_FOLLOW_UP_OBSERVATION",
      title: "Record what you saw after the support happened",
      why: `"${completed.title}" is done, but nothing has been observed since it was carried out.`,
      basisRecordIds: [snapshot.focusGoal.goalId, completed.supportActionId],
      focusGoalId: goalId,
      activeSupportActionId: completed.supportActionId,
    };
  }

  // 7 — follow-up evidence not yet reviewed.
  const reviewsForSupport = snapshot.reviews.filter(
    (row) => row.supportActionId === completed.supportActionId,
  );
  const reviewedObservationIds = new Set(reviewsForSupport.flatMap((row) => row.observationIds));
  const unreviewed = followUps.filter((row) => !reviewedObservationIds.has(row.observationId));
  if (unreviewed.length > 0) {
    return {
      ...base,
      precedence: 7,
      stepCode: "REVIEW_OBSERVATIONS",
      title: "Decide what the follow-up evidence shows",
      why: `${unreviewed.length} observation${unreviewed.length === 1 ? "" : "s"} recorded after "${completed.title}" ${unreviewed.length === 1 ? "has" : "have"} not been judged yet.`,
      basisRecordIds: [
        snapshot.focusGoal.goalId,
        completed.supportActionId,
        ...unreviewed.map((row) => row.observationId),
      ],
      focusGoalId: goalId,
      activeSupportActionId: completed.supportActionId,
    };
  }

  const review = latest(
    reviewsForSupport,
    (row) => row.reviewedAt,
    (row) => row.goalReviewId,
  );

  // 8..12 — act on the recorded result.
  if (review) {
    const shared = {
      ...base,
      focusGoalId: goalId,
      activeSupportActionId: completed.supportActionId,
      basisRecordIds: [snapshot.focusGoal.goalId, completed.supportActionId, review.goalReviewId],
    };
    switch (review.result) {
      case "criterion-met":
        return {
          ...shared,
          precedence: 8,
          stepCode: "CLOSE_GOAL_AS_ACHIEVED",
          title: "Close this goal and choose the next one",
          why: "The recorded result says the success criterion was met.",
        };
      case "progress-observed":
        return {
          ...shared,
          precedence: 9,
          stepCode: "PLAN_NEXT_SUPPORT_CYCLE",
          title: "Plan the next round of the same approach",
          why: "The recorded result says there was progress but the criterion is not met yet.",
        };
      case "no-progress-observed":
        return {
          ...shared,
          precedence: 10,
          stepCode: "CHANGE_APPROACH",
          title: "Try a different approach",
          why: "The recorded result says no progress was observed from what was tried.",
        };
      case "insufficient-evidence":
      case "mixed":
        return {
          ...shared,
          precedence: 11,
          stepCode: "GATHER_MORE_EVIDENCE",
          title: "Observe again before deciding",
          why:
            review.result === "mixed"
              ? "The recorded result was mixed, so one more observation is needed to tell."
              : "The recorded result says there was not enough to judge.",
        };
    }
  }

  // 13 — genuine fallback. The engine does not guess.
  return {
    ...base,
    precedence: 12,
    stepCode: "REVIEW_LOOP_MANUALLY",
    title: "Look at this goal yourself",
    why: "This combination of records does not match any rule, so no step is being recommended.",
    basisRecordIds: [snapshot.focusGoal.goalId],
    focusGoalId: goalId,
    activeSupportActionId: null,
  };
}
