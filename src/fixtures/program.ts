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
    checkpointId: "CHECKPOINT-006",
    title:
      "WP-007 Cycle 4 — August 5 v0.2.0 partial package acquisition, bounded Section 11 extraction, and cross-source restatement index",
    completedOn: "2026-08-19",
    outcome:
      "Cycle 4 execution is complete: the three authorized August 5 v0.2.0 inputs were supplied and digest-verified, PKG-001 is registered as a partial historical package, HS-023 is registered as a source, HREQ-015 through HREQ-030 were extracted verbatim from Section 11, and seventeen cross-source restatement rows were recorded.",
    closedNothing:
      "Cycle 4 closed nothing. No candidate received a disposition or a conformance state, no wording was merged, superseded, or elected as controlling, no drift row was resolved, no work package or gate changed state, and no successor work package was authorized.",
    source: {
      recordId: "CHECKPOINT-006",
      locator: "docs/wp-007/CHECKPOINT-006.md",
      route: null,
    },
  },
  ownerDisposition: {
    subject:
      "WP-007 Cycle 4 execution: sixteen requirement candidates from HS-023 and the seventeen-row cross-source restatement index",
    state: "pending",
    requiredOf: "Founder / Operator",
    obligationSource: {
      recordId: "FND-022",
      locator: "src/fixtures/registers.ts — FINDINGS, FND-022",
      route: "/findings",
    },
    supportingSources: [
      { recordId: "CHECKPOINT-006", locator: "docs/wp-007/CHECKPOINT-006.md", route: null },
      { recordId: "HREQ-015..HREQ-030", locator: "data/historical/historical-requirements.json", route: null },
      { recordId: "RST-001..RST-017", locator: "data/historical/restatement-index.json", route: null },
      { recordId: "PDR-001..PDR-006", locator: "data/packages/package-drift.json", route: null },
    ],
  },
  verifications: [
    {
      verificationId: "PV-TESTS",
      statement: "353 of 353 tests passed across 16 files.",
      scope:
        "Automated invariant tests executed by this program only. Machine-verified; no human, independent, accessibility, security, legal, or district review is covered.",
      boundTo: "CHECKPOINT-006 and the Cycle 4 extraction pass, executed 2026-08-19",
      source: {
        recordId: "EV-033",
        locator: "docs/wp-007/CHECKPOINT-006.md; src/fixtures/registers.ts — EV-040",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-BUILD",
      statement: "The production build succeeded.",
      scope:
        "A build of the repository at that checkpoint. It is not a deployment, a release, or an approval to release.",
      boundTo: "CHECKPOINT-006 and the Cycle 4 extraction pass, executed 2026-08-19",
      source: {
        recordId: "EV-040",
        locator: "docs/wp-007/CHECKPOINT-006.md",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-DIGEST",
      statement:
        "All three digests declared for the supplied August 5 v0.2.0 artifacts were independently recomputed and matched.",
      scope:
        "File identity only. A digest match establishes that the measured bytes are the declared bytes. It establishes no authority, approval, completeness, or correctness of the package content.",
      boundTo: "CHECKPOINT-006 and the Cycle 4 extraction pass, executed 2026-08-19",
      source: {
        recordId: "EV-039",
        locator: "data/packages/governed-packages.json — PKG-001",
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
      stageId: "HREQ-DISPOSITION",
      statement:
        "Disposition of the extracted requirement candidates is not authorized. HREQ-001 through HREQ-030 remain pre-disposition and not assessed, and no restatement row elects a controlling wording.",
      source: {
        recordId: "RST-001..RST-017",
        locator: "data/historical/restatement-index.json",
        route: null,
      },
    },
    {
      stageId: "CYCLE-5",
      statement:
        "No cycle beyond Cycle 4 is authorized. DEC-019 authorizes Cycle 4 only, and the unsupplied v0.2.0 DOCX and ZIP remain unread.",
      source: { recordId: "DEC-019", locator: "docs/wp-007/CHECKPOINT-006.md", route: "/decisions" },
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
      source: { recordId: "PDR-001..PDR-006", locator: "data/packages/package-drift.json", route: null },
    },
  ],
  publicationBoundary:
    "The hosted application is a public prototype under repository governance. Hosting it does not constitute release authority, and no production use, district deployment, independent validation, certification, or compliance-conformance claim is authorized or made.",
  nextDefensibleOwnerAction: {
    action:
      "Disposition WP-007 Cycle 4: sixteen new requirement candidates and seventeen cross-source restatement rows await owner review.",
    why: "WP-007 cannot advance and no candidate can leave pre-disposition until the owner records a disposition. Nothing else in the current posture unblocks more work.",
    source: {
      recordId: "FND-022",
      locator: "src/fixtures/registers.ts — FINDINGS, FND-022",
      route: "/findings",
    },
  },
};
