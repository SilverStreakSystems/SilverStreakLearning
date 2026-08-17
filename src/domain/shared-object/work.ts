/**
 * Shared work item contract.
 *
 * One contract covers task, review, approval request, correction, research,
 * validation, implementation, remediation, obligation, escalation, follow-up,
 * and governance action. They differ by `workType` and by which conditional
 * fields apply, not by having separate incompatible schemas per function.
 *
 * Two fields are non-negotiable: purpose, and the object the work serves.
 * Work that cannot name either is surfaced as a finding rather than accepted.
 */
import type { WorkflowState } from "./states";
import type { Provenance } from "./governance-metadata";

export const WORK_TYPES = [
  "task",
  "review",
  "approval-request",
  "correction",
  "research-action",
  "validation-work",
  "implementation-action",
  "remediation",
  "obligation",
  "support-escalation",
  "follow-up",
  "governance-action",
] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  task: "Task",
  review: "Review",
  "approval-request": "Approval request",
  correction: "Correction",
  "research-action": "Research action",
  "validation-work": "Validation work",
  "implementation-action": "Implementation action",
  remediation: "Remediation",
  obligation: "Implementation obligation",
  "support-escalation": "Support escalation",
  "follow-up": "Follow-up",
  "governance-action": "Governance action",
};

/**
 * Priority is a declared judgment, not a computed score. There is no numeric
 * ranking, because a number would invite arithmetic that nothing supports.
 */
export const WORK_PRIORITIES = ["blocking", "high", "normal", "background"] as const;
export type WorkPriority = (typeof WORK_PRIORITIES)[number];

export const WORK_PRIORITY_LABEL: Record<WorkPriority, string> = {
  blocking: "Blocking",
  high: "High",
  normal: "Normal",
  background: "Background",
};

export interface WorkItem {
  workItemId: string;
  workType: WorkType;
  /** Why this work exists. Required. */
  purpose: string;
  title: string;
  description: string;
  owner: string;
  contributors: string[];
  /**
   * The object this work serves. Required unless an exception is recorded,
   * in which case the exception must name who accepted it and why.
   */
  servedObjectId: string | null;
  servedObjectException: string | null;
  relatedCapabilityIds: string[];
  relatedRequirementIds: string[];
  relatedDecisionIds: string[];
  priority: WorkPriority;
  workflowState: WorkflowState;
  dueDate: string | null;
  dependsOnWorkItemIds: string[];
  acceptanceCriteria: string[];
  requiredDeliverableTypeIds: string[];
  requiredEvidenceIds: string[];
  completionResult: string | null;
  /** Who this escalates to when overdue or blocked. A role, never a person. */
  escalationRoleId: string | null;
  provenance: Provenance;
  auditRequired: boolean;
  synthetic: boolean;
}

export interface WorkItemViolation {
  workItemId: string;
  kind: "missing-purpose" | "missing-served-object" | "completed-without-result";
  detail: string;
}

/** Surfaces indefensible work as findings rather than silently allowing it. */
export function validateWorkItems(items: WorkItem[]): WorkItemViolation[] {
  const violations: WorkItemViolation[] = [];

  for (const item of items) {
    if (item.purpose.trim().length === 0) {
      violations.push({
        workItemId: item.workItemId,
        kind: "missing-purpose",
        detail: "Work without a stated purpose cannot be prioritized or refused defensibly.",
      });
    }

    if (item.servedObjectId === null && (item.servedObjectException ?? "").trim().length === 0) {
      violations.push({
        workItemId: item.workItemId,
        kind: "missing-served-object",
        detail: "Work must name the object it serves, or record an accepted exception.",
      });
    }

    if (item.workflowState === "complete" && (item.completionResult ?? "").trim().length === 0) {
      violations.push({
        workItemId: item.workItemId,
        kind: "completed-without-result",
        detail: "Completion must state what was produced. Completion alone proves nothing.",
      });
    }
  }

  return violations;
}

/**
 * Handoff contract. A handoff is a typed relationship, not an object; these
 * fields hang off the edge and answer the questions a receiver must be able
 * to answer before accepting.
 */
export interface HandoffTerms {
  handoffId: string;
  relationshipId: string;
  sendingRoleId: string;
  receivingRoleId: string;
  objectId: string;
  requiredStateOnSend: string;
  requiredAccompanyingEvidenceIds: string[];
  acceptanceCriteria: string[];
  rejectionPath: string;
  overduePath: string;
  escalationRoleId: string;
  /** Accepted only by an explicit act of the receiver. Never by elapsed time. */
  accepted: boolean;
  acceptedBy: string | null;
  acceptedAt: string | null;
  synthetic: boolean;
}
