/**
 * Projection-accuracy and boundary tests for the two synchronized surfaces.
 *
 * These assert that the Command Center and the Action Center report the
 * canonical post-Cycle-3 state, that they read it from the structured
 * registers rather than from component text, and that neither surface makes a
 * claim the current posture does not support.
 */
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderRoute } from "./render-route";
import { PROGRAM_STATE } from "@/fixtures/program";
import { FINDINGS } from "@/fixtures";
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

  it("records Gate A open, WP-007 active, and the Cycle 4 disposition recorded", () => {
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

  it("leads the next defensible action with the unrun touch-target verification", async () => {
    await renderRoute("/");
    const region = await screen.findByRole("region", { name: /Next defensible action/i });
    expect(
      within(region).getByText(/1\. The touch-target acceptance rule TTR-001 is defined/),
    ).toBeInTheDocument();
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
    expect(PROGRAM_STATE.ownerDisposition.obligationSource.recordId).toBe("DEC-021");
    expect(PROGRAM_STATE.nextDefensibleOwnerAction.action).toBe(finding?.title);
  });
});
