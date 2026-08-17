/**
 * Shared object identity.
 *
 * Every governed object carries a stable identifier that never changes and a
 * human-readable key that may change. Nothing in the system may use a title,
 * a file path, or a display label as an identifier.
 */

/** Families group object types. A family is descriptive, never authoritative. */
export const OBJECT_FAMILIES = [
  "actors-organizations",
  "governance",
  "work-delivery",
  "evidence-knowledge",
  "enterprise-reference",
  "communication",
  "context",
] as const;

export type ObjectFamily = (typeof OBJECT_FAMILIES)[number];

export const OBJECT_FAMILY_META: Record<
  ObjectFamily,
  { id: ObjectFamily; label: string; purpose: string }
> = {
  "actors-organizations": {
    id: "actors-organizations",
    label: "Actors and organizations",
    purpose: "Who acts, on whose behalf, and in what capacity.",
  },
  governance: {
    id: "governance",
    label: "Governance",
    purpose: "What is required, decided, approved, reviewed, and at risk.",
  },
  "work-delivery": {
    id: "work-delivery",
    label: "Work and delivery",
    purpose: "What is being done, what it produces, and when it happens.",
  },
  "evidence-knowledge": {
    id: "evidence-knowledge",
    label: "Evidence and knowledge",
    purpose: "What is actually known, from what source, and how strongly.",
  },
  "enterprise-reference": {
    id: "enterprise-reference",
    label: "Enterprise reference",
    purpose: "Named enterprise structures other objects may point at.",
  },
  communication: {
    id: "communication",
    label: "Communication",
    purpose: "What would be said, to whom, under what authorization.",
  },
  context: {
    id: "context",
    label: "Context",
    purpose: "Purpose-bound assemblies drawn from canonical sources.",
  },
};

/**
 * Canonicality. The single most important distinction in this architecture:
 * a canonical object owns its facts; a projection only reflects them.
 */
export const CANONICALITY = ["canonical", "derived", "projection", "reference"] as const;

export type Canonicality = (typeof CANONICALITY)[number];

export const CANONICALITY_META: Record<
  Canonicality,
  { id: Canonicality; label: string; marker: string; meaning: string }
> = {
  canonical: {
    id: "canonical",
    label: "Canonical",
    marker: "[CANON]",
    meaning: "Owns its facts. Corrections are made here and nowhere else.",
  },
  derived: {
    id: "derived",
    label: "Derived",
    marker: "[DERIVED]",
    meaning: "Calculated from canonical facts by a versioned rule. Never edited directly.",
  },
  projection: {
    id: "projection",
    label: "Projection",
    marker: "[PROJ]",
    meaning: "A purpose-bound view of canonical sources. Never a source of truth.",
  },
  reference: {
    id: "reference",
    label: "Reference",
    marker: "[REF]",
    meaning: "Names something that exists outside the current boundary. Not instantiable here.",
  },
};

/**
 * Instantiability under the currently authorized posture.
 * A type may be modeled and still be forbidden to instantiate.
 */
export const INSTANTIABILITY = ["instantiable", "synthetic-only", "reference-only", "gated"] as const;

export type Instantiability = (typeof INSTANTIABILITY)[number];

export const INSTANTIABILITY_META: Record<
  Instantiability,
  { id: Instantiability; label: string; marker: string; meaning: string }
> = {
  instantiable: {
    id: "instantiable",
    label: "Instantiable now",
    marker: "[INST]",
    meaning: "Records of this type may be created within the current boundary.",
  },
  "synthetic-only": {
    id: "synthetic-only",
    label: "Synthetic only",
    marker: "[SYN ONLY]",
    meaning: "Only invented examples may exist. Real records are not authorized.",
  },
  "reference-only": {
    id: "reference-only",
    label: "Reference only",
    marker: "[REF ONLY]",
    meaning: "The type is modeled so others can point at it. No records are created.",
  },
  gated: {
    id: "gated",
    label: "Gated",
    marker: "[GATED]",
    meaning: "Held behind a governance gate. Creating a record requires a decision first.",
  },
};

/** Data classification. Drives purpose limitation and retention, not display. */
export const DATA_CLASSIFICATIONS = [
  "public",
  "internal",
  "confidential",
  "restricted-personal",
  "restricted-special-category",
] as const;

export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];

export const DATA_CLASSIFICATION_LABEL: Record<DataClassification, string> = {
  public: "Public",
  internal: "Internal",
  confidential: "Confidential",
  "restricted-personal": "Restricted — personal",
  "restricted-special-category": "Restricted — special category",
};

export interface ObjectIdentity {
  /** Stable, opaque, never reused, never re-derived from content. */
  objectId: string;
  /** Human-readable key. May change; never used as a join key. */
  humanKey: string;
  objectTypeId: string;
}
