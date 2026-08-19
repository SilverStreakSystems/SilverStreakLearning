/**
 * Governed reference packages supplied by the owner from outside the repository.
 *
 * A governed package is a set of owner-supplied files that SUMMARIZE governed
 * state. It never becomes a register. The authority rule this module enforces is:
 *
 *   accepted owner decision
 *     -> canonical machine-readable register
 *       -> reproducible generated view / synchronized reference artifact
 *
 * Nothing here promotes a package, closes a finding, closes a work package,
 * changes a gate, or authorizes a successor package. Recency, inclusion,
 * successful hash verification, and passing tests are all independent of
 * authority and never upgrade it.
 */

/** What role a package plays relative to the canonical registers. */
export const PACKAGE_AUTHORITY_ROLES = [
  /** Mirrors canonical state for human reading. Not a register, not a decision. */
  "SYNCHRONIZED-REFERENCE",
  /** A prior package retained for lineage only. */
  "HISTORICAL-EVIDENCE",
] as const;
export type PackageAuthorityRole = (typeof PACKAGE_AUTHORITY_ROLES)[number];

/** Whether the artifact is part of the machine-readable source of truth. */
export const CANONICAL_STATUSES = ["CANONICAL", "NONCANONICAL"] as const;
export type CanonicalStatus = (typeof CANONICAL_STATUSES)[number];

/** How the artifact reached this program. */
export const ACQUISITION_METHODS = ["OWNER-SUPPLIED-INPUT", "REPOSITORY-GENERATED"] as const;
export type AcquisitionMethod = (typeof ACQUISITION_METHODS)[number];

/** Whether a byte-identical copy is held inside the repository. */
export const RETENTION_STATES = [
  "RETAINED-IN-REPOSITORY",
  "NOT-RETAINED-GOVERNED-EXTERNAL-LOCATOR",
  "NOT-SUPPLIED",
] as const;
export type RetentionState = (typeof RETENTION_STATES)[number];

/** Outcome of digest comparison against the package manifest. */
export const INTEGRITY_STATES = [
  "VERIFIED-MATCH",
  "NOT-APPLICABLE-SELF-HASH-EXCLUDED",
  "NOT-VERIFIABLE-FILE-NOT-SUPPLIED",
] as const;
export type IntegrityState = (typeof INTEGRITY_STATES)[number];

export interface GovernedPackageArtifact {
  artifact_id: string;
  filename: string;
  media_type: string;
  /** Byte size as measured on the supplied file, or null when not supplied. */
  byte_size: number | null;
  /** Lowercase hex SHA-256, or null when the manifest declares no digest. */
  sha256: string | null;
  /** Digest as printed in the supplied manifest, or null when absent. */
  declared_sha256: string | null;
  integrity_state: IntegrityState;
  acquisition_method: AcquisitionMethod;
  retention_state: RetentionState;
  /** Where the artifact can be found. Never fabricated for a file not retained. */
  locator: string;
  role: string;
  limitations: string[];
}

export interface GovernedPackageRecord {
  package_id: string;
  title: string;
  version: string;
  /** ISO date the package declares as its state date. */
  state_date: string;
  authority_role: PackageAuthorityRole;
  canonical_status: CanonicalStatus;
  /** How this package relates to the canonical application registers. */
  register_relationship: string;
  /** Preceding package identifier, or null. */
  predecessor_package: string | null;
  /** Exhaustive list of artifact ids the package is declared to contain. */
  declared_contents: string[];
  completeness_boundary: string;
  personal_data_state: "NO-PII" | "CONTAINS-PERSONAL-IDENTIFIER";
  release_state: "NOT-RELEASE-AUTHORIZED";
  evidence_references: string[];
  non_claims: string[];
  artifacts: GovernedPackageArtifact[];
}

/**
 * Statements no governed package record may ever make, in any field. Tested.
 */
