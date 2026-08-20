export interface OutputSafetyMatch {
  file: string;
  line: number;
  pattern_id: string;
  pattern_label: string;
  redacted_digest: string;
  disposition: string;
}

export interface OutputSafetyResult {
  schema_version: string;
  generated_at: string;
  scanned_tree: string;
  result_path_excluded_from_scan?: string | null;
  status: "pass" | "fail";
  reason?: string;
  files_discovered?: number;
  files_scanned: number;
  secret_patterns?: { id: string; label: string }[];
  pii_patterns?: { id: string; label: string }[];
  secret_matches: OutputSafetyMatch[];
  pii_matches: OutputSafetyMatch[];
  recursion_note?: string;
  limitations: string[];
}

export declare const OUTPUT_SAFETY_LIMITATIONS: string[];

export declare function listOutputFiles(dir: string, options?: { exclude?: string[] }): string[];

export declare function scanOutputs(
  files: string[],
  patterns: { id: string; label: string; pattern: RegExp; allow?: RegExp }[],
): { scanned: number; matches: OutputSafetyMatch[] };

export declare function runOutputSafety(options?: { dir?: string; out?: string | null }): {
  ok: boolean;
  result: OutputSafetyResult;
};
