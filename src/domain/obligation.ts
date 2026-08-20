/**
 * WP-038 — Regulatory, Standards & Obligation Baseline.
 *
 * Canonical vocabularies and validation for the external-authority source
 * register and the obligation register. The canonical DATA lives in
 * `data/governance/external-authorities.json` and
 * `data/governance/obligations.json`; this module supplies the types and the
 * deterministic checks that guard them.
 *
 * Nothing here asserts compliance. An obligation record states what a source
 * requires, whether it applies to SSLS yet, and what SSLS actually has. Those
 * are four independent facts and are never collapsed into one.
 */

/** How much authority a source actually carries. Adoption never upgrades it. */
export const SOURCE_AUTHORITY_TYPES = [
  "statute",
  "regulation",
  "official-guidance",
  "standard",
  "voluntary-framework",
  "attestation-standard",
  "procurement-expectation",
  "market-expectation",
  "contractual",
  "internal-policy",
] as const;
export type SourceAuthorityType = (typeof SOURCE_AUTHORITY_TYPES)[number];

/** Authority types that can, on their own, legally require something. */
export const LEGALLY_BINDING_AUTHORITY_TYPES: readonly SourceAuthorityType[] = [
  "statute",
  "regulation",
];

/** Verification state of the source text itself, not of SSLS. */
export const SOURCE_STATUSES = [
  "VERIFIED-CURRENT",
  "VERIFIED-HISTORICAL",
  "SUPERSEDED",
  "UNVERIFIED",
  "CONFLICTED",
] as const;
export type SourceStatus = (typeof SOURCE_STATUSES)[number];

/** Legislative/regulatory lifecycle. Proposed is never effective. */
export const SOURCE_LIFECYCLES = [
  "EFFECTIVE",
  "ADOPTED-NOT-YET-EFFECTIVE",
  "PROPOSED-PENDING",
  "WITHDRAWN",
  "NOT-APPLICABLE",
  "UNKNOWN",
] as const;
export type SourceLifecycle = (typeof SOURCE_LIFECYCLES)[number];

export const JURISDICTIONS = [
  "US-FEDERAL",
  "US-MA",
  "US-STATE-OTHER",
  "US-LOCAL-DISTRICT",
  "INTERNATIONAL",
  "NOT-JURISDICTIONAL",
] as const;
export type Jurisdiction = (typeof JURISDICTIONS)[number];

export const APPLICABILITY_STATES = [
  "APPLIES-NOW",
  "APPLIES-AT-PILOT",
  "APPLIES-AT-LAUNCH",
  "CONDITIONAL",
  "REFERENCE",
  "NOT-APPLICABLE",
  "UNKNOWN",
] as const;
export type ObligationApplicability = (typeof APPLICABILITY_STATES)[number];

export const CONTROL_STATUSES = [
  "IMPLEMENTED",
  "PARTIAL",
  "SPECIFICATION-ONLY",
  "MISSING",
  "DEFERRED",
  "NOT-APPLICABLE",
  "UNKNOWN",
] as const;
export type ControlStatus = (typeof CONTROL_STATUSES)[number];

export const OBLIGATION_EVIDENCE_STATUSES = [
  "CURRENT",
  "STALE",
  "EXPIRED",
  "SUPERSEDED",
  "INAPPLICABLE",
  "UNKNOWN",
  "NOT-PRODUCED",
] as const;
export type ObligationEvidenceStatus = (typeof OBLIGATION_EVIDENCE_STATUSES)[number];

/** The smallest coherent SSLS control families. Terminology differences do not create new ones. */
export const CONTROL_FAMILIES = [
  "GOVERNANCE",
  "PRIVACY",
  "IDENTITY & ACCESS",
  "DATA MINIMIZATION",
  "RETENTION & DELETION",
  "ACCESSIBILITY",
  "SECURITY",
  "VULNERABILITY MANAGEMENT",
  "SOFTWARE SUPPLY CHAIN",
  "INCIDENT RESPONSE",
  "BUSINESS CONTINUITY",
  "VENDOR MANAGEMENT",
  "INTEROPERABILITY",
  "AI GOVERNANCE",
  "CLAIMS / TRANSPARENCY",
  "EDUCATIONAL VALIDITY",
  "HUMAN REVIEW",
] as const;
export type ControlFamily = (typeof CONTROL_FAMILIES)[number];

export const REVIEW_REQUIREMENTS = [
  "LEGAL REVIEW REQUIRED",
  "PRIVACY REVIEW REQUIRED",
  "SECURITY REVIEW REQUIRED",
  "ACCESSIBILITY REVIEW REQUIRED",
  "PROCUREMENT REVIEW REQUIRED",
  "EDUCATION POLICY REVIEW REQUIRED",
] as const;
export type ReviewRequirement = (typeof REVIEW_REQUIREMENTS)[number];

