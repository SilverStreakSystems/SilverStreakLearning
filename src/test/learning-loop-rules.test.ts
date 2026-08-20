/**
 * LLR-001 v1.0.0 clause contract.
 *
 * Every reachable clause is constructed from the deterministic synthetic seed,
 * asserted by exact code, exact clause identifier, exact learner/goal/support
 * identifiers, complete sorted-unique basis, rationale, and limitation, and
 * each clause is shown to win over the clauses that follow it.
 *
 * Fixtures are built by mutating a deep copy of the seed rather than by hand
 * authoring documents, so every fixture is checked against the real schema and
 * the real cross-record invariants before it is used.
 */
import { describe, expect, it } from "vitest";

import {
  NEXT_STEP_CODES,
  NEXT_STEP_LABEL,
  NEXT_STEP_LIMITATION,
  NEXT_STEP_RULE_IDS,
  NEXT_STEP_RULE_SET_ID,
  NEXT_STEP_RULE_SET_VERSION,
  REVIEW_RESULTS,
  buildTimeline,
  createSeedDocument,
  parseDocumentShape,
  projectNextStep,
  readLoopSnapshot,
  validateDocumentInvariants,
  type LearningLoopDocument,
  type NextStepCode,
  type NextStepProjection,
  type ReviewResult,
} from "@/domain/learning-loop";

function seed(): LearningLoopDocument {
  return JSON.parse(JSON.stringify(createSeedDocument())) as LearningLoopDocument;
}

const LATE = "2030-01-01T00:00:00.000Z";

/**
 * Moves the document clock to the latest fact it holds. Fixtures that add
 * records after the seed's own saved instant must say the document was saved
 * at least that late, or the document-clock invariant rightly refuses them.
 */
function restamp(document: LearningLoopDocument, at: string): LearningLoopDocument {
  document.lastUpdatedAt = at;
  return document;
}

/** Every fixture must be a document the product would actually accept. */
function valid(document: LearningLoopDocument): LearningLoopDocument {
  expect(parseDocumentShape(document).ok).toBe(true);
  expect(validateDocumentInvariants(document)).toEqual([]);
  return document;
}

/** Asserts the whole projection contract for one clause. */
function expectClause(
  projection: NextStepProjection,
  expected: {
    code: NextStepCode;
    learnerId: string;
    goalId: string | null;
    supportActionId: string | null;
    basis: string[];
    rationale: RegExp;
  },
) {
  expect(projection.code).toBe(expected.code);
  expect(projection.ruleId).toBe(NEXT_STEP_RULE_IDS[expected.code]);
  expect(projection.label).toBe(NEXT_STEP_LABEL[expected.code]);
  expect(projection.ruleSetId).toBe(NEXT_STEP_RULE_SET_ID);
  expect(projection.ruleSetVersion).toBe(NEXT_STEP_RULE_SET_VERSION);
  expect(projection.learnerId).toBe(expected.learnerId);
  expect(projection.goalId).toBe(expected.goalId);
  expect(projection.supportActionId).toBe(expected.supportActionId);
  // Complete, sorted, and unique.
  expect(projection.basedOnRecordIds).toEqual([...new Set(expected.basis)].sort());
  expect(projection.rationale).toMatch(expected.rationale);
  expect(projection.limitation).toBe(NEXT_STEP_LIMITATION);
}

/** Learner B carries the complete chain: goal, baseline, support, follow-up, result. */
function learnerBWithResult(result: ReviewResult): LearningLoopDocument {
  const document = seed();
  document.goalReviews[0]!.result = result;
  return valid(document);
}

