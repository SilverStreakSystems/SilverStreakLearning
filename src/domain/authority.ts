/**
 * Authority vocabulary for the SSLS Integrated Foundation.
 *
 * Governing rule: authority is a *declared, stored* property of a record.
 * It is never derived from folder location, filename, version number,
 * visual polish, implementation status, test success, or prior AI statements.
 */

export const AUTHORITY_CLASSES = [
  "approved-authority",
  "accepted-decision",
  "current-summary",
  "provisional-implementation",
  "research-candidate",
  "historical-evidence",
  "demo-synthetic-placeholder",
  "gated-future",
] as const;

export type AuthorityClass = (typeof AUTHORITY_CLASSES)[number];

export interface AuthorityClassMeta {
  id: AuthorityClass;
  label: string;
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Plain-language description of what this class permits. */
  meaning: string;
  /** Whether a record of this class may be used to justify present implementation. */
  carriesImplementationAuthority: boolean;
}

export const AUTHORITY_CLASS_META: Record<AuthorityClass, AuthorityClassMeta> = {
  "approved-authority": {
    id: "approved-authority",
    label: "Approved Authority",
    rank: 1,
    meaning: "Governs work within its declared scope. May be cited to justify implementation.",
    carriesImplementationAuthority: true,
  },
  "accepted-decision": {
    id: "accepted-decision",
    label: "Accepted Decision",
    rank: 2,
    meaning: "A decision the operator has accepted. Binding until superseded by a later decision.",
    carriesImplementationAuthority: true,
  },
  "current-summary": {
    id: "current-summary",
    label: "Current Summary",
    rank: 3,
    meaning: "Describes present state. Reports truth; does not create authority.",
    carriesImplementationAuthority: false,
  },
  "provisional-implementation": {
    id: "provisional-implementation",
    label: "Provisional Implementation",
    rank: 4,
    meaning: "Built under a bounded proof scope. Existence in code does not make it approved.",
    carriesImplementationAuthority: false,
  },
  "research-candidate": {
    id: "research-candidate",
    label: "Research / Candidate",
    rank: 5,
    meaning: "Proposed material under consideration. Requires governed promotion before use.",
    carriesImplementationAuthority: false,
  },
  "historical-evidence": {
    id: "historical-evidence",
    label: "Historical Evidence",
    rank: 6,
    meaning: "A record of what was true at a point in time. Visible, but does not define current truth.",
    carriesImplementationAuthority: false,
  },
  "demo-synthetic-placeholder": {
    id: "demo-synthetic-placeholder",
    label: "Demo / Synthetic Placeholder",
    rank: 7,
    meaning: "Invented example content used to exercise the interface. Never a factual source.",
    carriesImplementationAuthority: false,
  },
  "gated-future": {
    id: "gated-future",
    label: "Gated Future",
    rank: 8,
    meaning: "Target-state material held behind a gate. Not current implementation authority.",
    carriesImplementationAuthority: false,
  },
};

/**
 * Whether a record may be cited as present implementation authority.
 * Depends only on the declared authority class — never on build or test state.
 */
export function carriesImplementationAuthority(authorityClass: AuthorityClass): boolean {
  return AUTHORITY_CLASS_META[authorityClass].carriesImplementationAuthority;
}

