/**
 * Route and scenario inventory for the TTR-001 audit.
 *
 * The static route list is read from the canonical route registry. The
 * parameterized routes are derived from the route files on disk, using the
 * same filesystem derivation the evidence pipeline already uses. No competing
 * hand-maintained route list is created here.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { ROUTE_REGISTRY } from "../../src/lib/route-registry";
import {
  ENTERPRISE_CAPABILITIES,
  INTERFACE_TEMPLATES,
  SHARED_OBJECT_CATALOG,
  VALUE_STREAMS,
  WORKSPACES,
} from "../../src/fixtures";

const ROUTES_DIR = join(process.cwd(), "src", "routes");

/** Representative synthetic fixtures, each read from a canonical fixture set. */
export function fixtureFor(paramName) {
  switch (paramName) {
    case "capabilityId":
      return {
        value: ENTERPRISE_CAPABILITIES[0].capabilityId,
        source: "ENTERPRISE_CAPABILITIES[0]",
      };
    case "typeId":
      return { value: SHARED_OBJECT_CATALOG[0].typeId, source: "SHARED_OBJECT_CATALOG[0]" };
    case "streamId":
      return { value: VALUE_STREAMS[0].valueStreamId, source: "VALUE_STREAMS[0]" };
    case "workspaceId":
      return { value: WORKSPACES[0].workspaceId, source: "WORKSPACES[0]" };
    case "templateId":
      return { value: INTERFACE_TEMPLATES[0].templateId, source: "INTERFACE_TEMPLATES[0]" };
    default:
      return null;
  }
}

function routeFilesWithParameters() {
  return readdirSync(ROUTES_DIR)
    .filter((name) => name.endsWith(".tsx") && name.includes("$"))
    .sort()
    .map((name) => {
      const segments = name.replace(/\.tsx$/, "").split(".");
      return {
        file: `src/routes/${name}`,
        pattern: `/${segments.join("/")}`,
        paramNames: segments.filter((s) => s.startsWith("$")).map((s) => s.slice(1)),
      };
    });
}

/** Complete canonical route inventory: static registry entries plus detail routes. */
export function buildRouteInventory() {
  const inventory = ROUTE_REGISTRY.map((entry) => ({
    route_id: `RT-${slug(entry.path)}`,
    route_pattern: entry.path,
    route_url: entry.path,
    route_kind: "STATIC",
    source: "src/lib/route-registry.ts",
    parameters: {},
    fixture_sources: {},
    outcome: "PENDING",
    outcome_reason: "",
  }));

  for (const route of routeFilesWithParameters()) {
    const parameters = {};
    const fixtureSources = {};
    let url = route.pattern;
    let blocked = null;

    for (const paramName of route.paramNames) {
      const fixture = fixtureFor(paramName);
      if (!fixture || !fixture.value) {
        blocked = `no representative synthetic fixture is available for parameter ${paramName}`;
        break;
      }
      parameters[paramName] = fixture.value;
      fixtureSources[paramName] = fixture.source;
      url = url.replace(`$${paramName}`, encodeURIComponent(fixture.value));
    }

    inventory.push({
      route_id: `RT-${slug(route.pattern)}`,
      route_pattern: route.pattern,
      route_url: url,
      route_kind: "PARAMETERIZED",
      source: route.file,
      parameters,
      fixture_sources: fixtureSources,
      outcome: blocked ? "BLOCKED" : "PENDING",
      outcome_reason: blocked ?? "",
    });
  }

  return inventory;
}

/** Interaction scenarios beyond the default rendered state. */
export const SCENARIOS = [
  {
    scenario_id: "SCN-DEFAULT",
    description: "Default rendered state of the route, with no interaction applied.",
    applies_to_viewport_css_px: [320, 768, 1366],
    activation: "None. The page is loaded and allowed to settle.",
  },
  {
    scenario_id: "SCN-MOBILE-NAV-OPEN",
    description:
      "The existing mobile navigation disclosure in the application shell is opened, exposing the primary navigation targets that are collapsed at narrow widths.",
    applies_to_viewport_css_px: [320],
    activation:
      "Click the shell disclosure button whose aria-controls is primary-navigation-mobile and whose aria-expanded is false.",
  },
];

function slug(pattern) {
  const cleaned = pattern
    .replace(/\$/g, "")
    .replace(/\//g, "-")
    .replace(/^-/, "")
    .replace(/-$/, "");
  return cleaned.length > 0 ? cleaned.toUpperCase() : "ROOT";
}
