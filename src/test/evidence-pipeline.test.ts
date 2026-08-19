/**
 * WP-037 pipeline invariants.
 *
 * These lock the properties the architecture depends on: the schema refuses
 * to record inferred independence, applicability is decided by input hashes
 * rather than commit strings, unknown is preserved, and no in-app surface
 * promotes a claim.
 */
import { describe, expect, it } from "vitest";

import type { EvidenceType } from "../../scripts/evidence/types.mjs";

import { evaluateApplicability, evaluateReuse } from "../../scripts/evidence/applicability.mjs";
import { computeExpiry, EXPIRY_POLICY, isExpired } from "../../scripts/evidence/expiry.mjs";
import {
  declaredSets,
  INPUT_SET_DEFINITIONS,
  inputSetFor,
  isReusable,
} from "../../scripts/evidence/inputs.mjs";
import {
  createEvidenceRecord,
  EVIDENCE_TYPES,
  validateEvidenceRecord,
} from "../../scripts/evidence/schema.mjs";
import { verifyEvidenceSet } from "../../scripts/evidence/verify.mjs";
import { stableHash } from "../../scripts/evidence/util.mjs";
import {
  APPLICABILITY_MEANING,
  APPLICABILITY_STATES,
  PIPELINE_CHECKS,
  PIPELINE_FINDING_RESOLUTIONS,
  PIPELINE_REFUSALS,
  REUSE_CONDITIONS,
} from "@/domain";

const COMMIT = "a".repeat(40);
const OTHER_COMMIT = "b".repeat(40);

function record(overrides = {}) {
  return createEvidenceRecord({
    evidence_id: "EV-TEST-FIXTURE",
    evidence_type: "BUILD",
    title: "Fixture build",
    description: "Synthetic record used only by the test suite.",
    commit_sha: COMMIT,
    environment: "lovable-sandbox",
    timestamp: "2026-08-20T00:00:00.000Z",
    tool: "vite",
    producer: "ssls-evidence-pipeline",
    command: "bun run build",
    actual_result: "Exit code 0.",
    status: "pass",
    supports: ["A build executed and exited 0."],
    does_not_support: ["Runtime correctness."],
    input_set: { source: "s1", config: "c1", lockfile: "l1" },
    ...overrides,
  });
}

const MATCHING_INPUTS = { source: "s1", config: "c1", lockfile: "l1" };

describe("evidence schema", () => {
  it("accepts a well-formed record", () => {
    expect(validateEvidenceRecord(record()).valid).toBe(true);
  });

  it("requires every record to state what it supports", () => {
    const result = validateEvidenceRecord(record({ supports: [] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === "supports")).toBe(true);
  });

  it("requires every record to state what it cannot support", () => {
    const result = validateEvidenceRecord(record({ does_not_support: undefined }));
    expect(result.valid).toBe(false);
  });

  it("refuses independence that was not declared as an independent method", () => {
    const result = validateEvidenceRecord(record({ independent: true }));
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === "independent")).toBe(true);
  });

  it("refuses to report pipeline output as independent evidence", () => {
    const result = validateEvidenceRecord(
      record({ method: "independent", independent: true, producer_type: "pipeline" }),
    );
    expect(result.valid).toBe(false);
  });

  it("refuses an abbreviated commit binding", () => {
    const result = validateEvidenceRecord(record({ commit_sha: "abc1234" }));
    expect(result.valid).toBe(false);
  });

  it("refuses an expiry that precedes execution", () => {
    const result = validateEvidenceRecord(record({ expires_at: "2020-01-01T00:00:00.000Z" }));
    expect(result.valid).toBe(false);
  });

  it("requires an artifact hash whenever an artifact is indexed", () => {
    const result = validateEvidenceRecord(record({ artifact_path: "artifacts/x.json" }));
    expect(result.valid).toBe(false);
  });
});

describe("input sets", () => {
  it("declares inputs for every evidence type", () => {
    for (const type of EVIDENCE_TYPES) {
      expect(declaredSets(type).length).toBeGreaterThan(0);
    }
  });

  it("narrows the full input map to the declared sets only", () => {
    const selected = inputSetFor("SBOM", { manifest: "m", lockfile: "l", source: "s" });
    expect(Object.keys(selected).sort()).toEqual(["lockfile", "manifest"]);
  });

  it("marks tree-wide scans as non-reusable across commits", () => {
    expect(isReusable("SECRET_SCAN")).toBe(false);
    expect(isReusable("PII_BOUNDARY_SCAN")).toBe(false);
    expect(isReusable("SOURCE_PROVENANCE")).toBe(false);
  });

  it("keeps every declaration reviewable as data", () => {
    expect(Object.keys(INPUT_SET_DEFINITIONS).sort()).toEqual([...EVIDENCE_TYPES].sort());
  });
});