/** Governed lifecycle. A later stage never back-fills authority to an earlier artifact. */
export const LIFECYCLE_STAGES = [
  "vision",
  "research",
  "candidate",
  "requirement",
  "approved-decision",
  "planned-capability",
  "implemented-capability",
  "tested-capability",
  "validated-capability",
  "released-capability",
  "public-claim",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const LIFECYCLE_STAGE_LABEL: Record<LifecycleStage, string> = {
  vision: "Vision",
  research: "Research",
  candidate: "Candidate",
  requirement: "Requirement",
  "approved-decision": "Approved Decision",
  "planned-capability": "Planned Capability",
  "implemented-capability": "Implemented Capability",
  "tested-capability": "Tested Capability",
  "validated-capability": "Validated Capability",
  "released-capability": "Released Capability",
  "public-claim": "Public Claim",
};

/** Record state relative to time and supersession. */
export type RecordState = "current" | "candidate" | "historical";

export const RECORD_STATE_LABEL: Record<RecordState, string> = {
  current: "Current",
  candidate: "Candidate",
  historical: "Historical",
};

export type Maturity = "draft" | "reviewed" | "adopted" | "operating" | "retired";

export const MATURITY_LABEL: Record<Maturity, string> = {
  draft: "Draft",
  reviewed: "Reviewed",
  adopted: "Adopted",
  operating: "Operating",
  retired: "Retired",
};

/**
 * Verification states. Each is a first-class answer.
 * None of these may be collapsed into a generic "Incomplete".
 */
export const VERIFICATION_STATES = [
  "confirmed",
  "partial",
  "not-verified",
  "not-run",
  "blocked",
  "refused",
  "not-applicable",
  "unknown",
  "stale",
  "conflicted",
  "not-authorized",
] as const;

export type VerificationState = (typeof VERIFICATION_STATES)[number];

export interface VerificationStateMeta {
  id: VerificationState;
  label: string;
  /** Non-color, non-icon textual marker so state never depends on color alone. */
  marker: string;
  meaning: string;
  tone: "affirmed" | "partial" | "open" | "halted" | "excluded";
}

export const VERIFICATION_STATE_META: Record<VerificationState, VerificationStateMeta> = {
  confirmed: {
    id: "confirmed",
    label: "Confirmed",
    marker: "[OK]",
    meaning: "Checked, and evidence supports the statement.",
    tone: "affirmed",
  },
  partial: {
    id: "partial",
    label: "Partial",
    marker: "[PART]",
    meaning: "Some of the required checks passed; the rest are still open.",
    tone: "partial",
  },
  "not-verified": {
    id: "not-verified",
    label: "Not Verified",
    marker: "[UNVER]",
    meaning: "The work exists, but nobody has checked it against the requirement.",
    tone: "open",
  },
  "not-run": {
    id: "not-run",
    label: "Not Run",
    marker: "[NOT RUN]",
    meaning: "The check is defined but has never been executed.",
    tone: "open",
  },
  blocked: {
    id: "blocked",
    label: "Blocked",
    marker: "[BLOCKED]",
    meaning: "The check cannot proceed until a named dependency is resolved.",
    tone: "halted",
  },
  refused: {
    id: "refused",
    label: "Refused",
    marker: "[REFUSED]",
    meaning: "Deliberately withheld. The current boundary does not permit this statement.",
    tone: "halted",
  },
  "not-applicable": {
    id: "not-applicable",
    label: "Not Applicable",
    marker: "[N/A]",
    meaning: "The requirement does not apply within the current boundary.",
    tone: "excluded",
  },
  unknown: {
    id: "unknown",
    label: "Unknown",
    marker: "[UNKNOWN]",
    meaning: "Nobody has established the answer. Stated honestly rather than guessed.",
    tone: "open",
  },
  stale: {
    id: "stale",
    label: "Stale",
    marker: "[STALE]",
    meaning: "A result exists, but the thing it described has changed since.",
    tone: "partial",
  },
  conflicted: {
    id: "conflicted",
    label: "Conflicted",
    marker: "[CONFLICT]",
    meaning: "Two or more sources disagree and no resolution has been recorded.",
    tone: "halted",
  },
  "not-authorized": {
    id: "not-authorized",
    label: "Not Authorized",
    marker: "[NOT AUTH]",
    meaning: "Outside the currently authorized posture. Not attempted by design.",
    tone: "excluded",
  },
};

/** Presentation-only helper. Carries no governance meaning. */
export function verificationMarker(state: VerificationState): string {
  return VERIFICATION_STATE_META[state].marker;
}
