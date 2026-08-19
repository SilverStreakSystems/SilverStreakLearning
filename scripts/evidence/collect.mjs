/**
 * Evidence collectors.
 *
 * Each collector executes one real check and returns a schema-shaped record
 * plus any raw artifact it produced. Collectors never interpret risk, never
 * upgrade method, and never claim more than the command actually showed.
 */
import { readFileSync, existsSync } from "node:fs";

import { computeExpiry } from "./expiry.mjs";
import { computeInputSets, inputSetFor } from "./inputs.mjs";
import { createEvidenceRecord } from "./schema.mjs";
import {
  commitCount,
  hashFile,
  matchTracked,
  nowIso,
  resolveBranch,
  rootCommit,
  run,
  sha256,
  stableHash,
  trackedFiles,
  treeHash,
} from "./util.mjs";

function toolVersion(command, args = ["--version"]) {
  const result = run(command, args);
  return result.ok ? result.stdout.trim().split("\n")[0] : "UNKNOWN";
}

/** Common scaffolding shared by every collector. */
function base(context, evidenceType, fields) {
  const timestamp = nowIso();
  return createEvidenceRecord({
    evidence_id: fields.evidence_id,
    schema_version: undefined,
    evidence_type: evidenceType,
    commit_sha: context.commit,
    tree_hash: context.treeHash,
    environment: context.environment,
    timestamp,
    expires_at: computeExpiry(evidenceType, timestamp),
    input_set: inputSetFor(evidenceType, context.inputSets),
    producer: context.producer,
    producer_type: "pipeline",
    method: "automated",
    independent: false,
    synthetic_data_only: true,
    ...fields,
  });
}

export function makeContext({ commit, environment = "lovable-sandbox", producer = "SSLS evidence pipeline" }) {
  return {
    commit,
    environment,
    producer,
    treeHash: treeHash(),
    inputSets: computeInputSets(),
    files: trackedFiles(),
  };
}

export function collectBuild(context) {
  const started = Date.now();
  const result = run("bun", ["run", "build"], { cwd: process.cwd() });
  const durationMs = Date.now() - started;
  const log = `${result.stdout}\n${result.stderr}`.trim();

  return {
    record: base(context, "BUILD", {
      evidence_id: "EV-BUILD",
      title: "Production build execution",
      description: "Production build executed against the declared source, config, and lockfile inputs.",
      tool: "vite (via bun run build)",
      tool_version: toolVersion("bun"),
      command: "bun run build",
      expected_result: "Exit code 0.",
      actual_result: `Exit code ${result.code}. Duration ${durationMs} ms.`,
      status: result.ok ? "pass" : "fail",
      supports: [
        "The repository produced a production build at the declared input set with the recorded exit code.",
      ],
      does_not_support: [
        "Runtime correctness, deployment success, performance, security, or behaviour in any environment other than the one recorded.",
      ],
      reproduction: "bun install --frozen-lockfile && bun run build",
    }),
    artifact: { path: "build/build.log", content: log },
    durationMs,
  };
}

export function collectTests(context) {
  const started = Date.now();
  const result = run("bun", ["run", "test"]);
  const durationMs = Date.now() - started;
  const log = `${result.stdout}\n${result.stderr}`.trim();
  const summary = /Tests\s+(\d+)\s+passed(?:\s+\((\d+)\))?/.exec(log);
  const filesMatch = /Test Files\s+(\d+)\s+passed/.exec(log);

  return {
    record: base(context, "TEST", {
      evidence_id: "EV-TEST",
      title: "Automated test suite execution",
      description: "Full Vitest suite executed against the declared source and test inputs.",
      tool: "vitest (via bun run test)",
      tool_version: toolVersion("bun"),
      command: "bun run test",
      expected_result: "Every test passes and the runner exits 0.",
      actual_result: `Exit code ${result.code}. ${summary ? `${summary[1]} tests passed of ${summary[2] ?? summary[1]}.` : "Test counts not parsed."} ${filesMatch ? `${filesMatch[1]} test files.` : ""} Duration ${durationMs} ms.`.trim(),
      status: result.ok ? "pass" : "fail",
      supports: [
        "The declared test suite executed with the recorded outcome at the declared input set.",
      ],
      does_not_support: [
        "That the suite is complete, that untested behaviour is correct, or that any conformance obligation is met.",
      ],
      reproduction: "bun install --frozen-lockfile && bun run test",
    }),
    artifact: { path: "tests/test.log", content: log },
    durationMs,
    testsPassed: summary ? Number(summary[1]) : null,
    testFiles: filesMatch ? Number(filesMatch[1]) : null,
  };
}

