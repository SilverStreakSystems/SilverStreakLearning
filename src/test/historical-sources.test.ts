import { describe, expect, it } from "vitest";

import {
  ACCESS_LIMITATIONS,
  AUTHORITY_CLASSIFICATIONS,
  PROHIBITED_HISTORICAL_CLAIMS,
  isRecoveryCritical,
  validateHistoricalSource,
} from "@/domain/historical-source";
import {
  loadHistoricalSourceFile,
  loadHistoricalSourceSchema,
  loadHistoricalSources,
} from "@/lib/historical-source-registry";
import { DECISIONS, FINDINGS } from "@/fixtures/registers";

const file = loadHistoricalSourceFile();
const sources = loadHistoricalSources();
const schema = loadHistoricalSourceSchema();

describe("WP-007 historical source schema", () => {
  it("declares a versioned schema that matches the register", () => {
    expect(schema["schema_version"]).toBe("1.0.0");
    expect(file.schema_version).toBe(schema["schema_version"]);
    expect(file.universe_boundary.length).toBeGreaterThan(80);
  });

  it("keeps the classification and access vocabularies aligned with the schema", () => {
    const defs = schema["$defs"] as Record<string, { enum?: string[] }>;
    expect(defs["authorityClassification"]?.enum).toEqual([...AUTHORITY_CLASSIFICATIONS]);
    expect(defs["accessLimitation"]?.enum).toEqual([...ACCESS_LIMITATIONS]);
  });
});

describe("WP-007 historical source register", () => {
  it("validates every record against the schema rules", () => {
    expect(sources.flatMap((record) => validateHistoricalSource(record))).toEqual([]);
  });

  it("assigns unique, sequential identifiers", () => {
    const ids = sources.map((record) => record.source_id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(ids);
  });

  it("gives every source an exact locator, a basis and an access limitation", () => {
    for (const record of sources) {
      expect(record.exact_locator.trim().length).toBeGreaterThan(0);
      expect(record.classification_basis.trim().length).toBeGreaterThan(0);
      expect(ACCESS_LIMITATIONS).toContain(record.access_limitation);
      expect(record.recovery_relevance_reason.trim().length).toBeGreaterThan(0);
      expect(record.inventoried_on).toBe("2026-08-19");
    }
  });

  it("never promotes a historical source into current authority", () => {
    for (const record of sources) {
      if (record.authority_classification !== "CURRENT-AUTHORITY") {
        expect(record.promotion_state).toBe("NOT-PROMOTED");
      }
    }
  });

  it("backs every current-authority classification with a recorded accepted decision", () => {
    const accepted = new Set(
      DECISIONS.filter((record) => record.state === "accepted").map((record) => record.id),
    );
    const current = sources.filter((r) => r.authority_classification === "CURRENT-AUTHORITY");
    expect(current.length).toBeGreaterThan(0);
    for (const record of current) {
      expect(record.classification_evidence.some((ref) => accepted.has(ref))).toBe(true);
    }
  });

  it("records unreachable sources honestly instead of guessing at their content", () => {
    const unreachable = sources.filter(
      (record) => record.access_limitation === "NOT-ACCESSIBLE-TO-EXECUTOR",
    );
    expect(unreachable.length).toBeGreaterThan(0);
    for (const record of unreachable) {
      expect(record.version_or_hash).toBe("NOT-AVAILABLE");
      expect(record.recovery_relevance).toBe("UNKNOWN");
      expect(record.promotion_state).toBe("NOT-PROMOTED");
    }
  });

  it("keeps the owner-supplied Drive folder recorded by locator only", () => {
    const drive = sources.find((record) => record.source_family === "external-drive-folder");
    expect(drive?.exact_locator).toContain("https://drive.google.com/drive/folders/");
    expect(drive?.access_limitation).toBe("NOT-ACCESSIBLE-TO-EXECUTOR");
    expect(drive?.pii_status).toBe("UNINSPECTED");
  });

  it("carries no real personal data and no compliance vocabulary", () => {
    const text = JSON.stringify(file).toLowerCase();
    for (const phrase of PROHIBITED_HISTORICAL_CLAIMS) {
      expect(text).not.toContain(phrase);
    }
    for (const record of sources) {
      expect(["NO-REAL-PII-ASSERTED", "UNINSPECTED"]).toContain(record.pii_status);
    }
  });

  it("identifies the recovery-critical reachable sources for the next cycle", () => {
    const critical = sources.filter(isRecoveryCritical);
    expect(critical.length).toBeGreaterThan(0);
    for (const record of critical) {
      expect(record.access_limitation).not.toBe("NOT-ACCESSIBLE-TO-EXECUTOR");
    }
  });
});

describe("WP-007 entry authority", () => {
  it("enters on accepted decisions only, with Gate A still open", () => {
    for (const id of ["DEC-010", "DEC-012", "DEC-017", "DEC-018"]) {
      expect(DECISIONS.find((record) => record.id === id)?.state).toBe("accepted");
    }
    const gateClosure = DECISIONS.find(
      (record) => record.state === "accepted" && /gate a is closed/i.test(record.decision),
    );
    expect(gateClosure).toBeUndefined();
  });

  it("does not close the findings carried into WP-007", () => {
    for (const id of ["FND-010", "FND-017", "FND-018"]) {
      expect(FINDINGS.find((record) => record.id === id)?.resolutionState).not.toBe("resolved");
    }
    expect(FINDINGS.find((record) => record.id === "FND-016")?.resolutionState).toBe("partial");
  });
});