export const OBLIGATION_DOMAINS = [
  "student-privacy",
  "accessibility",
  "security",
  "supply-chain",
  "interoperability",
  "ai-governance",
  "records-retention",
  "procurement",
  "public-surface",
] as const;
export type ObligationDomain = (typeof OBLIGATION_DOMAINS)[number];

export interface ExternalAuthorityRecord {
  source_id: string;
  title: string;
  issuing_body: string;
  source_type: SourceAuthorityType;
  citation: string;
  source_url: string;
  source_version: string;
  source_effective_date: string;
  publication_date: string;
  verified_on: string;
  verification_method: string;
  jurisdiction: Jurisdiction;
  source_status: SourceStatus;
  lifecycle: SourceLifecycle;
  section_locators: string[];
  source_statement: string;
  reproduction_boundary: string;
  supersedes: string[];
  superseded_by: string | null;
  notes: string;
}

export interface ObligationRecord {
  obligation_id: string;
  domain: ObligationDomain;
  title: string;
  source_id: string;
  source_authority: string;
  source_type: SourceAuthorityType;
  citation: string;
  source_url: string;
  source_version: string;
  source_effective_date: string;
  verified_on: string;
  jurisdiction: Jurisdiction;
  applicability_state: ObligationApplicability;
  applicability_trigger: string;
  current_phase_applicability: string;
  future_phase_applicability: string;
  subject: string;
  obligation_summary: string;
  /** Strictly what the source says. Never interpretation. */
  source_statement_boundary: string;
  /** Strictly SSLS reading. Never presented as source text. */
  ssls_interpretation: string;
  required_control: string;
  current_control: string;
  control_family: ControlFamily;
  control_status: ControlStatus;
  mapped_work_package: string;
  evidence_requirement: string;
  minimum_evidence_method: string;
  evidence_status: ObligationEvidenceStatus;
  owner_candidate: string;
  claim_implication: string;
  prohibited_claim: string;
  review_requirement: ReviewRequirement | null;
  review_trigger: string;
  review_date: string;
  supersedes: string[];
  superseded_by: string | null;
  notes: string;
}

export interface ObligationConflictRecord {
  conflict_id: string;
  title: string;
  source_ids: string[];
  description: string;
  resolution_owner: string;
  resolution_route: string;
  state: "OPEN" | "ROUTED" | "RESOLVED";
}

export interface StaleReferenceRecord {
  stale_id: string;
  project_reference: string;
  located_in: string;
  verified_current: string;
  disposition: "CORRECT" | "NARROW" | "RECLASSIFY" | "REMOVE" | "VERIFIED";
  finding_id: string | null;
  notes: string;
}

export interface DataTriggerRecord {
  data_class: string;
  current_use: boolean;
  future_candidate_use: boolean;
  sensitivity: "standard" | "elevated" | "high";
  obligation_domains: ObligationDomain[];
  prerequisite_review: string;
  minimum_necessary: string;
  retention_question: string;
  disclosure_question: string;
}

export interface ObligationBaseline {
  schema_version: string;
  generated_at: string;
  authorities: ExternalAuthorityRecord[];
  obligations: ObligationRecord[];
  conflicts: ObligationConflictRecord[];
  stale_references: StaleReferenceRecord[];
  data_triggers: DataTriggerRecord[];
}

