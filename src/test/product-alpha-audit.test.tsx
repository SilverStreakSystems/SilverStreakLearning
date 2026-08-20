/**
 * Named regressions for the independent audit no-go items.
 *
 * Every test here replaces or completes a proof that the audit found to be
 * absent or false. They drive the real commands, the real repository, and the
 * real routes: nothing here asserts against a re-implementation of a rule.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import {
  createSeedDocument,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import type { CommandContext } from "@/lib/learning-loop/context";
import {
  completeSupport,
  planSupport,
  recordGoalReview,
  recordObservation,
} from "@/lib/learning-loop/commands";
import {
  BrowserLearningLoopRepository,
  ENVELOPE_VERSION,
  LEARNING_LOOP_STORAGE_KEY,
} from "@/lib/learning-loop/repository";

const NOW = "2026-05-01T09:00:00.000Z";

function contextAt(now: string, id: string): CommandContext {
  return { now, newId: () => id };
}

function storedBytes(): string | null {
  return window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);
}

function storedRevision(): number {
  const raw = storedBytes();
  if (!raw) throw new Error("Nothing is stored.");
  const envelope = JSON.parse(raw) as { current: string };
  return (JSON.parse(envelope.current) as { revision: number }).revision;
}

/** Hands a file to the import control the way the file picker does. */
function chooseFile(file: File) {
  const input = window.document.getElementById("learning-loop-import") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  fireEvent.change(input);
}

function jsonFile(text: string): File {
  const file = new File([text], "import.json", { type: "application/json" });
  Object.defineProperty(file, "size", { value: text.length, configurable: true });
  Object.defineProperty(file, "text", { value: () => Promise.resolve(text), configurable: true });
  return file;
}

async function loadSamples(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Load the sample records" }));
  await screen.findByText(/Sample Learner A \(fictional\)/);
}

async function openDisclosure(user: ReturnType<typeof userEvent.setup>, name: RegExp | string) {
  const button = await screen.findByRole("button", { name });
  if (button.getAttribute("aria-expanded") !== "true") await user.click(button);
  return button;
}

/**
 * One learner, one goal, TWO completed supports, each with its own linked
 * follow-up observation. This is the only shape in which the same-support rule
 * for corrections is the guard actually reached: learner and goal both match.
 */
function twoSupportFixture(): {
  document: LearningLoopDocument;
  secondSupportId: string;
  secondObservationId: string;
} {
  const secondSupportId = "SUP-B2";
  const secondObservationId = "OBS-B3";
  let document = createSeedDocument();

  const planned = planSupport(
    document,
    {
      learnerId: "LRN-B",
      goalId: "GOL-B1",
      basedOnObservationIds: ["OBS-B2"],
      title: "Add a two-minute planning box before writing begins",
      rationale: "Starting improved with the strip, so the remaining delay is in planning.",
      intendedEvidence: "Writing begins within two minutes in three consecutive lessons.",
      plannedAt: "2026-04-20T09:00:00.000Z",
    },
    contextAt("2026-04-20T09:00:00.000Z", secondSupportId),
  );
  if (!planned.ok) throw new Error(planned.message);
  document = planned.document;

  const completed = completeSupport(
    document,
    secondSupportId,
    "2026-04-24T09:00:00.000Z",
    "Planning box used in every lesson for a week.",
    contextAt("2026-04-24T09:00:00.000Z", "unused"),
  );
  if (!completed.ok) throw new Error(completed.message);
  document = completed.document;

  const observed = recordObservation(
    document,
    {
      learnerId: "LRN-B",
      goalId: "GOL-B1",
      supportActionId: secondSupportId,
      observedAt: "2026-04-27T09:00:00.000Z",
      sourceKind: "work-sample",
      observationText:
        "With the planning box, writing began within two minutes in all three lessons observed.",
      supersedesObservationId: null,
    },
    contextAt("2026-04-27T09:00:00.000Z", secondObservationId),
  );
  if (!observed.ok) throw new Error(observed.message);
  document = observed.document;

  return { document, secondSupportId, secondObservationId };
}

