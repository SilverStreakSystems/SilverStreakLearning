import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Cell, PageHeader, RecordCard, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { Field, GatedPanel, SyntheticMarker, ValueList } from "@/components/governance/markers";
import {
  DEFAULT_VALUE_STREAM_SEARCH,
  FunctionChip,
  GateDispositionChip,
  OperatingStatusChip,
} from "@/components/governance/value-stream-controls";
import {
  VALUE_STREAMS,
  VALUE_STREAM_DEPENDENCIES,
  VALUE_STREAM_GATES,
  VALUE_STREAM_HANDOFFS,
  VALUE_STREAM_METRICS,
} from "@/fixtures";
import {
  DECISION_RIGHT_META,
  ENTERPRISE_FUNCTION_META,
  SCALE_STAGE_LABEL,
  STREAM_DEPENDENCY_KIND_LABEL,
  STREAM_OPERATING_STATUS_META,
  isGatedFuture,
} from "@/domain";
import { recordsForStream, streamById } from "@/lib/value-stream-queries";

export const Route = createFileRoute("/value-streams/$streamId")({
  loader: ({ params }) => {
    const stream = streamById(VALUE_STREAMS, params.streamId);
    if (!stream) throw notFound();
    return { stream };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Value stream unavailable | SSLS" }, { name: "robots", content: "noindex" }],
      };
    }
    const { stream } = loaderData;
    const description = `${stream.purpose} Candidate value stream in the SSLS operating workflow architecture. Not operating.`;
    return {
      meta: [
        { title: `${stream.name} — value stream | SSLS` },
        { name: "description", content: description },
        { property: "og:title", content: `${stream.name} — value stream | SSLS` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: StreamNotFound,
  component: ValueStreamDetail,
});

function StreamNotFound() {
  return (
    <div>
      <PageHeader
        title="Value stream not found"
        summary="No value stream matches that identifier. It may have been merged or demoted during normalization."
      />
      <p className="mt-6">
        <Link
          to="/value-streams"
          search={DEFAULT_VALUE_STREAM_SEARCH}
          className="underline underline-offset-4"
        >
          Return to the value stream registry
        </Link>
      </p>
    </div>
  );
}

function ValueStreamDetail() {
  const { stream } = Route.useLoaderData();
  const records = recordsForStream(stream.valueStreamId, {
    gates: VALUE_STREAM_GATES,
    handoffs: VALUE_STREAM_HANDOFFS,
    dependencies: VALUE_STREAM_DEPENDENCIES,
    metrics: VALUE_STREAM_METRICS,
  });

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link
          to="/value-streams"
          search={DEFAULT_VALUE_STREAM_SEARCH}
          className="underline underline-offset-4"
        >
          Back to the value stream registry
        </Link>
      </p>

      <PageHeader title={stream.name} summary={stream.purpose}>
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass={stream.currentAuthority} />
          <OperatingStatusChip status={stream.operatingStatus} />
          <SyntheticMarker />
        </div>
        <p className="mt-3 rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          {STREAM_OPERATING_STATUS_META[stream.operatingStatus].meaning} Implementation status:{" "}
          {stream.implementationStatus}. Authority is declared here and is never inferred from whether
          stages exist or from any test result.
        </p>
      </PageHeader>

      {isGatedFuture(stream) ? (
        <div className="mt-6">
          <GatedPanel
            title="This stream is gated future architecture"
            notice="Nothing in this stream may be started, staffed, piloted, or claimed. It is modeled so its gates are known before anything is attempted."
          >
            <ValueList items={stream.refusalConditions} />
          </GatedPanel>
        </div>
      ) : null}

      <Section id="why" title="Why this stream exists">
        <div className="grid gap-4 lg:grid-cols-2">
          <RecordCard>
            <dl>
              <Field label="Description">{stream.description}</Field>
              <Field label="Connection to the North Star">{stream.northStarContribution}</Field>
              <Field label="People served">
                <ValueList items={stream.humanBeneficiaries} />
              </Field>
              <Field label="Enterprise beneficiaries">
                <ValueList items={stream.enterpriseBeneficiaries} />
              </Field>
            </dl>
          </RecordCard>
          <RecordCard>
            <dl>
              <Field label="Trigger">{stream.trigger}</Field>
              <Field label="Entry criteria">
                <ValueList items={stream.entryCriteria} />
              </Field>
              <Field label="Exit criteria">
                <ValueList items={stream.exitCriteria} />
              </Field>
              <Field label="Maturity">
                Declared now: {stream.currentMaturity} {SCALE_STAGE_LABEL[stream.currentMaturity]}. Target:{" "}
                {stream.targetMaturity} {SCALE_STAGE_LABEL[stream.targetMaturity]}.
              </Field>
              <Field label="Learning loop destination">{stream.learningLoopDestination}</Field>
            </dl>
          </RecordCard>
        </div>
      </Section>

      <Section id="authority" title="Who decides, who validates, who may stop">
        <div className="grid gap-4 lg:grid-cols-3">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Decision authorities</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {stream.decisionAuthorities.map((fn) => (
                <FunctionChip key={fn} functionId={fn} />
              ))}
            </div>
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Validation authorities</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {stream.validationAuthorities.map((fn) => (
                <FunctionChip key={fn} functionId={fn} />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Validation is independent of building. Where the same function appears in both, the
              exception must be disclosed on any claim resting on it.
            </p>
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">May stop this stream</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {stream.stopAuthorities.map((fn) => (
                <FunctionChip key={fn} functionId={fn} />
              ))}
            </div>
          </RecordCard>
        </div>
      </Section>

      <Section
        id="stages"
        title="Stages"
        description="Each stage states what it consumes, what it produces, what must be proved, and how it is refused. A stage never advances because the previous one was marked complete."
      >
        <ol className="space-y-4">
          {stream.stages.map((stage) => (
            <li key={stage.stageId}>
              <RecordCard>
                <h3 className="font-display text-lg font-semibold">
                  Stage {stage.sequence}. {stage.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{stage.stageId}</p>
                <dl className="mt-3 grid gap-x-6 lg:grid-cols-2">
                  <Field label="Purpose">{stage.purpose}</Field>
                  <Field label="Stage owner">
                    <FunctionChip functionId={stage.stageOwner} />
                  </Field>
                  <Field label="Entry criteria">
                    <ValueList items={stage.entryCriteria} />
                  </Field>
                  <Field label="Exit criteria">
                    <ValueList items={stage.exitCriteria} />
                  </Field>
                  <Field label="Consumes">
                    <ValueList items={stage.inputObjects} />
                  </Field>
                  <Field label="Produces">
                    <ValueList items={stage.outputObjects} />
                  </Field>
                  <Field label="Acting capacities permitted">
                    <ValueList items={stage.allowedActingCapacities} />
                  </Field>
                  <Field label="Required context package">
                    {stage.requiredContext ?? "No bounded context package required at this stage."}
                  </Field>
                  <Field label="Evidence that must exist before exit">
                    {stage.evidence.length === 0 ? (
                      <span className="text-muted-foreground">None recorded.</span>
                    ) : (
                      <ul className="space-y-2">
                        {stage.evidence.map((requirement) => (
                          <li key={requirement.proposition}>
                            <span className="font-semibold">{requirement.proposition}</span>
                            <span className="mt-1 block text-muted-foreground">
                              {requirement.evidenceType}, bound to {requirement.versionBinding}. Reviewed by{" "}
                              {ENTERPRISE_FUNCTION_META[requirement.reviewer].name}.
                            </span>
                            <span className="mt-1 block">If missing: {requirement.effectIfMissing}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Field>
                  <Field label="Refusal states">
                    <ValueList items={stage.refusalStates} />
                  </Field>
                  <Field label="Escalation">{stage.escalation}</Field>
                  <Field label="Maximum waiting state">
                    {stage.maximumWaitingState ?? "No waiting limit recorded."}
                  </Field>
                  <Field label="Audit requirement">{stage.auditRequirement}</Field>
                  <Field label="Hands off to">
                    {stage.handoffRecipientStageId ?? "Nothing. The stream ends at this stage."}
                  </Field>
                </dl>

                {stage.decisionPoints.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-display text-base font-semibold">Decision points</h4>
                    {stage.decisionPoints.map((point) => (
                      <div key={point.decisionPointId} className="mt-2 border-l-4 border-border-strong pl-3">
                        <p className="font-semibold">{point.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Reversibility: {point.reversibility}. Revisit when: {point.revisitTrigger}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {point.assignments.map((assignment) => (
                            <li key={`${assignment.functionId}-${assignment.right}`}>
                              <span className="font-semibold">
                                {DECISION_RIGHT_META[assignment.right].label}:
                              </span>{" "}
                              {ENTERPRISE_FUNCTION_META[assignment.functionId].name}. {assignment.basis}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </RecordCard>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="stream-gates" title="Gates on this stream">
        <RegistryTable
          caption={`Gates on ${stream.name}`}
          headers={["Gate", "Owner", "Stop conditions", "Worked disposition"]}
        >
          {records.gates.map((gate) => (
            <tr key={gate.gateId}>
              <RowHeader>
                {gate.name}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {gate.gateId}
                </span>
              </RowHeader>
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

      <Section id="stream-handoffs" title="Handoffs on this stream">
        <RegistryTable
          caption={`Handoffs on ${stream.name}`}
          headers={["Handoff", "From", "To", "Required state", "Outcome"]}
        >
          {records.handoffs.map((handoff) => (
            <tr key={handoff.handoffId}>
              <RowHeader>{handoff.handoffId}</RowHeader>
              <Cell>{ENTERPRISE_FUNCTION_META[handoff.sourceOwner].name}</Cell>
              <Cell>{ENTERPRISE_FUNCTION_META[handoff.receivingOwner].name}</Cell>
              <Cell>{handoff.requiredState}</Cell>
              <Cell>
                {handoff.outcome}
                <span className="mt-1 block text-muted-foreground">
                  {handoff.receiverAccepted
                    ? "Receiver accepted, so the handoff is complete."
                    : "Receiver has not accepted, so the handoff is not complete."}
                </span>
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="stream-dependencies" title="Dependencies and measures">
        <div className="grid gap-4 lg:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Dependencies</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {records.dependencies.map((dependency) => (
                <li key={dependency.dependencyId}>
                  <span className="font-semibold">{STREAM_DEPENDENCY_KIND_LABEL[dependency.kind]}:</span>{" "}
                  {dependency.description}
                  <span className="mt-1 block text-muted-foreground">
                    Owner:{" "}
                    {dependency.owner
                      ? ENTERPRISE_FUNCTION_META[dependency.owner].name
                      : "unowned, which is itself a finding"}
                    . State: {dependency.state}.
                  </span>
                </li>
              ))}
            </ul>
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Measures</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {records.metrics.map((metric) => (
                <li key={metric.metricId}>
                  <span className="font-semibold">{metric.name}.</span> {metric.questionAnswered}
                  <span className="mt-1 block text-muted-foreground">
                    Never read as: {metric.prohibitedInterpretation}
                  </span>
                </li>
              ))}
            </ul>
          </RecordCard>
        </div>
      </Section>

      <Section id="stream-risk" title="Risks, assumptions, and what is not known">
        <div className="grid gap-4 lg:grid-cols-3">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Risks</h3>
            <ValueList items={stream.risks} />
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Assumptions</h3>
            <ValueList items={stream.assumptions} />
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Unknowns</h3>
            <ValueList items={stream.unknowns} />
          </RecordCard>
        </div>
        <RecordCard className="mt-4">
          <dl>
            <Field label="Rollback and recovery">{stream.rollbackRecovery}</Field>
            <Field label="Refusal conditions">
              <ValueList items={stream.refusalConditions} />
            </Field>
            <Field label="Review trigger">{stream.reviewTrigger}</Field>
            <Field label="Supersession">{stream.supersession}</Field>
            <Field label="Notes">{stream.notes}</Field>
          </dl>
        </RecordCard>
      </Section>
    </div>
  );
}
