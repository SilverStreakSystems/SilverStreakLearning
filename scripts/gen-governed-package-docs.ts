/**
 * Governed-package documentation projection.
 *
 * The canonical data lives in `data/packages/governed-packages.json`.
 * These documents are generated from it and must never be hand-edited.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { GovernedPackageRecord } from "../src/domain/governed-package";
import { loadGovernedPackageFile } from "../src/lib/governed-package-registry";

const OUT_DIR = join(process.cwd(), "docs", "packages");

const HEADER = (title: string) =>
  `# ${title}\n\n> Generated from \`data/packages/governed-packages.json\` by ` +
  `\`scripts/gen-governed-package-docs.ts\`. Do not edit by hand.\n> A package summarizes governed ` +
  `state. It is not a register, it carries no authority, and it closes nothing.\n`;

function table(rows: string[][], head: string[]): string {
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [line(head), line(head.map(() => "---")), ...rows.map(line)].join("\n");
}

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function packageRegister(records: GovernedPackageRecord[], boundary: string): string {
  const sections = records.map((record) =>
    [
      `## ${record.package_id} — ${esc(record.title)} (${record.authority_role})`,
      "",
      table(
        [
          ["Version", record.version],
          ["State date", record.state_date],
          ["Authority role", record.authority_role],
          ["Canonical status", record.canonical_status],
          ["Predecessor", record.predecessor_package ?? "—"],
          ["Personal data", record.personal_data_state],
          ["Release", record.release_state],
          ["Evidence", record.evidence_references.join(", ") || "—"],
        ].map(([k, v]) => [k as string, esc(v as string)]),
        ["Field", "Value"],
      ),
      "",
      `**Relationship to the canonical registers.** ${esc(record.register_relationship)}`,
      "",
      "### Artifacts",
      "",
      table(
        record.artifacts.map((artifact) => [
          artifact.artifact_id,
          `\`${esc(artifact.filename)}\``,
          artifact.media_type,
          artifact.byte_size === null ? "—" : `${artifact.byte_size}`,
          artifact.retention_state,
          artifact.integrity_state,
        ]),
        ["ID", "Filename", "Media type", "Bytes", "Retention", "Integrity"],
      ),
      "",
    ].join("\n"),
  );

  return [HEADER("Governed reference package register"), "", "## Boundary", "", boundary, "", ...sections].join(
    "\n",
  );
}

function integrityManifest(records: GovernedPackageRecord[]): string {
  const rows = records.flatMap((record) =>
    record.artifacts.map((artifact) => [
      record.package_id,
      `\`${esc(artifact.filename)}\``,
      artifact.declared_sha256 ? `\`${artifact.declared_sha256}\`` : "not declared",
      artifact.sha256 ? `\`${artifact.sha256}\`` : "not measured",
      artifact.integrity_state,
    ]),
  );

  return [
    HEADER("Package integrity verification"),
    "",
    "Digests were recomputed by this program against the supplied files and compared with the",
    "digests printed in the supplied manifest. A verified match is a file-identity check only.",
    "It is not independent validation and says nothing about the accuracy of package contents.",
    "",
    table(rows, ["Package", "Filename", "Declared SHA-256", "Measured SHA-256", "State"]),
    "",
    "The v0.3.0 manifest declares no digest for itself, because hashing a file that contains its own",
    "digest is circular. Its measured digest above is a measurement by this program, not a manifest claim.",
    "",
  ].join("\n");
}

function completenessBoundary(records: GovernedPackageRecord[]): string {
  return [
    HEADER("Package completeness boundary"),
    "",
    ...records.flatMap((record) => [
      `## ${record.package_id} — v${record.version} (${record.authority_role})`,
      "",
      esc(record.completeness_boundary),
      "",
      "### Per-artifact limitations",
      "",
      ...record.artifacts.flatMap((artifact) => [
        `**${artifact.artifact_id} — \`${esc(artifact.filename)}\`**`,
        "",
        ...artifact.limitations.map((limitation) => `- ${esc(limitation)}`),
        "",
      ]),
    ]),
  ].join("\n");
}

function nonClaimBoundary(records: GovernedPackageRecord[]): string {
  return [
    HEADER("Package non-claim boundary"),
    "",
    "Inclusion in a package, file recency, a successful digest match, and a passing test are all",
    "independent of authority. None of them promotes a record, closes a finding, closes a work",
    "package, changes a gate, or authorizes a successor package.",
    "",
    ...records.flatMap((record) => [
      `## ${record.package_id} — v${record.version} (${record.authority_role})`,
      "",
      ...record.non_claims.map((claim) => `- ${esc(claim)}`),
      "",
    ]),
  ].join("\n");
}

function main(): void {
  const file = loadGovernedPackageFile();
  mkdirSync(OUT_DIR, { recursive: true });

  const outputs: Array<[string, string]> = [
    ["PACKAGE_REGISTER.md", packageRegister(file.records, file.package_boundary)],
    ["INTEGRITY_MANIFEST.md", integrityManifest(file.records)],
    ["COMPLETENESS_BOUNDARY.md", completenessBoundary(file.records)],
    ["NON_CLAIM_BOUNDARY.md", nonClaimBoundary(file.records)],
  ];

  for (const [name, content] of outputs) {
    writeFileSync(join(OUT_DIR, name), content.endsWith("\n") ? content : `${content}\n`);
    console.log(`wrote docs/packages/${name}`);
  }
}

main();