describe("audit A: the same-support correction guard is the guard actually exercised", () => {
  beforeEach(() => window.localStorage.clear());

  it("refuses a correction naming a second support of the SAME learner and SAME goal", () => {
    const { document, secondSupportId, secondObservationId } = twoSupportFixture();
    const before = serializeDocument(document);

    const outcome = recordGoalReview(
      document,
      {
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        // Same learner, same goal: the learner and goal guards both pass, so
        // the support comparison is the only thing that can refuse this.
        supportActionId: secondSupportId,
        observationIds: [secondObservationId],
        reviewedAt: NOW,
        result: "criterion-met",
        rationale: "A correction may not retire a judgement about different work.",
        supersedesGoalReviewId: "REV-B1",
      },
      contextAt(NOW, "REV-B2"),
    );

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error("unreachable");
    expect(outcome.code).toBe("ownership-mismatch");
    expect(outcome.message).toBe(
      "That result judged a different support, so it cannot be corrected from here.",
    );
    expect(serializeDocument(document)).toBe(before);
    expect(document.goalReviews).toHaveLength(1);
  });

  it("commits nothing through the repository transaction path and leaves the bytes exact", () => {
    const { document, secondSupportId, secondObservationId } = twoSupportFixture();
    const repository = new BrowserLearningLoopRepository(window.localStorage);
    expect(repository.commit(null, document, NOW).status).toBe("ok");
    const bytesBefore = storedBytes();
    const revisionBefore = storedRevision();

    const read = repository.read();
    if (read.status !== "ready") throw new Error("expected a ready document");
    const outcome = recordGoalReview(
      read.document,
      {
        learnerId: "LRN-B",
        goalId: "GOL-B1",
        supportActionId: secondSupportId,
        observationIds: [secondObservationId],
        reviewedAt: NOW,
        result: "criterion-met",
        rationale: "A correction may not retire a judgement about different work.",
        supersedesGoalReviewId: "REV-B1",
      },
      contextAt(NOW, "REV-B2"),
    );
    expect(outcome.ok).toBe(false);

    // No commit was reached, so no revision moved and no review appeared.
    expect(storedBytes()).toBe(bytesBefore);
    expect(storedRevision()).toBe(revisionBefore);
    const after = repository.read();
    if (after.status !== "ready") throw new Error("expected a ready document");
    expect(after.document.goalReviews).toHaveLength(1);
    expect(after.document.goalReviews[0]!.goalReviewId).toBe("REV-B1");
  });

  it("never offers another support's result as correctable in the review form", async () => {
    const user = userEvent.setup();
    const repository = new BrowserLearningLoopRepository(window.localStorage);
    repository.commit(null, twoSupportFixture().document, NOW);

    await renderRoute("/learners/LRN-B");
    await openDisclosure(user, /Decide what happened after:/);
    // The form is targeted at the second support, whose only correctable set is
    // empty: REV-B1 judged the first support and is not offered here.
    expect(screen.queryByLabelText(/Does this correct an earlier result\?/)).toBeNull();
  });
});

