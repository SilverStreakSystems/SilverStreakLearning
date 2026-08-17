import { it } from "vitest";
import { renderRoute } from "@/test/render-route";
it("dbg", async () => {
  const { container } = await renderRoute("/");
  console.log("headers", document.querySelectorAll("header").length, "html", document.querySelectorAll("html").length, "body", document.querySelectorAll("body").length, "footer", document.querySelectorAll("footer").length, "main", document.querySelectorAll("main").length, "container headers", container.querySelectorAll("header").length);
});
