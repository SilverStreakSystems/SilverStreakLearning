import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import {
  ACTING_CAPACITIES,
  GLOBAL_UTILITIES,
  PROJECTION_PATTERN_CONTRACTS,
  WORKSPACES,
  WORKSPACE_MEMBERSHIPS,
} from "@/fixtures";
import {
  BLENDED_READINESS_REFUSAL,
  MEMBERSHIP_RULES,
  PROHIBITED_WORKSPACE_SIGNALS,
  WORKSPACE_AVAILABILITY_META,
  WORKSPACE_IMPLEMENTATION_LABEL,
} from "@/domain";

export const Route = createFileRoute("/workspaces/")({
  head: () => ({
    meta: [
      { title: "Enterprise Workspaces | SSLS" },
      {
        name: "description",
        content:
          "Nine governed enterprise workspaces, their acting capacities, memberships, and the gates that hold the rest closed.",
      },
      { property: "og:title", content: "Enterprise Workspaces | SSLS" },
      {
        property: "og:description",
        content:
          "Workspaces are projections over shared governed objects, never independent data silos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkspacesRegistry,
});

function WorkspacesRegistry() {
  return (
    <div>
      <PageHeader
        title="Enterprise Workspaces"
        summary="Nine workspaces, each a purpose-bound projection over shared governed objects. Availability and authority are stored on the record: a workspace does not become current because a page renders."
      />

      <Section
        id="registry"
        title="Workspace registry"
        description="Two workspaces operate now. The rest are architecture held behind a named gate."
      >
        <RegistryTable
          caption="Nine enterprise workspaces with availability, implementation state, and fundamental question."
          headers={["Workspace", "Fundamental question", "Availability", "Implementation", "Maturity"]}
        >
          {WORKSPACES.map((workspace) => (
            <tr key={workspace.workspaceId}>
              <RowHeader>
                <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.workspaceId }}>
                  {workspace.name}
                </Link>
              </RowHeader>
              <Cell>{workspace.fundamentalQuestion}</Cell>
              <Cell>
                <span className="font-mono text-xs">
                  {WORKSPACE_AVAILABILITY_META[workspace.availability].marker}
                </span>{" "}
                {WORKSPACE_AVAILABILITY_META[workspace.availability].label}
              </Cell>
              <Cell>{WORKSPACE_IMPLEMENTATION_LABEL[workspace.implementationState]}</Cell>
              <Cell>{workspace.maturity}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="capacities"
        title="Acting capacities"
        description="One capacity is active. Every other is a target-state preview and is labelled wherever it appears."
      >
        <RegistryTable
          caption="Acting capacities with status, role reference, and what each may not do alone."
          headers={["Capacity", "Status", "Role reference", "Requires other authority"]}
        >
          {ACTING_CAPACITIES.map((capacity) => (
            <tr key={capacity.capacityId}>
              <RowHeader>{capacity.name}</RowHeader>
              <Cell>{capacity.status}</Cell>
              <Cell>{capacity.roleReference}</Cell>
              <Cell>{capacity.requiresOtherAuthority.join("; ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="membership"
        title="Membership"
        description="Membership places a capacity inside a workspace. It authorizes no record inside it."
      >
        <ul className="measure list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {MEMBERSHIP_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div className="mt-4">
          <RegistryTable
            caption="Recorded memberships with purpose and bounded object scope."
            headers={["Workspace", "Capacity", "Purpose", "Object scope"]}
          >
            {WORKSPACE_MEMBERSHIPS.map((membership) => (
              <tr key={membership.membershipId}>
                <RowHeader>{membership.workspaceId}</RowHeader>
                <Cell>{membership.capacityId}</Cell>
                <Cell>{membership.purpose}</Cell>
                <Cell>{membership.objectScope.join(", ")}</Cell>
              </tr>
            ))}
          </RegistryTable>
        </div>
      </Section>

      <Section
        id="utilities"
        title="Global utilities"
        description="Utilities sit beside the workspaces because an obligation, a search, or a capacity is not the property of a department."
      >
        <RegistryTable
          caption="Global utility contracts with purpose and boundary."
          headers={["Utility", "Question answered", "Boundary"]}
        >
          {GLOBAL_UTILITIES.map((utility) => (
            <tr key={utility.utilityId}>
              <RowHeader>
                <Link to={utility.route}>{utility.name}</Link>
              </RowHeader>
              <Cell>{utility.question}</Cell>
              <Cell>{utility.boundary}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="patterns"
        title="Reusable projection patterns"
        description="One configurable projection architecture, so a future function does not require a new dashboard."
      >
        <RegistryTable
          caption="Projection patterns with their duplication rule and prohibited content."
          headers={["Pattern", "Purpose", "Duplication rule", "Prohibited content"]}
        >
          {PROJECTION_PATTERN_CONTRACTS.map((pattern) => (
            <tr key={pattern.patternId}>
              <RowHeader>{pattern.patternId}</RowHeader>
              <Cell>{pattern.purpose}</Cell>
              <Cell>{pattern.duplicationRule}</Cell>
              <Cell>{pattern.prohibitedContent.join("; ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="refused" title="Refused across every workspace">
        <p className="measure text-sm text-muted-foreground">{BLENDED_READINESS_REFUSAL}</p>
        <ul className="measure mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {PROHIBITED_WORKSPACE_SIGNALS.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
