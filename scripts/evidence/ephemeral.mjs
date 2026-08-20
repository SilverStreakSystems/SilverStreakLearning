#!/usr/bin/env node
/**
 * CI-safe ephemeral evidence pass.
 *
 * `evidence:run` writes artefacts into the committed `evidence/` tree, so it
 * is not part of the read-only aggregate quality command. This wrapper runs
 * the same generation into a temporary output path, verifies the generated
 * set against the current input sets, and runs the post-generation
 * output-safety guard over it. Nothing is written into the committed tree.
 *
 * Exit codes: 0 only when generation, verification, and the guard all pass.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const KEEP = process.argv.includes("--keep");
const outDir = process.env.SSLS_EPHEMERAL_EVIDENCE_DIR ?? mkdtempSync(join(tmpdir(), "ssls-ev-"));
// When the tree is retained for CI upload, the guard result belongs inside the
// retained artefact so the uploaded evidence carries its own safety result. The
// guard excludes that path from its own scan. In local/non-keep mode the whole
// temporary tree, report included, is removed at the end.
const reportPath = KEEP
  ? join(outDir, "reports", "output-safety.json")
  : join(outDir, "..", `ssls-output-safety-${process.pid}.json`);

function run(label, command, args, env = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, SSLS_EVIDENCE_DIR: outDir, ...env },
  });
  if (result.status !== 0) {
    console.error(`\nEPHEMERAL EVIDENCE PASS FAILED at: ${label}`);
    if (!KEEP) rmSync(outDir, { recursive: true, force: true });
    process.exit(result.status ?? 1);
  }
}

console.log(`Ephemeral evidence output path: ${outDir}`);

run("generate evidence (ephemeral)", "node", ["scripts/evidence/run.mjs"]);
run("verify generated evidence", "node", ["scripts/evidence/verify.mjs"]);
run("evidence output-safety guard", "node", [
  "scripts/evidence/output-safety.mjs",
  `--dir=${outDir}`,
  `--out=${reportPath}`,
]);

console.log(
  "\nEPHEMERAL EVIDENCE PASS COMPLETE — generation, verification, and output safety all passed.",
);
console.log("This is not certification, conformance, or release readiness.");

if (KEEP) {
  console.log(`Output-safety result retained at ${reportPath} inside the uploaded tree.`);
} else {
  rmSync(outDir, { recursive: true, force: true });
  rmSync(reportPath, { force: true });
}
