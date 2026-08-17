import type { AuthorityClass, RecordState, VerificationState } from "./authority";

/**
 * Candidate Enterprise Capability Registry record.
 * Every field below is declared by a human operator. Nothing here is inferred
 * from code, tests, or file layout.
 */
export interface CapabilityRecord {
  id: string;
  name: string;
  purpose: string;
  northStarContribution: string;
  humanBeneficiary: string;
  owningFunctionCandidate: string;
  accountableRoleCandidate: string;
  supportingFunctions: string[];
  /** Whether this capability must stay organizationally independent, and why. */
  independenceRequirement: string;
  requiredDeliverables: string[];
  evidenceExpectations: string[];
  maturityTrigger: string;
  staffingTrigger: string;
  consolidationEligibility: string;
  riskIfAbsent: string;

  currentAuthority: AuthorityClass;
  recordState: RecordState;
  implementationStatus: VerificationState;
  synthetic: boolean;
}
