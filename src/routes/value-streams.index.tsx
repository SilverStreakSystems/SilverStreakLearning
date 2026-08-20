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
import { Field, GatedPanel, SyntheticMarker, ValueList } from "@/components/governance/markers";
import {
  FunctionChip,
  GateDispositionChip,
  OperatingStatusChip,
  ValueStreamFilterBar,
  ValueStreamViewTabs,
} from "@/components/governance/value-stream-controls";
import {
  parseValueStreamSearch,
  type ValueStreamSearch,
} from "@/components/governance/value-stream-view-model";
import {
  VALUE_STREAMS,
  VALUE_STREAM_BURDENS,
  VALUE_STREAM_COMMITMENTS,
  VALUE_STREAM_DEPENDENCIES,
  VALUE_STREAM_ESCALATIONS,
  VALUE_STREAM_GATES,
  VALUE_STREAM_HANDOFFS,
  VALUE_STREAM_METRICS,
  VALUE_STREAM_NORMALIZATION_FINDINGS,
  VALUE_STREAM_PROJECTIONS,
  VALUE_STREAM_REFUSALS,
  VALUE_STREAM_TRANSITIONS,
} from "@/fixtures";
import {
  BURDEN_BEARER_LABEL,
  BURDEN_TYPE_LABEL,
  COMMITMENT_RULES,
  CROSS_AXIS_PROHIBITIONS,
  DECISION_RIGHTS,
  DECISION_RIGHT_META,
  ENTERPRISE_FUNCTION_META,
  METRIC_CLASS_LABEL,
  NORMALIZATION_CHECK_LABEL,
  PROHIBITED_METRICS,
  PROHIBITED_METRIC_REASON,
  PROJECTION_RULES,
  PROJECTION_SURFACE_LABEL,
  REFUSAL_GROUND_LABEL,
  SCALE_STAGE_LABEL,
  STREAM_DEPENDENCY_KIND_LABEL,
  VALUE_STREAM_DISPOSITION_LABEL,
  hiddenDependencies,
  isBlocked,
  isGatedFuture,
  type ValueStream,
} from "@/domain";
import {
  filterValueStreams,
  functionInvolvement,
  independenceExceptions,
  learningLoopTargets,
} from "@/lib/value-stream-queries";

