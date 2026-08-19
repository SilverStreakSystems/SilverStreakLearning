/**
 * WP-037 — Evidence & Verification Pipeline, in-app contract.
 *
 * The pipeline itself lives in `scripts/evidence/`. This module is the
 * governed description of that pipeline as the operator reads it: the two
 * record layers, the applicability vocabulary, the declared input sets, the
 * expiry policy, the reuse conditions, and the boundaries.
 *
 * Nothing here executes a check. Nothing here declares authority, and no
 * pipeline result promotes a claim.
 */
import type { AuthorityClass } from "./authority";

/** The two record classes the pipeline keeps strictly separate. */
export const EVIDENCE_LAYERS = [
  {
    id: "layer-a",
    name: "Immutable execution evidence",
    rule: "Bound permanently to the commit and input set where it was produced.",
    lifecycle:
      "Never rebound, never edited. A correction is a new record that supersedes the old one.",
    staleMeaning:
      "Its declared inputs changed. The record itself remains true of the tree it examined.",
  },
  {
    id: "layer-b",
    name: "Current baseline manifest",
    rule: "Describes the tree it was generated from and cites the Layer A records it rests on.",
    lifecycle: "Regenerated, never hand-edited. Re-derivation is what makes it current.",
    staleMeaning: "It has not been re-derived for the present input sets.",
  },
] as const;

export const APPLICABILITY_STATES = [
  "CURRENT",
  "STALE",
  "EXPIRED",
  "SUPERSEDED",
  "INAPPLICABLE",
  "UNKNOWN",
] as const;

export type ApplicabilityState = (typeof APPLICABILITY_STATES)[number];

export const APPLICABILITY_MEANING: Record<ApplicabilityState, string> = {
  CURRENT: "Relevant inputs are unchanged and validity has not ended.",
  STALE: "A declared input changed, or the baseline has not been re-derived.",
  EXPIRED: "The declared validity window has ended.",
  SUPERSEDED: "A newer artifact formally replaces this one for the same scope.",
  INAPPLICABLE: "The result does not apply to the environment or scope under review.",
  UNKNOWN: "Applicability could not be determined. It is never collapsed into CURRENT or STALE.",
};

/** The four reported evidence methods. Independence is declared, never inferred. */
export const PIPELINE_METHODS = [
  {
    id: "automated",
    label: "Automated",
    note: "Executed by the pipeline against declared inputs.",
  },
  { id: "manual", label: "Manual", note: "Performed and recorded by the operator." },
  {
    id: "assistive-technology",
    label: "Assistive technology",
    note: "Performed with assistive technology and recorded as such.",
  },
  {
    id: "independent",
    label: "Independent",
    note: "Produced by a party that did not build the subject. No current record qualifies.",
  },
] as const;

export interface PipelineCheck {
  evidenceId: string;
  evidenceType: string;
  title: string;
  tool: string;
  declaredInputs: string[];
  validity: string;
  supports: string;
  doesNotSupport: string;
  reusable: boolean;
}

