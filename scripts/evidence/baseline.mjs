/**
 * Layer B — the current baseline manifest.
 *
 * The baseline is derived, never hand-written. It states what is true of the
 * tree it was generated from, cites the Layer A records it rests on, and
 * carries the input hashes needed to tell later whether it is still current.
 * When it has not been re-derived, it is stale — a machine-checkable
 * proposition, unlike a string comparison of declared commits.
 */
import { evaluateApplicability } from "./applicability.mjs";
import { computeInputSets } from "./inputs.mjs";
import {
  BASELINE_SCHEMA_VERSION,
  GENERATED_MARKER,
  commitCount,
  matchTracked,
  nowIso,
  rootCommit,
  shortSha,
  stableHash,
  trackedFiles,
  treeHash,
  workingTreeDirty,
} from "./util.mjs";

function countLines(files) {
  return files.length;
}

/**
 * @param {object} context collector context
 * @param {object[]} records Layer A records produced or reused for this baseline
 * @param {object} extras derived detail from the collectors
 */
export function buildBaseline(context, records, extras = {}) {
  const files = context.files ?? trackedFiles();
  const inputSets = context.inputSets ?? computeInputSets(files);

  const byId = Object.fromEntries(records.map((record) => [record.evidence_id, record]));
  const applicability = records.map((record) => ({
    evidence_id: record.evidence_id,
    evidence_type: record.evidence_type,
    status: record.status,
    ...evaluateApplicability(record, { inputSets, environment: context.environment, commit: context.commit }),
  }));

  const notCurrent = applicability.filter((entry) => entry.state !== "CURRENT");

  return {
    schema_version: BASELINE_SCHEMA_VERSION,
    generated_marker: GENERATED_MARKER,
    layer: "B — current baseline manifest (derived; regenerated, never hand-edited)",
    generated_at: nowIso(),
    commit_sha: context.commit,
    short_commit: shortSha(context.commit),
    tree_hash: context.treeHash ?? treeHash(),
    working_tree_dirty: workingTreeDirty(),
    authority: {
      class: "candidate",
      basis: "Derived record under SSLS-BPP-001 v2.0 (DEC-007). Repository SSOT adopted by DEC-010.",
      note: "Authority is declared, never derived from a passing check.",
    },
    repository: {
      root_commit: rootCommit(),
      commit_count: commitCount(),
      tracked_files: files.length,
      source_files: countLines(matchTracked(files, { prefixes: ["src/"] })),
      test_files: countLines(matchTracked(files, { suffixes: [".test.ts", ".test.tsx"] })),
      doc_files: countLines(matchTracked(files, { prefixes: ["docs/"] })),
      route_modules: countLines(matchTracked(files, { prefixes: ["src/routes/"] })),
    },
    input_sets: inputSets,
    input_set_digest: stableHash(inputSets),
    evidence_cited: records.map((record) => ({
      evidence_id: record.evidence_id,
      evidence_type: record.evidence_type,
      status: record.status,
      commit_sha: record.commit_sha,
      timestamp: record.timestamp,
      artifact_path: record.artifact_path,
    })),
    applicability,
    derived: {
      build: byId["EV-BUILD"]?.actual_result ?? "NOT COLLECTED",
      tests: byId["EV-TEST"]?.actual_result ?? "NOT COLLECTED",
      typecheck: byId["EV-TYPECHECK"]?.actual_result ?? "NOT COLLECTED",
      lint: byId["EV-LINT"]?.actual_result ?? "NOT COLLECTED",
      routes: extras.routes?.length ?? null,
      dependencies: extras.dependencies ?? null,
      sbom_components: extras.sbomComponents ?? null,
      vulnerability_scan: byId["EV-VULN"]?.actual_result ?? "NOT COLLECTED",
      licenses_requiring_review: extras.licensesRequiringReview ?? null,
      secret_scan_matches: extras.secretMatches ?? null,
      pii_scan_matches: extras.piiMatches ?? null,
      backend: extras.backend?.statement ?? "DATABASE STATUS — NOT IMPLEMENTED",
    },
    freshness: {
      state: notCurrent.length === 0 ? "CURRENT" : "REVIEW REQUIRED",
      not_current: notCurrent.map((entry) => `${entry.evidence_id}: ${entry.state} — ${entry.reason}`),
      rule: "The baseline is current when every cited record is CURRENT for the present input sets. Re-derivation, not rebinding, is what makes it current.",
    },
    boundaries: [
      "No production data, no personal data, and no live integration is in scope.",
      "No result in this manifest constitutes certification, conformance, or release readiness.",
      "Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).",
      "Independence is declared. Every record here is executor-produced and not independent.",
    ],
  };
}

/** Human-readable rendering of the baseline. Generated; never hand-edited. */
export function renderBaselineMarkdown(baseline) {
  const rows = baseline.applicability
    .map((entry) => `| ${entry.evidence_id} | ${entry.evidence_type} | ${entry.status} | ${entry.state} |`)
    .join("\n");

  const repo = baseline.repository;

  return `# Current Baseline Manifest

${GENERATED_MARKER}. Regenerate with \`bun run evidence:run\`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | ${baseline.generated_at} |
| Commit | \`${baseline.commit_sha}\` |
| Tree hash | \`${baseline.tree_hash}\` |
| Working tree dirty | ${baseline.working_tree_dirty} |
| Input-set digest | \`${baseline.input_set_digest}\` |
| Freshness | **${baseline.freshness.state}** |

## Repository

| Measure | Count |
|---|---|
| Root commit | \`${repo.root_commit ?? "UNKNOWN"}\` |
| Commits | ${repo.commit_count ?? "UNKNOWN"} |
| Tracked files | ${repo.tracked_files} |
| Source files | ${repo.source_files} |
| Test files | ${repo.test_files} |
| Route modules | ${repo.route_modules} |
| Documentation files | ${repo.doc_files} |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | ${baseline.derived.build} |
| Tests | ${baseline.derived.tests} |
| Type check | ${baseline.derived.typecheck} |
| Lint | ${baseline.derived.lint} |
| Routes | ${baseline.derived.routes ?? "NOT COLLECTED"} |
| SBOM components | ${baseline.derived.sbom_components ?? "NOT COLLECTED"} |
| Vulnerability scan | ${baseline.derived.vulnerability_scan} |
| Licences requiring review | ${baseline.derived.licenses_requiring_review ?? "NOT COLLECTED"} |
| Secret scan candidates | ${baseline.derived.secret_scan_matches ?? "NOT COLLECTED"} |
| Personal-data scan candidates | ${baseline.derived.pii_scan_matches ?? "NOT COLLECTED"} |
| Backend | ${baseline.derived.backend} |

## Cited evidence and applicability

| Evidence | Type | Result | Applicability |
|---|---|---|---|
${rows}

${baseline.freshness.not_current.length > 0 ? `### Not current\n\n${baseline.freshness.not_current.map((line) => `- ${line}`).join("\n")}\n` : ""}
## Boundaries

${baseline.boundaries.map((line) => `- ${line}`).join("\n")}
`;
}
