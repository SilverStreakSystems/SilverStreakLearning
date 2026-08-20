/**
 * Route-level acceptance for Product Alpha 001.
 *
 * These tests drive the real routes, the real components, and the real
 * browser-local adapter with actual user events. Nothing mutates the stored
 * document between workflow steps: every state change is produced by pressing
 * the same controls a person would press.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import { LEARNING_LOOP_STORAGE_KEY } from "@/lib/learning-loop/repository";
import { NEXT_STEP_LIMITATION } from "@/domain/learning-loop";

/** The next-step card, addressed by the heading it is labelled by. */
function nextStepCard(): HTMLElement {
  const card = window.document.querySelector('[aria-labelledby="next-step-heading"]');
  if (!(card instanceof HTMLElement)) throw new Error("The next-step card is not on the page.");
  return card;
}

function expectNextStep(expected: { ruleId: string; code: string; basis?: string[] }) {
  const card = nextStepCard();
  expect(
    within(card).getByText(new RegExp(`clause ${expected.ruleId} \\(${expected.code}\\)`)),
  ).toBeTruthy();
  expect(within(card).getByText(NEXT_STEP_LIMITATION)).toBeTruthy();
  if (expected.basis) expect(basisIds()).toEqual([...expected.basis].sort());
  return card;
}

/** Reads the record identifiers the card says it computed from. */
function basisIds(): string[] {
  const card = nextStepCard();
  const definition = within(card).getByText(/^Computed from:$/).nextElementSibling!;
  return definition.textContent!.split(", ").filter(Boolean);
}

/** The record identifier printed at the end of a timeline entry. */
function lastRecordId(entry: HTMLElement): string {
  const found = entry.textContent!.match(/(?:GOL|OBS|SUP|REV)-[A-Za-z0-9]+/g)!;
  return found[found.length - 1]!;
}

async function openDisclosure(user: ReturnType<typeof userEvent.setup>, name: RegExp | string) {
  const button = await screen.findByRole("button", { name });
  if (button.getAttribute("aria-expanded") !== "true") await user.click(button);
  return button;
}

function storedRevision(): number | null {
  const raw = window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { revision: number }).revision : null;
}

describe("learning loop, in the real routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty and offers loading the fictional sample learners as the only way in", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");

    expect(screen.getByRole("heading", { name: /nothing is saved yet/i })).toBeTruthy();
    expect(screen.queryByRole("textbox", { name: /learner/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /add a fictional learner/i })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Load the sample records" }));

    expect(await screen.findByText(/Sample Learner A \(fictional\)/)).toBeTruthy();
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBeTruthy();
  });

  it("shows a next step and the rule that produced it for each learner", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));

    const rows = await screen.findAllByText(/Next step:/);
    expect(rows.length).toBe(4);
  });

  it("makes keeping the saved data the focused first choice when restoring", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    const revisionBefore = storedRevision();

    const restore = await screen.findByRole("button", { name: "Restore the sample records" });
    await user.click(restore);

    const keep = screen.getByRole("button", { name: "Keep what is saved" });
    expect(keep).toHaveFocus();

    await user.click(keep);
    expect(screen.queryByRole("button", { name: "Keep what is saved" })).toBeNull();
    // Cancelling is a no-op: neither the revision nor the stored bytes move.
    expect(storedRevision()).toBe(revisionBefore);
  });

  it("keeps the observation form open with its values when validation fails, then saves", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await openDisclosure(user, "Record an observation");

    const text = await screen.findByLabelText(/What did you see\?/);
    const save = screen.getByRole("button", { name: "Save this observation" });
    const revisionBefore = storedRevision();

    // Nothing typed: the form must complain, stay open, and save nothing.
    await user.click(save);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(text).toBeVisible();
    expect(storedRevision()).toBe(revisionBefore);

    await user.type(text, "Read two paragraphs aloud with one prompt.");
    // What was typed survives the failed attempt.
    expect((text as HTMLTextAreaElement).value).toContain("two paragraphs");
    await user.click(save);

    expect(
      (await screen.findAllByText(/Read two paragraphs aloud with one prompt\./)).length,
    ).toBeGreaterThan(0);
    expect((text as HTMLTextAreaElement).value).toBe("");
    expect(storedRevision()).toBe(revisionBefore! + 1);
  });
});

