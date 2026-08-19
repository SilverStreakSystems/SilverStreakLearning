/**
 * WP-007 cycle 5 documentation projection.
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

  const body = [
    "# FND-022 owner disposition packet — WP-007 Cycle 5",
    "",
    "> Generated from `data/historical/fnd-022-owner-review.json` by",
    "> `scripts/gen-fnd-022-packet.ts`. Do not edit by hand.",
    "> This packet prepares a decision. It records none.",
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
    ...Object.entries(packet.entry_state).map(([k, v]) => `| ${k.replace(/_/g, " ").toUpperCase()} | ${v} |`),
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
        c.matched_current_requirement_ids.length ? c.matched_current_requirement_ids.join(", ") : "none"
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
      `- Owner disposition: _not recorded_`,
      `- Owner rationale: _not recorded_`,
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
        } | ${esc(r.owner_question)} | not recorded |`,
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
      (u) => `| ${u.requirement_id} | ${esc(u.owner_question)} | not recorded |`,
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
