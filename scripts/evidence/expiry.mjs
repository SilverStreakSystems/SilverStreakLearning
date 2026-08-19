/**
 * Evidence expiry policy.
 *
 * Every evidence class declares an invalidation condition, a validity window,
 * or both, with a stated rationale. There is no single arbitrary duration:
 * a build result is invalidated by an input change and never by the clock,
 * while vulnerability intelligence goes out of date even when nothing in the
 * repository moves.
 */

const DAY = 24 * 60 * 60 * 1000;

/** @type {Record<string, { windowDays: number | null, invalidatedBy: string, rationale: string }>} */
export const EXPIRY_POLICY = {
  BUILD: {
    windowDays: null,
    invalidatedBy: "Change to declared source, config, or lockfile inputs.",
    rationale:
      "A build result depends on its inputs, not on elapsed time. Unchanged inputs mean the result still describes the same build.",
  },
  TEST: {
    windowDays: null,
    invalidatedBy: "Change to declared source, test, config, or lockfile inputs.",
    rationale:
      "Test outcomes are a function of the code and the tests. Time alone does not change either.",
  },
  TYPECHECK: {
    windowDays: null,
    invalidatedBy: "Change to declared source, test, or config inputs.",
    rationale: "Type checking is deterministic over its inputs.",
  },
  LINT: {
    windowDays: null,
    invalidatedBy: "Change to declared source, test, or config inputs.",
    rationale: "Lint results follow the ruleset and the files it is run against.",
  },
  SSOT_BINDING: {
    windowDays: null,
    invalidatedBy: "Change to bound documents or to the guard implementation.",
    rationale:
      "The predecessor guard compares declared strings; only the documents or the guard can change its answer.",
  },
  SOURCE_PROVENANCE: {
    windowDays: null,
    invalidatedBy: "Any change to the tracked tree.",
    rationale: "Provenance describes an exact tree; a different tree is a different subject.",
  },
  DEPENDENCY_INVENTORY: {
    windowDays: null,
    invalidatedBy: "Change to the package manifest or lockfile.",
    rationale: "The inventory is derived from the manifest and lockfile only.",
  },
  SBOM: {
    windowDays: null,
    invalidatedBy: "Change to the package manifest or lockfile.",
    rationale:
      "An SBOM is a dependency inventory. It goes out of date when dependencies change, not when time passes.",
  },
  VULNERABILITY_SCAN: {
    windowDays: 7,
    invalidatedBy: "Change to the package manifest or lockfile.",
    rationale:
      "Advisory databases change independently of this repository, so an unchanged dependency set can become newly vulnerable. Seven days bounds that drift without pretending the feed is static.",
  },
  LICENSE_SCAN: {
    windowDays: 90,
    invalidatedBy: "Change to the package manifest or lockfile.",
    rationale:
      "Declared licences change rarely, but a periodic re-read guards against upstream relicensing within an unchanged version range.",
  },
  SECRET_SCAN: {
    windowDays: null,
    invalidatedBy: "Any change within the scanned scope.",
    rationale: "The scan answers a question about an exact tree.",
  },
  PII_BOUNDARY_SCAN: {
    windowDays: null,
    invalidatedBy: "Any change within the scanned scope.",
    rationale: "The boundary control answers a question about an exact tree.",
  },
  ROUTE_INVENTORY: {
    windowDays: null,
    invalidatedBy: "Change to route sources.",
    rationale: "Routes are derived from the route directory.",
  },
  BASELINE_MANIFEST: {
    windowDays: null,
    invalidatedBy: "Any change to the tracked tree.",
    rationale: "The baseline describes the current tree and is regenerated rather than carried.",
  },
  CONFIGURATION: {
    windowDays: null,
    invalidatedBy: "Change to configuration files or workflows.",
    rationale: "Configuration evidence is a statement about configuration files.",
  },
  ACCESSIBILITY_AUTOMATED: {
    windowDays: 180,
    invalidatedBy: "Change to the tested surface or its interaction code.",
    rationale:
      "Automated accessibility results are bound to the tested surface and to the tool's ruleset, which is revised over time.",
  },
  CUSTOM_VALIDATION: {
    windowDays: 90,
    invalidatedBy: "Change to declared source, test, or config inputs.",
    rationale: "A conservative default review window for validations without a specific policy.",
  },
};

/** Compute the expiry instant for a record, or null when validity is input-bound only. */
export function computeExpiry(evidenceType, timestampIso) {
  const policy = EXPIRY_POLICY[evidenceType];
  if (!policy || policy.windowDays === null) return null;
  const base = Date.parse(timestampIso);
  if (!Number.isFinite(base)) return null;
  return new Date(base + policy.windowDays * DAY).toISOString();
}

/** Whether a record's declared expiry has passed at the given instant. */
export function isExpired(record, atIso = new Date().toISOString()) {
  if (!record?.expires_at) return false;
  const expiry = Date.parse(record.expires_at);
  const at = Date.parse(atIso);
  if (!Number.isFinite(expiry) || !Number.isFinite(at)) return false;
  return at >= expiry;
}

export function policyFor(evidenceType) {
  return EXPIRY_POLICY[evidenceType] ?? null;
}
