#!/usr/bin/env node
/**
 * SSLS Evidence & Verification Pipeline — verification gate.
 *
 * This is the replacement for declared-SHA comparison. It answers four
 * questions against the committed evidence set:
 *
 *   1. Does every record validate against the schema?
 *   2. Is every required evidence type present?
 *   3. Is every cited record applicable to the current input sets?
 *   4. Has the baseline been re-derived for those input sets?
 *
 * It never repairs, rebinds, or reinterprets. It reports, and exits non-zero
 * when the evidence set cannot support the baseline.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { evaluateApplicability } from "./applicability.mjs";
import { computeInputSets } from "./inputs.mjs";
import { validateEvidenceRecord } from "./schema.mjs";
import { resolveCommit, stableHash, trackedFiles } from "./util.mjs";

const OUTPUT_DIR = "evidence";
const RECORDS_DIR = join(OUTPUT_DIR, "records");

const REQUIRED_TYPES = [
  "BUILD",
  "TEST",
  "SOURCE_PROVENANCE",
  "DEPENDENCY_INVENTORY",
  "SBOM",
  "SECRET_SCAN",
  "PII_BOUNDARY_SCAN",
  "ROUTE_INVENTORY",
  "CONFIGURATION",
];

function loadRecords() {
  if (!existsSync(RECORDS_DIR)) return [];
  return readdirSync(RECORDS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(join(RECORDS_DIR, file), "utf8")));
}

export function verifyEvidenceSet({ records, baseline, inputSets, commit, environment }) {
  const problems = [];
  const notes = [];

  if (records.length === 0) {
    problems.push("No evidence records found. Run `bun run evidence:run`.");
    return { ok: false, problems, notes, applicability: [] };
  }

  for (const record of records) {
    const { valid, errors } = validateEvidenceRecord(record);
    if (!valid) {
      for (const error of errors) {
        problems.push(
          `${record.evidence_id}: schema violation on ${error.field} — ${error.message}`,
        );
      }
    }
  }

  const present = new Set(records.map((record) => record.evidence_type));
  for (const type of REQUIRED_TYPES) {
    if (!present.has(type)) problems.push(`Required evidence type is missing: ${type}.`);
  }

  const applicability = records.map((record) => ({
    evidence_id: record.evidence_id,
    evidence_type: record.evidence_type,
    status: record.status,
    ...evaluateApplicability(record, { inputSets, environment, commit }),
  }));

  for (const entry of applicability) {
    if (entry.state === "STALE" || entry.state === "EXPIRED") {
      problems.push(`${entry.evidence_id}: ${entry.state} — ${entry.reason}`);
    } else if (entry.state === "UNKNOWN" || entry.state === "INAPPLICABLE") {
      notes.push(`${entry.evidence_id}: ${entry.state} — ${entry.reason}`);
    }
  }

  for (const record of records) {
    if (record.status === "fail") problems.push(`${record.evidence_id}: recorded result is fail.`);
    if (record.status === "review-required")
      notes.push(`${record.evidence_id}: review required — ${record.actual_result}`);
    if (record.status === "not-completed")
      notes.push(`${record.evidence_id}: not completed — ${record.actual_result}`);
  }

  if (!baseline) {
    problems.push("No baseline manifest found. The baseline must be re-derived, not rebound.");
  } else {
    const expected = stableHash(inputSets);
    if (baseline.input_set_digest !== expected) {
      problems.push(
        "Baseline is STALE: it was not re-derived for the current input sets. Run `bun run evidence:run`.",
      );
    }
    if (baseline.commit_sha !== commit) {
      notes.push(
        `Baseline was generated at ${baseline.commit_sha}; the commit under verification is ${commit}. ` +
          "This is not a failure by itself — applicability is decided by input sets, not by commit strings.",
      );
    }
  }

  return { ok: problems.length === 0, problems, notes, applicability };
}

function main() {
  const commit = resolveCommit();
  const inputSets = computeInputSets(trackedFiles());
  const baselinePath = join(OUTPUT_DIR, "baseline.json");
  const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : null;

  const result = verifyEvidenceSet({
    records: loadRecords(),
    baseline,
    inputSets,
    commit,
    environment: process.env.GITHUB_ACTIONS ? "ci" : "lovable-sandbox",
  });

  console.log(`SSLS evidence verification — commit ${commit}`);
  for (const entry of result.applicability) {
    console.log(`  ${entry.state.padEnd(12)} ${entry.evidence_id} (${entry.evidence_type})`);
  }

  if (result.notes.length > 0) {
    console.log("\nNotes (recorded, not blocking):");
    for (const note of result.notes) console.log(`  - ${note}`);
  }

  if (!result.ok) {
    console.error("\nVERIFICATION FAILED");
    for (const problem of result.problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log("\nVERIFICATION PASSED — evidence set is applicable to the current input sets.");
  console.log("This is not certification, conformance, or release readiness.");
}

if (import.meta.url === `file://${process.argv[1]}`) main();
