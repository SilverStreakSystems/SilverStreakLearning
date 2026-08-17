import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import {
  CAPACITY_STATUS_LABEL,
  MEMBERSHIP_RULES,
  SIMULATED_CAPACITY_NOTICE,
  isSimulatedCapacity,
} from "@/domain";
import { ACTING_CAPACITIES, OPERATOR_IDENTITY, WORKSPACE_MEMBERSHIPS } from "@/fixtures";
import { ACTIVE_CAPACITY } from "@/lib/workspace-queries";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile and Acting Capacity | SSLS" },
      {
        name: "description",
        content:
          "Who is acting, in what capacity, what that capacity may decide, and what it may never do alone.",
      },
      { property: "og:title", content: "Profile and Acting Capacity | SSLS" },
      {
        property: "og:description",
        content: "Identity, capacity, role reference, and authorization are four different things.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile and Acting Capacity"
        summary="This shell identifies the operator by acting role only. There is no name, no contact detail, and no personal data of any kind."
      />

      <Section id="identity" title="Identity">
        <p className="measure text-sm">
          <strong>{OPERATOR_IDENTITY.displayLabel}</strong>
        </p>
        <p className="measure mt-1 text-sm text-muted-foreground">{OPERATOR_IDENTITY.purpose}</p>
      </Section>

      <Section
        id="active"
        title="Currently acting as"
        description="Every recorded action in this shell is attributed to this capacity."
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Capacity</dt>
            <dd className="text-muted-foreground">
              {ACTIVE_CAPACITY.name} ({CAPACITY_STATUS_LABEL[ACTIVE_CAPACITY.status]})
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Policy basis</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.policyBasis}</dd>
          </div>
          <div>
            <dt className="font-semibold">May decide</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.decisionRights.join(" ")}</dd>
          </div>
          <div>
            <dt className="font-semibold">May not do alone</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.requiresOtherAuthority.join(" ")}</dd>
          </div>
          <div>
            <dt className="font-semibold">Expiry trigger</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.expiryTrigger}</dd>
          </div>
          <div>
            <dt className="font-semibold">Why this capacity exists</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.rationale}</dd>
          </div>
        </dl>
      </Section>

      <Section
        id="capacities"
        title="Capacities on record"
        description="Only one is active. The rest are modeled so that separation of duties is designed in rather than retrofitted."
      >
        <RegistryTable
          caption="Acting capacities with status, decision rights, and the authorities they still require."
          headers={["Capacity", "Status", "Would decide", "Requires other authority"]}
        >
          {ACTING_CAPACITIES.map((capacity) => (
            <tr key={capacity.capacityId}>
              <RowHeader>
                {capacity.name}
                {isSimulatedCapacity(capacity) ? (
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {SIMULATED_CAPACITY_NOTICE}
                  </span>
                ) : null}
              </RowHeader>
              <Cell>{CAPACITY_STATUS_LABEL[capacity.status]}</Cell>
              <Cell>{capacity.decisionRights.join(" ")}</Cell>
              <Cell>{capacity.requiresOtherAuthority.join(" ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="memberships" title="Workspace memberships">
        <ul className="measure list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {MEMBERSHIP_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div className="mt-4">
          <RegistryTable
            caption="Memberships held by the active capacity, with purpose and bounded object scope."
            headers={["Workspace", "Relationship", "Purpose", "Object scope"]}
          >
            {WORKSPACE_MEMBERSHIPS.filter(
              (membership) => membership.capacityId === ACTIVE_CAPACITY.capacityId,
            ).map((membership) => (
              <tr key={membership.membershipId}>
                <RowHeader>{membership.workspaceId}</RowHeader>
                <Cell>{membership.relationship}</Cell>
                <Cell>{membership.purpose}</Cell>
                <Cell>{membership.objectScope.join(", ")}</Cell>
              </tr>
            ))}
          </RegistryTable>
        </div>
      </Section>
    </div>
  );
}
