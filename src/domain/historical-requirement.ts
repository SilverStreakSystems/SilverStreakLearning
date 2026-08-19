/**
 * WP-007 cycle 2 — historical requirement candidate vocabulary.
 *
 * A historical requirement candidate records something a named historical
 * source SAYS. It does not record whether the statement is required now,
 * whether the build satisfies it, or whether anyone has accepted it. Those are
 * separate, later, owner-held decisions.
 *
 * Canonical DATA lives in `data/historical/historical-requirements.json`.
 * This module supplies the types and the deterministic checks that guard it.
 */

/** Broad subject area of the extracted statement. */
export const REQUIREMENT_FAMILIES = [
  "accessibility-interface",
  "governance-authority",
  "evidence-verification",
  "data-boundary",
  "claim-discipline",
  "architecture-structure",
  "operations-workflow",
] as const;
export type RequirementFamily = (typeof REQUIREMENT_FAMILIES)[number];

/**
 * Obligation strength AS WORDED in the source. `UNSTATED` means the source
 * asserts the item without grading it; the executor does not upgrade it.
 */
export const REQUIREMENT_MODALITIES = ["MUST", "SHOULD", "MAY", "PROHIBITION", "UNSTATED"] as const;
export type RequirementModality = (typeof REQUIREMENT_MODALITIES)[number];

/** How certain the extraction is that the wording was captured and read correctly. */
export const EXTRACTION_CONFIDENCES = ["HIGH", "MEDIUM", "LOW"] as const;
export type ExtractionConfidence = (typeof EXTRACTION_CONFIDENCES)[number];

/** What, if anything, is unclear about the statement as written. */
export const AMBIGUITY_KINDS = [
  "NONE",
  "TERMINOLOGY",
  "SCOPE",
  "VERIFIABILITY",
  "AUTHORITY-BOUNDARY",
] as const;
export type AmbiguityKind = (typeof AMBIGUITY_KINDS)[number];

/**
 * Disposition is frozen for this cycle. REQUIRED-NOW, REMEDIATION,
 * TARGET-STATE, UNNECESSARY and SUPERSEDED are owner dispositions and may not
 * be assigned by extraction.
 */
export const CANDIDATE_DISPOSITION = "CANDIDATE-PRE-DISPOSITION" as const;

/** Conformance is never asserted by extraction. */
export const CONFORMANCE_STATE = "NOT-ASSESSED" as const;

/** Authority inherited from the source; extraction never raises it. */
export const INHERITED_AUTHORITIES = [
  "CURRENT-AUTHORITY",
  "HISTORICAL-EVIDENCE",
  "RESEARCH-INPUT",
  "REFERENCE-ONLY",
] as const;
export type InheritedAuthority = (typeof INHERITED_AUTHORITIES)[number];

export interface HistoricalRequirementRecord {
  requirement_id: string;
  /** HS-000 identifier of the single source this cycle extracted from. */
  source_id: string;
  /** Exact in-source locator, e.g. a path with a line reference. */
  source_locator: string;
  /** Classification carried by the source, copied without upgrade. */
  inherited_authority: InheritedAuthority;
  inheritance_note: string;
  /** Verbatim text from the source. Never paraphrased in this field. */
  original_wording: string;
  /** Executor restatement, clearly separate from the original wording. */
  normalized_summary: string;
  requirement_family: RequirementFamily;
  modality: RequirementModality;
  extraction_confidence: ExtractionConfidence;
  extraction_confidence_reason: string;
  ambiguity: AmbiguityKind;
  ambiguity_note: string;
  disposition: typeof CANDIDATE_DISPOSITION;
  conformance_state: typeof CONFORMANCE_STATE;
  extracted_on: string;
  /** What this record explicitly does not assert. */
  boundary: string;
}

/** Language that may never appear in a requirement candidate record. */
export const PROHIBITED_REQUIREMENT_CLAIMS = [
  "compliant",
  "compliance verified",
  "certified",
  "conformant",
  "satisfied by",
  "approved for release",
  "production ready",
  "district approved",
  "required now",
] as const;

/** Owner dispositions that this cycle may not assign. */
export const RESERVED_OWNER_DISPOSITIONS = [
  "REQUIRED-NOW",
  "REMEDIATION",
  "TARGET-STATE",
  "UNNECESSARY",
  "SUPERSEDED",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function has<T extends readonly string[]>(list: T, value: string): boolean {
  return (list as readonly string[]).includes(value);
}

/**
 * Deterministic record validation. Returns human-readable problems; an empty
 * list means the record satisfies the schema rules.
 */
export function validateHistoricalRequirement(record: HistoricalRequirementRecord): string[] {
  const issues: string[] = [];
  const id = record.requirement_id || "(missing id)";

  if (!/^HREQ-\d{3}$/.test(record.requirement_id))
    issues.push(`${id}: requirement_id must match HREQ-000.`);
  if (!/^HS-\d{3}$/.test(record.source_id)) issues.push(`${id}: source_id must match HS-000.`);
  if (!record.source_locator.trim()) issues.push(`${id}: source_locator is required.`);
  if (!has(INHERITED_AUTHORITIES, record.inherited_authority))
    issues.push(`${id}: unknown inherited_authority.`);
  if (!record.inheritance_note.trim()) issues.push(`${id}: inheritance_note is required.`);
  if (!record.original_wording.trim()) issues.push(`${id}: original_wording is required.`);
  if (!record.normalized_summary.trim()) issues.push(`${id}: normalized_summary is required.`);
  if (record.normalized_summary.trim() === record.original_wording.trim())
    issues.push(`${id}: normalized_summary must be distinct from original_wording.`);
  if (!has(REQUIREMENT_FAMILIES, record.requirement_family))
    issues.push(`${id}: unknown requirement_family.`);
  if (!has(REQUIREMENT_MODALITIES, record.modality)) issues.push(`${id}: unknown modality.`);
  if (!has(EXTRACTION_CONFIDENCES, record.extraction_confidence))
    issues.push(`${id}: unknown extraction_confidence.`);
  if (!record.extraction_confidence_reason.trim())
    issues.push(`${id}: extraction_confidence_reason is required.`);
  if (!has(AMBIGUITY_KINDS, record.ambiguity)) issues.push(`${id}: unknown ambiguity.`);
  if (!record.ambiguity_note.trim()) issues.push(`${id}: ambiguity_note is required.`);
  if (record.disposition !== CANDIDATE_DISPOSITION)
    issues.push(`${id}: disposition is frozen at ${CANDIDATE_DISPOSITION} for this cycle.`);
  if (record.conformance_state !== CONFORMANCE_STATE)
    issues.push(`${id}: conformance_state may only be ${CONFORMANCE_STATE}.`);
  if (!ISO_DATE.test(record.extracted_on)) issues.push(`${id}: extracted_on must be ISO date.`);
  if (!record.boundary.trim()) issues.push(`${id}: boundary is required.`);

  if (record.ambiguity === "NONE" && !/none/i.test(record.ambiguity_note))
    issues.push(`${id}: an unambiguous record must say so in its ambiguity note.`);

  const haystack = [
    record.normalized_summary,
    record.inheritance_note,
    record.extraction_confidence_reason,
    record.ambiguity_note,
    record.boundary,
  ]
    .join(" ")
    .toLowerCase();
  for (const phrase of PROHIBITED_REQUIREMENT_CLAIMS) {
    if (haystack.includes(phrase)) issues.push(`${id}: prohibited claim language "${phrase}".`);
  }

  return issues;
}
