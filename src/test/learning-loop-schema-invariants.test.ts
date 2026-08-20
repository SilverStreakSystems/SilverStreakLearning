import { describe, expect, it } from "vitest";

import {
  createSeedDocument,
  parseDocumentShape,
  validateDocumentInvariants,
  type LearningLoopDocument,
} from "@/domain/learning-loop";

function seed(): LearningLoopDocument {
  return JSON.parse(JSON.stringify(createSeedDocument())) as LearningLoopDocument;
}

function codes(document: LearningLoopDocument): string[] {
  return validateDocumentInvariants(document).map((problem) => problem.code);
}

describe("learning-loop document shape", () => {
  it("accepts the synthetic seed unchanged", () => {
    const parsed = parseDocumentShape(seed());
    expect(parsed.ok).toBe(true);
    expect(validateDocumentInvariants(seed())).toEqual([]);
  });

  it("rejects an unknown key rather than silently dropping it", () => {
    const parsed = parseDocumentShape({ ...seed(), extra: "unexpected" });
    expect(parsed.ok).toBe(false);
  });

  it("rejects a learner that is not flagged synthetic", () => {
    const document = seed();
    (document.learners[0] as unknown as { synthetic: boolean }).synthetic = false;
    expect(parseDocumentShape(document).ok).toBe(false);
  });

  it("rejects an identifier that does not carry its record prefix", () => {
    const document = seed();
    document.goals[0]!.goalId = "XXX-1";
    expect(parseDocumentShape(document).ok).toBe(false);
  });

  it("rejects a timestamp that is not a real instant", () => {
    const document = seed();
    document.learners[0]!.createdAt = "yesterday";
    expect(parseDocumentShape(document).ok).toBe(false);
  });
});

describe("cross-record invariants", () => {
  it("refuses a focus goal on an archived learner", () => {
    const document = seed();
    const focus = document.goals.find((goal) => goal.isFocusGoal)!;
    const learner = document.learners.find((row) => row.learnerId === focus.learnerId)!;
    learner.state = "archived";
    expect(codes(document).length).toBeGreaterThan(0);
  });

  it("refuses a learner updated before it was created", () => {
    const document = seed();
    document.learners[0]!.updatedAt = "2000-01-01T00:00:00.000Z";
    expect(codes(document).length).toBeGreaterThan(0);
  });

  it("refuses a support planned before the observation it cites", () => {
    const document = seed();
    const support = document.supportActions[0]!;
    const cited = document.observations.find(
      (row) => row.observationId === support.basedOnObservationIds[0],
    )!;
    support.plannedAt = "2000-01-01T00:00:00.000Z";
    support.createdAt = support.plannedAt;
    expect(Date.parse(support.plannedAt)).toBeLessThan(Date.parse(cited.observedAt));
    expect(codes(document).length).toBeGreaterThan(0);
  });

  it("refuses a review recorded before the support it judges was completed", () => {
    const document = seed();
    const review = document.goalReviews[0]!;
    review.reviewedAt = "2000-01-02T00:00:00.000Z";
    review.createdAt = review.reviewedAt;
    expect(codes(document).length).toBeGreaterThan(0);
  });

  it("refuses a correction dated before the record it replaces", () => {
    const document = seed();
    const original = document.observations[0]!;
    document.observations.push({
      ...original,
      observationId: "OBS-CORRECTION",
      observedAt: "2000-01-01T00:00:00.000Z",
      createdAt: "2000-01-01T00:00:00.000Z",
      supersedesObservationId: original.observationId,
    });
    expect(codes(document).length).toBeGreaterThan(0);
  });

  it("refuses a duplicated identifier", () => {
    const document = seed();
    document.goals.push({ ...document.goals[0]! });
    expect(codes(document)).toContain("duplicate-id");
  });

  it("refuses a governance identifier prefix inside product records", () => {
    const document = seed();
    document.goals[0]!.goalId = "GOL-1";
    const orphan = { ...document.observations[0]!, observationId: "OBS-2", goalId: "GOL-1" };
    document.observations.push(orphan);
    expect(codes(document).length).toBeGreaterThan(0);
  });
});
