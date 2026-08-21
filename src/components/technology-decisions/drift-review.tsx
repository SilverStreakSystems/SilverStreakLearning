/**
 * Owner review surfaces for the drift analysis.
 *
 * These components display analysis. They contain no control that records a
 * disposition, and there is nothing here that writes to storage: a decision is
 * a governance act recorded elsewhere, deliberately not a click. Every panel
 * states that review is pending so the status can never be inferred from
 * layout or colour alone.
 */
import { Link } from "@tanstack/react-router";
import type { DriftAnalysisRecord } from "@/domain/technology-decisions";
import { Cell, RegistryTable, RowHeader } from "@/components/governance/page";

export const OWNER_REVIEW_PENDING = "OWNER REVIEW PENDING — no disposition has been recorded.";

export const RELATION_LABEL: Record<DriftAnalysisRecord["comparison_relation"], string> = {
  EXACT: "Both readings name the same options",
  "DERIVED-PROPER-SUBSET": "Derived set is contained in the supplied set",
  "DERIVED-PROPER-SUPERSET": "Derived set adds options beyond the supplied set",
  "PARTIAL-OVERLAP": "Each reading names something the other omits",
  DISJOINT: "The two readings share no option",
  "SOURCE-UNPARSEABLE": "The supplied recommendation cannot be read as one committed set",
  "DERIVED-ABSTAIN": "The evaluator abstained, which is not a disagreement",
};

export function ReviewStatusNote({ record }: { record: DriftAnalysisRecord }) {
  return (
    <p
      data-review-status={record.review_status}
      className="measure rounded-md border border-border-strong bg-muted px-3 py-2 text-sm font-semibold"
    >
      {OWNER_REVIEW_PENDING}
    </p>
  );
}

/** Supplied reading and derived reading, side by side and never merged. */
export function ComparisonPanel({ record }: { record: DriftAnalysisRecord }) {
  return (
    <div className="space-y-4">
      <ReviewStatusNote record={record} />
      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-label="Supplied recommendation"
          className="rounded-md border border-border bg-muted p-4"
        >
          <h3 className="font-display text-base font-semibold">Supplied (verbatim source)</h3>
          <p className="measure mt-2 text-sm">{record.source_recommendation_verbatim}</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Read as
              </dt>
              <dd>
                {record.expression_type} / {record.parse_status}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Committed now
              </dt>
              <dd>{record.supplied_option_ids.join(", ") || "None readable"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Staged, optional, or interim
              </dt>
              <dd>{record.supplied_deferred_option_ids.join(", ") || "None"}</dd>
            </div>
          </dl>
        </section>

        <section
          aria-label="Derived result"
          className="rounded-md border border-border bg-surface p-4"
        >
          <h3 className="font-display text-base font-semibold">Derived (computed separately)</h3>
          <p className="measure mt-2 text-sm">
            {record.derived_option_ids.join(", ") || "The evaluator abstained."}
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Deciding step
              </dt>
              <dd>{record.deciding_step ?? "None — abstained"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                AI boundary
              </dt>
              <dd>{record.ai_boundary}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Invariants applied
              </dt>
              <dd>{record.invariants_applied.join(", ") || "None constrained this result"}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section aria-label="Analysis" className="rounded-md border border-border p-4">
        <h3 className="font-display text-base font-semibold">Analysis</h3>
        <dl className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Relation
            </dt>
            <dd className="text-sm">
              {record.comparison_relation} — {RELATION_LABEL[record.comparison_relation]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Evidence
            </dt>
            <dd className="text-sm">{record.evidence_state}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Decision drivers
            </dt>
            <dd className="text-sm">{record.decision_drivers.join(", ") || "None recorded"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Candidate causes
            </dt>
            <dd className="text-sm">{record.candidate_causes.join(", ") || "None"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Unresolved question
            </dt>
            <dd className="text-sm">{record.unresolved_question ?? "None recorded"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Individual review required
            </dt>
            <dd className="text-sm">
              {record.mandatory_review ? record.mandatory_review_reasons.join(" ") : "Not required"}
            </dd>
          </div>
        </dl>
        <h4 className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Engineering proposal, not a decision
        </h4>
        <p className="measure mt-1 text-sm">
          <strong>{record.proposed_resolution}</strong> — {record.proposal_basis}
        </p>
      </section>
    </div>
  );
}

export interface ReviewFilters {
  relation: string;
  risk: string;
  group: string;
  cohort: string;
}

export function applyReviewFilters(
  records: DriftAnalysisRecord[],
  filters: ReviewFilters,
): DriftAnalysisRecord[] {
  return records.filter((record) => {
    if (filters.relation !== "all" && record.comparison_relation !== filters.relation) return false;
    if (filters.risk !== "all" && record.risk_level !== filters.risk) return false;
    if (filters.group !== "all" && record.role_group_id !== filters.group) return false;
    if (filters.cohort === "mandatory" && !record.mandatory_review) return false;
    if (filters.cohort === "batch" && !record.batch_eligible) return false;
    if (filters.cohort === "needs-evidence" && record.proposed_resolution !== "NEEDS-EVIDENCE") {
      return false;
    }
    return true;
  });
}

export function ReviewQueueTable({ records }: { records: DriftAnalysisRecord[] }) {
  if (records.length === 0) {
    return (
      <p className="measure text-sm text-muted-foreground">
        No record matches these filters. Change a filter to widen the queue.
      </p>
    );
  }
  return (
    <RegistryTable
      caption={`${records.length} analysis records. Every one is awaiting owner review.`}
      headers={["Workflow", "Relation", "Evidence", "Individual review", "Proposal", "Status"]}
    >
      {records.map((record) => (
        <tr key={record.workflow_id}>
          <RowHeader>
            <Link
              to="/technology-decisions/workflows/$workflowId"
              params={{ workflowId: record.workflow_id }}
              className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {record.workflow_id}
            </Link>
            <span className="block text-xs text-muted-foreground">{record.role_group_name}</span>
          </RowHeader>
          <Cell>{record.comparison_relation}</Cell>
          <Cell>{record.evidence_state}</Cell>
          <Cell>{record.mandatory_review ? "Required" : "Not required"}</Cell>
          <Cell>{record.proposed_resolution}</Cell>
          <Cell>Not reviewed</Cell>
        </tr>
      ))}
    </RegistryTable>
  );
}