describe("LLR-001 R01 — integrity before advice", () => {
  it("refuses to advise on data that breaks a cross-record invariant", () => {
    const document = seed();
    document.goals.push({ ...document.goals[0]! });
    expect(validateDocumentInvariants(document).length).toBeGreaterThan(0);
    const projection = projectNextStep(document, "LRN-A", LATE);
    expectClause(projection, {
      code: "REVIEW_DATA_INTEGRITY",
      learnerId: "LRN-A",
      goalId: null,
      supportActionId: null,
      basis: ["LRN-A"],
      rationale: /inconsistency to resolve/i,
    });
  });

  it("refuses to advise about a learner that is not in the data", () => {
    expectClause(projectNextStep(seed(), "LRN-ZZZ", LATE), {
      code: "REVIEW_DATA_INTEGRITY",
      learnerId: "LRN-ZZZ",
      goalId: null,
      supportActionId: null,
      // Nothing resolves, so the basis cites nothing: a fabricated identifier
      // would look like a record that exists.
      basis: [],
      rationale: /not in the saved data/i,
    });
  });

  it("wins over every later clause, including a fully reviewed loop", () => {
    const document = learnerBWithResult("criterion-met");
    expect(projectNextStep(document, "LRN-B", LATE).code).toBe("HUMAN_REVIEW_GOAL_COMPLETION");
    document.observations.push({ ...document.observations[0]! });
    expect(projectNextStep(document, "LRN-B", LATE).ruleId).toBe("LLR-001-R01");
  });
});

describe("LLR-001 R02 — no goal being worked on", () => {
  it("names every goal it looked at when the learner has goals but no focus", () => {
    const document = seed();
    for (const goal of document.goals) goal.isFocusGoal = false;
    valid(document);
    const goalIds = document.goals
      .filter((goal) => goal.learnerId === "LRN-B")
      .map((goal) => goal.goalId);
    expectClause(projectNextStep(document, "LRN-B", LATE), {
      code: "SELECT_OR_CREATE_FOCUS_GOAL",
      learnerId: "LRN-B",
      goalId: null,
      supportActionId: null,
      basis: ["LRN-B", ...goalIds],
      rationale: /none is marked as the one being worked on/i,
    });
  });

  it("says so plainly when the learner has no goals at all", () => {
    const document = seed();
    document.goalReviews = [];
    document.supportActions = [];
    document.observations = [];
    document.goals = [];
    valid(document);
    expectClause(projectNextStep(document, "LRN-C", LATE), {
      code: "SELECT_OR_CREATE_FOCUS_GOAL",
      learnerId: "LRN-C",
      goalId: null,
      supportActionId: null,
      basis: ["LRN-C"],
      rationale: /no goals yet/i,
    });
  });

  it("wins over the baseline and support clauses that follow it", () => {
    const document = seed();
    // Learner B has a baseline, a completed support, and a result; without a
    // focus goal none of that can be reached.
    document.goals.find((goal) => goal.goalId === "GOL-B1")!.isFocusGoal = false;
    valid(document);
    expect(projectNextStep(document, "LRN-B", LATE).ruleId).toBe("LLR-001-R02");
  });
});

describe("LLR-001 R03 — no baseline observation", () => {
  it("asks for a baseline when the focus goal has nothing observed against it", () => {
    // Sample Learner C is seeded exactly in this state.
    expectClause(projectNextStep(seed(), "LRN-C", LATE), {
      code: "RECORD_BASELINE_OBSERVATION",
      learnerId: "LRN-C",
      goalId: "GOL-C1",
      supportActionId: null,
      basis: ["GOL-C1"],
      rationale: /nothing observed against it yet/i,
    });
  });

  it("wins even when a support already exists on the goal", () => {
    const document = seed();
    // Learner A keeps the observed goal and its planned support, but a second
    // goal is now the one being worked on and nothing has been observed
    // against it. Evidence on another goal is not a starting point for this one.
    const goalA1 = document.goals.find((row) => row.goalId === "GOL-A1")!;
    goalA1.isFocusGoal = false;
    document.goals.push({
      ...goalA1,
      goalId: "GOL-A2",
      title: "Fictional second goal",
      isFocusGoal: true,
    });
    valid(document);
    expectClause(projectNextStep(document, "LRN-A", LATE), {
      code: "RECORD_BASELINE_OBSERVATION",
      learnerId: "LRN-A",
      goalId: "GOL-A2",
      supportActionId: null,
      basis: ["GOL-A2"],
      rationale: /nothing observed against it yet/i,
    });
  });
});

