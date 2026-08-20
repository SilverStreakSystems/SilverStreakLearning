#!/usr/bin/env node
/**
 * Deterministic generated-artefact check.
 *
 * Runs every governed generator and then asserts that the working tree is
 * unchanged. A non-empty diff means a committed generated artefact is not the
 * deterministic projection of its controlling source, which is exactly the
 * drift this repository refuses to carry.
 *
 * Usage:
 *   node scripts/check-generated.mjs          run generators, fail on any diff
 *   node scripts/check-generated.mjs --write  run generators and keep the result
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";

const GENERATOR_DIR = "scripts";

/** Every governed generator, discovered by convention rather than by hand-kept list. */
export function generatorScripts(entries = readdirSync(GENERATOR_DIR)) {
  return entries
    .filter((entry) => entry.startsWith("gen-") && entry.endsWith(".ts"))
    .map((entry) => `${GENERATOR_DIR}/${entry}`)
    .sort();
}

/**
 * Content digest of every tracked file, so drift is attributed to the
 * generators rather than to whatever was already dirty in the working tree.
 */
function worktreeState() {
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  const state = new Map();
  for (const file of files) {
    try {
      state.set(file, createHash("sha256").update(readFileSync(file)).digest("hex"));
    } catch {
      state.set(file, "missing");
    }
  }
  return state;
}

function main() {
  const write = process.argv.includes("--write");
  const scripts = generatorScripts();

  if (scripts.length === 0) {
    console.error("No governed generators found. Refusing to report a vacuous pass.");
    process.exit(1);
  }

  const before = write ? new Map() : worktreeState();

  console.log(`Running ${scripts.length} governed generators`);

  for (const script of scripts) {
    process.stdout.write(`  ${script} ... `);
    const result = spawnSync("bun", [script], { encoding: "utf8" });
    if (result.status !== 0) {
      console.log("FAILED");
      console.error(result.stdout ?? "");
      console.error(result.stderr ?? "");
      process.exit(1);
    }
    console.log("ok");
  }

  if (write) {
    console.log("\nGenerators run in --write mode. Diff not checked.");
    return;
  }

  const after = worktreeState();
  const changed = [...after.keys()]
    .filter((path) => before.get(path) !== after.get(path))
    .sort();

  if (changed.length > 0) {
    console.error("\nGENERATED-ARTEFACT CHECK FAILED — regeneration changed these artefacts:");
    for (const path of changed) console.error(`  ${path}`);
    console.error("\nRun `bun run gen:all` and commit the result.");
    process.exit(1);
  }


  console.log("\nGENERATED-ARTEFACT CHECK PASSED — every generated artefact is up to date.");
}

if (import.meta.url === `file://${process.argv[1]}`) main();
