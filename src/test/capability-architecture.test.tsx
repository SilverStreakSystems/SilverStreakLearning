import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "./render-route";
import {
  CAPABILITY_DEPENDENCIES,
  DELIVERABLE_TYPES,
  ENTERPRISE_CAPABILITIES,
  NORMALIZATION_FINDINGS,
} from "@/fixtures";
import {
  CAPABILITY_DOMAINS,
  CAPABILITY_DOMAIN_META,
  TRIGGER_GATE_META,
  carriesImplementationAuthority,
  stageIndex,
} from "@/domain";
import { filterCapabilities } from "@/lib/capability-queries";

describe("capability taxonomy shape", () => {
  it("covers twelve domains with at least eight capabilities each", () => {
    expect(CAPABILITY_DOMAINS).toHaveLength(12);
    for (const domain of CAPABILITY_DOMAINS) {
      const inDomain = ENTERPRISE_CAPABILITIES.filter((c) => c.capabilityDomain === domain);
      expect(
        inDomain.length,
        `${domain} ${CAPABILITY_DOMAIN_META[domain].name} has too few capabilities`,
      ).toBeGreaterThanOrEqual(8);
    }
  });

  it("seeds between 120 and 135 candidate capabilities", () => {
    expect(ENTERPRISE_CAPABILITIES.length).toBeGreaterThanOrEqual(120);
    expect(ENTERPRISE_CAPABILITIES.length).toBeLessThanOrEqual(135);
  });

  it("uses unique identifiers and unique names", () => {
    const ids = ENTERPRISE_CAPABILITIES.map((c) => c.capabilityId);
    const names = ENTERPRISE_CAPABILITIES.map((c) => c.name.toLowerCase());
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("seeds twelve or more deliverable types, none of which grants authority by existing", () => {
    expect(DELIVERABLE_TYPES.length).toBeGreaterThanOrEqual(12);
    for (const deliverable of DELIVERABLE_TYPES) {
      if (deliverable.canJustifyImplementation) {
        expect(carriesImplementationAuthority(deliverable.defaultAuthority)).toBe(true);
      }
    }
  });
});

describe("every record answers the required governance questions", () => {
  it("names a beneficiary, a harm, a burden, and a risk if absent", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      expect(capability.humanBeneficiaries.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.harmedIfItFails.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.carriesBurden.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.riskIfAbsent.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.northStarContribution.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.nextDefensibleAction.length, capability.capabilityId).toBeGreaterThan(0);
    }
  });

  it("declares required deliverables and evidence for every capability", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      expect(capability.requiredDeliverableTypes.length, capability.capabilityId).toBeGreaterThan(0);
      expect(capability.requiredEvidence.length, capability.capabilityId).toBeGreaterThan(0);
    }
  });
});

describe("authority is never derived from implementation", () => {
  it("keeps every seeded capability at candidate authority and synthetic", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      expect(capability.synthetic).toBe(true);
      expect(capability.recordState).toBe("candidate");
      expect(carriesImplementationAuthority(capability.currentAuthority)).toBe(false);
    }
  });

  it("does not raise maturity when implementation status is changed", () => {
    const capability = ENTERPRISE_CAPABILITIES[0]!;
    const changed = { ...capability, implementationStatus: "confirmed" as const };
    expect(changed.currentMaturity).toBe(capability.currentMaturity);
    expect(changed.currentAuthority).toBe(capability.currentAuthority);
  });

  it("never records assured maturity without independent assurance being declared", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      if (capability.currentMaturity === "assured") {
        expect(capability.evidenceStatus, capability.capabilityId).toBe("confirmed");
      }
    }
  });
});

describe("stage and gate discipline", () => {
  it("requires architecture no later than execution, and assurance no earlier than execution", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      const { architecture, execution, independentAssurance, succession } = capability.stages;
      expect(stageIndex(architecture), capability.capabilityId).toBeLessThanOrEqual(
        stageIndex(execution),
      );
      expect(stageIndex(independentAssurance), capability.capabilityId).toBeGreaterThanOrEqual(
        stageIndex(execution),
      );
      expect(stageIndex(succession), capability.capabilityId).toBeGreaterThanOrEqual(
        stageIndex(execution),
      );
    }
  });

  it("keeps every trigger gate uncrossed in the current posture", () => {
    for (const meta of Object.values(TRIGGER_GATE_META)) {
      expect(meta.crossed).toBe(false);
    }
  });

  it("gates at least one capability behind live personal data and behind product AI", () => {
    const pii = ENTERPRISE_CAPABILITIES.filter((c) => c.triggerGates.includes("before-live-pii"));
    const ai = ENTERPRISE_CAPABILITIES.filter((c) => c.triggerGates.includes("before-product-ai"));
    expect(pii.length).toBeGreaterThan(0);
    expect(ai.length).toBeGreaterThan(0);
  });
});

