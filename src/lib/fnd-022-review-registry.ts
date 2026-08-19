/**
 * Reads the WP-007 cycle 5 FND-022 owner-review packet from `data/historical/`.
 *
 * The JSON file is the single source of truth for the packet; the Markdown
 * document is generated from it. This loader is used by tests and by the
 * documentation generator only; no route imports it, so no filesystem access
 * reaches the client bundle.
 *
 * Nothing here originates an owner disposition. The owner fields carried by the
 * packet are transcribed from the canonical Cycle 6 disposition record,
 * `data/historical/fnd-022-owner-dispositions.json`, recorded under DEC-020.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data", "historical");

export const OWNER_REVIEW_OPTIONS = [
  "RETAIN-HISTORICAL",
  "ADOPT-AS-CANDIDATE",
  "MERGE-OR-RESTATEMENT",
  "NARROW",
  "SUPERSEDE",
  "REJECT",
  "NEEDS-EVIDENCE / DEFER",
] as const;

export type OwnerReviewOption = (typeof OWNER_REVIEW_OPTIONS)[number];

/** The only conclusion an unmatched current row may carry. */
export const UNMATCHED_CONCLUSION = "NO-ACTION-CURRENT-STANDS" as const;

export type UnmatchedConclusion = typeof UNMATCHED_CONCLUSION;

export interface OwnerReviewCandidate {
  candidate_id: string;
  exact_text: string;
  source_id: string;
  source_title: string;
  source_digest: string;
  source_locator: string;
  source_locator_detail: string;
  package_id: string;
  package_artifact_id: string;
  package_completeness: string;
  current_status: {
    disposition: string;
    conformance_state: string;
    inherited_authority: string;
    promotion_state: string;
  };
  requirement_family: string;
  modality_as_worded: string;
  matched_current_requirement_ids: string[];
  relationship_type: string[];
  relationship_rows: string[];
  relationship_rationale: string;
  substantive_delta: string;
  scope_or_authority_implication: string;
  evidence_gaps: string;
  recorded_ambiguity: string;
  affected_requirements_controls_or_claims: string;
  owner_options: OwnerReviewOption[];
  advisory_recommendation: string;
  advisory_rationale: string;
  impact_if_adopted_or_merged: string;
  impact_if_rejected_or_deferred: string;
  owner_disposition: OwnerReviewOption;
  owner_rationale: string;
  boundary: string;
}

export interface OwnerReviewRow {
  relation_id: string;
  historical_candidate: string;
  historical_candidate_text: string;
  mapped_current_requirement: string | null;
  mapped_current_requirement_text: string | null;
  relationship_classification: string;
  classification_rationale: string;
  source_support: string;
  uncertainty_or_evidence_gap: string;
  owner_question: string;
  owner_options: OwnerReviewOption[];
  owner_disposition: OwnerReviewOption;
  owner_rationale: string;
  cycle4_classification_preserved: true;
}

export interface OwnerReviewUnmatched {
  requirement_id: string;
  source_id: string;
  exact_text: string;
  source_locator: string;
  note: string;
  owner_question: string;
  owner_options: OwnerReviewOption[];
  owner_disposition: UnmatchedConclusion;
  owner_rationale: string;
}

export interface OwnerReviewFile {
  schema_version: string;
  generated_on: string;
  finding_id: string;
  work_package: string;
  cycle: string;
  authority_note: string;
  packet_boundary: string;
  advisory_note: string;
  owner_option_vocabulary_note: string;
  owner_decision: {
    decision_id: string;
    recorded_on: string;
    recorded_by: string;
    canonical_record: string;
    note: string;
  };
  entry_state: Record<string, string>;
  reconciliation: {
    candidate_count: number;
    candidate_id_range: string;
    restatement_row_count: number;
    relationship_totals: Record<string, number>;
    unmatched_count: number;
    unmatched_counted_in_rows: boolean;
  };
  candidates: OwnerReviewCandidate[];
  restatement_review_rows: OwnerReviewRow[];
  unmatched_current_candidates: OwnerReviewUnmatched[];
  refused_in_this_cycle: string[];
}

export function loadOwnerReviewFile(): OwnerReviewFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "fnd-022-owner-review.json"), "utf8"),
  ) as OwnerReviewFile;
}

export function loadOwnerReviewSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "FND_022_OWNER_REVIEW_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}

export interface CandidateDisposition {
  candidate_id: string;
  exact_text: string;
  owner_disposition: OwnerReviewOption;
  owner_rationale: string;
  controlling_requirement_ids: string[];
  post_disposition_state: {
    extraction_record_unchanged: true;
    conformance_state: string;
    promotion_state: string;
    implementation_state: string;
  };
}

export interface RowConclusion {
  relation_id: string;
  historical_candidate: string;
  cycle4_classification: string;
  cycle4_classification_preserved: true;
  owner_conclusion: OwnerReviewOption;
  controlling_requirement: string | null;
  note: string;
}

export interface UnmatchedConclusionRecord {
  requirement_id: string;
  source_id: string;
  owner_conclusion: UnmatchedConclusion;
  owner_rationale: string;
  authority_unchanged: true;
}

export interface OwnerDispositionFile {
  schema_version: string;
  recorded_on: string;
  recorded_by: string;
  decision_id: string;
  finding_id: string;
  work_package: string;
  cycle: string;
  authority_note: string;
  boundary: string;
  disposition_vocabulary: OwnerReviewOption[];
  unmatched_conclusion_vocabulary: UnmatchedConclusion[];
  candidate_dispositions: CandidateDisposition[];
  relationship_row_conclusions: RowConclusion[];
  unmatched_conclusions: UnmatchedConclusionRecord[];
  totals: Record<string, number>;
  deferred_evidence_gap: {
    candidate_id: string;
    finding_id: string;
    gap: string;
    required_before_reconsideration: string;
  };
  non_effects: string[];
}

/**
 * Reads the canonical WP-007 cycle 6 owner disposition record. This file is the
 * single source of the owner decisions; the review packet and the generated
 * Markdown projection transcribe it and originate nothing.
 */
export function loadOwnerDispositionFile(): OwnerDispositionFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "fnd-022-owner-dispositions.json"), "utf8"),
  ) as OwnerDispositionFile;
}

export function loadOwnerDispositionSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "FND_022_OWNER_DISPOSITION_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}
