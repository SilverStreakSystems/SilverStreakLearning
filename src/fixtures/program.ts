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
  stateDate: "2026-08-20",
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
    checkpointId: "CHECKPOINT-009",
    title: "WP-007 Cycle 7 — FND-023 touch-target rule formalized as TTR-001 v1.0.0",
    completedOn: "2026-08-20",
    outcome:
      "Cycle 7 execution is complete: the owner-authorized touch-target acceptance rule is recorded as one canonical structured record, TTR-001 v1.0.0, carrying a 44 by 44 CSS pixel SHOULD default, a distinct 24 by 24 CSS pixel MUST floor, five documented exceptions, a compact-target departure band of 24 to 43 CSS pixels that cannot reach below the floor, and a deterministic verification protocol at 320, 768, and 1366 CSS pixels whose execution state is NOT-RUN.",
    closedNothing:
      "Cycle 7 closed nothing beyond the FND-023 definition gap. It ran no interface audit, measured and classified no target, changed no interface, adopted, assessed, or implemented no candidate, left HREQ-025 unchanged at NEEDS-EVIDENCE / DEFER, left EV-003 NOT-RUN, closed neither WP-007 nor Gate A, and authorized no successor cycle.",
    source: {
      recordId: "CHECKPOINT-009",
      locator: "docs/wp-007/CHECKPOINT-009.md",
      route: null,
    },
  },

  ownerDisposition: {
    subject:
      "WP-007 Cycle 4 execution: sixteen requirement candidates from HS-023, the seventeen-row cross-source restatement index, and the three unmatched HS-011 rows",
    state: "accepted",
    requiredOf: "Founder / Operator",
    obligationSource: {
      recordId: "DEC-020",
      locator: "src/fixtures/registers.ts — DECISIONS, DEC-020",
      route: "/decisions",
    },
    supportingSources: [
      { recordId: "CHECKPOINT-008", locator: "docs/wp-007/CHECKPOINT-008.md", route: null },
      {
        recordId: "FND-022-DISPOSITIONS",
        locator: "data/historical/fnd-022-owner-dispositions.json",
        route: null,
      },
      {
        recordId: "FND-022-PACKET",
        locator:
          "docs/wp-007/FND-022_OWNER_DISPOSITION_PACKET.md; data/historical/fnd-022-owner-review.json",
        route: null,
      },
      { recordId: "CHECKPOINT-006", locator: "docs/wp-007/CHECKPOINT-006.md", route: null },
      {
        recordId: "HREQ-015..HREQ-030",
        locator: "data/historical/historical-requirements.json",
        route: null,
      },
      {
        recordId: "RST-001..RST-017",
        locator: "data/historical/restatement-index.json",
        route: null,
      },
      { recordId: "PDR-001..PDR-006", locator: "data/packages/package-drift.json", route: null },
    ],
  },
  verifications: [
    {
      verificationId: "PV-TESTS",
      statement:
        "381 of 381 automated tests passed across 18 files, measured with a raised per-test timeout because this sandbox times out slow route renders under parallel load.",
      scope:
        "Automated invariant tests executed by this program only. Machine-verified; no human, independent, accessibility, security, legal, or district review is covered.",
      boundTo: "CHECKPOINT-008 and the Cycle 6 disposition pass, executed 2026-08-19",
      source: {
        recordId: "EV-042",
        locator: "docs/wp-007/CHECKPOINT-008.md; src/fixtures/registers.ts — EV-042",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-BUILD",
      statement: "The production build succeeded.",
      scope:
        "A build of the repository at that checkpoint. It is not a deployment, a release, or an approval to release.",
      boundTo: "CHECKPOINT-008 and the Cycle 6 disposition pass, executed 2026-08-19",
      source: {
        recordId: "EV-040",
        locator: "docs/wp-007/CHECKPOINT-008.md",
        route: "/evidence",
      },
    },
    {
      verificationId: "PV-DIGEST",
      statement:
        "All three digests declared for the supplied August 5 v0.2.0 artifacts were independently recomputed and matched.",
      scope:
        "File identity only. A digest match establishes that the measured bytes are the declared bytes. It establishes no authority, approval, completeness, or correctness of the package content.",
      boundTo: "CHECKPOINT-008 and the Cycle 6 disposition pass, executed 2026-08-19",
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
      source: {
        recordId: "DEC-018",
        locator: "docs/wp-007/REFUSED_CLAIMS.md",
        route: "/decisions",
      },
    },
    {
      stageId: "HREQ-IMPLEMENTATION",
      statement:
        "Implementation or assessment of the disposed requirement candidates is not authorized. The seven candidates adopted under DEC-020 remain candidates that are not assessed and not implemented, and no accessibility conformance is claimed for any of them.",
      source: {
        recordId: "DEC-020",
        locator: "data/historical/fnd-022-owner-dispositions.json",
        route: "/decisions",
      },
    },
    {
      stageId: "CYCLE-7",
      statement:
        "No cycle beyond the bounded Cycle 6 disposition pass is authorized. Cycle 6 was authorized to record the owner decisions and nothing else, and the historical v0.2.0 DOCX and ZIP, neither supplied, remain unread.",
      source: {
        recordId: "CHECKPOINT-008",
        locator: "docs/wp-007/CHECKPOINT-008.md",
        route: "/decisions",
      },
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
      source: {
        recordId: "PDR-001..PDR-006",
        locator: "data/packages/package-drift.json",
        route: null,
      },
    },
  ],
  publicationBoundary:
    "The hosted application is a public prototype under repository governance. Hosting it does not constitute release authority, and no production use, district deployment, independent validation, certification, or compliance-conformance claim is authorized or made.",
  nextDefensibleOwnerAction: {
    action: "Define a testable touch-target rule before HREQ-025 can be reconsidered for adoption.",
    why: "DEC-020 discharged FND-022 and authorized nothing further. The one gap it deferred is the only open obligation the current posture carries, and no successor cycle is authorized until the owner records the next authorization.",
    source: {
      recordId: "FND-023",
      locator: "src/fixtures/registers.ts — FINDINGS, FND-023",
      route: "/findings",
    },
  },
};
