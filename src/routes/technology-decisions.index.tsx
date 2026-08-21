import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import {
  DECISION_PROCESS,
  SOURCE_REGISTER,
  describeOptions,
  registerTotals,
  roleGroups,
} from "@/lib/technology-decision-registry";

const TOTALS = registerTotals();
const GROUPS = roleGroups();

const DERIVED_ROWS = Object.entries(TOTALS.derivedOptions).sort((a, b) => b[1] - a[1]);
const DRIFT_ROWS = Object.entries(TOTALS.drift).sort((a, b) => b[1] - a[1]);

const DRIFT_LABEL: Record<string, string> = {
  agrees: "Derived result matches the supplied recommendation",
  "derived-narrower": "Derived result is narrower than the supplied recommendation",
  "derived-broader": "Derived result is broader than the supplied recommendation",
  differs: "Derived result and supplied recommendation name different options",
  "derived-unresolved": "Evaluator abstained, so no comparison is possible",
  "source-unreadable": "Supplied recommendation names no option number that can be read mechanically",
};

export const Route = createFileRoute("/technology-decisions/")({
  head: () => ({
    meta: [
      { title: "Role-First Technology Decisions | SSLS" },
      {
        name: "description",
        content: `${TOTALS.workflows} analyzed workflows across ${TOTALS.groups} role groups, evaluated against the TDP-001 seven-option decision process. Planning scope only.`,
      },
      { property: "og:title", content: "Role-First Technology Decisions | SSLS" },
      {
        property: "og:description",
        content:
          "Decide the minimum effective solution for a workflow before deciding to build anything.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TechnologyDecisionsOverview,
});

function TechnologyDecisionsOverview() {
  return (
    <div>
      <PageHeader
        title="Role-First Technology Decisions"
        summary={`${TOTALS.workflows} analyzed workflows across ${TOTALS.groups} role groups and ${TOTALS.rolesCountedInGroups} roles, each evaluated against ${DECISION_PROCESS.process_id} to answer one question: what is the minimum effective solution, and is it anything at all?`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
          <SubNavLink to="/technology-decisions/roles">Roles and workflows</SubNavLink>
          <SubNavLink to="/technology-decisions/evaluate">Evaluate a workflow</SubNavLink>
          <SubNavLink to="/technology-decisions/product-alpha">Product Alpha fit</SubNavLink>
          <SubNavLink to="/technology-decisions/sources">Sources and provenance</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section
        id="counts"
        title="What the register contains"
        description="Every number here is counted from the register at render time. None is written into prose."
      >
        <RegistryTable
          caption="Register totals counted from the normalized workflow records."
          headers={["Measure", "Count", "What it means"]}
        >
          <tr>
            <RowHeader>Analyzed workflows</RowHeader>
            <Cell>{TOTALS.workflows}</Cell>
            <Cell>One record per analyzed workflow row, with all eighteen supplied fields intact.</Cell>
          </tr>
          <tr>
            <RowHeader>Role groups</RowHeader>
            <Cell>{TOTALS.groups}</Cell>
            <Cell>One worksheet per group in the supplied source.</Cell>
          </tr>
          <tr>
            <RowHeader>Roles counted within groups</RowHeader>
            <Cell>{TOTALS.rolesCountedInGroups}</Cell>
            <Cell>Distinct role labels inside each group, summed. Matches the declared inventory.</Cell>
          </tr>
          <tr>
            <RowHeader>Roles distinct across the whole register</RowHeader>
            <Cell>{TOTALS.rolesGloballyDistinct}</Cell>
            <Cell>
              One lower than the group-by-group figure, because a single role label legitimately
              appears in two groups. Both numbers are correct.
            </Cell>
          </tr>
          <tr>
            <RowHeader>Workflows where AI may not make the determination</RowHeader>
            <Cell>{TOTALS.aiProhibited}</Cell>
            <Cell>Consequential determinations about a person, closed to AI by invariant.</Cell>
          </tr>
          <tr>
            <RowHeader>Workflows where the evaluator abstained</RowHeader>
            <Cell>{TOTALS.abstentions}</Cell>
            <Cell>The supplied analysis does not answer enough to support a recommendation.</Cell>
          </tr>
        </RegistryTable>
      </Section>

      <Section
        id="derived"
        title="Derived minimum effective solutions"
        description="Computed by the evaluator from the supplied fields. This is not the supplied recommendation."
      >
        <RegistryTable
          caption="Derived option sets and how many workflows reached each."
          headers={["Derived option set", "Workflows"]}
        >
          {DERIVED_ROWS.map(([key, count]) => (
            <tr key={key}>
              <RowHeader>
                {key === "UNRESOLVED"
                  ? "No recommendation — evaluator abstained"
                  : describeOptions(key.split(" + ") as never)}
              </RowHeader>
              <Cell>{count}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="drift"
        title="Where the evaluator disagrees with the supplied analysis"
        description="Disagreement is shown, never silently resolved. The supplied recommendation is preserved verbatim on every workflow page."
      >
        <RegistryTable
          caption="Drift between derived option sets and supplied recommendations."
          headers={["Comparison", "Workflows"]}
        >
          {DRIFT_ROWS.map(([status, count]) => (
            <tr key={status}>
              <RowHeader>{DRIFT_LABEL[status] ?? status}</RowHeader>
              <Cell>{count}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="groups"
        title="Role groups"
        description="Open a group to see its workflows, the verbatim analysis, and the derived result for each."
      >
        <RegistryTable
          caption="Role groups with workflow and role counts."
          headers={["Role group", "Workflows", "Roles counted", "Roles declared"]}
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
              <Cell>{group.roles_declared_in_inventory ?? "Not declared"}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="boundary" title="What this register is not">
        <ul className="measure list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>{SOURCE_REGISTER.source_boundary}</li>
          <li>{DECISION_PROCESS.authority_note}</li>
          <li>
            The Level 1 to Level 10 maturity column is carried as supplied text only. It is never an
            evaluator input and never a readiness signal.
          </li>
        </ul>
      </Section>
    </div>
  );
}
