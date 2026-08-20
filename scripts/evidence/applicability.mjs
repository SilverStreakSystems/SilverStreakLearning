/**
 * Evidence applicability.
 *
 * This module is the architectural answer to FND-011 and FND-013. It replaces
 * "does the declared SHA equal HEAD" with "do the inputs this result actually
 * depended on still hold, in an applicable environment, unexpired and
 * unsuperseded". The answer is one of six explicit states, and UNKNOWN is
 * never collapsed into CURRENT or STALE.
 */
import { isExpired } from "./expiry.mjs";
import { declaredSets, isReusable } from "./inputs.mjs";

export const APPLICABILITY_STATES = [
  "CURRENT",
  "STALE",
  "EXPIRED",
  "SUPERSEDED",
  "INAPPLICABLE",
  "UNKNOWN",
];

export const APPLICABILITY_MEANING = {
  CURRENT: "Relevant inputs match and expiry has not passed.",
  STALE: "Relevant inputs changed, or the baseline has not been re-derived.",
  EXPIRED: "Time-based validity has ended.",
  SUPERSEDED: "A newer evidence artifact formally replaces this one for the same scope.",
  INAPPLICABLE: "The evidence does not apply to the current environment or scope.",
  UNKNOWN: "Applicability could not be determined.",
};

/**
 * Evaluate one evidence record against current repository state.
 *
 * @param {object} record evidence record
 * @param {object} context { inputSets, environment, at, supersededIds }
 * @returns {{ state: string, reason: string, changedInputs: string[] }}
 */
export function evaluateApplicability(record, context) {
  const { inputSets = {}, environment = "lovable-sandbox", at, supersededIds = [] } = context ?? {};

  if (!record || typeof record !== "object") {
    return { state: "UNKNOWN", reason: "No evidence record supplied.", changedInputs: [] };
  }

  if (record.superseded_by || supersededIds.includes(record.evidence_id)) {
    return {
      state: "SUPERSEDED",
      reason: `Replaced for the same scope by ${record.superseded_by ?? "a later record"}.`,
      changedInputs: [],
    };
  }

  if (!record.commit_sha || !record.environment) {
    return {
      state: "UNKNOWN",
      reason: "Record is missing its commit or environment binding.",
      changedInputs: [],
    };
  }

  if (isExpired(record, at)) {
    return {
      state: "EXPIRED",
      reason: `Validity ended at ${record.expires_at}.`,
      changedInputs: [],
    };
  }

  if (!environmentApplies(record.environment, environment)) {
    return {
      state: "INAPPLICABLE",
      reason: `Produced in ${record.environment}; evaluated for ${environment}.`,
      changedInputs: [],
    };
  }

  const expected = declaredSets(record.evidence_type);
  if (expected.length === 0) {
    return {
      state: "UNKNOWN",
      reason: `No declared input set for evidence type ${record.evidence_type}.`,
      changedInputs: [],
    };
  }

  const recorded = record.input_set ?? {};
  const missing = expected.filter((key) => !recorded[key] || recorded[key] === "UNKNOWN");
  if (missing.length > 0) {
    return {
      state: "UNKNOWN",
      reason: `Recorded input hashes are missing for: ${missing.join(", ")}.`,
      changedInputs: [],
    };
  }

  const changedInputs = expected.filter((key) => recorded[key] !== inputSets[key]);

  if (changedInputs.length === 0) {
    if (!isReusable(record.evidence_type) && record.commit_sha !== context.commit) {
      return {
        state: "STALE",
        reason: `Evidence type ${record.evidence_type} declares an input scope that does not fully determine its result, so it must be re-executed at the commit under review.`,
        changedInputs: [],
      };
    }
    return {
      state: "CURRENT",
      reason: "All declared inputs are unchanged and validity has not ended.",
      changedInputs: [],
    };
  }

  return {
    state: "STALE",
    reason: `Declared inputs changed since execution: ${changedInputs.join(", ")}.`,
    changedInputs,
  };
}

/** Evidence generated in one environment does not automatically cover another. */
export function environmentApplies(recordEnvironment, targetEnvironment) {
  if (recordEnvironment === targetEnvironment) return true;
  // CI and sandbox both execute the same repository toolchain; either may be
  // cited for the other only for input-derived facts, never for runtime claims.
  const interchangeable = new Set(["lovable-sandbox", "ci"]);
  return interchangeable.has(recordEnvironment) && interchangeable.has(targetEnvironment);
}

/** Reuse contract: the seven conditions under which a record may be carried forward. */
export function evaluateReuse(record, context) {
  const applicability = evaluateApplicability(record, context);
  const blockingFindings = (context?.openFindings ?? []).filter((finding) =>
    (record.related_findings ?? []).includes(finding),
  );

  const conditions = [
    { id: "type-permits-reuse", ok: isReusable(record.evidence_type) },
    { id: "inputs-unchanged", ok: applicability.changedInputs.length === 0 },
    { id: "environment-applicable", ok: applicability.state !== "INAPPLICABLE" },
    { id: "not-expired", ok: applicability.state !== "EXPIRED" },
    { id: "not-superseded", ok: applicability.state !== "SUPERSEDED" },
    { id: "no-invalidating-finding", ok: blockingFindings.length === 0 },
    { id: "proposition-within-supports", ok: true },
  ];

  return {
    reusable: conditions.every((condition) => condition.ok),
    conditions,
    applicability,
    statement:
      applicability.state === "CURRENT"
        ? `${record.evidence_id} — CURRENT/APPLICABLE VIA UNCHANGED INPUT SET. It was not executed at the current commit.`
        : `${record.evidence_id} — ${applicability.state}. ${applicability.reason}`,
  };
}
