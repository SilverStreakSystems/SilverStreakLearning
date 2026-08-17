/**
 * Refusal as successful governance.
 *
 * A refusal is a legitimate outcome, not an error state. Every refusal states
 * what was refused, why, under which rule, what would resolve it, and whether
 * review is available.
 */
import type { EnterpriseFunctionId } from "./functions";

export const REFUSAL_GROUNDS = [
  "insufficient-evidence",
  "stale-evidence",
  "unauthorized-actor",
  "missing-approval",
  "not-a-responsible-fit",
  "accessibility-stop",
  "security-stop",
  "privacy-stop",
  "invalid-claim",
  "ai-use-not-justified",
  "vendor-failed-review",
  "requirement-lacks-authority",
] as const;

export type RefusalGround = (typeof REFUSAL_GROUNDS)[number];

export const REFUSAL_GROUND_LABEL: Record<RefusalGround, string> = {
  "insufficient-evidence": "Insufficient evidence",
  "stale-evidence": "Evidence is stale",
  "unauthorized-actor": "Actor is not authorized",
  "missing-approval": "Required approval missing",
  "not-a-responsible-fit": "Not a responsible fit at this time",
  "accessibility-stop": "Accessibility stop",
  "security-stop": "Security stop",
  "privacy-stop": "Privacy stop",
  "invalid-claim": "Claim exceeds its evidence",
  "ai-use-not-justified": "AI use not justified",
  "vendor-failed-review": "Vendor failed review",
  "requirement-lacks-authority": "Requirement lacks authority",
};

export interface RefusalRecord {
  refusalId: string;
  valueStreamId: string;
  stageId: string;
  ground: RefusalGround;
  /** Exactly what was refused, in plain language. */
  refusedThing: string;
  reason: string;
  governingRule: string;
  refusedBy: EnterpriseFunctionId;
  /** What would have to change for the work to proceed. */
  resolutionPath: string;
  appealAvailable: boolean;
  appealRoute: string | null;
  escalation: string;
}

export interface EscalationPath {
  escalationId: string;
  trigger: string;
  fromFunction: EnterpriseFunctionId;
  toFunction: EnterpriseFunctionId;
  /** How long the trigger condition may persist before escalation is required. */
  timeBox: string;
  /** What the escalation may and may not change. */
  authorityOfEscalation: string;
}

export function refusalsMissingResolution(refusals: RefusalRecord[]): RefusalRecord[] {
  return refusals.filter((r) => r.resolutionPath.trim() === "");
}
