import { describe, expect, it } from "vitest";

import {
  APPLICABILITY_STATES,
  LEGALLY_BINDING_AUTHORITY_TYPES,
  PROHIBITED_OBLIGATION_CLAIMS,
  isGap,
  validateAuthority,
  validateObligation,
} from "@/domain/obligation";
import {
  loadAuthorities,
  loadObligationContext,
  loadObligations,
} from "@/lib/obligation-registry";

const authorities = loadAuthorities();
const obligations = loadObligations();
const context = loadObligationContext();
const authorityIds = new Set(authorities.map((record) => record.source_id));

describe("WP-038 external authority register", () => {
  it("validates every source record against the schema rules", () => {
    const issues = authorities.flatMap((record) => validateAuthority(record));
    expect(issues).toEqual([]);
  });

  it("assigns unique source identifiers", () => {
    expect(new Set(authorities.map((r) => r.source_id)).size).toBe(authorities.length);
  });

  it("gives every source an official https locator and a verification date", () => {
    for (const record of authorities) {
      expect(record.source_url.startsWith("https://")).toBe(true);
      expect(record.verified_on).toBe("2026-08-19");
    }
  });

  it("never marks an unverified or conflicted source as verified-current", () => {
    for (const record of authorities) {
      if (record.source_version === "UNKNOWN") {
        expect(record.source_status).not.toBe("VERIFIED-CURRENT");
      }
    }
  });

  it("keeps proposed or not-yet-effective authority out of effective lifecycle", () => {
    const colorado = authorities.find((r) => r.source_id === "SRC-037");
    expect(colorado?.lifecycle).toBe("ADOPTED-NOT-YET-EFFECTIVE");
  });
});

describe("WP-038 obligation register", () => {
  it("validates every obligation record", () => {
    const issues = obligations.flatMap((record) => validateObligation(record, authorityIds));
    expect(issues).toEqual([]);
  });

  it("assigns unique obligation identifiers", () => {
    expect(new Set(obligations.map((r) => r.obligation_id)).size).toBe(obligations.length);
  });

  it("binds every obligation to a registered source", () => {
    for (const record of obligations) {
      expect(authorityIds.has(record.source_id)).toBe(true);
    }
  });

  it("keeps source statement and SSLS interpretation separate and non-identical", () => {
    for (const record of obligations) {
      expect(record.source_statement_boundary).not.toBe(record.ssls_interpretation);
    }
  });

  it("never records a compliance claim in claim_implication", () => {
    for (const record of obligations) {
      for (const phrase of PROHIBITED_OBLIGATION_CLAIMS) {
        expect(record.claim_implication.toLowerCase()).not.toContain(phrase.toLowerCase());
      }
    }
  });

  it("never phrases a non-binding source as a legal requirement", () => {
    for (const record of obligations) {
      if (LEGALLY_BINDING_AUTHORITY_TYPES.includes(record.source_type)) continue;
      expect(record.obligation_summary).not.toMatch(/legally required|required by law/i);
    }
  });

  it("uses only canonical applicability states and never a blended readiness value", () => {
    for (const record of obligations) {
      expect(APPLICABILITY_STATES).toContain(record.applicability_state);
      expect(record.current_phase_applicability).not.toMatch(/\d+\s?%/);
    }
  });

  it("requires an owning route for every obligation that applies now", () => {
    for (const record of obligations.filter((r) => r.applicability_state === "APPLIES-NOW")) {
      expect(record.mapped_work_package.length).toBeGreaterThan(0);
      expect(record.review_trigger.length).toBeGreaterThan(0);
    }
  });

  it("records a prohibited claim for every obligation", () => {
    for (const record of obligations) {
      expect(record.prohibited_claim.trim().length).toBeGreaterThan(0);
    }
  });

  it("never marks an obligation IMPLEMENTED without current evidence", () => {
    for (const record of obligations.filter((r) => r.control_status === "IMPLEMENTED")) {
      expect(record.evidence_status).toBe("CURRENT");
    }
  });

  it("treats partial, missing, specification-only and unknown control as gaps", () => {
    const gaps = obligations.filter(isGap);
    expect(gaps.length).toBeGreaterThan(0);
    for (const record of gaps) {
      expect(["MISSING", "PARTIAL", "SPECIFICATION-ONLY", "UNKNOWN"]).toContain(
        record.control_status,
      );
    }
  });

  it("keeps the zero-personal-data boundary recorded as an active control", () => {
    const boundary = obligations.find((r) => r.obligation_id === "OBL-033");
    expect(boundary?.applicability_state).toBe("APPLIES-NOW");
    expect(boundary?.control_status).toBe("IMPLEMENTED");
    expect(boundary?.current_control).toMatch(/cookie/i);
  });

  it("does not collapse UNKNOWN or conditional applicability into not-applicable", () => {
    const conditional = obligations.filter((r) => r.applicability_state === "CONDITIONAL");
    expect(conditional.length).toBeGreaterThan(0);
    for (const record of conditional) {
      expect(record.applicability_trigger).not.toMatch(/^none$/i);
    }
  });
});

describe("WP-038 conflicts, stale references and data triggers", () => {
  it("routes every conflict to a named owner", () => {
    for (const record of context.conflicts) {
      expect(record.source_ids.every((id) => authorityIds.has(id))).toBe(true);
      expect(record.resolution_owner.length).toBeGreaterThan(0);
      expect(["OPEN", "ROUTED", "RESOLVED"]).toContain(record.state);
    }
  });

  it("gives every stale reference a disposition", () => {
    for (const record of context.stale_references) {
      expect(["CORRECT", "NARROW", "RECLASSIFY", "REMOVE", "VERIFIED"]).toContain(
        record.disposition,
      );
      expect(record.verified_current.length).toBeGreaterThan(0);
    }
  });

  it("records no current use of any personal data class", () => {
    for (const record of context.data_triggers) {
      expect(record.current_use).toBe(false);
      expect(record.prerequisite_review.length).toBeGreaterThan(0);
    }
  });
});
