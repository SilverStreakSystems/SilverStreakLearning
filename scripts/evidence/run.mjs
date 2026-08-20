#!/usr/bin/env node
/**
 * SSLS Evidence & Verification Pipeline — collection entry point.
 *
 * Executes the declared checks at the resolved commit, writes immutable
 * Layer A records with their raw artifacts, and re-derives the Layer B
 * baseline. Nothing here promotes a claim, closes a gate, or declares
 * authority.
 *
 * Usage:
 *   bun run evidence:run                 collect everything
 *   bun run evidence:run --fast          skip build, tests, typecheck, lint
 *   bun run evidence:run --commit=<sha>  record against an explicit commit
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { buildBaseline, renderBaselineMarkdown } from "./baseline.mjs";
import { collectPiiBoundaryScan, collectSecretScan } from "./boundary.mjs";
import {
  collectBackendState,
  collectBuild,
  collectConfiguration,
  collectLint,
  collectProvenance,
  collectRouteInventory,
  collectSsotBinding,
  collectTests,
  collectTypecheck,
  makeContext,
} from "./collect.mjs";
import { validateEvidenceRecord } from "./schema.mjs";
import {
  collectDependencyInventory,
  collectLicensePosture,
  collectSbom,
  collectVulnerabilityRecoveryScan,
  collectVulnerabilityScan,
} from "./supply-chain.mjs";
import { GENERATED_MARKER, nowIso, resolveCommit, sha256 } from "./util.mjs";

const OUTPUT_DIR = "evidence";

function write(relativePath, content) {
  const target = join(OUTPUT_DIR, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content.endsWith("\n") ? content : `${content}\n`);
  return target;
}

async function main() {
  const fast = process.argv.includes("--fast");
  const commit = resolveCommit();

  if (!commit) {
    console.error("Cannot resolve the commit under evidence. Refusing to write unbound records.");
    process.exit(2);
  }

  const context = makeContext({
    commit,
    environment: process.env.GITHUB_ACTIONS ? "ci" : "lovable-sandbox",
  });

  console.log(`SSLS evidence pipeline — commit ${commit}${fast ? " (fast mode)" : ""}`);

  // Regenerate the current bundle, but never delete archived producing runs:
  // `evidence/runs/<sha>/` records are immutable and permanently bound.
  if (existsSync(OUTPUT_DIR)) {
    for (const entry of readdirSync(OUTPUT_DIR)) {
      if (entry === "runs") continue;
      rmSync(join(OUTPUT_DIR, entry), { recursive: true, force: true });
    }
  }

  const collected = [];
  const extras = {};

  const step = (label, fn) => {
    process.stdout.write(`  ${label} ... `);
    const result = fn();
    collected.push(result);
    console.log(result.record.status);
    return result;
  };

  if (!fast) {
    step("build", () => collectBuild(context));
    step("tests", () => collectTests(context));
    step("typecheck", () => collectTypecheck(context));
    step("lint", () => collectLint(context));
  }

  const routes = step("routes", () => collectRouteInventory(context));
  extras.routes = routes.routes;

  step("provenance", () => collectProvenance(context));
  step("configuration", () => collectConfiguration(context));
  step("ssot binding (compatibility)", () => collectSsotBinding(context));

  const deps = step("dependencies", () => collectDependencyInventory(context));
  extras.dependencies = deps.payload.direct_dependencies + deps.payload.direct_dev_dependencies;

  const sbom = step("sbom", () => collectSbom(context));
  extras.sbomComponents = sbom.componentCount;

  step("vulnerability scan", () => collectVulnerabilityScan(context));

  process.stdout.write("  vulnerability scan (recovery source) ... ");
  const recovery = await collectVulnerabilityRecoveryScan(context);
  collected.push(recovery);
  console.log(recovery.record.status);

  const licenses = step("licence inventory", () => collectLicensePosture(context));
  extras.licensesRequiringReview = licenses.payload.requires_legal_review;

  const secrets = step("secret scan", () => collectSecretScan(context));
  extras.secretMatches = secrets.matches.length;

  const pii = step("personal-data boundary scan", () => collectPiiBoundaryScan(context));
  extras.piiMatches = pii.matches.length;

  extras.backend = collectBackendState(context.files);

  // Persist raw artifacts and attach their hashes.
  const records = [];
  for (const item of collected) {
    if (item.artifact) {
      const content =
        typeof item.artifact.content === "string"
          ? item.artifact.content
          : JSON.stringify(item.artifact.content, null, 2);
      write(`artifacts/${item.artifact.path}`, content);
      item.record.artifact_path = `artifacts/${item.artifact.path}`;
      item.record.artifact_hash = sha256(content);
    }
    records.push(item.record);
  }

  // Validate before anything is indexed.
  const invalid = [];
  for (const record of records) {
    const { valid, errors } = validateEvidenceRecord(record);
    if (!valid) invalid.push({ evidence_id: record.evidence_id, errors });
  }

  if (invalid.length > 0) {
    console.error("\nSchema validation failed. No index written.");
    for (const entry of invalid) {
      console.error(`  ${entry.evidence_id}`);
      for (const error of entry.errors) console.error(`    ${error.field}: ${error.message}`);
    }
    process.exit(1);
  }

  for (const record of records) {
    write(`records/${record.evidence_id}.json`, JSON.stringify(record, null, 2));
  }

  const baseline = buildBaseline(context, records, extras);
  write("baseline.json", JSON.stringify(baseline, null, 2));
  write("BASELINE.md", renderBaselineMarkdown(baseline));

  const index = {
    schema_version: "1.0.0",
    generated_marker: GENERATED_MARKER,
    generated_at: nowIso(),
    commit_sha: commit,
    environment: context.environment,
    mode: fast ? "fast" : "full",
    input_sets: context.inputSets,
    records: records.map((record) => ({
      evidence_id: record.evidence_id,
      evidence_type: record.evidence_type,
      title: record.title,
      status: record.status,
      method: record.method,
      independent: record.independent,
      timestamp: record.timestamp,
      expires_at: record.expires_at,
      artifact_path: record.artifact_path,
      artifact_hash: record.artifact_hash,
    })),
  };
  write("evidence-index.json", JSON.stringify(index, null, 2));

  const failed = records.filter((record) => record.status === "fail");
  const review = records.filter((record) => record.status === "review-required");
  const incomplete = records.filter((record) => record.status === "not-completed");

  console.log(
    `\n${records.length} records written to ${OUTPUT_DIR}/. ` +
      `fail=${failed.length} review-required=${review.length} not-completed=${incomplete.length}`,
  );
  console.log(`Baseline freshness: ${baseline.freshness.state}`);

  process.exit(failed.length > 0 ? 1 : 0);
}

await main();
