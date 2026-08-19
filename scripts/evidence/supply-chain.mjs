/**
 * Supply-chain evidence: dependency inventory, SBOM, vulnerability scan,
 * and licence posture.
 *
 * These collectors produce inventory and scanner output. They do not produce
 * a security conclusion, and nothing here may be cited as certification.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { computeExpiry } from "./expiry.mjs";
import { inputSetFor } from "./inputs.mjs";
import { createEvidenceRecord } from "./schema.mjs";
import { hashFile, nowIso, run, sha256 } from "./util.mjs";

const LOCKFILES = ["bun.lock", "bun.lockb", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"];

const PERMISSIVE = new Set([
  "MIT",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "Apache-2.0",
  "0BSD",
  "CC0-1.0",
  "Unlicense",
  "BlueOak-1.0.0",
  "Python-2.0",
]);

const RESTRICTIVE_MARKERS = ["GPL", "AGPL", "LGPL", "SSPL", "BUSL", "CC-BY-NC", "EUPL", "MPL"];

function base(context, evidenceType, fields) {
  const timestamp = nowIso();
  return createEvidenceRecord({
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

function manifest() {
  return JSON.parse(readFileSync("package.json", "utf8"));
}

function lockfileIdentity() {
  const present = LOCKFILES.filter((file) => existsSync(file));
  return present.map((file) => ({ file, hash: hashFile(file) }));
}

/** Read installed package metadata from node_modules where available. */
function readInstalled(name) {
  const path = join("node_modules", name, "package.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function enumerateInstalled() {
  const root = "node_modules";
  if (!existsSync(root)) return [];
  const names = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    if (entry.name.startsWith("@")) {
      for (const scoped of readdirSync(join(root, entry.name), { withFileTypes: true })) {
        if (scoped.isDirectory()) names.push(`${entry.name}/${scoped.name}`);
      }
      continue;
    }
    names.push(entry.name);
  }
  return names.sort();
}

export function collectDependencyInventory(context) {
  const pkg = manifest();
  const direct = Object.entries({ ...pkg.dependencies }).map(([name, range]) => ({
    name,
    range,
    scope: "runtime",
  }));
  const dev = Object.entries({ ...pkg.devDependencies }).map(([name, range]) => ({
    name,
    range,
    scope: "development",
  }));
  const installed = enumerateInstalled();
  const locks = lockfileIdentity();

  const payload = {
    package_manager: locks.some((l) => l.file.startsWith("bun")) ? "bun" : "unknown",
    manifest_hash: hashFile("package.json"),
    lockfiles: locks,
    direct_dependencies: direct.length,
    direct_dev_dependencies: dev.length,
    resolved_packages: installed.length,
    dependencies: [...direct, ...dev].sort((a, b) => a.name.localeCompare(b.name)),
  };

  return {
    record: base(context, "DEPENDENCY_INVENTORY", {
      evidence_id: "EV-DEPS",
      title: "Dependency inventory derived from manifest and lockfile",
      description: "Direct and resolved dependency counts with manifest and lockfile hashes.",
      tool: "scripts/evidence/supply-chain.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "Every declared dependency enumerated with its declared range.",
      actual_result: `${direct.length} runtime and ${dev.length} development dependencies declared; ${installed.length} packages resolved in node_modules.`,
      status: "pass",
      supports: [
        "The declared and resolved dependency set at the recorded manifest and lockfile hashes.",
      ],
      does_not_support: [
        "That the dependency set is secure, licence-compatible, minimal, or free of unused packages.",
      ],
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "sbom/dependency-inventory.json", content: JSON.stringify(payload, null, 2) },
    payload,
  };
}

/** CycloneDX 1.5 SBOM generated from the manifest and the resolved tree. */
export function collectSbom(context) {
  const pkg = manifest();
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };
  const components = Object.keys(declared)
    .sort()
    .map((name) => {
      const installed = readInstalled(name);
      return {
        type: "library",
        "bom-ref": `pkg:npm/${name}@${installed?.version ?? "unresolved"}`,
        name,
        version: installed?.version ?? "UNKNOWN",
        scope: pkg.dependencies?.[name] ? "required" : "optional",
        purl: `pkg:npm/${name}@${installed?.version ?? "unresolved"}`,
        licenses: installed?.license ? [{ license: { id: String(installed.license) } }] : undefined,
        properties: [{ name: "ssls:declared-range", value: declared[name] }],
      };
    });

  const sbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    version: 1,
    metadata: {
      timestamp: nowIso(),
      tools: [{ vendor: "SSLS", name: "ssls-evidence-pipeline", version: "1.0.0" }],
      component: { type: "application", name: pkg.name, version: pkg.version ?? "0.0.0" },
      properties: [
        { name: "ssls:commit", value: context.commit },
        { name: "ssls:manifest-hash", value: hashFile("package.json") },
        ...lockfileIdentity().map((lock) => ({
          name: `ssls:lockfile:${lock.file}`,
          value: lock.hash,
        })),
      ],
    },
    components,
  };

  const content = JSON.stringify(sbom, null, 2);
  const unresolved = components.filter((component) => component.version === "UNKNOWN").length;

  return {
    record: base(context, "SBOM", {
      evidence_id: "EV-SBOM",
      title: "CycloneDX software bill of materials",
      description:
        "Dependency inventory in CycloneDX 1.5 JSON, generated from the manifest and resolved packages.",
      tool: "ssls-evidence-pipeline (CycloneDX 1.5 writer)",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "One component entry per declared dependency.",
      actual_result: `${components.length} components emitted; ${unresolved} without a resolved version.`,
      status: unresolved > 0 ? "review-required" : "pass",
      supports: ["A dependency inventory for the recorded manifest and lockfile state."],
      does_not_support: [
        "Security, licence compatibility, or supply-chain integrity. An SBOM is an inventory, not an assurance.",
      ],
      artifact_path: "sbom/sbom.cdx.json",
      artifact_hash: sha256(content),
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "sbom/sbom.cdx.json", content },
    componentCount: components.length,
  };
}

