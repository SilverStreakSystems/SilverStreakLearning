import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  AMBIGUITY_KINDS,
  EXTRACTION_CONFIDENCES,
  INHERITED_AUTHORITIES,
  PROHIBITED_REQUIREMENT_CLAIMS,
  REQUIREMENT_FAMILIES,
  RESERVED_OWNER_DISPOSITIONS,
  validateHistoricalRequirement,
} from "@/domain/historical-requirement";
import {
  loadHistoricalRequirementFile,
  loadHistoricalRequirementSchema,
  loadHistoricalRequirements,
} from "@/lib/historical-requirement-registry";
import { loadHistoricalSources } from "@/lib/historical-source-registry";
import { DECISIONS } from "@/fixtures/registers";

const file = loadHistoricalRequirementFile();
const requirements = loadHistoricalRequirements();
const schema = loadHistoricalRequirementSchema();
const sources = loadHistoricalSources();

describe("WP-007 historical requirement schema", () => {
  it("declares a versioned schema that matches the register", () => {
    expect(schema["schema_version"]).toBe("1.0.0");
    expect(file.schema_version).toBe(schema["schema_version"]);
    expect(file.extraction_boundary.length).toBeGreaterThan(80);
    expect(file.source_selection_rationale.length).toBeGreaterThan(80);
  });

  it("keeps the vocabularies aligned between schema and domain module", () => {
    const defs = schema["$defs"] as Record<string, { enum?: string[] }>;
    expect(defs["requirementFamily"]?.enum).toEqual([...REQUIREMENT_FAMILIES]);
    expect(defs["extractionConfidence"]?.enum).toEqual([...EXTRACTION_CONFIDENCES]);
    expect(defs["ambiguity"]?.enum).toEqual([...AMBIGUITY_KINDS]);
    expect(defs["inheritedAuthority"]?.enum).toEqual([...INHERITED_AUTHORITIES]);
  });
});

describe("WP-007 requirement candidate register", () => {
  it("validates every record against the schema rules", () => {
    expect(requirements.flatMap((record) => validateHistoricalRequirement(record))).toEqual([]);
  });

  it("assigns stable, unique, sequential HREQ identifiers", () => {
    const ids = requirements.map((record) => record.requirement_id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id, index) => expect(id).toBe(`HREQ-${String(index + 1).padStart(3, "0")}`));
  });

  it("extracts from exactly one named source that exists in the source register", () => {
    const used = [...new Set(requirements.map((record) => record.source_id))];
    expect(used).toEqual(["HS-011"]);
    const source = sources.find((record) => record.source_id === "HS-011");
    expect(source).toBeDefined();
    expect(source?.recovery_relevance).toBe("HIGH");
    expect(source?.access_limitation).not.toBe("NOT-ACCESSIBLE-TO-EXECUTOR");
  });

  it("inherits source authority without promotion", () => {
    const source = sources.find((record) => record.source_id === "HS-011");
    for (const record of requirements) {
      expect(record.inherited_authority).toBe(source?.authority_classification);
    }
    expect(source?.promotion_state).toBe("NOT-PROMOTED");
  });

  it("binds every candidate to an exact in-source locator", () => {
    for (const record of requirements) {
      expect(record.source_locator).toMatch(/^docs\/ACCESSIBILITY_ACCEPTANCE\.md#L\d+(-L\d+)?$/);
    }
  });

  it("keeps original wording verbatim and separate from the normalized summary", () => {
    const sourceText = readFileSync("docs/ACCESSIBILITY_ACCEPTANCE.md", "utf8").replace(/\s+/g, " ");
    for (const record of requirements) {
      expect(sourceText).toContain(record.original_wording.replace(/\s+/g, " "));
      expect(record.normalized_summary).not.toBe(record.original_wording);
    }
  });

  it("records confidence and ambiguity on every candidate", () => {
    for (const record of requirements) {
      expect(EXTRACTION_CONFIDENCES).toContain(record.extraction_confidence);
      expect(record.extraction_confidence_reason.trim().length).toBeGreaterThan(0);
      expect(AMBIGUITY_KINDS).toContain(record.ambiguity);
      expect(record.ambiguity_note.trim().length).toBeGreaterThan(0);
      expect(record.extracted_on).toBe("2026-08-19");
    }
  });

  it("leaves every candidate pre-disposition and unassessed", () => {
    const text = JSON.stringify(file).toUpperCase();
    for (const record of requirements) {
      expect(record.disposition).toBe("CANDIDATE-PRE-DISPOSITION");
      expect(record.conformance_state).toBe("NOT-ASSESSED");
    }
    for (const reserved of RESERVED_OWNER_DISPOSITIONS) {
      expect(text.includes(`"${reserved}"`)).toBe(false);
    }
  });

  it("carries no compliance vocabulary outside quoted source wording", () => {
    const executorText = requirements
      .flatMap((record) => [
        record.normalized_summary,
        record.inheritance_note,
        record.extraction_confidence_reason,
        record.ambiguity_note,
        record.boundary,
      ])
      .join(" ")
      .toLowerCase();
    for (const phrase of PROHIBITED_REQUIREMENT_CLAIMS) {
      expect(executorText).not.toContain(phrase);
    }
  });
});

describe("WP-007 cycle 2 authority boundary", () => {
  it("proceeds on accepted decisions with Gate A still open and WP-007 not closed", () => {
    for (const id of ["DEC-012", "DEC-018"]) {
      expect(DECISIONS.find((record) => record.id === id)?.state).toBe("accepted");
    }
    const closure = DECISIONS.find(
      (record) =>
        record.state === "accepted" &&
        /(gate a is closed|wp-007 is closed|wp-039 is authorized)/i.test(record.decision),
    );
    expect(closure).toBeUndefined();
  });
});