describe("applicability", () => {
  it("is CURRENT when declared inputs are unchanged, even at a different commit", () => {
    const result = evaluateApplicability(record(), {
      inputSets: MATCHING_INPUTS,
      commit: OTHER_COMMIT,
    });
    expect(result.state).toBe("CURRENT");
  });

  it("is STALE when a declared input changed", () => {
    const result = evaluateApplicability(record(), {
      inputSets: { ...MATCHING_INPUTS, source: "s2" },
      commit: COMMIT,
    });
    expect(result.state).toBe("STALE");
    expect(result.changedInputs).toEqual(["source"]);
  });

  it("ignores inputs the evidence type does not declare", () => {
    const result = evaluateApplicability(record(), {
      inputSets: { ...MATCHING_INPUTS, docs: "changed" },
      commit: COMMIT,
    });
    expect(result.state).toBe("CURRENT");
  });

  it("is EXPIRED once the declared window has passed", () => {
    const result = evaluateApplicability(
      record({ evidence_type: "VULNERABILITY_SCAN", input_set: { manifest: "m", lockfile: "l" }, expires_at: "2026-08-21T00:00:00.000Z" }),
      { inputSets: { manifest: "m", lockfile: "l" }, at: "2026-09-01T00:00:00.000Z", commit: COMMIT },
    );
    expect(result.state).toBe("EXPIRED");
  });

  it("is SUPERSEDED when a successor is recorded", () => {
    const result = evaluateApplicability(record({ superseded_by: "EV-LATER" }), {
      inputSets: MATCHING_INPUTS,
      commit: COMMIT,
    });
    expect(result.state).toBe("SUPERSEDED");
  });

  it("is INAPPLICABLE across unrelated environments", () => {
    const result = evaluateApplicability(record(), {
      inputSets: MATCHING_INPUTS,
      environment: "production-future",
      commit: COMMIT,
    });
    expect(result.state).toBe("INAPPLICABLE");
  });

  it("preserves UNKNOWN rather than collapsing it into CURRENT or STALE", () => {
    const result = evaluateApplicability(record({ input_set: { source: "UNKNOWN" } }), {
      inputSets: MATCHING_INPUTS,
      commit: COMMIT,
    });
    expect(result.state).toBe("UNKNOWN");
  });

  it("requires a non-reusable type to be re-executed at the commit under review", () => {
    const result = evaluateApplicability(
      record({ evidence_type: "SECRET_SCAN", input_set: { tracked: "t1" } }),
      { inputSets: { tracked: "t1" }, commit: OTHER_COMMIT },
    );
    expect(result.state).toBe("STALE");
  });
});

describe("reuse contract", () => {
  it("states the seven conditions", () => {
    expect(REUSE_CONDITIONS).toHaveLength(7);
  });

  it("permits reuse only when every condition holds", () => {
    const result = evaluateReuse(record(), { inputSets: MATCHING_INPUTS, commit: OTHER_COMMIT });
    expect(result.reusable).toBe(true);
    expect(result.statement).toContain("It was not executed at the current commit.");
  });

  it("ends reuse when an open finding invalidates the record", () => {
    const result = evaluateReuse(record({ related_findings: ["FND-999"] }), {
      inputSets: MATCHING_INPUTS,
      commit: COMMIT,
      openFindings: ["FND-999"],
    });
    expect(result.reusable).toBe(false);
  });
});

describe("expiry policy", () => {
  it("declares a policy with a rationale for every evidence type", () => {
    for (const type of EVIDENCE_TYPES) {
      expect(EXPIRY_POLICY[type]).toBeDefined();
      expect(EXPIRY_POLICY[type].rationale.length).toBeGreaterThan(20);
      expect(EXPIRY_POLICY[type].invalidatedBy.length).toBeGreaterThan(10);
    }
  });

  it("gives deterministic checks no arbitrary clock", () => {
    expect(computeExpiry("BUILD", "2026-08-20T00:00:00.000Z")).toBeNull();
    expect(computeExpiry("TEST", "2026-08-20T00:00:00.000Z")).toBeNull();
  });

  it("bounds evidence that depends on an external feed", () => {
    const expiry = computeExpiry("VULNERABILITY_SCAN", "2026-08-20T00:00:00.000Z");
    expect(expiry).toBe("2026-08-27T00:00:00.000Z");
    expect(isExpired({ expires_at: expiry }, "2026-08-28T00:00:00.000Z")).toBe(true);
    expect(isExpired({ expires_at: expiry }, "2026-08-21T00:00:00.000Z")).toBe(false);
  });
});

