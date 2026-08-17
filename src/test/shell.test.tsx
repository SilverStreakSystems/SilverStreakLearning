import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
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

  it("keeps the mobile navigation reachable through a labelled toggle", async () => {
    const user = userEvent.setup();
    await renderRoute("/");

    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    const mobileNav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(mobileNav).getAllByRole("link").length).toBe(ROUTE_REGISTRY.length);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
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
