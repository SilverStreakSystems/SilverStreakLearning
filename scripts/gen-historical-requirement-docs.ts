/**
 * WP-007 cycle 2 documentation projection.
 *
 * The canonical data lives in `data/historical/historical-requirements.json`.
 * These documents are generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { HistoricalRequirementRecord } from "../src/domain/historical-requirement";
import { loadHistoricalRequirementFile } from "../src/lib/historical-requirement-registry";

const OUT_DIR = join(process.cwd(), "docs", "wp-007");

const HEADER = (title: string) =>
  `# ${title}\n\n> Generated from \`data/historical/historical-requirements.json\` by ` +
  `\`scripts/gen-historical-requirement-docs.ts\`. Do not edit by hand.\n> Every record is a ` +
  `pre-disposition candidate. Nothing here is required now, satisfied, or accepted.\n`;

function table(rows: string[][], head: string[]): string {
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [line(head), line(head.map(() => "---")), ...rows.map(line)].join("\n");
}

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function candidates(records: HistoricalRequirementRecord[], boundary: string): string {
  return [
    HEADER("WP-007 historical requirement candidates"),
    "",
    "## Extraction boundary",
    "",
    boundary,
    "",
    "## Candidates",
    "",
    ...records.flatMap((r) => [
      `### ${r.requirement_id} — ${esc(r.normalized_summary)}`,
      "",
      `- Source: \`${esc(r.source_id)}\` at \`${esc(r.source_locator)}\``,
      `- Inherited authority: ${r.inherited_authority} (${esc(r.inheritance_note)})`,
      `- Family: ${r.requirement_family} · Modality as worded: ${r.modality}`,
      `- Disposition: ${r.disposition} · Conformance: ${r.conformance_state}`,
      "",
      "Original wording, verbatim:",
      "",
      `> ${r.original_wording}`,
      "",
      `Normalized summary (executor restatement, not source text): ${esc(r.normalized_summary)}`,
      "",
      `Boundary: ${esc(r.boundary)}`,
      "",
    ]),
  ].join("\n");
}

function familyIndex(records: HistoricalRequirementRecord[]): string {
  return [
    HEADER("WP-007 requirement family index"),
    "",
    table(
      records.map((r) => [
        r.requirement_id,
        r.requirement_family,
        r.modality,
        r.inherited_authority,
        `\`${esc(r.source_locator)}\``,
      ]),
      ["ID", "Family", "Modality as worded", "Inherited authority", "Locator"],
    ),
    "",
    "Modality records how the source words the statement. It is not an instruction to act.",
    "",
  ].join("\n");
}

function confidenceRegister(records: HistoricalRequirementRecord[]): string {
  return [
    HEADER("WP-007 extraction confidence and ambiguity"),
    "",
    table(
      records.map((r) => [
        r.requirement_id,
        r.extraction_confidence,
        esc(r.extraction_confidence_reason),
        r.ambiguity,
        esc(r.ambiguity_note),
      ]),
      ["ID", "Confidence", "Confidence basis", "Ambiguity", "Ambiguity note"],
    ),
    "",
    "Confidence describes how certain the extraction is that the wording was captured and read",
    "correctly. It says nothing about whether the statement is correct, current, or met.",
    "",
  ].join("\n");
}

function selection(rationale: string, records: HistoricalRequirementRecord[]): string {
  const sourceIds = [...new Set(records.map((r) => r.source_id))];
  return [
    HEADER("WP-007 cycle 2 source selection"),
    "",
    `Sources extracted this cycle: ${sourceIds.join(", ")} (exactly ${sourceIds.length}).`,
    "",
    rationale,
    "",
    "## Refused in this cycle",
    "",
    "- multi-source extraction;",
    "- opening, importing, or summarising unreachable Drive or prior-repository material;",
    "- assigning REQUIRED-NOW, REMEDIATION, TARGET-STATE, UNNECESSARY or SUPERSEDED;",
    "- asserting conformance, implementation, testing, release, or claimability;",
    "- resolving WP-008 authority conflicts, closing WP-007, or advancing Gate A.",
    "",
  ].join("\n");
}

function main() {
  const file = loadHistoricalRequirementFile();
  const records = file.records;
  mkdirSync(OUT_DIR, { recursive: true });

  const outputs: [string, string][] = [
    ["REQUIREMENT_CANDIDATES.md", candidates(records, file.extraction_boundary)],
    ["REQUIREMENT_FAMILY_INDEX.md", familyIndex(records)],
    ["EXTRACTION_CONFIDENCE.md", confidenceRegister(records)],
    ["CYCLE2_SOURCE_SELECTION.md", selection(file.source_selection_rationale, records)],
  ];

  for (const [name, body] of outputs) {
    writeFileSync(join(OUT_DIR, name), body, "utf8");
  }
  console.log(
    `WP-007: projected ${records.length} requirement candidates into ${outputs.length} documents.`,
  );
}

main();
