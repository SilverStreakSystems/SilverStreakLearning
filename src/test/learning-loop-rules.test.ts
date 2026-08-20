import { describe, expect, it } from "vitest";

import {
  NEXT_STEP_CODES,
  NEXT_STEP_RULE_SET_ID,
  NEXT_STEP_RULE_SET_VERSION,
  buildTimeline,
  createSeedDocument,
  projectNextStep,
  readLoopSnapshot,
  type LearningLoopDocument,
} from "@/domain/learning-loop";

function seed(): LearningLoopDocument {
  return JSON.parse(JSON.stringify(createSeedDocument())) as LearningLoopDocument;
}

const LATE = "2030-01-01T00:00:00.000Z";

describe("LLR-001 contract", () => {
  it("declares its rule set, version, rule id, rationale, basis, and limitation", () => {
    const document = seed();
    const projection = projectNextStep(document, document.learners[0]!.learnerId, LATE);
    expect(projection.ruleSetId).toBe(NEXT_STEP_RULE_SET_ID);
    expect(projection.ruleSetVersion).toBe(NEXT_STEP_RULE_SET_VERSION);
    expect(NEXT_STEP_CODES).toContain(projection.code);
    expect(projection.ruleId).toMatch(/^LLR-001-R\d\d$/);
    expect(projection.rationale.length).toBeGreaterThan(0);
    expect(projection.basedOnRecordIds.length).toBeGreaterThan(0);
    expect(projection.limitation.toLowerCase()).toContain("judgement");
  });

  it("is pure: the same inputs give the same projection and mutate nothing", () => {
    const document = seed();
    const before = JSON.stringify(document);
    const a = projectNextStep(document, "LRN-A", LATE);
    const b = projectNextStep(document, "LRN-A", LATE);
    expect(a).toEqual(b);
    expect(JSON.stringify(document)).toBe(before);
  });

  it("refuses to advise on data it cannot trust", () => {
    const document = seed();
    document.goals.push({ ...document.goals[0]! });
    expect(projectNextStep(document, "LRN-A", LATE).code).toBe("REVIEW_DATA_INTEGRITY");
  });

  it("refuses to advise about a learner that is not in the data", () => {
    expect(projectNextStep(seed(), "LRN-ZZZ", LATE).code).toBe("REVIEW_DATA_INTEGRITY");
  });

  it("asks for a focus goal when no goal is being worked on", () => {
    const document = seed();
    for (const goal of document.goals) goal.isFocusGoal = false;
    expect(projectNextStep(document, "LRN-A", LATE).code).toBe("SELECT_OR_CREATE_FOCUS_GOAL");
  });

  it("asks for a baseline observation when the goal has none", () => {
    const document = seed();
    const focus = document.goals.find((goal) => goal.learnerId === "LRN-A" && goal.isFocusGoal)!;
    document.goalReviews = [];
    document.supportActions = document.supportActions.filter((row) => row.goalId !== focus.goalId);
    document.observations = document.observations.filter((row) => row.goalId !== focus.goalId);
    expect(projectNextStep(document, "LRN-A", LATE).code).toBe("RECORD_BASELINE_OBSERVATION");
  });
});

describe("asOf filtering", () => {
  it("hides every record that had not happened yet", () => {
    const document = seed();
    const early = "2000-01-01T00:00:00.000Z";
    const snapshot = readLoopSnapshot(document, "LRN-A", early);
    expect(snapshot.goals).toEqual([]);
    expect(snapshot.focusGoal).toBeNull();
    expect(snapshot.observations).toEqual([]);
    expect(snapshot.supports).toEqual([]);
    expect(snapshot.reviews).toEqual([]);
  });

  it("reads a support completed after asOf as still planned", () => {
    const document = seed();
    const completed = document.supportActions.find(
      (row) => row.status === "completed" && row.completedAt,
    )!;
    const justBefore = new Date(Date.parse(completed.completedAt!) - 1000).toISOString();
    const snapshot = readLoopSnapshot(document, completed.learnerId, justBefore);
    const seen = snapshot.supports.find(
      (row) => row.record.supportActionId === completed.supportActionId,
    );
    expect(seen?.state).toBe("planned");
  });

  it("does not let a stale planned support outrank a newer completed support", () => {
    const document = seed();
    const completed = document.supportActions.find(
      (row) => row.status === "completed" && row.completedAt,
    )!;
    const stalePlannedAt = new Date(Date.parse(completed.plannedAt) + 1000).toISOString();
    document.supportActions.push({
      ...completed,
      supportActionId: "SUP-STALE",
      status: "planned",
      plannedAt: stalePlannedAt,
      createdAt: stalePlannedAt,
      updatedAt: stalePlannedAt,
      completedAt: null,
      completionNote: null,
    });

    const snapshot = readLoopSnapshot(document, completed.learnerId, LATE);
    expect(snapshot.latestActionableSupport?.record.supportActionId).toBe(
      completed.supportActionId,
    );
  });

  it("ignores cancelled supports when choosing the actionable one", () => {
    const document = seed();
    const completed = document.supportActions.find(
      (row) => row.status === "completed" && row.completedAt,
    )!;
    const later = new Date(Date.parse(completed.completedAt!) + 60_000).toISOString();
    document.supportActions.push({
      ...completed,
      supportActionId: "SUP-CANCELLED",
      status: "cancelled",
      completedAt: null,
      completionNote: null,
      updatedAt: later,
    });
    const snapshot = readLoopSnapshot(document, completed.learnerId, LATE);
    expect(snapshot.latestActionableSupport?.record.supportActionId).toBe(
      completed.supportActionId,
    );
  });
});

describe("timeline", () => {
  it("orders entries by parsed instants, not by text", () => {
    const document = seed();
    const observation = document.observations.find((row) => row.learnerId === "LRN-A")!;
    // Same instant, written with an offset instead of Z. Text ordering would
    // place this wrongly; instant ordering places it correctly.
    const shifted = new Date(Date.parse(observation.observedAt) + 3_600_000)
      .toISOString()
      .replace("Z", "+00:00");
    document.observations.push({
      ...observation,
      observationId: "OBS-OFFSET",
      observedAt: shifted,
      createdAt: shifted,
      supersedesObservationId: null,
      supportActionId: null,
    });

    const entries = buildTimeline(document, "LRN-A");
    const times = entries.map((entry) => Date.parse(entry.occurredAt));
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("does not print the goal's current status into the moment the goal was set", () => {
    const document = seed();
    const goal = document.goals.find((row) => row.learnerId === "LRN-A")!;
    goal.status = "achieved";
    const created = buildTimeline(document, "LRN-A").find(
      (entry) => entry.kind === "goal-set" && entry.goalId === goal.goalId,
    )!;
    expect(created.detail).not.toContain("Criterion met");
    expect(created.detail).toContain(goal.successCriterion);
  });
});
