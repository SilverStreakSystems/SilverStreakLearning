/**
 * Identity, acting capacity, role reference, and authorization are four
 * different things. Conflating them is how systems accidentally grant access
 * to whoever happens to be logged in.
 */

export const CAPACITY_STATUSES = ["active", "simulated-preview", "not-staffed"] as const;
export type CapacityStatus = (typeof CAPACITY_STATUSES)[number];

export const CAPACITY_STATUS_LABEL: Record<CapacityStatus, string> = {
  active: "Active capacity",
  "simulated-preview": "Simulated target-state preview",
  "not-staffed": "Defined, not staffed",
};

export const SIMULATED_CAPACITY_NOTICE =
  "Simulated target-state experience preview. Not a current SSLS user and not a staffed role.";

export interface IdentityReference {
  /** A synthetic operator handle. Never a legal name, never contact details. */
  identityId: string;
  displayLabel: string;
  /** Why the workspace holds this identity at all. */
  purpose: string;
}

export interface ActingCapacity {
  capacityId: string;
  name: string;
  status: CapacityStatus;
  /** Why this capacity exists as a distinct way of acting. */
  rationale: string;
  roleReference: string;
  supportedCapabilities: string[];
  decisionRights: string[];
  visibleWorkScope: string[];
  accessibleObjectScope: string[];
  /** Actions this capacity may never take without another authority. */
  requiresOtherAuthority: string[];
  effectiveFrom: string;
  effectiveUntil: string | null;
  expiryTrigger: string;
  policyBasis: string;
}

export function isSimulatedCapacity(capacity: ActingCapacity): boolean {
  return capacity.status !== "active";
}

/**
 * Membership contract.
 *
 * Membership places a capacity inside a workspace. It never authorizes the
 * records that happen to be visible somewhere within that workspace.
 */
export interface WorkspaceMembership {
  membershipId: string;
  workspaceId: string;
  identityId: string;
  capacityId: string;
  relationship: string;
  purpose: string;
  grantedCapabilities: string[];
  /** The bounded object scope. Never "everything in the workspace". */
  objectScope: string[];
  effectiveFrom: string;
  effectiveUntil: string | null;
  policyBasis: string;
  /** Stated on the record so the rule travels with the data. */
  authorizesAllWorkspaceRecords: false;
}

export const MEMBERSHIP_RULES = [
  "Membership places an acting capacity inside a workspace for a stated purpose.",
  "Membership never authorizes a record. Each record is authorized separately.",
  "A record visible to one member is not therefore visible to every member.",
  "Membership expires. An expired membership authorizes nothing.",
] as const;
