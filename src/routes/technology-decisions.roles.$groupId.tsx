import { createFileRoute, notFound } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { describeOptions, roleGroupById } from "@/lib/technology-decision-registry";

export const Route = createFileRoute("/technology-decisions/roles/$groupId")({
  loader: ({ params }) => {
    const group = roleGroupById(params.groupId);
    if (!group) throw notFound();
    return { groupName: group.role_group_name, workflowCount: group.workflow_rows };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Role group unavailable | SSLS" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.groupName} | SSLS`;
    const description = `${loaderData.workflowCount} analyzed workflows for ${loaderData.groupName}, each with its verbatim supplied analysis and its derived minimum effective solution.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: GroupNotFound,
  component: RoleGroupPage,
});

function GroupNotFound() {
  return (
    <div>
      <PageHeader
        title="Role group not found"
        summary="No analyzed role group carries that identifier. The register lists every group that exists."
      >
        <SubNav>
          <SubNavLink to="/technology-decisions/roles">All role groups</SubNavLink>
        </SubNav>
      </PageHeader>
    </div>
  );
}

function RoleGroupPage() {
  const { groupId } = Route.useParams();
  const group = roleGroupById(groupId);
  if (!group) return <GroupNotFound />;

  return (
    <div>
      <PageHeader
        title={group.role_group_name}
        summary={`${group.workflow_rows} analyzed workflows and ${group.roles_counted_in_group} roles. Each row keeps the supplied analysis verbatim; the derived column is computed independently and may disagree.`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions/roles">All role groups</SubNavLink>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section
        id="workflows"
        title="Analyzed workflows"
        description="Open a workflow to see all eighteen supplied fields beside the derivation."
      >
        <RegistryTable
          caption={`${group.workflow_rows} analyzed workflows with supplied recommendation and derived result.`}
          headers={["Workflow", "Role", "Supplied recommendation", "Derived result", "Comparison"]}
        >
          {group.workflows.map((item) => (
            <tr key={item.record.workflow_id}>
              <RowHeader>
                <SubNavLink to={`/technology-decisions/workflows/${item.record.workflow_id}`}>
                  {item.record.source.workflow || item.record.workflow_id}
                </SubNavLink>
              </RowHeader>
              <Cell>{item.record.source.role}</Cell>
              <Cell>{item.record.source.recommended_solution}</Cell>
              <Cell>
                {item.evaluation.outcome === "resolved"
                  ? describeOptions(item.evaluation.optionIds)
                  : "Abstained"}
              </Cell>
              <Cell>{item.drift.status}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </div>
  );
}