describe("audit B: recovery is guarded at the repository boundary", () => {
  beforeEach(() => window.localStorage.clear());

  it("replaces a future envelope only against an expectation taken from those bytes", () => {
    const future = JSON.stringify({
      envelopeVersion: ENVELOPE_VERSION + 1,
      current: serializeDocument(createSeedDocument()),
      backup: null,
      somethingNewer: { unread: true },
    });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, future);
    const repository = new BrowserLearningLoopRepository(window.localStorage);

    expect(repository.read().status).toBe("unsupported-version");
    expect(repository.commit(null, createSeedDocument(), NOW).status).toBe("conflict");
    expect(storedBytes()).toBe(future);

    const captured = repository.expectation();
    if (captured.status !== "ok") throw new Error(captured.message);
    expect(captured.read.status).toBe("unsupported-version");

    expect(repository.recover(createSeedDocument(), NOW, captured.expectation).status).toBe("ok");
    // The whole future envelope survives verbatim as the single recovery copy.
    expect(repository.readBackup()).toEqual({ status: "ok", raw: future });
  });

  it("refuses a stale expectation against a future envelope and keeps current and backup exact", () => {
    const future = JSON.stringify({
      envelopeVersion: ENVELOPE_VERSION + 1,
      current: serializeDocument(createSeedDocument()),
      backup: null,
    });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, future);
    const tabA = new BrowserLearningLoopRepository(window.localStorage);
    const tabB = new BrowserLearningLoopRepository(window.localStorage);

    const staleCapture = tabA.expectation();
    if (staleCapture.status !== "ok") throw new Error(staleCapture.message);

    const liveCapture = tabB.expectation();
    if (liveCapture.status !== "ok") throw new Error(liveCapture.message);
    expect(tabB.recover(createSeedDocument(), NOW, liveCapture.expectation).status).toBe("ok");
    const afterOtherTab = storedBytes();

    expect(tabA.recover(createSeedDocument(), NOW, staleCapture.expectation).status).toBe(
      "conflict",
    );
    expect(storedBytes()).toBe(afterOtherTab);
    expect(tabA.readBackup()).toEqual({ status: "ok", raw: future });
  });

  it("reports a malformed outer envelope as corrupt and preserves its exact bytes", () => {
    // Declares v1 but its current field is not a string: the envelope itself is
    // malformed, which is a different failure from a corrupt inner document.
    const malformed = JSON.stringify({ envelopeVersion: ENVELOPE_VERSION, current: 42 });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, malformed);
    const repository = new BrowserLearningLoopRepository(window.localStorage);

    const read = repository.read();
    expect(read.status).toBe("corrupt");
    expect(repository.readRaw()).toEqual({ status: "ok", raw: malformed });
    expect(repository.commit(null, createSeedDocument(), NOW).status).toBe("conflict");
    expect(storedBytes()).toBe(malformed);
  });

  it("keeps a corrupt inner current as its own distinct case", () => {
    const bytes = JSON.stringify({
      envelopeVersion: ENVELOPE_VERSION,
      current: "{ not a document",
      backup: null,
    });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, bytes);
    const repository = new BrowserLearningLoopRepository(window.localStorage);

    expect(repository.read().status).toBe("corrupt");
    // The inner value is what is unreadable, and it is what is preserved.
    expect(repository.readRaw()).toEqual({ status: "ok", raw: "{ not a document" });
    expect(storedBytes()).toBe(bytes);
  });
});

describe("audit C: an import preview describes the document its expectation protects", () => {
  beforeEach(() => window.localStorage.clear());

  it("opens no preview when the expectation cannot be captured, and stays retryable", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const bytesBefore = storedBytes();
    const revisionBefore = storedRevision();

    const imported = createSeedDocument();
    imported.observations[0]!.observationText = "A different, fictional observation text.";
    const file = jsonFile(serializeDocument(imported));

    const realGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function blocked() {
      throw new Error("blocked");
    };
    try {
      chooseFile(file);
      await waitFor(() =>
        expect(screen.getByRole("alert").textContent ?? "").toMatch(/state is unknown/i),
      );
    } finally {
      Storage.prototype.getItem = realGetItem;
    }

    expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
    expect(storedBytes()).toBe(bytesBefore);
    expect(storedRevision()).toBe(revisionBefore);
    // The control is still there to be used again once storage answers.
    expect(screen.getByRole("button", { name: "Import a file" })).toBeTruthy();
  });

  it("refuses to preview against a base another tab has already moved past", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);

    // A second view of the same storage saves an ordinary edit.
    const otherTab = new BrowserLearningLoopRepository(window.localStorage);
    const read = otherTab.read();
    if (read.status !== "ready") throw new Error("expected a ready document");
    const edited = {
      ...read.document,
      observations: read.document.observations.map((row, index) =>
        index === 0 ? { ...row, observationText: "Edited in another tab, fictional." } : row,
      ),
    };
    expect(otherTab.commit(read.document.revision, edited, NOW).status).toBe("ok");
    const bytesAfterOtherTab = storedBytes();

    const imported = createSeedDocument();
    imported.observations[0]!.observationText = "A different, fictional observation text.";
    chooseFile(jsonFile(serializeDocument(imported)));

    await waitFor(() =>
      expect(
        screen
          .getAllByRole("alert")
          .some((node) => /changed somewhere else/i.test(node.textContent ?? "")),
      ).toBe(true),
    );
    // No stale diff was shown and no replacement was possible.
    expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
    expect(storedBytes()).toBe(bytesAfterOtherTab);
  });

  it("refuses to open the restore confirmation against a base another tab moved past", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);

    const otherTab = new BrowserLearningLoopRepository(window.localStorage);
    const read = otherTab.read();
    if (read.status !== "ready") throw new Error("expected a ready document");
    const edited = {
      ...read.document,
      observations: read.document.observations.map((row, index) =>
        index === 0 ? { ...row, observationText: "Edited in another tab, fictional." } : row,
      ),
    };
    expect(otherTab.commit(read.document.revision, edited, NOW).status).toBe("ok");
    const bytesAfterOtherTab = storedBytes();

    await user.click(screen.getByRole("button", { name: "Restore the sample records" }));

    await waitFor(() =>
      expect(
        screen
          .getAllByRole("alert")
          .some((node) => /changed somewhere else/i.test(node.textContent ?? "")),
      ).toBe(true),
    );
    expect(screen.queryByRole("heading", { name: /Restoring replaces everything/ })).toBeNull();
    expect(storedBytes()).toBe(bytesAfterOtherTab);
  });
});

