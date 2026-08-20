/**
 * Claim architecture.
 *
 * A claim is an externally consequential statement. The governing rule is
 * simple and absolute: no claim may exceed its evidence. The schema therefore
 * requires exact wording, the evidence behind it, the findings that limit it,
 * and the wording that is prohibited.
 */
import type { Provenance } from "./governance-metadata";
import type { ApprovalState, EvidenceState } from "./states";

export const CLAIM_CLASSES = [
  "capability-claim",
  "compliance-claim",
  "outcome-claim",
  "security-claim",
  "accessibility-claim",
  "availability-claim",
  "performance-claim",
  "readiness-claim",
] as const;

export type ClaimClass = (typeof CLAIM_CLASSES)[number];

export const CLAIM_CLASS_LABEL: Record<ClaimClass, string> = {
  "capability-claim": "Capability claim",
  "compliance-claim": "Compliance claim",
  "outcome-claim": "Outcome claim",
  "security-claim": "Security claim",
  "accessibility-claim": "Accessibility claim",
  "availability-claim": "Availability claim",
  "performance-claim": "Performance claim",
  "readiness-claim": "Readiness claim",
};

export const CLAIM_CHANNELS = [
  "internal-only",
  "sales-conversation",
  "procurement-response",
  "website",
  "documentation",
  "press",
] as const;

export type ClaimChannel = (typeof CLAIM_CHANNELS)[number];

export const CLAIM_CHANNEL_LABEL: Record<ClaimChannel, string> = {
  "internal-only": "Internal only",
  "sales-conversation": "Sales conversation",
  "procurement-response": "Procurement response",
  website: "Website",
  documentation: "Documentation",
  press: "Press",
};

export interface GovernedClaim {
  claimId: string;
  /** The exact words. Paraphrase is how claims drift. */
  exactWording: string;
  claimClass: ClaimClass;
  audience: string;
  channels: ClaimChannel[];
  supportingEvidenceIds: string[];
  evidenceState: EvidenceState;
  /** Findings that narrow or contradict the claim. */
  contradictingFindingIds: string[];
  limitations: string[];
  requiredDisclaimer: string | null;
  approverRoleId: string | null;
  approvalState: ApprovalState;
  effectiveFrom: string | null;
  reviewTrigger: string;
  expiresAt: string | null;
  /** Wording that must never be used for this subject. */
  prohibitedWording: string[];
  supersededWording: string[];
  provenance: Provenance;
  synthetic: boolean;
}

export interface ClaimViolation {
  claimId: string;
  kind: "approved-without-evidence" | "approved-with-contradiction" | "missing-evidence-state";
  detail: string;
}

export function validateClaims(claims: GovernedClaim[]): ClaimViolation[] {
  const violations: ClaimViolation[] = [];

  for (const claim of claims) {
    if (claim.approvalState === "approved" && claim.supportingEvidenceIds.length === 0) {
      violations.push({
        claimId: claim.claimId,
        kind: "approved-without-evidence",
        detail: "An approved claim with no evidence exceeds what is known.",
      });
    }

    if (claim.approvalState === "approved" && claim.contradictingFindingIds.length > 0) {
      violations.push({
        claimId: claim.claimId,
        kind: "approved-with-contradiction",
        detail: "A claim cannot be approved while a recorded finding contradicts it.",
      });
    }

    if (
      claim.evidenceState === "none" &&
      claim.approvalState !== "refused" &&
      claim.approvalState !== "not-required"
    ) {
      violations.push({
        claimId: claim.claimId,
        kind: "missing-evidence-state",
        detail: "A claim with no evidence may only be refused or marked not required.",
      });
    }
  }

  return violations;
}
