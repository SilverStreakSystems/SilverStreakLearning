import type { EvidenceType, InputSetMap, InputSetName } from "./types.mjs";

export const INPUT_SET_DEFINITIONS: Record<EvidenceType, readonly InputSetName[]>;

export function computeInputSets(files?: string[]): InputSetMap;
export function inputSetFor(evidenceType: EvidenceType, allSets: InputSetMap): InputSetMap;
export function isReusable(evidenceType: EvidenceType): boolean;
export const DERIVED_OUTPUT_PREFIXES: readonly string[];
export const DERIVED_OUTPUT_EXACT: readonly string[];
export function isDerivedOutput(path: string): boolean;
export function projectionInputPaths(manifestPath?: string): string[];
export function declaredSets(evidenceType: EvidenceType): InputSetName[];
