import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderRoute } from "./render-route";
import {
  AUTHORITY_CLASS_META,
  VERIFICATION_STATE_META,
  carriesImplementationAuthority,
  type EnterpriseCapability,
} from "@/domain";
import { ENTERPRISE_CAPABILITIES, CLAIMS, FOUNDATION_ARTIFACTS, READINESS_AXES } from "@/fixtures";

describe("authority is declared, never derived", () => {
  it("does not change authority when implementation status changes", () => {
    const capability = ENTERPRISE_CAPABILITIES[0]!;
    const before = capability.currentAuthority;

    const implemented: EnterpriseCapability = {
      ...capability,
      implementationStatus: "confirmed",
    };

    expect(implemented.currentAuthority).toBe(before);
    expect(carriesImplementationAuthority(implemented.currentAuthority)).toBe(false);
  });

  it("keeps the built shell free of implementation authority", () => {
    const shell = FOUNDATION_ARTIFACTS.find((artifact) => artifact.id === "FND-SHELL-001");
    expect(shell?.lifecycleStage).toBe("implemented-capability");
    expect(shell?.implementationAuthority.granted).toBe(false);
    expect(carriesImplementationAuthority(shell!.authorityClass)).toBe(false);
  });

  it("only grants implementation authority to approved authority and accepted decisions", () => {
    const granting = Object.values(AUTHORITY_CLASS_META)
      .filter((meta) => meta.carriesImplementationAuthority)
      .map((meta) => meta.id);
    expect(granting).toEqual(["approved-authority", "accepted-decision"]);
  });
});

describe("candidate material never renders as approved", () => {
  it("labels every capability record as candidate in the interface", async () => {
    const { container } = await renderRoute("/capabilities");
    const badges = container.querySelectorAll("[data-authority-class]");
    expect(badges.length).toBeGreaterThan(0);
    badges.forEach((badge) => {
      expect(badge.getAttribute("data-implementation-authority")).toBe("no");
    });
    expect(container.querySelectorAll('[data-authority-class="approved-authority"]').length).toBe(0);
  });

  it("marks synthetic records visibly wherever they appear", async () => {
    const { container } = await renderRoute("/capabilities");
    const markers = container.querySelectorAll('[data-synthetic="true"]');
    expect(markers.length).toBeGreaterThan(0);
    expect(markers[0]?.textContent).toContain("Synthetic");
  });
});

describe("future architecture stays gated", () => {
  it("gates every target-state workspace with a visible notice", async () => {
    const { container } = await renderRoute("/future-architecture");
    const gates = container.querySelectorAll('[data-gated="true"]');
    expect(gates.length).toBe(9);
    gates.forEach((gate) => {
      expect(gate.textContent).toContain("Target-state candidate");
      expect(gate.textContent).toContain("Not current implementation authority");
      expect(gate.querySelector('[data-authority-class="gated-future"]')).toBeTruthy();
    });
  });
});

describe("readiness is never blended", () => {
  it("reports independent axes and no combined score", async () => {
    const { container } = await renderRoute("/");
    const axes = container.querySelector('[data-readiness-axes="true"]');
    expect(axes?.querySelectorAll("li").length).toBe(READINESS_AXES.length);

    const main = screen.getByRole("main").textContent ?? "";
    expect(main).not.toMatch(/\d+\s?%/);
    expect(main.toLowerCase()).not.toContain("overall readiness");
    expect(main.toLowerCase()).not.toContain("readiness score");
  });
});

describe("state vocabulary", () => {
  it("renders each state with a distinct text marker and label", async () => {
    const { container } = await renderRoute("/boundaries");
    const rendered = Array.from(container.querySelectorAll("[data-state-chip]"));
    expect(rendered.length).toBeGreaterThan(0);

    const markers = new Set(Object.values(VERIFICATION_STATE_META).map((meta) => meta.marker));
    expect(markers.size).toBe(Object.keys(VERIFICATION_STATE_META).length);

    for (const state of ["unknown", "not-run", "blocked", "refused", "not-applicable"] as const) {
      const chip = container.querySelector(`[data-state-chip="${state}"]`);
      expect(chip, `expected a chip for ${state}`).toBeTruthy();
      expect(chip?.textContent).toContain(VERIFICATION_STATE_META[state].label);
      expect(chip?.textContent).toContain(VERIFICATION_STATE_META[state].marker);
    }
  });

  it("never relies on color alone to carry state", async () => {
    const { container } = await renderRoute("/evidence");
    container.querySelectorAll("[data-state-chip]").forEach((chip) => {
      const state = chip.getAttribute("data-state-chip") as keyof typeof VERIFICATION_STATE_META;
      expect(chip.textContent).toContain(VERIFICATION_STATE_META[state].label);
      expect(chip.textContent).toContain(VERIFICATION_STATE_META[state].marker);
    });
  });
});

describe("claims", () => {
  it("refuses release and readiness claims unless evidence supports them", async () => {
    await renderRoute("/boundaries");
    const main = screen.getByRole("main").textContent ?? "";
    const refused = CLAIMS.filter((claim) => claim.posture === "refused");
    expect(refused.length).toBeGreaterThanOrEqual(6);
    refused.forEach((claim) => {
      expect(main).toContain(claim.claim);
    });
    expect(main).toContain("Refused");
  });
});

describe("essential text is not truncated", () => {
  it("avoids truncation utilities on registry content", async () => {
    const { container } = await renderRoute("/authority");
    expect(container.querySelectorAll(".truncate").length).toBe(0);
    expect(container.querySelectorAll(".text-ellipsis").length).toBe(0);
    expect(container.querySelectorAll(".line-clamp-1, .line-clamp-2, .line-clamp-3").length).toBe(0);
  });
});
