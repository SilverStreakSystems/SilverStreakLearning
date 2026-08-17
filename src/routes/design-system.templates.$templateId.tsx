import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { Field, ValueList } from "@/components/governance/markers";
import { MaturityChip } from "@/components/governance/design-system-controls";
import { INTERFACE_TEMPLATES, PAGE_BLUEPRINTS } from "@/fixtures";
import { TEMPLATE_MATURITY_META } from "@/domain";

export const Route = createFileRoute("/design-system/templates/$templateId")({
  loader: ({ params }) => {
    const template = INTERFACE_TEMPLATES.find((item) => item.templateId === params.templateId);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Interface template unavailable | SSLS" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { template } = loaderData;
    const title = `${template.name} interface template | SSLS`;
    const description = `${template.primaryJob} Declared maturity: ${TEMPLATE_MATURITY_META[template.maturity].label}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: TemplateNotFound,
  component: TemplateDetail,
});

function TemplateNotFound() {
  return (
    <>
      <PageHeader
        title="Interface template not found"
        summary="No template in the registry carries that identifier. The registry holds eighteen templates, TPL-01 through TPL-18."
      />
      <p className="mt-4">
        <Link
          to="/design-system"
          search={{ view: "templates", maturity: "all", q: "" }}
          className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-3 font-semibold underline underline-offset-4"
        >
          Return to the template registry
        </Link>
      </p>
    </>
  );
}

function TemplateDetail() {
  const { template } = Route.useLoaderData();
  const blueprint = template.blueprintId
    ? (PAGE_BLUEPRINTS.find((item) => item.blueprintId === template.blueprintId) ?? null)
    : null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link
          to="/design-system"
          search={{ view: "templates", maturity: "all", q: "" }}
          className="underline underline-offset-4"
        >
          Interface templates
        </Link>
        <span className="px-2 text-muted-foreground" aria-hidden="true">
          /
        </span>
        <span className="font-mono text-xs">{template.templateId}</span>
      </nav>

      <PageHeader title={template.name} summary={template.primaryJob}>
        <div className="flex flex-wrap items-center gap-3">
          <MaturityChip maturity={template.maturity} />
          <span className="font-mono text-xs text-muted-foreground">{template.templateId}</span>
        </div>
      </PageHeader>

      <Section
        id="declaration"
        title="Declaration"
        description="Maturity is recorded by the founder. It is not inferred from whether a route renders."
      >
        <RecordCard>
          <dl>
            <Field label="Declared maturity">
              {TEMPLATE_MATURITY_META[template.maturity].label}
            </Field>
            <Field label="Meaning">{TEMPLATE_MATURITY_META[template.maturity].definition}</Field>
            <Field label="Implementing routes">
              {template.implementingRoutes.length === 0
                ? "None. No route in this build claims this template."
                : template.implementingRoutes.join(", ")}
            </Field>
            <Field label="Evidence limit">
              A route reference shows that a surface exists. It does not show that the required
              anatomy below is satisfied, and no automated check asserts that.
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section
        id="anatomy"
        title="Required anatomy"
        description="A surface that omits any of these is not an instance of this template."
      >
        <ValueList items={template.requiredAnatomy} />
      </Section>

      {blueprint ? (
        <Section
          id="blueprint"
          title={`Blueprint: ${blueprint.name}`}
          description={`${blueprint.viewport}. ${blueprint.purpose}`}
        >
          <RegistryTable
            caption={`${blueprint.name} regions with coordinates, measure, and behavior.`}
            headers={["Region", "Coordinates", "Measure", "Behavior"]}
          >
            {blueprint.regions.map((region) => (
              <tr key={region.region}>
                <RowHeader>{region.region}</RowHeader>
                <Cell>
                  <span className="font-mono text-xs">{region.coordinates}</span>
                </Cell>
                <Cell>{region.measure}</Cell>
                <Cell>{region.behavior}</Cell>
              </tr>
            ))}
          </RegistryTable>
        </Section>
      ) : (
        <Section id="blueprint" title="Blueprint">
          <p className="measure text-sm text-muted-foreground">
            No coordinate blueprint is recorded for this template. Placement has not been specified,
            so none is shown here rather than invented.
          </p>
        </Section>
      )}

      <Section
        id="open-unknowns"
        title="Open unknowns"
        description="Recorded shortfalls and unanswered questions. An empty list would itself be a claim."
      >
        <ValueList items={template.openUnknowns} />
      </Section>
    </>
  );
}
