import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_REQUIREMENTS,
  BRAND_ASSETS,
  COMPONENT_GEOMETRY,
  CONFORMANCE_CHECKS,
  COORDINATE_CONTRACTS,
  DESIGN_TOKENS,
  ENTERPRISE_WORKSPACE_TEMPLATES,
  EXPERIENCE_ARCHITECTURE_LAYERS,
  EXPERIENCE_FAMILIES,
  INTERFACE_TEMPLATES,
  MOTION_TOKENS,
  PAGE_BLUEPRINTS,
  STATE_TEMPLATES,
  TYPE_ROLES,
  VALIDATION_VIEWPORTS,
  VISUAL_SYSTEM_REFUSALS,
} from "@/fixtures";
import {
  GRID_COLUMNS,
  TEMPLATE_MATURITIES,
  isCoordinateRange,
  unrecordedValidationViewports,
} from "@/domain";

describe("architecture census", () => {
  it("declares the eight composition layers with unique identifiers", () => {
    expect(EXPERIENCE_ARCHITECTURE_LAYERS).toHaveLength(8);
    const ids = EXPERIENCE_ARCHITECTURE_LAYERS.map((layer) => layer.layerId);
    expect(new Set(ids).size).toBe(8);
  });

  it("declares eighteen interface templates, nine workspaces, and nine experience families", () => {
    expect(INTERFACE_TEMPLATES).toHaveLength(18);
    expect(ENTERPRISE_WORKSPACE_TEMPLATES).toHaveLength(9);
    expect(EXPERIENCE_FAMILIES).toHaveLength(9);
  });

  it("keeps every template identifier unique", () => {
    const ids = INTERFACE_TEMPLATES.map((template) => template.templateId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("maturity discipline", () => {
  it("uses only declared maturity labels", () => {
    for (const template of INTERFACE_TEMPLATES) {
      expect(TEMPLATE_MATURITIES).toContain(template.maturity);
    }
  });

  it("never claims implementation without naming an implementing route", () => {
    for (const template of INTERFACE_TEMPLATES) {
      if (template.maturity === "implemented") {
        expect(template.implementingRoutes.length).toBeGreaterThan(0);
      }
    }
  });

  it("never lets a gated-future or research-candidate template claim a route", () => {
    for (const template of INTERFACE_TEMPLATES) {
      if (template.maturity === "gated-future" || template.maturity === "research-candidate") {
        expect(template.implementingRoutes).toEqual([]);
      }
    }
  });

  it("records at least one open unknown for every template that is not implemented", () => {
    for (const template of INTERFACE_TEMPLATES) {
      if (template.maturity !== "implemented") {
        expect(template.openUnknowns.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps only the founder and developer experience family implemented", () => {
    const implemented = EXPERIENCE_FAMILIES.filter((family) => family.maturity === "implemented");
    expect(implemented).toHaveLength(1);
    expect(implemented[0]!.capacity.toLowerCase()).toContain("founder");
  });
});

describe("coordinate grid", () => {
  it("uses twelve columns labelled A through L", () => {
    expect(GRID_COLUMNS).toHaveLength(12);
    expect(GRID_COLUMNS[0]).toBe("A");
    expect(GRID_COLUMNS[11]).toBe("L");
  });

  it("keeps every coordinate contract inside the grid boundary, allowing stated prose fallbacks", () => {
    const looksLikeCoordinates = (value: string) => /^[A-L]\d{1,2}-[A-L]\d{1,2}$/.test(value);
    for (const contract of COORDINATE_CONTRACTS) {
      for (const value of [contract.desktop, contract.tablet, contract.mobile]) {
        if (looksLikeCoordinates(value)) {
          expect(isCoordinateRange(value)).toBe(true);
        } else {
          // Prose fallbacks are permitted only where the region leaves the grid,
          // for example a collapsed mobile drawer. They must still say something.
          expect(value.trim().length).toBeGreaterThan(0);
          expect(isCoordinateRange(value)).toBe(false);
        }
      }
    }
  });

  it("keeps every blueprint region inside the grid boundary", () => {
    for (const blueprint of PAGE_BLUEPRINTS) {
      expect(blueprint.regions.length).toBeGreaterThan(0);
      for (const region of blueprint.regions) {
        expect(isCoordinateRange(region.coordinates)).toBe(true);
      }
    }
  });

  it("rejects coordinates outside the declared field", () => {
    expect(isCoordinateRange("A1-M12")).toBe(false);
    expect(isCoordinateRange("A1-L13")).toBe(false);
    expect(isCoordinateRange("not a coordinate")).toBe(false);
  });
});

describe("component geometry minimums", () => {
  it("gives every interactive component at least a 44 pixel target", () => {
    const interactive = COMPONENT_GEOMETRY.filter((record) => record.minTargetPx !== null);
    expect(interactive.length).toBeGreaterThan(0);
    for (const record of interactive) {
      expect(record.minTargetPx).toBeGreaterThanOrEqual(44);
    }
  });
});

describe("token and type governance", () => {
  it("documents tokens with a stated use", () => {
    expect(DESIGN_TOKENS.length).toBeGreaterThan(0);
    for (const token of DESIGN_TOKENS) {
      expect(token.name.startsWith("--")).toBe(true);
      expect(token.use.length).toBeGreaterThan(0);
    }
  });

  it("assigns every type role a font, weight, and fluid rule", () => {
    for (const role of TYPE_ROLES) {
      expect(role.font.length).toBeGreaterThan(0);
      expect(role.weight.length).toBeGreaterThan(0);
      expect(role.fluidRule.length).toBeGreaterThan(0);
    }
  });

  it("never justifies long prose", () => {
    for (const role of TYPE_ROLES) {
      expect(role.alignment.toLowerCase()).not.toContain("justif");
    }
  });

  it("keeps motion durations short enough to be non-decorative", () => {
    for (const token of MOTION_TOKENS) {
      expect(token.durationMs).toBeLessThanOrEqual(400);
    }
  });
});

describe("brand asset provenance", () => {
  it("records provenance for every brand asset", () => {
    expect(BRAND_ASSETS.length).toBeGreaterThan(0);
    for (const asset of BRAND_ASSETS) {
      expect(asset.provenance.length).toBeGreaterThan(0);
      expect(asset.componentName.length).toBeGreaterThan(0);
    }
  });
});

describe("state and honesty rules", () => {
  it("gives every state except loading a stated way forward", () => {
    expect(STATE_TEMPLATES.length).toBeGreaterThanOrEqual(8);
    const wayForward = /next|reset|retry|correction|guidance|safe|owner|source|conflict/;
    for (const state of STATE_TEMPLATES) {
      expect(state.requiredContent.length).toBeGreaterThan(0);
      if (state.stateId === "ST-LOADING") continue;
      expect(state.requiredContent.join(" ").toLowerCase()).toMatch(wayForward);
    }
  });

  it("records the refused claims for this increment", () => {
    const claims = VISUAL_SYSTEM_REFUSALS.map((refusal) => refusal.claim.toLowerCase()).join(" | ");
    expect(claims).toContain("wcag");
    expect(VISUAL_SYSTEM_REFUSALS.length).toBeGreaterThanOrEqual(3);
    for (const refusal of VISUAL_SYSTEM_REFUSALS) {
      expect(refusal.reason.length).toBeGreaterThan(0);
    }
  });

  it("states responsive validation as unvalidated until a run is recorded", () => {
    expect(VALIDATION_VIEWPORTS.length).toBeGreaterThanOrEqual(9);
    const unrecorded = unrecordedValidationViewports(VALIDATION_VIEWPORTS);
    expect(unrecorded.length).toBe(VALIDATION_VIEWPORTS.length);
    for (const viewport of VALIDATION_VIEWPORTS) {
      expect(viewport.recordedOn).toBeNull();
    }
  });

  it("gives every conformance check an examinable basis and no aggregate score", () => {
    for (const check of CONFORMANCE_CHECKS) {
      expect(check.basis.length).toBeGreaterThan(0);
      expect(check.check).not.toMatch(/%|percent|score/i);
    }
  });

  it("states a minimum for every accessibility requirement", () => {
    for (const requirement of ACCESSIBILITY_REQUIREMENTS) {
      expect(requirement.minimum.length).toBeGreaterThan(0);
    }
  });
});
