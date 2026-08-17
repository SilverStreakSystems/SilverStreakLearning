import type { EnterpriseChainThread, GovernanceSpineThread } from "@/domain";

export const GOVERNANCE_SPINE_THREADS: GovernanceSpineThread[] = [
  {
    id: "TRC-GS-001",
    title: "Accessible navigation in the foundation shell",
    view: "governance-spine",
    synthetic: false,
    nodes: [
      {
        step: "requirement",
        refId: "ULW-AS-001 §nav",
        summary: "Navigation must be keyboard operable with a visible focus indicator.",
        state: "confirmed",
      },
      {
        step: "decision",
        refId: "DEC-001",
        summary: "ULW-AS-001 v1.3 adopted as the interface acceptance contract.",
        state: "confirmed",
      },
      {
        step: "task",
        refId: "FND-SHELL-001",
        summary: "Build the shell navigation with skip link and landmarks.",
        state: "confirmed",
      },
      {
        step: "implementation",
        refId: "src/components/app-shell.tsx",
        summary: "Skip link, landmarks, and keyboard-reachable navigation implemented.",
        state: "confirmed",
      },
      {
        step: "validation",
        refId: "EV-002",
        summary: "Automated structural checks executed against every route.",
        state: "partial",
      },
      {
        step: "finding",
        refId: "FND-004",
        summary: "Assistive-technology review has not been executed.",
        state: "not-run",
      },
      {
        step: "evidence",
        refId: "EV-003",
        summary: "Screen reader review record.",
        state: "not-run",
      },
      {
        step: "claim",
        refId: "CLM-005",
        summary: "Independent accessibility validation.",
        state: "refused",
      },
    ],
  },
  {
    id: "TRC-GS-002",
    title: "Authority never derived from implementation",
    view: "governance-spine",
    synthetic: false,
    nodes: [
      {
        step: "requirement",
        refId: "FND-NORTHSTAR-001",
        summary: "Authority must be declared, never inferred from code or tests.",
        state: "confirmed",
      },
      {
        step: "decision",
        refId: "DEC-002",
        summary: "Target-state material stays gated regardless of what exists in the repository.",
        state: "confirmed",
      },
      {
        step: "task",
        refId: "FND-SHELL-001",
        summary: "Store authority class as a record field with no computed fallback.",
        state: "confirmed",
      },
      {
        step: "implementation",
        refId: "src/domain/authority.ts",
        summary: "Authority class and implementation authority are stored fields.",
        state: "confirmed",
      },
      {
        step: "validation",
        refId: "EV-002",
        summary: "Test asserts implementation status changes do not change authority.",
        state: "confirmed",
      },
      { step: "finding", refId: "—", summary: "No finding raised.", state: "not-applicable" },
      {
        step: "evidence",
        refId: "EV-002",
        summary: "Automated test run record.",
        state: "partial",
      },
      {
        step: "claim",
        refId: "CLM-001",
        summary: "Foundation shell implemented within a governed proof scope.",
        state: "confirmed",
      },
    ],
  },
];

export const ENTERPRISE_CHAIN_THREADS: EnterpriseChainThread[] = [
  {
    id: "TRC-EC-001",
    title: "From North Star to governed authority visibility",
    view: "enterprise-outcome",
    synthetic: true,
    nodes: [
      {
        step: "north-star",
        refId: "FND-NORTHSTAR-001",
        summary: "Make Learning Visible.",
        state: "confirmed",
      },
      {
        step: "human-outcome",
        refId: "OUT-001",
        summary: "An operator can tell what is true and what the next defensible action is.",
        state: "partial",
      },
      {
        step: "principle",
        refId: "FND-BOUNDARY-001",
        summary: "Visibility without surveillance; no personal data in this posture.",
        state: "confirmed",
      },
      {
        step: "enterprise-capability",
        refId: "CAP-001",
        summary: "Governance and Authority Management.",
        state: "not-verified",
      },
      {
        step: "function",
        refId: "FN-STRATEGY",
        summary: "Strategy and Governance (candidate function).",
        state: "unknown",
      },
      {
        step: "role-decision-right",
        refId: "ROLE-GOV",
        summary: "Governance Owner holds promotion rights (candidate).",
        state: "unknown",
      },
      {
        step: "value-stream",
        refId: "VS-PROMOTION",
        summary: "Candidate to approved artifact promotion (candidate).",
        state: "not-run",
      },
      {
        step: "work-deliverable",
        refId: "FND-SHELL-001",
        summary: "Authority ledger delivered in this pass.",
        state: "confirmed",
      },
      {
        step: "validation",
        refId: "EV-002",
        summary: "Structural checks on ledger rendering.",
        state: "partial",
      },
      {
        step: "evidence",
        refId: "EV-004",
        summary: "Registry field coverage review.",
        state: "partial",
      },
      {
        step: "outcome",
        refId: "OUT-001",
        summary: "Operator-reported clarity is not yet measured.",
        state: "unknown",
      },
      {
        step: "learning",
        refId: "FND-002",
        summary: "Missing doctrine content constrains every layer above it.",
        state: "confirmed",
      },
    ],
  },
];
