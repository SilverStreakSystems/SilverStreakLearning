/**
 * WP-007 Cycle 7 focused tests for the SSLS touch-target acceptance rule.
 *
 * These prove that the rule is structurally testable, that the default and the
 * floor cannot be conflated, that the five documented exceptions are the only
 * route below the floor, and that defining the verification protocol sets no
 * audit or conformance state anywhere in the program.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  TOUCH_TARGET_CLASSIFICATIONS,
  TOUCH_TARGET_EXCEPTION_TYPES,
  classifyDeclaredTarget,
  validateTouchTargetRule,
} from "@/domain/touch-target";
import { loadTouchTargetRule, loadTouchTargetRuleSchema } from "@/lib/touch-target-registry";
import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures";
import { PROGRAM_STATE } from "@/fixtures/program";
import { loadHistoricalRequirementFile } from "@/lib/historical-requirement-registry";
import { loadOwnerDispositionFile } from "@/lib/fnd-022-review-registry";

const RULE = loadTouchTargetRule();

describe("touch-target rule record", () => {
  it("is structurally valid and makes no prohibited claim", () => {
    expect(validateTouchTargetRule(RULE)).toEqual([]);
  });

  it("keeps the 44 default and the 24 floor as distinct, differently obligated values", () => {
    expect(RULE.default_target.obligation).toBe("SHOULD");
    expect(RULE.default_target.width_css_px).toBe(44);
    expect(RULE.measurable_floor.obligation).toBe("MUST");
    expect(RULE.measurable_floor.width_css_px).toBe(24);
    expect(RULE.default_target.width_css_px).not.toBe(RULE.measurable_floor.width_css_px);

    const conflated = structuredClone(RULE);
    conflated.measurable_floor.width_css_px = 44;
    conflated.measurable_floor.height_css_px = 44;
    expect(validateTouchTargetRule(conflated)).not.toEqual([]);
  });

  it("enumerates all five exception types exactly once", () => {
    const types = RULE.exceptions.map((entry) => entry.exception_type);
    expect([...types].sort()).toEqual([...TOUCH_TARGET_EXCEPTION_TYPES].sort());
    for (const type of TOUCH_TARGET_EXCEPTION_TYPES) {
      expect(types.filter((entry) => entry === type)).toHaveLength(1);
    }

    const duplicated = structuredClone(RULE);
    duplicated.exceptions.push(duplicated.exceptions[0]!);
    expect(validateTouchTargetRule(duplicated)).not.toEqual([]);
  });

  it("refuses a compact-context rationale as authority for a below-floor target", () => {
    expect(RULE.compact_target_departure.may_authorize_below_floor).toBe(false);
    expect(RULE.below_floor_target.compact_rationale_accepted).toBe(false);
    expect(
      classifyDeclaredTarget({
        widthCssPx: 20,
        heightCssPx: 20,
        standaloneAuthorControlled: true,
        compactContextRationale: true,
        documentedException: null,
      }),
    ).toBe("FAIL");

    const bent = structuredClone(RULE);
    bent.below_floor_target.compact_rationale_accepted = true;
    expect(validateTouchTargetRule(bent)).not.toEqual([]);
  });

  it("passes a below-floor target only through one documented exception", () => {
    expect(RULE.below_floor_target.only_route).toBe("DOCUMENTED-EXCEPTION");
    expect(
      classifyDeclaredTarget({
        widthCssPx: 16,
        heightCssPx: 16,
        standaloneAuthorControlled: true,
        compactContextRationale: false,
        documentedException: "SPACING",
      }),
    ).toBe("PASS-EXCEPTION");
  });

  it("accepts a 24 to 43 departure only with a compact-context rationale", () => {
    const base = {
      widthCssPx: 32,
      heightCssPx: 32,
      standaloneAuthorControlled: true,
      documentedException: null,
    } as const;
    expect(classifyDeclaredTarget({ ...base, compactContextRationale: false })).toBe("FAIL");
    expect(classifyDeclaredTarget({ ...base, compactContextRationale: true })).toBe(
      "PASS-24-FLOOR",
    );
    expect(
      classifyDeclaredTarget({
        widthCssPx: 48,
        heightCssPx: 48,
        standaloneAuthorControlled: true,
        compactContextRationale: false,
        documentedException: null,
      }),
    ).toBe("PASS-44-DEFAULT");
  });

  it("cites both W3C sources as inputs only", () => {
    expect(RULE.sources.map((entry) => entry.url)).toEqual([
      "https://www.w3.org/TR/WCAG22/",
      "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum",
    ]);
    for (const source of RULE.sources) expect(source.role).toBe("INPUT-ONLY");
  });

  it("validates against the shape declared by its Draft 2020-12 schema", () => {
    const schema = loadTouchTargetRuleSchema() as {
      $schema: string;
      required: string[];
      properties: Record<string, unknown>;
    };
    expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    for (const key of schema.required) {
      expect(Object.keys(RULE)).toContain(key);
    }
    for (const key of Object.keys(RULE)) {
      expect(schema.required).toContain(key);
    }
  });
});

describe("verification protocol is defined and not run", () => {
  it("declares the three viewport widths and the five classifications once each", () => {
    expect(RULE.verification.viewports_css_px).toEqual([320, 768, 1366]);
    expect([...RULE.verification.classifications].sort()).toEqual(
      [...TOUCH_TARGET_CLASSIFICATIONS].sort(),
    );
  });

  it("requires every audit record field, including the conditional ones", () => {
    const fields = RULE.verification.record_fields.map((entry) => entry.field);
    for (const expected of [
      "route",
      "locator",
      "viewport_css_px",
      "bounding_rect_css_px",
      "classification",
      "exception_type",
      "rationale",
      "equivalent_control_locator",
      "reviewer_and_evidence_reference",
    ]) {
      expect(fields).toContain(expected);
    }
  });

  it("decides the spacing exception with a centred 24 CSS pixel circle and no intersection", () => {
    expect(RULE.verification.spacing_check.circle_diameter_css_px).toBe(24);
    expect(RULE.verification.spacing_check.pass_condition).toMatch(/intersects no other target/i);
  });

  it("sends the judgment-based exceptions to named manual review", () => {
    expect([...RULE.verification.manual_review_required_for].sort()).toEqual([
      "ESSENTIAL",
      "INLINE",
      "USER-AGENT-CONTROL",
    ]);
  });

  it("sets no audit, pass, or conformance state anywhere in the program", () => {
    expect(RULE.verification.execution_state).toBe("NOT-RUN");
    expect(RULE.lifecycle_state).toBe("DEFINED-NOT-VERIFIED");
    const text = JSON.stringify(RULE).toLowerCase();
    for (const phrase of ["audit ran", "audit complete", "targets pass", "conformant"]) {
      expect(text).not.toContain(phrase);
    }
    expect(EVIDENCE.find((record) => record.id === "EV-003")?.state).toBe("not-run");
    expect(PROGRAM_STATE.unauthorizedStages.map((stage) => stage.stageId)).toContain(
      "TOUCH-TARGET-AUDIT",
    );
  });
});

describe("Cycle 7 governance reconciliation", () => {
  it("records DEC-021 as accepted and scoped to rule definition only", () => {
    const decision = DECISIONS.find((record) => record.id === "DEC-021");
    expect(decision?.state).toBe("accepted");
    expect(decision?.decision).toMatch(/defines a rule only/i);
    expect(decision?.decision).toMatch(/authorizes neither WP-039 nor any Cycle 8/i);
    expect(RULE.controlling_decision).toBe("DEC-021");
  });

  it("discharges FND-023 only against a valid rule record, preserving its lineage", () => {
    const finding = FINDINGS.find((record) => record.id === "FND-023");
    expect(validateTouchTargetRule(RULE)).toEqual([]);
    expect(finding?.resolutionState).toBe("confirmed");
    expect(finding?.requiredDecision).toBe("DEC-021");
    expect(finding?.evidenceReferences).toContain("EV-043");
    // Prior text preserved, not rewritten.
    expect(finding?.description).toContain("touch targets appropriate to context");
    expect(finding?.description).toContain("DISCHARGED on 2026-08-20 by DEC-021");
  });

  it("carries the unrun verification as FND-024 rather than as an authorization", () => {
    const finding = FINDINGS.find((record) => record.id === "FND-024");
    expect(finding?.resolutionState).toBe("blocked");
    expect(finding?.boundary).toMatch(/does not authorize an audit/i);
    // DEC-022 deferred execution, so the audit is no longer the leading action,
    // but the obligation stays visible as deferred debt and as an unauthorized stage.
    expect(PROGRAM_STATE.auditExecution.state).toBe("NOT-RUN");
    expect(PROGRAM_STATE.deferredDebt.map((entry) => entry.recordId)).toContain("FND-024");
    expect(PROGRAM_STATE.unauthorizedStages.map((entry) => entry.stageId)).toContain(
      "TOUCH-TARGET-AUDIT",
    );
  });

  it("records EV-043 without claiming an interface audit ran", () => {
    const record = EVIDENCE.find((entry) => entry.id === "EV-043");
    expect(record?.state).toBe("confirmed");
    expect(record?.doesNotSupport).toMatch(/That any interface target-size audit ran/i);
    expect(record?.supports).toMatch(/TTR-001 v1\.0\.0/);
  });

  it("reports CHECKPOINT-009 as the Cycle 7 checkpoint with no closure", () => {
    expect(PROGRAM_STATE.latestCheckpoint.checkpointId).toBe("CHECKPOINT-009");
    expect(PROGRAM_STATE.latestCheckpoint.closedNothing).toMatch(/ran no interface audit/i);
    expect(PROGRAM_STATE.gate.state).toBe("open");
    expect(PROGRAM_STATE.activeWorkPackage.state).toBe("active");
  });

  it("allocates no duplicate identifier", () => {
    for (const list of [
      FINDINGS.map((r) => r.id),
      EVIDENCE.map((r) => r.id),
      DECISIONS.map((r) => r.id),
    ]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });

  it("keeps one truth plane: the rule lives in exactly one canonical record", () => {
    const rules = execFileSync("git", ["ls-files", "data"], { encoding: "utf8" })
      .split("\n")
      .filter((path) => /touch[-_]?target/i.test(path) && path.endsWith(".json"))
      .filter((path) => !path.includes("SCHEMA"));
    expect(rules).toEqual(["data/accessibility/touch-target-rule.json"]);
  });
});

describe("HREQ-025 is untouched by Cycle 7", () => {
  it("keeps the historical wording and the deferral exactly as Cycle 6 recorded them", () => {
    const requirement = loadHistoricalRequirementFile().records.find(
      (record) => record.requirement_id === "HREQ-025",
    );
    expect(requirement?.original_wording).toContain("touch targets appropriate to context");

    const disposition = loadOwnerDispositionFile().candidate_dispositions.find(
      (entry) => entry.candidate_id === "HREQ-025",
    );
    expect(disposition?.owner_disposition).toBe("NEEDS-EVIDENCE / DEFER");
    expect(disposition?.exact_text).toBe("touch targets appropriate to context");
  });

  it("states in the rule itself that the historical candidate is not adopted", () => {
    expect(RULE.authority.exclusions.join(" ")).toMatch(/HREQ-025 is not adopted/i);
    expect(RULE.precedence.join(" ")).toMatch(/HREQ-025 remains NEEDS-EVIDENCE \/ DEFER/);
  });
});

describe("generated projection reconciles with the canonical record", () => {
  const projection = readFileSync(
    join(process.cwd(), "docs", "accessibility", "TOUCH_TARGET_ACCEPTANCE.md"),
    "utf8",
  );

  it("prints the rule, every exception, the protocol state, and both sources", () => {
    expect(projection).toContain("TTR-001 v1.0.0");
    for (const type of TOUCH_TARGET_EXCEPTION_TYPES) expect(projection).toContain(type);
    expect(projection).toContain("Verification execution state: NOT-RUN");
    for (const source of RULE.sources) expect(projection).toContain(source.url);
    expect(projection).toContain("Generated from `data/accessibility/touch-target-rule.json`");
  });

  it("is echoed as a derived section on the accessibility acceptance document", () => {
    const acceptance = readFileSync(
      join(process.cwd(), "docs", "ACCESSIBILITY_ACCEPTANCE.md"),
      "utf8",
    );
    expect(acceptance).toContain("TTR-001");
    expect(acceptance).toContain("docs/accessibility/TOUCH_TARGET_ACCEPTANCE.md");
    expect(acceptance).toMatch(/Not Run/);
  });
});
