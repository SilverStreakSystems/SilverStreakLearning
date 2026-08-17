import type { AuthorityClass, RecordState, VerificationState } from "./authority";
import type { LayerId } from "./layer";

export type FindingSeverity = "governance" | "structural" | "advisory";

export const FINDING_SEVERITY_LABEL: Record<FindingSeverity, string> = {
  governance: "Governance",
  structural: "Structural",
  advisory: "Advisory",
};

export interface FindingRecord {
  id: string;
  title: string;
  severity: FindingSeverity;
  raisedOn: string;
  raisedBy: string;
  affectedLayers: LayerId[];
  description: string;
  /** What the finding does NOT assert, stated explicitly. */
  boundary: string;
  resolutionState: VerificationState;
  requiredDecision: string | null;
  evidenceReferences: string[];
  synthetic: boolean;
}

export type EvidenceKind =
  | "automated-test"
  | "manual-check"
  | "document-review"
  | "external-validation"
  | "operator-attestation";

export const EVIDENCE_KIND_LABEL: Record<EvidenceKind, string> = {
  "automated-test": "Automated Test",
  "manual-check": "Manual Check",
  "document-review": "Document Review",
  "external-validation": "External Validation",
  "operator-attestation": "Operator Attestation",
};

export interface EvidenceRecord {
  id: string;
  title: string;
  kind: EvidenceKind;
  subject: string;
  /** ISO date, or null when the check has never been executed. */
  collectedOn: string | null;
  collectedBy: string;
  state: VerificationState;
  /** What this evidence can support, in plain language. */
  supports: string;
  /** What this evidence explicitly cannot support. */
  doesNotSupport: string;
  authorityClass: AuthorityClass;
  synthetic: boolean;
}

export type DecisionState = "accepted" | "pending" | "required" | "declined" | "superseded";

export const DECISION_STATE_LABEL: Record<DecisionState, string> = {
  accepted: "Accepted",
  pending: "Pending",
  required: "Decision Required",
  declined: "Declined",
  superseded: "Superseded",
};

export interface DecisionRecord {
  id: string;
  title: string;
  state: DecisionState;
  decidedOn: string | null;
  decidedBy: string | null;
  context: string;
  decision: string;
  consequences: string[];
  authorityClass: AuthorityClass;
  recordState: RecordState;
  supersedes: string[];
  supersededBy: string | null;
  relatedArtifacts: string[];
  synthetic: boolean;
}

export type ClaimPosture = "supported" | "refused";

export interface ClaimRecord {
  id: string;
  claim: string;
  posture: ClaimPosture;
  state: VerificationState;
  reason: string;
}