describe("LLR-001 R04 — nothing is being tried", () => {
  it("asks for a support when the goal has an observation and no support", () => {
    const document = seed();
    document.supportActions = document.supportActions.filter(
      (row) => row.supportActionId !== "SUP-A1",
    );
    valid(document);
    expectClause(projectNextStep(document, "LRN-A", LATE), {
      code: "PLAN_SUPPORT",
      learnerId: "LRN-A",
      goalId: "GOL-A1",
      supportActionId: null,
      basis: ["GOL-A1", "OBS-A1"],
      rationale: /no support has been planned from it/i,
    });
  });

  it("treats a cancelled support as nothing currently being tried, and says so", () => {
    const document = seed();
    const support = document.supportActions.find((row) => row.supportActionId === "SUP-A1")!;
    support.status = "cancelled";
    support.completedAt = null;
    support.completionNote = "Cancelled before it was carried out.";
    support.updatedAt = "2026-01-10T08:00:00.000Z";
    valid(document);
    expectClause(projectNextStep(document, "LRN-A", LATE), {
      code: "PLAN_SUPPORT",
      learnerId: "LRN-A",
      goalId: "GOL-A1",
      supportActionId: null,
      // The cancelled support is named in the trace: it is why this answer is
      // "plan again" rather than "carry on".
      basis: ["GOL-A1", "OBS-A1", "SUP-A1"],
      rationale: /last support on this goal was cancelled/i,
    });
  });
});

describe("LLR-001 R05 — a planned support has to be closed off", () => {
  it("names the planned support and quotes it in the reason", () => {
    // Sample Learner A is seeded exactly in this state.
    expectClause(projectNextStep(seed(), "LRN-A", LATE), {
      code: "COMPLETE_OR_CANCEL_SUPPORT",
      learnerId: "LRN-A",
      goalId: "GOL-A1",
      supportActionId: "SUP-A1",
      basis: ["GOL-A1", "SUP-A1"],
      rationale: /is still planned, so nothing can be judged from it yet/i,
    });
  });

  it("wins over the follow-up and review clauses that follow it", () => {
    const document = seed();
    // Learner B's completed support is put back to planned, and the records
    // that could only exist after completion are removed with it. A valid
    // document cannot hold follow-up evidence for a support that has not been
    // carried out, so R05 is the only reachable answer in this state.
    const support = document.supportActions.find((row) => row.supportActionId === "SUP-B1")!;
    support.status = "planned";
    support.completedAt = null;
    support.completionNote = null;
    document.goalReviews = [];
    document.observations = document.observations.filter((row) => row.observationId !== "OBS-B2");
    valid(document);
    const projection = projectNextStep(document, "LRN-B", LATE);
    expect(projection.ruleId).toBe("LLR-001-R05");
    expect(projection.supportActionId).toBe(support.supportActionId);
  });

  it("refuses an earlier evaluation instant instead of reconstructing history", () => {
    // The five-record model does not record what the goal looked like before
    // the document's own saved instant, so an earlier asOf is answered at R01.
    const projection = projectNextStep(seed(), "LRN-B", "2026-01-10T00:00:00.000Z");
    expect(projection.ruleId).toBe("LLR-001-R01");
    expect(projection.rationale).toMatch(/cannot reconstruct what the goal looked like/i);
  });
});

describe("LLR-001 R06 — a completed support with nothing observed since", () => {
  it("asks for a follow-up observation and names the completed support", () => {
    const document = seed();
    document.goalReviews = [];
    document.observations = document.observations.filter((row) => row.observationId !== "OBS-B2");
    valid(document);
    expectClause(projectNextStep(document, "LRN-B", LATE), {
      code: "RECORD_FOLLOW_UP_OBSERVATION",
      learnerId: "LRN-B",
      goalId: "GOL-B1",
      supportActionId: "SUP-B1",
      basis: ["GOL-B1", "SUP-B1"],
      rationale: /is done, but nothing has been observed since/i,
    });
  });

  it("treats a newer unlinked observation as a reason to plan again, not as a follow-up", () => {
    const document = seed();
    document.goalReviews = [];
    const followUp = document.observations.find((row) => row.observationId === "OBS-B2")!;
    followUp.supportActionId = null;
    valid(document);
    // The completed support is no longer the newest thing that happened, and
    // the new observation was not judged against it, so the loop restarts at
    // planning rather than asking for evidence that already exists.
    expect(projectNextStep(document, "LRN-B", LATE).ruleId).toBe("LLR-001-R04");
  });
});

