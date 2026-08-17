import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { SEARCH_DOMAIN_LABEL, SEARCH_LEAK_RULES, SURFACE_STATE_META } from "@/domain";
import { ACTIVE_CAPACITY, runSearch } from "@/lib/workspace-queries";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Universal Search | SSLS" },
      {
        name: "description",
        content:
          "Find any authorized governed record without leaking the existence of records this capacity may not retrieve.",
      },
      { property: "og:title", content: "Universal Search | SSLS" },
      {
        property: "og:description",
        content: "Authorization filters the candidate set before matching, ranking, or counting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [term, setTerm] = useState("");
  const outcome = runSearch({
    term,
    capacityId: ACTIVE_CAPACITY.capacityId,
    domain: "all",
    authority: "all",
    status: "all",
    freshness: "all",
    tense: "all",
  });
  const hint =
    outcome.surfaceStateHint === "normal"
      ? SURFACE_STATE_META.normal
      : outcome.surfaceStateHint === "no-results"
        ? SURFACE_STATE_META["no-results"]
        : SURFACE_STATE_META.empty;

  return (
    <div>
      <PageHeader
        title="Universal Search"
        summary="Searches the governed records this acting capacity is authorized to retrieve. Counts, facets, and suggestions are built from those records only."
      />

      <Section id="query" title="Search">
        <label htmlFor="search-term" className="block text-sm font-semibold">
          Search governed records
        </label>
        <input
          id="search-term"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          className="mt-2 min-h-11 w-full max-w-xl rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Decision, finding, evidence, workspace"
        />
        <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">
          <span className="font-mono text-xs">{hint.marker}</span> {outcome.authorizedMatchCount} authorized
          records match. {hint.meaning}
        </p>
        {outcome.withheldNotice ? (
          <p className="measure mt-1 text-sm text-muted-foreground">{outcome.withheldNotice}</p>
        ) : null}
      </Section>

      <Section id="results" title="Results">
        {outcome.results.length === 0 ? (
          <p className="measure text-sm text-muted-foreground">{hint.nextAction}</p>
        ) : (
          <RegistryTable
            caption="Authorized search results with authority, status, freshness, and provenance."
            headers={["Record", "Domain", "Authority", "Status", "Freshness", "Provenance"]}
          >
            {outcome.results.map((record) => (
              <tr key={`${record.domain}-${record.recordId}`}>
                <RowHeader>
                  <Link to={record.route}>{record.title}</Link>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {record.snippet}
                  </span>
                </RowHeader>
                <Cell>{SEARCH_DOMAIN_LABEL[record.domain]}</Cell>
                <Cell>{record.authorityClass}</Cell>
                <Cell>{record.status}</Cell>
                <Cell>{record.freshness}</Cell>
                <Cell>{record.provenance}</Cell>
              </tr>
            ))}
          </RegistryTable>
        )}
      </Section>

      <Section id="facets" title="Domains available to this capacity">
        <ul className="measure grid list-disc gap-1 pl-5 text-sm text-muted-foreground sm:grid-cols-2">
          {outcome.domainFacets.map((facet) => (
            <li key={facet.domain}>
              {SEARCH_DOMAIN_LABEL[facet.domain]}: {facet.count}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="leak-rules" title="What search may never reveal">
        <ul className="measure list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {SEARCH_LEAK_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
