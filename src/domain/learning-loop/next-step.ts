/**
 * LLR-001 v1.0.0 — Learning Loop Next-Step Rule Set.
 *
 * A pure, deterministic, total function over (document, learnerId, asOf). It
 * projects the next step in the loop and always cites the records that produced
 * it.
 *
 * This engine is NOT an artificial-intelligence system, NOT a clinical or
 * eligibility judgement, and NOT an approval mechanism. It writes no state and
 * it never recommends that the system close a goal: closing a goal is a human
 * decision taken outside this rule set.
 *
 * Precedence is fixed and documented: the first clause whose condition holds
 * wins, and no later clause can override it. Every time comparison parses the
 * instant; lexical timestamp comparison is never used.
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

export const NEXT_STEP_RULE_SET_ID = "LLR-001";
export const NEXT_STEP_RULE_SET_VERSION = "1.0.0";

export const NEXT_STEP_LIMITATION =
  "Deterministic workflow guidance computed from the recorded product data only. It requires human judgement, decides nothing, approves nothing, and is not an artificial-intelligence, clinical, eligibility, or educational determination.";

/** The complete code vocabulary, in fixed precedence order. */
export const NEXT_STEP_CODES = [
  "REVIEW_DATA_INTEGRITY",
  "SELECT_OR_CREATE_FOCUS_GOAL",
  "RECORD_BASELINE_OBSERVATION",
  "PLAN_SUPPORT",
  "COMPLETE_OR_CANCEL_SUPPORT",
  "RECORD_FOLLOW_UP_OBSERVATION",
  "REVIEW_OBSERVATIONS",
  "COLLECT_MORE_EVIDENCE",
  "COLLECT_COMPARABLE_EVIDENCE",
  "ADJUST_SUPPORT",
  "CONTINUE_SUPPORT_AND_OBSERVE",
  "HUMAN_REVIEW_GOAL_COMPLETION",
  "REVIEW_LOOP_MANUALLY",
] as const;
export type NextStepCode = (typeof NEXT_STEP_CODES)[number];

/** Clause identifier for each code. One clause, one code. */
export const NEXT_STEP_RULE_IDS: Record<NextStepCode, string> = {
  REVIEW_DATA_INTEGRITY: "LLR-001-R01",
  SELECT_OR_CREATE_FOCUS_GOAL: "LLR-001-R02",
  RECORD_BASELINE_OBSERVATION: "LLR-001-R03",
  PLAN_SUPPORT: "LLR-001-R04",
  COMPLETE_OR_CANCEL_SUPPORT: "LLR-001-R05",
  RECORD_FOLLOW_UP_OBSERVATION: "LLR-001-R06",
  REVIEW_OBSERVATIONS: "LLR-001-R07",
  COLLECT_MORE_EVIDENCE: "LLR-001-R08",
  COLLECT_COMPARABLE_EVIDENCE: "LLR-001-R09",
  ADJUST_SUPPORT: "LLR-001-R10",
  CONTINUE_SUPPORT_AND_OBSERVE: "LLR-001-R11",
  HUMAN_REVIEW_GOAL_COMPLETION: "LLR-001-R12",
  REVIEW_LOOP_MANUALLY: "LLR-001-R13",
};

/** Plain-language instruction for each code. No jargon, no abbreviations. */
export const NEXT_STEP_LABEL: Record<NextStepCode, string> = {
  REVIEW_DATA_INTEGRITY: "Check the saved data before going further",
  SELECT_OR_CREATE_FOCUS_GOAL: "Pick the one goal to work on now",
  RECORD_BASELINE_OBSERVATION: "Record what you are seeing right now",
  PLAN_SUPPORT: "Decide what you will change, based on what you saw",
  COMPLETE_OR_CANCEL_SUPPORT: "Mark the planned support done, or cancel it",
  RECORD_FOLLOW_UP_OBSERVATION: "Record what you saw after the support happened",
  REVIEW_OBSERVATIONS: "Decide what the follow-up evidence shows",
  COLLECT_MORE_EVIDENCE: "Observe again — there was not enough to judge",
  COLLECT_COMPARABLE_EVIDENCE: "Observe again in comparable conditions",
  ADJUST_SUPPORT: "Adjust the support and plan the changed version",
  CONTINUE_SUPPORT_AND_OBSERVE: "Continue the support and keep observing",
  HUMAN_REVIEW_GOAL_COMPLETION: "A person should review whether this goal is finished",
  REVIEW_LOOP_MANUALLY: "Look at this goal yourself",
};