describe("LLR-001 R07 — follow-up evidence that has not been judged", () => {
  it("names every unjudged follow-up observation in the basis", () => {
    const document = seed();
    document.goalReviews = [];
    valid(document);
    expectClause(projectNextStep(document, "LRN-B", LATE), {
      code: "REVIEW_OBSERVATIONS",
      learnerId: "LRN-B",
      goalId: "GOL-B1",
      supportActionId: "SUP-B1",
      basis: ["GOL-B1", "SUP-B1", "OBS-B2"],
      rationale: /1 observation recorded after .* has not been judged yet/i,
    });
  });

  it("counts more than one unjudged observation in plural wording", () => {
    const document = seed();
    document.goalReviews = [];
    const followUp = document.observations.find((row) => row.observationId === "OBS-B2")!;
    document.observations.push({
      ...followUp,
      observationId: "OBS-B3",
      observedAt: "2026-01-18T11:00:00.000Z",
      createdAt: "2026-01-18T11:00:00.000Z",
    });
    valid(restamp(document, "2026-01-18T11:00:00.000Z"));
    expectClause(projectNextStep(document, "LRN-B", LATE), {
      code: "REVIEW_OBSERVATIONS",
      learnerId: "LRN-B",
      goalId: "GOL-B1",
      supportActionId: "SUP-B1",
      basis: ["GOL-B1", "SUP-B1", "OBS-B2", "OBS-B3"],
      rationale: /2 observations recorded after .* have not been judged yet/i,
    });
  });

  it("wins over the recorded-result clauses while any follow-up is unjudged", () => {
    const document = learnerBWithResult("criterion-met");
    const followUp = document.observations.find((row) => row.observationId === "OBS-B2")!;
    document.observations.push({
      ...followUp,
      observationId: "OBS-B4",
      observedAt: "2026-01-19T11:00:00.000Z",
      createdAt: "2026-01-19T11:00:00.000Z",
    });
    valid(restamp(document, "2026-01-19T11:00:00.000Z"));
    expect(projectNextStep(document, "LRN-B", LATE).ruleId).toBe("LLR-001-R07");
  });
});

describe("LLR-001 R08..R12 — one clause per recorded result", () => {
  const expectations: {
    result: ReviewResult;
    code: NextStepCode;
    ruleId: string;
    rationale: RegExp;
  }[] = [
    {
      result: "insufficient-evidence",
      code: "COLLECT_MORE_EVIDENCE",
      ruleId: "LLR-001-R08",
      rationale: /not enough evidence to judge/i,
    },
    {
      result: "mixed",
      code: "COLLECT_COMPARABLE_EVIDENCE",
      ruleId: "LLR-001-R09",
      rationale: /mixed across situations/i,
    },
    {
      result: "no-progress-observed",
      code: "ADJUST_SUPPORT",
      ruleId: "LLR-001-R10",
      rationale: /no progress was observed/i,
    },
    {
      result: "progress-observed",
      code: "CONTINUE_SUPPORT_AND_OBSERVE",
      ruleId: "LLR-001-R11",
      rationale: /progress but the success criterion is not met yet/i,
    },
    {
      result: "criterion-met",
      code: "HUMAN_REVIEW_GOAL_COMPLETION",
      ruleId: "LLR-001-R12",
      rationale: /human decision; this rule set does not close goals/i,
    },
  ];

  for (const expectation of expectations) {
    it(`projects ${expectation.ruleId} for a recorded result of "${expectation.result}"`, () => {
      const document = learnerBWithResult(expectation.result);
      const projection = projectNextStep(document, "LRN-B", LATE);
      expectClause(projection, {
        code: expectation.code,
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: "SUP-B1",
        // The result's own cited evidence is part of what the advice rests on.
        basis: ["GOL-B1", "SUP-B1", "REV-B1", "OBS-B2"],
        rationale: expectation.rationale,
      });
      expect(projection.ruleId).toBe(expectation.ruleId);
    });
  }

  it("covers every recorded result vocabulary entry with a distinct clause", () => {
    const seen = REVIEW_RESULTS.map(
      (result) => projectNextStep(learnerBWithResult(result), "LRN-B", LATE).ruleId,
    );
    expect(seen).toHaveLength(REVIEW_RESULTS.length);
    expect(new Set(seen).size).toBe(REVIEW_RESULTS.length);
    expect(seen).not.toContain("LLR-001-R13");
  });

  it("reads the latest result when an earlier one was corrected", () => {
    const document = seed();
    document.goalReviews[0]!.result = "insufficient-evidence";
    document.goalReviews.push({
      ...document.goalReviews[0]!,
      goalReviewId: "REV-B2",
      result: "criterion-met",
      reviewedAt: "2026-01-20T09:00:00.000Z",
      createdAt: "2026-01-20T09:00:00.000Z",
      supersedesGoalReviewId: "REV-B1",
    });
    valid(restamp(document, "2026-01-20T09:00:00.000Z"));
    const projection = projectNextStep(document, "LRN-B", LATE);
    expect(projection.ruleId).toBe("LLR-001-R12");
    expect(projection.basedOnRecordIds).toEqual(["GOL-B1", "OBS-B2", "REV-B2", "SUP-B1"]);
  });
});

