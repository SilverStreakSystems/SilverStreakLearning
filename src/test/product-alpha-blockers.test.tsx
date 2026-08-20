/**
 * Named regressions for the independent acceptance review blockers.
 *
 * Each test here exists because a specific failure was possible in the shipped
 * product code, not because a rule says the behaviour should hold. They drive
 * the real commands, the real repository, and the real routes.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import {
  createSeedDocument,
  projectNextStep,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import { recordGoalReview } from "@/lib/learning-loop/commands";
import {
  BrowserLearningLoopRepository,
  ENVELOPE_VERSION,
  LEARNING_LOOP_STORAGE_KEY,
} from "@/lib/learning-loop/repository";

const AT = "2026-04-01T09:00:00.000Z";
const CONTEXT = { now: AT, newId: (prefix: string) => `${prefix}-TEST1` };

function storedEnvelope(): { current: string; backup: string | null } {
  const raw = window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);
  if (!raw) throw new Error("Nothing is stored.");
  return JSON.parse(raw) as { current: string; backup: string | null };
}

function storedRevision(): number {
  return (JSON.parse(storedEnvelope().current) as { revision: number }).revision;
}

async function openDisclosure(user: ReturnType<typeof userEvent.setup>, name: RegExp | string) {
  const button = await screen.findByRole("button", { name });
  if (button.getAttribute("aria-expanded") !== "true") await user.click(button);
  return button;
}

async function loadSampleRecords(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Load the sample records" }));
  await screen.findByText(/Sample Learner A \(fictional\)/);
}

describe("blocker 1: a correction may not cross supports", () => {
  it("refuses a goal review that supersedes a review of a different support", () => {
    const document = createSeedDocument();
    const before = serializeDocument(document);
    // REV-B1 judged SUP-B1. This attempts to retire it from a review of a
    // support that judged different work.
    const outcome = recordGoalReview(
      document,
      {
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: "SUP-A1",
        observationIds: ["OBS-B2"],
        reviewedAt: AT,
        result: "criterion-met",
        rationale: "A correction that reaches across supports must be refused.",
        supersedesGoalReviewId: "REV-B1",
      },
      CONTEXT,
    );

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error("unreachable");
    expect(outcome.code).toBe("ownership-mismatch");
    // No record was created and the document handed in was not mutated.
    expect(serializeDocument(document)).toBe(before);
    expect(document.goalReviews).toHaveLength(1);
  });

  it("refuses it through the repository too, leaving the stored bytes exact", () => {
    const storage = window.localStorage;
    storage.clear();
    const repository = new BrowserLearningLoopRepository(storage);
    repository.commit(null, createSeedDocument(), AT);
    const bytesBefore = storage.getItem(LEARNING_LOOP_STORAGE_KEY);

    const read = repository.read();
    if (read.status !== "ready") throw new Error("expected a ready document");
    const outcome = recordGoalReview(
      read.document,
      {
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: "SUP-A1",
        observationIds: ["OBS-B2"],
        reviewedAt: AT,
        result: "criterion-met",
        rationale: "A correction that reaches across supports must be refused.",
        supersedesGoalReviewId: "REV-B1",
      },
      CONTEXT,
    );
    expect(outcome.ok).toBe(false);
    expect(storage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(bytesBefore);
  });
});

describe("blocker 3: R01 runs on shape before it reads any field", () => {
  it("reports data integrity for a shape-only defect with no cross-record defect", () => {
    const document = createSeedDocument();
    // A single invalid enum value. Every cross-record relationship still holds.
    const broken = {
      ...document,
      observations: document.observations.map((row, index) =>
        index === 0 ? { ...row, sourceKind: "hearsay" } : row,
      ),
    } as unknown as LearningLoopDocument;

    const projection = projectNextStep(broken, "LRN-A", AT);
    expect(projection.ruleId).toBe("LLR-001-R01");
    expect(projection.code).toBe("REVIEW_DATA_INTEGRITY");
    // The basis may not name records read out of a document that failed shape.
    expect(projection.basedOnRecordIds).toEqual([]);
  });

  it("survives a document with no records at all", () => {
    const empty = { notADocument: true } as unknown as LearningLoopDocument;
    const projection = projectNextStep(empty, "LRN-A", AT);
    expect(projection.code).toBe("REVIEW_DATA_INTEGRITY");
    expect(projection.basedOnRecordIds).toEqual([]);
  });
});

describe("blocker 4: envelope decoding is version aware", () => {
  beforeEach(() => window.localStorage.clear());

  it("refuses a newer envelope version and preserves the raw bytes exactly", () => {
    const bytes = JSON.stringify({
      envelopeVersion: ENVELOPE_VERSION + 1,
      current: serializeDocument(createSeedDocument()),
      backup: null,
    });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, bytes);
    const repository = new BrowserLearningLoopRepository(window.localStorage);

    expect(repository.read().status).toBe("unsupported-version");
    expect(repository.commit(null, createSeedDocument(), AT).status).toBe("conflict");
    expect(repository.readRaw()).toEqual({ status: "ok", raw: bytes });
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(bytes);
  });

  it("reports a malformed v1 envelope as corrupt and preserves the raw bytes exactly", () => {
    const bytes = JSON.stringify({
      envelopeVersion: ENVELOPE_VERSION,
      current: "{ not a document",
      backup: null,
    });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, bytes);
    const repository = new BrowserLearningLoopRepository(window.localStorage);

    expect(repository.read().status).toBe("corrupt");
    expect(repository.commit(null, createSeedDocument(), AT).status).toBe("conflict");
    expect(repository.readRaw()).toEqual({ status: "ok", raw: "{ not a document" });
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(bytes);
  });
});

describe("blocker 2: a destructive action fails closed without an expectation", () => {
  beforeEach(() => window.localStorage.clear());

  it("does not open the restore confirmation when the expectation cannot be captured", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSampleRecords(user);
    const bytesBefore = window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);

    const realGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function blocked() {
      throw new Error("blocked");
    };
    try {
      await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
    } finally {
      Storage.prototype.getItem = realGetItem;
    }

    // No confirmation panel, so nothing can be confirmed against nothing.
    expect(screen.queryByRole("heading", { name: /Restoring replaces everything/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Replace with the sample records" })).toBeNull();
    expect(await screen.findByRole("status")).toBeTruthy();
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(bytesBefore);
  });
});

describe("blocker 5: the drawer traps focus in what can actually be reached", () => {
  beforeEach(() => window.localStorage.clear());

  it("cycles tab inside the drawer and returns focus to the trigger on close", async () => {
    const user = userEvent.setup();
    await renderRoute("/");
    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);

    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    const close = within(drawer).getByRole("button", { name: "Close menu" });
    expect(close).toHaveFocus();

    // Tab all the way round: focus never leaves the drawer.
    for (let step = 0; step < 12; step += 1) {
      await user.tab();
      expect(drawer.contains(window.document.activeElement)).toBe(true);
    }
    await user.tab({ shift: true });
    expect(drawer.contains(window.document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

describe("blockers 6 and 9: one attempt at a time, and focus follows the announcement", () => {
  beforeEach(() => window.localStorage.clear());

  it("clears the previous success before the next attempt and moves focus to the next step", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSampleRecords(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await openDisclosure(user, "Record an observation");
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "The help card was turned over twice during independent work.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    // Focus lands on the announced next step, not on the form left behind.
    await waitFor(() => expect(window.document.getElementById("next-step-heading")).toHaveFocus());
    expect(screen.getByRole("status").textContent).toMatch(/Next:/);

    // The next attempt fails at storage. The previous success must not still be
    // readable as the outcome of it.
    const realSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function blocked() {
      throw new Error("quota");
    };
    try {
      await openDisclosure(user, "Record an observation");
      await user.type(
        await screen.findByLabelText(/What did you see\?/),
        "A second observation that storage will refuse.",
      );
      await user.click(screen.getByRole("button", { name: "Save this observation" }));
    } finally {
      Storage.prototype.setItem = realSetItem;
    }

    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(screen.queryByRole("status")?.textContent ?? "").not.toMatch(/Next:/);
    // The draft is still on screen: nothing typed has to be typed twice.
    expect((await screen.findByLabelText(/What did you see\?/)).getAttribute("value")).toBe(null);
    expect(await screen.findByDisplayValue(/storage will refuse/)).toBeTruthy();
  });
});

describe("blocker 7: a refused write keeps the form and its draft", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps the close-off form open with its note after a storage failure", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSampleRecords(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await openDisclosure(user, /Close off:/);
    const note = await screen.findByLabelText(/Anything worth noting/);
    await user.type(note, "The card was used on three of five days.");

    const realSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function blocked() {
      throw new Error("quota");
    };
    try {
      await user.click(screen.getByRole("button", { name: "Mark it done" }));
    } finally {
      Storage.prototype.setItem = realSetItem;
    }

    // Still open, still holding the draft, still offering the same retry.
    const summary = await screen.findByRole("button", { name: /Close off:/ });
    expect(summary.getAttribute("aria-expanded")).toBe("true");
    expect(
      await screen.findByDisplayValue("The card was used on three of five days."),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mark it done" })).toBeTruthy();
  });
});

describe("blocker 8: a correction, recorded through the route", () => {
  beforeEach(() => window.localStorage.clear());

  it("marks the earlier result replaced, advances the revision once, and updates the projection", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSampleRecords(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner B/ }));
    const revisionBefore = storedRevision();

    await openDisclosure(user, /Decide what happened after:/);
    await user.selectOptions(
      screen.getByLabelText(/Does this correct an earlier result\?/),
      "REV-B1",
    );
    await user.selectOptions(screen.getByLabelText(/What does it show\?/), "criterion-met");
    await user.type(
      screen.getByLabelText(/Why do you say that\?/),
      "Re-reading the work samples, all three lessons met the criterion.",
    );
    await user.click(screen.getByRole("button", { name: "Save this result" }));

    await waitFor(() => expect(storedRevision()).toBe(revisionBefore + 1));
    expect(screen.getByRole("status").textContent).toMatch(/correction was saved/i);
    // Exactly one entry is marked replaced, and the successor is the effective one.
    const replaced = await screen.findAllByText(/Replaced by a later correction/);
    expect(replaced).toHaveLength(1);
    expect(
      (await screen.findAllByText(/all three lessons met the criterion/)).length,
    ).toBeGreaterThan(0);
    // The projection now reads the corrected result.
    expect((await screen.findAllByText(/The success criterion was met/)).length).toBeGreaterThan(0);
  });
});
