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
 * Supersession is evaluation-time aware. A correction can only replace its
 * predecessor once the correction itself exists: without this, a later
 * correction would retroactively erase a record from an earlier view.
 */
function createdBy(createdAt: string, asOf?: string): boolean {
  if (asOf === undefined) return true;
  const evaluated = Date.parse(asOf);
  if (Number.isNaN(evaluated)) return true;
  return Date.parse(createdAt) <= evaluated;
}

/**
 * Records that have been superseded by a later correction. Superseded records
 * stay in history and are excluded from current recommendation inputs.
 */
export function supersededObservationIds(
  document: LearningLoopDocument,
  asOf?: string,
): Set<string> {
  return new Set(
    document.observations
      .filter((record) => createdBy(record.createdAt, asOf))
      .map((record) => record.supersedesObservationId)
      .filter((value): value is string => value !== null),
  );
}

export function supersededGoalReviewIds(
  document: LearningLoopDocument,
  asOf?: string,
): Set<string> {
  return new Set(
    document.goalReviews
      .filter((record) => createdBy(record.createdAt, asOf))
      .map((record) => record.supersedesGoalReviewId)
      .filter((value): value is string => value !== null),
  );
}

export function effectiveObservations(
  document: LearningLoopDocument,
  asOf?: string,
): LearningObservationRecord[] {
  const superseded = supersededObservationIds(document, asOf);
  return document.observations.filter((record) => !superseded.has(record.observationId));
}

export function effectiveGoalReviews(
  document: LearningLoopDocument,
  asOf?: string,
): GoalReviewRecord[] {
  const superseded = supersededGoalReviewIds(document, asOf);
  return document.goalReviews.filter((record) => !superseded.has(record.goalReviewId));
}

function chainIsAcyclic(startId: string, next: (id: string) => string | null | undefined): boolean {
  const seen = new Set<string>([startId]);
  let cursor = next(startId);
  while (cursor) {
    if (seen.has(cursor)) return false;
    seen.add(cursor);
    cursor = next(cursor);
  }
  return true;
}

/** Instant comparison. Timestamps are never compared as text. */
function at(value: string): number {
  return Date.parse(value);
}

