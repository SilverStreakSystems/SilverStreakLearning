#!/usr/bin/env node
/**
 * CI guard: block a merge when the declared SSOT binding commit does not match
 * the repository HEAD under review.
 *
 * Resolution order for the commit under review:
 *   1. --head=<sha> argument
 *   2. SSOT_HEAD_SHA environment variable (CI sets this to the PR head SHA)
 *   3. `git rev-parse HEAD`
 *
 * Exit code 0 = every bound document declares that commit.
 * Exit code 1 = mismatch, missing declaration, or unreadable document.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  BOUND_DOCUMENT_PATHS,
  evaluateBindings,
  extractDeclaredBinding,
  formatReport,
} from "./ssot-binding.mjs";

function resolveHeadSha() {
  const flag = process.argv.find((arg) => arg.startsWith("--head="));
  if (flag) return flag.slice("--head=".length);
  if (process.env.SSOT_HEAD_SHA) return process.env.SSOT_HEAD_SHA;
  return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
}

function main() {
  const headSha = resolveHeadSha();

  const documents = BOUND_DOCUMENT_PATHS.map((path) => {
    try {
      return { path, declared: extractDeclaredBinding(readFileSync(resolve(path), "utf8")) };
    } catch {
      return { path, declared: null };
    }
  });

  const evaluation = evaluateBindings(headSha, documents);
  process.stdout.write(`${formatReport(evaluation)}\n`);

  if (!evaluation.ok) {
    process.stdout.write(
      [
        "",
        "How to clear this check:",
        "  1. Re-execute build and test evidence at the commit under review.",
        "  2. Update the binding commit and the captured figures in each listed document.",
        "  3. Record the previous binding as superseded in the governance registers.",
        "",
        "This guard checks binding freshness only. It does not approve, validate, or",
        "release anything, and it does not confer authority on the record.",
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
}

main();
