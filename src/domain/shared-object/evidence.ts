/**
 * Evidence architecture.
 *
 * Evidence is first-class and version-bound. A passing result for one
 * implementation version is not a passing result for the next one, and the
 * schema makes that impossible to forget: version and environment are required
 * wherever the evidence type depends on them.
 *
 * The lighter shell-level `EvidenceRecord` in `../registers.ts` is retained for
 * the existing Evidence Register. This contract is the fuller shared-object
 * form that future capabilities will use.
 */
import type { Provenance } from "./governance-metadata";
import type { EvidenceState } from "./states";

export const SHARED_EVIDENCE_TYPES = [
  "automated-test",
  "manual-check",
  "assistive-technology-review",
  "document-review",
  "code-inspection",
  "external-assessment",
  "operator-attestation",
  "measurement",
] as const;

export type SharedEvidenceType = (typeof SHARED_EVIDENCE_TYPES)[number];

export const SHARED_EVIDENCE_TYPE_LABEL: Record<SharedEvidenceType, string> = {
  "automated-test": "Automated test",
  "manual-check": "Manual check",
  "assistive-technology-review": "Assistive technology review",
  "document-review": "Document review",
  "code-inspection": "Code inspection",
  "external-assessment": "External assessment",
  "operator-attestation": "Operator attestation",
  measurement: "Measurement",
};

/** Whether the evidence type is meaningless without a version and environment. */
export const VERSION_BOUND_EVIDENCE_TYPES: readonly SharedEvidenceType[] = [
  "automated-test",
  "manual-check",
  "assistive-technology-review",
  "code-inspection",
  "measurement",
];

export const EVIDENCE_CONFIDENCE = ["confirmed", "supported-interpretation", "unverified"] as const;
export type EvidenceConfidence = (typeof EVIDENCE_CONFIDENCE)[number];

export const EVIDENCE_CONFIDENCE_META: Record<
  EvidenceConfidence,
  { id: EvidenceConfidence; label: string; marker: string; meaning: string }
> = {
  confirmed: {
    id: "confirmed",
    label: "Confirmed",
    marker: "[C]",
    meaning: "Directly observed and recorded. Someone could repeat it.",
  },
  "supported-interpretation": {
    id: "supported-interpretation",
    label: "Supported interpretation",
    marker: "[I]",
    meaning: "A reasonable reading of the observations. Not itself an observation.",
  },
  unverified: {
    id: "unverified",
    label: "Unknown or unverified",
    marker: "[U]",
    meaning: "Stated without support. Recorded honestly rather than dropped.",
  },
};

export interface SharedEvidenceRecord {
  evidenceId: string;
  evidenceType: SharedEvidenceType;
  /** The specific statement this evidence is offered in support of. */
  propositionSupported: string;
  sourceId: string;
  collectedAt: string | null;
  /** Version of the thing examined. Required for version-bound types. */
  subjectVersion: string | null;
  environment: string | null;
  scenario: string;
  method: string;
  expectedResult: string;
  actualResult: string | null;
  executedBy: string;
  reviewedBy: string | null;
  rawOutputLocator: string | null;
  checksum: string | null;
  confidence: EvidenceConfidence;
  /** What this evidence explicitly cannot show. */
  limitations: string[];
  /** Whether the result may be reused for a different subject version. */
  reusableAcrossVersions: false;
  reviewTrigger: string;
  expiresAt: string | null;
  relatedValidationIds: string[];
  relatedFindingIds: string[];
  relatedClaimIds: string[];
  retentionRule: string;
  state: EvidenceState;
  provenance: Provenance;
  synthetic: boolean;
}

export interface EvidenceViolation {
  evidenceId: string;
  kind: "missing-version-binding" | "missing-environment" | "result-without-execution";
  detail: string;
}

export function validateEvidence(records: SharedEvidenceRecord[]): EvidenceViolation[] {
  const violations: EvidenceViolation[] = [];

  for (const record of records) {
    const versionBound = VERSION_BOUND_EVIDENCE_TYPES.includes(record.evidenceType);

    if (versionBound && !record.subjectVersion) {
      violations.push({
        evidenceId: record.evidenceId,
        kind: "missing-version-binding",
        detail: "This evidence type is meaningless without the version it examined.",
      });
    }

    if (versionBound && !record.environment) {
      violations.push({
        evidenceId: record.evidenceId,
        kind: "missing-environment",
        detail: "A result without an environment cannot be reproduced or transferred.",
      });
    }

    if (record.actualResult !== null && record.collectedAt === null) {
      violations.push({
        evidenceId: record.evidenceId,
        kind: "result-without-execution",
        detail: "A recorded result must state when the check was executed.",
      });
    }
  }

  return violations;
}