/** The checks the pipeline collects. Kept in step with `scripts/evidence/`. */
export const PIPELINE_CHECKS: PipelineCheck[] = [
  {
    evidenceId: "EV-BUILD",
    evidenceType: "BUILD",
    title: "Production build execution",
    tool: "vite (bun run build)",
    declaredInputs: ["source", "config", "lockfile"],
    validity: "Invalidated by an input change. No time window.",
    supports: "That a production build ran with the recorded exit code at the declared inputs.",
    doesNotSupport: "Runtime correctness, deployment success, performance, or security.",
    reusable: true,
  },
  {
    evidenceId: "EV-TEST",
    evidenceType: "TEST",
    title: "Automated test suite execution",
    tool: "vitest (bun run test)",
    declaredInputs: ["source", "tests", "config", "lockfile"],
    validity: "Invalidated by an input change. No time window.",
    supports: "That the declared suite executed with the recorded outcome.",
    doesNotSupport: "That the suite is complete or that untested behaviour is correct.",
    reusable: true,
  },
  {
    evidenceId: "EV-TYPECHECK",
    evidenceType: "TYPECHECK",
    title: "TypeScript type check",
    tool: "tsgo --noEmit",
    declaredInputs: ["source", "tests", "config"],
    validity: "Invalidated by an input change.",
    supports: "That the project type-checked with the recorded outcome.",
    doesNotSupport: "Runtime correctness or absence of logic defects.",
    reusable: true,
  },
  {
    evidenceId: "EV-LINT",
    evidenceType: "LINT",
    title: "Repository-wide lint baseline",
    tool: "eslint",
    declaredInputs: ["source", "tests", "config"],
    validity: "Invalidated by an input change.",
    supports: "The recorded problem count, held as quality debt against FND-014.",
    doesNotSupport: "That the repository is lint-clean, or that formatting equals correctness.",
    reusable: true,
  },
  {
    evidenceId: "EV-PROVENANCE",
    evidenceType: "SOURCE_PROVENANCE",
    title: "Source provenance derived from Git",
    tool: "git",
    declaredInputs: ["tracked"],
    validity: "Invalidated by any change to the tracked tree.",
    supports: "Repository ancestry and tree size as recorded by Git.",
    doesNotSupport: "Authorship attribution or the existence of external copies.",
    reusable: false,
  },
  {
    evidenceId: "EV-DEPS",
    evidenceType: "DEPENDENCY_INVENTORY",
    title: "Dependency inventory",
    tool: "manifest and lockfile reader",
    declaredInputs: ["manifest", "lockfile"],
    validity: "Invalidated by a manifest or lockfile change.",
    supports: "The declared and resolved dependency set.",
    doesNotSupport: "That the dependency set is secure, minimal, or licence-compatible.",
    reusable: true,
  },
  {
    evidenceId: "EV-SBOM",
    evidenceType: "SBOM",
    title: "CycloneDX software bill of materials",
    tool: "CycloneDX 1.5 writer",
    declaredInputs: ["manifest", "lockfile"],
    validity: "Invalidated by a manifest or lockfile change.",
    supports: "A dependency inventory for the recorded dependency state.",
    doesNotSupport:
      "Security or supply-chain integrity. An SBOM is an inventory, not an assurance.",
    reusable: true,
  },
  {
    evidenceId: "EV-VULN",
    evidenceType: "VULNERABILITY_SCAN",
    title: "Dependency vulnerability scan",
    tool: "bun audit",
    declaredInputs: ["manifest", "lockfile"],
    validity: "Seven-day window, because advisory feeds change independently of this repository.",
    supports: "The advisory counts this scanner reported, at that time.",
    doesNotSupport: "That the application is secure or that no vulnerability exists.",
    reusable: true,
  },
  {
    evidenceId: "EV-LICENSE",
    evidenceType: "LICENSE_SCAN",
    title: "Dependency licence inventory",
    tool: "package metadata reader",
    declaredInputs: ["manifest", "lockfile"],
    validity: "Ninety-day window against upstream relicensing.",
    supports: "The licence strings declared by resolved packages.",
    doesNotSupport: "Any legal conclusion. Compatibility requires qualified review.",
    reusable: true,
  },
  {
    evidenceId: "EV-SECRET",
    evidenceType: "SECRET_SCAN",
    title: "Secret exposure scan",
    tool: "pattern scanner (values never recorded)",
    declaredInputs: ["tracked"],
    validity: "Invalidated by any change within the scanned scope.",
    supports: "The number of candidate matches these patterns produced.",
    doesNotSupport: "That no secret exists. History and untracked files are out of scope.",
    reusable: false,
  },
  {
    evidenceId: "EV-PII",
    evidenceType: "PII_BOUNDARY_SCAN",
    title: "Personal-data boundary scan",
    tool: "pattern scanner (values recorded as digests only)",
    declaredInputs: ["tracked"],
    validity: "Invalidated by any change within the scanned scope.",
    supports: "The candidate matches these patterns produced over the tracked tree.",
    doesNotSupport: "That any match is, or is not, real personal data.",
    reusable: false,
  },
  {
    evidenceId: "EV-ROUTES",
    evidenceType: "ROUTE_INVENTORY",
    title: "Route inventory",
    tool: "route source parser",
    declaredInputs: ["routes"],
    validity: "Invalidated by a change to route sources.",
    supports: "The set of route paths declared in source.",
    doesNotSupport: "That every route renders, is reachable, is authorized, or is accessible.",
    reusable: true,
  },
  {
    evidenceId: "EV-CONFIG",
    evidenceType: "CONFIGURATION",
    title: "Configuration and workflow inventory",
    tool: "tracked-tree reader",
    declaredInputs: ["config", "workflows"],
    validity: "Invalidated by a configuration or workflow change.",
    supports: "Which configuration and workflow files exist, and their hashes.",
    doesNotSupport: "That any workflow is required by branch protection (FND-012).",
    reusable: true,
  },
  {
    evidenceId: "EV-SSOT-GUARD",
    evidenceType: "SSOT_BINDING",
    title: "Predecessor declared-binding guard",
    tool: "scripts/check-ssot-binding.mjs",
    declaredInputs: ["docs", "pipeline"],
    validity: "Invalidated by a change to bound documents or to the guard.",
    supports: "Whether WP-006 bound documents declare the commit under review.",
    doesNotSupport: "Semantic freshness of the figures inside those documents.",
    reusable: false,
  },
];

