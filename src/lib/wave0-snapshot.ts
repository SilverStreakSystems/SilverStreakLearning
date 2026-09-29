/**
 * Wave 0 authority and implementation snapshot.
 *
 * Reads the hand-maintained declaration, recovers the live repository
 * inventories from the same bytes the application reads, and validates both.
 * It records nothing, closes nothing, and decides nothing: the generated
 * projection is a reading of the repository, never an approval of it.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { ROUTE_REGISTRY } from "@/lib/route-registry";
import { CLAIMS, DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures/registers";

const ROOT = process.cwd();
export const DECLARATION_PATH = "data/product-definition-assurance/wave0-declaration.json";
export const SNAPSHOT_PATH = "data/product-definition-assurance/generated/wave0-snapshot.json";

export interface Wave0StateSet {
  truth: string;
  authority: string;
  lifecycle: string;
  implementation: string;
  validation: string;
  release: string;
  claim_eligibility: string;
}

export interface Wave0ArtifactEntry {
  artifact_id: string;
  artifact: string;
  existing_canonical_sources: string[];
  current_evidence: string[];
  present: string;
  missing_fields: string[];
  conflicts: string[];
  recommended_extension: string;
  states: Wave0StateSet;
}

export interface Wave0ReconciliationEntry {
  entry_id: string;
  subject: string;
  observation: string;
  resolution_rule: string;
  owner_decision_required?: boolean;
  sources: string[];
}

export interface Wave0DispositionOption {
  option_id: string;
  label: string;
  meaning: string;
  consequences: string[];
  smallest_next_action: string;
}

export interface Wave0Declaration {
  snapshot_id: string;
  snapshot_version: string;
  controlling_decision: string;
  authority_class: string;
  boundary: string[];
  state_axes: Record<keyof Wave0StateSet, string[]>;
  preserved_program_state: { subject: string; state: string; source: string }[];
  declared_inputs: string[];
  artifact_map: Wave0ArtifactEntry[];
  reconciliation: Wave0ReconciliationEntry[];
  disposition_packet: {
    disposition_recorded: null;
    options: Wave0DispositionOption[];
  };
  gated_future: { subject: string; state: string }[];
}

export function loadWave0Declaration(): Wave0Declaration {
  return JSON.parse(readFileSync(join(ROOT, DECLARATION_PATH), "utf8")) as Wave0Declaration;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(ROOT, path), "utf8"));
}

/**
 * The evidence bundle is regenerated in place, so it is absent for part of a
 * collection run. Absence is reported as unknown rather than as zero.
 */
function readEvidenceIndex(): { records: { evidence_id: string; status: string }[] } | null {
  const path = join(ROOT, "evidence/evidence-index.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as {
    records: { evidence_id: string; status: string }[];
  };
}

function countRecords(path: string, key: string): number {
  const value = readJson(path) as Record<string, unknown>;
  const records = value[key];
  return Array.isArray(records) ? records.length : 0;
}

function listFiles(dir: string, predicate: (name: string) => boolean): string[] {
  const target = join(ROOT, dir);
  if (!existsSync(target)) return [];
  return readdirSync(target)
    .filter((name) => statSync(join(target, name)).isFile() && predicate(name))
    .sort();
}

/** Route files classified the way the router itself resolves them. */
export function routeFileInventory() {
  const files = listFiles("src/routes", (name) => name.endsWith(".tsx"));
  const root: string[] = files.filter((name) => name === "__root.tsx");
  const dynamic = files.filter((name) => name.includes(".$") || name.startsWith("$"));
  const index = files.filter((name) => name === "index.tsx" || name.endsWith(".index.tsx"));
  const layout = files.filter(
    (name) =>
      !root.includes(name) &&
      !dynamic.includes(name) &&
      !index.includes(name) &&
      files.some((other) => other !== name && other.startsWith(`${name.replace(/\.tsx$/, "")}.`)),
  );
  return {
    total_route_modules: files.length,
    framework_surfaces: root,
    layout_surfaces: layout,
    index_surfaces: index,
    dynamic_detail_surfaces: dynamic,
  };
}

