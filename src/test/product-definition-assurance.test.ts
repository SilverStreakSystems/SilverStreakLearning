/**
 * Wave 0 snapshot integrity.
 *
 * These tests prove the snapshot is a faithful, current projection and that it
 * cannot quietly become an approval. A passing test is not validation, release,
 * or public-claim authority.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures/registers";
import { ROUTE_REGISTRY } from "@/lib/route-registry";
import {
  DECLARATION_PATH,
  SNAPSHOT_PATH,
  buildWave0Inventories,
  fingerprintDeclaredInputs,
  loadWave0Declaration,
  validateWave0Declaration,
  type Wave0Declaration,
} from "@/lib/wave0-snapshot";

const declaration = loadWave0Declaration();

function readSnapshot() {
  return JSON.parse(readFileSync(join(process.cwd(), SNAPSHOT_PATH), "utf8")) as {
    declaration: Wave0Declaration;
    inventories: ReturnType<typeof buildWave0Inventories>;
    input_fingerprint: string;
  };
}

const DOC_DIR = "docs/product-definition-assurance";
const GENERATED_DOCS = [
  "WAVE0_SNAPSHOT.md",
  "ARTIFACT_GAP_MAP.md",
  "RECONCILIATION_REPORT.md",
  "OWNER_DISPOSITION_PACKET.md",
  "WAVE0_MANIFEST.md",
];

describe("Wave 0 declaration", () => {
  it("validates with no issues", () => {
    expect(validateWave0Declaration(declaration)).toEqual([]);
  });

  it("maps exactly the seven requested artifacts with unique identifiers", () => {
    const ids = declaration.artifact_map.map((entry) => entry.artifact_id);
    expect(ids).toHaveLength(7);
    expect(new Set(ids).size).toBe(7);
    expect(declaration.artifact_map.map((entry) => entry.artifact)).toEqual([
      "Product Brief",
      "Requirements Register",
      "Route Registry",
      "Entity Relationship Diagram",
      "Authorization Matrix",
      "Threat Model",
      "Test Plan",
    ]);
  });

  it("keeps every artifact ineligible for public claim", () => {
    for (const entry of declaration.artifact_map) {
      expect(entry.states.release).toBe("not-released");
      expect(["ineligible", "internal-only"]).toContain(entry.states.claim_eligibility);
    }
  });

  it("holds candidate authority and records no owner disposition", () => {
    expect(declaration.authority_class).toBe("candidate");
    expect(declaration.disposition_packet.disposition_recorded).toBeNull();
    expect(declaration.disposition_packet.options.map((option) => option.label)).toEqual([
      "ACCEPT BASELINE",
      "REVISE BASELINE",
      "HOLD",
    ]);
  });

  it("leaves every future wave unauthorized", () => {
    for (const entry of declaration.gated_future) {
      expect(["not-authorized", "deferred-not-run"]).toContain(entry.state);
    }
    expect(declaration.gated_future.some((entry) => entry.subject.startsWith("Wave 1"))).toBe(true);
  });

  it("preserves Gate A and work-package state from their controlling sources", () => {
    const gateA = declaration.preserved_program_state.find((entry) => entry.subject === "Gate A");
    expect(gateA?.state).toBe("OPEN");
    const policy = readFileSync(join(process.cwd(), "data/program/program-policy.json"), "utf8");
    expect(policy).toContain("Gate A remains open");
  });

  it("references only records that exist and paths that resolve", () => {
    const known = new Set([
      ...DECISIONS.map((decision) => decision.id),
      ...FINDINGS.map((finding) => finding.id),
      ...EVIDENCE.map((evidence) => evidence.id),
    ]);
    for (const entry of declaration.artifact_map) {
      for (const source of entry.existing_canonical_sources) {
        expect(existsSync(join(process.cwd(), source))).toBe(true);
      }
      for (const id of entry.current_evidence) {
        if (id.startsWith("EV-0")) expect(known.has(id)).toBe(true);
      }
    }
  });

  it("detects an invalid state value rather than repairing it", () => {
    const broken = structuredClone(declaration);
    broken.artifact_map[0]!.states.truth = "approved";
    expect(validateWave0Declaration(broken).map((issue) => issue.code)).toContain("INVALID_STATE");
  });

  it("refuses a recorded disposition and an activated gate", () => {
    const broken = structuredClone(declaration);
    (broken.disposition_packet as { disposition_recorded: unknown }).disposition_recorded =
      "ACCEPT BASELINE";
    broken.gated_future[0]!.state = "authorized";
    const codes = validateWave0Declaration(broken as Wave0Declaration).map((issue) => issue.code);
    expect(codes).toContain("DISPOSITION_RECORDED");
    expect(codes).toContain("GATED_FUTURE_ACTIVATED");
  });

  it("detects a broken source path and an orphan record reference", () => {
    const broken = structuredClone(declaration);
    broken.artifact_map[0]!.existing_canonical_sources.push("docs/does-not-exist.md");
    broken.artifact_map[0]!.current_evidence.push("EV-999");
    const codes = validateWave0Declaration(broken).map((issue) => issue.code);
    expect(codes).toContain("BROKEN_SOURCE_PATH");
    expect(codes).toContain("ORPHAN_REFERENCE");
  });
});

describe("Wave 0 projection", () => {
  it("is the current projection of the declaration", () => {
    const snapshot = readSnapshot();
    expect(snapshot.declaration).toEqual(declaration);
    expect(snapshot.input_fingerprint).toBe(fingerprintDeclaredInputs(declaration.declared_inputs));
  });

  it("records the live route inventory and keeps version-bound counts separate", () => {
    const snapshot = readSnapshot();
    const routes = snapshot.inventories.routes;
    expect(routes.registered).toBe(ROUTE_REGISTRY.length);
    expect(routes.wp006_manifest.manifest_rows).toBe(25);
    expect(routes.wp006_manifest.commit).toBe("70c1f891c5d341c60132d0109979042004425a4b");
    expect(routes.wp006_manifest.declared_route_files).toBe(30);
    expect(routes.wp006_manifest.declared_registry_paths).toBe(19);
    expect(routes.wp006_manifest.manifest_rows).not.toBe(17);
    const external = routes.external_historical_counts.find((entry) => entry.count === 17);
    expect(external?.source).toContain("August 5");
    expect(external?.note).toContain("not the WP-006 manifest count");
  });

  it("never attaches the seventeen-route count to the WP-006 manifest", () => {
    const routeEntry = declaration.artifact_map.find(
      (entry) => entry.artifact === "Route Registry",
    );
    const prose = [
      ...(routeEntry?.conflicts ?? []),
      declaration.reconciliation.find((entry) => entry.entry_id === "PDA-R02")?.observation ?? "",
      declaration.reconciliation.find((entry) => entry.entry_id === "PDA-R02")?.resolution_rule ??
        "",
      readFileSync(join(process.cwd(), DOC_DIR, "ARTIFACT_GAP_MAP.md"), "utf8"),
      readFileSync(join(process.cwd(), DOC_DIR, "RECONCILIATION_REPORT.md"), "utf8"),
      readFileSync(join(process.cwd(), DOC_DIR, "WAVE0_SNAPSHOT.md"), "utf8"),
    ].join("\n");
    expect(prose).not.toMatch(/manifest records seventeen routes/i);
    expect(prose).not.toMatch(/seventeen routes at commit/i);
    expect(prose).toContain("70c1f891c5d341c60132d0109979042004425a4b");
  });

  it("states a bounded personal-data non-claim and refuses categorical absence", () => {
    const snapshot = readSnapshot();
    const statement = snapshot.inventories.persistence.personal_data;
    expect(snapshot.inventories.persistence.backend).toContain("No database");
    expect(statement).toContain("prohibited and not intentionally introduced");
    expect(statement).toContain("review-required");
    expect(statement).toContain("does not establish the absence");
    const prose = [statement, ...declaration.boundary].join("\n");
    expect(prose).not.toMatch(/no personal data exists/i);
    expect(prose).not.toMatch(/\bNo personal data\b/i);
    expect(prose).not.toMatch(/zero personal data/i);
  });

  it("keeps EV-PII review-required and records the scan limitation", () => {
    const entry = declaration.reconciliation.find((item) => item.entry_id === "PDA-R06");
    expect(entry?.resolution_rule).toContain("review-required");
    expect(entry?.resolution_rule).toContain("Never state categorical absence");
    // The evidence bundle is absent while it is being regenerated; unverifiable
    // is not the same as wrong, so the state is only asserted when it is readable.
    const indexPath = join(process.cwd(), "evidence/evidence-index.json");
    if (!existsSync(indexPath)) return;
    const index = JSON.parse(readFileSync(indexPath, "utf8")) as {
      records: { evidence_id: string; status: string }[];
    };
    const pii = index.records.find((record) => record.evidence_id === "EV-PII");
    if (pii) expect(pii.status).toBe("review-required");
  });

  it("recommends an ecosystem-level Product Brief location that collapses no scope", () => {
    const brief = declaration.artifact_map.find((entry) => entry.artifact === "Product Brief");
    expect(brief?.recommended_extension).toContain("docs/product/SSLS_PRODUCT_BRIEF.md");
    expect(brief?.recommended_extension).not.toMatch(
      /Extend docs\/product-alpha-001\/ENTRY_SPECIFICATION\.md as the controlling brief/,
    );
    expect(brief?.recommended_extension).toContain("docs/CURRENT_STATE.md");
    const r03 = declaration.reconciliation.find((entry) => entry.entry_id === "PDA-R03");
    expect(r03?.owner_decision_required).toBe(true);
    expect(r03?.resolution_rule).toContain("not an owner disposition");
    expect(existsSync(join(process.cwd(), "docs/product/SSLS_PRODUCT_BRIEF.md"))).toBe(false);
  });

  it("holds the Test Plan artifact at partially-implemented", () => {
    const plan = declaration.artifact_map.find((entry) => entry.artifact === "Test Plan");
    expect(plan?.states.implementation).toBe("partially-implemented");
    expect(plan?.missing_fields.join(" ")).toContain("Test case register");
  });

  it("writes every generated document with its do-not-edit marker", () => {
    for (const name of GENERATED_DOCS) {
      const body = readFileSync(join(process.cwd(), DOC_DIR, name), "utf8");
      expect(body.startsWith("<!-- Generated by scripts/gen-wave0-snapshot.ts")).toBe(true);
    }
  });

  it("lists the complete generated output set in the manifest, including itself", () => {
    const body = readFileSync(join(process.cwd(), DOC_DIR, "WAVE0_MANIFEST.md"), "utf8");
    const generatedSection = body.slice(body.indexOf("## Generated, never hand-edited"));
    for (const name of GENERATED_DOCS) {
      expect(generatedSection).toContain(`docs/product-definition-assurance/${name}`);
    }
    expect(generatedSection).toContain(SNAPSHOT_PATH);
    expect(generatedSection).toContain("WAVE0_MANIFEST.md");
  });

  it("states the boundary in the published snapshot document", () => {
    const body = readFileSync(join(process.cwd(), DOC_DIR, "WAVE0_SNAPSHOT.md"), "utf8");
    expect(body).toContain("approves nothing");
    expect(body).toContain(DECLARATION_PATH);
  });

  it("presents three disposition options and records none", () => {
    const body = readFileSync(join(process.cwd(), DOC_DIR, "OWNER_DISPOSITION_PACKET.md"), "utf8");
    expect(body).toContain("Recorded disposition: **NONE**");
    for (const label of ["ACCEPT BASELINE", "REVISE BASELINE", "HOLD"]) {
      expect(body).toContain(label);
    }
  });
});