export interface NextStepProjection {
  ruleSetId: typeof NEXT_STEP_RULE_SET_ID;
  ruleSetVersion: typeof NEXT_STEP_RULE_SET_VERSION;
  /** Identifier of the clause that matched. */
  ruleId: string;
  learnerId: string;
  goalId: string | null;
  supportActionId: string | null;
  code: NextStepCode;
  label: string;
  rationale: string;
  /** Every record identifier the projection depends on, sorted and unique. */
  basedOnRecordIds: string[];
  limitation: typeof NEXT_STEP_LIMITATION;
}

function instant(value: string): number {
  return Date.parse(value);
}

function atOrBefore(moment: string, asOf: string): boolean {
  return instant(moment) <= instant(asOf);
}

function latestBy<T>(rows: T[], time: (row: T) => number, id: (row: T) => string): T | null {
  let best: T | null = null;
  for (const row of rows) {
    if (best === null) {
      best = row;
      continue;
    }
    const delta = time(row) - time(best);
    if (delta > 0 || (delta === 0 && id(row).localeCompare(id(best)) > 0)) best = row;
  }
  return best;
}

/** The state of one support action as of the projection instant. */
export type EffectiveSupportState = "planned" | "completed" | "cancelled";

export interface EffectiveSupport {
  record: SupportActionRecord;
  state: EffectiveSupportState;
  /** The instant of the latest event that had happened by `asOf`. */
  eventAt: string;
}

/**
 * Support state as of `asOf`. A completion or cancellation that has not
 * happened yet is not applied, so a support planned before `asOf` and completed
 * after it still reads as planned.
 */
export function effectiveSupportAt(
  support: SupportActionRecord,
  asOf: string,
): EffectiveSupport | null {
  if (!atOrBefore(support.plannedAt, asOf)) return null;
  if (support.status === "completed" && support.completedAt && atOrBefore(support.completedAt, asOf))
    return { record: support, state: "completed", eventAt: support.completedAt };
  if (support.status === "cancelled" && atOrBefore(support.updatedAt, asOf))
    return { record: support, state: "cancelled", eventAt: support.updatedAt };
  return { record: support, state: "planned", eventAt: support.plannedAt };
}

export interface LearnerLoopSnapshot {
  learnerId: string;
  focusGoal: LearningGoalRecord | null;
  goals: LearningGoalRecord[];
  observations: LearningObservationRecord[];
  supports: EffectiveSupport[];
  reviews: GoalReviewRecord[];
  latestObservation: LearningObservationRecord | null;
  /** The latest planned or completed support by event time. Cancellations excluded. */
  latestActionableSupport: EffectiveSupport | null;
  latestReview: GoalReviewRecord | null;
}

/**
 * Everything the rule reads, exposed so the interface can show exactly the
 * facts the projection was computed from.
 */
