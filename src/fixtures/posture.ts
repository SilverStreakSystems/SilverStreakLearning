import type { VerificationState } from "@/domain";

/** The currently authorized posture. Nothing in the interface may exceed this. */
export const AUTHORIZED_POSTURE: { statement: string; detail: string }[] = [
  { statement: "Clean-slate rebuild", detail: "No structures are carried forward by default." },
  { statement: "Founder and developer operator only", detail: "One authorized human user." },
  {
    statement: "Public prototype under repository governance",
    detail:
      "Hosted so the founder operator can inspect it. Hosting is not release authority, and the boundary is stated in full on the Command Center.",
  },
  {
    statement: "No personal data",
    detail: "No student, family, educator, or staff personal information of any kind.",
  },
  {
    statement: "Synthetic content only",
    detail: "Every record is invented to exercise the interface.",
  },
];

export const EXCLUDED_FROM_POSTURE: string[] = [
  "District users",
  "Students",
  "Families",
  "Educators as separate runtime roles",
  "Vendors",
  "External reviewers",
  "Production customer data",
  "Live district integrations",
  "Product-facing AI",
  "Autonomous consequential decisions",
  "Live communication-provider execution",
  "Any claim of production readiness",
  "Any claim of district validation",
  "Any claim of legal compliance",
  "Any claim of independent accessibility validation",
  "Any claim of security certification",
];

export interface ReadinessAxisRecord {
  id: string;
  name: string;
  state: VerificationState;
  /** Plain-language basis for the state. Never a number, never a blended score. */
  basis: string;
  evidenceReferences: string[];
}

/**
 * Independent readiness axes. These are deliberately never combined.
 * No total, average, or percentage is computed anywhere in this application.
 */
export const READINESS_AXES: ReadinessAxisRecord[] = [
  {
    id: "AX-GOV",
    name: "Governance Authority",
    state: "partial",
    basis:
      "The North Star, the boundary decision, and one accessibility standard are approved. Doctrine and capability architecture remain candidate.",
    evidenceReferences: ["EV-004"],
  },
  {
    id: "AX-IMPL",
    name: "Implementation",
    state: "partial",
    basis:
      "The foundation shell exists as provisional implementation. It carries no implementation authority of its own.",
    evidenceReferences: ["EV-002"],
  },
  {
    id: "AX-VAL",
    name: "Validation and Evidence",
    state: "partial",
    basis: "Automated structural checks have run. Human and assistive-technology review have not.",
    evidenceReferences: ["EV-002", "EV-003"],
  },
  {
    id: "AX-SEC",
    name: "Security and Persistence",
    state: "not-applicable",
    basis:
      "No accounts, no stored data, no network persistence in this pass. There is nothing yet to secure.",
    evidenceReferences: ["EV-005"],
  },
  {
    id: "AX-A11Y",
    name: "Accessibility",
    state: "not-verified",
    basis:
      "The acceptance contract is applied during construction. Independent verification has not occurred.",
    evidenceReferences: ["EV-002", "EV-003"],
  },
  {
    id: "AX-REL",
    name: "Release Authority",
    state: "not-authorized",
    basis: "No release path is authorized in the current posture.",
    evidenceReferences: ["EV-006"],
  },
];

export const NEXT_DEFENSIBLE_ACTIONS: {
  id: string;
  action: string;
  why: string;
  blockedBy: string | null;
}[] = [
  {
    id: "NDA-001",
    action: "Record the Core Beliefs Doctrine text and decide whether to promote it.",
    why: "Every layer above L0 is candidate by default while doctrine is empty.",
    blockedBy: null,
  },
  {
    id: "NDA-002",
    action: "Resolve the layer label and count discrepancy in DEC-004.",
    why: "Documentation and navigation both carry the ambiguity until it is settled.",
    blockedBy: null,
  },
  {
    id: "NDA-003",
    action: "Decide the persistence approach for the foundation registry in DEC-003.",
    why: "Registry edits currently require a code change.",
    blockedBy: null,
  },
  {
    id: "NDA-004",
    action: "Execute an assistive-technology review and record the result.",
    why: "Accessibility currently reads Not Verified, and that is the honest state.",
    blockedBy: null,
  },
];