describe("LLR-001 R12 — completion is a human decision", () => {
  it("does not close the goal, does not mutate the document, and says a person must decide", () => {
    const document = learnerBWithResult("criterion-met");
    const before = JSON.stringify(document);
    const projection = projectNextStep(document, "LRN-B", LATE);

    expect(JSON.stringify(document)).toBe(before);
    expect(document.goals.find((goal) => goal.goalId === "GOL-B1")!.status).toBe("active");
    expect(projection.label).toBe("A person should review whether this goal is finished");
    expect(projection.rationale).toMatch(/whether the goal is finished is a human decision/i);
    expect(projection.rationale).toMatch(/does not close goals/i);
    // Nothing in the projection reads as an approval or an automatic closure.
    expect(projection.label.toLowerCase()).not.toMatch(/approved|closed|complete the goal/);
    expect(projection.limitation).toMatch(/decides nothing, approves nothing/i);
  });
});

describe("LLR-001 R13 — defensive fallback", () => {
  it("is declared once, last, and is not reachable from any schema-valid document", () => {
    expect(NEXT_STEP_RULE_IDS.REVIEW_LOOP_MANUALLY).toBe("LLR-001-R13");
    expect(NEXT_STEP_CODES.at(-1)).toBe("REVIEW_LOOP_MANUALLY");

    // Mechanical exhaustiveness: the only route past R07 is the recorded-result
    // switch, and that switch has one branch per entry of the result
    // vocabulary. Every entry is covered above, so no schema-valid document can
    // fall through to R13.
    const results = new Set<ReviewResult>(REVIEW_RESULTS);
    expect(results.size).toBe(REVIEW_RESULTS.length);
    for (const result of results)
      expect(projectNextStep(learnerBWithResult(result), "LRN-B", LATE).ruleId).not.toBe(
        "LLR-001-R13",
      );
  });

  it("cannot be reached by an invalid document either, because R01 catches it first", () => {
    // A document carrying a result outside the vocabulary is refused by the
    // schema at every boundary that can store or import it, so it can never be
    // the input to a projection in the product. Constructed directly here, it
    // is refused by the shape parser, and the reachable clause for a document
    // the rule set cannot trust is R01, not R13.
    const document = seed();
    (document.goalReviews[0] as unknown as { result: string }).result = "not-a-result";
    expect(parseDocumentShape(document).ok).toBe(false);

    const brokenAndInconsistent = seed();
    (brokenAndInconsistent.goalReviews[0] as unknown as { result: string }).result = "not-a-result";
    brokenAndInconsistent.goals.push({ ...brokenAndInconsistent.goals[0]! });
    expect(projectNextStep(brokenAndInconsistent, "LRN-B", LATE).ruleId).toBe("LLR-001-R01");
  });

  it("keeps one code, one clause, one label across the whole vocabulary", () => {
    expect(NEXT_STEP_CODES).toHaveLength(13);
    const ruleIds = NEXT_STEP_CODES.map((code) => NEXT_STEP_RULE_IDS[code]);
    expect(new Set(ruleIds).size).toBe(NEXT_STEP_CODES.length);
    expect(ruleIds).toEqual(
      Array.from({ length: 13 }, (_, index) => `LLR-001-R${String(index + 1).padStart(2, "0")}`),
    );
    for (const code of NEXT_STEP_CODES) expect(NEXT_STEP_LABEL[code].length).toBeGreaterThan(0);
    expect(new Set(NEXT_STEP_CODES.map((code) => NEXT_STEP_LABEL[code])).size).toBe(13);
  });
});