export const Route = createFileRoute("/value-streams/")({
  validateSearch: parseValueStreamSearch,
  head: () => ({
    meta: [
      { title: "Enterprise Value Streams v0.1 (Candidate) | SSLS" },
      {
        name: "description",
        content:
          "Candidate value stream and operating workflow architecture for SSLS: eighteen end-to-end streams, their stages, gates, handoffs, dependencies, and refusal grounds.",
      },
      { property: "og:title", content: "Enterprise Value Streams v0.1 (Candidate) | SSLS" },
      {
        property: "og:description",
        content:
          "Governed candidate workflow model. No stream is operating, staffed, or enforced in code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ValueStreamView,
});

function ValueStreamView() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const filtered = filterValueStreams(VALUE_STREAMS, search);

  const updateSearch = (next: Partial<ValueStreamSearch>) => {
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });
  };

  return (
    <div>
      <PageHeader
        title="Enterprise Value Stream Architecture (Candidate)"
        summary={`${VALUE_STREAMS.length} end-to-end streams, the stages and gates they pass through, the handoffs between functions, and the conditions under which work is refused.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass="research-candidate" />
          <SyntheticMarker />
        </div>
        <p className="mt-3 rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          Version 0.1, candidate. No stream is operating. No function is staffed. No gate,
          transition, or refusal rule is enforced by running code. Every record here is invented,
          and none of it reports progress or readiness.
        </p>
      </PageHeader>

      <ValueStreamViewTabs current={search.view} search={search} />
      {search.view === "registry" ? (
        <ValueStreamFilterBar
          search={search}
          resultCount={filtered.length}
          onChange={updateSearch}
        />
      ) : null}

      {search.view === "registry" ? <RegistryView streams={filtered} search={search} /> : null}
      {search.view === "functions" ? <FunctionsView /> : null}
      {search.view === "stages" ? <StagesView /> : null}
      {search.view === "gates" ? <GatesView /> : null}
      {search.view === "handoffs" ? <HandoffsView /> : null}
      {search.view === "dependencies" ? <DependenciesView /> : null}
      {search.view === "commitments" ? <CommitmentsView /> : null}
      {search.view === "metrics" ? <MetricsView /> : null}
      {search.view === "burden" ? <BurdenView /> : null}
      {search.view === "projections" ? <ProjectionsView /> : null}
      {search.view === "normalization" ? <NormalizationView /> : null}
    </div>
  );
}

/* ------------------------------------------------------------- registry */

function RegistryView({ streams, search }: { streams: ValueStream[]; search: ValueStreamSearch }) {
  const loops = learningLoopTargets(VALUE_STREAMS);

  return (
    <Section
      id="stream-registry"
      title="Stream registry"
      description="One row per stream. Maturity is declared, not calculated, and it never implies that the stream is running."
    >
      <RegistryTable
        caption="Candidate enterprise value streams"
        headers={[
          "Stream",
          "Purpose",
          "Trigger",
          "Primary function",
          "Maturity now and target",
          "Operating status",
          "Learning goes to",
        ]}
      >
        {streams.map((stream) => (
          <tr key={stream.valueStreamId}>
            <RowHeader>
              <Link
                to="/value-streams/$streamId"
                params={{ streamId: stream.valueStreamId }}
                className="underline underline-offset-4"
              >
                {stream.name}
              </Link>
              <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                {stream.valueStreamId}
              </span>
            </RowHeader>
            <Cell>{stream.purpose}</Cell>
            <Cell>{stream.trigger}</Cell>
            <Cell>
              <FunctionChip functionId={stream.primaryFunction} />
            </Cell>
            <Cell>
              {stream.currentMaturity} {SCALE_STAGE_LABEL[stream.currentMaturity]}
              <span className="mt-1 block text-muted-foreground">
                Target {stream.targetMaturity} {SCALE_STAGE_LABEL[stream.targetMaturity]}
              </span>
            </Cell>
            <Cell>
              <OperatingStatusChip status={stream.operatingStatus} />
            </Cell>
            <Cell>{stream.learningLoopDestination}</Cell>
          </tr>
        ))}
      </RegistryTable>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RecordCard>
          <h3 className="font-display text-lg font-semibold">Learning loop destinations</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Every stream must say where its learning goes. A stream that receives no learning from
            any other stream is not a defect; a stream that sends learning nowhere is.
          </p>
          <dl className="mt-3">
            {Object.entries(loops).map(([destination, sources]) => (
              <Field key={destination} label={destination}>
                Receives learning from {sources.length} stream{sources.length === 1 ? "" : "s"}:{" "}
                {sources.join(", ")}
              </Field>
            ))}
          </dl>
        </RecordCard>
        <RecordCard>
          <h3 className="font-display text-lg font-semibold">
            What this registry refuses to report
          </h3>
          <ValueList
            items={[
              "A single readiness or completion percentage across streams.",
              "A blended health score mixing maturity, evidence, and implementation.",
              "Any statement that a stream is operating because it has been modeled.",
              "Any inference that a gated future stream is partially available.",
            ]}
          />
        </RecordCard>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- functions */

function FunctionsView() {
  const involvement = functionInvolvement(VALUE_STREAMS);
  const exceptions = independenceExceptions(VALUE_STREAMS);

  return (
    <>
      <Section
        id="decision-rights"
        title="Decision rights"
        description="Each decision point assigns exactly one function the right to decide. Every other right is explicit and separate."
      >
        <RegistryTable
          caption="Decision rights"
          headers={["Right", "What it means", "What it is not"]}
        >
          {DECISION_RIGHTS.map((right) => (
            <tr key={right}>
              <RowHeader>{DECISION_RIGHT_META[right].label}</RowHeader>
              <Cell>{DECISION_RIGHT_META[right].meaning}</Cell>
              <Cell>{DECISION_RIGHT_META[right].doesNotGrant}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="function-involvement"
        title="Function involvement across streams"
        description="Candidate accountability only. No function is staffed, and nothing here assigns work to a person."
      >
        <RegistryTable
          caption="Function involvement"
          headers={[
            "Function",
            "Accountability",
            "Primary for",
            "Decides in",
            "Validates in",
            "May stop",
          ]}
        >
          {involvement.map((entry) => (
            <tr key={entry.functionId}>
              <RowHeader>
                {entry.functionId} {entry.name}
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Candidate role:{" "}
                  {ENTERPRISE_FUNCTION_META[entry.functionId].accountableRoleCandidate}. Not
                  staffed.
                </span>
              </RowHeader>
              <Cell>{ENTERPRISE_FUNCTION_META[entry.functionId].accountability}</Cell>
              <Cell>{entry.primaryFor.length}</Cell>
              <Cell>{entry.decidesIn.length}</Cell>
              <Cell>{entry.validatesIn.length}</Cell>
              <Cell>{entry.mayStop.length}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="independence"
        title="Independence exceptions"
        description="Where one function both runs and validates the same stream, the exception is recorded rather than hidden."
      >
        {exceptions.length === 0 ? (
          <p className="text-sm">
            No stream currently assigns validation to the function that runs it.
          </p>
        ) : (
          <RegistryTable
            caption="Independence exceptions"
            headers={["Stream", "Function", "Consequence"]}
          >
            {exceptions.map((exception) => (
              <tr key={`${exception.stream.valueStreamId}-${exception.functionId}`}>
                <RowHeader>{exception.stream.name}</RowHeader>
                <Cell>{ENTERPRISE_FUNCTION_META[exception.functionId].name}</Cell>
                <Cell>{exception.detail}</Cell>
              </tr>
            ))}
          </RegistryTable>
        )}
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- stages */

function StagesView() {
  return (
    <>
      <Section
        id="cross-axis"
        title="What one state may never imply about another"
        description="Stage advancement reads criteria and evidence. It never reads another axis as permission."
      >
        <RegistryTable
          caption="Cross-axis prohibitions"
          headers={["Prohibition", "Why it matters"]}
        >
          {CROSS_AXIS_PROHIBITIONS.map((rule) => (
            <tr key={rule.id}>
              <RowHeader>{rule.statement}</RowHeader>
              <Cell>{rule.reason}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="transitions"
        title="Worked state transitions"
        description="Each transition names its preconditions, who may perform it, what it produces, and how it is refused. None is enforced in code."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {VALUE_STREAM_TRANSITIONS.map((transition) => (
            <RecordCard key={transition.transitionId}>
              <h3 className="font-display text-lg font-semibold">
                {transition.currentState} → {transition.resultingState}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {transition.transitionId} · {transition.valueStreamId} · Contract only, not enforced
              </p>
              <dl className="mt-3">
                <Field label="Action">{transition.action}</Field>
                <Field label="Preconditions">
                  <ValueList items={transition.preconditions} />
                </Field>
                <Field label="Authorized functions">
                  <div className="flex flex-wrap gap-2">
                    {transition.authorizedFunctions.map((fn) => (
                      <FunctionChip key={fn} functionId={fn} />
                    ))}
                  </div>
                </Field>
                <Field label="Evidence produced">
                  <ValueList items={transition.evidenceProduced} />
                </Field>
                <Field label="Refusal state">{transition.refusalState}</Field>
                <Field label="Recovery">{transition.recovery}</Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ----------------------------------------------------------------- gates */

function GatesView() {
  return (
    <>
      <Section
        id="gates"
        title="Gates"
        description="A gate is a stop condition with an owner. Its disposition is declared by a reviewer; it is never computed from task status."
      >
        <RegistryTable
          caption="Value stream gates"
          headers={["Gate", "Stream and stage", "Owner", "Stop conditions", "Worked disposition"]}
        >
          {VALUE_STREAM_GATES.map((gate) => (
            <tr key={gate.gateId}>
              <RowHeader>
                {gate.name}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {gate.gateId}
                </span>
              </RowHeader>
              <Cell>
                {gate.valueStreamId}
                <span className="block text-muted-foreground">{gate.stageId}</span>
              </Cell>
              <Cell>
                <FunctionChip functionId={gate.owner} />
              </Cell>
              <Cell>
                <ValueList items={gate.stopConditions} />
              </Cell>
              <Cell>
                <GateDispositionChip disposition={gate.exampleDisposition} />
                <span className="mt-2 block">{gate.exampleRationale}</span>
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="refusals"
        title="Refusal records"
        description="Refusal is a legitimate, successful outcome. It stays on the record with a resolution path."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {VALUE_STREAM_REFUSALS.map((refusal) => (
            <RecordCard key={refusal.refusalId}>
              <h3 className="font-display text-lg font-semibold">{refusal.refusedThing}</h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {refusal.refusalId} · {refusal.valueStreamId}
              </p>
              <dl className="mt-3">
                <Field label="Ground">{REFUSAL_GROUND_LABEL[refusal.ground]}</Field>
                <Field label="Reason">{refusal.reason}</Field>
                <Field label="Governing rule">{refusal.governingRule}</Field>
                <Field label="Refused by">
                  <FunctionChip functionId={refusal.refusedBy} />
                </Field>
                <Field label="Resolution path">{refusal.resolutionPath}</Field>
                <Field label="Appeal">
                  {refusal.appealAvailable
                    ? (refusal.appealRoute ?? "Appeal available.")
                    : "No appeal. The refusal rests on a boundary that is not negotiable."}
                </Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>

      <Section
        id="escalations"
        title="Escalation paths"
        description="Escalation changes who is looking at a problem. It never changes what the evidence says."
      >
        <RegistryTable
          caption="Escalation paths"
          headers={["Trigger", "From", "To", "Time box", "What escalation may change"]}
        >
          {VALUE_STREAM_ESCALATIONS.map((path) => (
            <tr key={path.escalationId}>
              <RowHeader>{path.trigger}</RowHeader>
              <Cell>{ENTERPRISE_FUNCTION_META[path.fromFunction].name}</Cell>
              <Cell>{ENTERPRISE_FUNCTION_META[path.toFunction].name}</Cell>
              <Cell>{path.timeBox}</Cell>
              <Cell>{path.authorityOfEscalation}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------- handoffs */

function HandoffsView() {
  return (
    <Section
      id="handoffs"
      title="Handoff contracts"
      description="A handoff completes only when the receiver accepts it. Sending is not completing."
    >
      <RegistryTable
        caption="Handoff contracts"
        headers={[
          "Handoff",
          "From stage",
          "To stage",
          "Required state",
          "Acceptance criteria",
          "Outcome",
        ]}
      >
        {VALUE_STREAM_HANDOFFS.map((handoff) => (
          <tr key={handoff.handoffId}>
            <RowHeader>
              {handoff.handoffId}
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {ENTERPRISE_FUNCTION_META[handoff.sourceOwner].name} to{" "}
                {ENTERPRISE_FUNCTION_META[handoff.receivingOwner].name}
              </span>
            </RowHeader>
            <Cell>{handoff.sourceStageId}</Cell>
            <Cell>{handoff.destinationStageId}</Cell>
            <Cell>{handoff.requiredState}</Cell>
            <Cell>
              <ValueList items={handoff.acceptanceCriteria} />
            </Cell>
            <Cell>
              <span className="font-semibold">{handoff.outcome}</span>
              <span className="mt-1 block text-muted-foreground">
                {handoff.receiverAccepted ? "Receiver accepted." : "Receiver has not accepted."}
              </span>
              {handoff.refusalReason ? (
                <span className="mt-1 block">Refused because: {handoff.refusalReason}</span>
              ) : null}
            </Cell>
          </tr>
        ))}
      </RegistryTable>
    </Section>
  );
}

/* ---------------------------------------------------------- dependencies */

function DependenciesView() {
  const hidden = hiddenDependencies(VALUE_STREAM_DEPENDENCIES);

  return (
    <>
      <Section
        id="dependencies"
        title="Dependencies"
        description="A dependency without an owner blocks silently. Unowned dependencies are findings, not background conditions."
      >
        <RegistryTable
          caption="Dependency records"
          headers={["Dependency", "Kind", "Blocks stage", "Owner", "State", "Fallback"]}
        >
          {VALUE_STREAM_DEPENDENCIES.map((dependency) => (
            <tr key={dependency.dependencyId}>
              <RowHeader>
                {dependency.description}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {dependency.dependencyId}
                </span>
              </RowHeader>
              <Cell>{STREAM_DEPENDENCY_KIND_LABEL[dependency.kind]}</Cell>
              <Cell>{dependency.dependentStageId}</Cell>
              <Cell>
                {dependency.owner ? (
                  ENTERPRISE_FUNCTION_META[dependency.owner].name
                ) : (
                  <span className="font-semibold">Unowned. This is a finding.</span>
                )}
              </Cell>
              <Cell>
                {dependency.state}
                <span className="mt-1 block text-muted-foreground">
                  {isBlocked(dependency) ? "Currently blocking." : "Not blocking."}
                </span>
              </Cell>
              <Cell>{dependency.fallback ?? "No fallback recorded."}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="hidden-dependencies" title="Hidden dependency findings">
        {hidden.length === 0 ? (
          <p className="text-sm">No hidden dependencies detected in the seeded records.</p>
        ) : (
          <ValueList
            items={hidden.map((finding) => `${finding.dependencyId}: ${finding.detail}`)}
          />
        )}
      </Section>
    </>
  );
}

/* ----------------------------------------------------------- commitments */

function CommitmentsView() {
  return (
    <Section
      id="commitments"
      title="Commitments"
      description="A commitment needs a committing party, a receiving party, and a source authority. Intent is not commitment."
    >
      <RecordCard className="mb-4">
        <h3 className="font-display text-lg font-semibold">Commitment rules</h3>
        <ValueList items={[...COMMITMENT_RULES]} />
      </RecordCard>
      <RegistryTable
        caption="Commitments"
        headers={[
          "Promised outcome",
          "Committing party",
          "Receiving party",
          "Source authority",
          "Status",
          "Evidence",
        ]}
      >
        {VALUE_STREAM_COMMITMENTS.map((commitment) => (
          <tr key={commitment.commitmentId}>
            <RowHeader>
              {commitment.promisedOutcome}
              <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                {commitment.commitmentId} · due {commitment.dueDate}
              </span>
            </RowHeader>
            <Cell>{ENTERPRISE_FUNCTION_META[commitment.committingParty].name}</Cell>
            <Cell>{commitment.receivingParty}</Cell>
            <Cell>{commitment.sourceAuthority}</Cell>
            <Cell>{commitment.status}</Cell>
            <Cell>{commitment.evidence ?? "No evidence recorded, so nothing is fulfilled."}</Cell>
          </tr>
        ))}
      </RegistryTable>
    </Section>
  );
}

/* --------------------------------------------------------------- metrics */

function MetricsView() {
  return (
    <>
      <Section
        id="metrics"
        title="Metrics"
        description="Each measure states the question it answers, how it may be read, and how it may not."
      >
        <RegistryTable
          caption="Value stream metrics"
          headers={[
            "Measure",
            "Class",
            "Question answered",
            "Interpretation",
            "Never read as",
            "Perverse incentive",
          ]}
        >
          {VALUE_STREAM_METRICS.map((metric) => (
            <tr key={metric.metricId}>
              <RowHeader>
                {metric.name}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {metric.metricId} · {metric.valueStreamId}
                </span>
              </RowHeader>
              <Cell>{METRIC_CLASS_LABEL[metric.metricClass]}</Cell>
              <Cell>{metric.questionAnswered}</Cell>
              <Cell>{metric.interpretation}</Cell>
              <Cell>{metric.prohibitedInterpretation}</Cell>
              <Cell>{metric.perverseIncentiveRisk}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="prohibited-metrics"
        title="Measures refused by design"
        description="These are not thresholds to tune. They will not be built."
      >
        <RegistryTable caption="Prohibited measures" headers={["Measure", "Why it is refused"]}>
          {PROHIBITED_METRICS.map((metric) => (
            <tr key={metric}>
              <RowHeader>{metric}</RowHeader>
              <Cell>{PROHIBITED_METRIC_REASON[metric]}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- burden */

function BurdenView() {
  return (
    <Section
      id="burden"
      title="Burden assessment"
      description="Every stream imposes load somewhere. Load placed on the people the product serves must be offset, not assumed."
    >
      <RegistryTable
        caption="Burden assessments"
        headers={["Stream", "Burden type", "Who bears it", "Level", "Offset", "Mitigation"]}
      >
        {VALUE_STREAM_BURDENS.map((burden) => (
          <tr key={burden.burdenId}>
            <RowHeader>{burden.valueStreamId}</RowHeader>
            <Cell>{BURDEN_TYPE_LABEL[burden.burdenType]}</Cell>
            <Cell>{BURDEN_BEARER_LABEL[burden.bearer]}</Cell>
            <Cell>{burden.level}</Cell>
            <Cell>{burden.offset ?? "No offset stated."}</Cell>
            <Cell>{burden.mitigation}</Cell>
          </tr>
        ))}
      </RegistryTable>
    </Section>
  );
}

/* ----------------------------------------------------------- projections */

function ProjectionsView() {
  return (
    <Section
      id="projections"
      title="Command surface projections"
      description="Read contracts over governed objects. Defining a projection does not authorize building the surface."
    >
      <RecordCard className="mb-4">
        <h3 className="font-display text-lg font-semibold">Projection rules</h3>
        <ValueList items={[...PROJECTION_RULES]} />
      </RecordCard>
      <div className="grid gap-4 lg:grid-cols-2">
        {VALUE_STREAM_PROJECTIONS.map((projection) => (
          <GatedPanel
            key={projection.surface}
            title={PROJECTION_SURFACE_LABEL[projection.surface]}
            notice="Contract only. This surface does not exist and is not authorized."
          >
            <dl>
              <Field label="Purpose">{projection.purpose}</Field>
              <Field label="Audience">{projection.audience}</Field>
              <Field label="Authority">{projection.authorityNote}</Field>
              <Field label="Panels">
                <ul className="space-y-3">
                  {projection.panels.map((panel) => (
                    <li key={panel.panelId}>
                      <span className="font-semibold">{panel.question}</span>
                      <span className="mt-1 block text-muted-foreground">
                        Reads: {panel.sourceObjects.join(", ")}
                      </span>
                      <span className="mt-1 block">Never infer: {panel.prohibitedInference}</span>
                    </li>
                  ))}
                </ul>
              </Field>
            </dl>
          </GatedPanel>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- normalization */

function NormalizationView() {
  const gated = VALUE_STREAMS.filter(isGatedFuture);

  return (
    <>
      <Section
        id="normalization"
        title="Normalization findings"
        description="What was kept, merged, demoted, deferred, or rejected while turning a candidate list into a registry."
      >
        <RegistryTable
          caption="Normalization findings"
          headers={["Candidate", "Check", "Disposition", "Judgment", "Consequence"]}
        >
          {VALUE_STREAM_NORMALIZATION_FINDINGS.map((finding) => (
            <tr key={finding.findingId}>
              <RowHeader>
                {finding.candidateName}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {finding.findingId}
                </span>
              </RowHeader>
              <Cell>{NORMALIZATION_CHECK_LABEL[finding.check]}</Cell>
              <Cell>{VALUE_STREAM_DISPOSITION_LABEL[finding.disposition]}</Cell>
              <Cell>{finding.judgment}</Cell>
              <Cell>{finding.consequence}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="gated-streams" title="Streams held behind a gate">
        <div className="grid gap-4 lg:grid-cols-2">
          {gated.map((stream) => (
            <GatedPanel
              key={stream.valueStreamId}
              title={stream.name}
              notice="Target state only. Not implemented, not authorized, and not available in any form."
            >
              <dl>
                <Field label="Purpose">{stream.purpose}</Field>
                <Field label="Implementation status">{stream.implementationStatus}</Field>
                <Field label="Refusal conditions">
                  <ValueList items={stream.refusalConditions} />
                </Field>
              </dl>
            </GatedPanel>
          ))}
        </div>
      </Section>
    </>
  );
}
