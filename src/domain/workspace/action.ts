/**
 * Universal Action Center contract.
 *
 * The Action Center owns no tasks. It projects obligations that already exist
 * on canonical objects: work items, gates, handoffs, dependencies, findings,
 * evidence, decisions, and commitments.
 */

export const ACTION_KINDS = [
  "assigned-work",
  "approval",
  "review",
  "decision-needed",
  "unresolved-finding",
  "risk-action",
  "evidence-request",
  "handoff-acceptance",
  "dependency-resolution",
  "commitment",
  "upcoming-event",
  "revalidation",
] as const;

export type ActionKind = (typeof ACTION_KINDS)[number];

export const ACTION_KIND_LABEL: Record<ActionKind, string> = {
  "assigned-work": "Assigned work",
  approval: "Approval",
  review: "Review",
  "decision-needed": "Decision needed",
  "unresolved-finding": "Unresolved finding",
  "risk-action": "Risk requiring action",
  "evidence-request": "Evidence request",
  "handoff-acceptance": "Handoff waiting for acceptance",
  "dependency-resolution": "Dependency requiring resolution",
  commitment: "Commitment",
  "upcoming-event": "Upcoming event or milestone",
  revalidation: "Revalidation or expiry",
};

/**
 * Ordered priority factors. Position in this list is the whole ranking rule:
 * no weights, no learned model, no opaque score.
 */
export const PRIORITY_FACTORS = [
  "safety-security-privacy-accessibility-stop",
  "governance-gate-blocker",
  "release-critical-dependency",
  "harm-to-learner-customer-or-enterprise",
  "binding-commitment",
  "due-date",
  "cross-stream-dependency",
  "strategic-importance",
] as const;

export type PriorityFactor = (typeof PRIORITY_FACTORS)[number];

export const PRIORITY_FACTOR_LABEL: Record<PriorityFactor, string> = {
  "safety-security-privacy-accessibility-stop": "Safety, security, privacy, or accessibility stop",
  "governance-gate-blocker": "Governance or gate blocker",
  "release-critical-dependency": "Release-critical dependency",
  "harm-to-learner-customer-or-enterprise": "Risk of harm to a learner, customer, or the enterprise",
  "binding-commitment": "Binding commitment",
  "due-date": "Due date",
  "cross-stream-dependency": "Cross-stream dependency",
  "strategic-importance": "Strategic importance",
};

export function priorityRank(factor: PriorityFactor): number {
  return PRIORITY_FACTORS.indexOf(factor) + 1;
}

export const PROHIBITED_PRIORITY_FACTORS = [
  "user activity frequency",
  "engagement score",
  "employee productivity score",
  "opaque model ranking",
] as const;

export const PROHIBITED_PRIORITY_REASON: Record<
  (typeof PROHIBITED_PRIORITY_FACTORS)[number],
  string
> = {
  "user activity frequency": "Frequency of touching a record says nothing about its importance.",
  "engagement score": "An engagement number is a proxy with no governance meaning.",
  "employee productivity score": "A productivity score is surveillance wearing a dashboard.",
  "opaque model ranking": "An order nobody can explain cannot be a defensible order of work.",
};

/**
 * A single action. Every field answers one of the nine required questions,
 * and `canonicalSource` is what makes this a projection rather than a copy.
 */
export interface ActionItem {
  actionId: string;
  kind: ActionKind;
  title: string;
  /** What needs attention. */
  whatNeedsAttention: string;
  /** Why it needs attention. */
  why: string;
  /** By when. Null means no date is recorded, which is itself information. */
  dueBy: string | null;
  /** The canonical object this action reads. The action never duplicates it. */
  canonicalSource: {
    objectId: string;
    objectType: string;
    /** In-app route to the canonical register. */
    route: string;
  };
  /** Under what authority the action may be taken. */
  authorityBasis: string;
  /** What the operator can do. */
  availableActions: string[];
  /** What evidence or context is needed first. */
  requiredContext: string[];
  /** What happens after acting. */
  consequence: string;
  /** The value stream and stage this serves. */
  valueStreamId: string | null;
  stageId: string | null;
  topFactor: PriorityFactor;
  /** Governed non-normal states, such as a restricted or refused action. */
  restriction: {
    restricted: boolean;
    reason: string;
    governingRule: string;
    nextLegitimateAction: string;
  } | null;
  /**
   * A recorded owner instruction that this obligation is placed first,
   * overriding the factor order. It is copied verbatim from the canonical
   * register record so the reason for position one is readable on the surface.
   * It is a named human directive, never a computed score.
   */
  ownerPriorityDirective: string | null;
  synthetic: boolean;
}

export function compareActions(a: ActionItem, b: ActionItem): number {
  // A recorded owner directive is the only input that outranks the factor
  // order, and it is always shown next to the action it promotes.
  const byDirective = Number(Boolean(b.ownerPriorityDirective)) - Number(Boolean(a.ownerPriorityDirective));
  if (byDirective !== 0) return byDirective;
  const byFactor = priorityRank(a.topFactor) - priorityRank(b.topFactor);
  if (byFactor !== 0) return byFactor;
  if (a.dueBy && b.dueBy) return a.dueBy.localeCompare(b.dueBy);
  if (a.dueBy) return -1;
  if (b.dueBy) return 1;
  return a.actionId.localeCompare(b.actionId);
}

export type ActionViolationKind = "missing-canonical-source" | "duplicate-canonical-source-owner";

export interface ActionViolation {
  actionId: string;
  kind: ActionViolationKind;
  detail: string;
}

export function validateActions(actions: ActionItem[]): ActionViolation[] {
  const violations: ActionViolation[] = [];
  const seen = new Map<string, string>();

  for (const action of actions) {
    if (!action.canonicalSource.objectId || !action.canonicalSource.route) {
      violations.push({
        actionId: action.actionId,
        kind: "missing-canonical-source",
        detail: "An action without a canonical source object is a new, ungoverned task.",
      });
    }
    const key = `${action.kind}:${action.canonicalSource.objectId}`;
    const existing = seen.get(key);
    if (existing) {
      violations.push({
        actionId: action.actionId,
        kind: "duplicate-canonical-source-owner",
        detail: `The same obligation is already projected by ${existing}.`,
      });
    } else {
      seen.set(key, action.actionId);
    }
  }

  return violations;
}
