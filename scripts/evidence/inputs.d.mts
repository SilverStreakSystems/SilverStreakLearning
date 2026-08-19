import type { EvidenceType, InputSetMap, InputSetName } from "./types.mjs";

export const INPUT_SET_DEFINITIONS: Record<EvidenceType, readonly InputSetName[]>;

export function computeInputSets(files?: string[]): InputSetMap;
export function inputSetFor(evidenceType: EvidenceType, allSets: InputSetMap): InputSetMap;
export function isReusable(evidenceType: EvidenceType): boolean;
export function declaredSets(evidenceType: EvidenceType): InputSetName[];
