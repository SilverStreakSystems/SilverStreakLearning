import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { StateChip } from "@/components/governance/state-chip";
import { SyntheticMarker } from "@/components/governance/markers";
import {
  CapabilityFilterBar,
  CapabilityViewTabs,
  GateChip,
  IndependenceChip,
  StageChip,
  type CapabilitySearch,
  CAPABILITY_VIEWS,
} from "@/components/governance/capability-controls";
import {
  CAPABILITY_DEPENDENCIES,
  DELIVERABLE_TYPES,
  ENTERPRISE_CAPABILITIES,
  NORMALIZATION_FINDINGS,
} from "@/fixtures";
import {
  CAPABILITY_DOMAINS,
  CAPABILITY_DOMAIN_META,
  CAPABILITY_TYPES,
  CAPABILITY_TYPE_LABEL,
  COVERAGE_MODE_LABEL,
  CURRENT_SCALE_STAGE,
  DEPENDENCY_KIND_LABEL,
  INDEPENDENCE_LABEL,
  MATURITY_LEVELS,
  MATURITY_LEVEL_LABEL,
  NORMALIZATION_KIND_LABEL,
  SCALE_STAGES,
  SCALE_STAGE_LABEL,
  TRIGGER_GATES,
  TRIGGER_GATE_META,
  type CapabilityDomainId,
  type CapabilityType,
  type IndependenceLevel,
  type MaturityLevel,
  type ScaleStage,
  type TriggerGate,
} from "@/domain";
import {
  coverageGroups,
  domainSummaries,
  filterCapabilities,
  gateGroups,
  independenceGroups,
  stageCounts,
} from "@/lib/capability-queries";

function asOption<T extends string>(value: unknown, allowed: readonly T[]): T | "all" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "all";
}

