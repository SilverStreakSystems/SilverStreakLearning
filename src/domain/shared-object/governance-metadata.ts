/**
 * Common governance metadata.
 *
 * Split deliberately into universal fields, which every consequential shared
 * object must carry, and conditional fields, which apply only when the object
 * family calls for them. Forcing every field onto every object produces empty
 * columns, and empty columns get filled with guesses.
 */
import type { AuthorityClass, RecordState } from "../authority";
import type { Canonicality, DataClassification } from "./identity";
import type {
  ApprovalState,
  EvidenceState,
  FreshnessState,
  ImplementationState,
  PublicationState,
  ValidationState,
  WorkflowState,
} from "./states";

/** Where a value came from, in enough detail to re-check it. */
export interface Provenance {
  /** How the value entered the system. */
  sourceType:
    | "operator-declaration"
    | "automated-check"
    | "document"
    | "external-source"
    | "derived-rule"
    | "synthetic-fixture";
  /** Where to look to verify it. A path, an identifier, or a plain description. */
  sourceLocator: string;
  recordedBy: string;
  recordedAt: string;
  /** What this provenance does not establish. */
  limitation: string;
}

/** Required on every consequential shared object. Locked by test. */
export interface UniversalGovernanceMetadata {
  objectId: string;
  humanKey: string;
  objectTypeId: string;
  title: string;
  description: string;
  canonicality: Canonicality;
  authorityState: AuthorityClass;
  recordState: RecordState;
  workflowState: WorkflowState;
  owner: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: string;
  provenance: Provenance;
  dataClassification: DataClassification;
  /** The only purposes for which this record may be used. */
  purposeRestriction: string[];
  synthetic: boolean;
}

/** Applied only where the object family calls for it. */
export interface ConditionalGovernanceMetadata {
  accountableCapabilityId?: string;
  accountableRoleId?: string;
  implementationState?: ImplementationState;
  validationState?: ValidationState;
  evidenceState?: EvidenceState;
  approvalState?: ApprovalState;
  publicationState?: PublicationState;
  freshnessState?: FreshnessState;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewTrigger?: string;
  supersedes?: string[];
  supersededBy?: string | null;
  archivedAt?: string | null;
  retentionRule?: string;
  /** Whether changes to this object must be written to an audit trail. */
  auditRequired?: boolean;
}

export type GovernanceMetadata = UniversalGovernanceMetadata & ConditionalGovernanceMetadata;

export const UNIVERSAL_METADATA_FIELDS: readonly (keyof UniversalGovernanceMetadata)[] = [
  "objectId",
  "humanKey",
  "objectTypeId",
  "title",
  "description",
  "canonicality",
  "authorityState",
  "recordState",
  "workflowState",
  "owner",
  "createdBy",
  "createdAt",
  "updatedBy",
  "updatedAt",
  "version",
  "provenance",
  "dataClassification",
  "purposeRestriction",
  "synthetic",
] as const;

export const CONDITIONAL_METADATA_FIELDS: readonly (keyof ConditionalGovernanceMetadata)[] = [
  "accountableCapabilityId",
  "accountableRoleId",
  "implementationState",
  "validationState",
  "evidenceState",
  "approvalState",
  "publicationState",
  "freshnessState",
  "effectiveFrom",
  "effectiveUntil",
  "reviewTrigger",
  "supersedes",
  "supersededBy",
  "archivedAt",
  "retentionRule",
  "auditRequired",
] as const;

/**
 * Correction and supersession rules. History is never rewritten: a wrong record
 * is superseded and stays visible, so anyone reading an old decision can still
 * see what was believed at the time.
 */
export const HISTORY_RULES: { id: string; rule: string; rationale: string }[] = [
  {
    id: "HIST-01",
    rule: "A published record is corrected by superseding it, never by editing it in place.",
    rationale: "Decisions made on the old value must remain explainable.",
  },
  {
    id: "HIST-02",
    rule: "A superseded record keeps its identifier and gains a pointer to its successor.",
    rationale: "Inbound references keep resolving instead of breaking silently.",
  },
  {
    id: "HIST-03",
    rule: "Deletion is reserved for records created in error, and is audited.",
    rationale: "Deletion destroys the record of the mistake along with the mistake.",
  },
  {
    id: "HIST-04",
    rule: "Archiving hides a record from default views without removing it.",
    rationale: "Volume is a display problem, not a reason to lose history.",
  },
  {
    id: "HIST-05",
    rule: "A relationship change never edits the objects at either end.",
    rationale: "Edges are their own records with their own history.",
  },
];