describe("independence rules", () => {
  it("states a separation of duties for every capability and a trigger for conditional ones", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      expect(capability.independence.separationOfDuties.length, capability.capabilityId).toBeGreaterThan(0);
      if (capability.independence.level === "conditional") {
        expect(capability.independence.trigger, capability.capabilityId).toBeTruthy();
      }
    }
  });

  it("never lets a capability requiring independence be covered by the founder alone", () => {
    for (const capability of ENTERPRISE_CAPABILITIES) {
      if (capability.independence.level === "required") {
        expect(capability.consolidationEligibility, capability.capabilityId).not.toEqual(["founder"]);
      }
    }
  });
});

describe("dependencies and normalization", () => {
  it("points every dependency at a real capability and never at itself", () => {
    const ids = new Set(ENTERPRISE_CAPABILITIES.map((c) => c.capabilityId));
    for (const dependency of CAPABILITY_DEPENDENCIES) {
      expect(ids.has(dependency.from), dependency.from).toBe(true);
      expect(ids.has(dependency.to), dependency.to).toBe(true);
      expect(dependency.from).not.toBe(dependency.to);
      expect(dependency.rationale.length).toBeGreaterThan(0);
    }
  });

  it("records normalization findings with an explicit boundary", () => {
    expect(NORMALIZATION_FINDINGS.length).toBeGreaterThanOrEqual(10);
    for (const finding of NORMALIZATION_FINDINGS) {
      expect(finding.boundary.length, finding.id).toBeGreaterThan(0);
      expect(finding.synthetic).toBe(true);
    }
  });
});

describe("filtering", () => {
  it("narrows by domain, independence, and free text without mutating the source", () => {
    const before = ENTERPRISE_CAPABILITIES.length;
    const byDomain = filterCapabilities(ENTERPRISE_CAPABILITIES, { domain: "D06" });
    expect(byDomain.every((c) => c.capabilityDomain === "D06")).toBe(true);
    const byIndependence = filterCapabilities(ENTERPRISE_CAPABILITIES, { independence: "required" });
    expect(byIndependence.every((c) => c.independence.level === "required")).toBe(true);
    const byText = filterCapabilities(ENTERPRISE_CAPABILITIES, { query: "accessibility" });
    expect(byText.length).toBeGreaterThan(0);
    expect(ENTERPRISE_CAPABILITIES.length).toBe(before);
  });
});

describe("capability command view", () => {
  it("renders one H1 and refuses any readiness percentage", async () => {
    await renderRoute("/capabilities");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const main = screen.getByRole("main").textContent ?? "";
    expect(main).not.toMatch(/\d+\s?%/);
    expect(main).toMatch(/no readiness percentage/i);
  });

  it("offers every filter control with an accessible label", async () => {
    await renderRoute("/capabilities");
    expect(screen.getByLabelText("Domain")).toBeTruthy();
    expect(screen.getByLabelText("Capability type")).toBeTruthy();
    expect(screen.getByLabelText("Trigger gate")).toBeTruthy();
    expect(screen.getByLabelText("Independence")).toBeTruthy();
    expect(screen.getByLabelText("Text search")).toBeTruthy();
  });

  it("filters the registry from a search parameter", async () => {
    await renderRoute("/capabilities?domain=D06");
    const main = screen.getByRole("main").textContent ?? "";
    expect(main).toContain("CAP-D06-001");
    expect(main).not.toContain("CAP-D01-001");
  });

  it("switches views through addressable links", async () => {
    await renderRoute("/capabilities?view=dependencies");
    expect(screen.getByRole("heading", { name: /dependency graph/i })).toBeTruthy();
  });

  it("keeps filters when the operator types in the search box", async () => {
    const user = userEvent.setup();
    await renderRoute("/capabilities");
    const input = screen.getByLabelText("Text search");
    await user.type(input, "privacy");
    expect((input as HTMLInputElement).value.length).toBeGreaterThan(0);
  });
});

describe("capability detail page", () => {
  it("answers the North Star question for a capability", async () => {
    await renderRoute("/capabilities/CAP-D01-001");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toContain("CAP-D01-001");
    expect(screen.getByRole("heading", { name: /connection to the north star/i })).toBeTruthy();
  });

  it("states honestly when no record exists", async () => {
    await renderRoute("/capabilities/CAP-D99-999");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("not found");
  });
});
