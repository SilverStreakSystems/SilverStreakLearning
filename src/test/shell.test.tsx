import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "./render-route";
import { ROUTE_REGISTRY } from "@/lib/route-registry";

describe("route coverage", () => {
  it.each(ROUTE_REGISTRY)("renders $path with its heading", async (route) => {
    await renderRoute(route.path);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(route.heading);
  });

  it.each(ROUTE_REGISTRY)("exposes landmarks on $path", async (route) => {
    await renderRoute(route.path);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
  });
});

/**
 * Detail routes are not in ROUTE_REGISTRY because they are not navigation
 * destinations. They still have to satisfy ULW-AS-001, and a missing record
 * must produce a governed page rather than a blank one.
 */
const DYNAMIC_ROUTES = [
  { path: "/capabilities/CAP-D01-001", missing: "/capabilities/CAP-D99-999" },
  { path: "/objects/evidence", missing: "/objects/no-such-object-type" },
  { path: "/value-streams/research-requirement", missing: "/value-streams/no-such-stream" },
  { path: "/workspaces/command-center", missing: "/workspaces/no-such-workspace" },
  { path: "/design-system/templates/TPL-01", missing: "/design-system/templates/TPL-99" },
] as const;

describe("detail route coverage", () => {
  it.each(DYNAMIC_ROUTES)("renders exactly one H1 on $path", async ({ path }) => {
    await renderRoute(path);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(DYNAMIC_ROUTES)("exposes landmarks on $path", async ({ path }) => {
    await renderRoute(path);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
  });

  it.each(DYNAMIC_ROUTES)("states the boundary on $path", async ({ path }) => {
    const { container } = await renderRoute(path);
    const banner = container.querySelector('[data-boundary-banner="true"]');
    expect(banner?.textContent).toContain("No personal data");
  });

  it.each(DYNAMIC_ROUTES)(
    "answers an unrecorded identifier with a governed page on $missing",
    async ({ missing }) => {
      await renderRoute(missing);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("main").textContent).toMatch(/not recorded|no record|not found/i);
    },
  );
});

describe("navigation and keyboard operation", () => {
  it("places the skip link first in tab order and points it at main content", async () => {
    const user = userEvent.setup();
    await renderRoute("/");

    await user.tab();
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("moves between sections using the keyboard alone", async () => {
    const user = userEvent.setup();
    const { router } = await renderRoute("/");

    const nav = screen.getByRole("navigation", { name: "Sections" });
    const link = within(nav).getByRole("link", { name: "Findings" });
    link.focus();
    expect(link).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(router.state.location.pathname).toBe("/findings");
  });

  it("opens the small-screen navigation as a dialog, product first and governance collapsed", async () => {
    const user = userEvent.setup();
    await renderRoute("/");

    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // The product destination is reachable straight away; the long governance
    // list is collapsed behind a disclosure the person can open.
    const productRoutes = ROUTE_REGISTRY.filter((route) => route.group === "product");
    expect(within(drawer).getAllByRole("link").length).toBe(productRoutes.length);

    const governance = within(drawer).getByRole("button", { name: /Governance workspace/ });
    expect(governance).toHaveAttribute("aria-expanded", "false");
    await user.click(governance);
    expect(governance).toHaveAttribute("aria-expanded", "true");
    expect(within(drawer).getAllByRole("link").length).toBe(ROUTE_REGISTRY.length);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(toggle).toHaveFocus();
  });

  it("puts focus on the new page, not the menu button, after navigating from the drawer", async () => {
    const user = userEvent.setup();
    const { router } = await renderRoute("/");

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    await user.click(within(drawer).getByRole("link", { name: "Learners" }));

    expect(router.state.location.pathname).toBe("/learners");
    expect(screen.queryByRole("dialog")).toBeNull();
    // Focus lands on the heading of the page that was just opened.
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1, name: "Learners" })).toHaveFocus(),
    );
    expect(window.document.body.style.overflow).toBe("");
  });

  it("keeps element ids unique and the page behind the drawer out of reach", async () => {
    const user = userEvent.setup();
    const { container } = await renderRoute("/");
    await user.click(screen.getByRole("button", { name: "Menu" }));

    // The sidebar and the drawer are both mounted, so their ids must differ.
    const ids = Array.from(container.querySelectorAll<HTMLElement>("[id]")).map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);

    // Everything outside the dialog is inert while the dialog is open: one
    // background wrapper, so the skip link and footer are covered too.
    expect(container.querySelector("header")?.closest("div[inert]")).toBeTruthy();
    expect(screen.getByRole("main").closest("div[inert]")).toBeTruthy();
    expect(container.querySelector("footer")?.closest("div[inert]")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Skip to main content" }).closest("div[inert]"),
    ).toBeTruthy();
    // The drawer itself is outside that wrapper.
    expect(
      screen.getByRole("dialog", { name: "Primary navigation" }).closest("div[inert]"),
    ).toBeNull();

    // Collapsed governance links are not in the focus order at all.
    const drawer = screen.getByRole("dialog", { name: "Primary navigation" });
    expect(within(drawer).queryByRole("link", { name: "Decisions" })).toBeNull();
  });

  it("uses plain-language navigation labels without unexplained abbreviations", async () => {
    await renderRoute("/");
    const nav = screen.getByRole("navigation", { name: "Sections" });
    for (const route of ROUTE_REGISTRY) {
      const link = within(nav).getByRole("link", { name: route.label });
      expect(link.textContent).not.toMatch(/\b[A-Z]{2,}\b/);
    }
  });
});

describe("boundary visibility", () => {
  it.each(ROUTE_REGISTRY)("states the no-personal-data boundary on $path", async (route) => {
    const { container } = await renderRoute(route.path);
    const banner = container.querySelector('[data-boundary-banner="true"]');
    expect(banner).toBeTruthy();
    expect(banner?.textContent).toContain("No personal data");
    expect(banner?.textContent).toContain("synthetic");
  });
});
