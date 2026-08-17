import { createFileRoute, notFound } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import {
  PROJECTION_STEP_META,
  SURFACE_STATE_META,
  WORKSPACE_AVAILABILITY_META,
  WORKSPACE_IMPLEMENTATION_LABEL,
  AUTHORITY_CLASS_META,
} from "@/domain";
import { ACTIVE_CAPACITY, assembleProjection, getWorkspace } from "@/lib/workspace-queries";

export const Route = createFileRoute("/workspaces/$workspaceId")({
  loader: ({ params }) => {
    const workspace = getWorkspace(params.workspaceId);
    if (!workspace) throw notFound();
    return { workspace };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Workspace unavailable | SSLS" }, { name: "robots", content: "noindex" }],
      };
    }
    const { workspace } = loaderData;
    const title = `${workspace.name} | SSLS Workspaces`;
    return {
      meta: [
        { title },
        { name: "description", content: workspace.purpose },
        { property: "og:title", content: title },
        { property: "og:description", content: workspace.fundamentalQuestion },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: WorkspaceNotFound,
  component: WorkspaceDetail,
});

function WorkspaceNotFound() {
  return (
    <div>
      <PageHeader
        title="Workspace not found"
        summary="No workspace with that identifier is recorded. Return to the workspace registry to see the nine that are."
      />
    </div>
  );
}

function WorkspaceDetail() {
  const { workspace } = Route.useLoaderData();
  const projection = assembleProjection(workspace, ACTIVE_CAPACITY);
  const state = SURFACE_STATE_META[projection.surfaceState];
  const availability = WORKSPACE_AVAILABILITY_META[workspace.availability];

  return (
    <div>
      <PageHeader title={workspace.name} summary={workspace.purpose}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="font-semibold">Availability</dt>
            <dd className="text-muted-foreground">
              <span className="font-mono text-xs">{availability.marker}</span> {availability.label}.{" "}
              {availability.meaning}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Declared authority</dt>
            <dd className="text-muted-foreground">
              {AUTHORITY_CLASS_META[workspace.authorityState].label}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Implementation</dt>
            <dd className="text-muted-foreground">
              {WORKSPACE_IMPLEMENTATION_LABEL[workspace.implementationState]}, maturity {workspace.maturity}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Surface state</dt>
            <dd className="text-muted-foreground">
              <span className="font-mono text-xs">{state.marker}</span> {state.label}. {state.meaning}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Section id="question" title="Fundamental question">
        <p className="measure text-base">{workspace.fundamentalQuestion}</p>
      </Section>

      <Section
        id="assembly"
        title="How this view was assembled"
        description="Nine ordered steps. The record is the audit trail, and a projection assembled for one purpose may not be reused for another."
      >
        <RegistryTable
          caption="Projection assembly steps with the question each answers and what was recorded."
          headers={["Step", "Question", "Recorded"]}
        >
          {projection.steps.map((step) => (
            <tr key={step.step}>
              <RowHeader>{PROJECTION_STEP_META[step.step].label}</RowHeader>
              <Cell>{PROJECTION_STEP_META[step.step].question}</Cell>
              <Cell>{step.value}</Cell>
            </tr>
          ))}
        </RegistryTable>
        <p className="measure mt-3 text-sm text-muted-foreground">
          Withheld: {projection.fieldsWithheld.join("; ")}. Reason: {projection.withholdingReason}{" "}
          Freshness: {projection.freshnessNote}
        </p>
      </Section>

      <Section
        id="surfaces"
        title="Primary surfaces"
        description="Each surface names the question it answers and the canonical object types it reads. It copies none of them."
      >
        <RegistryTable
          caption="Workspace surfaces with availability and canonical objects read."
          headers={["Surface", "Question", "Availability", "Reads"]}
        >
          {workspace.primarySurfaces.map((surface) => (
            <tr key={surface.surfaceId}>
              <RowHeader>{surface.name}</RowHeader>
              <Cell>{surface.question}</Cell>
              <Cell>
                <span className="font-mono text-xs">
                  {WORKSPACE_AVAILABILITY_META[surface.availability].marker}
                </span>{" "}
                {WORKSPACE_AVAILABILITY_META[surface.availability].label}
              </Cell>
              <Cell>{surface.readsObjectTypes.join(", ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="metrics"
        title="Metrics"
        description="Every metric states what it must never be read as, and the action it triggers. A metric with neither is refused."
      >
        <RegistryTable
          caption="Workspace metrics with source, calculation, prohibited interpretation, and triggered action."
          headers={["Metric", "Question", "Calculation", "Must not be read as", "Triggers"]}
        >
          {workspace.metrics.map((metric) => (
            <tr key={metric.metricId}>
              <RowHeader>{metric.name}</RowHeader>
              <Cell>{metric.questionAnswered}</Cell>
              <Cell>
                {metric.calculation} Source: {metric.source}. Freshness: {metric.freshness}
              </Cell>
              <Cell>{metric.prohibitedInterpretation}</Cell>
              <Cell>{metric.actionTriggered}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="governance" title="Governance">
        <div className="grid gap-6 lg:grid-cols-2">
          <ListBlock title="Decision rights" items={workspace.decisionRights} />
          <ListBlock title="Evidence requirements" items={workspace.evidenceRequirements} />
          <ListBlock title="Minimum context required" items={workspace.minimumContextRequirements} />
          <ListBlock title="Never displayed here" items={workspace.prohibitedObjects} />
          <ListBlock title="Notification rules" items={workspace.notificationRules} />
          <ListBlock title="Depends on" items={workspace.dependencies} />
          <ListBlock title="Serves value streams" items={workspace.primaryValueStreams} />
          <ListBlock title="Exposes capabilities" items={workspace.requiredCapabilities} />
          <ListBlock title="Accessibility requirements" items={workspace.accessibilityRequirements} />
        </div>
      </Section>

      <Section id="boundary" title="Boundary">
        <p className="measure text-sm">
          <strong>Now:</strong> {workspace.currentBoundary}
        </p>
        <p className="measure mt-2 text-sm">
          <strong>Held for later:</strong> {workspace.futureBoundary}
        </p>
        <p className="measure mt-2 text-sm text-muted-foreground">
          Review trigger: {workspace.reviewTrigger} {workspace.notes}
        </p>
      </Section>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <ul className="measure mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
