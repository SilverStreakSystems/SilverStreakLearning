/**
 * Declared input sets.
 *
 * Every evidence type declares which repository inputs its result actually
 * depends on. Applicability is then a hash comparison against those inputs,
 * not a comparison of commit strings. A documentation-only commit leaves the
 * build input hash unchanged, so build evidence stays applicable without ever
 * being rebound.
 */
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
 * Input-set definitions per evidence type.
 *
 * `reusable` marks whether a result may be carried forward to a later commit
 * when its declared inputs are unchanged.
 */
export const INPUT_SET_DEFINITIONS = {
  BUILD: { sets: ["source", "config", "lockfile"], reusable: true },
  TEST: { sets: ["source", "tests", "config", "lockfile"], reusable: true },
  TYPECHECK: { sets: ["source", "tests", "config"], reusable: true },
  LINT: { sets: ["source", "tests", "config"], reusable: true },
  SSOT_BINDING: { sets: ["docs", "pipeline"], reusable: false },
  SOURCE_PROVENANCE: { sets: ["tracked"], reusable: false },
  DEPENDENCY_INVENTORY: { sets: ["manifest", "lockfile"], reusable: true },
  SBOM: { sets: ["manifest", "lockfile"], reusable: true },
  VULNERABILITY_SCAN: { sets: ["manifest", "lockfile"], reusable: true },
  LICENSE_SCAN: { sets: ["manifest", "lockfile"], reusable: true },
  SECRET_SCAN: { sets: ["tracked"], reusable: false },
  PII_BOUNDARY_SCAN: { sets: ["tracked"], reusable: false },
  ROUTE_INVENTORY: { sets: ["routes"], reusable: true },
  BASELINE_MANIFEST: { sets: ["tracked"], reusable: false },
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
  const docs = matchTracked(files, { prefixes: DOC_PREFIXES });

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
    // The generated evidence output is excluded so that writing evidence does
    // not invalidate the evidence that was just written.
    tracked: hashPathSet(files.filter((file) => !file.startsWith("evidence/"))).hash,
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
