import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { HELP_CONTENT_KIND_META, governsWork } from "@/domain";
import { HELP_ENTRIES } from "@/fixtures";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Knowledge and Help | SSLS" },
      {
        name: "description",
        content:
          "Definitions, procedures, and boundary statements, with governing policy kept visibly separate from explanatory help.",
      },
      { property: "og:title", content: "Knowledge and Help | SSLS" },
      {
        property: "og:description",
        content: "Help text never governs. Policies, standards, procedures, and boundaries do.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const governing = HELP_ENTRIES.filter(governsWork);
  const explanatory = HELP_ENTRIES.filter((entry) => !governsWork(entry));

  return (
    <div>
      <PageHeader
        title="Knowledge and Help"
        summary="Two kinds of content live here, and the difference matters. Governing content constrains what may be done. Explanatory content only helps you read the system."
      />

      <Section
        id="governing"
        title="Governing content"
        description="These entries constrain work. Each carries a declared authority class and a version."
      >
        <RegistryTable
          caption="Governing help entries with kind, authority class, version, and source."
          headers={["Entry", "Kind", "Authority", "Version", "Source"]}
        >
          {governing.map((entry) => (
            <tr key={entry.entryId}>
              <RowHeader>
                {entry.title}
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {entry.body}
                </span>
              </RowHeader>
              <Cell>{HELP_CONTENT_KIND_META[entry.kind].label}</Cell>
              <Cell>{entry.authorityClass}</Cell>
              <Cell>{entry.version}</Cell>
              <Cell>{entry.source}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="explanatory"
        title="Explanatory content"
        description="Helpful, and deliberately non-binding. Nothing here may be cited as authority."
      >
        <RegistryTable
          caption="Explanatory help entries with kind and source."
          headers={["Entry", "Kind", "Source"]}
        >
          {explanatory.map((entry) => (
            <tr key={entry.entryId}>
              <RowHeader>
                {entry.title}
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {entry.body}
                </span>
              </RowHeader>
              <Cell>{HELP_CONTENT_KIND_META[entry.kind].label}</Cell>
              <Cell>{entry.source}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </div>
  );
}