export function readLoopSnapshot(
  document: LearningLoopDocument,
  learnerId: string,
  asOf: string,
): LearnerLoopSnapshot {
  const goals = [...document.goals]
    .filter((goal) => goal.learnerId === learnerId && atOrBefore(goal.createdAt, asOf))
    .sort((a, b) => instant(a.createdAt) - instant(b.createdAt) || a.goalId.localeCompare(b.goalId));
  const focusGoal = goals.find((goal) => goal.isFocusGoal && goal.status === "active") ?? null;

  const observations = focusGoal
    ? effectiveObservations(document)
        .filter((row) => row.goalId === focusGoal.goalId && atOrBefore(row.observedAt, asOf))
        .sort(
          (a, b) =>
            instant(a.observedAt) - instant(b.observedAt) ||
            a.observationId.localeCompare(b.observationId),
        )
    : [];

  const supports = focusGoal
    ? document.supportActions
        .filter((row) => row.goalId === focusGoal.goalId)
        .map((row) => effectiveSupportAt(row, asOf))
        .filter((row): row is EffectiveSupport => row !== null)
        .sort(
          (a, b) =>
            instant(a.eventAt) - instant(b.eventAt) ||
            a.record.supportActionId.localeCompare(b.record.supportActionId),
        )
    : [];

  const reviews = focusGoal
    ? effectiveGoalReviews(document)
        .filter((row) => row.goalId === focusGoal.goalId && atOrBefore(row.reviewedAt, asOf))
        .sort(
          (a, b) =>
            instant(a.reviewedAt) - instant(b.reviewedAt) ||
            a.goalReviewId.localeCompare(b.goalReviewId),
        )
    : [];

  return {
    learnerId,
    focusGoal,
    goals,
    observations,
    supports,
    reviews,
    latestObservation: latestBy(
      observations,
      (row) => instant(row.observedAt),
      (row) => row.observationId,
    ),
    latestActionableSupport: latestBy(
      supports.filter((row) => row.state !== "cancelled"),
      (row) => instant(row.eventAt),
      (row) => row.record.supportActionId,
    ),
    latestReview: latestBy(
      reviews,
      (row) => instant(row.reviewedAt),
      (row) => row.goalReviewId,
    ),
  };
}

function project(
  code: NextStepCode,
  learnerId: string,
  goalId: string | null,
  supportActionId: string | null,
  rationale: string,
  basedOnRecordIds: string[],
): NextStepProjection {
  return {
    ruleSetId: NEXT_STEP_RULE_SET_ID,
    ruleSetVersion: NEXT_STEP_RULE_SET_VERSION,
    ruleId: NEXT_STEP_RULE_IDS[code],
    learnerId,
    goalId,
    supportActionId,
    code,
    label: NEXT_STEP_LABEL[code],
    rationale,
    basedOnRecordIds: [...new Set(basedOnRecordIds)].sort(),
    limitation: NEXT_STEP_LIMITATION,
  };
}

/**
 * The rule set. Total: every reachable state resolves to exactly one clause,
 * and the final clause is a real fallback rather than an assumption.
 */
