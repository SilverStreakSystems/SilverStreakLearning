/**
 * Value stream normalization findings.
 *
 * The candidate list of streams supplied by the operator is a proposal, not a
 * registry. Normalization records what was kept, merged, demoted, or deferred,
 * and why.
 */

export const VALUE_STREAM_DISPOSITIONS = [
  "kept-as-stream",
  "merged-into-stream",
  "demoted-to-subflow",
  "rejected-departmental-process",
  "deferred-gated-future",
] as const;

export type ValueStreamDisposition = (typeof VALUE_STREAM_DISPOSITIONS)[number];

export const VALUE_STREAM_DISPOSITION_LABEL: Record<ValueStreamDisposition, string> = {
  "kept-as-stream": "Kept as an end-to-end stream",
  "merged-into-stream": "Merged into another stream",
  "demoted-to-subflow": "Demoted to a subflow of another stream",
  "rejected-departmental-process": "Rejected as a departmental process",
  "deferred-gated-future": "Kept, but gated as future architecture",
};

export const NORMALIZATION_CHECKS = [
  "duplicate-streams",
  "subflow-not-stream",
  "departmental-process",
  "missing-end-to-end-outcome",
  "overlong-stream",
  "broken-handoff",
  "overlapping-authority",
  "unnecessary-object-copying",
  "missing-learning-loop",
  "future-shown-as-active",
] as const;

export type NormalizationCheck = (typeof NORMALIZATION_CHECKS)[number];

export const NORMALIZATION_CHECK_LABEL: Record<NormalizationCheck, string> = {
  "duplicate-streams": "Duplicate streams",
  "subflow-not-stream": "Subflow presented as a stream",
  "departmental-process": "Departmental process presented as a stream",
  "missing-end-to-end-outcome": "No end-to-end outcome",
  "overlong-stream": "Stream too long to govern as one flow",
  "broken-handoff": "Broken or implicit handoff",
  "overlapping-authority": "Overlapping decision authority",
  "unnecessary-object-copying": "Objects copied between streams",
  "missing-learning-loop": "No learning loop",
  "future-shown-as-active": "Future work presented as active",
};

export interface ValueStreamNormalizationFinding {
  findingId: string;
  check: NormalizationCheck;
  candidateName: string;
  /** The stream the finding resolves to, when one exists. */
  resolvedValueStreamId: string | null;
  disposition: ValueStreamDisposition;
  observation: string;
  judgment: string;
  consequence: string;
}