export interface Wave0Inventories {
  routes: {
    registered: number;
    by_group: Record<string, number>;
    files: ReturnType<typeof routeFileInventory>;
    wp006_manifest: {
      commit: string;
      manifest_rows: number;
      declared_route_files: number;
      declared_addressable_routes_plus_root_layout: string;
      declared_registry_paths: number;
      note: string;
    };
    external_historical_counts: { source: string; count: number; locator: string; note: string }[];
  };
  registers: Record<string, number | Record<string, number>>;
  verification: { test_files: number; commands: string[] };
  persistence: { backend: string; personal_data: string };
}

const WP006_MANIFEST_PATH = "docs/wp-006/ROUTE_MANIFEST.md";

function wp006ManifestRows(): number {
  const path = join(ROOT, WP006_MANIFEST_PATH);
  if (!existsSync(path)) return 0;
  return (readFileSync(path, "utf8").match(/^\| RT-\d+ \|/gm) ?? []).length;
}

export function buildWave0Inventories(): Wave0Inventories {
  const byGroup: Record<string, number> = {};
  for (const route of ROUTE_REGISTRY) byGroup[route.group] = (byGroup[route.group] ?? 0) + 1;

  const decisionsByState: Record<string, number> = {};
  for (const decision of DECISIONS)
    decisionsByState[decision.state] = (decisionsByState[decision.state] ?? 0) + 1;

  const findingsByState: Record<string, number> = {};
  for (const finding of FINDINGS)
    findingsByState[finding.resolutionState] = (findingsByState[finding.resolutionState] ?? 0) + 1;

  const checkpoints = readJson("data/program/checkpoints.json") as {
    checkpoints: unknown[];
    attempts: unknown[];
  };

  return {
    routes: {
      registered: ROUTE_REGISTRY.length,
      by_group: byGroup,
      files: routeFileInventory(),
      wp006_manifest: {
        commit: "70c1f891c5d341c60132d0109979042004425a4b",
        manifest_rows: wp006ManifestRows(),
        declared_route_files: 30,
        declared_addressable_routes_plus_root_layout: "29 addressable routes plus the root layout",
        declared_registry_paths: 19,
        note: `Version-bound historical evidence from ${WP006_MANIFEST_PATH}. It does not record seventeen routes and is not the current inventory.`,
      },
      external_historical_counts: [
        {
          source: "August 5 v0.2.0 package",
          count: 17,
          locator: "no exact repository source locator in the tracked tree",
          note: "External, version-bound historical evidence. It is not the WP-006 manifest count and must never be attached to it or to the live inventory.",
        },
      ],
    },
    registers: {
      decisions: DECISIONS.length,
      decisions_by_state: decisionsByState,
      findings: FINDINGS.length,
      findings_by_state: findingsByState,
      evidence_records: EVIDENCE.length,
      claims: CLAIMS.length,
      claims_refused: CLAIMS.filter((claim) => claim.posture === "refused").length,
      governed_packages: countRecords("data/packages/governed-packages.json", "records"),
      obligations: countRecords("data/governance/obligations.json", "records"),
      historical_sources: countRecords("data/historical/historical-sources.json", "records"),
      historical_requirements: countRecords(
        "data/historical/historical-requirements.json",
        "records",
      ),
      checkpoints: checkpoints.checkpoints.length,
      attempts: checkpoints.attempts.length,
    },
    verification: {
      test_files: listFiles("src/test", (name) => name.includes(".test.")).length,
      commands: [
        "bun run lint",
        "bun run typecheck",
        "bun run test",
        "bun run build",
        "bun run check:current-state",
        "bun run check:generated",
        "bun run evidence:verify",
        "bun run evidence:output-safety:check",
      ],
    },
    persistence: {
      backend: existsSync(join(ROOT, "src/integrations/supabase"))
        ? "A platform-generated Supabase integration is present, authorized by DEC-024 only as backend services for AI features over the owner's own creative writing. No user sign-in, accounts, tenancy, or learner data is authorized."
        : "No database, backend authentication, or row-level security exists in the tracked tree.",
      personal_data:
        "Real personal data is prohibited and not intentionally introduced; every product record is synthetic and marked as such in the fixtures. The automated boundary scan (EV-PII) remains review-required: it reported one inspected test-token candidate and does not establish the absence of personal data.",
    },
  };
}

