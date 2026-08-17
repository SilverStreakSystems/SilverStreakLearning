/**
 * The governed object type identifiers.
 *
 * This list is the outcome of the normalization pass, not a copy of the request
 * that prompted it. Several candidate objects were demoted to relationships and
 * several were deferred; see `docs/shared-object/OBJECT_NORMALIZATION_FINDINGS.md`.
 */
import type { Canonicality, DataClassification, Instantiability, ObjectFamily } from "./identity";
import type { StateAxis } from "./states";

export const SHARED_OBJECT_TYPE_IDS = [
  // Actors and organizations
  "person-reference",
  "organization",
  "organizational-unit",
  "acting-capacity",
  "role-reference",
  "enterprise-capability",
  // Governance
  "requirement",
  "decision",
  "policy-rule",
  "standard",
  "approval",
  "review",
  "risk",
  "finding",
  "claim",
  // Work and delivery
  "work-item",
  "deliverable-type",
  "deliverable-instance",
  "event",
  // Evidence and knowledge
  "evidence",
  "source",
  "research-record",
  "artifact-reference",
  "validation",
  "knowledge-object",
  // Context
  "context-package",
  "context-projection-definition",
  // Enterprise reference (reference only)
  "product-reference",
  "module-reference",
  "shared-service-reference",
  "enterprise-function-reference",
  "value-stream-reference",
  // Communication (gated)
  "communication-reference",
] as const;

export type SharedObjectTypeId = (typeof SHARED_OBJECT_TYPE_IDS)[number];

/** A candidate object that did not survive normalization, and why. */
export const NORMALIZATION_DISPOSITIONS = [
  "kept-first-class",
  "demoted-to-relationship",
  "demoted-to-field",
  "merged-into-other-type",
  "reference-only",
  "deferred",
  "rejected-abstraction",
  "kept-bounded",
] as const;

export type NormalizationDisposition = (typeof NORMALIZATION_DISPOSITIONS)[number];

export const NORMALIZATION_DISPOSITION_LABEL: Record<NormalizationDisposition, string> = {
  "kept-first-class": "Kept as a first-class object",
  "demoted-to-relationship": "Demoted to a typed relationship",
  "demoted-to-field": "Demoted to a field on another object",
  "merged-into-other-type": "Merged into another object type",
  "reference-only": "Kept as a reference object only",
  deferred: "Deferred to a later increment",
  "rejected-abstraction": "Rejected as an unnecessary abstraction",
  "kept-bounded": "Kept inside a bounded product domain, not shared",
};

/**
 * A catalog entry. This is the record the Object Registry renders and the tests
 * read; there is no second description of an object type anywhere else.
 */
export interface SharedObjectTypeRecord {
  typeId: SharedObjectTypeId;
  name: string;
  family: ObjectFamily;
  /** What this object is, in one sentence a non-specialist can read. */
  definition: string;
  /** Why it exists. If this cannot be answered, the type should not exist. */
  reasonForExistence: string;
  canonicality: Canonicality;
  instantiability: Instantiability;
  /** Who or what owns the record. A capability or a role, never a person here. */
  ownerCapabilityId: string;
  /** Capabilities that read or write it. */
  usedByCapabilityIds: string[];
  universalFieldsApply: boolean;
  conditionalFields: string[];
  stateAxes: StateAxis[];
  permittedDataClassifications: DataClassification[];
  purposeRestrictions: string[];
  versioningRule: string;
  auditRule: string;
  correctionRule: string;
  supersessionRule: string;
  archivalRule: string;
  /** What evidence would show that this type is modeled correctly. */
  validationExpectation: string;
  /** Future consumers. Recorded as future, never as current implementation. */
  futureConsumers: string[];
  /** Relationship kinds this type may participate in. */
  permittedRelationshipKinds: string[];
  prohibitedRelationships: string[];
  /** Answers the shared-vs-bounded domain boundary test. */
  sharedRationale: string;
  openQuestions: string[];
  synthetic: boolean;
}