describe("audit D: a new attempt clears the previous outcome before it is judged", () => {
  beforeEach(() => window.localStorage.clear());

  it("clears an earlier success before a client validation refusal", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await openDisclosure(user, "Record an observation");
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "The help card was turned over twice during independent work.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/Next:/));

    // An empty second attempt never reaches a command: it is refused locally.
    await openDisclosure(user, "Record an observation");
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    await waitFor(() =>
      expect(screen.getAllByText(/Write down what you saw before saving\./).length).toBeGreaterThan(
        0,
      ),
    );
    expect(screen.queryByRole("status")?.textContent ?? "").not.toMatch(/Next:/);
  });
});

describe("audit E: a pinned form keeps its target and its draft through a conflict", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps the close-off form on the same support after another tab changes the document", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    const summary = await openDisclosure(user, /Close off:/);
    const targeted = summary.textContent ?? "";
    await user.type(
      await screen.findByLabelText(/Anything worth noting/),
      "Used on three of five days.",
    );

    // Another tab writes, so the attempt about to be made is stale.
    const otherTab = new BrowserLearningLoopRepository(window.localStorage);
    const read = otherTab.read();
    if (read.status !== "ready") throw new Error("expected a ready document");
    const edited = {
      ...read.document,
      observations: read.document.observations.map((row, index) =>
        index === 0 ? { ...row, observationText: "Edited in another tab, fictional." } : row,
      ),
    };
    expect(otherTab.commit(read.document.revision, edited, NOW).status).toBe("ok");
    const bytesAfterOtherTab = storedBytes();

    await user.click(screen.getByRole("button", { name: "Mark it done" }));

    // The conflict refreshed the page from storage, but did not overwrite it,
    // did not retarget the form, and did not throw the draft away.
    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(storedBytes()).toBe(bytesAfterOtherTab);
    const stillOpen = await screen.findByRole("button", { name: /Close off:/ });
    expect(stillOpen.textContent).toBe(targeted);
    expect(stillOpen.getAttribute("aria-expanded")).toBe("true");
    expect(await screen.findByDisplayValue("Used on three of five days.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mark it done" })).toBeTruthy();
  });

  it("keeps the review form on the same support and its draft after a client refusal", async () => {
    const user = userEvent.setup();
    const repository = new BrowserLearningLoopRepository(window.localStorage);
    repository.commit(null, twoSupportFixture().document, NOW);

    await renderRoute("/learners/LRN-B");
    const summary = await openDisclosure(user, /Decide what happened after:/);
    const targeted = summary.textContent ?? "";
    const bytesBefore = storedBytes();

    // Every observation deselected: refused before any command runs.
    const basis = screen.getAllByRole("checkbox");
    for (const box of basis) if ((box as HTMLInputElement).checked) await user.click(box);
    await user.type(
      screen.getByLabelText(/Why do you say that\?/),
      "A judgement that will be refused locally.",
    );
    await user.click(screen.getByRole("button", { name: "Save this result" }));

    await waitFor(() =>
      expect(
        screen.getAllByText(/Pick at least one observation to judge from\./).length,
      ).toBeGreaterThan(0),
    );
    const stillOpen = await screen.findByRole("button", { name: /Decide what happened after:/ });
    expect(stillOpen.textContent).toBe(targeted);
    expect(
      await screen.findByDisplayValue("A judgement that will be refused locally."),
    ).toBeTruthy();
    expect(storedBytes()).toBe(bytesBefore);
  });
});

