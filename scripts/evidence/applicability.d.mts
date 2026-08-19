import type { ApplicabilityState, EvidenceRecord, InputSetMap } from "./types.mjs";

export interface ApplicabilityContext {
  inputSets: InputSetMap;
  commit?: string;
  environment?: string;
  at?: string;
  openFindings?: string[];
}

export interface ApplicabilityResult {
  state: ApplicabilityState;
  reason: string;
  changedInputs: string[];
  unknownInputs: string[];
}

export interface ReuseResult {
  reusable: boolean;
  statement: string;
  failedConditions: string[];
  applicability: ApplicabilityResult;
}

export const APPLICABILITY_STATES: readonly ApplicabilityState[];
export const APPLICABILITY_MEANING: Record<ApplicabilityState, string>;

export function evaluateApplicability(
  record: Partial<EvidenceRecord>,
  context: ApplicabilityContext,
): ApplicabilityResult;
export function environmentApplies(recordEnvironment: string, targetEnvironment: string): boolean;
export function evaluateReuse(
  record: Partial<EvidenceRecord>,
  context: ApplicabilityContext,
): ReuseResult;
