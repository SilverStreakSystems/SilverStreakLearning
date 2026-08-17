import { createFileRoute } from "@tanstack/react-router";
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
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { CAPABILITIES } from "@/fixtures";
import { RECORD_STATE_LABEL } from "@/domain";

export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Capability Registry (Candidate) | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "A first slice of candidate SSLS enterprise capabilities with purpose, beneficiary, independence, evidence expectations, and risk if absent.",
      },
      { property: "og:title", content: "Capability Registry (Candidate) | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Candidate capability records. Not an approved enterprise capability registry.",
      },
    ],
  }),
  component: CapabilityRegistry,
});

function CapabilityRegistry() {
  return (
    <div>
      <PageHeader
        title="Enterprise Capability Registry (Candidate)"
        summary="A deliberately small first slice, derived from the present architecture rather than from an approved registry. Every record below is a candidate. None of them establishes ownership, staffing, or organizational structure."
      >
        <p className="rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          The complete Enterprise Capability Registry does not exist. These records exist to
          exercise the schema and to make the gaps visible.
        </p>
      </PageHeader>

      <Section
        id="registry"
        title="Candidate capabilities"
        description="Sorted by identifier. Implementation status is reported separately from authority and never changes it."
      >
        <RegistryTable
          caption="Candidate enterprise capabilities with owning function, accountable role, authority, and implementation status"
          headers={[
            "Capability",
            "Purpose",
            "Owning function (candidate)",
            "Accountable role (candidate)",
            "Authority",
            "Record state",
            "Implementation status",
          ]}
        >
          {CAPABILITIES.map((capability) => (
            <tr key={capability.id}>
              <RowHeader>
                <span className="block">{capability.id}</span>
                <span className="block font-normal">{capability.name}</span>
              </RowHeader>
              <Cell className="text-muted-foreground">{capability.purpose}</Cell>
              <Cell>{capability.owningFunctionCandidate}</Cell>
              <Cell>{capability.accountableRoleCandidate}</Cell>
              <Cell>
                <AuthorityBadge authorityClass={capability.currentAuthority} />
              </Cell>
              <Cell>{RECORD_STATE_LABEL[capability.recordState]}</Cell>
              <Cell>
                <StateChip state={capability.implementationStatus} />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="records"
        title="Capability records"
        description="The full candidate schema, one card per capability."
      >
        <div className="space-y-4">
          {CAPABILITIES.map((capability) => (
            <RecordCard key={capability.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {capability.id} — {capability.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <AuthorityBadge authorityClass={capability.currentAuthority} />
                  <StateChip state={capability.implementationStatus} />
                  {capability.synthetic ? <SyntheticMarker /> : null}
                </div>
              </div>

              <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                <Field label="Purpose">{capability.purpose}</Field>
                <Field label="North Star contribution">{capability.northStarContribution}</Field>
                <Field label="Human beneficiary">{capability.humanBeneficiary}</Field>
                <Field label="Owning function (candidate)">
                  {capability.owningFunctionCandidate}
                </Field>
                <Field label="Accountable role (candidate)">
                  {capability.accountableRoleCandidate}
                </Field>
                <Field label="Supporting functions">
                  <ValueList items={capability.supportingFunctions} empty="None recorded." />
                </Field>
                <Field label="Independence requirement">{capability.independenceRequirement}</Field>
                <Field label="Required deliverables">
                  <ValueList items={capability.requiredDeliverables} />
                </Field>
                <Field label="Evidence expectations">
                  <ValueList items={capability.evidenceExpectations} />
                </Field>
                <Field label="Maturity trigger">{capability.maturityTrigger}</Field>
                <Field label="Staffing trigger">{capability.staffingTrigger}</Field>
                <Field label="Consolidation eligibility">
                  {capability.consolidationEligibility}
                </Field>
                <Field label="Risk if absent">{capability.riskIfAbsent}</Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>
    </div>
  );
}
