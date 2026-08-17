/**
 * Commitment model.
 *
 * A commitment is a promised obligation with a named committing party, a named
 * receiving party, and a source authority. Casual discussion, intent, and
 * optimism are not commitments.
 */
import type { EnterpriseFunctionId } from "./functions";

export const COMMITMENT_STATUSES = [
  "proposed",
  "accepted",
  "at-risk",
  "fulfilled",
  "missed",
  "withdrawn",
  "superseded",
] as const;

export type CommitmentStatus = (typeof COMMITMENT_STATUSES)[number];

export interface Commitment {
  commitmentId: string;
  valueStreamId: string;
  stageId: string;
  committingParty: EnterpriseFunctionId;
  /** A function, or a synthetic external party label. Never a named person. */
  receivingParty: string;
  purpose: string;
  promisedOutcome: string;
  dueDate: string;
  /** The decision, contract, or approval that authorizes the promise. */
  sourceAuthority: string;
  relatedDeliverable: string | null;
  dependencyIds: string[];
  status: CommitmentStatus;
  evidence: string | null;
  escalation: string;
  fulfillment: string | null;
  supersededBy: string | null;
}

export const COMMITMENT_RULES = [
  "A commitment requires an identified committing party, receiving party, and source authority.",
  "A statement made in discussion is not a commitment until it is recorded and accepted.",
  "A commitment marked fulfilled requires evidence of the promised outcome, not a status change.",
  "A missed commitment stays on the record; it is superseded, never deleted.",
] as const;

export function commitmentsWithoutAuthority(commitments: Commitment[]): Commitment[] {
  return commitments.filter((c) => c.sourceAuthority.trim() === "");
}
