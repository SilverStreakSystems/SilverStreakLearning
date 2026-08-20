/**
 * Derived chronological trace for one learner.
 *
 * A LearningTimelineEntry is DERIVED and never persisted. It is a product
 * reading aid, not the shared enterprise Event object.
 */
import {
  GOAL_STATUS_LABEL,
  OBSERVATION_SOURCE_LABEL,
  REVIEW_RESULT_LABEL,
  type LearningLoopDocument,
} from "./records";
import { supersededGoalReviewIds, supersededObservationIds } from "./invariants";

export const TIMELINE_ENTRY_KINDS = [
  "goal-set",
  "observation",
  "support-planned",
  "support-completed",
  "support-cancelled",
  "review",
] as const;
export type TimelineEntryKind = (typeof TIMELINE_ENTRY_KINDS)[number];

/**
 * Documented tie-break order for identical timestamps. Applied before a stable
 * comparison of the source record identifier.
 */
export const TIMELINE_TYPE_ORDER: Record<TimelineEntryKind, number> = {
  "goal-set": 0,
  observation: 1,
  "support-planned": 2,
  "support-completed": 3,
  "support-cancelled": 4,
  review: 5,
};

export interface LearningTimelineEntry {
  entryId: string;
  kind: TimelineEntryKind;
  occurredAt: string;
  goalId: string;
  recordId: string;
  headline: string;
  detail: string;
  /** True when a later correction replaced this record. History keeps it. */
  superseded: boolean;
}

export function buildTimeline(
  document: LearningLoopDocument,
  learnerId: string,
  options: { goalId?: string } = {},
): LearningTimelineEntry[] {
  const inScope = (candidateGoalId: string) =>
    options.goalId === undefined || options.goalId === candidateGoalId;

  const supersededObservations = supersededObservationIds(document);
  const supersededReviews = supersededGoalReviewIds(document);
  const entries: LearningTimelineEntry[] = [];

  for (const goal of document.goals) {
    if (goal.learnerId !== learnerId || !inScope(goal.goalId)) continue;
    entries.push({
      entryId: `goal-set:${goal.goalId}`,
      kind: "goal-set",
      occurredAt: goal.createdAt,
      goalId: goal.goalId,
      recordId: goal.goalId,
      headline: `Goal set: ${goal.title}`,
      detail: `Success looks like: ${goal.successCriterion} (${GOAL_STATUS_LABEL[goal.status]})`,
      superseded: false,
    });
  }

  for (const observation of document.observations) {
    if (observation.learnerId !== learnerId || !inScope(observation.goalId)) continue;
    entries.push({
      entryId: `observation:${observation.observationId}`,
      kind: "observation",
      occurredAt: observation.observedAt,
      goalId: observation.goalId,
      recordId: observation.observationId,
      headline: observation.supersedesObservationId
        ? "Observation corrected"
        : observation.supportActionId
          ? "Follow-up observation"
          : "Observation recorded",
      detail: `${OBSERVATION_SOURCE_LABEL[observation.sourceKind]} — ${observation.observationText}`,
      superseded: supersededObservations.has(observation.observationId),
    });
  }

  for (const support of document.supportActions) {
    if (support.learnerId !== learnerId || !inScope(support.goalId)) continue;
    entries.push({
      entryId: `support-planned:${support.supportActionId}`,
      kind: "support-planned",
      occurredAt: support.plannedAt,
      goalId: support.goalId,
      recordId: support.supportActionId,
      headline: `Support planned: ${support.title}`,
      detail: `Why: ${support.rationale} What we expect to see: ${support.intendedEvidence}`,
      superseded: false,
    });
    if (support.status === "completed" && support.completedAt) {
      entries.push({
        entryId: `support-completed:${support.supportActionId}`,
        kind: "support-completed",
        occurredAt: support.completedAt,
        goalId: support.goalId,
        recordId: support.supportActionId,
        headline: `Support done: ${support.title}`,
        detail: support.completionNote ?? "Marked done with no extra note.",
        superseded: false,
      });
    }
    if (support.status === "cancelled") {
      entries.push({
        entryId: `support-cancelled:${support.supportActionId}`,
        kind: "support-cancelled",
        occurredAt: support.updatedAt,
        goalId: support.goalId,
        recordId: support.supportActionId,
        headline: `Support cancelled: ${support.title}`,
        detail: support.completionNote ?? "Cancelled before it was carried out.",
        superseded: false,
      });
    }
  }

  for (const review of document.goalReviews) {
    if (review.learnerId !== learnerId || !inScope(review.goalId)) continue;
    entries.push({
      entryId: `review:${review.goalReviewId}`,
      kind: "review",
      occurredAt: review.reviewedAt,
      goalId: review.goalId,
      recordId: review.goalReviewId,
      headline: `Result recorded: ${REVIEW_RESULT_LABEL[review.result]}`,
      detail: review.rationale,
      superseded: supersededReviews.has(review.goalReviewId),
    });
  }

  return entries.sort((a, b) => {
    if (a.occurredAt !== b.occurredAt) return a.occurredAt.localeCompare(b.occurredAt);
    if (a.kind !== b.kind) return TIMELINE_TYPE_ORDER[a.kind] - TIMELINE_TYPE_ORDER[b.kind];
    return a.entryId.localeCompare(b.entryId);
  });
}
