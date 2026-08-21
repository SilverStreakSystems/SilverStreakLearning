import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { SOURCE_REGISTER } from "@/lib/technology-decision-registry";

export const Route = createFileRoute("/technology-decisions/sources")({
  head: () => ({
    meta: [
      { title: "Sources and Provenance | SSLS" },
      {
        name: "description",
        content:
          "The owner-supplied artifacts behind the decision register, with digests, authority role, and the limitations that travel with them.",
      },
      { property: "og:title", content: "Sources and Provenance | SSLS" },
      {
        property: "og:description",
        content: "Supplied analysis is planning input, not validated district practice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  return (
    <div>
      <PageHeader
        title="Sources and provenance"
        summary="Every workflow record traces to a registered artifact, a worksheet, a row number, and a row digest. The limitations below travel with the analysis wherever it is shown."
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions">Overview</SubNavLink>
          <SubNavLink to="/technology-decisions/roles">Roles and workflows</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section id="boundary" title="Source boundary">
        <p className="measure text-sm text-muted-foreground">{SOURCE_REGISTER.source_boundary}</p>
        <p className="measure mt-3 text-sm text-muted-foreground">
          {SOURCE_REGISTER.retention_limitation}
        </p>
      </Section>

      <Section id="artifacts" title="Registered artifacts">
        <RegistryTable
          caption="Owner-supplied artifacts with digests and authority."
          headers={["Artifact", "File", "Digest", "Authority", "Role in the register"]}
        >
          {SOURCE_REGISTER.records.map((artifact) => (
            <tr key={artifact.source_artifact_id}>
              <RowHeader>{artifact.source_artifact_id}</RowHeader>
              <Cell>
                {artifact.filename} ({artifact.byte_size.toLocaleString()} bytes)
              </Cell>
              <Cell>
                <code className="text-xs break-all">{artifact.sha256}</code>
              </Cell>
              <Cell>{artifact.authority_role}</Cell>
              <Cell>{artifact.role}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="limitations"
        title="Limitations carried by each artifact"
        description="Stated once here and never dropped when the analysis is displayed."
      >
        <div className="grid gap-4">
          {SOURCE_REGISTER.records.map((artifact) => (
            <article
              key={artifact.source_artifact_id}
              className="rounded-md border border-border bg-surface p-4"
            >
              <h3 className="font-display text-base font-semibold">
                {artifact.source_artifact_id} — {artifact.filename}
              </h3>
              <ul className="measure mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {artifact.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="reconciliation" title="Reconciliation against the supplied summary">
        <dl className="rounded-md border border-border bg-surface p-4 text-sm">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Method
          </dt>
          <dd className="measure mt-1">{SOURCE_REGISTER.reconciliation.method}</dd>
          <dt className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Expected versus observed
          </dt>
          <dd className="measure mt-1">{SOURCE_REGISTER.reconciliation.expected_vs_observed}</dd>
          <dt className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Explained difference
          </dt>
          <dd className="measure mt-1">{SOURCE_REGISTER.reconciliation.explained_difference}</dd>
          <dt className="mt-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Unresolved
          </dt>
          <dd className="measure mt-1">
            {SOURCE_REGISTER.reconciliation.unresolved.length === 0
              ? "Nothing unresolved."
              : SOURCE_REGISTER.reconciliation.unresolved.join(" ")}
          </dd>
        </dl>
      </Section>
    </div>
  );
}