export function collectTypecheck(context) {
  const started = Date.now();
  const result = run("bunx", ["tsgo", "--noEmit"]);
  const durationMs = Date.now() - started;
  const log = `${result.stdout}\n${result.stderr}`.trim();

  return {
    record: base(context, "TYPECHECK", {
      evidence_id: "EV-TYPECHECK",
      title: "TypeScript type check",
      description: "Whole-project type check without emit.",
      tool: "tsgo",
      tool_version: "bundled",
      command: "bunx tsgo --noEmit",
      expected_result: "Exit code 0 with no reported diagnostics.",
      actual_result: `Exit code ${result.code}.`,
      status: result.ok ? "pass" : "fail",
      supports: ["The project type-checked with the recorded outcome at the declared input set."],
      does_not_support: ["Runtime correctness or the absence of logic defects."],
      reproduction: "bunx tsgo --noEmit",
    }),
    artifact: { path: "build/typecheck.log", content: log },
    durationMs,
  };
}

export function collectLint(context) {
  const started = Date.now();
  const result = run("bunx", ["eslint", ".", "-f", "json"]);
  const durationMs = Date.now() - started;
  let errorCount = null;
  let warningCount = null;
  let fixableCount = null;
  let fileCount = null;
  let parsed = null;

  try {
    parsed = JSON.parse(result.stdout);
    errorCount = parsed.reduce((sum, file) => sum + file.errorCount, 0);
    warningCount = parsed.reduce((sum, file) => sum + file.warningCount, 0);
    fixableCount = parsed.reduce(
      (sum, file) => sum + file.fixableErrorCount + file.fixableWarningCount,
      0,
    );
    fileCount = parsed.filter((file) => file.errorCount + file.warningCount > 0).length;
  } catch {
    parsed = null;
  }

  const total = errorCount === null ? null : errorCount + warningCount;

  return {
    record: base(context, "LINT", {
      evidence_id: "EV-LINT",
      title: "Repository-wide lint baseline",
      description:
        "Full ESLint run recorded as a debt baseline. Existing debt is tracked; it is not represented as a pass.",
      tool: "eslint",
      tool_version: toolVersion("bunx", ["eslint", "--version"]),
      command: "bunx eslint . -f json",
      expected_result: "Recorded against the transitional lint policy, not against zero problems.",
      actual_result:
        total === null
          ? "Lint output could not be parsed."
          : `${total} problems across ${fileCount} files: ${errorCount} errors, ${warningCount} warnings, ${fixableCount} auto-fixable.`,
      status: total === null ? "not-completed" : "review-required",
      supports: [
        "The repository-wide lint problem count at the declared input set, recorded as quality debt.",
      ],
      does_not_support: [
        "That the repository is lint-clean, that formatting equals correctness, or that any defect class is absent.",
      ],
      related_findings: ["FND-014"],
      reproduction: "bunx eslint . -f json",
    }),
    artifact: { path: "lint/eslint.json", content: result.stdout || "[]" },
    durationMs,
    counts: { total, errorCount, warningCount, fixableCount, fileCount },
  };
}

