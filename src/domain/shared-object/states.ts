/**
 * State architecture.
 *
 * A single generic `status` field is forbidden. Each axis below answers a
 * different question and may move independently. Reading one axis never tells
 * you the value of another: a thing may be implemented and unvalidated,
 * validated and unapproved, approved and unreleased.
 *
 * Existing project vocabularies are reused rather than duplicated:
 * authority classes come from `../authority`, and evidence-collection outcomes
 * continue to use `VerificationState`.
 */
import type { AuthorityClass } from "../authority";

export interface StateValueMeta<T extends string> {
  id: T;
  label: string;
  /** Text marker so state never depends on color. */
  marker: string;
  meaning: string;
}

/** What a human is doing with the object right now. */
export const WORKFLOW_STATES = [
  "draft",
  "open",
  "in-review",
  "blocked",
  "complete",
  "closed",
  "withdrawn",
] as const;
export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export const WORKFLOW_STATE_META: Record<WorkflowState, StateValueMeta<WorkflowState>> = {
  draft: { id: "draft", label: "Draft", marker: "[DRAFT]", meaning: "Being written. Not yet offered for use." },
  open: { id: "open", label: "Open", marker: "[OPEN]", meaning: "Active and being worked." },
  "in-review": { id: "in-review", label: "In review", marker: "[REVIEW]", meaning: "With a reviewer. No outcome yet." },
  blocked: { id: "blocked", label: "Blocked", marker: "[BLOCKED]", meaning: "Cannot proceed until a named dependency resolves." },
  complete: { id: "complete", label: "Complete", marker: "[DONE]", meaning: "The work finished. This says nothing about approval." },
  closed: { id: "closed", label: "Closed", marker: "[CLOSED]", meaning: "No further action will be taken." },
  withdrawn: { id: "withdrawn", label: "Withdrawn", marker: "[WITHDRAWN]", meaning: "Retracted by its owner before an outcome." },
};

/** Authority state reuses the authority class vocabulary; it is not redefined. */
export type AuthorityState = AuthorityClass;

/** How far the thing has been built. Never implies it works. */
export const IMPLEMENTATION_STATES = ["not-started", "specified", "partial", "implemented", "retired"] as const;
export type ImplementationState = (typeof IMPLEMENTATION_STATES)[number];

export const IMPLEMENTATION_STATE_META: Record<ImplementationState, StateValueMeta<ImplementationState>> = {
  "not-started": { id: "not-started", label: "Not started", marker: "[NONE]", meaning: "Nothing has been built." },
  specified: { id: "specified", label: "Specified", marker: "[SPEC]", meaning: "Described in enough detail to build. Not built." },
  partial: { id: "partial", label: "Partial", marker: "[PART]", meaning: "Some of it exists." },
  implemented: { id: "implemented", label: "Implemented", marker: "[IMPL]", meaning: "It exists in code or in practice. Not a statement that it is correct." },
  retired: { id: "retired", label: "Retired", marker: "[RETIRED]", meaning: "Removed deliberately." },
};

/** Whether anyone checked it against the requirement. */
export const VALIDATION_STATES = [
  "not-planned",
  "planned",
  "not-run",
  "passed",
  "passed-with-findings",
  "failed",
  "blocked",
] as const;
export type ValidationState = (typeof VALIDATION_STATES)[number];

export const VALIDATION_STATE_META: Record<ValidationState, StateValueMeta<ValidationState>> = {
  "not-planned": { id: "not-planned", label: "Not planned", marker: "[NO PLAN]", meaning: "No check has been designed." },
  planned: { id: "planned", label: "Planned", marker: "[PLANNED]", meaning: "A check is designed but not executed." },
  "not-run": { id: "not-run", label: "Not run", marker: "[NOT RUN]", meaning: "The check exists and has never been executed." },
  passed: { id: "passed", label: "Passed", marker: "[PASS]", meaning: "Executed, and the expected result was observed." },
  "passed-with-findings": { id: "passed-with-findings", label: "Passed with findings", marker: "[PASS+F]", meaning: "Met the bar, and raised issues that remain open." },
  failed: { id: "failed", label: "Failed", marker: "[FAIL]", meaning: "Executed, and the expected result was not observed." },
  blocked: { id: "blocked", label: "Blocked", marker: "[BLOCKED]", meaning: "Could not execute. No result exists." },
};

/** How much evidence currently stands behind the object. */
export const EVIDENCE_STATES = ["none", "partial", "current", "stale", "conflicted"] as const;
export type EvidenceState = (typeof EVIDENCE_STATES)[number];

export const EVIDENCE_STATE_META: Record<EvidenceState, StateValueMeta<EvidenceState>> = {
  none: { id: "none", label: "None", marker: "[NO EV]", meaning: "No evidence has been recorded." },
  partial: { id: "partial", label: "Partial", marker: "[PART EV]", meaning: "Some of the required evidence exists." },
  current: { id: "current", label: "Current", marker: "[EV OK]", meaning: "Evidence exists and still applies to the present version." },
  stale: { id: "stale", label: "Stale", marker: "[EV STALE]", meaning: "Evidence exists but the thing it described has changed." },
  conflicted: { id: "conflicted", label: "Conflicted", marker: "[EV CONFLICT]", meaning: "Evidence disagrees and no resolution is recorded." },
};