export function projectNextStep(
  document: LearningLoopDocument,
  learnerId: string,
  asOf: string,
): NextStepProjection {
  // R01 — integrity before advice.
  const integrity = validateDocumentInvariants(document);
  const learner = document.learners.find((row) => row.learnerId === learnerId);
  if (integrity.length > 0 || !learner)
    return project(
      "REVIEW_DATA_INTEGRITY",
      learnerId,
      null,
      null,
      !learner
        ? "This learner is not in the saved data, so no step can be projected."
        : `The saved data has ${integrity.length} inconsistency to resolve: ${integrity[0]?.message}`,
      [learnerId],
    );

  const snapshot = readLoopSnapshot(document, learnerId, asOf);
  const goal = snapshot.focusGoal;

  // R02 — no goal being worked on.
  if (!goal)
    return project(
      "SELECT_OR_CREATE_FOCUS_GOAL",
      learnerId,
      null,
      null,
      snapshot.goals.length === 0
        ? "This learner has no goals yet."
        : "This learner has goals, but none is marked as the one being worked on now.",
      [learnerId, ...snapshot.goals.map((row) => row.goalId)],
    );

  const goalId = goal.goalId;

  // R03 — nothing observed against the goal.
  if (!snapshot.latestObservation)
    return project(
      "RECORD_BASELINE_OBSERVATION",
      learnerId,
      goalId,
      null,
      "There is a goal but nothing observed against it yet, so there is no starting point to compare to.",
      [goalId],
    );

  const actionable = snapshot.latestActionableSupport;

  // R04 — nothing has been planned from what was observed.
  if (!actionable)
    return project(
      "PLAN_SUPPORT",
      learnerId,
      goalId,
      null,
      snapshot.supports.length > 0
        ? "The last support on this goal was cancelled, so nothing is currently being tried."
        : "There is an observation on this goal but no support has been planned from it.",
      [goalId, snapshot.latestObservation.observationId],
    );

  // R05 — support planned but not yet carried out or cancelled.
  if (actionable.state === "planned")
    return project(
      "COMPLETE_OR_CANCEL_SUPPORT",
      learnerId,
      goalId,
      actionable.record.supportActionId,
      `"${actionable.record.title}" is still planned, so nothing can be judged from it yet.`,
      [goalId, actionable.record.supportActionId],
    );

  const completed = actionable.record;
  const completedAt = actionable.eventAt;

  // R06 — support done, nothing observed since.
  const followUps = snapshot.observations.filter(
    (row) =>
      row.supportActionId === completed.supportActionId &&
      instant(row.observedAt) >= instant(completedAt),
  );
  if (followUps.length === 0)
    return project(
      "RECORD_FOLLOW_UP_OBSERVATION",
      learnerId,
      goalId,
      completed.supportActionId,
      `"${completed.title}" is done, but nothing has been observed since it was carried out.`,
      [goalId, completed.supportActionId],
    );

  // R07 — follow-up evidence not judged yet.
  const reviewsForSupport = snapshot.reviews.filter(
    (row) => row.supportActionId === completed.supportActionId,
  );
  const judged = new Set(reviewsForSupport.flatMap((row) => row.observationIds));
  const unjudged = followUps.filter((row) => !judged.has(row.observationId));
  if (unjudged.length > 0)
    return project(
      "REVIEW_OBSERVATIONS",
      learnerId,
      goalId,
      completed.supportActionId,
      `${unjudged.length} observation${unjudged.length === 1 ? "" : "s"} recorded after "${completed.title}" ${unjudged.length === 1 ? "has" : "have"} not been judged yet.`,
      [goalId, completed.supportActionId, ...unjudged.map((row) => row.observationId)],
    );

  const review = latestBy(
    reviewsForSupport,
    (row) => instant(row.reviewedAt),
    (row) => row.goalReviewId,
  );

  if (review) {
    const basis = [goalId, completed.supportActionId, review.goalReviewId];
    // R08..R12 — one distinct branch per recorded result. Insufficient evidence
    // and mixed are deliberately kept apart: they call for different evidence.
    switch (review.result) {
      case "insufficient-evidence":
        return project(
          "COLLECT_MORE_EVIDENCE",
          learnerId,
          goalId,
          completed.supportActionId,
          "The recorded result says there was not enough evidence to judge, so more of the same kind of evidence is needed.",
          basis,
        );
      case "mixed":
        return project(
          "COLLECT_COMPARABLE_EVIDENCE",
          learnerId,
          goalId,
          completed.supportActionId,
          "The recorded result was mixed across situations, so evidence gathered in comparable conditions is needed to tell them apart.",
          basis,
        );
      case "no-progress-observed":
        return project(
          "ADJUST_SUPPORT",
          learnerId,
          goalId,
          completed.supportActionId,
          "The recorded result says no progress was observed from what was tried, so the support itself needs to change.",
          basis,
        );
      case "progress-observed":
        return project(
          "CONTINUE_SUPPORT_AND_OBSERVE",
          learnerId,
          goalId,
          completed.supportActionId,
          "The recorded result says there was progress but the success criterion is not met yet.",
          basis,
        );
      case "criterion-met":
        return project(
          "HUMAN_REVIEW_GOAL_COMPLETION",
          learnerId,
          goalId,
          completed.supportActionId,
          "The recorded result says the success criterion was met. Whether the goal is finished is a human decision; this rule set does not close goals.",
          basis,
        );
    }
  }

  // R13 — genuine fallback. The rule set does not guess.
  return project(
    "REVIEW_LOOP_MANUALLY",
    learnerId,
    goalId,
    completed.supportActionId,
    "This combination of records does not match any clause, so no step is being projected.",
    [goalId, completed.supportActionId],
  );
}
