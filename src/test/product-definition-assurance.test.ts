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

  it("records the live route inventory rather than the historical manifest count", () => {
    const snapshot = readSnapshot();
    expect(snapshot.inventories.routes.registered).toBe(ROUTE_REGISTRY.length);
    expect(snapshot.inventories.routes.historical_manifest_rows).not.toBe(
      snapshot.inventories.routes.registered,
    );
  });

  it("reports no database and no personal data", () => {
    const snapshot = readSnapshot();
    expect(snapshot.inventories.persistence.backend).toContain("No database");
    expect(snapshot.inventories.persistence.personal_data).toContain("No personal data");
  });

  it("writes every generated document with its do-not-edit marker", () => {
    for (const name of GENERATED_DOCS) {
      const body = readFileSync(join(process.cwd(), DOC_DIR, name), "utf8");
      expect(body.startsWith("<!-- Generated by scripts/gen-wave0-snapshot.ts")).toBe(true);
    }
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
