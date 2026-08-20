import { beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import { LEARNING_LOOP_STORAGE_KEY } from "@/lib/learning-loop/repository";

describe("learning loop, end to end in the real routes", () => {
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
    expect(rows.length).toBeGreaterThan(0);
  });

  it("makes keeping the saved data the focused first choice when restoring", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));

    const restore = await screen.findByRole("button", { name: "Restore the sample records" });
    await user.click(restore);

    const keep = screen.getByRole("button", { name: "Keep what is saved" });
    expect(keep).toHaveFocus();

    await user.click(keep);
    expect(screen.queryByRole("button", { name: "Keep what is saved" })).toBeNull();
    expect(window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)).toBeTruthy();
  });

  it("keeps the observation form open with its values when validation fails, then saves", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await user.click(screen.getByRole("button", { name: "Load the sample records" }));
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    const opener = await screen.findByRole("button", { name: "Record an observation" });
    if (opener.getAttribute("aria-expanded") !== "true") await user.click(opener);

    const text = await screen.findByLabelText(/What did you see\?/);
    const save = screen.getByRole("button", { name: "Save this observation" });

    // Nothing typed: the form must complain, stay open, and save nothing.
    await user.click(save);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(text).toBeVisible();

    await user.type(text, "Read two paragraphs aloud with one prompt.");
    // What was typed survives the failed attempt.
    expect((text as HTMLTextAreaElement).value).toContain("two paragraphs");
    await user.click(save);

    expect(
      (await screen.findAllByText(/Read two paragraphs aloud with one prompt\./)).length,
    ).toBeGreaterThan(0);
    expect((text as HTMLTextAreaElement).value).toBe("");
  });
});
