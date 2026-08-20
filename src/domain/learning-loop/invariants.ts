/**
 * Cross-record invariants for the learning-loop document.
 *
 * Shape is enforced by Zod; meaning is enforced here. Every write goes through
 * this function, so a document that violates an invariant is never persisted
 * and never imported. This module is pure: it reads a document and returns
 * problem strings.
 */
import {
  ID_PREFIX,
  RESERVED_GOVERNANCE_PREFIXES,
  type GoalReviewRecord,
  type LearningLoopDocument,
  type LearningObservationRecord,
} from "./records";

export interface InvariantProblem {
  code: string;
  message: string;
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

/**
 * Records that have been superseded by a later correction. Superseded records
 * stay in history and are excluded from current recommendation inputs.
 */
export function supersededObservationIds(document: LearningLoopDocument): Set<string> {
  return new Set(
    document.observations
      .map((record) => record.supersedesObservationId)
      .filter((value): value is string => value !== null),
  );
}

export function supersededGoalReviewIds(document: LearningLoopDocument): Set<string> {
  return new Set(
    document.goalReviews
      .map((record) => record.supersedesGoalReviewId)
      .filter((value): value is string => value !== null),
  );
}

export function effectiveObservations(
  document: LearningLoopDocument,
): LearningObservationRecord[] {
  const superseded = supersededObservationIds(document);
  return document.observations.filter((record) => !superseded.has(record.observationId));
}

export function effectiveGoalReviews(document: LearningLoopDocument): GoalReviewRecord[] {
  const superseded = supersededGoalReviewIds(document);
  return document.goalReviews.filter((record) => !superseded.has(record.goalReviewId));
}

function chainIsAcyclic(
  startId: string,
  next: (id: string) => string | null | undefined,
): boolean {
  const seen = new Set<string>([startId]);
  let cursor = next(startId);
  while (cursor) {
    if (seen.has(cursor)) return false;
    seen.add(cursor);
    cursor = next(cursor);
  }
  return true;
}

export function validateDocumentInvariants(document: LearningLoopDocument): InvariantProblem[] {
  const problems: InvariantProblem[] = [];
  const push = (code: string, message: string) => problems.push({ code, message });

  const learnerIds = document.learners.map((record) => record.learnerId);
  const goalIds = document.goals.map((record) => record.goalId);
  const observationIds = document.observations.map((record) => record.observationId);
  const supportIds = document.supportActions.map((record) => record.supportActionId);
  const reviewIds = document.goalReviews.map((record) => record.goalReviewId);

  const allIds = [...learnerIds, ...goalIds, ...observationIds, ...supportIds, ...reviewIds];
  for (const id of duplicates(allIds)) push("duplicate-id", `Identifier ${id} is used more than once.`);

  for (const id of allIds) {
    const prefix = id.split("-")[0] ?? "";
    if ((RESERVED_GOVERNANCE_PREFIXES as readonly string[]).includes(prefix))
      push("reserved-prefix", `Identifier ${id} uses a governance prefix reserved outside this product.`);
  }

  const learners = new Map(document.learners.map((record) => [record.learnerId, record]));
  const goals = new Map(document.goals.map((record) => [record.goalId, record]));
  const observations = new Map(document.observations.map((record) => [record.observationId, record]));
  const supports = new Map(document.supportActions.map((record) => [record.supportActionId, record]));
  const reviews = new Map(document.goalReviews.map((record) => [record.goalReviewId, record]));

  // --- goals -------------------------------------------------------------
  const focusByLearner = new Map<string, number>();
  for (const goal of document.goals) {
    if (!learners.has(goal.learnerId))
      push("orphan-goal", `Goal ${goal.goalId} points at unknown learner ${goal.learnerId}.`);
    if (goal.isFocusGoal) {
      if (goal.status !== "active")
        push(
          "focus-goal-not-active",
          `Goal ${goal.goalId} is marked the focus goal but its status is ${goal.status}.`,
        );
      focusByLearner.set(goal.learnerId, (focusByLearner.get(goal.learnerId) ?? 0) + 1);
    }
  }
  for (const [learnerId, count] of focusByLearner) {
    if (count > 1)
      push("multiple-focus-goals", `Learner ${learnerId} has ${count} focus goals; only one is allowed.`);
  }

  // --- observations ------------------------------------------------------
  for (const observation of document.observations) {
    const goal = goals.get(observation.goalId);
    if (!learners.has(observation.learnerId))
      push("orphan-observation", `Observation ${observation.observationId} points at unknown learner.`);
    if (!goal) {
      push("orphan-observation", `Observation ${observation.observationId} points at unknown goal.`);
    } else if (goal.learnerId !== observation.learnerId) {
      push(
        "ownership-mismatch",
        `Observation ${observation.observationId} cites a goal that belongs to another learner.`,
      );
    }
    if (observation.supportActionId) {
      const support = supports.get(observation.supportActionId);
      if (!support) {
        push("orphan-observation", `Observation ${observation.observationId} points at unknown support.`);
      } else if (
        support.learnerId !== observation.learnerId ||
        support.goalId !== observation.goalId
      ) {
        push(
          "ownership-mismatch",
          `Observation ${observation.observationId} is linked to support outside its learner and goal.`,
        );
      }
    }
    if (observation.supersedesObservationId) {
      const target = observations.get(observation.supersedesObservationId);
      if (!target) {
        push("broken-supersession", `Observation ${observation.observationId} supersedes an unknown record.`);
      } else if (target.learnerId !== observation.learnerId || target.goalId !== observation.goalId) {
        push(
          "broken-supersession",
          `Observation ${observation.observationId} supersedes a record from another learner or goal.`,
        );
      }
      if (
        !chainIsAcyclic(
          observation.observationId,
          (id) => observations.get(id)?.supersedesObservationId ?? null,
        )
      )
        push("supersession-cycle", `Observation ${observation.observationId} is in a supersession cycle.`);
    }
  }
  for (const id of duplicates(
    document.observations
      .map((record) => record.supersedesObservationId)
      .filter((value): value is string => value !== null),
  ))
    push("multiple-successors", `Observation ${id} is superseded by more than one record.`);

  // --- support actions ---------------------------------------------------
  for (const support of document.supportActions) {
    const goal = goals.get(support.goalId);
    if (!learners.has(support.learnerId))
      push("orphan-support", `Support ${support.supportActionId} points at unknown learner.`);
    if (!goal) {
      push("orphan-support", `Support ${support.supportActionId} points at unknown goal.`);
    } else if (goal.learnerId !== support.learnerId) {
      push("ownership-mismatch", `Support ${support.supportActionId} cites another learner's goal.`);
    }
    for (const observationId of support.basedOnObservationIds) {
      const observation = observations.get(observationId);
      if (!observation) {
        push("orphan-support", `Support ${support.supportActionId} cites unknown observation ${observationId}.`);
        continue;
      }
      if (observation.learnerId !== support.learnerId || observation.goalId !== support.goalId)
        push(
          "ownership-mismatch",
          `Support ${support.supportActionId} cites an observation outside its learner and goal.`,
        );
    }
    if (support.status === "completed" && !support.completedAt)
      push("missing-completion", `Support ${support.supportActionId} is done but carries no completion time.`);
    if (support.status !== "completed" && support.completedAt)
      push(
        "false-completion",
        `Support ${support.supportActionId} is ${support.status} but carries a completion time.`,
      );
  }

  // --- goal reviews ------------------------------------------------------
  for (const review of document.goalReviews) {
    const goal = goals.get(review.goalId);
    const support = supports.get(review.supportActionId);
    if (!learners.has(review.learnerId))
      push("orphan-review", `Review ${review.goalReviewId} points at unknown learner.`);
    if (!goal) {
      push("orphan-review", `Review ${review.goalReviewId} points at unknown goal.`);
    } else if (goal.learnerId !== review.learnerId) {
      push("ownership-mismatch", `Review ${review.goalReviewId} cites another learner's goal.`);
    }
    if (!support) {
      push("orphan-review", `Review ${review.goalReviewId} points at unknown support.`);
    } else {
      if (support.status !== "completed")
        push(
          "review-before-completion",
          `Review ${review.goalReviewId} reviews support that is not marked done.`,
        );
      if (support.learnerId !== review.learnerId || support.goalId !== review.goalId)
        push("ownership-mismatch", `Review ${review.goalReviewId} cites support outside its learner and goal.`);
    }
    for (const observationId of review.observationIds) {
      const observation = observations.get(observationId);
      if (!observation) {
        push("orphan-review", `Review ${review.goalReviewId} cites unknown observation ${observationId}.`);
        continue;
      }
      if (observation.learnerId !== review.learnerId || observation.goalId !== review.goalId) {
        push(
          "ownership-mismatch",
          `Review ${review.goalReviewId} cites an observation outside its learner and goal.`,
        );
      }
      if (observation.supportActionId !== review.supportActionId)
        push(
          "irrelevant-review-evidence",
          `Review ${review.goalReviewId} cites an observation that is not a follow-up to the reviewed support.`,
        );
    }
    if (review.supersedesGoalReviewId) {
      const target = reviews.get(review.supersedesGoalReviewId);
      if (!target) {
        push("broken-supersession", `Review ${review.goalReviewId} supersedes an unknown record.`);
      } else if (target.learnerId !== review.learnerId || target.goalId !== review.goalId) {
        push(
          "broken-supersession",
          `Review ${review.goalReviewId} supersedes a record from another learner or goal.`,
        );
      }
      if (
        !chainIsAcyclic(review.goalReviewId, (id) => reviews.get(id)?.supersedesGoalReviewId ?? null)
      )
        push("supersession-cycle", `Review ${review.goalReviewId} is in a supersession cycle.`);
    }
  }
  for (const id of duplicates(
    document.goalReviews
      .map((record) => record.supersedesGoalReviewId)
      .filter((value): value is string => value !== null),
  ))
    push("multiple-successors", `Review ${id} is superseded by more than one record.`);

  // --- learners ----------------------------------------------------------
  for (const learner of document.learners) {
    if (learner.learnerId.startsWith(`${ID_PREFIX.learner}-`) === false)
      push("bad-prefix", `Learner ${learner.learnerId} does not use the learner prefix.`);
  }

  return problems;
}
