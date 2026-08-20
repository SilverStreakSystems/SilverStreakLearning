import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import {
  NOTIFICATION_RULES,
  NOTIFICATION_SEVERITY_META,
  NOTIFICATION_TRIGGERS,
  NOTIFICATION_TRIGGER_LABEL,
  validateNotifications,
} from "@/domain";
import { buildNotifications } from "@/lib/workspace-queries";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | SSLS" },
      {
        name: "description",
        content:
          "States where a human owes a response or must know that work has stopped, each bound to a canonical object.",
      },
      { property: "og:title", content: "Notifications | SSLS" },
      {
        property: "og:description",
        content: "A state change with no owed response is recorded, not notified.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const notifications = buildNotifications();
  const problems = validateNotifications(notifications);

  return (
    <div>
      <PageHeader
        title="Notifications"
        summary="A notification exists only when a human owes a response or must know of a stop. Severity is carried in text, never by colour alone."
      />

      <Section id="rules" title="Notification rules">
        <ul className="measure list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {NOTIFICATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </Section>

      <Section id="open" title={`Open notifications (${notifications.length})`}>
        <RegistryTable
          caption="Open notifications with severity, trigger, required action, and canonical source."
          headers={["Severity", "Notification", "Trigger", "Action required", "Canonical source"]}
        >
          {notifications.map((notification) => {
            const severity = NOTIFICATION_SEVERITY_META[notification.severity];
            return (
              <tr key={notification.notificationId}>
                <RowHeader>
                  <span className="font-mono text-xs">{severity.marker}</span> {severity.label}
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {severity.meaning}
                  </span>
                </RowHeader>
                <Cell>
                  {notification.title}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {notification.detail}
                  </span>
                </Cell>
                <Cell>
                  {NOTIFICATION_TRIGGER_LABEL[notification.trigger]}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {notification.necessityBasis}
                  </span>
                </Cell>
                <Cell>
                  {notification.actionRequired ?? "None. Recorded so it is not a surprise later."}
                </Cell>
                <Cell>
                  <Link to={notification.canonicalSource.route}>
                    {notification.canonicalSource.objectId}
                  </Link>
                </Cell>
              </tr>
            );
          })}
        </RegistryTable>
        <p className="measure mt-3 text-sm text-muted-foreground">
          {problems.length === 0
            ? "Every notification above names a canonical source and, where attention is demanded, a specific action."
            : problems.join(" ")}
        </p>
      </Section>

      <Section
        id="triggers"
        title="Authorized triggers"
        description="These eleven triggers are the complete set. Nothing else may raise a notification."
      >
        <ul className="measure grid list-disc gap-1 pl-5 text-sm text-muted-foreground sm:grid-cols-2">
          {NOTIFICATION_TRIGGERS.map((trigger) => (
            <li key={trigger}>{NOTIFICATION_TRIGGER_LABEL[trigger]}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
