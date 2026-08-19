/**
 * WP-007 cycle 5 review packet and cycle 6 owner disposition projection.
 *
 * The canonical data lives in `data/historical/fnd-022-owner-review.json`.
 * This document is generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadOwnerReviewFile } from "../src/lib/fnd-022-review-registry";

const OUT_DIR = join(process.cwd(), "docs", "wp-007");

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function main() {
  const packet = loadOwnerReviewFile();
  const options = (list: readonly string[]) => list.join(" · ");
  const counts = new Map<string, number>();
  for (const candidate of packet.candidates) {
    counts.set(candidate.owner_disposition, (counts.get(candidate.owner_disposition) ?? 0) + 1);
  }
  const dispositionCounts = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const body = [
    "# FND-022 owner disposition packet — WP-007 Cycle 5 review, Cycle 6 dispositions recorded",
    "",
    "> Generated from `data/historical/fnd-022-owner-review.json` by",
    "> `scripts/gen-fnd-022-packet.ts`. Do not edit by hand.",
    "> Cycle 5 prepared the decision. Cycle 6 transcribes the owner decision",
    "> recorded as DEC-020 in `data/historical/fnd-022-owner-dispositions.json`.",
    "> This document originates no decision.",
    "",
    "## Owner decision of record",
    "",
    `- Decision: ${packet.owner_decision.decision_id}, recorded ${packet.owner_decision.recorded_on} by ${packet.owner_decision.recorded_by}.`,
    `- Canonical record: \`${packet.owner_decision.canonical_record}\`.`,
    `- ${packet.owner_decision.note}`,
    "",
    "| Disposition | Candidates |",
    "| --- | --- |",
    ...dispositionCounts.map(([value, count]) => `| ${value} | ${count} |`),
    "",
    "## Packet boundary",
    "",
    packet.packet_boundary,
    "",
    "## Authority",
    "",
    packet.authority_note,
    "",
    "## Advisory notice",
    "",
    packet.advisory_note,
    "",
    "## Owner option vocabulary",
    "",
    packet.owner_option_vocabulary_note,
    "",
    `Options presented for every item: ${options(packet.candidates[0]!.owner_options)}.`,
    "",
    "## Entry state",
    "",
    "| Item | State |",
    "| --- | --- |",
    ...Object.entries(packet.entry_state).map(
      ([k, v]) => `| ${k.replace(/_/g, " ").toUpperCase()} | ${v} |`,
    ),
    "",
    "## Reconciliation against the Cycle 4 record",
    "",
    `- Candidates presented: ${packet.reconciliation.candidate_count} (${packet.reconciliation.candidate_id_range}).`,
    `- Restatement rows presented: ${packet.reconciliation.restatement_row_count}.`,
    ...Object.entries(packet.reconciliation.relationship_totals).map(([k, v]) => `  - ${k}: ${v}`),
    `- Unmatched current candidates: ${packet.reconciliation.unmatched_count}, listed separately and not counted among the rows.`,
    "",
    "## Candidate review",
    "",
    ...packet.candidates.flatMap((c) => [
      `### ${c.candidate_id} — ${c.requirement_family} (${c.modality_as_worded} as worded)`,
      "",
      `> ${c.exact_text}`,
      "",
      `- Source: ${c.source_id}, ${c.source_title}, ${c.source_locator}; artifact ${c.package_artifact_id} of ${c.package_id} (${c.package_completeness}); digest \`${c.source_digest}\`.`,
      `- Current status: ${c.current_status.disposition}, ${c.current_status.conformance_state}, authority ${c.current_status.inherited_authority}, source ${c.current_status.promotion_state}.`,
      `- Mapped current requirements: ${
        c.matched_current_requirement_ids.length
          ? c.matched_current_requirement_ids.join(", ")
          : "none"
      } (${c.relationship_type.join(", ")}; rows ${c.relationship_rows.join(", ")}).`,
      `- Cycle 4 basis: ${c.relationship_rationale}`,
      `- Substantive delta: ${c.substantive_delta}`,
      `- Scope or authority implication: ${c.scope_or_authority_implication}`,
      `- Evidence gaps: ${c.evidence_gaps}`,
      `- Recorded ambiguity: ${c.recorded_ambiguity}`,
      `- Affected requirements, controls, or claims: ${c.affected_requirements_controls_or_claims}`,
      `- Impact if adopted or merged: ${c.impact_if_adopted_or_merged}`,
      `- Impact if rejected or deferred: ${c.impact_if_rejected_or_deferred}`,
      `- ${c.advisory_recommendation}`,
      `- ${c.advisory_rationale}`,
      `- Owner options: ${options(c.owner_options)}`,
      `- Owner disposition (${packet.owner_decision.decision_id}): ${c.owner_disposition}`,
      `- Owner rationale: ${c.owner_rationale}`,
      "",
    ]),
    "## Restatement row review",
    "",
    "| Row | Historical | Reads as | Current | Owner question | Disposition |",
    "| --- | --- | --- | --- | --- | --- |",
    ...packet.restatement_review_rows.map(
      (r) =>
        `| ${r.relation_id} | ${r.historical_candidate} | ${r.relationship_classification} | ${
          r.mapped_current_requirement ?? "none found"
        } | ${esc(r.owner_question)} | ${r.owner_disposition} |`,
    ),
    "",
    "Every row above preserves its Cycle 4 classification unchanged. Full rationale,",
    "source support, and recorded uncertainty for each row are in the JSON packet.",
    "",
    "## Current candidates with no historical counterpart",
    "",
    "| Requirement | Owner question | Disposition |",
    "| --- | --- | --- |",
    ...packet.unmatched_current_candidates.map(
      (u) => `| ${u.requirement_id} | ${esc(u.owner_question)} | ${u.owner_disposition} — ${esc(u.owner_rationale)} |`,
    ),
    "",
    "## Refused in this cycle",
    "",
    ...packet.refused_in_this_cycle.map((line) => `- ${line}`),
    "",
  ].join("\n");

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "FND-022_OWNER_DISPOSITION_PACKET.md"), body, "utf8");
  console.log(
    `WP-007: projected ${packet.candidates.length} candidates and ${packet.restatement_review_rows.length} rows into 1 document.`,
  );
}

main();
