import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { StateChip, StateLegend } from "@/components/governance/state-chip";
import { AuthorityLegend } from "@/components/governance/authority-badge";
import { AUTHORIZED_POSTURE, CLAIMS, EXCLUDED_FROM_POSTURE } from "@/fixtures";
import { LIFECYCLE_STAGES, LIFECYCLE_STAGE_LABEL } from "@/domain";

export const Route = createFileRoute("/boundaries")({
  head: () => ({
    meta: [
      { title: "Settings and Boundaries | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "The authorized posture of the SSLS foundation shell: operator only, no personal data, synthetic records, and the claims it refuses to make.",
      },
      { property: "og:title", content: "Settings and Boundaries | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "What this workspace is authorized to do, and what it explicitly is not.",
      },
    ],
  }),
  component: Boundaries,
});

function Boundaries() {
  return (
    <div>
      <PageHeader
        title="Settings and Boundaries"
        summary="The current authorized posture of this workspace. Nothing in the interface may quietly exceed it, and any expansion is a recorded decision rather than a side effect of building more."
      />

      <Section id="posture" title="Currently authorized">
        <ul className="space-y-2">
          {AUTHORIZED_POSTURE.map((item) => (
            <li key={item.statement}>
              <RecordCard>
                <p className="font-display text-base font-semibold">{item.statement}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="excluded"
        title="Outside the current boundary"
        description="Each item is excluded by decision, not by oversight."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {EXCLUDED_FROM_POSTURE.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-md border border-border bg-surface p-3 text-sm"
            >
              <StateChip state="not-authorized" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="claims"
        title="Claims posture"
        description="Supported claims name their basis. Refused claims name why they are withheld."
      >
        <ul className="space-y-2">
          {CLAIMS.map((claim) => (
            <li
              key={claim.id}
              className="flex flex-wrap items-start gap-2 rounded-md border border-border bg-surface p-3 text-sm"
            >
              <StateChip state={claim.state} describe />
              <span className="measure flex-1">
                <span className="font-semibold">{claim.claim}</span>{" "}
                <span className="text-muted-foreground">{claim.reason}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="lifecycle"
        title="Governed lifecycle"
        description="A record moves forward only by a deliberate act. Nothing skips ahead because it looks finished."
      >
        <ol className="flex flex-wrap gap-2">
          {LIFECYCLE_STAGES.map((stage, index) => (
            <li
              key={stage}
              className="rounded-sm border border-border bg-surface px-2 py-1 text-xs font-semibold"
            >
              <span aria-hidden="true" className="font-mono text-muted-foreground">
                {index + 1}.{" "}
              </span>
              {LIFECYCLE_STAGE_LABEL[stage]}
            </li>
          ))}
        </ol>
      </Section>

      <Section id="authority-legend" title="Authority classes">
        <AuthorityLegend />
      </Section>

      <Section id="state-legend" title="State vocabulary">
        <StateLegend />
      </Section>
    </div>
  );
}
