/**
 * Fail-closed contradiction tests for the Product Alpha 001 closeout.
 *
 * These assert only that the canonical control plane, the generated projection,
 * and the current public copy agree with each other. They close nothing,
 * authorize nothing, and make no accessibility, security, privacy, usability,
 * educational, or release claim.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { DECISIONS, EVIDENCE, FINDINGS, WORKSPACES } from "@/fixtures";
import { PROGRAM_STATE } from "@/fixtures/program";
import { operatesNow } from "@/domain";
import { loadCheckpointRegister, loadProgramPolicy } from "@/lib/program-registry";
import { loadInputManifest } from "@/lib/current-state-fingerprint";

const root = process.cwd();
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const resolves = (relative: string) => existsSync(join(root, relative));

const policy = loadProgramPolicy();
const register = loadCheckpointRegister();
const readme = read("README.md");
const currentState = read("docs/CURRENT_STATE.md");
const appShell = read("src/components/app-shell.tsx");
const commandCenter = read("src/routes/index.tsx");

describe("checkpoint register resolves", () => {
  it("resolves every checkpoint document to a file", () => {
    const missing = register.checkpoints.filter((row) => !resolves(row.doc_path));
    expect(missing.map((row) => row.checkpoint_id)).toEqual([]);
  });

  it("resolves every attempt document to a file", () => {
    const missing = register.attempts.filter((row) => !resolves(row.doc_path));
    expect(missing.map((row) => row.attempt_id)).toEqual([]);
  });

  it("resolves every checkpoint evidence identifier to an evidence record", () => {
    const ids = new Set(EVIDENCE.map((record) => record.id));
    const unresolved = register.checkpoints
      .flatMap((row) => row.evidence_ids)
      .filter((id) => !ids.has(id));
    expect(unresolved).toEqual([]);
  });

  it("keeps CHECKPOINT-010 a Product Alpha implementation checkpoint that closes nothing", () => {
    const row = register.checkpoints.find((entry) => entry.checkpoint_id === "CHECKPOINT-010");
    expect(row?.evidence_ids).toContain("EV-046");
    expect(row?.closed_nothing ?? "").toMatch(/closed nothing/i);
    const doc = read("docs/product-alpha-001/CHECKPOINT-010.md");
    expect(doc).toMatch(/not WP-007 Cycle 9/);
    expect(doc).toMatch(/DEC-023/);
    expect(doc).toMatch(/EV-046/);
    for (const refusal of [
      /TTR-001 touch-target audit/,
      /founder usability/i,
      /workflow stability/i,
      /learning impact/i,
      /educational validity/i,
      /accessibility conformance/i,
      /privacy or security certification/i,
      /release, publication, production, pilot, or district readiness/i,
      /Gate A remains OPEN/,
      /WP-007 remains ACTIVE/,
    ]) {
      expect(doc).toMatch(refusal);
    }
  });

  it("keeps ATTEMPT-001 unable to deny the later unrelated Product Alpha checkpoint", () => {
    const attempt = register.attempts.find((row) => row.attempt_id === "ATTEMPT-001");
    expect(attempt?.state).toBe("ABORTED-DEFERRED");
    expect(attempt?.produced_no_evidence).not.toMatch(/there is no CHECKPOINT-010/i);
    expect(attempt?.produced_no_evidence).toMatch(/At the time of ATTEMPT-001/);
    expect(attempt?.produced_no_evidence).toMatch(
      /CHECKPOINT-010 is the unrelated Product Alpha 001 implementation checkpoint/,
    );
    expect(attempt?.produced_no_evidence).toMatch(/not touch-target audit evidence/);
  });
});

describe("one controlling decision across the control plane", () => {
  it("points policy, manifest, disposition, and next action at DEC-023", () => {
    expect(policy.controlling_decision).toBe("DEC-023");
    expect(loadInputManifest().controlling_decision).toBe("DEC-023");
    expect(PROGRAM_STATE.ownerDisposition.obligationSource.recordId).toBe("DEC-023");
    expect(PROGRAM_STATE.nextDefensibleOwnerAction.source.recordId).toBe("DEC-023");
    const latestAccepted = [...DECISIONS.filter((decision) => decision.state === "accepted")].sort(
      (a, b) =>
        (a.decidedOn ?? "") === (b.decidedOn ?? "")
          ? a.id.localeCompare(b.id)
          : (a.decidedOn ?? "").localeCompare(b.decidedOn ?? ""),
    );
    expect(latestAccepted.at(-1)?.id).toBe("DEC-023");
  });

  it("resolves every file-backed owner-supporting source", () => {
    const fileBacked = policy.owner_disposition_supporting_sources.filter((source) =>
      /\.(md|json|ts)$/.test(source.locator),
    );
    expect(fileBacked.length).toBeGreaterThan(0);
    expect(fileBacked.filter((source) => !resolves(source.locator)).map((s) => s.locator)).toEqual(
      [],
    );
  });

  it("resolves every register-backed owner-supporting source to a record", () => {
    const known = new Set([
      ...EVIDENCE.map((record) => record.id),
      ...FINDINGS.map((record) => record.id),
      ...DECISIONS.map((record) => record.id),
      ...register.checkpoints.map((row) => row.checkpoint_id),
      "TTR-001",
      "PUBLICATION-ACCESS",
      "PRODUCT-ALPHA-001-ENTRY",
    ]);
    const unresolved = policy.owner_disposition_supporting_sources
      .map((source) => source.record_id)
      .filter((id) => !known.has(id));
    expect(unresolved).toEqual([]);
  });

  it("keeps supporting-source identifiers unique", () => {
    const ids = policy.owner_disposition_supporting_sources.map((source) => source.record_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not imply that the TTR-001 audit is now authorized", () => {
    const next = `${PROGRAM_STATE.nextDefensibleOwnerAction.action} ${PROGRAM_STATE.nextDefensibleOwnerAction.why}`;
    expect(next).toMatch(/separately authorized TTR-001 audit/);
    expect(next).toMatch(/mechanics only/);
    for (const phrase of [
      /usefulness/,
      /workflow stability/,
      /learning impact/,
      /educational validity/,
      /accessibility conformance/,
      /privacy or security certification/,
      /human validation/,
    ]) {
      expect(next).toMatch(phrase);
    }
    expect(next).not.toMatch(/audit is authorized/i);
  });
});

describe("posture that must not have moved", () => {
  it("keeps Gate A open and WP-007 active", () => {
    expect(PROGRAM_STATE.gate.state).toBe("open");
    expect(PROGRAM_STATE.activeWorkPackage.workPackageId).toBe("WP-007");
    expect(PROGRAM_STATE.activeWorkPackage.state).toBe("active");
  });

  it("keeps WP-039, Cycle 9, and a Product Alpha expansion unauthorized", () => {
    const stages = Object.fromEntries(
      policy.unauthorized_stages.map((stage) => [stage.stage_id, stage.statement]),
    );
    expect(stages["WP-039"]).toMatch(/not authorized/i);
    expect(stages["CYCLE-8"]).toMatch(/No Cycle 9 is authorized/i);
    expect(stages["PRODUCT-ALPHA-001-SCOPE"]).toMatch(/PRODUCT-ALPHA-001-EXPANSION/);
    expect(stages["PRODUCT-ALPHA-001-SCOPE"]).toMatch(/not a WP-007 cycle/i);
    expect(stages["RUNTIME-TRUST-SPINE"]).toMatch(/No backend, authentication, database/i);
  });

  it("keeps FND-024 blocked and EV-003 not-run as visible deferred debt", () => {
    expect(FINDINGS.find((record) => record.id === "FND-024")?.resolutionState).toBe("blocked");
    expect(EVIDENCE.find((record) => record.id === "EV-003")?.state).toBe("not-run");
    expect(PROGRAM_STATE.auditExecution.state).toBe("NOT-RUN");
    const debt = PROGRAM_STATE.deferredDebt.map((entry) => entry.recordId);
    expect(debt).toEqual(expect.arrayContaining(["FND-024", "EV-003"]));
  });

  it("keeps FND-014 discharged historically and absent from deferred debt", () => {
    const finding = FINDINGS.find((record) => record.id === "FND-014");
    expect(finding?.resolutionState).toBe("confirmed");
    expect(finding?.evidenceReferences).toContain("EV-045");
    expect(PROGRAM_STATE.deferredDebt.map((entry) => entry.recordId)).not.toContain("FND-014");
  });

  it("keeps HREQ-025 and TTR-001 unchanged", () => {
    const requirements = JSON.parse(read("data/historical/historical-requirements.json")) as {
      records: { requirement_id: string; disposition: string; conformance_state: string }[];
    };
    const hreq = requirements.records.find((row) => row.requirement_id === "HREQ-025");
    expect(hreq?.conformance_state).toBe("NOT-ASSESSED");
    expect(hreq?.disposition).toBe("CANDIDATE-PRE-DISPOSITION");
    expect(read("data/accessibility/touch-target-rule.json")).toMatch(/"NOT-RUN"/);
  });

  it("keeps the publication boundary a public synthetic prototype that is not released", () => {
    expect(PROGRAM_STATE.publicationBoundary).toMatch(/PUBLIC SYNTHETIC PROTOTYPE/);
    expect(PROGRAM_STATE.publicationBoundary).toMatch(/NOT RELEASED/);
    expect(currentState).toMatch(/PUBLIC SYNTHETIC PROTOTYPE/);
  });
});

describe("current copy tells the truth about Product Alpha 001", () => {
  const copy = [readme, appShell, commandCenter].join("\n");

  it("no longer says Product Alpha is not started or has no runtime persistence", () => {
    expect(copy).not.toMatch(/Product Alpha 001 is NOT STARTED/i);
    expect(copy).not.toMatch(/No runtime persistence/i);
    expect(copy).not.toMatch(/nothing in this repository anticipates its\s+schema/i);
    expect(commandCenter).not.toMatch(/Not authorized, and not started/);
    expect(commandCenter).toMatch(/Not authorized beyond this proof/);
  });

  it("states the browser-local synthetic persistence boundary in the README", () => {
    expect(readme).toMatch(/browser-local/i);
    expect(readme).toMatch(/clearing browser storage loses/i);
    expect(readme).toMatch(/not released, not\s+validated, and not certified/i);
    expect(readme).toMatch(/founder\/operator walkthrough/i);
  });

  it("keeps the shell footer bounded and derived, with no parallel truth constant", () => {
    expect(appShell).toMatch(/PROGRAM_STATE\.publicationBoundary/);
    expect(appShell).toMatch(/PRODUCT-ALPHA-001-SCOPE/);
    expect(appShell).toMatch(/bounded local synthetic proof/);
    expect(appShell.replace(/\s+/g, " ")).toMatch(/not backed up, shared, or\s?synchronized/);
    expect(appShell).toMatch(/not production ready/i);
  });

  it("still refuses backend, auth, database, RLS, AI, integrations, real data, and successors", () => {
    for (const phrase of [/backend/i, /authentication/i, /RLS/, /AI/, /integrations/i, /PII/]) {
      expect(readme).toMatch(phrase);
    }
    expect(readme).toMatch(/No expansion beyond\s+this exact local synthetic proof is authorized/i);
    expect(readme).toMatch(/TTR-001 is NOT-RUN/);
  });
});

describe("workspace breakdown is mechanical", () => {
  const count = (state: string) =>
    WORKSPACES.filter((workspace) => workspace.implementationState === state).length;

  it("counts 2 implemented, 3 partially implemented, and 4 gated or specification-only", () => {
    expect(WORKSPACES).toHaveLength(9);
    expect(count("implemented")).toBe(2);
    expect(count("partially-implemented")).toBe(3);
    expect(count("specified-only") + count("not-started")).toBe(4);
    expect(count("implemented") + count("partially-implemented")).toBe(5);
  });

  it("counts 5 current operating projections from the register", () => {
    expect(WORKSPACES.filter(operatesNow)).toHaveLength(5);
  });

  it("does not promote a workspace because a product route exists", () => {
    const product = WORKSPACES.find((workspace) =>
      /product/i.test(workspace.name),
    )?.implementationState;
    expect(product).not.toBe("implemented");
    expect(read("src/routes/workspaces.index.tsx")).not.toMatch(/\b(?:2|3|4|5|9) of 9\b/);
  });
});

describe("identifiers stay unique", () => {
  it("keeps checkpoint and attempt identifiers unique and disjoint", () => {
    const ids = [
      ...register.checkpoints.map((row) => row.checkpoint_id),
      ...register.attempts.map((row) => row.attempt_id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps decision, finding, and evidence identifiers unique", () => {
    for (const records of [DECISIONS, FINDINGS, EVIDENCE]) {
      const ids = records.map((record) => record.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
