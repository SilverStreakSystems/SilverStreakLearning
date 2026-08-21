/**
 * Regressions for the defects observed in the bounded Product Alpha 001
 * operator walkthrough (docs/product-alpha-001/WALKTHROUGH-001.md).
 *
 * Each test names the observation it holds closed. None of them establishes
 * usability, accessibility conformance, or any release claim.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import { LEARNING_LOOP_STORAGE_KEY } from "@/lib/learning-loop/repository";

/** Hands a file to the import control the way the file picker does. */
function chooseFile(text: string) {
  const file = new File(["placeholder"], "import.json", { type: "application/json" });
  Object.defineProperty(file, "size", { value: text.length, configurable: true });
  Object.defineProperty(file, "text", {
    value: vi.fn(() => Promise.resolve(text)),
    configurable: true,
  });
  const input = window.document.getElementById("learning-loop-import") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  fireEvent.change(input);
}

describe("walkthrough finding 1: the working product surface is reachable from the entry page", () => {
  it("offers a named link from the Command Center into the learner workflow", async () => {
    await renderRoute("/");

    const entry = await screen.findByRole("link", { name: "Open the learner workflow" });
    expect(entry.getAttribute("href")).toBe("/learners");
    // The entry states its bound where it is offered, not only after arrival.
    expect(screen.getAllByText(/bounded local prototype/i).length).toBeGreaterThan(0);
  });
});

describe("walkthrough finding 2: the small-screen menu control cannot wrap", () => {
  it("keeps the header menu trigger on one line and unshrunk", async () => {
    await renderRoute("/learners");

    const trigger = await screen.findByRole("button", { name: "Menu" });
    expect(trigger.className).toContain("whitespace-nowrap");
    expect(trigger.className).toContain("shrink-0");
  });
});

describe("walkthrough finding 3: a refused import blames the file, not the saved records", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("names the chosen file as the subject and says the saved records were untouched", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    const before = window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);

    chooseFile(JSON.stringify({ learners: [] }));

    expect(
      await screen.findByText(
        /That file does not match the shape this preview can read, so it was not imported\. The records saved in this browser were not changed\./,
      ),
    ).toBeTruthy();
    // The decoder's own wording is kept as detail, so nothing is lost.
    expect(screen.getByText("The saved data declares no schema version.")).toBeTruthy();
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(before);
  });

  it("uses the same file-subject wording for a newer-schema file", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    const before = window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);

    chooseFile(JSON.stringify({ schemaVersion: 99, learners: [] }));

    expect(
      await screen.findByText(
        /That file was written for a different schema version of this preview, so it was not imported\./,
      ),
    ).toBeTruthy();
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBe(before);
  });
});