export const PROHIBITED_PACKAGE_CLAIMS = [
  "supersedes the canonical registers",
  "closes a finding",
  "closes a work package",
  "authorizes wp-039",
  "advances gate a",
  "establishes conformance",
  "authorizes release",
  "independent validation",
] as const;

const HEX64 = /^[0-9a-f]{64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Deterministic invariants. Returns a list of violation strings; empty means
 * the record is internally consistent. This validates STRUCTURE and BOUNDARY
 * discipline only — it asserts nothing about the truth of the package text.
 */
export function validateGovernedPackage(record: GovernedPackageRecord): string[] {
  const problems: string[] = [];
  const where = record.package_id;

  if (!/^PKG-\d{3}$/.test(record.package_id)) problems.push(`${where}: malformed package id`);
  if (!ISO_DATE.test(record.state_date)) problems.push(`${where}: malformed state date`);
  if (record.canonical_status !== "NONCANONICAL")
    problems.push(`${where}: a supplied reference package may never be canonical`);
  if (record.completeness_boundary.trim().length < 40)
    problems.push(`${where}: completeness boundary must be stated explicitly`);
  if (record.non_claims.length === 0) problems.push(`${where}: non-claim boundary is required`);

  const ids = record.artifacts.map((artifact) => artifact.artifact_id);
  if (new Set(ids).size !== ids.length) problems.push(`${where}: duplicate artifact ids`);
  if ([...record.declared_contents].sort().join("|") !== [...ids].sort().join("|"))
    problems.push(`${where}: declared contents do not match the registered artifacts`);

  for (const artifact of record.artifacts) {
    const at = `${where}/${artifact.artifact_id}`;

    if (artifact.sha256 !== null && !HEX64.test(artifact.sha256))
      problems.push(`${at}: sha256 must be lowercase hex of length 64`);

    if (artifact.integrity_state === "VERIFIED-MATCH") {
      if (artifact.sha256 === null || artifact.declared_sha256 === null)
        problems.push(`${at}: verified match requires both a measured and a declared digest`);
      else if (artifact.sha256 !== artifact.declared_sha256)
        problems.push(`${at}: digests differ but the record claims a verified match`);
    }

    if (artifact.integrity_state === "NOT-APPLICABLE-SELF-HASH-EXCLUDED" && artifact.declared_sha256 !== null)
      problems.push(`${at}: self-hash exclusion cannot carry a declared digest`);

    if (artifact.retention_state === "NOT-SUPPLIED") {
      if (artifact.byte_size !== null || artifact.sha256 !== null)
        problems.push(`${at}: an unsupplied artifact may not carry measured properties`);
      if (artifact.integrity_state !== "NOT-VERIFIABLE-FILE-NOT-SUPPLIED")
        problems.push(`${at}: an unsupplied artifact cannot be integrity-verified`);
    }

    if (
      artifact.retention_state === "RETAINED-IN-REPOSITORY" &&
      !artifact.locator.startsWith("repository:")
    )
      problems.push(`${at}: retained artifacts must carry a repository locator`);

    if (
      artifact.retention_state === "NOT-RETAINED-GOVERNED-EXTERNAL-LOCATOR" &&
      artifact.locator.startsWith("repository:")
    )
      problems.push(`${at}: a repository locator may not be fabricated for a file not retained`);
  }

  const haystack = JSON.stringify(record).toLowerCase();
  for (const claim of PROHIBITED_PACKAGE_CLAIMS) {
    // The prohibited phrasing is allowed only inside an explicit refusal.
    const index = haystack.indexOf(claim);
    if (index === -1) continue;
    const window = haystack.slice(Math.max(0, index - 90), index);
    const refused = /(does not|never|no |not )\s*[^.]*$/.test(window);
    if (!refused) problems.push(`${where}: prohibited claim phrasing "${claim}" is not refused`);
  }

  return problems;
}

/** A package never carries implementation authority, regardless of role. */
export function packageCarriesImplementationAuthority(): false {
  return false;
}