export function collectVulnerabilityScan(context) {
  const result = run("bun", ["audit", "--json"]);
  let parsed = null;
  let completed = result.ok || result.stdout.trim().startsWith("{");

  if (completed) {
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      completed = false;
    }
  }

  const severities = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };
  if (parsed && typeof parsed === "object") {
    const advisories = parsed.advisories ?? parsed.vulnerabilities ?? {};
    for (const advisory of Object.values(advisories)) {
      const severity = String(advisory?.severity ?? "info").toLowerCase();
      if (severity in severities) severities[severity] += 1;
    }
  }

  const total = Object.values(severities).reduce((a, b) => a + b, 0);
  const payload = {
    scan_status: completed
      ? "COMPLETED"
      : "SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE",
    scanner: "bun audit",
    advisory_source: "npm registry advisory feed",
    external_network_dependency: true,
    dependency_inputs: { manifest_hash: hashFile("package.json"), lockfiles: lockfileIdentity() },
    findings_by_severity: severities,
    limitations: [
      "Scanner coverage is limited to advisories published for the resolved npm dependency set.",
      "A scanner result is not a risk interpretation; triage is a separate, human step.",
      "Absence of advisories is not absence of vulnerability.",
    ],
    raw: completed ? parsed : { stderr: result.stderr.slice(0, 4000) },
  };

  const content = JSON.stringify(payload, null, 2);

  return {
    record: base(context, "VULNERABILITY_SCAN", {
      evidence_id: "EV-VULN",
      title: "Dependency vulnerability scan",
      description:
        "Advisory scan over the resolved dependency set, recorded without risk interpretation.",
      tool: "bun audit",
      tool_version: run("bun", ["--version"]).stdout.trim() || "UNKNOWN",
      command: "bun audit --json",
      expected_result: "Scanner completes and reports advisory counts by severity.",
      actual_result: completed
        ? `Scan completed. ${total} advisories: ${JSON.stringify(severities)}.`
        : "SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE.",
      status: completed ? (total > 0 ? "review-required" : "pass") : "not-completed",
      supports: completed
        ? ["The advisory counts reported by this scanner, for this dependency set, at this time."]
        : ["That the scan was attempted and did not complete."],
      does_not_support: [
        "That the application is secure, that no vulnerability exists, or that any advisory has been triaged.",
      ],
      artifact_path: "vulnerability/audit.json",
      artifact_hash: sha256(content),
      reproduction: "bun audit --json",
    }),
    artifact: { path: "vulnerability/audit.json", content },
    completed,
    severities,
  };
}

export function collectLicensePosture(context) {
  const pkg = manifest();
  const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).sort();

  const entries = names.map((name) => {
    const installed = readInstalled(name);
    const declared = installed?.license
      ? String(installed.license)
      : Array.isArray(installed?.licenses)
        ? installed.licenses.map((l) => l.type ?? l).join(" OR ")
        : null;

    let posture;
    if (!declared) posture = "UNKNOWN - REQUIRES LEGAL REVIEW";
    else if (RESTRICTIVE_MARKERS.some((marker) => declared.toUpperCase().includes(marker)))
      posture = "POTENTIALLY RESTRICTIVE - REQUIRES LEGAL REVIEW";
    else if (PERMISSIVE.has(declared)) posture = "COMMONLY PERMISSIVE";
    else posture = "UNCLASSIFIED - REQUIRES LEGAL REVIEW";

    return {
      name,
      version: installed?.version ?? "UNKNOWN",
      declared_license: declared ?? "UNKNOWN",
      posture,
    };
  });

  const review = entries.filter((entry) => entry.posture.includes("REQUIRES LEGAL REVIEW"));
  const payload = {
    total: entries.length,
    requires_legal_review: review.length,
    boundary:
      "This inventory records declared licence strings. It makes no legal conclusion about compatibility, obligation, or distribution rights.",
    entries,
  };
  const content = JSON.stringify(payload, null, 2);

  return {
    record: base(context, "LICENSE_SCAN", {
      evidence_id: "EV-LICENSE",
      title: "Dependency licence inventory",
      description: "Declared licence strings read from resolved package metadata.",
      tool: "scripts/evidence/supply-chain.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "A declared licence, or an explicit unknown, for every dependency.",
      actual_result: `${entries.length} dependencies inventoried; ${review.length} marked REQUIRES LEGAL REVIEW.`,
      status: review.length > 0 ? "review-required" : "pass",
      supports: ["The licence strings declared by the resolved dependency set."],
      does_not_support: [
        "Any legal conclusion about licence compatibility, obligations, or distribution rights. That requires qualified review.",
      ],
      artifact_path: "licenses/licenses.json",
      artifact_hash: sha256(content),
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "licenses/licenses.json", content },
    payload,
  };
}
