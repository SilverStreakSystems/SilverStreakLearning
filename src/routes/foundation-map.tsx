import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section, RegistryTable, Cell, RowHeader } from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { StateChip } from "@/components/governance/state-chip";
import { SyntheticMarker } from "@/components/governance/markers";
import { FOUNDATION_LAYERS, artifactsForLayer } from "@/fixtures";
import { RECORD_STATE_LABEL } from "@/domain";

export const Route = createFileRoute("/foundation-map")({
  head: () => ({
    meta: [
      { title: "Foundation Map | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "The layered SSLS foundation from North Star through implementation, with the authority state of every artifact attached to each layer.",
      },
      { property: "og:title", content: "Foundation Map | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Inspect each foundation layer and the artifacts recorded against it.",
      },
    ],
  }),
  component: FoundationMap,
});

const FLOW = [
  "North Star",
  "Doctrine",
  "Governance and cross-cutting standards",
  "Enterprise capabilities",
  "Enterprise operating model",
  "Product and domain architecture",
  "Knowledge and educational systems",
  "Technical and governance platform",
  "Implementation, validation, release, operations",
];

function FoundationMap() {
  return (
    <div>
      <PageHeader
        title="Foundation Map"
        summary="The foundation reads downward from the North Star to operations. A layer below does not gain authority from a layer above; each artifact carries its own declared authority."
      />

      <Section
        id="flow"
        title="Descent from North Star to operations"
        description="Read top to bottom. Each step names what the next step must answer to."
      >
        <ol className="space-y-2">
          {FLOW.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-md border border-border bg-surface p-3"
            >
              <span
                aria-hidden="true"
                className="font-mono text-xs font-bold text-muted-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-sm font-semibold">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="layer-table"
        title="Layer table"
        description="Labels L0 through L7 are preserved exactly as issued. The count discrepancy is recorded as finding FND-001 rather than renumbered."
      >
        <RegistryTable
          caption="Foundation layers with declared state, authority, and promotion requirement"
          headers={["Layer", "Name", "Declared state", "Declared authority", "Promotion requirement"]}
        >
          {FOUNDATION_LAYERS.map((layer) => (
            <tr key={layer.id}>
              <RowHeader>{layer.id}</RowHeader>
              <Cell>{layer.name}</Cell>
              <Cell>{RECORD_STATE_LABEL[layer.declaredState]}</Cell>
              <Cell>
                <AuthorityBadge authorityClass={layer.declaredAuthority} />
              </Cell>
              <Cell className="text-muted-foreground">{layer.promotionRequirement}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="layer-detail"
        title="Artifacts attached to each layer"
        description="An artifact may touch several layers. Its authority does not change with the layer it is viewed from."
      >
        <div className="space-y-4">
          {FOUNDATION_LAYERS.map((layer) => {
            const artifacts = artifactsForLayer(layer.id);
            return (
              <RecordCard key={layer.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {layer.id} — {layer.name}
                  </h3>
                  <AuthorityBadge authorityClass={layer.declaredAuthority} />
                </div>
                <p className="measure mt-2 text-sm text-muted-foreground">{layer.purpose}</p>

                {artifacts.length === 0 ? (
                  <p className="mt-3 text-sm">
                    <StateChip state="unknown" /> No artifacts recorded against this layer.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {artifacts.map((artifact) => (
                      <li
                        key={artifact.id}
                        className="flex flex-wrap items-center gap-2 border-t border-border pt-2 text-sm"
                      >
                        <span className="font-semibold">{artifact.id}</span>
                        <span>{artifact.title}</span>
                        <AuthorityBadge authorityClass={artifact.authorityClass} />
                        <StateChip state={artifact.evidenceBasis} />
                        {artifact.synthetic ? <SyntheticMarker /> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </RecordCard>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
