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
