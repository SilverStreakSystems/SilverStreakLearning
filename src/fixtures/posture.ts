import type { VerificationState } from "@/domain";

/** The currently authorized posture. Nothing in the interface may exceed this. */
export const AUTHORIZED_POSTURE: { statement: string; detail: string }[] = [
  { statement: "Clean-slate rebuild", detail: "No structures are carried forward by default." },
  { statement: "Founder and developer operator only", detail: "One authorized human user." },
  { statement: "Private internal workspace", detail: "Not published, not shared, not marketed." },
  {
    statement: "No personal data",
    detail: "No student, family, educator, or staff personal information of any kind.",
  },
  { statement: "Synthetic content only", detail: "Every record is invented to exercise the interface." },
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
      "SSLS-BPP-001 v2.0 governs (DEC-007). WP-000, WP-006, WP-037 and WP-038 are closed by owner; WP-007 is active. Gate A remains open, and DEC-011 and DEC-013 are still routed to WP-008.",
    evidenceReferences: ["EV-018", "EV-034"],
  },
  {
    id: "AX-IMPL",
    name: "Implementation",
    state: "partial",
    basis:
      "The shell, capability, object, value-stream, workspace, obligation, historical and package registers are implemented as provisional implementation. Existing in the repository still grants no authority.",
    evidenceReferences: ["EV-010", "EV-031", "EV-032", "EV-033"],
  },
  {
    id: "AX-VAL",
    name: "Validation and Evidence",
    state: "partial",
    basis:
      "The WP-037 evidence pipeline reproduces build, test, typecheck, SBOM, dependency, boundary and provenance records automatically. Independent verification of the current-state record (EV-012) has still never run.",
    evidenceReferences: ["EV-019", "EV-025", "EV-012"],
  },
  {
    id: "AX-SEC",
    name: "Security and Persistence",
    state: "partial",
    basis:
      "No accounts, no stored data and no backend surface exist. The five high-severity transitive advisories found under DEC-016 were pinned and rescanned to zero matches; that is automated, point-in-time evidence, not a security assessment.",
    evidenceReferences: ["EV-011", "EV-024", "EV-005"],
  },
  {
    id: "AX-A11Y",
    name: "Accessibility",
    state: "not-verified",
    basis:
      "WCAG 2.2 Level AA is the named internal target under DEC-012. ULW-AS-001 v1.3 still carries no version binding, no criterion mapping exists, and no assistive-technology or independent review has occurred.",
    evidenceReferences: ["EV-003"],
  },
  {
    id: "AX-REL",
    name: "Release Authority",
    state: "not-authorized",
    basis:
      "The published surface is a public prototype only. No release path, district readiness, or public claim is authorized in the current posture.",
    evidenceReferences: ["EV-020", "EV-006"],
  },
];

/** Where the governing build program currently stands. One record, read by every surface. */
export const PROGRAM_STANDING: {
  id: string;
  label: string;
  value: string;
  basis: string;
}[] = [
  {
    id: "PS-PROGRAM",
    label: "Governing program",
    value: "SSLS-BPP-001 v2.0",
    basis: "Ratified by DEC-007. Work is authorized only through a work package issued under it.",
  },
  {
    id: "PS-ACTIVE",
    label: "Active work package",
    value: "WP-007 — Historical Requirement Conformance Recovery",
    basis:
      "Cycle 3 (v0.3.0 governed package synchronization) is executor-complete and awaiting owner review. No cycle target is self-authorized.",
  },
  {
    id: "PS-CLOSED",
    label: "Closed by owner",
    value: "WP-000, WP-006, WP-037, WP-038",
    basis: "Closed by DEC-008, DEC-014, DEC-017 and DEC-018 respectively. Owner closure, not certification.",
  },
  {
    id: "PS-GATE",
    label: "Gate A",
    value: "Open",
    basis: "No decision has closed it. DEC-011 and DEC-013 remain routed to WP-008 and block closure.",
  },
  {
    id: "PS-NOT-AUTHORIZED",
    label: "Not authorized",
    value: "WP-008, WP-039",
    basis: "Named in refusal statements only. Neither is planned, started, or eligible.",
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
    action: "Record the owner disposition on the WP-007 cycle 3 synchronization package.",
    why: "WP-007 cannot take a further cycle target until the current cycle is dispositioned.",
    blockedBy: null,
  },
  {
    id: "NDA-002",
    action: "Decide DEC-011 (canonical program register text) and DEC-013 (gate lineage).",
    why: "Both are routed to WP-008 and both block Gate A closure while they stand.",
    blockedBy: "WP-008 is not authorized, so the decisions must be taken directly by the owner.",
  },
  {
    id: "NDA-003",
    action: "Bind ULW-AS-001 v1.3 to WCAG 2.2 Level AA criterion by criterion.",
    why: "DEC-012 named the target; FND-010 and FND-016 stay open until the mapping exists.",
    blockedBy: null,
  },
  {
    id: "NDA-004",
    action: "Execute an assistive-technology review and record the result against EV-003.",
    why: "Accessibility reads Not Verified, and no automated check can change that.",
    blockedBy: null,
  },
  {
    id: "NDA-005",
    action: "Obtain independent verification of the current-state record (EV-012, FND-012).",
    why: "Every current-state assertion is executor self-verified until someone else checks it.",
    blockedBy: "No independent reviewer exists in the founder-only posture.",
  },
  {
    id: "NDA-006",
    action: "Reduce the repository-wide lint debt recorded as FND-014.",
    why: "677 problems, largely formatter differences, keep a clean lint claim unavailable.",
    blockedBy: null,
  },
];

