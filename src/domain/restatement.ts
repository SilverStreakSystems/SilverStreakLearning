/**
 * WP-007 cycle 4 — cross-source restatement vocabulary.
 *
 * A restatement row records how one candidate wording READS against a candidate
 * wording carried by a different historical source. It never merges the two
 * records, never elects one as controlling, and never assigns a disposition or
 * a conformance state. Those remain owner-held decisions.
 *
 * Canonical DATA lives in `data/historical/restatement-index.json`.
 */

/** How the subject wording reads against the related wording. */
export const RESTATEMENT_RELATIONSHIPS = [
  "RESTATES",
  "NARROWS",
  "BROADENS",
  "CONFLICTS",
  "NEW",
] as const;
export type RestatementRelationship = (typeof RESTATEMENT_RELATIONSHIPS)[number];

export interface RestatementRelation {
  relation_id: string;
  subject_requirement: string;
  subject_source: string;
  /** Null only when the relationship is NEW: no counterpart was found. */
  related_requirement: string | null;
  related_source: string | null;
  relationship: RestatementRelationship;
  basis: string;
  boundary: string;
}

export interface UnmatchedRelatedCandidate {
  requirement_id: string;
  source_id: string;
  note: string;
}

/** Language a restatement row may never carry. */
export const PROHIBITED_RESTATEMENT_CLAIMS = [
  "supersedes",
  "superseded",
  "merged",
  "deduplicated",
  "controlling wording",
  "resolved",
  "satisfied",
  "conformant",
] as const;

function has<T extends readonly string[]>(list: T, value: string): boolean {
  return (list as readonly string[]).includes(value);
}

/**
 * Deterministic row validation. Returns human-readable problems; an empty list
 * means the row satisfies the schema rules.
 */
export function validateRestatementRelation(
  relation: RestatementRelation,
  knownRequirementIds: readonly string[],
): string[] {
  const issues: string[] = [];
  const id = relation.relation_id || "(missing id)";

  if (!/^RST-\d{3}$/.test(relation.relation_id)) issues.push(`${id}: relation_id must match RST-000.`);
  if (!/^HREQ-\d{3}$/.test(relation.subject_requirement))
    issues.push(`${id}: subject_requirement must match HREQ-000.`);
  if (!/^HS-\d{3}$/.test(relation.subject_source))
    issues.push(`${id}: subject_source must match HS-000.`);
  if (!knownRequirementIds.includes(relation.subject_requirement))
    issues.push(`${id}: subject_requirement ${relation.subject_requirement} is not a known candidate.`);
  if (!has(RESTATEMENT_RELATIONSHIPS, relation.relationship))
    issues.push(`${id}: unknown relationship.`);
  if (!relation.basis.trim()) issues.push(`${id}: basis is required.`);
  if (!relation.boundary.trim()) issues.push(`${id}: boundary is required.`);

  if (relation.relationship === "NEW") {
    if (relation.related_requirement !== null || relation.related_source !== null)
      issues.push(`${id}: a NEW row names no counterpart requirement or source.`);
  } else {
    if (!relation.related_requirement || !relation.related_source)
      issues.push(`${id}: a ${relation.relationship} row must name a counterpart requirement and source.`);
    if (relation.related_requirement && !knownRequirementIds.includes(relation.related_requirement))
      issues.push(
        `${id}: related_requirement ${relation.related_requirement} is not a known candidate.`,
      );
    if (relation.related_requirement === relation.subject_requirement)
      issues.push(`${id}: a candidate may not be related to itself.`);
    if (relation.related_source === relation.subject_source)
      issues.push(`${id}: a restatement row relates candidates from two different sources.`);
  }

  return issues;
}
