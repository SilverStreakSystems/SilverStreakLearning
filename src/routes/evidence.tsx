import { createFileRoute } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { StateChip, StateLegend } from "@/components/governance/state-chip";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { Field, SyntheticMarker } from "@/components/governance/markers";
import { EVIDENCE } from "@/fixtures";
import {
  APPLICABILITY_MEANING,
  APPLICABILITY_STATES,
  EVIDENCE_KIND_LABEL,
  EVIDENCE_LAYERS,
  PIPELINE_AUTHORITY,
  PIPELINE_CHECKS,
  PIPELINE_FINDING_RESOLUTIONS,
  PIPELINE_METHODS,
  PIPELINE_REFUSALS,
  REUSE_CONDITIONS,
} from "@/domain";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Register | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "What has actually been checked in the SSLS foundation shell, what each check supports, and what it explicitly cannot support.",
      },
      { property: "og:title", content: "Evidence Register | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Executed checks, unrun checks, and the limits of each result.",
      },
    ],
  }),
  component: EvidenceRegister,
});

function EvidenceRegister() {
  return (
    <div>
      <PageHeader
        title="Evidence Register"
        summary="Evidence records what was checked, when, and by whom. A check that has never run is recorded as Not Run. Historical results stay visible without being treated as current truth."
      />

      <Section
        id="pipeline"
        title="Evidence and verification pipeline"
        description={PIPELINE_AUTHORITY.limitation}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {EVIDENCE_LAYERS.map((layer) => (
            <RecordCard key={layer.id}>
              <h3 className="font-display text-lg font-semibold">{layer.name}</h3>
              <dl className="mt-2 grid gap-x-6">
                <Field label="Binding rule">{layer.rule}</Field>
                <Field label="Lifecycle">{layer.lifecycle}</Field>
                <Field label="What stale means here">{layer.staleMeaning}</Field>
              </dl>
            </RecordCard>
          ))}
        </div>
        <p className="measure mt-4 text-sm text-muted-foreground">{PIPELINE_AUTHORITY.basis}</p>
      </Section>

      <Section
        id="applicability"
        title="Applicability vocabulary"
        description="Six distinct answers. Unknown is recorded as unknown; it is never rendered as current or as a pass."
      >
        <RegistryTable
          caption="Applicability states and their meanings"
          headers={["State", "Meaning"]}
        >
          {APPLICABILITY_STATES.map((state) => (
            <tr key={state}>
              <RowHeader>{state}</RowHeader>
              <Cell className="text-muted-foreground">{APPLICABILITY_MEANING[state]}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="checks"
        title="Collected checks"
        description="Each check declares the inputs its result depends on, so freshness is decided by those inputs rather than by comparing commit strings."
      >
        <RegistryTable
          caption="Pipeline checks with declared inputs, validity, and stated limits"
          headers={["Check", "Declared inputs", "Validity", "Supports", "Cannot support"]}
        >
          {PIPELINE_CHECKS.map((check) => (
            <tr key={check.evidenceId}>
              <RowHeader>
                <span className="block">{check.evidenceId}</span>
                <span className="block font-normal">{check.title}</span>
              </RowHeader>
              <Cell>{check.declaredInputs.join(", ")}</Cell>
              <Cell className="text-muted-foreground">{check.validity}</Cell>
              <Cell className="text-muted-foreground">{check.supports}</Cell>
              <Cell className="text-muted-foreground">{check.doesNotSupport}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="reuse"
        title="Reuse conditions"
        description="A result is carried forward only when every condition holds. Any one failing condition ends reuse."
      >
        <ul className="measure list-disc space-y-1 pl-5 text-sm">
          {REUSE_CONDITIONS.map((condition) => (
            <li key={condition.id}>{condition.statement}</li>
          ))}
        </ul>
      </Section>

      <Section
        id="methods"
        title="Reported methods"
        description="Independence is declared by the producing party. It is never inferred from a result."
      >
        <RegistryTable caption="Evidence methods" headers={["Method", "Meaning"]}>
          {PIPELINE_METHODS.map((method) => (
            <tr key={method.id}>
              <RowHeader>{method.label}</RowHeader>
              <Cell className="text-muted-foreground">{method.note}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="finding-dispositions"
        title="Limitations carried in from WP-006"
        description="How the pipeline dispositions each open limitation, and what remains after it."
      >
        <RegistryTable
          caption="Finding dispositions with residual limitations"
          headers={["Finding", "Disposition", "How", "Residual"]}
        >
          {PIPELINE_FINDING_RESOLUTIONS.map((resolution) => (
            <tr key={resolution.findingId}>
              <RowHeader>
                <span className="block">{resolution.findingId}</span>
                <span className="block font-normal">{resolution.title}</span>
              </RowHeader>
              <Cell>{resolution.disposition}</Cell>
              <Cell className="text-muted-foreground">{resolution.resolvedBy}</Cell>
              <Cell className="text-muted-foreground">{resolution.residual}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="refusals"
        title="What the pipeline refuses to do"
        description="Recorded as refusals so that the absence of these behaviours is checkable."
      >
        <ul className="measure list-disc space-y-1 pl-5 text-sm">
          {PIPELINE_REFUSALS.map((refusal) => (
            <li key={refusal}>{refusal}</li>
          ))}
        </ul>
      </Section>

      <Section id="register" title="Register">
        <RegistryTable
          caption="Evidence records with kind, collection date, state, and authority class"
          headers={["Evidence", "Kind", "Subject", "Collected", "State", "Authority"]}
        >
          {EVIDENCE.map((record) => (
            <tr key={record.id}>
              <RowHeader>
                <span className="block">{record.id}</span>
                <span className="block font-normal">{record.title}</span>
              </RowHeader>
              <Cell>{EVIDENCE_KIND_LABEL[record.kind]}</Cell>
              <Cell className="text-muted-foreground">{record.subject}</Cell>
              <Cell>{record.collectedOn ?? "Never executed"}</Cell>
              <Cell>
                <StateChip state={record.state} describe />
              </Cell>
              <Cell>
                <AuthorityBadge authorityClass={record.authorityClass} />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="records" title="Evidence records">
        <div className="space-y-4">
          {EVIDENCE.map((record) => (
            <RecordCard key={record.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {record.id} — {record.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <StateChip state={record.state} />
                  {record.synthetic ? <SyntheticMarker /> : null}
                </div>
              </div>
              <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                <Field label="Kind">{EVIDENCE_KIND_LABEL[record.kind]}</Field>
                <Field label="Subject">{record.subject}</Field>
                <Field label="Collected on">{record.collectedOn ?? "Never executed."}</Field>
                <Field label="Collected by">{record.collectedBy}</Field>
                <Field label="What this supports">{record.supports}</Field>
                <Field label="What this cannot support">{record.doesNotSupport}</Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>

      <Section
        id="legend"
        title="State vocabulary"
        description="Each state is a distinct answer. None of them is a shorthand for incomplete work."
      >
        <StateLegend />
      </Section>
    </div>
  );
}
