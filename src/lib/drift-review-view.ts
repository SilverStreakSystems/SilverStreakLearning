/**
 * View-model helpers for the drift review surfaces.
 *
 * Kept apart from the components so the labels and the filter rule can be
 * tested directly, and so no rendering concern can quietly change what a
 * relation is called.
 */
import type { DriftAnalysisRecord } from "@/domain/technology-decisions";

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
