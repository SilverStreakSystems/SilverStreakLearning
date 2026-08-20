import { it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "@/test/render-route";
import { LEARNING_LOOP_STORAGE_KEY, LEARNING_LOOP_BACKUP_KEY } from "@/lib/learning-loop/repository";

it("dbg", async () => {
  window.localStorage.clear();
  window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, "{ this was never valid");
  const user = userEvent.setup();
  await renderRoute("/learners");
  await user.click(await screen.findByRole("button", { name: "Restore the sample records" }));
  await user.click(screen.getByRole("button", { name: "Keep what is saved" }));
  await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
  await user.click(screen.getByRole("button", { name: "Replace with the sample records" }));
  await new Promise((r) => setTimeout(r, 300));
  console.log("MAIN:", window.document.querySelector("main")?.textContent?.slice(0, 1200));
  console.log("STORED:", window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY)?.slice(0, 80));
  console.log("BACKUP:", window.localStorage.getItem(LEARNING_LOOP_BACKUP_KEY));
}, 20000);