export const Route = createFileRoute("/capabilities/")({
  validateSearch: (search: Record<string, unknown>): CapabilitySearch => ({
    view: asOption(
      search["view"],
      CAPABILITY_VIEWS.map((v) => v.id),
    ) === "all"
      ? "registry"
      : (search["view"] as CapabilitySearch["view"]),
    domain: asOption<CapabilityDomainId>(search["domain"], CAPABILITY_DOMAINS),
    type: asOption<CapabilityType>(search["type"], CAPABILITY_TYPES),
    stage: asOption<ScaleStage>(search["stage"], SCALE_STAGES),
    gate: asOption<TriggerGate>(search["gate"], TRIGGER_GATES),
    independence: asOption<IndependenceLevel>(search["independence"], [
      "required",
      "conditional",
      "not-required",
    ]),
    maturity: asOption<MaturityLevel>(search["maturity"], MATURITY_LEVELS),
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Enterprise Capability Architecture v0.1 (Candidate) | SSLS" },
      {
        name: "description",
        content:
          "Candidate registry of SSLS enterprise capabilities across twelve domains, with independence rules, maturity stages, trigger gates, and dependencies.",
      },
      { property: "og:title", content: "Enterprise Capability Architecture v0.1 (Candidate) | SSLS" },
      {
        property: "og:description",
        content:
          "A governed candidate capability architecture. No record here carries implementation authority.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CapabilityCommandView,
});

function CapabilityCommandView() {
  const search = Route.useSearch();
  const filtered = filterCapabilities(ENTERPRISE_CAPABILITIES, search);

  return (
    <div>
      <PageHeader
        title="Enterprise Capability Architecture (Candidate)"
        summary={`Twelve candidate domains and ${ENTERPRISE_CAPABILITIES.length} candidate capability records. A capability is a durable organizational ability, not a role, a team, a process, or a product module.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass="research-candidate" />
          <SyntheticMarker />
          <span className="rounded-sm border border-border-strong bg-muted px-2 py-0.5 text-xs font-semibold">
            Declared scale stage: {SCALE_STAGE_LABEL[CURRENT_SCALE_STAGE]}
          </span>
        </div>
        <p className="mt-3 rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          This architecture is version 0.1 and is not approved. It grants no ownership, no staffing,
          and no implementation authority. No readiness percentage, maturity score, or blended index
          is calculated anywhere in this view, because none would be defensible.
        </p>
      </PageHeader>

      <CapabilityViewTabs current={search.view} search={search} />
      <CapabilityFilterBar search={search} resultCount={filtered.length} />

      {search.view === "registry" ? <RegistryView capabilities={filtered} search={search} /> : null}
      {search.view === "domains" ? <DomainMapView /> : null}
      {search.view === "dependencies" ? <DependencyView /> : null}
      {search.view === "maturity" ? <MaturityView capabilities={filtered} /> : null}
      {search.view === "independence" ? <IndependenceView capabilities={filtered} /> : null}
      {search.view === "gates" ? <GateView /> : null}
      {search.view === "coverage" ? <CoverageView capabilities={filtered} /> : null}
      {search.view === "deliverables" ? <DeliverableView /> : null}
      {search.view === "normalization" ? <NormalizationView /> : null}
    </div>
  );
}

function RegistryView({
  capabilities,
  search,
}: {
  capabilities: ReturnType<typeof filterCapabilities>;
  search: CapabilitySearch;
}) {
  return (
    <Section
      id="registry"
      title="Capability registry"
      description="One row per candidate capability. Implementation status is reported separately from authority and never changes it."
    >
      {capabilities.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-4 text-sm font-semibold">
          No capability matches the current filters. Clear a filter to see records again.
        </p>
      ) : (
        <RegistryTable
          caption="Candidate enterprise capabilities with domain, owning function, independence, execution stage, authority, and implementation status"
          headers={[
            "Capability",
            "Domain",
            "Owning function (candidate)",
            "Independence",
            "Execution stage",
            "Authority",
            "Implementation status",
          ]}
        >
          {capabilities.map((capability) => (
            <tr key={capability.capabilityId}>
              <RowHeader>
                <Link
                  to="/capabilities/$capabilityId"
                  params={{ capabilityId: capability.capabilityId }}
                  search={search}
                  className="underline underline-offset-2"
                >
                  {capability.capabilityId} — {capability.name}
                </Link>
              </RowHeader>
              <Cell className="text-muted-foreground">
                {CAPABILITY_DOMAIN_META[capability.capabilityDomain].name}
              </Cell>
              <Cell>{capability.owningFunctionCandidate}</Cell>
              <Cell>
                <IndependenceChip level={capability.independence.level} />
              </Cell>
              <Cell>
                <StageChip stage={capability.stages.execution} />
              </Cell>
              <Cell>
                <AuthorityBadge authorityClass={capability.currentAuthority} />
              </Cell>
              <Cell>
                <StateChip state={capability.implementationStatus} />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      )}
    </Section>
  );
}

function DomainMapView() {
  const summaries = domainSummaries(ENTERPRISE_CAPABILITIES);
  return (
    <Section
      id="domains"
      title="Domain map"
      description="Twelve candidate domains. Counts are counts of declared records, not measures of progress."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {summaries.map((summary) => (
          <RecordCard key={summary.id}>
            <h3 className="font-display text-lg font-semibold">
              {summary.id} — {summary.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{summary.purpose}</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>Candidate capabilities recorded: {summary.count}</li>
              <li>Independent review required: {summary.independenceRequired}</li>
              <li>Gated before live personal data: {summary.gatedBeforePii}</li>
            </ul>
            <p className="mt-3">
              <Link
                to="/capabilities"
                search={{ view: "registry", domain: summary.id }}
                className="text-sm font-semibold underline underline-offset-2"
              >
                Filter the registry to {summary.id}
              </Link>
            </p>
          </RecordCard>
        ))}
      </div>
    </Section>
  );
}

function DependencyView() {
  return (
    <Section
      id="dependencies"
      title="Dependency graph (tabular)"
      description="Rendered as a table rather than a diagram so the relationships are readable with a screen reader, without color, and at 200% zoom."
    >
      <RegistryTable
        caption="Candidate dependency relationships between capabilities"
        headers={["From", "Relationship", "To", "Why this relationship exists"]}
      >
        {CAPABILITY_DEPENDENCIES.map((dependency) => (
          <tr key={`${dependency.from}-${dependency.kind}-${dependency.to}`}>
            <RowHeader>
              <Link
                to="/capabilities/$capabilityId"
                params={{ capabilityId: dependency.from }}
                className="underline underline-offset-2"
              >
                {dependency.from}
              </Link>
            </RowHeader>
            <Cell>{DEPENDENCY_KIND_LABEL[dependency.kind]}</Cell>
            <Cell>
              <Link
                to="/capabilities/$capabilityId"
                params={{ capabilityId: dependency.to }}
                className="underline underline-offset-2"
              >
                {dependency.to}
              </Link>
            </Cell>
            <Cell className="text-muted-foreground">{dependency.rationale}</Cell>
          </tr>
        ))}
      </RegistryTable>
    </Section>
  );
}

function MaturityView({ capabilities }: { capabilities: ReturnType<typeof filterCapabilities> }) {
  const counts = stageCounts(capabilities);
  return (
    <>
      <Section
        id="stage-counts"
        title="Execution stage distribution"
        description="How many filtered capabilities must be executing by each stage. A count of records, never a score."
      >
        <RegistryTable
          caption="Count of capabilities by required execution stage"
          headers={["Stage", "Meaning", "Capabilities required to be executing"]}
        >
          {SCALE_STAGES.map((stage) => (
            <tr key={stage}>
              <RowHeader>
                <StageChip stage={stage} />
              </RowHeader>
              <Cell className="text-muted-foreground">{SCALE_STAGE_LABEL[stage]}</Cell>
              <Cell>{counts[stage]}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="maturity-matrix"
        title="Maturity matrix"
        description="Declared current and target maturity per capability, with the stage each obligation begins."
      >
        <RegistryTable
          caption="Capability maturity, target maturity, and stage obligations"
          headers={[
            "Capability",
            "Current maturity (declared)",
            "Target maturity",
            "Architecture by",
            "Execution by",
            "Dedicated staffing by",
            "Independent assurance by",
          ]}
        >
          {capabilities.map((capability) => (
            <tr key={capability.capabilityId}>
              <RowHeader>
                <Link
                  to="/capabilities/$capabilityId"
                  params={{ capabilityId: capability.capabilityId }}
                  className="underline underline-offset-2"
                >
                  {capability.capabilityId} — {capability.shortName}
                </Link>
              </RowHeader>
              <Cell>{MATURITY_LEVEL_LABEL[capability.currentMaturity]}</Cell>
              <Cell>{MATURITY_LEVEL_LABEL[capability.targetMaturity]}</Cell>
              <Cell>{capability.stages.architecture}</Cell>
              <Cell>{capability.stages.execution}</Cell>
              <Cell>{capability.stages.dedicatedStaffing}</Cell>
              <Cell>{capability.stages.independentAssurance}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}

function IndependenceView({ capabilities }: { capabilities: ReturnType<typeof filterCapabilities> }) {
  const groups = independenceGroups(capabilities);
  return (
    <Section
      id="independence"
      title="Independence and separation of duties"
      description="Where the builder of a thing may not also be the person who validates or approves it."
    >
      <div className="space-y-6">
        {(["required", "conditional", "not-required"] as const).map((level) => (
          <div key={level}>
            <h3 className="font-display text-lg font-semibold">
              {INDEPENDENCE_LABEL[level]} ({groups[level].length})
            </h3>
            {groups[level].length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No capability in this group.</p>
            ) : (
              <RegistryTable
                caption={`Capabilities where ${INDEPENDENCE_LABEL[level].toLowerCase()}`}
                headers={["Capability", "Separation of duties", "Trigger", "Incompatible combinations"]}
              >
                {groups[level].map((capability) => (
                  <tr key={capability.capabilityId}>
                    <RowHeader>
                      <Link
                        to="/capabilities/$capabilityId"
                        params={{ capabilityId: capability.capabilityId }}
                        className="underline underline-offset-2"
                      >
                        {capability.capabilityId} — {capability.shortName}
                      </Link>
                    </RowHeader>
                    <Cell className="text-muted-foreground">
                      {capability.independence.separationOfDuties}
                    </Cell>
                    <Cell>{capability.independence.trigger ?? "Not conditional."}</Cell>
                    <Cell>
                      {capability.incompatibleCombinations.length > 0
                        ? capability.incompatibleCombinations.join("; ")
                        : "None recorded."}
                    </Cell>
                  </tr>
                ))}
              </RegistryTable>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function GateView() {
  const groups = gateGroups(ENTERPRISE_CAPABILITIES);
  return (
    <Section
      id="gates"
      title="Trigger gates"
      description="Capabilities that must exist before a named threshold is crossed. Every gate below is currently uncrossed."
    >
      <div className="space-y-6">
        {groups.map(({ gate, capabilities }) => (
          <RecordCard key={gate}>
            <div className="flex flex-wrap items-center gap-2">
              <GateChip gate={gate} />
              <span className="text-sm font-semibold">
                {capabilities.length} capabilities required before this gate
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{TRIGGER_GATE_META[gate].meaning}</p>
            <p className="mt-1 text-sm font-semibold">
              Gate state: not crossed. Nothing in the current posture may pass it.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {capabilities.map((capability) => (
                <li key={capability.capabilityId}>
                  <Link
                    to="/capabilities/$capabilityId"
                    params={{ capabilityId: capability.capabilityId }}
                    className="underline underline-offset-2"
                  >
                    {capability.capabilityId} — {capability.name}
                  </Link>
                </li>
              ))}
            </ul>
          </RecordCard>
        ))}
      </div>
    </Section>
  );
}

function CoverageView({ capabilities }: { capabilities: ReturnType<typeof filterCapabilities> }) {
  const groups = coverageGroups(capabilities);
  return (
    <Section
      id="coverage"
      title="Coverage and consolidation"
      description="How a capability may legitimately be held today. Consolidation is allowed except where independence forbids it."
    >
      <RegistryTable
        caption="Coverage modes and the capabilities eligible for each"
        headers={["Coverage mode", "Eligible capabilities", "Examples"]}
      >
        {[...groups.entries()].map(([mode, list]) => (
          <tr key={mode}>
            <RowHeader>{COVERAGE_MODE_LABEL[mode]}</RowHeader>
            <Cell>{list.length}</Cell>
            <Cell className="text-muted-foreground">
              {list
                .slice(0, 4)
                .map((c) => c.capabilityId)
                .join(", ")}
              {list.length > 4 ? ", and others" : ""}
            </Cell>
          </tr>
        ))}
      </RegistryTable>
      <p className="mt-4 rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
        The founder operator currently covers most capabilities. That is a declared single point of
        failure, recorded in NORM-014, not a resolved arrangement.
      </p>
    </Section>
  );
}

function DeliverableView() {
  return (
    <Section
      id="deliverables"
      title="Deliverable types"
      description="The artifact shapes a capability must produce. Producing a deliverable never changes anything's authority."
    >
      <RegistryTable
        caption="Deliverable types with default authority and whether they may justify implementation"
        headers={["Deliverable type", "Answers", "Default authority", "May justify implementation", "Exists today"]}
      >
        {DELIVERABLE_TYPES.map((deliverable) => (
          <tr key={deliverable.id}>
            <RowHeader>
              <span className="block">{deliverable.id}</span>
              <span className="block font-normal">{deliverable.name}</span>
            </RowHeader>
            <Cell className="text-muted-foreground">{deliverable.answersQuestion}</Cell>
            <Cell>
              <AuthorityBadge authorityClass={deliverable.defaultAuthority} />
            </Cell>
            <Cell>{deliverable.canJustifyImplementation ? "Yes" : "No"}</Cell>
            <Cell>
              <StateChip state={deliverable.existsToday} />
            </Cell>
          </tr>
        ))}
      </RegistryTable>
    </Section>
  );
}

function NormalizationView() {
  return (
    <Section
      id="normalization"
      title="Normalization pass"
      description="Judgments made while turning a long term list into capability records. Each is a candidate resolution, not an approved one."
    >
      <div className="space-y-4">
        {NORMALIZATION_FINDINGS.map((finding) => (
          <RecordCard key={finding.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">
                {finding.id} — {NORMALIZATION_KIND_LABEL[finding.kind]}
              </h3>
              <div className="flex flex-wrap gap-2">
                <StateChip state={finding.resolutionState} />
                {finding.synthetic ? <SyntheticMarker /> : null}
              </div>
            </div>
            <p className="mt-2 text-sm">{finding.statement}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold">Terms:</span> {finding.subjects.join(", ")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-semibold">Resolved into:</span>{" "}
              {finding.resolvedInto.length > 0 ? finding.resolvedInto.join(", ") : "No record."}
            </p>
            <p className="mt-1 text-sm">
              <span className="font-semibold">This does not assert:</span> {finding.boundary}
            </p>
          </RecordCard>
        ))}
      </div>
    </Section>
  );
}

export { CAPABILITY_TYPE_LABEL };
