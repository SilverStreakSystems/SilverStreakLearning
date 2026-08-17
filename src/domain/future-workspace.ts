import type { AuthorityClass } from "./authority";

/**
 * Target-state enterprise workspaces. These are displayed as gated candidates.
 * Nothing here is current implementation authority.
 */
export interface FutureWorkspace {
  id: string;
  name: string;
  intent: string;
  /** Candidate capabilities this workspace would eventually own. */
  candidateCapabilities: string[];
  /** What must be true before this workspace could be built. */
  promotionRequirement: string;
  authorityClass: Extract<AuthorityClass, "gated-future">;
  gateNotice: string;
}

export const FUTURE_GATE_NOTICE = "Target-state candidate. Not current implementation authority.";
