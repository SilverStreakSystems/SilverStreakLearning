import type { EvidenceType } from "./types.mjs";

export interface ExpiryPolicyEntry {
  days: number | null;
  rationale: string;
  invalidatedBy: string;
}

export const EXPIRY_POLICY: Record<EvidenceType, ExpiryPolicyEntry>;

export function computeExpiry(evidenceType: EvidenceType, timestampIso: string): string | null;
export function isExpired(record: { expires_at: string | null }, atIso?: string): boolean;
export function policyFor(evidenceType: EvidenceType): ExpiryPolicyEntry;
