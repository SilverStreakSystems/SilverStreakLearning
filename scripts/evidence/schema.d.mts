import type {
  ApplicabilityState,
  EvidenceRecord,
  EvidenceStatus,
  EvidenceType,
  ValidationError,
} from "./types.mjs";

export const EVIDENCE_SCHEMA_VERSION: string;
export const EVIDENCE_METHODS: readonly string[];
export const PRODUCER_TYPES: readonly string[];
export const EVIDENCE_TYPES: readonly EvidenceType[];
export const EVIDENCE_STATUSES: readonly EvidenceStatus[];
export const ENVIRONMENTS: readonly string[];
export const APPLICABILITY_STATES: readonly ApplicabilityState[];

export function validateEvidenceRecord(record: unknown): {
  valid: boolean;
  errors: ValidationError[];
};
export function createEvidenceRecord(fields: Record<string, unknown>): EvidenceRecord;
