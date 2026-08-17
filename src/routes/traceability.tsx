import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { StateChip } from "@/components/governance/state-chip";
import { SyntheticMarker } from "@/components/governance/markers";
import { ENTERPRISE_CHAIN_THREADS, GOVERNANCE_SPINE_THREADS } from "@/fixtures";
import {
  ENTERPRISE_CHAIN_LABEL,
  GOVERNANCE_SPINE_LABEL,
  GOVERNANCE_SPINE_STEPS,
  ENTERPRISE_CHAIN_STEPS,
} from "@/domain";

export const Route = createFileRoute("/traceability")({
  head: () => ({
    meta: [
      { title: "Traceability | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "The SSLS Governance Spine and the enterprise outcome chain shown as two related views over the same records.",
      },
      { property: "og:title", content: "Traceability | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Requirement to evidence to claim, and North Star to outcome to learning.",
      },
    ],
  }),
  component: Traceability,
});

function ChainKey({ steps, label }: { steps: readonly string[]; label: (step: string) => string }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <li
          key={step}
          className="rounded-sm border border-border bg-surface px-2 py-1 text-xs font-semibold"
        >
          <span aria-hidden="true" className="font-mono text-muted-foreground">
            {index + 1}.{" "}
          </span>
          {label(step)}
        </li>
      ))}
    </ol>
  );
}

function Thread({
  title,
  nodes,
  label,
  synthetic,
}: {
  title: string;
  nodes: { step: string; refId: string; summary: string; state: never | string }[];
  label: (step: string) => string;
  synthetic: boolean;
}) {
  return (
    <RecordCard>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {synthetic ? <SyntheticMarker /> : null}
      </div>
      <ol className="mt-3 space-y-2">
        {nodes.map((node, index) => (
          <li
            key={`${node.step}-${index}`}
            className="border-l-4 border-border-strong pl-3 sm:flex sm:flex-wrap sm:items-baseline sm:gap-2"
          >
            <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {label(node.step)}
            </span>
            <span className="block font-mono text-xs">{node.refId}</span>
            <span className="block flex-1 text-sm">{node.summary}</span>
            <StateChip state={node.state as never} />
          </li>
        ))}
      </ol>
    </RecordCard>
  );
}

function Traceability() {
  return (
    <div>
      <PageHeader
        title="Traceability"
        summary="Two views over the same records. The Governance Spine is preserved unchanged; the enterprise outcome chain extends it. They are complementary, not competing, and neither overrides the other."
      />

      <Section
        id="spine"
        title="Governance Spine"
        description="Requirement, decision, task, implementation, validation, finding, evidence, claim."
      >
        <ChainKey
          steps={GOVERNANCE_SPINE_STEPS}
          label={(step) => GOVERNANCE_SPINE_LABEL[step as keyof typeof GOVERNANCE_SPINE_LABEL]}
        />
        <div className="mt-4 space-y-4">
          {GOVERNANCE_SPINE_THREADS.map((thread) => (
            <Thread
              key={thread.id}
              title={`${thread.id} — ${thread.title}`}
              nodes={thread.nodes}
              synthetic={thread.synthetic}
              label={(step) => GOVERNANCE_SPINE_LABEL[step as keyof typeof GOVERNANCE_SPINE_LABEL]}
            />
          ))}
        </div>
      </Section>

      <Section
        id="enterprise-chain"
        title="Enterprise outcome chain"
        description="North Star through human outcome, principle, capability, function, role, value stream, work, validation, evidence, outcome, and learning."
      >
        <ChainKey
          steps={ENTERPRISE_CHAIN_STEPS}
          label={(step) => ENTERPRISE_CHAIN_LABEL[step as keyof typeof ENTERPRISE_CHAIN_LABEL]}
        />
        <div className="mt-4 space-y-4">
          {ENTERPRISE_CHAIN_THREADS.map((thread) => (
            <Thread
              key={thread.id}
              title={`${thread.id} — ${thread.title}`}
              nodes={thread.nodes}
              synthetic={thread.synthetic}
              label={(step) => ENTERPRISE_CHAIN_LABEL[step as keyof typeof ENTERPRISE_CHAIN_LABEL]}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
