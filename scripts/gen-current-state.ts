/**
 * Canonical current-state projection.
 *
 * `docs/CURRENT_STATE.md` is GENERATED from the controlling registers declared
 * in `data/current-state/current-state-inputs.json`. It is never hand-edited
 * and never binds itself to a commit hash. Freshness is established by
 * regenerating it and comparing the declared input fingerprint.
 *
 * Usage:
 *   bun scripts/gen-current-state.ts          # write the projection
 *   bun scripts/gen-current-state.ts --check  # verify, exit 1 on any problem
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  fingerprintInputs,
  loadInputManifest,
  undeclaredSupersededDocuments,
  unresolvedInputs,
} from "../src/lib/current-state-fingerprint";
import { PROGRAM_STATE } from "../src/fixtures/program";
import { CLAIMS, DECISIONS, EVIDENCE, FINDINGS } from "../src/fixtures/registers";

const ROOT = process.cwd();

function render(fingerprint: string): string {
  const state = PROGRAM_STATE;
  const openFindings = FINDINGS.filter((finding) => finding.resolutionState !== "confirmed");
  const refusedClaims = CLAIMS.filter((claim) => claim.posture === "refused");

  return [
    "# Canonical current state",
    "",
    "> GENERATED from the controlling registers by `scripts/gen-current-state.ts`.",
    "> Do not edit by hand. This document declares no commit hash: its freshness is",
    "> established by regenerating it from the declared inputs and comparing the",
    "> input fingerprint below.",
    "",
    `Controlling decision: ${PROGRAM_STATE.nextDefensibleOwnerAction.source.recordId}. State date: ${state.stateDate}.`,
    `Declared input manifest: \`data/current-state/current-state-inputs.json\`.`,
    `Input fingerprint: \`${fingerprint}\`.`,
    "",
    "Authority class: current summary, executor-run, not independent. This document",
    "records state. It approves nothing, closes nothing, and authorizes nothing.",
    "",
    "## Program state",
    "",
    "| Field | Value | Source |",
    "|---|---|---|",
    `| Gate | ${state.gate.name} — ${state.gate.state.toUpperCase()} | ${state.gate.source.recordId} |`,
    `| Active work package | ${state.activeWorkPackage.workPackageId} — ${state.activeWorkPackage.state.toUpperCase()} | ${state.activeWorkPackage.source.recordId} |`,
    `| Latest checkpoint | ${state.latestCheckpoint.checkpointId} (${state.latestCheckpoint.completedOn}) | ${state.latestCheckpoint.source.locator} |`,
    `| Latest attempt | ${state.latestAttempt ? `${state.latestAttempt.attemptId} — ${state.latestAttempt.state}` : "none"} | ${state.latestAttempt?.source.locator ?? "n/a"} |`,
    `| Owner disposition | ${state.ownerDisposition.state.toUpperCase()} | ${state.ownerDisposition.obligationSource.recordId} |`,
    `| ${state.auditExecution.ruleId} execution | ${state.auditExecution.state} | ${state.auditExecution.source.recordId} |`,
    "",
    `${state.gate.name} is ${state.gate.state === "open" ? "not closed" : "closed"}. ${state.gate.basis}`,
    "",
    state.latestCheckpoint.closedNothing,
    "",
    ...(state.latestAttempt
      ? [
          `### ${state.latestAttempt.attemptId} — ${state.latestAttempt.state}`,
          "",
          state.latestAttempt.statement,
          "",
          state.latestAttempt.producedNoEvidence,
          "",
        ]
      : []),
    "## Registers",
    "",
    "| Register | Rows |",
    "|---|---|",
    `| Decisions | ${DECISIONS.length} |`,
    `| Findings | ${FINDINGS.length} (${openFindings.length} not confirmed resolved) |`,
    `| Evidence | ${EVIDENCE.length} |`,
    `| Claims | ${CLAIMS.length} (${refusedClaims.length} refused) |`,
    "",
    "## Bound verifications",
    "",
    ...state.verifications.flatMap((entry) => [
      `- **${entry.verificationId}**, bound to ${entry.boundTo}. Supports: ${entry.statement}`,
      `  - Does not support: ${entry.scope}`,
    ]),
    "",
    "## Deferred debt",
    "",
    ...state.deferredDebt.map((entry) => `- **${entry.recordId}** — ${entry.statement}`),
    "",
    "## Not authorized",
    "",
    ...state.unauthorizedStages.map((entry) => `- **${entry.stageId}** — ${entry.statement}`),
    "",
    "## Publication boundary",
    "",
    state.publicationBoundary,
    "",
    "## Next defensible owner action",
    "",
    `${state.nextDefensibleOwnerAction.action}`,
    "",
    state.nextDefensibleOwnerAction.why,
    "",
    "## Refused claims",
    "",
    ...refusedClaims.map((claim) => `- ${claim.claim} — ${claim.reason}`),
    "",
  ].join("\n");
}

function main() {
  const check = process.argv.includes("--check");
  const manifest = loadInputManifest(ROOT);
  const problems: string[] = [];

  const missing = unresolvedInputs(manifest, ROOT);
  for (const path of missing) problems.push(`declared controlling input does not resolve: ${path}`);
  if (missing.length > 0) {
    report(problems, check);
    return;
  }

  const fingerprintFile = join(ROOT, manifest.fingerprint_file);
  const outputFile = join(ROOT, manifest.output);

  // The generator is itself a declared input, so hash before writing.
  const result = fingerprintInputs(manifest, ROOT);
  const body = render(result.fingerprint);
  const fingerprintPayload = `${JSON.stringify(
    {
      manifest_id: result.manifestId,
      manifest_version: result.manifestVersion,
      output: manifest.output,
      fingerprint: result.fingerprint,
      inputs: result.inputs,
    },
    null,
    2,
  )}\n`;

  if (check) {
    const currentBody = existsSync(outputFile) ? readFileSync(outputFile, "utf8") : "";
    const currentFingerprint = existsSync(fingerprintFile)
      ? readFileSync(fingerprintFile, "utf8")
      : "";
    if (currentBody !== body)
      problems.push(`${manifest.output} is not the current projection of its declared inputs`);
    if (currentFingerprint !== fingerprintPayload)
      problems.push(`${manifest.fingerprint_file} does not match the declared inputs`);
    for (const path of undeclaredSupersededDocuments(manifest, ROOT))
      problems.push(`superseded document presents itself as current: ${path}`);
    report(problems, true);
    return;
  }

  writeFileSync(outputFile, body, "utf8");
  writeFileSync(fingerprintFile, fingerprintPayload, "utf8");
  process.stdout.write(
    `Wrote ${manifest.output} and ${manifest.fingerprint_file}\nfingerprint ${result.fingerprint}\n`,
  );
}

function report(problems: string[], check: boolean) {
  if (problems.length === 0) {
    process.stdout.write("Current-state projection is current.\nPASS\n");
    return;
  }
  process.stdout.write(
    [
      "Current-state projection check",
      "",
      ...problems.map((entry) => `[PROBLEM] ${entry}`),
      "",
      "FAIL — regenerate with: bun scripts/gen-current-state.ts",
      "",
    ].join("\n"),
  );
  if (check) process.exitCode = 1;
  else process.exitCode = 1;
}

main();
