/**
 * Workspace definition contract.
 *
 * A workspace is a governed *experience* over shared objects. It is never a
 * source of truth, never a department, and never a data silo. Authority and
 * implementation state are stored fields, never derived from the fact that a
 * route renders.
 */
import type { AuthorityClass } from "../authority";
import type { SharedObjectTypeId } from "../shared-object/object-types";

export const WORKSPACE_IDS = [
  "command-center",
  "strategy-governance",
  "research-intelligence",
  "product-learning-systems",
  "engineering-delivery",
  "market-growth",
  "customer-implementation",
  "trust-quality-assurance",
  "enterprise-operations",
] as const;

export type WorkspaceId = (typeof WORKSPACE_IDS)[number];

/** Whether the workspace is operating now, or described for a later increment. */
export const WORKSPACE_AVAILABILITY = ["current", "candidate", "gated-future", "preview"] as const;
export type WorkspaceAvailability = (typeof WORKSPACE_AVAILABILITY)[number];

export interface WorkspaceAvailabilityMeta {
  id: WorkspaceAvailability;
  /** Sentence-case so navigation accessible names stay plain language. */
  label: string;
  marker: string;
  meaning: string;
  /** Whether the workspace may present records as current operational truth. */
  operatesNow: boolean;
}

export const WORKSPACE_AVAILABILITY_META: Record<WorkspaceAvailability, WorkspaceAvailabilityMeta> =
  {
    current: {
      id: "current",
      label: "Current",
      marker: "[CUR]",
      meaning: "Operating now for the founder and developer capacity, using real project records.",
      operatesNow: true,
    },
    candidate: {
      id: "candidate",
      label: "Candidate",
      marker: "[CAND]",
      meaning: "Architecture is defined and previewable. It is not operating authority.",
      operatesNow: false,
    },
    "gated-future": {
      id: "gated-future",
      label: "Gated future",
      marker: "[GATE]",
      meaning: "Held behind a named gate. It may not be built until that gate is passed.",
      operatesNow: false,
    },
    preview: {
      id: "preview",
      label: "Preview",
      marker: "[PREV]",
      meaning: "Rendered with synthetic records so the projection architecture can be tested.",
      operatesNow: false,
    },
  };

export const WORKSPACE_IMPLEMENTATION_STATES = [
  "implemented",
  "partially-implemented",
  "specified-only",
  "not-started",
] as const;

export type WorkspaceImplementationState = (typeof WORKSPACE_IMPLEMENTATION_STATES)[number];

export const WORKSPACE_IMPLEMENTATION_LABEL: Record<WorkspaceImplementationState, string> = {
  implemented: "Implemented",
  "partially-implemented": "Partially implemented",
  "specified-only": "Specified only",
  "not-started": "Not started",
};

export const WORKSPACE_MATURITY_STAGES = ["S0", "S1", "S2", "S3", "S4", "S5"] as const;
export type WorkspaceMaturityStage = (typeof WORKSPACE_MATURITY_STAGES)[number];

/** A metric that may appear on a workspace surface. Integrity fields are required. */
export interface WorkspaceMetricContract {
  metricId: string;
  name: string;
  questionAnswered: string;
  source: string;
  calculation: string;
  freshness: string;
  interpretation: string;
  /** What this number must never be read as. Required, never empty. */
  prohibitedInterpretation: string;
  /** The decision or action the metric triggers. A metric with none is refused. */
  actionTriggered: string;
}

export interface WorkspaceNavigationItem {
  itemId: string;
  label: string;
  /** In-app route when the surface exists, otherwise null for described surfaces. */
  route: string | null;
  availability: WorkspaceAvailability;
}

export interface WorkspaceSurface {
  surfaceId: string;
  name: string;
  question: string;
  availability: WorkspaceAvailability;
  /** Canonical object types read by this surface. It copies none of them. */
  readsObjectTypes: SharedObjectTypeId[];
}

export interface WorkspaceDefinition {
  workspaceId: WorkspaceId;
  name: string;
  purpose: string;
  fundamentalQuestion: string;
  authorityState: AuthorityClass;
  implementationState: WorkspaceImplementationState;
  maturity: WorkspaceMaturityStage;
  targetUsers: string[];
  actingCapacities: string[];
  requiredCapabilities: string[];
  primaryValueStreams: string[];
  sharedObjectsUsed: SharedObjectTypeId[];
  allowedProjections: string[];
  /** Object types this workspace must never display, whatever the viewer asks. */
  prohibitedObjects: string[];
  minimumContextRequirements: string[];
  navigationItems: WorkspaceNavigationItem[];
  primarySurfaces: WorkspaceSurface[];
  actionTypes: string[];
  decisionRights: string[];
  metrics: WorkspaceMetricContract[];
  evidenceRequirements: string[];
  notificationRules: string[];
  searchDomains: string[];
  dependencies: string[];
  availability: WorkspaceAvailability;
  currentBoundary: string;
  futureBoundary: string;
  accessibilityRequirements: string[];
  reviewTrigger: string;
  supersession: string | null;
  notes: string;
}