export function collectRouteInventory(context) {
  const routeFiles = matchTracked(context.files, { prefixes: ["src/routes/"] }).filter(
    (file) => file.endsWith(".tsx") && !file.endsWith("__root.tsx"),
  );
  const routes = routeFiles
    .map((file) => {
      const source = readFileSync(file, "utf8");
      const match = /createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/.exec(source);
      return match ? { file, path: match[1] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.path.localeCompare(b.path));

  return {
    record: base(context, "ROUTE_INVENTORY", {
      evidence_id: "EV-ROUTES",
      title: "Route inventory derived from route sources",
      description: "Route paths parsed from createFileRoute declarations in the route directory.",
      tool: "scripts/evidence/collect.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "One declared path per route module.",
      actual_result: `${routes.length} routes declared across ${routeFiles.length} route modules.`,
      status: "pass",
      supports: ["The set of route paths declared in source at the declared input set."],
      does_not_support: [
        "That every route renders correctly, is reachable, is authorized, or is accessible.",
      ],
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "provenance/routes.json", content: JSON.stringify(routes, null, 2) },
    routes,
  };
}

export function collectProvenance(context) {
  const root = rootCommit();
  const commits = commitCount();
  const sourceFiles = matchTracked(context.files, { prefixes: ["src/", "scripts/"] });
  const docFiles = matchTracked(context.files, { prefixes: ["docs/"] });

  const payload = {
    repository: "Lovable-managed SSLS repository (authorized software SSOT under DEC-010)",
    branch: resolveBranch(),
    commit: context.commit,
    tree_hash: context.treeHash,
    root_commit: root,
    commit_count: commits,
    tracked_files: context.files.length,
    source_files: sourceFiles.length,
    doc_files: docFiles.length,
  };

  return {
    record: base(context, "SOURCE_PROVENANCE", {
      evidence_id: "EV-PROVENANCE",
      title: "Source provenance derived from Git",
      description: "Repository identity, ancestry, and tree size read directly from Git.",
      tool: "git",
      tool_version: toolVersion("git"),
      command: "git rev-parse / rev-list / ls-files",
      expected_result: "Ancestry recoverable to a single root commit.",
      actual_result: `Root commit ${root ?? "UNKNOWN"}; ${commits ?? "UNKNOWN"} commits; ${context.files.length} tracked files.`,
      status: root ? "pass" : "not-completed",
      supports: ["Repository ancestry and tree size as recorded by Git at this commit."],
      does_not_support: [
        "Authorship attribution, absence of history rewriting before the root commit, or any external copy of this code.",
      ],
      related_decisions: ["DEC-010"],
      reproduction: "git rev-list --max-parents=0 HEAD && git ls-files | wc -l",
    }),
    artifact: { path: "provenance/provenance.json", content: JSON.stringify(payload, null, 2) },
    payload,
  };
}

export function collectConfiguration(context) {
  const workflows = matchTracked(context.files, { prefixes: [".github/workflows/"] });
  const payload = {
    workflows: workflows.map((file) => ({ file, hash: hashFile(file) })),
    build_config: existsSync("vite.config.ts") ? { file: "vite.config.ts", hash: hashFile("vite.config.ts") } : null,
    test_config: existsSync("vitest.config.ts") ? { file: "vitest.config.ts", hash: hashFile("vitest.config.ts") } : null,
    lint_config: existsSync("eslint.config.js") ? { file: "eslint.config.js", hash: hashFile("eslint.config.js") } : null,
    branch_protection: "REQUIRED MERGE ENFORCEMENT - NOT VERIFIED",
  };

  return {
    record: base(context, "CONFIGURATION", {
      evidence_id: "EV-CONFIG",
      title: "Build, test, lint, and CI workflow configuration inventory",
      description: "Configuration files and workflow definitions present in the tracked tree, with content hashes.",
      tool: "scripts/evidence/collect.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "Every configuration input identified and hashed.",
      actual_result: `${workflows.length} CI workflow files; build, test, and lint configuration present.`,
      status: "pass",
      supports: ["Which configuration and workflow files exist in the tracked tree, and their hashes."],
      does_not_support: [
        "That any workflow is required by branch protection. Workflow presence is not merge enforcement (FND-012).",
      ],
      related_findings: ["FND-012"],
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "provenance/configuration.json", content: JSON.stringify(payload, null, 2) },
    payload,
  };
}

/** Compatibility wrapper over the WP-006 declared-binding guard. */
export function collectSsotBinding(context) {
  const result = run("node", ["scripts/check-ssot-binding.mjs"]);
  const log = `${result.stdout}\n${result.stderr}`.trim();

  return {
    record: base(context, "SSOT_BINDING", {
      evidence_id: "EV-SSOT-GUARD",
      title: "Predecessor declared-binding guard execution",
      description:
        "The WP-006 guard retained as a compatibility layer. It compares declared commit strings and is superseded for freshness purposes by input-aware applicability.",
      tool: "scripts/check-ssot-binding.mjs",
      tool_version: "1.0.0",
      command: "node scripts/check-ssot-binding.mjs",
      expected_result: "Reported as a review condition, not as a freshness proof.",
      actual_result: `Exit code ${result.code}.`,
      status: result.ok ? "pass" : "review-required",
      supports: ["Whether the WP-006 bound documents declare the commit under review."],
      does_not_support: [
        "Semantic freshness of any figure inside those documents, and merge enforcement of the check.",
      ],
      related_findings: ["FND-011", "FND-012", "FND-013"],
      reproduction: "node scripts/check-ssot-binding.mjs",
    }),
    artifact: { path: "provenance/ssot-binding.log", content: log },
  };
}

export function collectBackendState(files = trackedFiles()) {
  const indicators = matchTracked(files, {
    prefixes: ["supabase/", "src/integrations/supabase/"],
    exact: ["drizzle.config.ts", "prisma/schema.prisma"],
  });
  return {
    implemented: indicators.length > 0,
    indicators,
    statement:
      indicators.length > 0
        ? "Backend artifacts detected. Review required."
        : "No database or backend is configured in the tracked tree.",
  };
}

export { sha256, stableHash };
