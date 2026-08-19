/**
 * Pure helpers for the SSOT binding guard.
 *
 * The guard enforces one rule: the declared binding commit inside the canonical
 * current-state record must equal the repository HEAD that is being merged.
 * It asserts nothing about correctness, authority, or approval.
 */

/** Path of the canonical current-state record, relative to the repository root. */
export const SSOT_RECORD_PATH =
  "docs/wp-006/SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md";

/** Documents that must declare the same binding commit as the SSOT record. */
export const BOUND_DOCUMENT_PATHS = [
  SSOT_RECORD_PATH,
  "docs/wp-006/PROVENANCE_REPORT.md",
  "docs/wp-006/BUILD_MANIFEST.md",
  "docs/wp-006/TEST_BUILD_STATUS.md",
];

const FULL_SHA = /\b([0-9a-f]{40})\b/;

/**
 * Extract the declared binding commit from a bound document.
 *
 * Recognised declaration forms, in priority order:
 *   - `- **Bound to commit:** \`<sha>\``
 *   - `| HEAD commit | \`<sha>\` | ...`
 *   - a line containing "bound to commit" / "inspected at commit" / "Bound to commit"
 *
 * @param {string} markdown raw file contents
 * @returns {string | null} 40-character SHA, or null when no declaration exists
 */
export function extractDeclaredBinding(markdown) {
  const lines = markdown.split("\n");

  const patterns = [
    /bound to commit/i,
    /\|\s*HEAD commit\s*\|/i,
    /inspected at commit/i,
    /HEAD at this record/i,
  ];

  for (const pattern of patterns) {
    for (const line of lines) {
      if (!pattern.test(line)) continue;
      const match = FULL_SHA.exec(line);
      if (match) return match[1];
    }
  }

  return null;
}

/**
 * Compare declared bindings against the repository HEAD.
 *
 * @param {string} headSha 40-character SHA of the commit under review
 * @param {Array<{ path: string, declared: string | null }>} documents
 * @returns {{ ok: boolean, headSha: string, results: Array<{ path: string, declared: string | null, state: "matched" | "mismatched" | "missing" }> }}
 */
export function evaluateBindings(headSha, documents) {
  const normalizedHead = headSha.trim().toLowerCase();

  const results = documents.map(({ path, declared }) => {
    if (!declared) return { path, declared: null, state: /** @type {const} */ ("missing") };
    return {
      path,
      declared,
      state:
        declared.toLowerCase() === normalizedHead
          ? /** @type {const} */ ("matched")
          : /** @type {const} */ ("mismatched"),
    };
  });

  return {
    ok: results.every((result) => result.state === "matched"),
    headSha: normalizedHead,
    results,
  };
}

/**
 * Render a plain-language report. No color, no icons — state is always textual.
 *
 * @param {ReturnType<typeof evaluateBindings>} evaluation
 * @returns {string}
 */
export function formatReport(evaluation) {
  const marker = {
    matched: "[OK]",
    mismatched: "[MISMATCH]",
    missing: "[MISSING]",
  };

  const rows = evaluation.results.map(
    (result) =>
      `${marker[result.state]} ${result.path} — declared ${result.declared ?? "no binding declaration found"}`,
  );

  const verdict = evaluation.ok
    ? "PASS — every bound document declares the commit under review."
    : "FAIL — at least one bound document does not declare the commit under review.";

  return [
    "SSOT binding guard",
    `Commit under review: ${evaluation.headSha}`,
    "",
    ...rows,
    "",
    verdict,
  ].join("\n");
}