describe("audit G: the golden loop moves focus after every successful step", () => {
  beforeEach(() => window.localStorage.clear());

  it("lands focus on the announced next step at each transition", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await openDisclosure(user, "Record an observation");
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "The help card was turned over twice during independent work.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));
    await waitFor(() => expect(window.document.getElementById("next-step-heading")).toHaveFocus());

    await openDisclosure(user, /Close off:/);
    await user.click(screen.getByRole("button", { name: "Mark it done" }));
    await waitFor(() => expect(window.document.getElementById("next-step-heading")).toHaveFocus());

    await openDisclosure(user, "Record an observation");
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "After the card was in place, help was asked for without stopping work.",
    );
    const followUp = screen.getByLabelText(/Is this a follow-up to something you tried\?/);
    await user.selectOptions(
      followUp,
      within(followUp)
        .getByRole("option", { name: /help card/i })
        .getAttribute("value")!,
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));
    await waitFor(() => expect(window.document.getElementById("next-step-heading")).toHaveFocus());

    await openDisclosure(user, /Decide what happened after:/);
    await user.type(
      screen.getByLabelText(/Why do you say that\?/),
      "Help was asked for in both observed sessions without work stopping.",
    );
    await user.click(screen.getByRole("button", { name: "Save this result" }));
    await waitFor(() => expect(window.document.getElementById("next-step-heading")).toHaveFocus());
    expect(screen.getByRole("status").textContent).toMatch(/Next:/);
  });

  it("keeps a corrected result and its replacement label across a full remount", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
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

    // A completely fresh render reading the same storage.
    cleanup();
    await renderRoute("/learners/LRN-B");
    expect((await screen.findAllByText(/Replaced by a later correction/)).length).toBe(1);
    expect(
      (await screen.findAllByText(/all three lessons met the criterion/)).length,
    ).toBeGreaterThan(0);
    expect((await screen.findAllByText(/The success criterion was met/)).length).toBeGreaterThan(0);
    expect(storedRevision()).toBe(revisionBefore + 1);
  });
});

describe("audit F: the drawer is modal in fact, not only in label", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("wraps tab and shift-tab with the governance group expanded", async () => {
    const user = userEvent.setup();
    await renderRoute("/");
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    await user.click(within(drawer).getByRole("button", { name: /Governance workspace/ }));

    for (let step = 0; step < 24; step += 1) {
      await user.tab();
      expect(drawer.contains(window.document.activeElement)).toBe(true);
    }
    for (let step = 0; step < 24; step += 1) {
      await user.tab({ shift: true });
      expect(drawer.contains(window.document.activeElement)).toBe(true);
    }
  });

  it("closes on a backdrop click and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const { container } = await renderRoute("/");
    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);

    const backdrop = container.querySelector<HTMLElement>('[aria-hidden="true"].absolute');
    if (!backdrop) throw new Error("expected a backdrop");
    await user.click(backdrop);

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("locks scrolling while open and restores the exact prior overflow on close", async () => {
    const user = userEvent.setup();
    await renderRoute("/");
    window.document.body.style.overflow = "auto";

    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(window.document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(window.document.body.style.overflow).toBe("auto"));
    window.document.body.style.overflow = "";
  });

  it("makes the whole background, including the skip link, unreachable", async () => {
    const user = userEvent.setup();
    const { container } = await renderRoute("/");
    await user.click(screen.getByRole("button", { name: "Menu" }));

    const skip = screen.getByRole("link", { name: "Skip to main content" });
    expect(skip.closest("[inert]")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Menu" }).closest("[inert]")).not.toBeNull();

    const ids = Array.from(container.querySelectorAll<HTMLElement>("[id]")).map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("closes on navigation and puts focus on the heading of the page opened", async () => {
    const user = userEvent.setup();
    const { router } = await renderRoute("/");
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    await user.click(within(drawer).getByRole("link", { name: "Learners" }));

    expect(router.state.location.pathname).toBe("/learners");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1, name: "Learners" })).toHaveFocus(),
    );
  });
});