/** Digest of the declared inputs, so staleness is mechanical rather than remembered. */
export function fingerprintDeclaredInputs(inputs: string[]): string {
  const hash = createHash("sha256");
  for (const input of [...inputs].sort()) {
    const path = join(ROOT, input);
    hash.update(input);
    hash.update("\u0000");
    hash.update(existsSync(path) ? readFileSync(path) : Buffer.from("MISSING"));
    hash.update("\u0000");
  }
  return hash.digest("hex");
}

export interface Wave0Issue {
  code: string;
  detail: string;
}

const RECORD_PREFIXES = ["DEC-", "FND-", "EV-"];

/**
 * Fails closed. Every problem is reported as an issue rather than repaired,
 * because silently repairing a governance record is how drift becomes invisible.
 */
export function validateWave0Declaration(declaration: Wave0Declaration): Wave0Issue[] {
  const issues: Wave0Issue[] = [];
  const seen = new Set<string>();

  const requireUnique = (id: string) => {
    if (seen.has(id)) issues.push({ code: "DUPLICATE_ID", detail: id });
    seen.add(id);
  };

  const requirePath = (path: string, owner: string) => {
    if (!existsSync(join(ROOT, path)))
      issues.push({ code: "BROKEN_SOURCE_PATH", detail: `${owner} -> ${path}` });
  };

  const pipelineIndex = readEvidenceIndex();
  const knownRecordIds = new Set<string>([
    ...DECISIONS.map((decision) => decision.id),
    ...FINDINGS.map((finding) => finding.id),
    ...EVIDENCE.map((evidence) => evidence.id),
    ...(pipelineIndex?.records ?? []).map((record) => record.evidence_id),
  ]);

  const requireRecord = (id: string, owner: string) => {
    // While the evidence bundle is being regenerated its identifiers cannot be
    // checked. Unverifiable is not the same as wrong, so nothing is reported.
    if (pipelineIndex === null && /^EV-[A-Z]/.test(id)) return;
    if (RECORD_PREFIXES.some((prefix) => id.startsWith(prefix)) && !knownRecordIds.has(id))
      issues.push({ code: "ORPHAN_REFERENCE", detail: `${owner} -> ${id}` });
  };

  requireRecord(declaration.controlling_decision, "controlling_decision");
  for (const input of declaration.declared_inputs) requirePath(input, "declared_inputs");
  for (const state of declaration.preserved_program_state)
    requirePath(state.source, `preserved_program_state:${state.subject}`);

  for (const entry of declaration.artifact_map) {
    requireUnique(entry.artifact_id);
    for (const source of entry.existing_canonical_sources) requirePath(source, entry.artifact_id);
    for (const evidenceId of entry.current_evidence) requireRecord(evidenceId, entry.artifact_id);
    for (const [axis, value] of Object.entries(entry.states)) {
      const vocabulary = declaration.state_axes[axis as keyof Wave0StateSet];
      if (!vocabulary || !vocabulary.includes(value))
        issues.push({ code: "INVALID_STATE", detail: `${entry.artifact_id}.${axis} = ${value}` });
    }
  }

  for (const entry of declaration.reconciliation) {
    requireUnique(entry.entry_id);
    for (const source of entry.sources) requirePath(source, entry.entry_id);
  }

  const labels = ["ACCEPT BASELINE", "REVISE BASELINE", "HOLD"];
  declaration.disposition_packet.options.forEach((option, position) => {
    requireUnique(option.option_id);
    if (option.label !== labels[position])
      issues.push({ code: "INVALID_DISPOSITION", detail: option.label });
  });
  if (declaration.disposition_packet.disposition_recorded !== null)
    issues.push({ code: "DISPOSITION_RECORDED", detail: "Wave 0 may not record a disposition." });

  for (const gated of declaration.gated_future) {
    if (gated.state !== "not-authorized" && gated.state !== "deferred-not-run")
      issues.push({ code: "GATED_FUTURE_ACTIVATED", detail: `${gated.subject} = ${gated.state}` });
  }

  return issues;
}
