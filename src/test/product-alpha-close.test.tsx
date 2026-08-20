/**
 * Final acceptance-close regressions.
 *
 * Three proofs the last independent review found missing: a restore
 * confirmation that fails closed for every displayed status (not only a ready
 * document), and pinned form continuity through a conflict that also changes
 * which record the next step projects.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import {
  createSeedDocument,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import type { CommandContext } from "@/lib/learning-loop/context";
import { completeSupport, planSupport, recordObservation } from "@/lib/learning-loop/commands";
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

async function openDisclosure(user: ReturnType<typeof userEvent.setup>, name: RegExp | string) {
  const button = await screen.findByRole("button", { name });
  if (button.getAttribute("aria-expanded") !== "true") await user.click(button);
  return button;
}

/** Whatever another tab writes, written through a second repository instance. */
function otherTabWrites(change: (document: LearningLoopDocument) => LearningLoopDocument): string {
  const otherTab = new BrowserLearningLoopRepository(window.localStorage);
  const read = otherTab.read();
  if (read.status !== "ready") throw new Error("expected a ready document");
  const outcome = otherTab.commit(read.document.revision, change(read.document), NOW);
  if (outcome.status !== "ok") throw new Error("the other tab could not write");
  return storedBytes()!;
}

describe("close 1: restore fails closed for every displayed status", () => {
  beforeEach(() => window.localStorage.clear());

  /**
   * The screen shows unreadable or unsupported bytes. Another tab recovers
   * that state to a real document the operator has never seen. Restoring now
   * would destroy an unseen document, so the confirmation must not open.
   */
  async function proveRefusal(initial: string) {
    const user = userEvent.setup();
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, initial);
    await renderRoute("/learners");
    // The screen must actually be showing the unreadable state before another
    // tab changes it, otherwise this proves nothing about a stale screen.
    await screen.findByRole("button", { name: /Export the unreadable data/ });
    const restore = await screen.findByRole("button", { name: /Restore the sample records/ });

    const otherTab = new BrowserLearningLoopRepository(window.localStorage);
    const captured = otherTab.expectation();
    if (captured.status !== "ok") throw new Error(captured.message);
    expect(otherTab.recover(createSeedDocument(), NOW, captured.expectation).status).toBe("ok");
    const bytesAfterOtherTab = storedBytes();

    await user.click(restore);

    await waitFor(() =>
      expect(
        screen
          .getAllByRole("alert")
          .some((node) => /changed somewhere else/i.test(node.textContent ?? "")),
      ).toBe(true),
    );
    expect(screen.queryByRole("heading", { name: /Restoring replaces everything/ })).toBeNull();
    expect(storedBytes()).toBe(bytesAfterOtherTab);
  }

  it("refuses to restore over a document another tab recovered from corrupt bytes", async () => {
    await proveRefusal(
      JSON.stringify({
        envelopeVersion: ENVELOPE_VERSION,
        current: "{ not a document",
        backup: null,
      }),
    );
  });

  it("refuses to restore over a document another tab recovered from a newer envelope", async () => {
    await proveRefusal(
      JSON.stringify({
        envelopeVersion: ENVELOPE_VERSION + 1,
        current: serializeDocument(createSeedDocument()),
        backup: null,
        somethingNewer: { unread: true },
      }),
    );
  });
});

