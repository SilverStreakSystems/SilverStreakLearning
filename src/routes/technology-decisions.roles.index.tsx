import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { registerTotals, roleGroups } from "@/lib/technology-decision-registry";

const GROUPS = roleGroups();
const TOTALS = registerTotals();

function derivedSummary(groupId: string) {
  const group = GROUPS.find((item) => item.role_group_id === groupId);
  if (!group) return "";
  const counts = new Map<string, number>();
  for (const workflow of group.workflows) {
    const key =
      workflow.evaluation.outcome === "resolved"
        ? workflow.evaluation.optionIds.map((id) => id.replace("OPT-", "Option ")).join(" + ")
        : "Abstained";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `${key}: ${count}`)
    .join("; ");
}

export const Route = createFileRoute("/technology-decisions/roles/")({
  head: () => ({
    meta: [
      { title: "Roles and Workflows | SSLS" },
      {
        name: "description",
        content: `${TOTALS.rolesCountedInGroups} roles across ${TOTALS.groups} groups, with ${TOTALS.workflows} analyzed workflows and the derived minimum effective solution for each.`,
      },
      { property: "og:title", content: "Roles and Workflows | SSLS" },
      {
        property: "og:description",
        content:
          "Coverage by role group, with no group silently dropped and no count hand-written.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RolesIndex,
});

function RolesIndex() {
  return (
    <div>
      <PageHeader
        title="Roles and Workflows"
        summary={`Every one of the ${TOTALS.groups} role groups is listed, including groups whose workflows all resolve to no new technology. Coverage is shown so nothing can quietly go missing.`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions">Overview</SubNavLink>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
          <SubNavLink to="/technology-decisions/evaluate">Evaluate a workflow</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section
        id="coverage"
        title="Coverage by role group"
        description="Workflow and role counts come from the register. Derived results come from the evaluator, not from the supplied recommendation."
      >
        <RegistryTable
          caption="Role groups with workflow counts, role counts, and derived option distribution."
          headers={["Role group", "Workflows", "Roles counted", "Derived results"]}
        >
          {GROUPS.map((group) => (
            <tr key={group.role_group_id}>
              <RowHeader>
                <SubNavLink to={`/technology-decisions/roles/${group.role_group_id}`}>
                  {group.role_group_name}
                </SubNavLink>
              </RowHeader>
              <Cell>{group.workflow_rows}</Cell>
              <Cell>{group.roles_counted_in_group}</Cell>
              <Cell>{derivedSummary(group.role_group_id)}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </div>
  );
}
