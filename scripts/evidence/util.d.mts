export const EVIDENCE_SCHEMA_VERSION: string;
export const BASELINE_SCHEMA_VERSION: string;
export const GENERATED_MARKER: string;

export function sha256(input: string | Uint8Array): string;
export function hashFile(path: string): string;
export function stableHash(value: unknown): string;
export function stableStringify(value: unknown): string;
export function run(
  command: string,
  args: string[],
  options?: Record<string, unknown>,
): { code: number; stdout: string; stderr: string; durationMs: number; ok: boolean };
export function resolveCommit(): string;
export function resolveBranch(): string;
export function rootCommit(): string;
export function treeHash(): string;
export function commitCount(): number;
export function trackedFiles(): string[];
export function workingTreeDirty(): boolean;
export function hashPathSet(paths: string[]): string;
export function matchTracked(
  files: string[],
  matcher: { prefixes?: string[]; suffixes?: string[]; exact?: string[] },
): string[];
export function nowIso(): string;
export function shortSha(sha: string): string;
