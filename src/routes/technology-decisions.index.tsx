import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { ReviewQueueTable } from "@/components/technology-decisions/drift-review";
import { RELATION_LABEL, applyReviewFilters } from "@/lib/drift-review-view";
import {
  driftAnalysisDocument,
  mandatoryCohort,
  nonIdenticalRecords,
  representativeSample,
} from "@/lib/technology-decision-drift";
import {
  DECISION_PROCESS,
  SOURCE_REGISTER,
  describeOptions,
  registerTotals,
  roleGroups,
} from "@/lib/technology-decision-registry";

const TOTALS = registerTotals();
const GROUPS = roleGroups();

const ANALYSIS = driftAnalysisDocument();
const NON_IDENTICAL = nonIdenticalRecords();
const MANDATORY = mandatoryCohort();
const SAMPLE = representativeSample();

const RELATION_ROWS = Object.entries(ANALYSIS.totals.relations).sort((a, b) => b[1] - a[1]);
const CAUSE_ROWS = Object.entries(ANALYSIS.totals.candidate_causes).sort((a, b) => b[1] - a[1]);

const searchSchema = z.object({
  relation: z.string().default("all"),
  risk: z.string().default("all"),
  group: z.string().default("all"),
  cohort: z.string().default("all"),
});

const DERIVED_ROWS = Object.entries(TOTALS.derivedOptions).sort((a, b) => b[1] - a[1]);
export const Route = createFileRoute("/technology-decisions/")({
  validateSearch: searchSchema,
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
            <Cell>
              One record per analyzed workflow row, with all eighteen supplied fields intact.
            </Cell>
          </tr>
          <tr>
            <RowHeader>Role groups</RowHeader>
            <Cell>{TOTALS.groups}</Cell>
            <Cell>One worksheet per group in the supplied source.</Cell>
          </tr>
          <tr>
            <RowHeader>Roles counted within groups</RowHeader>
            <Cell>{TOTALS.rolesCountedInGroups}</Cell>
            <Cell>
              Distinct role labels inside each group, summed. Matches the declared inventory.
            </Cell>
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
        title="Where the two readings differ"
        description="A relation is a statement about two option sets, not a verdict on either. The supplied recommendation is preserved verbatim on every workflow page."
      >
        <RegistryTable
          caption="Resolved comparison relation between the derived option set and the supplied recommendation."
          headers={["Relation", "What it means", "Workflows"]}
        >
          {RELATION_ROWS.map(([relation, count]) => (
            <tr key={relation}>
              <RowHeader>{relation}</RowHeader>
              <Cell>{RELATION_LABEL[relation as keyof typeof RELATION_LABEL] ?? relation}</Cell>
              <Cell>{count}</Cell>
            </tr>
          ))}
        </RegistryTable>
        <RegistryTable
          caption="Candidate causes a reviewer should consider. Non-exclusive: one record may carry several."
          headers={["Candidate cause", "Workflows"]}
        >
          {CAUSE_ROWS.map(([cause, count]) => (
            <tr key={cause}>
              <RowHeader>{cause}</RowHeader>
              <Cell>{count}</Cell>
            </tr>
          ))}
        </RegistryTable>
        <RegistryTable
          caption="Review populations prepared for the owner."
          headers={["Population", "Records", "Handling"]}
        >
          <tr>
            <RowHeader>Non-identical</RowHeader>
            <Cell>{NON_IDENTICAL.length}</Cell>
            <Cell>Analyzed in full. None resolved.</Cell>
          </tr>
          <tr>
            <RowHeader>Individual review required</RowHeader>
            <Cell>{MANDATORY.length}</Cell>
            <Cell>
              Risk, consequence, AI boundary, or student and family exposure. Never batched.
            </Cell>
          </tr>
          <tr>
            <RowHeader>Representative sample</RowHeader>
            <Cell>{SAMPLE.selected.length}</Cell>
            <Cell>Deterministic maximum-coverage selection for calibration reading.</Cell>
          </tr>
          <tr>
            <RowHeader>Batched proposals</RowHeader>
            <Cell>{ANALYSIS.batches.length}</Cell>
            <Cell>Grouped only where the proposal basis is identical in every dimension.</Cell>
          </tr>
        </RegistryTable>
      </Section>

      <Section
        id="review"
        title="Owner review queue"
        description="Every record below is analysis awaiting owner review. Nothing here records a disposition, and no control on this page can."
      >
        <ReviewQueue />
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

const RELATION_OPTIONS = Object.keys(RELATION_LABEL);
const RISK_OPTIONS = ["high", "moderate", "low", "unstated"];

/**
 * Filters are URL search parameters submitted with a plain form, so a review
 * position survives a reload, can be shared, and works without client state.
 */
function ReviewQueue() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const filtered = applyReviewFilters(NON_IDENTICAL, search);

  return (
    <div className="space-y-4">
      <form
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          void navigate({
            search: {
              relation: String(data.get("relation") ?? "all"),
              risk: String(data.get("risk") ?? "all"),
              group: String(data.get("group") ?? "all"),
              cohort: String(data.get("cohort") ?? "all"),
            },
          });
        }}
      >
        <label className="text-sm font-semibold">
          Relation
          <select
            name="relation"
            defaultValue={search.relation}
            className="mt-1 block w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          >
            <option value="all">All relations</option>
            {RELATION_OPTIONS.map((relation) => (
              <option key={relation} value={relation}>
                {relation}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Risk level
          <select
            name="risk"
            defaultValue={search.risk}
            className="mt-1 block w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          >
            <option value="all">All risk levels</option>
            {RISK_OPTIONS.map((risk) => (
              <option key={risk} value={risk}>
                {risk}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Role group
          <select
            name="group"
            defaultValue={search.group}
            className="mt-1 block w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          >
            <option value="all">All role groups</option>
            {GROUPS.map((group) => (
              <option key={group.role_group_id} value={group.role_group_id}>
                {group.role_group_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Cohort
          <select
            name="cohort"
            defaultValue={search.cohort}
            className="mt-1 block w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          >
            <option value="all">All non-identical records</option>
            <option value="mandatory">Individual review required</option>
            <option value="batch">Batch eligible</option>
            <option value="needs-evidence">Needs evidence</option>
          </select>
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:col-span-2 lg:col-span-1"
        >
          Apply filters
        </button>
      </form>
      <p aria-live="polite" className="measure text-sm text-muted-foreground">
        Showing {filtered.length} of {NON_IDENTICAL.length} non-identical records. None has an owner
        disposition.
      </p>
      <ReviewQueueTable records={filtered} />
    </div>
  );
}
