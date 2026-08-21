/**
 * Type surface for the WP-037 evidence pipeline.
 *
 * The pipeline itself is plain JavaScript so that it runs unbuilt in CI with no
 * transform step between the operator and the evidence. These declarations give
 * the TypeScript test suite a checked view of that surface without duplicating
 * the implementation.
 */

export type EvidenceType =
  | "BUILD"
  | "TEST"
  | "TYPECHECK"
  | "LINT"
  | "SOURCE_PROVENANCE"
  | "DEPENDENCY_INVENTORY"
  | "SBOM"
  | "VULNERABILITY_SCAN"
  | "LICENSE_INVENTORY"
  | "SECRET_SCAN"
  | "PII_BOUNDARY_SCAN"
  | "ROUTE_INVENTORY"
  | "CONFIGURATION"
  | "SSOT_BINDING";

export type EvidenceStatus = "pass" | "fail" | "review-required" | "not-completed";

export type ApplicabilityState =
  "CURRENT" | "STALE" | "EXPIRED" | "SUPERSEDED" | "INAPPLICABLE" | "UNKNOWN";

export type InputSetName =
  | "source"
  | "tests"
  | "config"
  | "manifest"
  | "lockfile"
  | "routes"
  | "workflows"
  | "docs"
  | "tracked"
  | "projection"
  | "pipeline";

export type InputSetMap = Partial<Record<InputSetName, string>> & Record<string, string>;

export interface EvidenceRecord {
  schema_version: number;
  evidence_id: string;
  evidence_type: EvidenceType;
  title: string;
  description: string;
  commit_sha: string;
  environment: string;
  timestamp: string;
  tool: string;
  tool_version: string | null;
  command: string;
  expected_result: string;
  actual_result: string;
  status: EvidenceStatus;
  method: "automated" | "document-review" | "executor-observation" | "independent";
  producer_type: "pipeline" | "human" | "external";
  independent: boolean;
  supports: string[];
  does_not_support: string[];
  input_set: InputSetMap;
  input_set_digest: string;
  reusable: boolean;
  expires_at: string | null;
  superseded_by: string | null;
  artifact_path: string | null;
  artifact_hash: string | null;
  related_findings: string[];
  related_claims: string[];
  synthetic: boolean;
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}
