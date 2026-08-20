/**
 * Universal Context Assembly — RESEARCH / CANDIDATE ARCHITECTURE.
 *
 * This contract is implemented as a logical model only. It is not promoted to
 * approved policy, and no runtime assembles anything.
 *
 * A context package is a purpose-bound projection. It never owns a fact, never
 * becomes a source of truth, and never carries the authority of the objects it
 * draws from. It exists so that a human is shown the minimum information that
 * their purpose justifies, with provenance intact and gaps stated.
 *
 * Explicitly: this architecture is not permission to send anything to a model.
 */
import type { AuthorityClass } from "../authority";
import type { DataClassification } from "./identity";

/** The ordered assembly steps. Skipping a step is a governance failure. */
export const CONTEXT_ASSEMBLY_STEPS = [
  "purpose",
  "authorized-participant",
  "acting-capacity",
  "relationship",
  "applicable-policy",
  "canonical-sources",
  "minimum-authorized-projection",
  "freshness-missing-conflict-checks",
  "context-package",
] as const;

export type ContextAssemblyStep = (typeof CONTEXT_ASSEMBLY_STEPS)[number];

export const CONTEXT_ASSEMBLY_STEP_META: Record<
  ContextAssemblyStep,
  { id: ContextAssemblyStep; label: string; question: string; failureIfSkipped: string }
> = {
  purpose: {
    id: "purpose",
    label: "Purpose",
    question: "Why is this being assembled at all?",
    failureIfSkipped:
      "Without a purpose, every later step defaults to whatever is technically reachable.",
  },
  "authorized-participant": {
    id: "authorized-participant",
    label: "Authorized participant",
    question: "Who is asking, and are they permitted to ask?",
    failureIfSkipped: "Information is assembled for an unidentified reader.",
  },
  "acting-capacity": {
    id: "acting-capacity",
    label: "Acting capacity",
    question: "In what role are they acting right now?",
    failureIfSkipped: "A person's widest role silently governs every request they make.",
  },
  relationship: {
    id: "relationship",
    label: "Relationship",
    question: "What connects this person to the subject?",
    failureIfSkipped:
      "Role alone becomes access, which is the failure this model exists to prevent.",
  },
  "applicable-policy": {
    id: "applicable-policy",
    label: "Applicable policy",
    question: "Which rule permits or limits this?",
    failureIfSkipped: "The assembly cannot explain itself when challenged.",
  },
  "canonical-sources": {
    id: "canonical-sources",
    label: "Canonical sources",
    question: "Which objects actually own these facts?",
    failureIfSkipped: "The package quotes a copy and inherits the copy's drift.",
  },
  "minimum-authorized-projection": {
    id: "minimum-authorized-projection",
    label: "Minimum authorized projection",
    question: "What is the least that serves the purpose?",
    failureIfSkipped: "Everything accessible gets included, which is surveillance by default.",
  },
  "freshness-missing-conflict-checks": {
    id: "freshness-missing-conflict-checks",
    label: "Freshness, missing, and conflict checks",
    question: "What is stale, absent, or contradictory?",
    failureIfSkipped: "Gaps read as absence of concern rather than absence of knowledge.",
  },
  "context-package": {
    id: "context-package",
    label: "Context package",
    question: "What is handed over, and under what restrictions?",
    failureIfSkipped:
      "The result becomes an untracked document with no expiry and no audience limit.",
  },
};

export const CONTEXT_PACKAGE_STATUSES = [
  "current",
  "stale",
  "incomplete",
  "conflicted",
  "refused",
  "expired",
] as const;

export type ContextPackageStatus = (typeof CONTEXT_PACKAGE_STATUSES)[number];

export const CONTEXT_PACKAGE_STATUS_META: Record<
  ContextPackageStatus,
  { id: ContextPackageStatus; label: string; marker: string; meaning: string }
> = {
  current: {
    id: "current",
    label: "Current",
    marker: "[CTX OK]",
    meaning: "Assembled, complete for its purpose, and within its freshness window.",
  },
  stale: {
    id: "stale",
    label: "Stale",
    marker: "[CTX STALE]",
    meaning: "A source has changed since assembly. Re-assemble before relying on it.",
  },
  incomplete: {
    id: "incomplete",
    label: "Incomplete",
    marker: "[CTX GAP]",
    meaning: "Required information was unavailable. The gaps are named.",
  },
  conflicted: {
    id: "conflicted",
    label: "Conflicted",
    marker: "[CTX CONFLICT]",
    meaning: "Sources disagree. The disagreement is shown, not resolved silently.",
  },
  refused: {
    id: "refused",
    label: "Refused",
    marker: "[CTX REFUSED]",
    meaning: "Assembly was declined because the purpose did not justify the request.",
  },
  expired: {
    id: "expired",
    label: "Expired",
    marker: "[CTX EXPIRED]",
    meaning: "Past its expiry. Must not be used for any decision.",
  },
};

/** What was drawn from one canonical source, and under what authority. */
export interface ContextSourceProjection {
  sourceObjectId: string;
  sourceObjectTypeId: string;
  /** Fields included. Named individually, never "all". */
  includedFields: string[];
  /** Sensitive fields deliberately withheld, and why. */
  excludedSensitiveFields: { field: string; reason: string }[];
  /** The source's own authority. Never transferred to the package. */
  sourceAuthority: AuthorityClass;
  sourceVersion: string;
  sourceUpdatedAt: string;
}

export interface ContextPackage {
  contextPackageId: string;
  purpose: string;
  requestingActorId: string;
  actingCapacityId: string;
  relationshipBasis: string;
  policyBasis: string[];
  sourceProjections: ContextSourceProjection[];
  /** Information the purpose required that could not be found. */
  missingInformation: string[];
  /** Disagreements between sources, stated rather than resolved. */
  conflicts: string[];
  /** What remains uncertain even with everything included. */
  uncertainty: string[];
  freshnessCheckedAt: string;
  generatedAt: string;
  expiresAt: string | null;
  allowedAudience: string[];
  /** Purposes this package may not be reused for. */
  reuseRestrictions: string[];
  maxDataClassification: DataClassification;
  reviewRequirement: string;
  status: ContextPackageStatus;
  /** Locked false. A package is never a source of truth. */
  isSourceOfTruth: false;
  synthetic: boolean;
}

/** A reusable, reviewable definition of what a projection may contain. */
export interface ContextProjectionDefinition {
  projectionDefinitionId: string;
  name: string;
  purpose: string;
  sourceObjectTypeId: string;
  allowedFields: string[];
  forbiddenFields: string[];
  requiredRelationshipBasis: string;
  requiredPolicyBasis: string[];
  maxDataClassification: DataClassification;
  defaultExpiryRule: string;
  reviewTrigger: string;
  authorityState: AuthorityClass;
  synthetic: boolean;
}

export const CONTEXT_PACKAGE_RULES: { id: string; rule: string }[] = [
  { id: "CTX-01", rule: "A context package is never a source of truth and never owns a record." },
  { id: "CTX-02", rule: "A package is bound to one purpose and one audience." },
  {
    id: "CTX-03",
    rule: "Information is excluded unless the purpose requires it, not included because it is reachable.",
  },
  { id: "CTX-04", rule: "Provenance travels with every included field." },
  { id: "CTX-05", rule: "Missing and conflicting information is named, never left blank." },
  { id: "CTX-06", rule: "A package may expire, and an expired package may not inform a decision." },
  { id: "CTX-07", rule: "Reuse for a different purpose requires a new assembly." },
  { id: "CTX-08", rule: "Assembly is deterministic. No model is involved at any step." },
];
