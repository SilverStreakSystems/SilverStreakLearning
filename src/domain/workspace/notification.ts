/**
 * Notification contract.
 *
 * A notification is an obligation with a deadline attached, not a broadcast of
 * every state change. Each one points at a canonical object.
 */

export const NOTIFICATION_TRIGGERS = [
  "approval-requested",
  "decision-needed",
  "validation-failed",
  "evidence-stale",
  "gate-blocked",
  "commitment-approaching",
  "handoff-rejected",
  "critical-risk",
  "review-due",
  "claim-expiry",
  "incident-update",
] as const;

export type NotificationTrigger = (typeof NOTIFICATION_TRIGGERS)[number];

export const NOTIFICATION_TRIGGER_LABEL: Record<NotificationTrigger, string> = {
  "approval-requested": "Approval requested",
  "decision-needed": "Decision needed",
  "validation-failed": "Validation failed",
  "evidence-stale": "Evidence stale",
  "gate-blocked": "Gate blocked",
  "commitment-approaching": "Commitment approaching",
  "handoff-rejected": "Handoff rejected",
  "critical-risk": "Critical risk",
  "review-due": "Review due",
  "claim-expiry": "Claim expiry",
  "incident-update": "Incident update",
};

export const NOTIFICATION_SEVERITIES = ["stop", "act", "inform"] as const;
export type NotificationSeverity = (typeof NOTIFICATION_SEVERITIES)[number];

export const NOTIFICATION_SEVERITY_META: Record<
  NotificationSeverity,
  { label: string; marker: string; meaning: string }
> = {
  stop: {
    label: "Stop",
    marker: "[STOP]",
    meaning: "Work must not advance until this is resolved.",
  },
  act: {
    label: "Act",
    marker: "[ACT]",
    meaning: "A specific person in a specific capacity owes an action.",
  },
  inform: {
    label: "Inform",
    marker: "[INFO]",
    meaning: "No action is owed. Recorded so the state is not a surprise later.",
  },
};

export interface NotificationRecord {
  notificationId: string;
  trigger: NotificationTrigger;
  severity: NotificationSeverity;
  title: string;
  detail: string;
  /** The canonical object. Notifications never carry their own copy of state. */
  canonicalSource: { objectId: string; objectType: string; route: string };
  /** The capacity that owes the response. */
  addressedToCapacity: string;
  /** Why sending this is necessary, not merely possible. */
  necessityBasis: string;
  actionRequired: string | null;
  raisedOn: string;
  expiresOn: string | null;
  supersedes: string | null;
  synthetic: boolean;
}

export const NOTIFICATION_RULES = [
  "A notification exists only when a human owes a response or must know of a stop.",
  "Every notification references its canonical source object.",
  "A state change with no owed response is recorded, not notified.",
  "Notifications expire. An expired notification is withdrawn, not accumulated.",
  "A superseding notification replaces its predecessor rather than repeating it.",
] as const;

export function validateNotifications(notifications: NotificationRecord[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const notification of notifications) {
    if (!notification.canonicalSource.objectId) {
      problems.push(`${notification.notificationId} has no canonical source object.`);
    }
    const key = `${notification.trigger}:${notification.canonicalSource.objectId}`;
    if (seen.has(key)) {
      problems.push(`${notification.notificationId} duplicates an existing notification.`);
    }
    seen.add(key);
    if (notification.severity !== "inform" && !notification.actionRequired) {
      problems.push(`${notification.notificationId} demands attention without naming an action.`);
    }
  }
  return problems;
}
