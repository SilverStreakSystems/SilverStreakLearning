import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { Field, GatedPanel, ValueList } from "@/components/governance/markers";
import {
  ConformanceChip,
  DesignSystemViewTabs,
  MaturityChip,
  ValidationChip,
} from "@/components/governance/design-system-controls";
import {
  parseDesignSystemSearch,
  type DesignSystemSearch,
} from "@/components/governance/design-system-view-model";
import {
  SSLSConstellation,
  SSLSLockup,
  SSLSMonogram,
  SSLSStar,
  SSLSTrajectory,
} from "@/components/brand";
import {
  ACCESSIBILITY_REQUIREMENTS,
  BRAND_ASSETS,
  COMPONENT_GEOMETRY,
  CONFORMANCE_CHECKS,
  COORDINATE_CONTRACTS,
  DESIGN_TOKENS,
  ENTERPRISE_WORKSPACE_TEMPLATES,
  EXPERIENCE_ARCHITECTURE_LAYERS,
  EXPERIENCE_FAMILIES,
  INTERFACE_TEMPLATES,
  MOTION_REFUSALS,
  MOTION_TOKENS,
  PAGE_BLUEPRINTS,
  STATE_TEMPLATES,
  TYPE_ROLES,
  VALIDATION_VIEWPORTS,
  VIEWPORT_BANDS,
  VISUAL_SYSTEM_REFUSALS,
} from "@/fixtures";
import {
  DENSITY_PROFILE_LABEL,
  GRID_COLUMNS,
  REFUSED_STATUS_LANGUAGE,
  STATUS_LANGUAGE,
  TEMPLATE_MATURITIES,
  TEMPLATE_MATURITY_META,
  unrecordedValidationViewports,
} from "@/domain";

