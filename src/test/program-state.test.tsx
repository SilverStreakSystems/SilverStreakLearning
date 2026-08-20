/**
 * Projection-accuracy and boundary tests for the two synchronized surfaces.
 *
 * These assert that the Command Center and the Action Center report the
 * canonical post-Cycle-3 state, that they read it from the structured
 * registers rather than from component text, and that neither surface makes a
 * claim the current posture does not support.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderRoute } from "./render-route";
import { PROGRAM_STATE } from "@/fixtures/program";
import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures";
import {
  loadInputManifest,
  undeclaredSupersededDocuments,
  unresolvedInputs,
} from "@/lib/current-state-fingerprint";
import { loadCheckpointRegister } from "@/lib/program-registry";
import { validateProgramState } from "@/domain/program-state";
import { compareActions } from "@/domain";
import { buildActions } from "@/lib/workspace-queries";
import {
  currentReferencePackage,
  unresolvedDriftRows,
  verifiedDigestArtifacts,
} from "@/lib/package-projection";
import { loadGovernedPackageFile, loadPackageDriftFile } from "@/lib/governed-package-registry";

describe("program state register", () => {
  it("is structurally valid and makes no prohibited claim", () => {
    expect(validateProgramState(PROGRAM_STATE)).toEqual([]);
  });

  it("records Gate A open, WP-007 active, and the latest owner disposition", () => {
    expect(PROGRAM_STATE.gate.gateId).toBe("GATE-A");
    expect(PROGRAM_STATE.gate.state).toBe("open");
    expect(PROGRAM_STATE.activeWorkPackage.workPackageId).toBe("WP-007");
    expect(PROGRAM_STATE.activeWorkPackage.state).toBe("active");
    expect(PROGRAM_STATE.latestCheckpoint.checkpointId).toBe("CHECKPOINT-009");
    expect(PROGRAM_STATE.ownerDisposition.state).toBe("accepted");
  });

  it("binds every verification statement to a checkpoint and states its scope", () => {
    expect(PROGRAM_STATE.verifications.length).toBeGreaterThan(0);
    for (const entry of PROGRAM_STATE.verifications) {
      expect(entry.boundTo).toContain("CHECKPOINT-00");
      expect(entry.scope.length).toBeGreaterThan(20);
    }
  });

  it("states WP-039, a further cycle, and candidate disposition as not authorized", () => {
    const ids = PROGRAM_STATE.unauthorizedStages.map((entry) => entry.stageId);
    expect(ids).toContain("WP-039");
    expect(ids).toContain("CYCLE-8");
    expect(ids).toContain("TOUCH-TARGET-AUDIT");
    expect(ids).toContain("HREQ-IMPLEMENTATION");
    expect(ids).toContain("RUNTIME-TRUST-SPINE");
  });
});

describe("program state is derived, not restated", () => {
  it("computes gate and work-package state from the decision register", () => {
    const accepted = DECISIONS.filter((decision) => decision.state === "accepted");
    const closureText = accepted
      .flatMap((decision) => [decision.decision, ...decision.consequences])
      .join(" ")
      .toLowerCase();
    expect(closureText.includes("gate a is closed")).toBe(false);
    expect(PROGRAM_STATE.gate.state).toBe("open");
    expect(closureText.includes("wp-007 is closed")).toBe(false);
    expect(PROGRAM_STATE.activeWorkPackage.state).toBe("active");
  });

  it("takes the latest checkpoint and the latest attempt from the checkpoint register", () => {
    const register = loadCheckpointRegister();
    const latest = [...register.checkpoints]
      .sort((a, b) =>
        a.completed_on === b.completed_on
          ? a.checkpoint_id.localeCompare(b.checkpoint_id)
          : a.completed_on.localeCompare(b.completed_on),
      )
      .at(-1);
    expect(PROGRAM_STATE.latestCheckpoint.checkpointId).toBe(latest?.checkpoint_id);
    expect(PROGRAM_STATE.latestAttempt?.attemptId).toBe("ATTEMPT-001");
    expect(PROGRAM_STATE.latestAttempt?.state).toBe("ABORTED-DEFERRED");
    expect(PROGRAM_STATE.latestAttempt?.producedNoEvidence).toMatch(/No audit artifact exists/);
  });

  it("takes the owner disposition from the latest accepted decision", () => {
    const accepted = [...DECISIONS.filter((decision) => decision.state === "accepted")].sort(
      (a, b) =>
        (a.decidedOn ?? "") === (b.decidedOn ?? "")
          ? a.id.localeCompare(b.id)
          : (a.decidedOn ?? "").localeCompare(b.decidedOn ?? ""),
    );
    const latest = accepted.at(-1);
    expect(PROGRAM_STATE.ownerDisposition.obligationSource.recordId).toBe(latest?.id);
    expect(PROGRAM_STATE.ownerDisposition.subject).toBe(latest?.title);
  });

  it("takes every bound verification from the evidence register", () => {
    for (const entry of PROGRAM_STATE.verifications) {
      const record = EVIDENCE.find((row) => row.id === entry.verificationId);
      expect(record).toBeDefined();
      expect(entry.statement).toBe(record?.supports);
      expect(entry.scope).toBe(record?.doesNotSupport);
    }
  });

  it("derives the audit execution state from FND-024 and keeps it NOT-RUN", () => {
    expect(FINDINGS.find((record) => record.id === "FND-024")?.resolutionState).toBe("blocked");
    expect(PROGRAM_STATE.auditExecution.state).toBe("NOT-RUN");
    expect(PROGRAM_STATE.auditExecution.ruleId).toBe("TTR-001");
  });

  it("keeps EV-003 not-run and FND-024 open as visible deferred debt", () => {
    const debt = PROGRAM_STATE.deferredDebt.map((entry) => entry.recordId);
    expect(debt).toContain("FND-024");
    expect(debt).toContain("EV-003");
  });

  it("states the publication boundary as a public, not access-controlled, prototype", () => {
    expect(PROGRAM_STATE.publicationBoundary).toMatch(/PUBLIC SYNTHETIC PROTOTYPE/);
    expect(PROGRAM_STATE.publicationBoundary).toMatch(/not access-controlled/);
    expect(PROGRAM_STATE.publicationBoundary).toMatch(/NOT RELEASED/);
    expect(PROGRAM_STATE.publicationBoundary).not.toMatch(/private operator workspace/i);
  });

  it("no longer leads with the deferred audit as the next action", () => {
    expect(PROGRAM_STATE.nextDefensibleOwnerAction.source.recordId).toBe("DEC-022");
    expect(PROGRAM_STATE.nextDefensibleOwnerAction.action).toMatch(
      /engineering baseline.*synthetic product vertical slice/i,
    );
    expect(PROGRAM_STATE.nextDefensibleOwnerAction.why).toMatch(/FND-024 stays open/);
  });
});

describe("canonical current-state projection", () => {
  it("declares controlling inputs that all resolve", () => {
    const manifest = loadInputManifest();
    expect(manifest.inputs.length).toBeGreaterThan(5);
    expect(unresolvedInputs(manifest)).toEqual([]);
  });

  it("regenerates with no diff and matches the recorded input fingerprint", () => {
    const check = spawnSync("bun", ["scripts/gen-current-state.ts", "--check"], {
      encoding: "utf8",
    });
    expect(check.stdout).toContain("PASS");
    expect(check.status).toBe(0);
  });

  it("binds freshness to an input fingerprint, not to a commit hash", () => {
    const doc = readFileSync(join(process.cwd(), "docs/CURRENT_STATE.md"), "utf8");
    expect(doc).toContain("GENERATED");
    expect(doc).toContain("Input fingerprint");
    expect(/\b[0-9a-f]{40}\b/.test(doc)).toBe(false);
  });

  it("keeps every superseded current-state document marked superseded", () => {
    const manifest = loadInputManifest();
    expect(undeclaredSupersededDocuments(manifest)).toEqual([]);
  });
});

describe("governed package projection", () => {
  it("reads the same bytes as the filesystem registry, so there is one register", () => {
    expect(currentReferencePackage()?.package_id).toBe(
      loadGovernedPackageFile().records.find(
        (record) => record.authority_role === "SYNCHRONIZED-REFERENCE",
      )?.package_id,
    );
    expect(unresolvedDriftRows().map((row) => row.drift_id)).toEqual(
      loadPackageDriftFile()
        .drift.filter((row) => row.disposition === "UNRESOLVED")
        .map((row) => row.drift_id),
    );
  });

  it("keeps PKG-002 a noncanonical synchronized reference with verified digests", () => {
    const record = currentReferencePackage();
    expect(record?.package_id).toBe("PKG-002");
    expect(record?.canonical_status).toBe("NONCANONICAL");
    expect(verifiedDigestArtifacts().length).toBeGreaterThan(0);
  });

  it("carries six unresolved drift rows", () => {
    expect(unresolvedDriftRows()).toHaveLength(6);
    expect(unresolvedDriftRows().map((row) => row.drift_id)).toContain("PDR-006");
  });
});

describe("Action Center synchronization", () => {
  it("drops the discharged FND-022 and FND-023 obligations and carries FND-024 instead", () => {
    const actions = buildActions();
    for (const discharged of ["FND-022", "FND-023"]) {
      expect(
        actions.filter((action) => action.canonicalSource.objectId === discharged),
      ).toHaveLength(0);
    }
    const matches = actions.filter((action) => action.canonicalSource.objectId === "FND-024");
    expect(matches).toHaveLength(1);
  });

  it("claims no owner directive for FND-024, which no decision confers", () => {
    const actions = buildActions();
    const fnd024 = actions.find((action) => action.canonicalSource.objectId === "FND-024");
    expect(fnd024?.ownerPriorityDirective ?? null).toBeNull();
    // Ordering is therefore the factor order alone, with nothing lifted above it.
    expect(actions.map((action) => action.canonicalSource.objectId)).toEqual(
      [...actions].sort(compareActions).map((action) => action.canonicalSource.objectId),
    );
  });

  it("prints the unrun touch-target verification obligation on the Action Center", async () => {
    await renderRoute("/actions");
    expect(
      screen.getAllByText(
        /touch-target acceptance rule TTR-001 is defined but has never been executed against the interface/,
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/\[OWNER-DIRECTED FIRST\]/)).not.toBeInTheDocument();
  });
});

describe("Command Center synchronization", () => {
  it("projects gate, work package, checkpoint, and pending disposition", async () => {
    await renderRoute("/");
    const region = await screen.findByRole("region", { name: /Current governed state/i });
    expect(within(region).getAllByText(/Gate A/).length).toBeGreaterThan(0);
    expect(within(region).getAllByText(/OPEN/).length).toBeGreaterThan(0);
    expect(within(region).getAllByText(/WP-007/).length).toBeGreaterThan(0);
    expect(
      within(region).getAllByText(/CHECKPOINT-009: execution complete/).length,
    ).toBeGreaterThan(0);
    expect(within(region).getAllByText(/ACCEPTED/).length).toBeGreaterThan(0);
    expect(
      within(region).getAllByText(/Cycle 7 closed nothing beyond the FND-023 definition gap/)
        .length,
    ).toBeGreaterThan(0);
  });

  it("projects the package authority role, digest verification, and drift count", async () => {
    await renderRoute("/");
    const pkg = await screen.findByRole("region", { name: /Governed reference package/i });
    expect(within(pkg).getByText(/SYNCHRONIZED-REFERENCE/)).toBeInTheDocument();
    expect(within(pkg).getByText(/NONCANONICAL/)).toBeInTheDocument();
    expect(within(pkg).getByText(/establishes file identity only/i)).toBeInTheDocument();
    expect(await screen.findByRole("region", { name: /6 unresolved/i })).toBeInTheDocument();
  });

  it("states what is not authorized and what hosting does not mean", async () => {
    await renderRoute("/");
    const region = await screen.findByRole("region", { name: /Not authorized, and not started/i });
    expect(within(region).getByText(/WP-039 is not authorized/)).toBeInTheDocument();
    const boundary = await screen.findByRole("region", {
      name: /What hosting this application means/i,
    });
    expect(
      within(boundary).getAllByText(/does not constitute release authority/i).length,
    ).toBeGreaterThan(0);
  });

  it("leads the next defensible action with baseline recovery, not the deferred audit", async () => {
    await renderRoute("/");
    const region = await screen.findByRole("region", { name: /Next defensible action/i });
    expect(within(region).getByText(/1\. Recover the engineering baseline/)).toBeInTheDocument();
  });

  it("shows the aborted Cycle 8 attempt as an attempt, never as a checkpoint", async () => {
    await renderRoute("/");
    const region = await screen.findByRole("region", { name: /Current governed state/i });
    expect(within(region).getAllByText(/ATTEMPT-001: attempt, not a checkpoint/).length).toBe(1);
    expect(within(region).getAllByText(/ABORTED-DEFERRED/).length).toBeGreaterThan(0);
    expect(within(region).getAllByText(/No audit artifact exists/).length).toBeGreaterThan(0);
    expect(within(region).getAllByText(/NOT-RUN/).length).toBeGreaterThan(0);
    // CHECKPOINT-010 may appear only where it is explicitly denied.
    for (const node of screen.queryAllByText(/CHECKPOINT-010/)) {
      expect(node.textContent).toMatch(/no CHECKPOINT-010/);
    }
  });

  it("makes no release, production, certification, or district-use claim", async () => {
    const { container } = await renderRoute("/");
    // The refused-claims section names these phrases in order to refuse them.
    // Everything outside it must not state them at all.
    const refused = container.querySelector("#claims");
    refused?.remove();
    const text = container.textContent?.toLowerCase() ?? "";
    for (const phrase of [
      "production ready",
      "district validated",
      "certified",
      "independently validated",
      "release authorized",
      "wp-039 is authorized",
    ]) {
      // The phrase may appear only where it is explicitly negated or refused.
      let index = text.indexOf(phrase);
      while (index !== -1) {
        const preceding = text.slice(Math.max(0, index - 120), index);
        expect([phrase, /(not|no|never|neither|refused)[^.]*$/.test(preceding)]).toEqual([
          phrase,
          true,
        ]);
        index = text.indexOf(phrase, index + 1);
      }
    }
  });
});

describe("single source of truth", () => {
  it("keeps the open obligation on the findings register, not on the surfaces", () => {
    for (const id of ["FND-022", "FND-023"]) {
      expect(FINDINGS.find((record) => record.id === id)?.resolutionState).toBe("confirmed");
    }
    const finding = FINDINGS.find((record) => record.id === "FND-024");
    expect(finding?.resolutionState).toBe("blocked");
    expect(PROGRAM_STATE.ownerDisposition.obligationSource.recordId).toBe("DEC-022");
    expect(PROGRAM_STATE.deferredDebt.some((entry) => entry.recordId === finding?.id)).toBe(true);
  });
});