describe("LLR-001 purity and asOf filtering", () => {
  it("is pure: the same inputs give the same projection and mutate nothing", () => {
    const document = seed();
    const before = JSON.stringify(document);
    const a = projectNextStep(document, "LRN-A", LATE);
    const b = projectNextStep(document, "LRN-A", LATE);
    expect(a).toEqual(b);
    expect(JSON.stringify(document)).toBe(before);
  });

  it("gives the same answer for every learner on repeated calls", () => {
    const document = seed();
    for (const learner of document.learners) {
      const first = projectNextStep(document, learner.learnerId, LATE);
      const second = projectNextStep(JSON.parse(JSON.stringify(document)), learner.learnerId, LATE);
      expect(first).toEqual(second);
    }
  });

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

  it("filters goals, observations, supports, and results independently by asOf", () => {
    const document = seed();
    // After the goal and baseline, before the support was planned.
    const midway = "2026-01-07T12:00:00.000Z";
    const snapshot = readLoopSnapshot(document, "LRN-B", midway);
    expect(snapshot.focusGoal?.goalId).toBe("GOL-B1");
    expect(snapshot.observations.map((row) => row.observationId)).toEqual(["OBS-B1"]);
    expect(snapshot.supports).toEqual([]);
    expect(snapshot.reviews).toEqual([]);
    // The snapshot filters, but the projection refuses to answer for an instant
    // before the document's own saved state rather than pretending to.
    expect(projectNextStep(document, "LRN-B", midway).ruleId).toBe("LLR-001-R01");
  });

  it("hides a recorded result that had not been recorded yet at asOf", () => {
    const document = seed();
    const beforeReview = "2026-01-16T12:00:00.000Z";
    expect(readLoopSnapshot(document, "LRN-B", beforeReview).reviews).toEqual([]);
    expect(projectNextStep(document, "LRN-B", beforeReview).ruleId).toBe("LLR-001-R01");
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

/**
 * Regressions for the corrected current-state semantics.
 *
 * Each case here is a defect that the earlier clause tests did not catch: the
 * projection either produced advice it could not honestly support, or stepped
 * over the newest fact to reach an older one.
 */
/**
 * An instant strictly after every recorded moment in the document, so fixtures
 * that append "what happened next" cannot accidentally be dated into the past.
 */
function afterEverything(document: LearningLoopDocument): string {
  const stamps = [
    document.lastUpdatedAt,
    ...document.goals.flatMap((row) => [row.createdAt, row.updatedAt]),
    ...document.observations.flatMap((row) => [row.observedAt, row.createdAt]),
    ...document.supportActions.flatMap((row) => [
      row.plannedAt,
      row.createdAt,
      row.updatedAt,
      row.completedAt ?? row.createdAt,
    ]),
    ...document.goalReviews.flatMap((row) => [row.reviewedAt, row.createdAt]),
  ].map((value) => Date.parse(value));
  return new Date(Math.max(...stamps) + 3_600_000).toISOString();
}

describe("LLR-001 — current-state projection boundary", () => {
  it("refuses an unusable evaluation instant instead of advising anyway", () => {
    expectClause(projectNextStep(seed(), "LRN-B", "not-a-time"), {
      code: "REVIEW_DATA_INTEGRITY",
      learnerId: "LRN-B",
      goalId: null,
      supportActionId: null,
      basis: ["LRN-B"],
      rationale: /not a usable instant/i,
    });
  });

  it("refuses a historical evaluation instant, and says goal state cannot be reconstructed", () => {
    const document = seed();
    const before = new Date(Date.parse(document.lastUpdatedAt) - 60_000).toISOString();
    expectClause(projectNextStep(document, "LRN-B", before), {
      code: "REVIEW_DATA_INTEGRITY",
      learnerId: "LRN-B",
      goalId: null,
      supportActionId: null,
      basis: ["LRN-B"],
      rationale: /current state only|cannot reconstruct/i,
    });
  });

  it("accepts exactly the document's own last-updated instant", () => {
    const document = seed();
    expect(projectNextStep(document, "LRN-B", document.lastUpdatedAt).ruleId).not.toBe(
      "LLR-001-R01",
    );
  });
});

describe("LLR-001 — supersession is evaluation-time aware", () => {
  it("does not let a correction erase its predecessor from an earlier view", () => {
    const document = seed();
    const original = document.observations.find((row) => row.learnerId === "LRN-A")!;
    const later = afterEverything(document);
    document.observations.push({
      ...original,
      observationId: "OBS-CORRECTION",
      observedAt: later,
      observationText: "Corrected wording of the same lesson.",
      createdAt: later,
      supersedesObservationId: original.observationId,
      supportActionId: null,
    });
    document.lastUpdatedAt = later;
    valid(document);

    // Evaluated before the correction was written, the original still stands.
    const early = readLoopSnapshot(document, "LRN-A", original.createdAt);
    expect(early.observations.map((row) => row.observationId)).toContain(original.observationId);
    expect(early.observations.map((row) => row.observationId)).not.toContain("OBS-CORRECTION");

    // Evaluated after it, the correction replaces it.
    const now = readLoopSnapshot(document, "LRN-A", later);
    expect(now.observations.map((row) => row.observationId)).toContain("OBS-CORRECTION");
    expect(now.observations.map((row) => row.observationId)).not.toContain(original.observationId);
  });
});

describe("LLR-001 R04 — the current support must follow from what was last seen", () => {
  it("asks for a new plan when the newest support was cancelled, instead of showing an older completed one", () => {
    const document = learnerBWithResult("progress-observed");
    const completed = document.supportActions.find(
      (row) => row.learnerId === "LRN-B" && row.status === "completed",
    )!;
    const later = afterEverything(document);
    const baseline = document.observations.find(
      (row) => row.goalId === completed.goalId && row.supportActionId === null,
    )!;
    document.supportActions.push({
      ...completed,
      supportActionId: "SUP-B9",
      basedOnObservationIds: [baseline.observationId],
      status: "cancelled",
      plannedAt: later,
      completedAt: null,
      completionNote: "Called off before it was run.",
      createdAt: later,
      updatedAt: later,
    });
    document.lastUpdatedAt = later;
    valid(document);

    const projection = projectNextStep(document, "LRN-B", later);
    expect(projection.ruleId).toBe("LLR-001-R04");
    expect(projection.code).toBe("PLAN_SUPPORT");
    expect(projection.rationale).toMatch(/cancelled/i);
  });

  it("asks for a new plan when the current support was not based on the newest observation", () => {
    const document = seed();
    document.goalReviews = document.goalReviews.filter((row) => row.learnerId !== "LRN-B");
    const support = document.supportActions.find((row) => row.learnerId === "LRN-B")!;
    const later = afterEverything(document);
    document.observations.push({
      learnerId: "LRN-B",
      goalId: support.goalId,
      observationId: "OBS-B9",
      supportActionId: null,
      observedAt: later,
      sourceKind: "direct-observation",
      observationText: "Something new was seen that no support was planned from.",
      supersedesObservationId: null,
      createdAt: later,
      synthetic: true,
    });
    document.lastUpdatedAt = later;
    valid(document);

    const projection = projectNextStep(document, "LRN-B", later);
    expect(projection.ruleId).toBe("LLR-001-R04");
    // The stale support is named: it is the thing being stepped away from.
    expect(projection.basedOnRecordIds).toEqual(
      [support.goalId, "OBS-B9", support.supportActionId].sort(),
    );
  });
});
