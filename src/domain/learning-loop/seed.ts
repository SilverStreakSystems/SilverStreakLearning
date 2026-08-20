/**
 * Deterministic synthetic seed.
 *
 * Fixed identifiers, fixed timestamps, no randomness and no clock read, so the
 * seed is byte-identical on every machine and every run. Every label here is
 * obviously fabricated. Nothing in this file describes a real person, and no
 * real personal data may ever be added to it.
 *
 * The four learners are shaped to exercise different points of the loop so the
 * next-step rule can be seen doing real work rather than repeating one answer.
 */
import {
  LEARNING_LOOP_APPLICATION,
  LEARNING_LOOP_SCHEMA_VERSION,
  LEARNING_LOOP_SEED_VERSION,
  type LearningLoopDocument,
} from "./records";
import { canonicalizeDocument } from "./canonical";

const T = {
  created: "2026-01-05T09:00:00.000Z",
  goalA: "2026-01-06T09:00:00.000Z",
  obsA1: "2026-01-08T14:30:00.000Z",
  supA1: "2026-01-09T08:15:00.000Z",
  goalB: "2026-01-06T10:00:00.000Z",
  obsB1: "2026-01-07T11:00:00.000Z",
  supB1: "2026-01-08T08:00:00.000Z",
  supB1Done: "2026-01-15T15:00:00.000Z",
  obsB2: "2026-01-16T11:20:00.000Z",
  revB1: "2026-01-17T09:45:00.000Z",
  goalC: "2026-01-06T11:00:00.000Z",
  goalD: "2026-01-06T12:00:00.000Z",
  /**
   * The document clock. It is at or after every fact in the seed, because the
   * saved state cannot honestly claim to be older than the records it holds.
   */
  saved: "2026-01-18T00:00:00.000Z",
} as const;

export const SEED_DATASET_ID = "alpha-001-synthetic";