/** Whether an authorized human has said yes. Never inferred. */
export const APPROVAL_STATES = [
  "not-required",
  "pending",
  "approved",
  "refused",
  "expired",
  "superseded",
] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

export const APPROVAL_STATE_META: Record<ApprovalState, StateValueMeta<ApprovalState>> = {
  "not-required": { id: "not-required", label: "Not required", marker: "[N/R]", meaning: "No approval is required for this object." },
  pending: { id: "pending", label: "Pending", marker: "[PENDING]", meaning: "Awaiting an authorized human decision." },
  approved: { id: "approved", label: "Approved", marker: "[APPROVED]", meaning: "An authorized human recorded an explicit yes." },
  refused: { id: "refused", label: "Refused", marker: "[REFUSED]", meaning: "An authorized human recorded an explicit no." },
  expired: { id: "expired", label: "Expired", marker: "[EXPIRED]", meaning: "The approval had a time limit and it passed." },
  superseded: { id: "superseded", label: "Superseded", marker: "[SUPERSEDED]", meaning: "A later approval replaced it." },
};

/** How far the object has travelled toward an audience. */
export const PUBLICATION_STATES = ["internal", "release-candidate", "released", "retired"] as const;
export type PublicationState = (typeof PUBLICATION_STATES)[number];

export const PUBLICATION_STATE_META: Record<PublicationState, StateValueMeta<PublicationState>> = {
  internal: { id: "internal", label: "Internal", marker: "[INTERNAL]", meaning: "Visible only inside the authorized boundary." },
  "release-candidate": { id: "release-candidate", label: "Release candidate", marker: "[RC]", meaning: "Proposed for release. Not released." },
  released: { id: "released", label: "Released", marker: "[RELEASED]", meaning: "Deliberately made available to its audience." },
  retired: { id: "retired", label: "Retired", marker: "[RETIRED]", meaning: "Withdrawn from its audience." },
};

/** How much the object's content can still be trusted with respect to time. */
export const FRESHNESS_STATES = ["current", "stale", "expired", "unknown"] as const;
export type FreshnessState = (typeof FRESHNESS_STATES)[number];

export const FRESHNESS_STATE_META: Record<FreshnessState, StateValueMeta<FreshnessState>> = {
  current: { id: "current", label: "Current", marker: "[FRESH]", meaning: "Within its declared freshness window." },
  stale: { id: "stale", label: "Stale", marker: "[STALE]", meaning: "Past its freshness window. Still readable, no longer relied upon." },
  expired: { id: "expired", label: "Expired", marker: "[EXPIRED]", meaning: "Past a hard expiry. Must not be used." },
  unknown: { id: "unknown", label: "Unknown", marker: "[UNKNOWN]", meaning: "No freshness window was declared, so age cannot be judged." },
};

/** The eight state axes, as data, so the UI and the tests read one source. */
export const STATE_AXES = [
  "workflow",
  "authority",
  "implementation",
  "validation",
  "evidence",
  "approval",
  "publication",
  "freshness",
] as const;

export type StateAxis = (typeof STATE_AXES)[number];

export interface StateAxisMeta {
  id: StateAxis;
  label: string;
  question: string;
  values: readonly string[];
  /** What this axis must never be used to conclude. */
  doesNotImply: string;
}

export const STATE_AXIS_META: Record<StateAxis, StateAxisMeta> = {
  workflow: {
    id: "workflow",
    label: "Workflow state",
    question: "What is a human doing with this right now?",
    values: WORKFLOW_STATES,
    doesNotImply: "Completion is not approval and not validation.",
  },
  authority: {
    id: "authority",
    label: "Authority state",
    question: "What weight does this record carry?",
    values: ["approved-authority", "accepted-decision", "current-summary", "provisional-implementation", "research-candidate", "historical-evidence", "demo-synthetic-placeholder", "gated-future"],
    doesNotImply: "Authority is never derived from workflow, implementation, or test success.",
  },
  implementation: {
    id: "implementation",
    label: "Implementation state",
    question: "How much of it has been built?",
    values: IMPLEMENTATION_STATES,
    doesNotImply: "Being built does not mean it works, is approved, or is allowed.",
  },
  validation: {
    id: "validation",
    label: "Validation state",
    question: "Did anyone check it against the requirement?",
    values: VALIDATION_STATES,
    doesNotImply: "A pass is not an approval and not a release.",
  },
  evidence: {
    id: "evidence",
    label: "Evidence state",
    question: "What still stands behind it?",
    values: EVIDENCE_STATES,
    doesNotImply: "Evidence for one version is not evidence for the next.",
  },
  approval: {
    id: "approval",
    label: "Approval state",
    question: "Did an authorized human say yes?",
    values: APPROVAL_STATES,
    doesNotImply: "Silence, inactivity, and completion are never approval.",
  },
  publication: {
    id: "publication",
    label: "Publication state",
    question: "Who is allowed to see it?",
    values: PUBLICATION_STATES,
    doesNotImply: "Released is not validated and not claimed.",
  },
  freshness: {
    id: "freshness",
    label: "Freshness state",
    question: "Is it still timely?",
    values: FRESHNESS_STATES,
    doesNotImply: "Fresh is not correct, and stale is not wrong.",
  },
};
