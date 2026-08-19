import type { ProgramStateRecord } from "@/domain/program-state";

/**
 * The canonical in-application program-state record.
 *
 * Every value below reports a record that already exists somewhere else and
 * names its locator. This register creates no state of its own: it does not
 * open or close a gate, does not close a work package, does not record an
 * owner disposition, and does not authorize a successor work package.
 */
export const PROGRAM_STATE: ProgramStateRecord = {
  stateDate: "2026-08-19",
  gate: {
    gateId: "GATE-A",
    name: "Gate A",
    state: "open",
    basis:
      "Gate A remains open. No cycle, checkpoint, test result, or package registration closes a gate; only a recorded owner decision does.",
    source: {
      recordId: "DEC-018",
      locator: "src/fixtures/registers.ts — DECISIONS, DEC-018",
      route: "/decisions",
    },
  },
  activeWorkPackage: {
    workPackageId: "WP-007",
    title: "Historical Requirement Conformance Recovery",
    state: "active",
    statement:
      "WP-007 is active. Cycle work has been executed inside it; the work package itself is neither complete nor closed.",
    source: {
      recordId: "WP-007",
      locator: "docs/wp-007/ENTRY_SPECIFICATION.md",
      route: null,
    },
  },
  latestCheckpoint: {
    checkpointId: "CHECKPOINT-003",
    title: "WP-007 Cycle 3 — v0.3.0 governed package integration and synchronization",
    completedOn: "2026-08-19",
    outcome:
      "Cycle 3 execution is complete: the v0.3.0 package is registered as a synchronized reference, reconciled row by row, and covered by executing invariants.",
    closedNothing:
      "Cycle 3 closed nothing. No finding, work package, gate, drift row, or candidate requirement changed state, and no successor work package was authorized.",
    source: {
      recordId: "CHECKPOINT-003",
      locator: "docs/wp-007/CHECKPOINT-003.md",
      route: null,
    },
  },
  ownerDisposition: {
    subject:
      "WP-007 Cycle 3 execution, and the bounded Cycle 4 extraction proposed at the end of it",
    state: "pending",
    requiredOf: "Founder / Operator",
    obligationSource: {
      recordId: "FND-020",
      locator: "src/fixtures/registers.ts — FINDINGS, FND-020",
      route: "/findings",
    },
    supportingSources: [
      { recordId: "CHECKPOINT-003", locator: "docs/wp-007/CHECKPOINT-003.md", route: null },
      { recordId: "WP-007", locator: "docs/wp-007/ENTRY_SPECIFICATION.md", route: null },
      { recordId: "PDR-001..PDR-004", locator: "data/packages/package-drift.json", route: null },
    ],
  },
  verifications: [
    {
      verificationId: "PV-TESTS",
      statement: "340 of 340 tests passed across 15 files.",
      scope:
        "Automated invariant tests executed by this program only. Machine-verified; no human, independent, accessibility, security, legal, or district review is covered.",
      boundTo: "CHECKPOINT-003 and the Cycle 3 synchronization pass, executed 2026-08-19",
      source: {
        recordId: "EV-033",
        locator: "docs/wp-007/CHECKPOINT-003.md; src/fixtures/registers.ts — EV-033",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-BUILD",
      statement: "The production build succeeded.",
      scope:
        "A build of the repository at that checkpoint. It is not a deployment, a release, or an approval to release.",
      boundTo: "CHECKPOINT-003 and the Cycle 3 synchronization pass, executed 2026-08-19",
      source: {
        recordId: "EV-033",
        locator: "docs/wp-007/CHECKPOINT-003.md",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-DIGEST",
      statement:
        "Both digests declared for the v0.3.0 package were independently recomputed and matched.",
      scope:
        "File identity only. A digest match establishes that the measured bytes are the declared bytes. It establishes no authority, approval, completeness, or correctness of the package content.",
      boundTo: "CHECKPOINT-003 and the Cycle 3 synchronization pass, executed 2026-08-19",
      source: {
        recordId: "EV-033",
        locator: "data/packages/governed-packages.json — PKG-002",
        route: "/evidence",
      },
    },
  ],
  unauthorizedStages: [
    {
      stageId: "WP-039",
      statement: "WP-039 is not authorized. No record in this repository authorizes it.",
      source: { recordId: "DEC-018", locator: "docs/wp-007/REFUSED_CLAIMS.md", route: "/decisions" },
    },
    {
      stageId: "CYCLE-4",
      statement:
        "The proposed bounded Cycle 4 extraction is a proposal only, awaiting explicit owner authorization. It has not started.",
      source: { recordId: "CHECKPOINT-003", locator: "docs/wp-007/CHECKPOINT-003.md", route: null },
    },
    {
      stageId: "PKG-002-PROMOTION",
      statement:
        "Promotion of PKG-002 to canonical is not authorized. It remains a synchronized reference.",
      source: {
        recordId: "PKG-002",
        locator: "data/packages/governed-packages.json — PKG-002",
        route: null,
      },
    },
    {
      stageId: "DRIFT-RESOLUTION",
      statement:
        "Resolution of the recorded package drift rows is not authorized. Each remains unresolved.",
      source: { recordId: "PDR-001..PDR-004", locator: "data/packages/package-drift.json", route: null },
    },
  ],
  publicationBoundary:
    "The hosted application is a public prototype under repository governance. Hosting it does not constitute release authority, and no production use, district deployment, independent validation, certification, or compliance-conformance claim is authorized or made.",
  nextDefensibleOwnerAction: {
    action:
      "Review and disposition WP-007 Cycle 3; authorize or decline the proposed bounded Cycle 4 extraction.",
    why: "WP-007 cannot advance, and Cycle 4 cannot begin, until the owner records a disposition. Nothing else in the current posture unblocks more work.",
    source: {
      recordId: "FND-020",
      locator: "src/fixtures/registers.ts — FINDINGS, FND-020",
      route: "/findings",
    },
  },
};
