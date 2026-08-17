/**
 * Workspace projection contract.
 *
 * A projection is a purpose-bound, authorized view over canonical objects.
 * Displaying an object never makes the workspace its owner, and a projection
 * assembled for one purpose may not be reused for another.
 */

export const PROJECTION_ASSEMBLY_STEPS = [
  "purpose",
  "authorized-participant",
  "acting-capacity",
  "relationship",
  "applicable-policy",
  "canonical-source-objects",
  "minimum-authorized-projection",
  "freshness-missing-conflict-check",
  "workspace-projection",
] as const;

export type ProjectionAssemblyStep = (typeof PROJECTION_ASSEMBLY_STEPS)[number];

export const PROJECTION_STEP_META: Record<
  ProjectionAssemblyStep,
  { label: string; question: string }
> = {
  purpose: { label: "Purpose", question: "Why is this view being assembled at all?" },
  "authorized-participant": {
    label: "Authorized participant",
    question: "Which identity is asking, and is that identity known?",
  },
  "acting-capacity": {
    label: "Acting capacity",
    question: "In what capacity is this person acting right now?",
  },
  relationship: {
    label: "Relationship",
    question: "What legitimate relationship connects that capacity to these objects?",
  },
  "applicable-policy": {
    label: "Applicable policy or rule",
    question: "Which governing rule permits or limits this view?",
  },
  "canonical-source-objects": {
    label: "Canonical source objects",
    question: "Which stored objects are the truth behind this view?",
  },
  "minimum-authorized-projection": {
    label: "Minimum authorized projection",
    question: "What is the smallest set of fields that serves the purpose?",
  },
  "freshness-missing-conflict-check": {
    label: "Freshness, missing, and conflict check",
    question: "What is stale, absent, or contradictory in what is about to be shown?",
  },
  "workspace-projection": {
    label: "Workspace projection",
    question: "What does the authorized human finally see, and how is it labelled?",
  },
};

/** Every rendered surface declares which of these it currently represents. */
export const SURFACE_STATES = [
  "loading",
  "normal",
  "empty",
  "no-results",
  "stale",
  "partial",
  "conflicted",
  "restricted",
  "refused",
  "error",
  "future-gated",
] as const;

export type SurfaceState = (typeof SURFACE_STATES)[number];

export interface SurfaceStateMeta {
  id: SurfaceState;
  label: string;
  marker: string;
  meaning: string;
  /** What the human should be told to do next in this state. */
  nextAction: string;
  /** True when the state is a governed outcome rather than a malfunction. */
  governedOutcome: boolean;
}