describe("close 2: a pinned form survives a conflict that moves the projected target", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps the close-off form on support A when another tab makes support B the next target", async () => {
    const user = userEvent.setup();
    new BrowserLearningLoopRepository(window.localStorage).commit(null, createSeedDocument(), NOW);

    await renderRoute("/learners/LRN-A");
    const summary = await openDisclosure(user, /Close off:/);
    const targeted = summary.textContent ?? "";
    expect(targeted).toMatch(/help card/i);
    await user.type(
      await screen.findByLabelText(/Anything worth noting/),
      "Card used on three of five days.",
    );

    // Another tab plans a later support for the same goal, which becomes the
    // newly projected support to close off.
    const bytesAfterOtherTab = otherTabWrites((document) => {
      const planned = planSupport(
        document,
        {
          learnerId: "LRN-A",
          goalId: "GOL-A1",
          basedOnObservationIds: ["OBS-A1"],
          title: "Rehearse asking a peer for help before the work period",
          rationale: "A second route to asking, planned in another tab.",
          intendedEvidence: "A peer is asked within two minutes of getting stuck.",
          plannedAt: "2026-04-28T09:00:00.000Z",
        },
        contextAt("2026-04-28T09:00:00.000Z", "SUP-A2"),
      );
      if (!planned.ok) throw new Error(planned.message);
      return planned.document;
    });

    await user.click(screen.getByRole("button", { name: "Mark it done" }));

    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    // Nothing was written, the form was not retargeted at the newer support,
    // and the draft is still there to retry with.
    expect(storedBytes()).toBe(bytesAfterOtherTab);
    const stillOpen = await screen.findByRole("button", { name: /Close off:/ });
    expect(stillOpen.textContent).toBe(targeted);
    expect(stillOpen.textContent).not.toMatch(/Rehearse asking a peer/);
    expect(stillOpen.getAttribute("aria-expanded")).toBe("true");
    expect(await screen.findByDisplayValue("Card used on three of five days.")).toBeTruthy();
  });

  it("keeps the review form on support A when another tab makes support B the next review", async () => {
    const user = userEvent.setup();
    new BrowserLearningLoopRepository(window.localStorage).commit(null, createSeedDocument(), NOW);

    await renderRoute("/learners/LRN-B");
    const summary = await openDisclosure(user, /Decide what happened after:/);
    const targeted = summary.textContent ?? "";
    expect(targeted).toMatch(/starter strip/i);
    await user.type(
      screen.getByLabelText(/Why do you say that\?/),
      "Two of three lessons met the criterion, so this is progress rather than success.",
    );

    // Another tab runs a whole later loop: a second support, completed, with
    // its own follow-up observation. That support becomes the projected review.
    const bytesAfterOtherTab = otherTabWrites((document) => {
      const planned = planSupport(
        document,
        {
          learnerId: "LRN-B",
          goalId: "GOL-B1",
          basedOnObservationIds: ["OBS-B2"],
          title: "Add a two-minute planning box before writing begins",
          rationale: "Planned in another tab while this page was open.",
          intendedEvidence: "Writing begins within two minutes in three consecutive lessons.",
          plannedAt: "2026-04-20T09:00:00.000Z",
        },
        contextAt("2026-04-20T09:00:00.000Z", "SUP-B2"),
      );
      if (!planned.ok) throw new Error(planned.message);
      const completed = completeSupport(
        planned.document,
        "SUP-B2",
        "2026-04-24T09:00:00.000Z",
        "Planning box used in every lesson for a week.",
        contextAt("2026-04-24T09:00:00.000Z", "unused"),
      );
      if (!completed.ok) throw new Error(completed.message);
      const observed = recordObservation(
        completed.document,
        {
          learnerId: "LRN-B",
          goalId: "GOL-B1",
          supportActionId: "SUP-B2",
          observedAt: "2026-04-27T09:00:00.000Z",
          sourceKind: "work-sample",
          observationText:
            "With the planning box in place, writing began within two minutes in three consecutive lessons.",
          supersedesObservationId: null,
        },
        contextAt("2026-04-27T09:00:00.000Z", "OBS-B3"),
      );
      if (!observed.ok) throw new Error(observed.message);
      return observed.document;
    });

    await user.click(screen.getByRole("button", { name: "Save this result" }));

    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(storedBytes()).toBe(bytesAfterOtherTab);
    const stillOpen = await screen.findByRole("button", { name: /Decide what happened after:/ });
    expect(stillOpen.textContent).toBe(targeted);
    expect(stillOpen.textContent).not.toMatch(/planning box/i);
    expect(
      await screen.findByDisplayValue(
        "Two of three lessons met the criterion, so this is progress rather than success.",
      ),
    ).toBeTruthy();
    const basis = screen.getByRole("group", { name: /Which observations are you judging from\?/ });
    expect(
      within(basis)
        .getAllByRole("checkbox")
        .some((box) => (box as HTMLInputElement).checked),
    ).toBe(true);
  });
});
