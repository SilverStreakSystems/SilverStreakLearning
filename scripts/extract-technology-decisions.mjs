#!/usr/bin/env node
/**
 * One-time extraction of the owner-supplied Role Technology Decision Matrix
 * into the canonical register at `data/technology-decisions/`.
 *
 * The workbook is an owner-supplied external input. It is NOT retained in this
 * repository, so this script cannot run in ordinary verification: it is kept so
 * the extraction is reproducible whenever the owner re-supplies the file.
 *
 *   node scripts/extract-technology-decisions.mjs <path-to-workbook.xlsx> [--write]
 *
 * Without --write the script only reports what it computed. The register it
 * writes carries the eighteen source fields verbatim plus provenance and
 * digests. It carries NO derived judgement: every derived classification is
 * computed at read time by src/domain/technology-decisions/, so the register
 * can never disagree with the evaluator.
 */
import { createHash } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/* ------------------------------------------------------------------ zip --- */

/** Minimal stored/deflated zip reader — enough for an xlsx produced by any writer. */
function readZip(buffer) {
  const entries = new Map();
  const eocd = (() => {
    for (let i = buffer.length - 22; i >= 0; i -= 1) {
      if (buffer.readUInt32LE(i) === 0x06054b50) return i;
    }
    throw new Error("Not a zip file: end-of-central-directory record not found.");
  })();
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);

  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("Corrupt central directory.");
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);
    entries.set(name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw));

    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

/* ------------------------------------------------------------------ xml --- */

function decodeEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, "&");
}

/** All <t> text inside a fragment, concatenated in document order. */
function textOf(fragment) {
  return [...fragment.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>|<t\s*\/>/g)]
    .map((match) => decodeEntities(match[1] ?? ""))
    .join("");
}

function sharedStrings(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => textOf(match[1]));
}

function columnOf(reference) {
  return reference.replace(/[0-9]/g, "");
}

/** Rows of a worksheet as { column -> string } maps, in sheet order. */
function sheetRows(xml, strings) {
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>|<row[^>]*\/>/g)].map((rowMatch) => {
    const body = rowMatch[1] ?? "";
    const cells = {};
    for (const cell of body.matchAll(/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attributes = cell[1];
      const inner = cell[2] ?? "";
      const reference = /r="([^"]+)"/.exec(attributes)?.[1];
      if (!reference) continue;
      const type = /t="([^"]+)"/.exec(attributes)?.[1];
      const rawValue = /<v>([\s\S]*?)<\/v>/.exec(inner)?.[1];
      let value = "";
      if (type === "s" && rawValue !== undefined) value = strings[Number(rawValue)] ?? "";
      else if (type === "inlineStr") value = textOf(inner);
      else if (rawValue !== undefined) value = decodeEntities(rawValue);
      cells[columnOf(reference)] = value.trim();
    }
    return cells;
  });
}

/* -------------------------------------------------------------- extract --- */

const FIELD_COLUMNS = [
  ["A", "role"],
  ["B", "responsibilities"],
  ["C", "workflow"],
  ["D", "inputs"],
  ["E", "outputs"],
  ["F", "system_of_record"],
  ["G", "rules_based_option"],
  ["H", "google_workspace_option"],
  ["I", "automation_option"],
  ["J", "ssls_application_need"],
  ["K", "ai_contribution"],
  ["L", "ai_necessity"],
  ["M", "human_approval"],
  ["N", "permissions"],
  ["O", "risk_level"],
  ["P", "audit_evidence"],
  ["Q", "recommended_solution"],
  ["R", "future_maturity_provisional"],
];