export function operatesNow(workspace: WorkspaceDefinition): boolean {
  return WORKSPACE_AVAILABILITY_META[workspace.availability].operatesNow;
}

export type WorkspaceViolationKind =
  | "missing-fundamental-question"
  | "missing-value-stream"
  | "missing-capability"
  | "current-without-implementation"
  | "metric-without-action"
  | "metric-without-prohibited-interpretation"
  | "candidate-surface-marked-current";

export interface WorkspaceViolation {
  workspaceId: WorkspaceId;
  kind: WorkspaceViolationKind;
  detail: string;
}

/**
 * Structural checks that keep a workspace honest. These are invariants, not
 * scores: any violation is a defect, and none of them average out.
 */
export function validateWorkspaces(workspaces: WorkspaceDefinition[]): WorkspaceViolation[] {
  const violations: WorkspaceViolation[] = [];

  for (const workspace of workspaces) {
    if (workspace.fundamentalQuestion.trim() === "" || workspace.purpose.trim() === "") {
      violations.push({
        workspaceId: workspace.workspaceId,
        kind: "missing-fundamental-question",
        detail: "A workspace without a purpose and a fundamental question is a navigation label.",
      });
    }
    if (workspace.primaryValueStreams.length === 0) {
      violations.push({
        workspaceId: workspace.workspaceId,
        kind: "missing-value-stream",
        detail: "A workspace must serve at least one value stream.",
      });
    }
    if (workspace.requiredCapabilities.length === 0) {
      violations.push({
        workspaceId: workspace.workspaceId,
        kind: "missing-capability",
        detail: "A workspace must name the capabilities it exposes.",
      });
    }
    if (workspace.availability === "current" && workspace.implementationState === "not-started") {
      violations.push({
        workspaceId: workspace.workspaceId,
        kind: "current-without-implementation",
        detail: "A workspace marked current must have something implemented behind it.",
      });
    }
    for (const metric of workspace.metrics) {
      if (metric.actionTriggered.trim() === "") {
        violations.push({
          workspaceId: workspace.workspaceId,
          kind: "metric-without-action",
          detail: `Metric ${metric.metricId} supports no decision.`,
        });
      }
      if (metric.prohibitedInterpretation.trim() === "") {
        violations.push({
          workspaceId: workspace.workspaceId,
          kind: "metric-without-prohibited-interpretation",
          detail: `Metric ${metric.metricId} does not state how it must not be read.`,
        });
      }
    }
    if (!operatesNow(workspace)) {
      const currentSurfaces = workspace.primarySurfaces.filter(
        (surface) => surface.availability === "current",
      );
      if (currentSurfaces.length > 0) {
        violations.push({
          workspaceId: workspace.workspaceId,
          kind: "candidate-surface-marked-current",
          detail: `Surfaces ${currentSurfaces
            .map((surface) => surface.surfaceId)
            .join(", ")} claim current status inside a non-operating workspace.`,
        });
      }
    }
  }

  return violations;
}

/**
 * Blended-readiness guard. Readiness lives on independent axes; a single
 * combined percentage is refused wherever it is proposed.
 */
export const BLENDED_READINESS_REFUSAL =
  "A single combined readiness percentage is refused. Readiness is reported on independent axes, and a strong axis never compensates for a blocked axis.";

export const PROHIBITED_WORKSPACE_SIGNALS = [
  "keystroke counts",
  "mouse or activity telemetry used for performance",
  "screen-time scoring",
  "opaque productivity ranking",
  "automated performance evaluation",
  "inferred effort or commitment score",
  "learner surveillance",
  "employee surveillance",
  "engagement frequency ranking",
  "blended readiness percentage",
] as const;

export type ProhibitedWorkspaceSignal = (typeof PROHIBITED_WORKSPACE_SIGNALS)[number];

export const PROHIBITED_SIGNAL_REASON: Record<ProhibitedWorkspaceSignal, string> = {
  "keystroke counts": "Measures presence at a keyboard, not work, and normalises surveillance.",
  "mouse or activity telemetry used for performance":
    "Turns coordination tooling into monitoring infrastructure.",
  "screen-time scoring": "Confuses time in an interface with contribution.",
  "opaque productivity ranking":
    "Cannot be examined, contested, or corrected by the person ranked.",
  "automated performance evaluation":
    "A consequential judgment about a human made without a human.",
  "inferred effort or commitment score":
    "Infers an inner state from observable clicks. Unsupportable.",
  "learner surveillance":
    "Learning visibility means evidence of learning, not observation of learners.",
  "employee surveillance": "Operational visibility coordinates work; it does not watch people.",
  "engagement frequency ranking": "Prioritises what is touched often over what is important.",
  "blended readiness percentage": BLENDED_READINESS_REFUSAL,
};