describe("verification gate", () => {
  const inputSets = { ...MATCHING_INPUTS, tracked: "t1", manifest: "m", lockfile: "l1", routes: "r", config: "c1", workflows: "w", tests: "t", docs: "d", pipeline: "p" };

  function fullSet() {
    return [
      record({ evidence_id: "EV-BUILD", evidence_type: "BUILD", input_set: { source: "s1", config: "c1", lockfile: "l1" } }),
      record({ evidence_id: "EV-TEST", evidence_type: "TEST", input_set: { source: "s1", tests: "t", config: "c1", lockfile: "l1" } }),
      record({ evidence_id: "EV-PROV", evidence_type: "SOURCE_PROVENANCE", input_set: { tracked: "t1" } }),
      record({ evidence_id: "EV-DEPS", evidence_type: "DEPENDENCY_INVENTORY", input_set: { manifest: "m", lockfile: "l1" } }),
      record({ evidence_id: "EV-SBOM", evidence_type: "SBOM", input_set: { manifest: "m", lockfile: "l1" } }),
      record({ evidence_id: "EV-SECRET", evidence_type: "SECRET_SCAN", input_set: { tracked: "t1" } }),
      record({ evidence_id: "EV-PII", evidence_type: "PII_BOUNDARY_SCAN", input_set: { tracked: "t1" } }),
      record({ evidence_id: "EV-ROUTES", evidence_type: "ROUTE_INVENTORY", input_set: { routes: "r" } }),
      record({ evidence_id: "EV-CONFIG", evidence_type: "CONFIGURATION", input_set: { config: "c1", workflows: "w" } }),
    ];
  }

  const baseline = () => ({ input_set_digest: stableHash(inputSets), commit_sha: COMMIT });

  it("passes when the set is complete, applicable, and re-derived", () => {
    const result = verifyEvidenceSet({
      records: fullSet(),
      baseline: baseline(),
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.problems).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("fails when a required evidence type is missing", () => {
    const result = verifyEvidenceSet({
      records: fullSet().filter((entry) => entry.evidence_type !== "SBOM"),
      baseline: baseline(),
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join(" ")).toContain("SBOM");
  });

  it("fails when the baseline was not re-derived for the current inputs", () => {
    const result = verifyEvidenceSet({
      records: fullSet(),
      baseline: { input_set_digest: "stale-digest", commit_sha: COMMIT },
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join(" ")).toContain("Baseline is STALE");
  });

  it("does not fail merely because the baseline commit differs from HEAD", () => {
    const result = verifyEvidenceSet({
      records: fullSet(),
      baseline: { input_set_digest: stableHash(inputSets), commit_sha: OTHER_COMMIT },
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.ok).toBe(true);
    expect(result.notes.join(" ")).toContain("applicability is decided by input sets");
  });

  it("fails on a recorded failure", () => {
    const records = fullSet();
    records[0]!.status = "fail";
    const result = verifyEvidenceSet({
      records,
      baseline: baseline(),
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.ok).toBe(false);
  });

  it("records review-required and not-completed without failing the gate", () => {
    const records = fullSet();
    records[1]!.status = "review-required";
    records[2]!.status = "not-completed";
    const result = verifyEvidenceSet({
      records,
      baseline: baseline(),
      inputSets,
      commit: COMMIT,
      environment: "lovable-sandbox",
    });
    expect(result.ok).toBe(true);
    expect(result.notes.length).toBeGreaterThanOrEqual(2);
  });
});

describe("in-app pipeline contract", () => {
  it("gives every applicability state a plain-language meaning", () => {
    for (const state of APPLICABILITY_STATES) {
      expect(APPLICABILITY_MEANING[state].length).toBeGreaterThan(20);
    }
  });

  it("states both what each check supports and what it cannot", () => {
    for (const check of PIPELINE_CHECKS) {
      expect(check.supports.length).toBeGreaterThan(10);
      expect(check.doesNotSupport.length).toBeGreaterThan(10);
      expect(check.declaredInputs.length).toBeGreaterThan(0);
    }
  });

  it("keeps the surfaced checks aligned with the pipeline input declarations", () => {
    for (const check of PIPELINE_CHECKS) {
      const type = check.evidenceType as EvidenceType;
      expect(declaredSets(type).sort()).toEqual([...check.declaredInputs].sort());
      expect(isReusable(type)).toBe(check.reusable);
    }
  });

  it("records a residual limitation for every dispositioned finding", () => {
    for (const resolution of PIPELINE_FINDING_RESOLUTIONS) {
      expect(resolution.residual.length).toBeGreaterThan(20);
    }
  });

  it("refuses blended readiness scoring and self-closure", () => {
    const refusals = PIPELINE_REFUSALS.join(" ").toLowerCase();
    expect(refusals).toContain("percentage-complete");
    expect(refusals).toContain("closes a gate");
    expect(refusals).toContain("never rebound");
  });
});
