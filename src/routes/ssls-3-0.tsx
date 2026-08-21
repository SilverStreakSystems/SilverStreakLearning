import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { StateChip } from "@/components/governance/state-chip";
import {
  authorizedDocuments,
  canonicalStatusCounts,
  decisionsByPriority,
  documentsMissingReviewClass,
  reconstructedDocuments,
  type DecisionPriority,
} from "@/domain/ssls-3-0/canon";
import { canonDocuments, loadCanon } from "@/lib/ssls-3-0-registry";

export const Route = createFileRoute("/ssls-3-0")({
  head: () => ({
    meta: [
      { title: "SSLS 3.0 Canon Index | Silver Streak Learning Systems" },
      {
        name: "description",
        content:
          "The twelve SSLS 3.0 foundation documents held in this repository, their lifecycle status and provenance, and the 58 owner decisions they leave open. Index only, non-controlling.",
      },
      { property: "og:title", content: "SSLS 3.0 Canon Index" },
      {
        property: "og:description",
        content:
          "Foundation documents, provenance, and open owner decisions. Registration confers no authority.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ssls30Canon,
});

const PRIORITY_LABEL: Record<DecisionPriority, string> = {
  "1": "Priority 1 — blocks everything downstream",
  "2": "Priority 2",
  "3": "Priority 3",
  unranked: "Unranked in the foundation package",
};

function Ssls30Canon() {
  const record = loadCanon();
  const documents = canonDocuments();
  const authorized = authorizedDocuments(record);
  const reconstructed = reconstructedDocuments(record);
  const missingReviewClass = documentsMissingReviewClass(record);
  const statusCounts = [...canonicalStatusCounts(record)].sort((a, b) => a[0].localeCompare(b[0]));
  const decisionGroups = [...decisionsByPriority(record)];

  const counts: Array<{ label: string; value: number }> = [
    { label: "Documents registered", value: documents.length },
    { label: "Documents carrying authority", value: authorized.length },
    { label: "Reconstructed, not transcribed", value: reconstructed.length },
    { label: "Not stating a review class", value: missingReviewClass.length },
    { label: "Open owner decisions", value: record.open_decisions.length },
    { label: "Unresolved items carried", value: record.unresolved_items.length },
  ];

  return (
    <div>
      <PageHeader
        title="SSLS 3.0 Canon Index"
        summary="The twelve SSLS 3.0 foundation documents held in this repository, what each controls, where its text came from, and every owner decision it leaves open."
      />

      <div
        role="note"
        aria-labelledby="canon-non-authority"
        className="mb-8 rounded-md border border-border bg-surface p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <StateChip state="not-authorized" />
          <h2 id="canon-non-authority" className="font-display text-base font-semibold">
            Index only — non-controlling
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{record.non_authority_statement}</p>
        <p className="mt-2 text-sm text-muted-foreground">{record.clean_slate_statement}</p>
      </div>

      <Section id="counts" title="Standing counts">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map((item) => (
            <li key={item.label}>
              <RecordCard>
                <p className="font-display text-2xl font-semibold tabular-nums">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </RecordCard>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Lifecycle status:{" "}
          {statusCounts.map(([status, count], index) => (
            <span key={status}>
              {index > 0 ? " · " : ""}
              {status} {count}
            </span>
          ))}
        </p>
      </Section>

      <Section
        id="documents"
        title="Foundation documents"
        description="Reading order is the package's own. A document controls only the concept named against it, and only once an owner decision says so."
      >
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.document_id}>
              <RecordCard>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-display text-base font-semibold">{doc.title}</p>
                  <code className="text-xs text-muted-foreground">{doc.document_id}</code>
                  <StateChip state="not-authorized" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Controls: {doc.controlled_concept}
                </p>
                <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="inline text-muted-foreground">File: </dt>
                    <dd className="inline">
                      <code className="text-xs">{doc.file_name}</code>
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Status: </dt>
                    <dd className="inline">
                      {doc.canonical_status} · {doc.version}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Provenance: </dt>
                    <dd className="inline">{doc.provenance}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Authorizing decision: </dt>
                    <dd className="inline">{doc.authorizing_decision ?? "none"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="inline text-muted-foreground">Review class: </dt>
                    <dd className="inline">
                      {doc.review_class ?? "none stated — recorded defect"}
                    </dd>
                  </div>
                </dl>
                {doc.open_decision_ids.length > 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Raises {doc.open_decision_ids.length} open decision
                    {doc.open_decision_ids.length === 1 ? "" : "s"}:{" "}
                    {doc.open_decision_ids.join(", ")}
                  </p>
                ) : null}
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="decisions"
        title="Open owner decisions"
        description="Listing a decision does not answer it, rank it beyond what the package states, or defer it. Only the owner records a decision."
      >
        {decisionGroups.map(([priority, decisions]) => (
          <div key={priority} className="mb-6">
            <h3 className="font-display text-base font-semibold">{PRIORITY_LABEL[priority]}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {decisions.length} decision{decisions.length === 1 ? "" : "s"}.
            </p>
            <ul className="mt-2 space-y-2">
              {decisions.map((decision) => (
                <li
                  key={decision.decision_id}
                  className="rounded-md border border-border bg-surface p-3 text-sm"
                >
                  <code className="text-xs text-muted-foreground">{decision.decision_id}</code>{" "}
                  <span>{decision.question}</span>
                  <span className="ml-1 text-muted-foreground">
                    (raised by {decision.source_document_id})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section
        id="unresolved"
        title="Unresolved items"
        description="Discrepancies carried forward rather than silently corrected. Each states more than one position and routes to an owner decision."
      >
        <ul className="space-y-2">
          {record.unresolved_items.map((item) => (
            <li key={item.item_id}>
              <RecordCard>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p className="font-display text-base font-semibold">{item.item_id}</p>
                  <code className="text-xs text-muted-foreground">routed to {item.routed_to}</code>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {item.positions.map((position) => (
                    <li key={position}>{position}</li>
                  ))}
                </ul>
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="non-effects" title="What this page does not do">
        <ul className="space-y-2">
          {record.non_effects.map((effect) => (
            <li
              key={effect}
              className="flex items-start gap-2 rounded-md border border-border bg-surface p-3 text-sm"
            >
              <StateChip state="not-authorized" />
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
