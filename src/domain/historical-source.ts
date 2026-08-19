/**
 * WP-007 — Historical Requirement Conformance Recovery.
 *
 * Canonical vocabulary and validation for the historical-source universe.
 * The canonical DATA lives in `data/historical/historical-sources.json`;
 * this module supplies the types and the deterministic checks that guard it.
 *
 * Nothing here promotes a historical source into current authority. A record
 * states where a source is, what it is, how much of it can be reached, and
 * whether it is worth reading during requirement recovery. Those are
 * independent facts and are never collapsed into one.
 */

/** What kind of thing the source is. */
export const HISTORICAL_SOURCE_FAMILIES = [
  "repository",
  "governance-document",
  "machine-register",
  "application-register",
  "bootstrap-artifact",
  "external-drive-folder",
  "chat-history",
  "external-service",
] as const;
export type HistoricalSourceFamily = (typeof HISTORICAL_SOURCE_FAMILIES)[number];

/**
 * How much authority the source carries RIGHT NOW. Age, volume, and effort do
 * not upgrade a classification; only a recorded owner decision can.
 */
export const AUTHORITY_CLASSIFICATIONS = [
  "CURRENT-AUTHORITY",
  "HISTORICAL-EVIDENCE",
  "RESEARCH-INPUT",
  "REFERENCE-ONLY",
  "REFUSED",
] as const;
export type HistoricalAuthorityClassification = (typeof AUTHORITY_CLASSIFICATIONS)[number];

/** What the executor can actually reach in this environment. */
export const ACCESS_LIMITATIONS = [
  "FULL",
  "READ-ONLY",
  "PARTIAL",
  "NOT-ACCESSIBLE-TO-EXECUTOR",
  "UNKNOWN",
] as const;
export type AccessLimitation = (typeof ACCESS_LIMITATIONS)[number];

/** Whether this program may edit the source. */
export const IMMUTABILITY_STATES = ["IMMUTABLE", "APPEND-ONLY", "MUTABLE"] as const;
export type ImmutabilityState = (typeof IMMUTABILITY_STATES)[number];

/** Expected usefulness for later requirement extraction. Not a promise to extract. */
export const RECOVERY_RELEVANCE = ["HIGH", "MEDIUM", "LOW", "NONE", "UNKNOWN"] as const;
export type RecoveryRelevance = (typeof RECOVERY_RELEVANCE)[number];

/**
 * Promotion state. Only `CURRENT-AUTHORITY` sources may read `PROMOTED`, and
 * that classification is itself carried by a recorded decision, not by WP-007.
 */
export const PROMOTION_STATES = ["NOT-PROMOTED", "PROMOTED-BY-DECISION"] as const;
export type PromotionState = (typeof PROMOTION_STATES)[number];

export const PII_STATUSES = [
  "NO-REAL-PII-ASSERTED",
  "UNINSPECTED",
  "REAL-PII-SUSPECTED",
  "REAL-PII-CONFIRMED",
] as const;
export type HistoricalPiiStatus = (typeof PII_STATUSES)[number];

export interface HistoricalSourceRecord {
  source_id: string;
  title: string;
  source_family: HistoricalSourceFamily;
  /** Repository path, absolute URL, or commit-bound reference. Never a description. */
  exact_locator: string;
  /** Commit SHA, content hash, declared version, or NOT-AVAILABLE. */
  version_or_hash: string;
  authority_classification: HistoricalAuthorityClassification;
  /** Why the classification is what it is, in plain language. */
  classification_basis: string;
  /** Decision or evidence identifiers supporting the classification. May be empty. */
  classification_evidence: string[];
  access_limitation: AccessLimitation;
  /** What specifically cannot be reached, or "None recorded." */
  access_note: string;
  immutability: ImmutabilityState;
  recovery_relevance: RecoveryRelevance;
  recovery_relevance_reason: string;
  promotion_state: PromotionState;
  pii_status: HistoricalPiiStatus;
  inventoried_on: string;
  /** What this record explicitly does not assert. */
  boundary: string;
}

