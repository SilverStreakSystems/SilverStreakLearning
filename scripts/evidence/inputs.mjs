/**
 * Declared input sets.
 *
 * Every evidence type declares which repository inputs its result actually
 * depends on. Applicability is then a hash comparison against those inputs,
 * not a comparison of commit strings. A documentation-only commit leaves the
 * build input hash unchanged, so build evidence stays applicable without ever
 * being rebound.
 */
import { existsSync, readFileSync } from "node:fs";

import { hashPathSet, matchTracked, trackedFiles } from "./util.mjs";

const SOURCE_PREFIXES = ["src/"];
const TEST_SUFFIXES = [".test.ts", ".test.tsx"];
const CONFIG_EXACT = [
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  "eslint.config.js",
  "components.json",
  "bunfig.toml",
];
const LOCKFILES = ["bun.lock", "bun.lockb", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"];
const PIPELINE_PREFIXES = ["scripts/evidence/"];
const WORKFLOW_PREFIXES = [".github/workflows/"];
const DOC_PREFIXES = ["docs/", ".lovable/"];

/**
 * Derived outputs.
 *
 * These paths are produced by the pipeline or by the current-state generator.
 * Including them in any input set makes evidence invalidate itself the moment
 * it is written, which is the recursion recorded against FND-011/FND-013.
 * They are excluded from every declared input set, and a test asserts it.
 */
export const DERIVED_OUTPUT_PREFIXES = ["evidence/", "dist/", ".output/"];
export const DERIVED_OUTPUT_EXACT = [
  "docs/CURRENT_STATE.md",
  "data/current-state/current-state.fingerprint.json",
];

/** Whether a tracked path is a generated output rather than a controlling input. */
export function isDerivedOutput(path) {
  return (
    DERIVED_OUTPUT_EXACT.includes(path) ||
    DERIVED_OUTPUT_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

/** Controlling inputs of the canonical current-state projection, read from its manifest. */
export function projectionInputPaths(
  manifestPath = "data/current-state/current-state-inputs.json",
) {
  const paths = [manifestPath];
  if (!existsSync(manifestPath)) return paths;
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const input of manifest.inputs ?? []) paths.push(input);
  } catch {
    return paths;
  }
  return paths.sort();
}

/**
 * Input-set definitions per evidence type.
 *
 * `reusable` marks whether the declared input scope fully determines the
 * result. When it does, the record may be carried forward to a later commit
 * with its inputs unchanged; the commit string is provenance, not the test.
 * A type may only be `false` when its result depends on something outside the
 * declared inputs, and that gap must be named in its comment.
 */
export const INPUT_SET_DEFINITIONS = {
  BUILD: { sets: ["source", "config", "lockfile"], reusable: true },
  TEST: { sets: ["source", "tests", "config", "lockfile"], reusable: true },
  TYPECHECK: { sets: ["source", "tests", "config"], reusable: true },
  LINT: { sets: ["source", "tests", "config"], reusable: true },
  SSOT_BINDING: { sets: ["projection", "pipeline"], reusable: true },
  SOURCE_PROVENANCE: { sets: ["tracked"], reusable: true },
  DEPENDENCY_INVENTORY: { sets: ["manifest", "lockfile"], reusable: true },
  SBOM: { sets: ["manifest", "lockfile"], reusable: true },
  VULNERABILITY_SCAN: { sets: ["manifest", "lockfile"], reusable: true },
  LICENSE_SCAN: { sets: ["manifest", "lockfile"], reusable: true },
  SECRET_SCAN: { sets: ["tracked"], reusable: true },
  PII_BOUNDARY_SCAN: { sets: ["tracked"], reusable: true },
  ROUTE_INVENTORY: { sets: ["routes"], reusable: true },
  BASELINE_MANIFEST: { sets: ["tracked"], reusable: true },
  CONFIGURATION: { sets: ["config", "workflows"], reusable: true },
  ACCESSIBILITY_AUTOMATED: { sets: ["source", "tests"], reusable: true },
  CUSTOM_VALIDATION: { sets: ["source", "tests", "config"], reusable: true },
};

/** Compute every named input set from the current tracked tree. */
export function computeInputSets(files = trackedFiles()) {
  const source = matchTracked(files, { prefixes: SOURCE_PREFIXES }).filter(
    (file) => !TEST_SUFFIXES.some((suffix) => file.endsWith(suffix)),
  );
  const tests = matchTracked(files, { suffixes: TEST_SUFFIXES });
  const config = matchTracked(files, { exact: CONFIG_EXACT });
  const lockfile = matchTracked(files, { exact: LOCKFILES });
  const manifest = matchTracked(files, { exact: ["package.json"] });
  const routes = matchTracked(files, { prefixes: ["src/routes/"] });
  const pipeline = matchTracked(files, { prefixes: PIPELINE_PREFIXES });
  const workflows = matchTracked(files, { prefixes: WORKFLOW_PREFIXES });
  const docs = matchTracked(files, { prefixes: DOC_PREFIXES }).filter(
    (file) => !isDerivedOutput(file),
  );
  const projection = projectionInputPaths();

  return {
    source: hashPathSet(source).hash,
    tests: hashPathSet(tests).hash,
    config: hashPathSet(config).hash,
    lockfile: hashPathSet(lockfile).hash,
    manifest: hashPathSet(manifest).hash,
    routes: hashPathSet(routes).hash,
    pipeline: hashPathSet(pipeline).hash,
    workflows: hashPathSet(workflows).hash,
    docs: hashPathSet(docs).hash,
    projection: hashPathSet(projection).hash,
    // Derived outputs are excluded so that writing evidence, or regenerating
    // the current-state projection, does not invalidate the evidence that was
    // just written. See DERIVED_OUTPUT_PREFIXES / DERIVED_OUTPUT_EXACT.
    tracked: hashPathSet(files.filter((file) => !isDerivedOutput(file))).hash,
  };
}

/** Narrow the full input map to the sets an evidence type actually depends on. */
export function inputSetFor(evidenceType, allSets) {
  const definition = INPUT_SET_DEFINITIONS[evidenceType];
  if (!definition) return {};
  const selected = {};
  for (const key of definition.sets) selected[key] = allSets[key] ?? "UNKNOWN";
  return selected;
}

export function isReusable(evidenceType) {
  return INPUT_SET_DEFINITIONS[evidenceType]?.reusable === true;
}

/** Names of the input sets an evidence type declares. */
export function declaredSets(evidenceType) {
  return INPUT_SET_DEFINITIONS[evidenceType]?.sets ?? [];
}