function isBefore(earlier: string, later: string): boolean {
  return at(earlier) < at(later);
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
  for (const id of duplicates(allIds))
    push("duplicate-id", `Identifier ${id} is used more than once.`);

  for (const id of allIds) {
    const prefix = id.split("-")[0] ?? "";
    if ((RESERVED_GOVERNANCE_PREFIXES as readonly string[]).includes(prefix))
      push(
        "reserved-prefix",
        `Identifier ${id} uses a governance prefix reserved outside this product.`,
      );
  }

  const learners = new Map(document.learners.map((record) => [record.learnerId, record]));
  const goals = new Map(document.goals.map((record) => [record.goalId, record]));
  const observations = new Map(
    document.observations.map((record) => [record.observationId, record]),
  );
  const supports = new Map(
    document.supportActions.map((record) => [record.supportActionId, record]),
  );
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
      if (learners.get(goal.learnerId)?.state === "archived")
        push(
          "archived-learner-focus",
          `Goal ${goal.goalId} is the focus goal of archived learner ${goal.learnerId}.`,
        );
      focusByLearner.set(goal.learnerId, (focusByLearner.get(goal.learnerId) ?? 0) + 1);
    }
    if (isBefore(goal.updatedAt, goal.createdAt))
      push("reversed-timestamps", `Goal ${goal.goalId} was updated before it was created.`);
    if (goal.status !== "active" && goal.isFocusGoal)
      push(
        "focus-goal-not-active",
        `Goal ${goal.goalId} is marked the focus goal but is not active.`,
      );
  }
  for (const [learnerId, count] of focusByLearner) {
    if (count > 1)
      push(
        "multiple-focus-goals",
        `Learner ${learnerId} has ${count} focus goals; only one is allowed.`,
      );
  }

  // --- observations ------------------------------------------------------
  for (const observation of document.observations) {
    const goal = goals.get(observation.goalId);
    if (!learners.has(observation.learnerId))
      push(
        "orphan-observation",
        `Observation ${observation.observationId} points at unknown learner.`,
      );
    if (!goal) {
      push(
        "orphan-observation",
        `Observation ${observation.observationId} points at unknown goal.`,
      );
    } else if (goal.learnerId !== observation.learnerId) {
      push(
        "ownership-mismatch",
        `Observation ${observation.observationId} cites a goal that belongs to another learner.`,
      );
    }
    if (observation.supportActionId) {
      const support = supports.get(observation.supportActionId);
      if (!support) {
        push(
          "orphan-observation",
          `Observation ${observation.observationId} points at unknown support.`,
        );
      } else if (
        support.learnerId !== observation.learnerId ||
        support.goalId !== observation.goalId
      ) {
        push(
          "ownership-mismatch",
          `Observation ${observation.observationId} is linked to support outside its learner and goal.`,
        );
      }
      // A link to a support that has not been carried out claims follow-up
      // evidence for something that has not happened yet.
      if (support && support.status !== "completed")
        push(
          "follow-up-before-completion",
          `Observation ${observation.observationId} is linked to support that is ${support.status}, so it cannot be follow-up evidence.`,
        );
      if (support?.completedAt && isBefore(observation.observedAt, support.completedAt))
        push(
          "follow-up-before-support",
          `Observation ${observation.observationId} is dated before the support it follows up.`,
        );
    }
    if (isBefore(observation.createdAt, observation.observedAt))
      push(
        "event-after-record",
        `Observation ${observation.observationId} was recorded before the moment it describes.`,
      );
    if (observation.supersedesObservationId) {
      const target = observations.get(observation.supersedesObservationId);
      if (!target) {
        push(
          "broken-supersession",
          `Observation ${observation.observationId} supersedes an unknown record.`,
        );
      } else if (
        target.learnerId !== observation.learnerId ||
        target.goalId !== observation.goalId
      ) {
        push(
          "broken-supersession",
          `Observation ${observation.observationId} supersedes a record from another learner or goal.`,
        );
      }
      if (target && isBefore(observation.createdAt, target.createdAt))
        push(
          "reversed-supersession",
          `Observation ${observation.observationId} is dated before the record it replaces.`,
        );
      if (
        !chainIsAcyclic(
          observation.observationId,
          (id) => observations.get(id)?.supersedesObservationId ?? null,
        )
      )
        push(
          "supersession-cycle",
          `Observation ${observation.observationId} is in a supersession cycle.`,
        );
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
      push(
        "ownership-mismatch",
        `Support ${support.supportActionId} cites another learner's goal.`,
      );
    }
    for (const observationId of support.basedOnObservationIds) {
      const observation = observations.get(observationId);
      if (!observation) {
        push(
          "orphan-support",
          `Support ${support.supportActionId} cites unknown observation ${observationId}.`,
        );
        continue;
      }
      if (observation.learnerId !== support.learnerId || observation.goalId !== support.goalId)
        push(
          "ownership-mismatch",
          `Support ${support.supportActionId} cites an observation outside its learner and goal.`,
        );
    }
    for (const observationId of duplicates(support.basedOnObservationIds))
      push(
        "duplicate-citation",
        `Support ${support.supportActionId} cites observation ${observationId} more than once.`,
      );
    if (support.completedAt && isBefore(support.updatedAt, support.completedAt))
      push(
        "event-after-record",
        `Support ${support.supportActionId} was recorded as completed before its own completion time was reached.`,
      );
    if (support.status === "completed" && !support.completedAt)
      push(
        "missing-completion",
        `Support ${support.supportActionId} is done but carries no completion time.`,
      );
    if (isBefore(support.updatedAt, support.createdAt))
      push(
        "reversed-timestamps",
        `Support ${support.supportActionId} was updated before it was created.`,
      );
    if (support.completedAt && isBefore(support.completedAt, support.plannedAt))
      push(
        "completed-before-planned",
        `Support ${support.supportActionId} was completed before it was planned.`,
      );
    for (const observationId of support.basedOnObservationIds) {
      const observation = observations.get(observationId);
      if (observation && isBefore(support.plannedAt, observation.observedAt))
        push(
          "support-before-evidence",
          `Support ${support.supportActionId} was planned before observation ${observationId} was made.`,
        );
    }
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
        push(
          "ownership-mismatch",
          `Review ${review.goalReviewId} cites support outside its learner and goal.`,
        );
      if (support.completedAt && isBefore(review.reviewedAt, support.completedAt))
        push(
          "review-before-completion",
          `Review ${review.goalReviewId} is dated before the support was carried out.`,
        );
    }
    for (const observationId of review.observationIds) {
      const observation = observations.get(observationId);
      if (!observation) {
        push(
          "orphan-review",
          `Review ${review.goalReviewId} cites unknown observation ${observationId}.`,
        );
        continue;
      }
      if (observation.learnerId !== review.learnerId || observation.goalId !== review.goalId) {
        push(
          "ownership-mismatch",
          `Review ${review.goalReviewId} cites an observation outside its learner and goal.`,
        );
      }
      if (isBefore(review.reviewedAt, observation.observedAt))
        push(
          "review-before-evidence",
          `Review ${review.goalReviewId} is dated before observation ${observationId} was made.`,
        );
      if (observation.supportActionId !== review.supportActionId)
        push(
          "irrelevant-review-evidence",
          `Review ${review.goalReviewId} cites an observation that is not a follow-up to the reviewed support.`,
        );
    }
    for (const observationId of duplicates(review.observationIds))
      push(
        "duplicate-citation",
        `Review ${review.goalReviewId} cites observation ${observationId} more than once.`,
      );
    if (isBefore(review.createdAt, review.reviewedAt))
      push(
        "event-after-record",
        `Review ${review.goalReviewId} was recorded before the moment it describes.`,
      );
    if (review.supersedesGoalReviewId) {
      const target = reviews.get(review.supersedesGoalReviewId);
      if (!target) {
        push("broken-supersession", `Review ${review.goalReviewId} supersedes an unknown record.`);
      } else if (
        target.learnerId !== review.learnerId ||
        target.goalId !== review.goalId ||
        // A correction replaces a judgement of the same support. Anything else
        // would silently retire a judgement about different evidence.
        target.supportActionId !== review.supportActionId
      ) {
        push(
          "broken-supersession",
          `Review ${review.goalReviewId} supersedes a record from another learner, goal, or support.`,
        );
      }
      if (target && isBefore(review.createdAt, target.createdAt))
        push(
          "reversed-supersession",
          `Review ${review.goalReviewId} is dated before the record it replaces.`,
        );
      if (
        !chainIsAcyclic(
          review.goalReviewId,
          (id) => reviews.get(id)?.supersedesGoalReviewId ?? null,
        )
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

  // --- document clock ----------------------------------------------------
  // The document's own stamp is the instant the product treats as "now" for
  // this saved state. A record dated after it would make the projection answer
  // from a future the document does not claim to have reached.
  const clock = at(document.lastUpdatedAt);
  if (Number.isNaN(clock)) {
    push("bad-document-clock", "The saved data does not carry a usable last-updated instant.");
  } else {
    const events: { id: string; label: string; value: string | null }[] = [
      ...document.learners.flatMap((row) => [
        { id: row.learnerId, label: "created", value: row.createdAt },
        { id: row.learnerId, label: "updated", value: row.updatedAt },
      ]),
      ...document.goals.flatMap((row) => [
        { id: row.goalId, label: "created", value: row.createdAt },
        { id: row.goalId, label: "updated", value: row.updatedAt },
      ]),
      ...document.observations.flatMap((row) => [
        { id: row.observationId, label: "created", value: row.createdAt },
        { id: row.observationId, label: "observed", value: row.observedAt },
      ]),
      ...document.supportActions.flatMap((row) => [
        { id: row.supportActionId, label: "created", value: row.createdAt },
        { id: row.supportActionId, label: "updated", value: row.updatedAt },
        { id: row.supportActionId, label: "planned", value: row.plannedAt },
        { id: row.supportActionId, label: "completed", value: row.completedAt },
      ]),
      ...document.goalReviews.flatMap((row) => [
        { id: row.goalReviewId, label: "created", value: row.createdAt },
        { id: row.goalReviewId, label: "reviewed", value: row.reviewedAt },
      ]),
    ];
    for (const event of events) {
      if (event.value === null) continue;
      const moment = at(event.value);
      if (Number.isNaN(moment)) {
        push("bad-instant", `${event.id} carries a ${event.label} time that is not a usable instant.`);
        continue;
      }
      if (moment > clock)
        push(
          "record-after-document-clock",
          `${event.id} is ${event.label} after the saved data's own last-updated time.`,
        );
    }
  }

  // --- learners ----------------------------------------------------------
  for (const learner of document.learners) {
    if (learner.learnerId.startsWith(`${ID_PREFIX.learner}-`) === false)
      push("bad-prefix", `Learner ${learner.learnerId} does not use the learner prefix.`);
    if (isBefore(learner.updatedAt, learner.createdAt))
      push(
        "reversed-timestamps",
        `Learner ${learner.learnerId} was updated before it was created.`,
      );
  }

  return problems;
}