export const SURFACE_STATE_META: Record<SurfaceState, SurfaceStateMeta> = {
  loading: {
    id: "loading",
    label: "Loading",
    marker: "[LOAD]",
    meaning: "The projection is being assembled.",
    nextAction: "Wait. Nothing shown yet is a result.",
    governedOutcome: false,
  },
  normal: {
    id: "normal",
    label: "Normal",
    marker: "[OK]",
    meaning: "An authorized projection assembled without gaps.",
    nextAction: "Read the records and act within the stated capacity.",
    governedOutcome: false,
  },
  empty: {
    id: "empty",
    label: "Empty",
    marker: "[EMPTY]",
    meaning: "The source holds no records of this kind yet.",
    nextAction: "Create the first record through its canonical register.",
    governedOutcome: false,
  },
  "no-results": {
    id: "no-results",
    label: "No results",
    marker: "[NONE]",
    meaning: "Records exist, but none match the current filters.",
    nextAction: "Widen or clear the filters.",
    governedOutcome: false,
  },
  stale: {
    id: "stale",
    label: "Stale",
    marker: "[STALE]",
    meaning: "The underlying records are past their freshness window.",
    nextAction: "Revalidate the source before relying on this view.",
    governedOutcome: true,
  },
  partial: {
    id: "partial",
    label: "Partial",
    marker: "[PART]",
    meaning: "Some required sources were unavailable, so the view is incomplete.",
    nextAction: "Treat absent sections as unknown, not as zero.",
    governedOutcome: true,
  },
  conflicted: {
    id: "conflicted",
    label: "Conflicted",
    marker: "[CONF]",
    meaning: "Two authorized sources disagree, and neither has been superseded.",
    nextAction: "Raise a finding and resolve the conflict before acting.",
    governedOutcome: true,
  },
  restricted: {
    id: "restricted",
    label: "Restricted",
    marker: "[RESTR]",
    meaning: "Records exist, but this capacity is not authorized for them.",
    nextAction: "Request authorization through the governing policy, or act without them.",
    governedOutcome: true,
  },
  refused: {
    id: "refused",
    label: "Refused",
    marker: "[REFUSED]",
    meaning: "Governance declines to present this. The system is working as intended.",
    nextAction: "Read the governing rule. Change the request, not the guardrail.",
    governedOutcome: true,
  },
  error: {
    id: "error",
    label: "Error",
    marker: "[ERROR]",
    meaning: "The projection failed for a technical reason.",
    nextAction: "Retry. If it persists, record a finding.",
    governedOutcome: false,
  },
  "future-gated": {
    id: "future-gated",
    label: "Future and gated",
    marker: "[GATE]",
    meaning: "Target-state architecture held behind a named gate.",
    nextAction: "Read the gate condition. Nothing here is operational authority.",
    governedOutcome: true,
  },
};

export interface ProjectionStepRecord {
  step: ProjectionAssemblyStep;
  value: string;
}

export interface WorkspaceProjectionRecord {
  projectionId: string;
  workspaceId: string;
  name: string;
  purpose: string;
  steps: ProjectionStepRecord[];
  /** Canonical objects read. The projection stores none of them. */
  canonicalSourceRefs: string[];
  fieldsShown: string[];
  fieldsWithheld: string[];
  withholdingReason: string;
  freshnessNote: string;
  missingInformation: string[];
  conflicts: string[];
  surfaceState: SurfaceState;
  /** Always false. A projection is never the source of truth. */
  isSourceOfTruth: false;
  reusableForOtherPurpose: false;
}

export type ProjectionViolationKind =
  | "incomplete-assembly"
  | "no-canonical-source"
  | "claims-source-of-truth"
  | "unexplained-withholding";

export interface ProjectionViolation {
  projectionId: string;
  kind: ProjectionViolationKind;
  detail: string;
}

export function validateProjections(
  projections: WorkspaceProjectionRecord[],
): ProjectionViolation[] {
  const violations: ProjectionViolation[] = [];

  for (const projection of projections) {
    const covered = new Set(projection.steps.map((step) => step.step));
    const missing = PROJECTION_ASSEMBLY_STEPS.filter((step) => !covered.has(step));
    if (missing.length > 0) {
      violations.push({
        projectionId: projection.projectionId,
        kind: "incomplete-assembly",
        detail: `Assembly steps not recorded: ${missing.join(", ")}.`,
      });
    }
    if (projection.canonicalSourceRefs.length === 0) {
      violations.push({
        projectionId: projection.projectionId,
        kind: "no-canonical-source",
        detail: "A projection with no canonical source is inventing its content.",
      });
    }
    if (projection.isSourceOfTruth !== false) {
      violations.push({
        projectionId: projection.projectionId,
        kind: "claims-source-of-truth",
        detail: "A projection may not claim ownership of what it displays.",
      });
    }
    if (projection.fieldsWithheld.length > 0 && projection.withholdingReason.trim() === "") {
      violations.push({
        projectionId: projection.projectionId,
        kind: "unexplained-withholding",
        detail: "Withheld fields require a stated reason.",
      });
    }
  }

  return violations;
}

export interface RestrictionExplanation {
  what: string;
  why: string;
  governingRule: string;
  missing: "authorization" | "evidence" | "both" | "neither";
  nextLegitimateAction: string;
}