/** Claim wording that may never be produced from this register. */
export const PROHIBITED_OBLIGATION_CLAIMS: readonly string[] = [
  "FERPA compliant",
  "COPPA compliant",
  "WCAG compliant",
  "WCAG certified",
  "ADA compliant",
  "Section 508 compliant",
  "NIST certified",
  "DESE approved",
  "VPAT certified",
  "SOC 2 certified",
  "ISO 27001 certified",
  "Massachusetts compliant",
  "fully compliant",
  "legally cleared",
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface ValidationIssue {
  record_id: string;
  field: string;
  message: string;
}

export function validateAuthority(record: ExternalAuthorityRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fail = (field: string, message: string) =>
    issues.push({ record_id: record.source_id, field, message });

  if (!/^SRC-\d{3}$/.test(record.source_id)) fail("source_id", "must match SRC-000");
  if (!record.title.trim()) fail("title", "required");
  if (!record.issuing_body.trim()) fail("issuing_body", "required");
  if (!SOURCE_AUTHORITY_TYPES.includes(record.source_type))
    fail("source_type", "not a canonical authority type");
  if (!record.citation.trim()) fail("citation", "citation locator required");
  if (!/^https:\/\//.test(record.source_url)) fail("source_url", "official https URL required");
  if (!ISO_DATE.test(record.verified_on)) fail("verified_on", "ISO verification date required");
  if (!JURISDICTIONS.includes(record.jurisdiction)) fail("jurisdiction", "not canonical");
  if (!SOURCE_STATUSES.includes(record.source_status)) fail("source_status", "not canonical");
  if (!SOURCE_LIFECYCLES.includes(record.lifecycle)) fail("lifecycle", "not canonical");
  if (record.source_status === "VERIFIED-CURRENT") {
    if (!record.source_version.trim() || record.source_version === "UNKNOWN")
      fail("source_version", "VERIFIED-CURRENT requires a version identifier");
    if (!record.source_effective_date.trim())
      fail("source_effective_date", "VERIFIED-CURRENT requires an effective/version date");
    if (record.superseded_by)
      fail("superseded_by", "a superseded source cannot remain VERIFIED-CURRENT");
  }
  if (record.source_status === "SUPERSEDED" && !record.superseded_by)
    fail("superseded_by", "SUPERSEDED requires the superseding source");
  if (record.section_locators.length === 0) fail("section_locators", "at least one locator");
  if (!record.source_statement.trim()) fail("source_statement", "required");
  return issues;
}

export function validateObligation(
  record: ObligationRecord,
  authorityIds: ReadonlySet<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fail = (field: string, message: string) =>
    issues.push({ record_id: record.obligation_id, field, message });

  if (!/^OBL-\d{3}$/.test(record.obligation_id)) fail("obligation_id", "must match OBL-000");
  if (!OBLIGATION_DOMAINS.includes(record.domain)) fail("domain", "not canonical");
  if (!authorityIds.has(record.source_id)) fail("source_id", "no matching source register entry");
  if (!record.citation.trim()) fail("citation", "required");
  if (!ISO_DATE.test(record.verified_on)) fail("verified_on", "ISO verification date required");
  if (!APPLICABILITY_STATES.includes(record.applicability_state))
    fail("applicability_state", "not canonical");
  if (!CONTROL_STATUSES.includes(record.control_status)) fail("control_status", "not canonical");
  if (!OBLIGATION_EVIDENCE_STATUSES.includes(record.evidence_status))
    fail("evidence_status", "not canonical");
  if (!CONTROL_FAMILIES.includes(record.control_family)) fail("control_family", "not canonical");
  if (!record.applicability_trigger.trim()) fail("applicability_trigger", "required");
  if (!record.source_statement_boundary.trim()) fail("source_statement_boundary", "required");
  if (!record.ssls_interpretation.trim()) fail("ssls_interpretation", "required");
  if (record.review_requirement && !REVIEW_REQUIREMENTS.includes(record.review_requirement))
    fail("review_requirement", "not canonical");
  if (!record.review_trigger.trim()) fail("review_trigger", "required");
  if (!record.review_date.trim()) fail("review_date", "review date or rule required");

  // A voluntary or market source may never be phrased as a legal requirement.
  if (!LEGALLY_BINDING_AUTHORITY_TYPES.includes(record.source_type)) {
    if (
      /\blegally required\b|\brequired by law\b|\bmandated by law\b/i.test(
        record.obligation_summary,
      )
    )
      fail("obligation_summary", "non-binding source described as legal requirement");
  }
  // Proposed or pending authority may never carry a present-tense obligation.
  if (record.applicability_state === "APPLIES-NOW") {
    if (!record.mapped_work_package.trim())
      fail("mapped_work_package", "APPLIES-NOW requires an owning work package or decision");
    if (record.control_status === "UNKNOWN" && !record.notes.trim())
      fail("control_status", "APPLIES-NOW with UNKNOWN control requires a recorded gap note");
  }
  for (const phrase of PROHIBITED_OBLIGATION_CLAIMS) {
    if (record.claim_implication.toLowerCase().includes(phrase.toLowerCase()))
      fail("claim_implication", `prohibited claim wording: ${phrase}`);
  }
  return issues;
}

export function isGap(record: ObligationRecord): boolean {
  return (
    record.applicability_state !== "NOT-APPLICABLE" &&
    record.applicability_state !== "REFERENCE" &&
    (record.control_status === "MISSING" ||
      record.control_status === "PARTIAL" ||
      record.control_status === "SPECIFICATION-ONLY" ||
      record.control_status === "UNKNOWN")
  );
}

export function byApplicability(
  records: readonly ObligationRecord[],
  state: ObligationApplicability,
): ObligationRecord[] {
  return records.filter((record) => record.applicability_state === state);
}
