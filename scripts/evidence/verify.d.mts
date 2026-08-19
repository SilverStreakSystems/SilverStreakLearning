import type { EvidenceRecord, InputSetMap } from "./types.mjs";

export interface VerifyInput {
  records: Partial<EvidenceRecord>[];
  baseline: { input_set_digest?: string; commit_sha?: string } | null;
  inputSets: InputSetMap;
  commit: string;
  environment: string;
  openFindings?: string[];
  at?: string;
}

export interface VerifyResult {
  ok: boolean;
  problems: string[];
  notes: string[];
}

export function verifyEvidenceSet(input: VerifyInput): VerifyResult;
