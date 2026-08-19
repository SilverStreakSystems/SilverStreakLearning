/**
 * WP-007 cycle 4 documentation projection.
 *
 * The canonical data lives in `data/historical/restatement-index.json`.
 * This document is generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadHistoricalRequirementFile } from "../src/lib/historical-requirement-registry";
import { loadRestatementIndexFile } from "../src/lib/restatement-registry";

const OUT_DIR = join(process.cwd(), "docs", "wp-007");

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function main() {
  const index = loadRestatementIndexFile();
  const requirements = loadHistoricalRequirementFile().records;
  const summaryOf = (id: string | null) =>
    id ? (requirements.find((r) => r.requirement_id === id)?.normalized_summary ?? "(unknown)") : "—";

  const counts = new Map<string, number>();
  for (const r of index.relations) counts.set(r.relationship, (counts.get(r.relationship) ?? 0) + 1);

  const body = [
    "# WP-007 cross-source restatement index",
    "",
    "> Generated from `data/historical/restatement-index.json` by",
    "> `scripts/gen-restatement-docs.ts`. Do not edit by hand.",
    "> A row records how one candidate wording reads against another. It merges nothing,",
    "> supersedes nothing, resolves nothing, and claims no conformance.",
    "",
    "## Index boundary",
    "",
    index.index_boundary,
    "",
    "## Relationship vocabulary",
    "",
    index.relationship_vocabulary_note,
    "",
    "## Distribution",
    "",
    `| Relationship | Rows |`,
    `| --- | --- |`,
    ...[...counts.entries()].map(([k, v]) => `| ${k} | ${v} |`),
    "",
    "## Relations",
    "",
    "| Row | Subject | Reads as | Counterpart | Basis |",
    "| --- | --- | --- | --- | --- |",
    ...index.relations.map(
      (r) =>
        `| ${r.relation_id} | ${r.subject_requirement} (${r.subject_source}) — ${esc(
          summaryOf(r.subject_requirement),
        )} | ${r.relationship} | ${
          r.related_requirement
            ? `${r.related_requirement} (${r.related_source}) — ${esc(summaryOf(r.related_requirement))}`
            : "none found"
        } | ${esc(r.basis)} |`,
    ),
    "",
    "## Candidates with no counterpart in the subject source",
    "",
    "| Candidate | Source | Note |",
    "| --- | --- | --- |",
    ...index.unmatched_related_candidates.map(
      (u) => `| ${u.requirement_id} | ${u.source_id} | ${esc(u.note)} |`,
    ),
    "",
    "## Refused in this cycle",
    "",
    "- merging, deduplicating, editing, or deleting any candidate wording;",
    "- electing a controlling wording or resolving a conflict between sources;",
    "- assigning any disposition or conformance state to any candidate;",
    "- promoting HS-023 or PKG-001, or treating either as current authority;",
    "- inferring anything about the unsupplied v0.2.0 DOCX and ZIP;",
    "- asserting WCAG, ADA Title II, Section 508, or any other accessibility conformance;",
    "- closing WP-007, advancing Gate A, or authorizing WP-039.",
    "",
  ].join("\n");

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "RESTATEMENT_INDEX.md"), body, "utf8");
  console.log(`WP-007: projected ${index.relations.length} restatement rows into 1 document.`);
}

main();