export function createSeedDocument(): LearningLoopDocument {
  const document: LearningLoopDocument = {
    application: LEARNING_LOOP_APPLICATION,
    schemaVersion: LEARNING_LOOP_SCHEMA_VERSION,
    datasetId: SEED_DATASET_ID,
    seedVersion: LEARNING_LOOP_SEED_VERSION,
    revision: 0,
    lastUpdatedAt: T.saved,
    syntheticOnly: true,
    learners: [
      {
        learnerId: "LRN-A",
        displayLabel: "Sample Learner A (fictional)",
        gradeBand: "upper-elementary",
        state: "active",
        synthetic: true,
        origin: "seed",
        createdAt: T.created,
        updatedAt: T.created,
      },
      {
        learnerId: "LRN-B",
        displayLabel: "Sample Learner B (fictional)",
        gradeBand: "middle",
        state: "active",
        synthetic: true,
        origin: "seed",
        createdAt: T.created,
        updatedAt: T.created,
      },
      {
        learnerId: "LRN-C",
        displayLabel: "Sample Learner C (fictional)",
        gradeBand: "transition",
        state: "active",
        synthetic: true,
        origin: "seed",
        createdAt: T.created,
        updatedAt: T.created,
      },
      {
        learnerId: "LRN-D",
        displayLabel: "Sample Learner D (fictional)",
        gradeBand: "early-elementary",
        state: "active",
        synthetic: true,
        origin: "seed",
        createdAt: T.created,
        updatedAt: T.created,
      },
    ],
    goals: [
      {
        goalId: "GOL-A1",
        learnerId: "LRN-A",
        title: "Ask for help before giving up on a task",
        successCriterion:
          "In four out of five independent work periods, the learner asks an adult or peer for help within two minutes of getting stuck, instead of stopping work.",
        status: "active",
        isFocusGoal: true,
        targetReviewDate: "2026-02-06T09:00:00.000Z",
        createdAt: T.goalA,
        updatedAt: T.goalA,
        synthetic: true,
      },
      {
        goalId: "GOL-B1",
        learnerId: "LRN-B",
        title: "Start written work without a one-to-one prompt",
        successCriterion:
          "In three consecutive lessons, the learner begins writing within three minutes of the whole-class instruction, with no individual prompt.",
        status: "active",
        isFocusGoal: true,
        targetReviewDate: "2026-02-10T09:00:00.000Z",
        createdAt: T.goalB,
        updatedAt: T.goalB,
        synthetic: true,
      },
      {
        goalId: "GOL-C1",
        learnerId: "LRN-C",
        title: "Use the bus route independently for the work placement",
        successCriterion:
          "On three separate placement days, the learner boards, rides, and exits at the correct stop with no staff prompting.",
        status: "active",
        isFocusGoal: true,
        targetReviewDate: null,
        createdAt: T.goalC,
        updatedAt: T.goalC,
        synthetic: true,
      },
      {
        goalId: "GOL-D1",
        learnerId: "LRN-D",
        title: "Move between activities without distress",
        successCriterion:
          "Across a week, the learner moves to the next activity within one minute of the transition signal on four of five days.",
        status: "paused",
        isFocusGoal: false,
        targetReviewDate: null,
        createdAt: T.goalD,
        updatedAt: T.goalD,
        synthetic: true,
      },
    ],
    observations: [
      {
        observationId: "OBS-A1",
        learnerId: "LRN-A",
        goalId: "GOL-A1",
        supportActionId: null,
        observedAt: T.obsA1,
        sourceKind: "direct-observation",
        observationText:
          "During independent maths, the learner stopped after the second problem and sat quietly for the rest of the period without asking anyone.",
        supersedesObservationId: null,
        createdAt: T.obsA1,
        synthetic: true,
      },
      {
        observationId: "OBS-B1",
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: null,
        observedAt: T.obsB1,
        sourceKind: "progress-check",
        observationText:
          "Across four lessons, writing began only after an individual prompt, on average seven minutes after the class instruction.",
        supersedesObservationId: null,
        createdAt: T.obsB1,
        synthetic: true,
      },
      {
        observationId: "OBS-B2",
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: "SUP-B1",
        observedAt: T.obsB2,
        sourceKind: "work-sample",
        observationText:
          "With the printed starter strip on the desk, the learner began writing within four minutes in two of three lessons and produced a full first paragraph each time.",
        supersedesObservationId: null,
        createdAt: T.obsB2,
        synthetic: true,
      },
    ],
    supportActions: [
      {
        supportActionId: "SUP-A1",
        learnerId: "LRN-A",
        goalId: "GOL-A1",
        basedOnObservationIds: ["OBS-A1"],
        title: "Put a help card on the desk and teach how to use it",
        rationale:
          "The learner stops rather than asks, so the ask needs to be something that can be done without speaking first.",
        intendedEvidence:
          "The card is turned over during independent work, and the learner keeps working after help arrives.",
        status: "planned",
        plannedAt: T.supA1,
        completedAt: null,
        completionNote: null,
        createdAt: T.supA1,
        updatedAt: T.supA1,
        synthetic: true,
      },
      {
        supportActionId: "SUP-B1",
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        basedOnObservationIds: ["OBS-B1"],
        title: "Provide a printed sentence starter strip before each lesson",
        rationale:
          "The delay sits between hearing the instruction and knowing how to begin, not in the writing itself.",
        intendedEvidence: "Writing starts sooner without an individual prompt from an adult.",
        status: "completed",
        plannedAt: T.supB1,
        completedAt: T.supB1Done,
        completionNote: "Strips supplied for every lesson across one week.",
        createdAt: T.supB1,
        updatedAt: T.supB1Done,
        synthetic: true,
      },
    ],
    goalReviews: [
      {
        goalReviewId: "REV-B1",
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: "SUP-B1",
        observationIds: ["OBS-B2"],
        reviewedAt: T.revB1,
        result: "progress-observed",
        rationale:
          "Starting time improved and the individual prompt was not needed, but the criterion asks for three consecutive lessons and only two of three met it.",
        supersedesGoalReviewId: null,
        synthetic: true,
        createdAt: T.revB1,
      },
    ],
  };

  return canonicalizeDocument(document);
}