export const Route = createFileRoute("/design-system/")({
  validateSearch: parseDesignSystemSearch,
  head: () => ({
    meta: [
      { title: "Brand Visual System and Experience Template Architecture | SSLS" },
      {
        name: "description",
        content:
          "Governed SSLS design tokens, brand asset provenance, coordinate grid, eighteen interface templates, state templates, and honest conformance status.",
      },
      {
        property: "og:title",
        content: "Brand Visual System and Experience Template Architecture | SSLS",
      },
      {
        property: "og:description",
        content:
          "Declared template maturity, recorded provenance, and an unvalidated responsive matrix stated as unvalidated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignSystemPage,
});

function ViewHeading({ children }: { children: string }) {
  return <h2 className="font-display text-xl font-semibold">{children}</h2>;
}

function DesignSystemPage() {
  const search = Route.useSearch() as DesignSystemSearch;

  return (
    <>
      <PageHeader
        title="Brand Visual System and Experience Template Architecture v0.1"
        summary="The governed visual and interface layer: one token source, brand assets with recorded provenance, a coordinate planning grid, and eighteen interface templates whose maturity is declared rather than inferred from the fact that a screen renders."
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-6 items-center rounded-sm border border-dashed border-border-strong bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Working direction. Not promoted to canonical.
          </span>
          <div className="signal-rule w-40" aria-hidden="true" />
        </div>
      </PageHeader>

      <DesignSystemViewTabs current={search.view} search={search} />

      <div className="mt-6">
        {search.view === "overview" ? <OverviewView /> : null}
        {search.view === "tokens" ? <TokensView /> : null}
        {search.view === "typography" ? <TypographyView /> : null}
        {search.view === "grid" ? <GridView /> : null}
        {search.view === "assets" ? <AssetsView /> : null}
        {search.view === "templates" ? <TemplatesView search={search} /> : null}
        {search.view === "workspaces" ? <WorkspacesView /> : null}
        {search.view === "families" ? <FamiliesView /> : null}
        {search.view === "blueprints" ? <BlueprintsView /> : null}
        {search.view === "states" ? <StatesView /> : null}
        {search.view === "motion" ? <MotionView /> : null}
        {search.view === "accessibility" ? <AccessibilityView /> : null}
        {search.view === "conformance" ? <ConformanceView /> : null}
      </div>
    </>
  );
}

/* --------------------------------------------------------------- overview */

function OverviewView() {
  const counts = TEMPLATE_MATURITIES.map((maturity) => ({
    maturity,
    count: INTERFACE_TEMPLATES.filter((template) => template.maturity === maturity).length,
  }));

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="font-display text-xl font-semibold">
        Composition layers
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Experiences are composed from shared templates over governed objects. A founder, an
        educator, and a family member may see the same record differently because the projection
        changes, not because the system created a second truth.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="The eight composition layers, from primitive token to product experience."
          headers={["Layer", "Responsibility", "Examples"]}
        >
          {EXPERIENCE_ARCHITECTURE_LAYERS.map((layer) => (
            <tr key={layer.layerId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">{layer.layerId}</span>
                <span className="block">{layer.name}</span>
              </RowHeader>
              <Cell>{layer.responsibility}</Cell>
              <Cell>{layer.examples.join(", ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section
        id="maturity"
        title="Declared maturity"
        description="Maturity is a recorded field. It is never derived from implementation status, test success, or the existence of a route."
      >
        <RegistryTable
          caption="Template maturity labels and how many interface templates carry each one."
          headers={["Label", "Meaning", "Interface templates"]}
        >
          {counts.map(({ maturity, count }) => (
            <tr key={maturity}>
              <RowHeader>
                <MaturityChip maturity={maturity} />
              </RowHeader>
              <Cell>{TEMPLATE_MATURITY_META[maturity].definition}</Cell>
              <Cell className="text-right tabular-nums">{count}</Cell>
            </tr>
          ))}
        </RegistryTable>
        <p className="measure mt-3 text-sm text-muted-foreground">
          These counts are a census of declared labels. They are not a completeness score, and this
          workspace refuses to publish one.
        </p>
      </Section>

      <Section
        id="refusals"
        title="Claims this increment refuses"
        description="Recorded so they cannot be quietly reintroduced later."
      >
        <ul className="space-y-3">
          {VISUAL_SYSTEM_REFUSALS.map((refusal) => (
            <li key={refusal.refusalId}>
              <RecordCard>
                <p className="font-mono text-xs text-muted-foreground">{refusal.refusalId}</p>
                <p className="mt-1 font-semibold">Refused claim: {refusal.claim}</p>
                <p className="measure mt-1 text-sm text-muted-foreground">{refusal.reason}</p>
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>
    </section>
  );
}

/* ----------------------------------------------------------------- tokens */

function TokensView() {
  const groups = [...new Set(DESIGN_TOKENS.map((token) => token.group))];
  return (
    <section aria-labelledby="tokens-heading">
      <h2 id="tokens-heading" className="font-display text-xl font-semibold">
        Design tokens
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Every visual value lives in <code className="font-mono text-xs">src/styles.css</code>. Route
        components consume tokens; they do not carry their own hex codes or one-off pixel values.
      </p>

      {groups.map((group) => (
        <Section
          key={group}
          id={`tokens-${group.toLowerCase().replace(/\s+/g, "-")}`}
          title={group}
        >
          <RegistryTable
            caption={`${group} tokens, their values, and their intended use.`}
            headers={["Token", "Value", "Use"]}
          >
            {DESIGN_TOKENS.filter((token) => token.group === group).map((token) => (
              <tr key={token.name}>
                <RowHeader>
                  <span className="font-mono text-xs">{token.name}</span>
                </RowHeader>
                <Cell>
                  <span className="flex items-center gap-2">
                    {group.endsWith("color") ? (
                      <span
                        aria-hidden="true"
                        className="inline-block h-5 w-5 shrink-0 rounded-sm border border-border-strong"
                        style={{ backgroundColor: `var(${token.name})` }}
                      />
                    ) : null}
                    <span className="font-mono text-xs">{token.value}</span>
                  </span>
                </Cell>
                <Cell>{token.use}</Cell>
              </tr>
            ))}
          </RegistryTable>
        </Section>
      ))}

      <Section
        id="gradient-rule"
        title="Gradient rule"
        description="The extended gradient is a signal layer, not a page fill."
      >
        <RecordCard>
          <div className="signal-rule w-full" aria-hidden="true" />
          <p className="measure mt-3 text-sm">
            Permitted: thin progress and signal treatments where the gradient stays legible.
            Refused: full-page gradient fills, gradient hero wallpaper, and gradient text on
            operational surfaces.
          </p>
        </RecordCard>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------- typography */

function TypographyView() {
  return (
    <section aria-labelledby="typography-heading">
      <h2 id="typography-heading" className="font-display text-xl font-semibold">
        Typography and text geometry
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Poppins carries display and headings, Plus Jakarta Sans carries body and interface text, and
        JetBrains Mono carries identifiers and metadata so they never read as prose.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="Type roles with intended font, weight, desktop size, fluid rule, and alignment."
          headers={["Role", "Font", "Weight", "Desktop size", "Fluid rule", "Alignment"]}
        >
          {TYPE_ROLES.map((role) => (
            <tr key={role.role}>
              <RowHeader>{role.role}</RowHeader>
              <Cell>{role.font}</Cell>
              <Cell>{role.weight}</Cell>
              <Cell>{role.desktopSize}</Cell>
              <Cell>
                <span className="font-mono text-xs">{role.fluidRule}</span>
              </Cell>
              <Cell>{role.alignment}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section id="type-specimen" title="Specimen">
        <RecordCard>
          <p className="font-display" style={{ fontSize: "var(--text-h1)" }}>
            Make Learning Visible
          </p>
          <p className="measure mt-3" style={{ fontSize: "var(--text-body)" }}>
            Reduce the distance between information and action. Operational prose is left aligned,
            never justified, and lives inside a reading column of roughly 65 to 75 characters rather
            than spanning the full canvas.
          </p>
          <p className="mt-3 font-mono" style={{ fontSize: "var(--text-meta)" }}>
            TPL-06 · Record Detail · identifiers use tabular mono
          </p>
        </RecordCard>
      </Section>

      <Section id="alignment-rules" title="Alignment rules">
        <ValueList
          items={[
            "Long prose is left aligned and never fully justified.",
            "Table text is left aligned; numeric data is right aligned.",
            "Button labels are centered inside the control.",
            "Center alignment is permitted only on hero and title surfaces.",
            "Operational instructions are never centered.",
          ]}
        />
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------------- grid */

function GridView() {
  return (
    <section aria-labelledby="grid-heading">
      <h2 id="grid-heading" className="font-display text-xl font-semibold">
        Battleship coordinate grid
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Every page is a coordinate field: twelve columns labelled A to L and twelve conceptual rows.
        Placement is stated as a coordinate range so it can be reviewed without the phrase "move it
        a little to the left".
      </p>

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-surface p-3">
        <div
          className="grid min-w-[36rem] gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS.length}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {GRID_COLUMNS.map((column) => (
            <div
              key={column}
              className="rounded-sm border border-dashed border-border-strong bg-muted py-2 text-center font-mono text-xs"
            >
              {column}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Columns A to L, with rows 1 to 12. Tablet reduces to eight columns, mobile to four. Each
          cell subdivides into the 4px micro grid.
        </p>
      </div>

      <Section id="viewport-bands" title="Grid dimensions by viewport">
        <RegistryTable
          caption="Viewport bands with column count, gutters, content ceiling, and shell behavior."
          headers={[
            "Band",
            "Columns",
            "Outer gutter",
            "Column gap",
            "Max content",
            "Shell",
            "Content",
          ]}
        >
          {VIEWPORT_BANDS.map((band) => (
            <tr key={band.bandId}>
              <RowHeader>{band.range}</RowHeader>
              <Cell className="text-right tabular-nums">{band.columns}</Cell>
              <Cell>{band.outerGutter}</Cell>
              <Cell>{band.columnGap}</Cell>
              <Cell>{band.maxContent}</Cell>
              <Cell>{band.shellBehavior}</Cell>
              <Cell>{band.contentBehavior}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="coordinate-contracts"
        title="Coordinate contracts"
        description="Shared region placement that every template inherits."
      >
        <RegistryTable
          caption="Region coordinates at desktop, tablet, and mobile."
          headers={["Region", "Desktop", "Tablet", "Mobile"]}
        >
          {COORDINATE_CONTRACTS.map((contract) => (
            <tr key={contract.region}>
              <RowHeader>{contract.region}</RowHeader>
              <Cell>
                <span className="font-mono text-xs">{contract.desktop}</span>
              </Cell>
              <Cell>
                <span className="font-mono text-xs">{contract.tablet}</span>
              </Cell>
              <Cell>
                <span className="font-mono text-xs">{contract.mobile}</span>
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="component-geometry" title="Component geometry">
        <RegistryTable
          caption="Component heights, effective targets, radius, and padding."
          headers={["Component", "Height or size", "Minimum target", "Radius", "Padding", "Notes"]}
        >
          {COMPONENT_GEOMETRY.map((record) => (
            <tr key={record.component}>
              <RowHeader>{record.component}</RowHeader>
              <Cell>{record.height}</Cell>
              <Cell className="text-right tabular-nums">
                {record.minTargetPx === null ? "Not interactive" : `${record.minTargetPx}px`}
              </Cell>
              <Cell>{record.radius}</Cell>
              <Cell>{record.padding}</Cell>
              <Cell>{record.notes}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </section>
  );
}

/* ----------------------------------------------------------------- assets */

function AssetsView() {
  return (
    <section aria-labelledby="assets-heading">
      <h2 id="assets-heading" className="font-display text-xl font-semibold">
        Brand assets and provenance
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        These components are reference geometry drawn from the specification. No validated vector
        master is recorded in this repository, so nothing here is a production asset.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RecordCard>
          <h3 className="font-display text-lg font-semibold">Monogram</h3>
          <div className="mt-3 rounded-md bg-ssls-midnight p-4 text-ssls-silver-blue">
            <SSLSMonogram size={64} title="Silver Streak Learning Systems" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Minimum compact digital size 32px. Navigation use 32 to 44px high.
          </p>
        </RecordCard>

        <RecordCard>
          <h3 className="font-display text-lg font-semibold">Horizontal lockup</h3>
          <div className="mt-3 rounded-md bg-ssls-midnight p-4 text-ssls-ice-blue">
            <SSLSLockup descriptor="Integrated Foundation and Authority Shell" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            The organization name is HTML text, so it remains selectable, translatable, and
            responsive.
          </p>
        </RecordCard>

        <RecordCard>
          <h3 className="font-display text-lg font-semibold">Four-point star</h3>
          <div className="mt-3 flex items-end gap-4 rounded-md bg-ssls-midnight p-4 text-ssls-signal-cyan">
            <SSLSStar size={16} />
            <SSLSStar size={32} />
            <SSLSStar size={56} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Inline signal 12 to 16px, icon 20 to 32px, hero endpoint 40 to 72px. No continuous
            animation.
          </p>
        </RecordCard>

        <RecordCard>
          <h3 className="font-display text-lg font-semibold">Trajectory and constellation</h3>
          <div className="mt-3 rounded-md bg-ssls-midnight p-4 text-ssls-signal-cyan">
            <SSLSTrajectory />
            <SSLSConstellation className="mt-2 text-ssls-silver-blue" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Decorative instances are hidden from assistive technology. A data-derived trajectory
            would need a labelled endpoint and a stated source.
          </p>
        </RecordCard>
      </div>

      <Section id="asset-matrix" title="Asset export matrix">
        <RegistryTable
          caption="Required exports per asset, with the component and provenance that back them."
          headers={[
            "Asset",
            "Component",
            "SVG",
            "PNG sizes",
            "Backgrounds",
            "Decorative only",
            "Notes",
          ]}
        >
          {BRAND_ASSETS.map((asset) => (
            <tr key={asset.assetId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">{asset.assetId}</span>
                <span className="block">{asset.name}</span>
              </RowHeader>
              <Cell>
                <span className="font-mono text-xs">{asset.componentName}</span>
              </Cell>
              <Cell>{asset.svg}</Cell>
              <Cell>{asset.pngSizes}</Cell>
              <Cell>{asset.backgroundVariants}</Cell>
              <Cell>{asset.decorativeOnly ? "Yes, aria-hidden" : "No"}</Cell>
              <Cell>
                <span className="block">{asset.notes}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{asset.provenance}</span>
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </section>
  );
}

/* -------------------------------------------------------------- templates */

function TemplatesView({ search }: { search: DesignSystemSearch }) {
  const query = search.q.trim().toLowerCase();
  const templates = INTERFACE_TEMPLATES.filter((template) => {
    const matchesMaturity = search.maturity === "all" || template.maturity === search.maturity;
    const matchesQuery =
      query.length === 0 || `${template.name} ${template.primaryJob}`.toLowerCase().includes(query);
    return matchesMaturity && matchesQuery;
  });

  return (
    <section aria-labelledby="templates-heading">
      <h2 id="templates-heading" className="font-display text-xl font-semibold">
        Universal interface templates
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Eighteen templates, each with a stated job, a required anatomy, and a declared maturity. A
        template cannot claim implementation without naming the route that provides the evidence.
      </p>

      <nav aria-label="Filter templates by maturity" className="mt-4">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              to="/design-system"
              search={{ ...search, maturity: "all" }}
              aria-current={search.maturity === "all" ? "true" : undefined}
              className={
                search.maturity === "all"
                  ? "inline-flex min-h-11 items-center rounded-sm border-2 border-border-strong bg-muted px-3 text-sm font-semibold"
                  : "inline-flex min-h-11 items-center rounded-sm border border-border px-3 text-sm hover:bg-muted"
              }
            >
              All maturities
            </Link>
          </li>
          {TEMPLATE_MATURITIES.map((maturity) => (
            <li key={maturity}>
              <Link
                to="/design-system"
                search={{ ...search, maturity }}
                aria-current={search.maturity === maturity ? "true" : undefined}
                className={
                  search.maturity === maturity
                    ? "inline-flex min-h-11 items-center rounded-sm border-2 border-border-strong bg-muted px-3 text-sm font-semibold"
                    : "inline-flex min-h-11 items-center rounded-sm border border-border px-3 text-sm hover:bg-muted"
                }
              >
                {TEMPLATE_MATURITY_META[maturity].label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-3 text-sm" role="status">
        {templates.length} of {INTERFACE_TEMPLATES.length} templates shown.
      </p>

      {templates.length === 0 ? (
        <RecordCard className="mt-4">
          <h3 className="font-display text-lg font-semibold">No templates match this filter</h3>
          <p className="measure mt-1 text-sm text-muted-foreground">
            The registry holds eighteen templates; the current maturity filter excludes all of them.
            This is a filter result, not a system failure.
          </p>
          <p className="mt-3">
            <Link
              to="/design-system"
              search={{ ...search, maturity: "all" }}
              className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-3 font-semibold underline underline-offset-4"
            >
              Reset the maturity filter
            </Link>
          </p>
        </RecordCard>
      ) : (
        <div className="mt-4">
          <RegistryTable
            caption="Interface templates with primary job, required anatomy, declared maturity, and implementing routes."
            headers={[
              "Template",
              "Primary job",
              "Required anatomy",
              "Maturity",
              "Implementing routes",
            ]}
          >
            {templates.map((template) => (
              <tr key={template.templateId}>
                <RowHeader>
                  <span className="font-mono text-xs text-muted-foreground">
                    {template.templateId}
                  </span>
                  <Link
                    to="/design-system/templates/$templateId"
                    params={{ templateId: template.templateId }}
                    className="block underline underline-offset-4"
                  >
                    {template.name}
                  </Link>
                </RowHeader>
                <Cell>{template.primaryJob}</Cell>
                <Cell>{template.requiredAnatomy.join(", ")}</Cell>
                <Cell>
                  <MaturityChip maturity={template.maturity} />
                </Cell>
                <Cell>
                  {template.implementingRoutes.length === 0 ? (
                    <span className="text-muted-foreground">None</span>
                  ) : (
                    <span className="font-mono text-xs">
                      {template.implementingRoutes.join(", ")}
                    </span>
                  )}
                </Cell>
              </tr>
            ))}
          </RegistryTable>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------- workspaces */

function WorkspacesView() {
  return (
    <section aria-labelledby="workspaces-heading">
      <h2 id="workspaces-heading" className="font-display text-xl font-semibold">
        Nine enterprise workspace templates
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        These describe the target enterprise shell. They are implemented only to the extent the
        current build sequence authorizes.
      </p>

      <div className="mt-4">
        <GatedPanel
          title="Enterprise workspace shell"
          notice="Target-state architecture. No workspace below is authorized as a released capability, and none operates with more than one participant."
        >
          <RegistryTable
            caption="Workspace templates with their template family and declared maturity."
            headers={["Workspace", "Template family", "Maturity", "Note"]}
          >
            {ENTERPRISE_WORKSPACE_TEMPLATES.map((workspace) => (
              <tr key={workspace.workspaceId}>
                <RowHeader>
                  <span className="font-mono text-xs text-muted-foreground">
                    {workspace.workspaceId}
                  </span>
                  <span className="block">{workspace.name}</span>
                </RowHeader>
                <Cell>{workspace.templateFamily.join(", ")}</Cell>
                <Cell>
                  <MaturityChip maturity={workspace.maturity} />
                </Cell>
                <Cell>{workspace.note}</Cell>
              </tr>
            ))}
          </RegistryTable>
        </GatedPanel>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- families */

function FamiliesView() {
  return (
    <section aria-labelledby="families-heading">
      <h2 id="families-heading" className="font-display text-xl font-semibold">
        End-to-end experience families
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Density and emphasis change with acting capacity. Only the founder and developer family is
        implemented; every other family is specified or gated, and none may hold live learner data
        in this posture.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="Experience families with density, home experience, emphasis, and declared maturity."
          headers={[
            "Capacity",
            "Density",
            "Home experience",
            "Template emphasis",
            "Access emphasis",
            "Maturity",
          ]}
        >
          {EXPERIENCE_FAMILIES.map((family) => (
            <tr key={family.familyId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">{family.familyId}</span>
                <span className="block">{family.capacity}</span>
              </RowHeader>
              <Cell>{DENSITY_PROFILE_LABEL[family.density]}</Cell>
              <Cell>{family.homeExperience}</Cell>
              <Cell>{family.templateEmphasis}</Cell>
              <Cell>{family.accessibilityEmphasis}</Cell>
              <Cell>
                <MaturityChip maturity={family.maturity} />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section id="learner-projection-rules" title="Learner projection rules">
        <ValueList
          items={[
            "Strengths and assets appear before deficits.",
            "Language proficiency, disability, academic mastery, behavior, attendance, and wellbeing are never combined into one composite risk score.",
            "Source and freshness are shown for derived or imported data.",
            "Every sensitive projection states who can see it and why it is visible.",
            "A sentence or a table is preferred over a chart when it communicates the same thing more clearly.",
          ]}
        />
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------- blueprints */

function BlueprintsView() {
  return (
    <section aria-labelledby="blueprints-heading">
      <h2 id="blueprints-heading" className="font-display text-xl font-semibold">
        Page blueprints
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Region placement stated in grid coordinates, so a layout can be reviewed and reproduced
        rather than described.
      </p>

      {PAGE_BLUEPRINTS.map((blueprint) => (
        <Section
          key={blueprint.blueprintId}
          id={blueprint.blueprintId.toLowerCase()}
          title={blueprint.name}
          description={`${blueprint.viewport}. ${blueprint.purpose}`}
        >
          <RegistryTable
            caption={`${blueprint.name} regions with coordinates, measure, and behavior.`}
            headers={["Region", "Coordinates", "Measure", "Behavior"]}
          >
            {blueprint.regions.map((region) => (
              <tr key={`${blueprint.blueprintId}-${region.region}`}>
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
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ states */

function StatesView() {
  return (
    <section aria-labelledby="states-heading">
      <h2 id="states-heading" className="font-display text-xl font-semibold">
        Content and status state templates
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Every state says what happened, why, and what to do next. Refusal is presented as successful
        governance where that is the truth.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="Required content and visual rule for each state."
          headers={["State", "Required content", "Visual rule", "Status language"]}
        >
          {STATE_TEMPLATES.map((state) => (
            <tr key={state.stateId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">{state.stateId}</span>
                <span className="block">{state.name}</span>
              </RowHeader>
              <Cell>{state.requiredContent.join("; ")}</Cell>
              <Cell>{state.visualRule}</Cell>
              <Cell>{state.statusLanguage}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section id="state-examples" title="Rendered examples">
        <div className="grid gap-4 sm:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Empty</h3>
            <p className="measure mt-1 text-sm">
              No saved views exist yet. Saved views are not implemented in this posture, so this
              list is empty by design rather than by failure.
            </p>
            <p className="mt-2 text-sm font-semibold">
              Next action: use the maturity filter above.
            </p>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Permission denied</h3>
            <p className="measure mt-1 text-sm">
              Learner-level projections are not available. This workspace holds no personal data,
              and none is loaded into the page.
            </p>
            <p className="mt-2 text-sm font-semibold">
              Next action: review the posture at Settings and Boundaries.
            </p>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Stale or partial data</h3>
            <p className="measure mt-1 text-sm">
              Responsive validation results are missing for all nine required viewports.
            </p>
            <p className="mt-2 text-sm font-semibold">
              Freshness: no run recorded. This is partial information and is not presented as
              complete.
            </p>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Blocked dependency</h3>
            <p className="measure mt-1 text-sm">
              Canonical promotion of the constellation identity is blocked pending a validated
              vector master and an approved decision.
            </p>
            <p className="mt-2 text-sm font-semibold">
              Owner: founder. Next action: record the decision in the Decisions Register.
            </p>
          </RecordCard>
        </div>
      </Section>

      <Section
        id="status-language"
        title="Status language"
        description="Explicit words, not implied colors."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-semibold">Permitted</h3>
            <ValueList items={[...STATUS_LANGUAGE]} />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold">Refused</h3>
            <ValueList items={[...REFUSED_STATUS_LANGUAGE]} />
            <p className="measure mt-2 text-sm text-muted-foreground">
              "Good" usually means "we currently lack evidence of a problem", which is a different
              statement and must be written as one.
            </p>
          </div>
        </div>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------------ motion */

function MotionView() {
  return (
    <section aria-labelledby="motion-heading">
      <h2 id="motion-heading" className="font-display text-xl font-semibold">
        Motion and responsive behavior
      </h2>

      <div className="mt-4">
        <RegistryTable
          caption="Motion tokens with duration, easing, and use."
          headers={["Token", "Duration", "Easing", "Use"]}
        >
          {MOTION_TOKENS.map((token) => (
            <tr key={token.token}>
              <RowHeader>
                <span className="font-mono text-xs">{token.token}</span>
              </RowHeader>
              <Cell className="text-right tabular-nums">{token.durationMs}ms</Cell>
              <Cell>{token.easing}</Cell>
              <Cell>{token.use}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section id="motion-refusals" title="Motion refusals">
        <ValueList items={MOTION_REFUSALS} />
      </Section>

      <Section id="breakpoint-behavior" title="Breakpoint behavior">
        <RegistryTable
          caption="Shell and content behavior at each viewport band."
          headers={["Width", "Shell behavior", "Content behavior"]}
        >
          {VIEWPORT_BANDS.map((band) => (
            <tr key={`motion-${band.bandId}`}>
              <RowHeader>{band.range}</RowHeader>
              <Cell>{band.shellBehavior}</Cell>
              <Cell>{band.contentBehavior}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </section>
  );
}

/* ----------------------------------------------------------- accessibility */

function AccessibilityView() {
  const unrecorded = unrecordedValidationViewports(VALIDATION_VIEWPORTS);
  return (
    <section aria-labelledby="accessibility-heading">
      <h2 id="accessibility-heading" className="font-display text-xl font-semibold">
        Accessibility and validation requirements
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        The target is a WCAG 2.2 AA-informed implementation. This is not an independent conformance
        determination, and automated checks are evidence rather than certification.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="Accessibility requirements and their minimums."
          headers={["Requirement", "Minimum"]}
        >
          {ACCESSIBILITY_REQUIREMENTS.map((requirement) => (
            <tr key={requirement.requirementId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">
                  {requirement.requirementId}
                </span>
                <span className="block">{requirement.requirement}</span>
              </RowHeader>
              <Cell>{requirement.minimum}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section
        id="validation-matrix"
        title="Responsive validation matrix"
        description="A clamp() in the stylesheet is an intention, not a measurement."
      >
        <p className="measure mb-3 text-sm font-semibold" role="status">
          {unrecorded.length} of {VALIDATION_VIEWPORTS.length} viewports have no recorded result.
        </p>
        <RegistryTable
          caption="Required validation viewports and whether a run has been recorded."
          headers={["Viewport", "Width", "Result", "Recorded on"]}
        >
          {VALIDATION_VIEWPORTS.map((viewport) => (
            <tr key={viewport.viewportId}>
              <RowHeader>{viewport.label}</RowHeader>
              <Cell className="text-right tabular-nums">{viewport.width}px</Cell>
              <Cell>
                <ValidationChip result={viewport.result} />
              </Cell>
              <Cell>{viewport.recordedOn ?? "No run recorded"}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </section>
  );
}

/* ------------------------------------------------------------- conformance */

function ConformanceView() {
  return (
    <section aria-labelledby="conformance-heading">
      <h2 id="conformance-heading" className="font-display text-xl font-semibold">
        Definition of visual-system done
      </h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        Each check carries a status and the basis for that status. Unverified means nobody has
        looked, which is different from met.
      </p>

      <div className="mt-4">
        <RegistryTable
          caption="Conformance checks with status and basis."
          headers={["Check", "Status", "Basis"]}
        >
          {CONFORMANCE_CHECKS.map((check) => (
            <tr key={check.checkId}>
              <RowHeader>
                <span className="font-mono text-xs text-muted-foreground">{check.checkId}</span>
                <span className="block">{check.check}</span>
              </RowHeader>
              <Cell>
                <ConformanceChip status={check.status} />
              </Cell>
              <Cell>{check.basis}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </div>

      <Section id="conformance-note" title="Why there is no score">
        <RecordCard>
          <dl>
            <Field label="Refused">A single design-system completeness percentage.</Field>
            <Field label="Reason">
              It would merge declared maturity, implementation evidence, and validation results into
              one figure that cannot be examined or challenged.
            </Field>
            <Field label="Instead">
              Read the status column. Nine checks, each answerable on its own basis.
            </Field>
          </dl>
        </RecordCard>
      </Section>
    </section>
  );
}

export { ViewHeading };
