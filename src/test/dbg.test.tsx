import { it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "@/test/render-route";

it("dbg", async () => {
  const user = userEvent.setup();
  await renderRoute("/learners");
  await user.click(screen.getByRole("button", { name: "Load the sample records" }));
  await user.click(await screen.findByRole("link", { name: /Sample Learner C/ }));
  await new Promise((r) => setTimeout(r, 500));
  console.log(window.document.querySelector("main")?.textContent?.slice(0, 2500));
}, 20000);
