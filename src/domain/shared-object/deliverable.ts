/**
 * Deliverable architecture.
 *
 * A deliverable type is the shape of an artifact that must exist. A deliverable
 * instance is the actual artifact produced for a specific purpose and version.
 * The type lives in `../deliverable-type.ts` and is not redefined here.
 *
 * The canonical artifact is stored once and referenced. Copying a file into a
 * role, project, or department context creates a second truth that drifts.
 */
import type { AuthorityClass } from "../authority";
import type { Provenance } from "./governance-metadata";
import type {
  ApprovalState,
  EvidenceState,
  PublicationState,
  ValidationState,
  WorkflowState,
} from "./states";

export interface ArtifactReference {
  artifactReferenceId: string;
  /** Where the single canonical copy lives. */
  canonicalLocator: string;
  format: string;
  /** Integrity marker, where one is available. */
  checksum: string | null;
  /** Whether this reference points at a copy rather than the canonical original. */
  isCopy: false;
  synthetic: boolean;
}

export interface DeliverableInstance {
  deliverableId: string;
  /** Required. An instance with no type has no acceptance criteria. */
  deliverableTypeId: string;
  purpose: string;
  title: string;
  accountableRoleId: string;
  responsibleContributors: string[];
  requiredReviewerRoleId: string | null;
  approverRoleId: string | null;
  /** What causes this deliverable to be required. */
  trigger: string;
  dueDate: string | null;
  cadence: string | null;
  linkedCapabilityIds: string[];
  linkedRequirementIds: string[];
  linkedDecisionIds: string[];
  requiredContents: string[];
  acceptanceCriteria: string[];
  /** Reference to the single canonical artifact. Never an inline copy. */
  artifactReferenceId: string | null;
  requiredEvidenceIds: string[];
  workflowState: WorkflowState;
  validationState: ValidationState;
  evidenceState: EvidenceState;
  approvalState: ApprovalState;
  publicationState: PublicationState;
  authorityState: AuthorityClass;
  currentVersion: string;
  supersedes: string[];
  supersededBy: string | null;
  /** Which public claims, if any, this deliverable is relevant to. */
  claimRelevance: string[];
  provenance: Provenance;
  synthetic: boolean;
}

export const DELIVERABLE_RULES: { id: string; rule: string }[] = [
  { id: "DEL-01", rule: "Every deliverable instance references exactly one deliverable type." },
  { id: "DEL-02", rule: "The canonical artifact is stored once and referenced everywhere else." },
  { id: "DEL-03", rule: "Producing a deliverable never changes any object's authority state." },
  { id: "DEL-04", rule: "An approval authorizes one version; the next version is unapproved." },
  {
    id: "DEL-05",
    rule: "Acceptance criteria are recorded before the work, not written to fit the result.",
  },
];
