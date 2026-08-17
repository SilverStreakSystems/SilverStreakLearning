import { createFileRoute } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import {
  AuthorityBadge,
  AuthorityLegend,
  ImplementationAuthorityNote,
} from "@/components/governance/authority-badge";
import { StateChip } from "@/components/governance/state-chip";
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { FOUNDATION_ARTIFACTS } from "@/fixtures";
import {
  ARTIFACT_TYPE_LABEL,
  LIFECYCLE_STAGE_LABEL,
  MATURITY_LABEL,
  RECORD_STATE_LABEL,
} from "@/domain";

export const Route = createFileRoute("/authority")({
  head: () => ({
    meta: [
      { title: "Authority Ledger | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "Which SSLS foundation artifacts govern, which only describe, and what each would need before promotion.",
      },
      { property: "og:title", content: "Authority Ledger | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Authority class, evidence basis, supersession, and conflict status per artifact.",
      },
    ],
  }),
  component: AuthorityLedger,
});

function AuthorityLedger() {
  return (
    <div>
      <PageHeader
        title="Authority Ledger"
        summary="Authority is a declared property of each record. It is never inferred from where a file lives, how polished it looks, whether it is built, or whether its tests pass. Workflow progress and authority are shown as separate columns for that reason."
      />

      <Section
        id="ledger"
        title="Ledger"
        description="Every artifact in the Integrated Foundation Registry, with the basis on which it may or may not be relied upon."
      >
        <RegistryTable
          caption="Foundation artifacts with authority, evidence basis, supersession, conflict status, and promotion requirement"
          headers={[
            "Artifact",
            "Version",
            "Authority class",
            "Record state",
            "Implementation authority",
            "Evidence basis",
            "Supersession",
            "Conflict status",
            "Promotion requirement",
          ]}
        >
          {FOUNDATION_ARTIFACTS.map((artifact) => (
            <tr key={artifact.id}>
              <RowHeader>
                <span className="block">{artifact.id}</span>
                <span className="block font-normal">{artifact.title}</span>
                {artifact.synthetic ? <SyntheticMarker className="mt-1" /> : null}
              </RowHeader>
              <Cell>{artifact.version}</Cell>
              <Cell>
                <AuthorityBadge authorityClass={artifact.authorityClass} />
              </Cell>
              <Cell>{RECORD_STATE_LABEL[artifact.recordState]}</Cell>
              <Cell>
                <span className="font-semibold">
                  {artifact.implementationAuthority.granted ? "Granted" : "Not granted"}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {artifact.implementationAuthority.scope}
                </span>
              </Cell>
              <Cell>
                <StateChip state={artifact.evidenceBasis} />
              </Cell>
              <Cell className="text-muted-foreground">
                {artifact.supersededBy ? `Superseded by ${artifact.supersededBy}. ` : ""}
                {artifact.supersedes.length > 0
                  ? `Supersedes ${artifact.supersedes.join(", ")}.`
                  : artifact.supersededBy
                    ? ""
                    : "No supersession recorded."}
              </Cell>
              <Cell>
                <StateChip state={artifact.conflictStatus} />
              </Cell>
              <Cell className="text-muted-foreground">
                {artifact.promotionRequirements.length > 0
                  ? artifact.promotionRequirements.join("; ")
                  : "No promotion pending."}
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="records"
        title="Full artifact records"
        description="Each record carries the complete Integrated Foundation Registry field set."
      >
        <div className="space-y-4">
          {FOUNDATION_ARTIFACTS.map((artifact) => (
            <RecordCard key={artifact.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">
                  {artifact.id} — {artifact.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <AuthorityBadge authorityClass={artifact.authorityClass} />
                  {artifact.synthetic ? <SyntheticMarker /> : null}
                </div>
              </div>

              <div className="mt-2">
                <ImplementationAuthorityNote
                  granted={artifact.implementationAuthority.granted}
                  scope={artifact.implementationAuthority.scope}
                />
              </div>

              <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
                <Field label="Artifact type">{ARTIFACT_TYPE_LABEL[artifact.artifactType]}</Field>
                <Field label="Version and date">
                  {artifact.version} · {artifact.date}
                </Field>
                <Field label="Owner">{artifact.owner}</Field>
                <Field label="Maturity">{MATURITY_LABEL[artifact.maturity]}</Field>
                <Field label="Record state">{RECORD_STATE_LABEL[artifact.recordState]}</Field>
                <Field label="Lifecycle stage">
                  {LIFECYCLE_STAGE_LABEL[artifact.lifecycleStage]}
                </Field>
                <Field label="Source and provenance">{artifact.source}</Field>
                <Field label="Supersedes">
                  <ValueList items={artifact.supersedes} empty="Nothing." />
                </Field>
                <Field label="Superseded by">{artifact.supersededBy ?? "Not superseded."}</Field>
                <Field label="Related artifacts">
                  <ValueList items={artifact.relatedArtifacts} />
                </Field>
                <Field label="Affected layers">
                  <ValueList items={artifact.affectedLayers} />
                </Field>
                <Field label="Affected capabilities">
                  <ValueList items={artifact.affectedCapabilities} />
                </Field>
                <Field label="Known conflicts">
                  <ValueList items={artifact.knownConflicts} empty="None recorded." />
                </Field>
                <Field label="Unresolved questions">
                  <ValueList items={artifact.unresolvedQuestions} empty="None recorded." />
                </Field>
                <Field label="Required reviews">
                  <ValueList items={artifact.requiredReviews} empty="None required." />
                </Field>
                <Field label="Evidence references">
                  <ValueList items={artifact.evidenceReferences} empty="No evidence recorded." />
                </Field>
                <Field label="Promotion requirements">
                  <ValueList items={artifact.promotionRequirements} empty="No promotion pending." />
                </Field>
                <Field label="Notes">{artifact.notes}</Field>
              </dl>
            </RecordCard>
          ))}
        </div>
      </Section>

      <Section
        id="legend"
        title="Authority classes"
        description="The full vocabulary, in order of the weight each class carries."
      >
        <AuthorityLegend />
      </Section>
    </div>
  );
}
