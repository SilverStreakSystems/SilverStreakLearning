import { createFileRoute } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { StateChip } from "@/components/governance/state-chip";
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { FINDINGS } from "@/fixtures";
import { FINDING_SEVERITY_LABEL } from "@/domain";

export const Route = createFileRoute("/findings")({
  head: () => ({
    meta: [
      { title: "Findings Register | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "Recorded ambiguities, conflicts, and gaps in the SSLS foundation, including what each finding does not assert.",
      },
      { property: "og:title", content: "Findings Register | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Open governance and structural findings with their resolution state.",
      },
    ],
  }),
  component: FindingsRegister,
});

function FindingsRegister() {
  return (
    <div>
      <PageHeader
        title="Findings Register"
        summary="Problems are recorded rather than resolved quietly. Each finding states what it asserts, what it does not assert, and whether it is waiting on a decision."
      />

      <Section id="register" title="Register">
        <RegistryTable
          caption="Findings with severity, affected layers, resolution state, and required decision"
          headers={["Finding", "Severity", "Affected layers", "Resolution state", "Required decision"]}
        >
          {FINDINGS.map((finding) => (
            <tr key={finding.id}>
              <RowHeader>
                <span className="block">{finding.id}</span>
                <span className="block font-normal">{finding.title}</span>
              </RowHeader>
              <Cell>{FINDING_SEVERITY_LABEL[finding.severity]}</Cell>
              <Cell>{finding.affectedLayers.join(", ")}</Cell>
              <Cell>
                <StateChip state={finding.resolutionState} describe />
              </Cell>
              <Cell>{finding.requiredDecision ?? "None recorded."}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="records" title="Finding records">
        <div className="space-y-4">
          {FINDINGS.map((finding) => (
            <RecordCard key={finding.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {finding.id} — {finding.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <StateChip state={finding.resolutionState} />
                  {finding.synthetic ? <SyntheticMarker /> : null}
                </div>
              </div>
              <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                <Field label="Severity">{FINDING_SEVERITY_LABEL[finding.severity]}</Field>
                <Field label="Raised">
                  {finding.raisedOn} by {finding.raisedBy}
                </Field>
                <Field label="Affected layers">
                  <ValueList items={finding.affectedLayers} />
                </Field>
                <Field label="Required decision">{finding.requiredDecision ?? "None."}</Field>
                <Field label="Description">{finding.description}</Field>
                <Field label="What this finding does not assert">{finding.boundary}</Field>
                <Field label="Evidence references">
                  <ValueList items={finding.evidenceReferences} empty="No evidence recorded." />
                </Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>
    </div>
  );
}