/** The conditions that must all hold before a result is carried forward. */
export const REUSE_CONDITIONS = [
  { id: "type-permits-reuse", statement: "The evidence type is declared reusable across commits." },
  { id: "inputs-unchanged", statement: "Every declared input hash is unchanged." },
  {
    id: "environment-applicable",
    statement: "The recording environment covers the environment under review.",
  },
  { id: "not-expired", statement: "The declared validity window has not ended." },
  { id: "not-superseded", statement: "No later artifact replaces it for the same scope." },
  { id: "no-invalidating-finding", statement: "No open finding invalidates the result." },
  {
    id: "proposition-within-supports",
    statement: "The proposition cited lies within what the record supports.",
  },
] as const;

/** What the pipeline refuses to do, stated so the refusal is checkable. */
export const PIPELINE_REFUSALS = [
  "A passing check never promotes a claim, closes a gate, or upgrades authority.",
  "Pipeline output is never reported as independent evidence.",
  "UNKNOWN is never rendered as CURRENT, STALE, or a pass.",
  "A scanner result is never rendered as a risk conclusion.",
  "Historical evidence is never rebound to a later commit; only the baseline is re-derived.",
  "No blended readiness, health, or percentage-complete score is produced.",
];

export interface PipelineFindingResolution {
  findingId: string;
  title: string;
  disposition: string;
  resolvedBy: string;
  residual: string;
}

/** How WP-037 dispositions the limitations WP-006 left open. */
export const PIPELINE_FINDING_RESOLUTIONS: PipelineFindingResolution[] = [
  {
    findingId: "FND-011",
    title: "Declaration drift between documents and repository state",
    disposition: "Dissolved by architecture",
    resolvedBy:
      "The commit under evidence is resolved dynamically at execution time, and the baseline is regenerated rather than hand-declared. There is no declaration left to drift.",
    residual: "Predecessor WP-006 documents retain hand-declared bindings and are unchanged.",
  },
  {
    findingId: "FND-013",
    title: "Semantic freshness could not be established by string comparison",
    disposition: "Addressed",
    resolvedBy:
      "Freshness is decided by declared input-set hashes and expiry policy, so a documentation-only commit no longer invalidates build evidence and a source change no longer passes unnoticed.",
    residual:
      "Input sets are declared by the pipeline. A dependency the declaration omits would not be detected.",
  },
  {
    findingId: "FND-012",
    title: "CI workflow existence is not merge enforcement",
    disposition: "Open, and not resolvable from repository content",
    resolvedBy:
      "The pipeline records workflow presence and states explicitly that presence is not enforcement.",
    residual: "Branch protection is configured outside the repository and remains unverified.",
  },
  {
    findingId: "FND-014",
    title: "Repository-wide lint is not passing",
    disposition: "Baselined",
    resolvedBy:
      "Lint is recorded as a debt baseline with counts by severity, and is never reported as a pass.",
    residual: "The debt itself is not reduced by recording it.",
  },
];

export const PIPELINE_AUTHORITY: {
  authorityClass: AuthorityClass;
  basis: string;
  limitation: string;
} = {
  authorityClass: "research-candidate",
  basis:
    "Executed under SSLS-BPP-001 v2.0 (DEC-007). WP-006 closed by DEC-014; WP-037 eligible. Repository SSOT adopted by DEC-010.",
  limitation:
    "Every record is executor-produced and not independent. No record certifies anything or closes a gate.",
};
