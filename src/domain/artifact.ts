import type {
  AuthorityClass,
  LifecycleStage,
  Maturity,
  RecordState,
  VerificationState,
} from "./authority";
import type { LayerId } from "./layer";

export type ArtifactType =
  | "doctrine"
  | "standard"
  | "architecture"
  | "decision-record"
  | "registry"
  | "specification"
  | "research-note"
  | "summary"
  | "implementation"
  | "validation-report";

export const ARTIFACT_TYPE_LABEL: Record<ArtifactType, string> = {
  doctrine: "Doctrine",
  standard: "Standard",
  architecture: "Architecture",
  "decision-record": "Decision Record",
  registry: "Registry",
  specification: "Specification",
  "research-note": "Research Note",
  summary: "Summary",
  implementation: "Implementation",
  "validation-report": "Validation Report",
};

/**
 * A record in the Integrated Foundation Registry.
 * One governed source of truth per object; views reference this record.
 */
export interface FoundationArtifact {
  id: string;
  title: string;
  artifactType: ArtifactType;
  version: string;
  /** ISO date (YYYY-MM-DD) the version was issued. */
  date: string;
  owner: string;

  authorityClass: AuthorityClass;
  maturity: Maturity;
  recordState: RecordState;
  lifecycleStage: LifecycleStage;

  /**
   * Declared implementation authority. Stored, never computed from build or
   * test state. Scope is required whenever authority is granted.
   */
  implementationAuthority: {
    granted: boolean;
    scope: string;
  };

  source: string;
  supersedes: string[];
  supersededBy: string | null;
  relatedArtifacts: string[];

  affectedLayers: LayerId[];
  affectedCapabilities: string[];

  knownConflicts: string[];
  unresolvedQuestions: string[];
  requiredReviews: string[];
  evidenceReferences: string[];
  promotionRequirements: string[];

  conflictStatus: VerificationState;
  evidenceBasis: VerificationState;

  /** True when the record itself is invented content used to exercise the UI. */
  synthetic: boolean;
  notes: string;
}
