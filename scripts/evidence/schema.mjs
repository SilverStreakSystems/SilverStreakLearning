/**
 * Evidence record schema (Layer A — immutable execution evidence).
 *
 * A record describes what actually happened at one commit, in one
 * environment, by one method. Once written it is never rebound and never
 * edited: a correction is a new record linked by supersedes/superseded_by.
 */
import { EVIDENCE_SCHEMA_VERSION } from "./util.mjs";

/**
 * Governed reporting methods. These four are the categories reported outward.
 * Internal detail may be carried in `producer_type`, never by weakening these.
 */
export const EVIDENCE_METHODS = ["automated", "manual", "assistive-technology", "independent"];

export const PRODUCER_TYPES = ["pipeline", "operator", "ai-assisted", "external-party"];

export const EVIDENCE_TYPES = [
  "BUILD",
  "TEST",
  "LINT",
  "TYPECHECK",
  "SSOT_BINDING",
  "SOURCE_PROVENANCE",
  "DEPENDENCY_INVENTORY",
  "SBOM",
  "VULNERABILITY_SCAN",
  "LICENSE_SCAN",
  "SECRET_SCAN",
  "PII_BOUNDARY_SCAN",
  "ROUTE_INVENTORY",
  "BASELINE_MANIFEST",
  "CONFIGURATION",
  "ACCESSIBILITY_AUTOMATED",
  "CUSTOM_VALIDATION",
];

export const EVIDENCE_STATUSES = ["pass", "fail", "not-completed", "review-required"];

export const ENVIRONMENTS = [
  "lovable-sandbox",
  "ci",
  "staging-future",
  "production-future",
  "independent-test",
];

export const APPLICABILITY_STATES = [
  "CURRENT",
  "STALE",
  "EXPIRED",
  "SUPERSEDED",
  "INAPPLICABLE",
  "UNKNOWN",
];

const REQUIRED_FIELDS = [
  "evidence_id",
  "schema_version",
  "evidence_type",
  "title",
  "description",
  "method",
  "producer",
  "producer_type",
  "commit_sha",
  "environment",
  "timestamp",
  "tool",
  "command",
  "actual_result",
  "status",
  "supports",
  "does_not_support",
  "synthetic_data_only",
  "independent",
];

const ARRAY_FIELDS = [
  "supports",
  "does_not_support",
  "related_requirements",
  "related_decisions",
  "related_tasks",
  "related_validations",
  "related_findings",
  "related_claims",
  "supersedes",
];

const SHA_PATTERN = /^[0-9a-f]{40}$/;

function isIso(value) {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && /\d{4}-\d{2}-\d{2}T/.test(value);
}

/**
 * Validate one evidence record.
 *
 * @returns {{ valid: boolean, errors: Array<{ field: string, message: string }> }}
 */
export function validateEvidenceRecord(record) {
  const errors = [];
  const fail = (field, message) => errors.push({ field, message });

  if (!record || typeof record !== "object") {
    return { valid: false, errors: [{ field: "record", message: "Record must be an object." }] };
  }

  for (const field of REQUIRED_FIELDS) {
    const value = record[field];
    if (value === undefined || value === null || value === "") {
      fail(field, "Required field is missing.");
    }
  }

  if (record.schema_version && typeof record.schema_version !== "string") {
    fail("schema_version", "Schema version must be a string.");
  }

  if (record.evidence_type && !EVIDENCE_TYPES.includes(record.evidence_type)) {
    fail("evidence_type", `Unknown evidence type: ${record.evidence_type}.`);
  }

  if (record.method && !EVIDENCE_METHODS.includes(record.method)) {
    fail("method", `Method must be one of: ${EVIDENCE_METHODS.join(", ")}.`);
  }

  if (record.producer_type && !PRODUCER_TYPES.includes(record.producer_type)) {
    fail("producer_type", `Unknown producer type: ${record.producer_type}.`);
  }

  if (record.status && !EVIDENCE_STATUSES.includes(record.status)) {
    fail("status", `Unknown status: ${record.status}.`);
  }

  if (record.environment && !ENVIRONMENTS.includes(record.environment)) {
    fail("environment", `Unknown environment: ${record.environment}.`);
  }

  if (record.commit_sha && !SHA_PATTERN.test(String(record.commit_sha))) {
    fail("commit_sha", "Commit SHA must be a 40-character lowercase hexadecimal string.");
  }

  if (record.timestamp && !isIso(record.timestamp)) {
    fail("timestamp", "Timestamp must be an ISO-8601 instant.");
  }

  if (record.expires_at !== undefined && record.expires_at !== null && !isIso(record.expires_at)) {
    fail("expires_at", "Expiry must be null or an ISO-8601 instant.");
  }

  if (record.timestamp && record.expires_at && isIso(record.timestamp) && isIso(record.expires_at)) {
    if (Date.parse(record.expires_at) <= Date.parse(record.timestamp)) {
      fail("expires_at", "Expiry must be later than the execution timestamp.");
    }
  }

  for (const field of ARRAY_FIELDS) {
    if (record[field] !== undefined && !Array.isArray(record[field])) {
      fail(field, "Field must be an array.");
    }
  }

  if (Array.isArray(record.supports) && record.supports.length === 0) {
    fail("supports", "Evidence must state at least one proposition it supports.");
  }

  if (record.independent === true && record.method !== "independent") {
    fail(
      "independent",
      "Independence is declared, never inferred: only method 'independent' may set it.",
    );
  }

  if (record.method === "independent" && record.producer_type === "pipeline") {
    fail("method", "Pipeline-produced output cannot be reported as independent evidence.");
  }

  if (record.input_set && typeof record.input_set !== "object") {
    fail("input_set", "Input set must be an object of declared input hashes.");
  }

  if (record.artifact_path && !record.artifact_hash) {
    fail("artifact_hash", "An indexed artifact must carry its hash.");
  }

  return { valid: errors.length === 0, errors };
}

/** Build a well-formed record, filling only structural defaults. */
export function createEvidenceRecord(fields) {
  return {
    schema_version: EVIDENCE_SCHEMA_VERSION,
    expires_at: null,
    tool_version: null,
    tree_hash: null,
    expected_result: null,
    artifact_path: null,
    artifact_hash: null,
    input_set: {},
    related_requirements: [],
    related_decisions: [],
    related_tasks: [],
    related_validations: [],
    related_findings: [],
    related_claims: [],
    supersedes: [],
    superseded_by: null,
    reproduction: null,
    synthetic_data_only: true,
    independent: false,
    producer_type: "pipeline",
    method: "automated",
    ...fields,
  };
}

export { EVIDENCE_SCHEMA_VERSION };