/** Language that may never appear in a historical-source record. */
export const PROHIBITED_HISTORICAL_CLAIMS = [
  "compliant",
  "compliance verified",
  "certified",
  "conformant",
  "approved for release",
  "validated by",
  "production ready",
  "district approved",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function has<T extends readonly string[]>(list: T, value: string): boolean {
  return (list as readonly string[]).includes(value);
}

/**
 * Deterministic record validation. Returns a list of human-readable problems;
 * an empty list means the record satisfies the schema rules.
 */
export function validateHistoricalSource(record: HistoricalSourceRecord): string[] {
  const issues: string[] = [];
  const id = record.source_id || "(missing id)";

  if (!/^HS-\d{3}$/.test(record.source_id)) issues.push(`${id}: source_id must match HS-000.`);
  if (!record.title.trim()) issues.push(`${id}: title is required.`);
  if (!has(HISTORICAL_SOURCE_FAMILIES, record.source_family))
    issues.push(`${id}: unknown source_family ${record.source_family}.`);
  if (!record.exact_locator.trim()) issues.push(`${id}: exact_locator is required.`);
  if (!record.version_or_hash.trim()) issues.push(`${id}: version_or_hash is required.`);
  if (!has(AUTHORITY_CLASSIFICATIONS, record.authority_classification))
    issues.push(`${id}: unknown authority_classification.`);
  if (!record.classification_basis.trim()) issues.push(`${id}: classification_basis is required.`);
  if (!has(ACCESS_LIMITATIONS, record.access_limitation))
    issues.push(`${id}: unknown access_limitation.`);
  if (!record.access_note.trim()) issues.push(`${id}: access_note is required.`);
  if (!has(IMMUTABILITY_STATES, record.immutability)) issues.push(`${id}: unknown immutability.`);
  if (!has(RECOVERY_RELEVANCE, record.recovery_relevance))
    issues.push(`${id}: unknown recovery_relevance.`);
  if (!record.recovery_relevance_reason.trim())
    issues.push(`${id}: recovery_relevance_reason is required.`);
  if (!has(PROMOTION_STATES, record.promotion_state)) issues.push(`${id}: unknown promotion_state.`);
  if (!has(PII_STATUSES, record.pii_status)) issues.push(`${id}: unknown pii_status.`);
  if (!ISO_DATE.test(record.inventoried_on)) issues.push(`${id}: inventoried_on must be ISO date.`);
  if (!record.boundary.trim()) issues.push(`${id}: boundary is required.`);

  if (record.authority_classification !== "CURRENT-AUTHORITY" && record.promotion_state !== "NOT-PROMOTED")
    issues.push(`${id}: only a CURRENT-AUTHORITY source may carry a promoted state.`);

  if (record.version_or_hash === "NOT-AVAILABLE" && record.access_limitation === "FULL")
    issues.push(`${id}: a fully accessible source must carry a version or hash.`);

  if (
    record.access_limitation === "NOT-ACCESSIBLE-TO-EXECUTOR" &&
    record.recovery_relevance !== "UNKNOWN"
  )
    issues.push(`${id}: an unreachable source cannot carry a known recovery relevance.`);

  if (record.pii_status === "REAL-PII-CONFIRMED" || record.pii_status === "REAL-PII-SUSPECTED")
    issues.push(`${id}: real PII may not be inventoried under the current boundary.`);

  const haystack = [
    record.title,
    record.classification_basis,
    record.recovery_relevance_reason,
    record.access_note,
    record.boundary,
  ]
    .join(" ")
    .toLowerCase();
  for (const phrase of PROHIBITED_HISTORICAL_CLAIMS) {
    if (haystack.includes(phrase)) issues.push(`${id}: prohibited claim language "${phrase}".`);
  }

  return issues;
}

/** A source that must be read before requirement extraction can be considered complete. */
export function isRecoveryCritical(record: HistoricalSourceRecord): boolean {
  return record.recovery_relevance === "HIGH" && record.access_limitation !== "NOT-ACCESSIBLE-TO-EXECUTOR";
}
