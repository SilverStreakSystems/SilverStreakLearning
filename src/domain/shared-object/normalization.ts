/**
 * Normalization findings for objects and relationships.
 *
 * Normalization is a judgment pass, not a mechanical one. Each finding records
 * what was considered, what was decided, and what the decision costs, so the
 * judgment can be reversed later by someone who was not present for it.
 */
import type { NormalizationDisposition, SharedObjectTypeId } from "./object-types";
import type { RelationshipKind } from "./relationships";

export const OBJECT_NORMALIZATION_ISSUES = [
  "duplicate-object",
  "overlapping-object",
  "over-generalized-object",
  "should-be-relationship",
  "should-be-object",
  "state-duplication",
  "authority-duplication",
  "ambiguous-terminology",
  "unnecessary-abstraction",
  "not-currently-needed",
  "belongs-in-bounded-context",
] as const;

export type ObjectNormalizationIssue = (typeof OBJECT_NORMALIZATION_ISSUES)[number];

export const OBJECT_NORMALIZATION_ISSUE_LABEL: Record<ObjectNormalizationIssue, string> = {
  "duplicate-object": "Duplicate object",
  "overlapping-object": "Overlapping object",
  "over-generalized-object": "Over-generalized object",
  "should-be-relationship": "Should be a relationship",
  "should-be-object": "Should be an object",
  "state-duplication": "Duplicated state vocabulary",
  "authority-duplication": "Duplicated authority vocabulary",
  "ambiguous-terminology": "Ambiguous terminology",
  "unnecessary-abstraction": "Unnecessary abstraction",
  "not-currently-needed": "Not currently needed",
  "belongs-in-bounded-context": "Belongs in a bounded context",
};

export interface ObjectNormalizationFinding {
  findingId: string;
  issue: ObjectNormalizationIssue;
  /** The candidate name as it appeared in the source brief. */
  candidateName: string;
  /** Where it landed, if anywhere. */
  resolvedTypeId: SharedObjectTypeId | null;
  disposition: NormalizationDisposition;
  observation: string;
  judgment: string;
  /** What this decision gives up. Stated so it can be revisited. */
  costOfDecision: string;
  reversible: boolean;
}

export const RELATIONSHIP_NORMALIZATION_ISSUES = [
  "should-be-object",
  "duplicate-semantics",
  "ambiguous-verb",
  "missing-inverse",
  "cardinality-undefined",
  "history-loss-risk",
] as const;

export type RelationshipNormalizationIssue = (typeof RELATIONSHIP_NORMALIZATION_ISSUES)[number];

export const RELATIONSHIP_NORMALIZATION_ISSUE_LABEL: Record<
  RelationshipNormalizationIssue,
  string
> = {
  "should-be-object": "Should be a first-class object",
  "duplicate-semantics": "Duplicate semantics",
  "ambiguous-verb": "Ambiguous verb",
  "missing-inverse": "Missing inverse",
  "cardinality-undefined": "Cardinality undefined",
  "history-loss-risk": "History loss risk",
};

export interface RelationshipNormalizationFinding {
  findingId: string;
  issue: RelationshipNormalizationIssue;
  candidateVerb: string;
  resolvedKind: RelationshipKind | null;
  observation: string;
  judgment: string;
  costOfDecision: string;
  reversible: boolean;
}