const EXPECTED = {
  worksheets: 20,
  groups: 18,
  workflows: 279,
  fields: 18,
  rolesCountedInGroups: 212,
  rolesGloballyDistinct: 211,
  aiNecessity: { Required: 0, Helpful: 38, Optional: 94, Unnecessary: 115, Prohibited: 32 },
  riskLevel: { High: 102, Moderate: 138, Low: 39 },
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function main() {
  const [sourcePath, ...flags] = process.argv.slice(2);
  if (!sourcePath) {
    console.error("Usage: node scripts/extract-technology-decisions.mjs <workbook.xlsx> [--write]");
    process.exit(2);
  }
  const write = flags.includes("--write");
  const bytes = readFileSync(sourcePath);
  const zip = readZip(bytes);
  const read = (name) => zip.get(name)?.toString("utf8") ?? "";

  const strings = sharedStrings(read("xl/sharedStrings.xml"));
  const relationships = new Map(
    [...read("xl/_rels/workbook.xml.rels").matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)].map(
      (match) => [match[1], match[2].replace(/^\/?xl\//, "")],
    ),
  );
  const worksheets = [
    ...read("xl/workbook.xml").matchAll(/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"[^>]*\/>/g),
  ].map((match) => ({
    name: decodeEntities(match[1]),
    part: `xl/${relationships.get(match[2])}`,
  }));

  const groupSheets = worksheets.filter(
    (sheet) => sheet.name !== "Summary" && sheet.name !== "Decision Process",
  );

  const workflows = [];
  const worksheetRecords = [];
  const rolesGlobal = new Set();
  let rolesCountedInGroups = 0;

  for (const sheet of groupSheets) {
    const xml = read(sheet.part);
    const rows = sheetRows(xml, strings);
    const header = FIELD_COLUMNS.map(([column]) => rows[0]?.[column] ?? "");
    const body = rows.slice(1);
    const groupId = sheet.name.slice(0, 1);
    const groupName = sheet.name.slice(2);
    const rolesInGroup = new Set();

    body.forEach((row, index) => {
      const source = {};
      for (const [column, field] of FIELD_COLUMNS) source[field] = row[column] ?? "";
      rolesInGroup.add(source.role);
      rolesGlobal.add(source.role);
      const digest = sha256(FIELD_COLUMNS.map(([, field]) => source[field]).join("\u001f"));
      workflows.push({
        workflow_id: `TDW-${groupId}-${String(index + 1).padStart(3, "0")}`,
        role_group_id: groupId,
        role_group_name: groupName,
        source_artifact_id: "TDS-001",
        source_worksheet: sheet.name,
        source_row: index + 2,
        source_row_sha256: digest,
        source: source,
      });
    });

    rolesCountedInGroups += rolesInGroup.size;
    worksheetRecords.push({
      worksheet: sheet.name,
      role_group_id: groupId,
      role_group_name: groupName,
      header_fields: header,
      workflow_rows: body.length,
      roles_counted_in_group: rolesInGroup.size,
      worksheet_sha256: sha256(zip.get(sheet.part)),
    });
  }

  const tally = (field) =>
    workflows.reduce((counts, record) => {
      const key = record.source[field] || "(blank)";
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});

  const observed = {
    worksheets: worksheets.length,
    groups: groupSheets.length,
    workflows: workflows.length,
    fields: FIELD_COLUMNS.length,
    rolesCountedInGroups,
    rolesGloballyDistinct: rolesGlobal.size,
    aiNecessity: { Required: 0, ...tally("ai_necessity") },
    riskLevel: tally("risk_level"),
  };

  const disagreements = [];
  const compare = (label, expectedValue, observedValue) => {
    if (JSON.stringify(expectedValue) !== JSON.stringify(observedValue)) {
      disagreements.push(`${label}: expected ${JSON.stringify(expectedValue)}, observed ${JSON.stringify(observedValue)}`);
    }
  };
  for (const key of Object.keys(EXPECTED)) compare(key, EXPECTED[key], observed[key]);

  console.log(JSON.stringify({ observed, disagreements }, null, 2));

  if (disagreements.length > 0) {
    console.error("\nRECONCILIATION FAILED — refusing to normalize a source that disagrees.");
    process.exit(1);
  }
  if (!write) {
    console.log("\nReconciled. Re-run with --write to update the register.");
    return;
  }

  const outDir = join(process.cwd(), "data", "technology-decisions");
  mkdirSync(outDir, { recursive: true });

  const register = {
    schema_version: "1.0.0",
    register_id: "RTDA-007",
    source_artifact_id: "TDS-001",
    field_order: FIELD_COLUMNS.map(([, field]) => field),
    authority_note:
      "Future-state workflow analysis normalized from an owner-supplied source. Every field under `source` is verbatim source text and is never edited here. This register confers no authority: it activates no role, authorizes no implementation, and is not a record of any real person, school, or district.",
    totals: observed,
    worksheets: worksheetRecords,
    records: workflows,
  };
  writeFileSync(join(outDir, "workflow-decisions.json"), `${JSON.stringify(register, null, 2)}\n`);

  const sourceIdentity = {
    filename: sourcePath.split("/").pop(),
    byte_size: bytes.length,
    sha256: sha256(bytes),
  };
  console.log("\nWrote data/technology-decisions/workflow-decisions.json");
  console.log(JSON.stringify(sourceIdentity, null, 2));
}

main();