describe("Product Alpha 001 golden loop, driven entirely through the interface", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("carries Sample Learner C from a bare goal to a recorded result, and survives a reload", async () => {
    const user = userEvent.setup();
    const first = await renderRoute("/learners");

    // --- load the only records this preview will ever accept ------------
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    await user.click(await screen.findByRole("link", { name: /Sample Learner C/ }));

    // --- the active goal and the baseline recommendation ----------------
    expect(
      (
        await screen.findAllByRole("heading", {
          name: "Use the bus route independently for the work placement",
        })
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/On three separate placement days/).length).toBeGreaterThan(0);
    expectNextStep({
      ruleId: "LLR-001-R03",
      code: "RECORD_BASELINE_OBSERVATION",
      basis: ["GOL-C1"],
    });
    expect(within(nextStepCard()).getByText(/nothing observed against it yet/i)).toBeTruthy();

    // --- record the baseline observation --------------------------------
    await openDisclosure(user, "Record an observation");
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "On the first placement day the learner waited for a staff prompt before boarding and missed the correct stop.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    expectNextStep({ ruleId: "LLR-001-R04", code: "PLAN_SUPPORT" });
    const baselineObservationId = basisIds().find((id) => id.startsWith("OBS-"))!;
    expect(baselineObservationId).toMatch(/^OBS-/);

    // --- plan a support against that observation ------------------------
    await openDisclosure(user, "Plan a support");
    const basis = screen.getByRole("group", { name: /Which observations is this based on\?/ });
    const basisBoxes = within(basis).getAllByRole("checkbox");
    expect(basisBoxes).toHaveLength(1);
    expect(basisBoxes[0]).toBeChecked();
    await user.type(
      screen.getByLabelText(/What will you do\?/),
      "Practise the route with a staff member shadowing from two seats back",
    );
    await user.type(
      screen.getByLabelText(/Why this, given what you saw\?/),
      "The prompt is doing the work of the route knowledge, so the prompt has to move further away.",
    );
    await user.type(
      screen.getByLabelText(/What would tell you it is working\?/),
      "The learner boards and exits at the right stop with the staff member out of prompting range.",
    );
    await user.click(screen.getByRole("button", { name: "Save this plan" }));

    expectNextStep({ ruleId: "LLR-001-R05", code: "COMPLETE_OR_CANCEL_SUPPORT" });
    const supportActionId = basisIds().find((id) => id.startsWith("SUP-"))!;
    expect(supportActionId).toMatch(/^SUP-/);
    const supportTitle = "Practise the route with a staff member shadowing from two seats back";

    // --- complete the support -------------------------------------------
    await openDisclosure(user, `Close off: ${supportTitle}`);
    await user.click(screen.getByRole("button", { name: "Mark it done" }));

    expectNextStep({
      ruleId: "LLR-001-R06",
      code: "RECORD_FOLLOW_UP_OBSERVATION",
      basis: ["GOL-C1", supportActionId],
    });

    // --- record a follow-up explicitly linked to the completed support ---
    await openDisclosure(user, "Record an observation");
    const followUpSelect = screen.getByLabelText(/Is this a follow-up to something you tried\?/);
    await user.selectOptions(followUpSelect, supportActionId);
    expect((followUpSelect as HTMLSelectElement).value).toBe(supportActionId);
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "On the next placement day the learner boarded, rode, and exited at the correct stop with no prompting.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    expectNextStep({ ruleId: "LLR-001-R07", code: "REVIEW_OBSERVATIONS" });
    const followUpObservationId = basisIds().find(
      (id) => id.startsWith("OBS-") && id !== baselineObservationId,
    )!;
    expect(basisIds().sort()).toEqual(
      [...new Set(["GOL-C1", supportActionId, followUpObservationId])].sort(),
    );

    // --- record the result from the selected follow-up observation -------
    await openDisclosure(user, `Decide what happened after: ${supportTitle}`);
    const judged = screen.getByRole("group", {
      name: /Which observations are you judging from\?/,
    });
    const judgedBoxes = within(judged).getAllByRole("checkbox");
    expect(judgedBoxes).toHaveLength(1);
    expect(judgedBoxes[0]).toBeChecked();
    await user.selectOptions(
      screen.getByLabelText(/What does it show\?/),
      "The success criterion was met",
    );
    await user.type(
      screen.getByLabelText(/Why do you say that\?/),
      "The one recorded placement day met the criterion for that day, and a person still has to judge the three-day criterion.",
    );
    await user.click(screen.getByRole("button", { name: "Save this result" }));

    // --- the deterministic next action for that result -------------------
    const card = expectNextStep({
      ruleId: "LLR-001-R12",
      code: "HUMAN_REVIEW_GOAL_COMPLETION",
    });
    const reviewId = basisIds().find((id) => id.startsWith("REV-"))!;
    expect(basisIds().sort()).toEqual(["GOL-C1", reviewId, supportActionId].sort());
    expect(
      within(card).getByRole("heading", {
        name: "A person should review whether this goal is finished",
      }),
    ).toBeTruthy();
    expect(
      within(card).getByText(/human decision; this rule set does not close goals/i),
    ).toBeTruthy();
    expect(within(card).getByText(NEXT_STEP_LIMITATION)).toBeTruthy();
    // The rule set did not close anything: the goal is still being worked on.
    expect(screen.getAllByText(/Working on it/).length).toBeGreaterThan(0);

    // --- the timeline holds every step exactly once, in order ------------
    const timeline = screen.getByRole("region", { name: "Everything, in order" });
    const entries = within(timeline).getAllByRole("listitem");
    const recordIds = entries.map((entry) => lastRecordId(entry));
    expect(recordIds).toEqual([
      "GOL-C1",
      baselineObservationId,
      supportActionId,
      supportActionId,
      followUpObservationId,
      reviewId,
    ]);
    const headlines = entries.map((entry) => entry.querySelector("p")!.textContent!);
    expect(headlines[0]).toContain("Goal set:");
    expect(headlines[1]).toContain("Observation recorded");
    expect(headlines[2]).toContain("Support planned:");
    expect(headlines[3]).toContain("Support done:");
    expect(headlines[4]).toContain("Follow-up observation");
    expect(headlines[5]).toContain("Result recorded: The success criterion was met");
    // No mutable current status is retrojected into a past moment.
    expect(entries[0]!.textContent).not.toContain("Criterion met");
    expect(entries[0]!.textContent).toContain("On three separate placement days");

    // Six saved steps means six accepted writes on top of the loaded seed.
    expect(storedRevision()).toBe(6);

    // --- unmount and render again: the loop survives the reload ----------
    first.unmount();
    await renderRoute("/learners/LRN-C");

    expect(
      (
        await screen.findAllByText(
          /On the next placement day the learner boarded, rode, and exited at the correct stop with no prompting\./,
        )
      ).length,
    ).toBeGreaterThan(0);
    expectNextStep({
      ruleId: "LLR-001-R12",
      code: "HUMAN_REVIEW_GOAL_COMPLETION",
      basis: ["GOL-C1", supportActionId, reviewId],
    });
    const reloaded = within(
      screen.getByRole("region", { name: "Everything, in order" }),
    ).getAllByRole("listitem");
    expect(reloaded.map((entry) => lastRecordId(entry))).toEqual(recordIds);

    // --- closing the goal stays a human act ------------------------------
    await user.click(screen.getByRole("button", { name: /I judge this goal met — record it/ }));
    expect(await screen.findByText("The goal was recorded as met.")).toBeTruthy();
    const afterClosure = within(
      screen.getByRole("region", { name: "Everything, in order" }),
    ).getAllByRole("listitem");
    // The goal-set entry still describes the criterion, not today's status.
    expect(afterClosure[0]!.textContent).not.toContain("Criterion met");
    expect(storedRevision()).toBe(7);
  }, 30_000);
});
