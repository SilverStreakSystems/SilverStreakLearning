import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ROUTE_REGISTRY } from "@/lib/route-registry";

/**
 * Static checks against the stylesheet and route registry. These verify design
 * commitments that a rendered jsdom tree cannot observe, because jsdom does not
 * evaluate the application stylesheet.
 */
const styles = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

describe("accessibility commitments in the stylesheet", () => {
  it("honors the reduced-motion preference", () => {
    expect(styles).toContain("prefers-reduced-motion: reduce");
    expect(styles).toMatch(/animation-duration:\s*0\.001ms\s*!important/);
    expect(styles).toMatch(/transition-duration:\s*0\.001ms\s*!important/);
  });

  it("defines a dual-color visible focus indicator", () => {
    expect(styles).toContain(":focus-visible");
    expect(styles).toMatch(/outline:\s*3px solid/);
    expect(styles).toMatch(/box-shadow:\s*0 0 0 6px/);
  });

  it("wraps rather than truncates and keeps readable line length available", () => {
    expect(styles).toContain("overflow-wrap: break-word");
    expect(styles).toContain("@utility measure");
    expect(styles).toContain("max-width: 72ch");
  });

  it("does not disable text size adjustment on zoom", () => {
    expect(styles).not.toContain("user-scalable=no");
    expect(styles).not.toContain("maximum-scale");
  });
});

describe("route registry", () => {
  it("declares one heading per route and no duplicate paths", () => {
    const paths = ROUTE_REGISTRY.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
    ROUTE_REGISTRY.forEach((route) => {
      expect(route.heading.length).toBeGreaterThan(0);
      expect(route.purpose.length).toBeGreaterThan(0);
    });
  });
});
