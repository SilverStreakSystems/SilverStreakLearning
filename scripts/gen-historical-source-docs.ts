/**
 * WP-007 documentation projection.
 *
 * The canonical data lives in `data/historical/historical-sources.json`.
 * These documents are generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { HistoricalSourceRecord } from "../src/domain/historical-source";
import { loadHistoricalSourceFile } from "../src/lib/historical-source-registry";

const OUT_DIR = join(process.cwd(), "docs", "wp-007");

const HEADER = (title: string) =>
  `# ${title}\n\n> Generated from \`data/historical/historical-sources.json\` by ` +
  `\`scripts/gen-historical-source-docs.ts\`. Do not edit by hand.\n> No source is promoted into ` +
  `current authority by appearing here.\n`;

function table(rows: string[][], head: string[]): string {
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [line(head), line(head.map(() => "---")), ...rows.map(line)].join("\n");
}

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function sourceUniverse(records: HistoricalSourceRecord[], boundary: string): string {
  return [
    HEADER("WP-007 source universe"),
    "",
    "## Boundary",
    "",
    boundary,
    "",
    "## Inventory",
    "",
    table(
      records.map((r) => [r.source_id, esc(r.title), r.source_family, `\`${esc(r.exact_locator)}\``]),
      ["ID", "Source", "Family", "Exact locator"],
    ),
    "",
  ].join("\n");
}

function classificationRegister(records: HistoricalSourceRecord[]): string {
  return [
    HEADER("WP-007 authority classification register"),
    "",
    table(
      records.map((r) => [
        r.source_id,
        r.authority_classification,
        r.promotion_state,
        esc(r.classification_basis),
        r.classification_evidence.join(", ") || "—",
      ]),
      ["ID", "Classification", "Promotion", "Basis", "Supporting records"],
    ),
    "",
    "Classification records how much authority a source carries now. Age, volume, and effort never",
    "upgrade it; only a recorded owner decision can.",
    "",
  ].join("\n");
}

function accessLimitations(records: HistoricalSourceRecord[]): string {
  return [
    HEADER("WP-007 access limitations"),
    "",
    table(
      records.map((r) => [
        r.source_id,
        r.access_limitation,
        r.immutability,
        r.pii_status,
        esc(r.access_note),
      ]),
      ["ID", "Access", "Immutability", "Personal data", "Note"],
    ),
    "",
    "Sources recorded `NOT-ACCESSIBLE-TO-EXECUTOR` carry no version, no hash, and no content claim.",
    "",
  ].join("\n");
}

function provenanceIndex(records: HistoricalSourceRecord[]): string {
  return [
    HEADER("WP-007 provenance index"),
    "",
    table(
      records.map((r) => [
        r.source_id,
        `\`${esc(r.version_or_hash)}\``,
        r.recovery_relevance,
        esc(r.recovery_relevance_reason),
        r.inventoried_on,
      ]),
      ["ID", "Version or hash", "Recovery relevance", "Reason", "Inventoried"],
    ),
    "",
  ].join("\n");
}

function refusedClaims(records: HistoricalSourceRecord[]): string {
  const refused = records.filter((r) => r.authority_classification === "REFUSED");
  return [
    HEADER("WP-007 refused claims"),
    "",
    "This register refuses, explicitly:",
    "",
    "- that any inventoried source has been read, verified, or reproduced;",
    "- that any historical source carries current authority by virtue of being recorded;",
    "- that the universe is complete beyond the declared boundary;",
    "- that unreachable sources contain, or do not contain, anything in particular;",
    "- that WP-039 exists, is authorized, or follows from WP-038;",
    "- that any gate, work package, or finding is closed by this cycle.",
    "",
    "## Sources refused as recovery inputs",
    "",
    refused.length === 0
      ? "None recorded."
      : table(
          refused.map((r) => [r.source_id, esc(r.title), esc(r.classification_basis)]),
          ["ID", "Source", "Basis for refusal"],
        ),
    "",
  ].join("\n");
}

function main() {
  const file = loadHistoricalSourceFile();
  const records = file.records;
  mkdirSync(OUT_DIR, { recursive: true });

  const outputs: [string, string][] = [
    ["SOURCE_UNIVERSE.md", sourceUniverse(records, file.universe_boundary)],
    ["CLASSIFICATION_REGISTER.md", classificationRegister(records)],
    ["ACCESS_LIMITATIONS.md", accessLimitations(records)],
    ["PROVENANCE_INDEX.md", provenanceIndex(records)],
    ["REFUSED_CLAIMS.md", refusedClaims(records)],
  ];

  for (const [name, body] of outputs) {
    writeFileSync(join(OUT_DIR, name), body, "utf8");
  }
  console.log(`WP-007: projected ${records.length} sources into ${outputs.length} documents.`);
}

main();
