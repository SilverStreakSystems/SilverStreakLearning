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
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { DECISIONS } from "@/fixtures";
import { DECISION_STATE_LABEL, RECORD_STATE_LABEL } from "@/domain";

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: "Decisions Register | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "Accepted, pending, required, and declined decisions governing the SSLS foundation shell, with their consequences.",
      },
      { property: "og:title", content: "Decisions Register | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "What has been decided, what is still open, and what each decision commits to.",
      },
    ],
  }),
  component: DecisionsRegister,
});

function DecisionsRegister() {
  const groups = (["required", "pending", "accepted", "declined", "superseded"] as const).map(
    (state) => ({
      state,
      records: DECISIONS.filter((decision) => decision.state === state),
    }),
  );

  return (
    <div>
      <PageHeader
        title="Decisions Register"
        summary="A decision is an act, not a state that emerges from work being finished. Accepted decisions carry authority; pending and required decisions carry none until they are made."
      />

      <Section id="register" title="Register">
        <RegistryTable
          caption="Decisions with state, date, authority class, and record state"
          headers={["Decision", "State", "Decided", "Authority", "Record state"]}
        >
          {DECISIONS.map((decision) => (
            <tr key={decision.id}>
              <RowHeader>
                <span className="block">{decision.id}</span>
                <span className="block font-normal">{decision.title}</span>
              </RowHeader>
              <Cell className="font-semibold">{DECISION_STATE_LABEL[decision.state]}</Cell>
              <Cell>
                {decision.decidedOn ? `${decision.decidedOn} by ${decision.decidedBy}` : "Not decided."}
              </Cell>
              <Cell>
                <AuthorityBadge authorityClass={decision.authorityClass} />
              </Cell>
              <Cell>{RECORD_STATE_LABEL[decision.recordState]}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      {groups
        .filter((group) => group.records.length > 0)
        .map((group) => (
          <Section
            key={group.state}
            id={`group-${group.state}`}
            title={DECISION_STATE_LABEL[group.state]}
          >
            <div className="space-y-4">
              {group.records.map((decision) => (
                <RecordCard key={decision.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {decision.id} — {decision.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <AuthorityBadge authorityClass={decision.authorityClass} />
                      {decision.synthetic ? <SyntheticMarker /> : null}
                    </div>
                  </div>
                  <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                    <Field label="State">{DECISION_STATE_LABEL[decision.state]}</Field>
                    <Field label="Decided">
                      {decision.decidedOn
                        ? `${decision.decidedOn} by ${decision.decidedBy}`
                        : "Not decided."}
                    </Field>
                    <Field label="Context">{decision.context}</Field>
                    <Field label="Decision">{decision.decision}</Field>
                    <Field label="Consequences">
                      <ValueList items={decision.consequences} />
                    </Field>
                    <Field label="Related artifacts">
                      <ValueList items={decision.relatedArtifacts} />
                    </Field>
                    <Field label="Supersedes">
                      <ValueList items={decision.supersedes} empty="Nothing." />
                    </Field>
                    <Field label="Superseded by">{decision.supersededBy ?? "Not superseded."}</Field>
                  </dl>
                </RecordCard>
              ))}
            </div>
          </Section>
        ))}
    </div>
  );
}
