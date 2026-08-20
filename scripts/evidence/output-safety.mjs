#!/usr/bin/env node
/**
 * Post-generation evidence output-safety guard.
 *
 * The input-fingerprint model deliberately excludes generated evidence
 * artefacts from every declared input set, because including them makes
 * evidence invalidate itself the moment it is written (FND-011 / FND-013).
 * That exclusion is about applicability, not about leakage: generated,
 * committed, and uploaded evidence still has to be checked for credential-
 * shaped and personal-data-shaped content.
 *
 * This guard runs AFTER generation, over the generated tree only. It is not
 * part of any input set, so it cannot cause recursive self-invalidation. Its
 * own result is written outside the scanned tree (default
 * `reports/evidence-output-safety.json`), or excluded when written inside.
 *
 * Fail-closed: a prohibited match, an unreadable tree, or an empty tree all
 * exit non-zero.
 *
 * Limitation, stated on every run: pattern scanning does not prove the
 * absence of every secret or item of personal data. A clean result means no
 * match by these patterns over this scope.
 *
 * Usage:
 *   node scripts/evidence/output-safety.mjs [--dir=evidence] [--out=reports/evidence-output-safety.json]
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { PII_PATTERNS, SECRET_PATTERNS } from "./boundary.mjs";
import { nowIso, sha256 } from "./util.mjs";

const MAX_BYTES = 8 * 1024 * 1024;
const SKIP_SUFFIXES = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip", ".lockb"];

/**
 * The boundary scanner's own output enumerates the pattern definitions it
 * searches for, so it matches itself by construction. It records matches only
 * as redacted digests and never the matched value, so it carries no material
 * to leak. It is declared out of scope here and named in the result.
 */
export const SELF_REFERENTIAL_OUTPUTS = ["artifacts/boundary/"];

function isSelfReferential(file, dir) {
  const rel = relative(resolve(dir), resolve(file));
  return SELF_REFERENTIAL_OUTPUTS.some((prefix) => rel.startsWith(prefix));
}

export const OUTPUT_SAFETY_LIMITATIONS = [
  "Pattern matching only. Material in an unrecognised format is not detected.",
  "A clean result means no match by these patterns over the scanned generated tree.",
  "It does not prove the absence of every secret or every item of personal data.",
];

/** Recursively list files under a directory, excluding the guard's own result. */
export function listOutputFiles(dir, { exclude = [], includeSelfReferential = true } = {}) {
  const root = resolve(dir);
  const excluded = exclude.map((path) => resolve(path));
  const files = [];

  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (excluded.includes(resolve(full))) continue;
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.push(full);
    }
  };

  walk(root);
  return files
    .filter((file) => includeSelfReferential || !isSelfReferential(file, dir))
    .map((file) => relative(process.cwd(), file))
    .sort();
}

/** Scan a list of files for the given patterns. Matched values are never recorded. */
export function scanOutputs(files, patterns) {
  const matches = [];
  let scanned = 0;

  for (const file of files) {
    if (SKIP_SUFFIXES.some((suffix) => file.endsWith(suffix))) continue;
    let size;
    try {
      size = statSync(file).size;
    } catch {
      throw new Error(`Output-safety guard cannot stat ${file}`);
    }
    if (size > MAX_BYTES) continue;

    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      throw new Error(`Output-safety guard cannot read ${file}`);
    }

    scanned += 1;
    const lines = content.split("\n");
    for (const { id, label, pattern, allow } of patterns) {
      lines.forEach((line, index) => {
        pattern.lastIndex = 0;
        const found = line.match(pattern);
        if (!found) return;
        for (const value of found) {
          if (allow && allow.test(value)) continue;
          matches.push({
            file,
            line: index + 1,
            pattern_id: id,
            pattern_label: label,
            redacted_digest: sha256(value).slice(0, 16),
            disposition: "PROHIBITED IN GENERATED OUTPUT - BLOCKING",
          });
        }
      });
    }
  }

  return { scanned, matches };
}

/** Run the guard over a generated evidence tree and build its result document. */
export function runOutputSafety({ dir = "evidence", out = null } = {}) {
  const excluded = out ? [out] : [];
  const files = listOutputFiles(dir, { exclude: excluded, includeSelfReferential: false });

  if (files.length === 0) {
    return {
      ok: false,
      result: {
        schema_version: "1.0.0",
        generated_at: nowIso(),
        scanned_tree: dir,
        status: "fail",
        reason: "The generated evidence tree is empty or unreadable. Failing closed.",
        files_scanned: 0,
        secret_matches: [],
        pii_matches: [],
        limitations: OUTPUT_SAFETY_LIMITATIONS,
      },
    };
  }

  const secret = scanOutputs(files, SECRET_PATTERNS);
  const pii = scanOutputs(files, PII_PATTERNS);
  const ok = secret.matches.length === 0 && pii.matches.length === 0;

  return {
    ok,
    result: {
      schema_version: "1.0.0",
      generated_at: nowIso(),
      scanned_tree: dir,
      result_path_excluded_from_scan: out,
      self_referential_paths_excluded: SELF_REFERENTIAL_OUTPUTS,
      status: ok ? "pass" : "fail",
      files_discovered: files.length,
      files_scanned: secret.scanned,
      secret_patterns: SECRET_PATTERNS.map((p) => ({ id: p.id, label: p.label })),
      pii_patterns: PII_PATTERNS.map((p) => ({ id: p.id, label: p.label })),
      secret_matches: secret.matches,
      pii_matches: pii.matches,
      recursion_note:
        "This guard runs after generation and is not part of any declared evidence input set, " +
        "so it cannot invalidate the evidence it checks.",
      limitations: OUTPUT_SAFETY_LIMITATIONS,
    },
  };
}

function arg(name, fallback) {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function main() {
  const dir = arg("dir", process.env.SSLS_EVIDENCE_DIR || "evidence");
  const out = arg("out", "reports/evidence-output-safety.json");

  let outcome;
  try {
    outcome = runOutputSafety({ dir, out });
  } catch (error) {
    console.error(`EVIDENCE OUTPUT SAFETY: FAILED CLOSED — ${error.message}`);
    process.exit(1);
    return;
  }

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(outcome.result, null, 2)}\n`);

  console.log(`Evidence output-safety guard — scanned tree ${dir}`);
  console.log(`  files scanned: ${outcome.result.files_scanned ?? 0}`);
  console.log(`  secret matches: ${outcome.result.secret_matches.length}`);
  console.log(`  personal-data matches: ${outcome.result.pii_matches.length}`);
  console.log(`  result written to ${out} (excluded from the scanned tree)`);
  for (const limitation of OUTPUT_SAFETY_LIMITATIONS) console.log(`  note: ${limitation}`);

  if (!outcome.ok) {
    console.error("\nEVIDENCE OUTPUT SAFETY: FAILED CLOSED");
    if (outcome.result.reason) console.error(`  - ${outcome.result.reason}`);
    for (const match of [...outcome.result.secret_matches, ...outcome.result.pii_matches]) {
      console.error(`  - ${match.file}:${match.line} ${match.pattern_label} (${match.pattern_id})`);
    }
    process.exit(1);
  }

  console.log("\nEVIDENCE OUTPUT SAFETY: PASS (no match by these patterns).");
}

if (import.meta.url === `file://${process.argv[1]}`) main();
