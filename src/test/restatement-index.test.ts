import { describe, expect, it } from "vitest";

import {
  PROHIBITED_RESTATEMENT_CLAIMS,
  RESTATEMENT_RELATIONSHIPS,
  validateRestatementRelation,
} from "@/domain/restatement";
import { loadHistoricalRequirements } from "@/lib/historical-requirement-registry";
import { loadRestatementIndexFile, loadRestatementIndexSchema } from "@/lib/restatement-registry";
import { loadHistoricalSources } from "@/lib/historical-source-registry";
import { EVIDENCE, FINDINGS } from "@/fixtures/registers";

const file = loadRestatementIndexFile();
const schema = loadRestatementIndexSchema();
const requirements = loadHistoricalRequirements();
const requirementIds = requirements.map((record) => record.requirement_id);
const sources = loadHistoricalSources();

describe("WP-007 restatement index schema", () => {
  it("declares a versioned schema that matches the index file", () => {
    expect(schema["schema_version"]).toBe("1.0.0");
    expect(file.schema_version).toBe(schema["schema_version"]);
    expect(file.index_boundary.length).toBeGreaterThan(80);
    expect(file.relationship_vocabulary_note.length).toBeGreaterThan(80);
  });

  it("keeps the relationship vocabulary aligned between schema and domain module", () => {
    const defs = schema["$defs"] as Record<string, { enum?: string[] }>;
    expect(defs["relationship"]?.enum).toEqual([...RESTATEMENT_RELATIONSHIPS]);
  });
});

describe("WP-007 cross-source restatement index", () => {
  it("validates every row against the schema rules", () => {
    expect(file.relations.flatMap((row) => validateRestatementRelation(row, requirementIds))).toEqual(
      [],
    );
  });

  it("assigns stable, unique, sequential RST identifiers", () => {
    const ids = file.relations.map((row) => row.relation_id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id, index) => expect(id).toBe(`RST-${String(index + 1).padStart(3, "0")}`));
  });

  it("relates candidates across two different registered sources only", () => {
    for (const row of file.relations) {
      expect(row.subject_source).toBe("HS-023");
      if (row.relationship !== "NEW") {
        expect(row.related_source).toBe("HS-011");
      }
      for (const id of [row.subject_source, row.related_source].filter(Boolean)) {
        expect(sources.some((source) => source.source_id === id)).toBe(true);
      }
    }
  });

  it("covers every subject-source candidate exactly once", () => {
    const subjects = file.relations.map((row) => row.subject_requirement);
    const cycle4 = requirements
      .filter((record) => record.source_id === "HS-023")
      .map((record) => record.requirement_id);
    expect(new Set(subjects)).toEqual(new Set(cycle4));
  });

  it("lists counterpart-source candidates that no row matched", () => {
    const matched = new Set(
      file.relations.map((row) => row.related_requirement).filter(Boolean) as string[],
    );
    const hs011 = requirements
      .filter((record) => record.source_id === "HS-011")
      .map((record) => record.requirement_id);
    const unmatched = hs011.filter((id) => !matched.has(id));
    expect(file.unmatched_related_candidates.map((entry) => entry.requirement_id).sort()).toEqual(
      unmatched.sort(),
    );
    for (const entry of file.unmatched_related_candidates) {
      expect(entry.source_id).toBe("HS-011");
      expect(entry.note.trim().length).toBeGreaterThan(0);
    }
  });

  it("changes no candidate: every requirement stays pre-disposition and unassessed", () => {
    for (const record of requirements) {
      expect(record.disposition).toBe("CANDIDATE-PRE-DISPOSITION");
      expect(record.conformance_state).toBe("NOT-ASSESSED");
    }
  });

  it("carries no merge, precedence, or conformance vocabulary", () => {
    // Boundary prose states these words only as refusals, so the check reads the
    // executor's own findings: the basis written for each row.
    const text = file.relations.map((row) => row.basis).join(" ").toLowerCase();
    for (const phrase of PROHIBITED_RESTATEMENT_CLAIMS) {
      expect(text).not.toContain(phrase);
    }
  });
});

describe("WP-007 cycle 4 register bindings", () => {
  it("records digest verification and extraction evidence with an explicit non-support boundary", () => {
    for (const id of ["EV-039", "EV-040"]) {
      const record = EVIDENCE.find((entry) => entry.id === id);
      expect(record?.state).toBe("confirmed");
      expect(record?.doesNotSupport.length).toBeGreaterThan(80);
      expect(record?.doesNotSupport).toMatch(/independent = false/);
    }
  });

  it("resolves the input-availability blockage and opens the disposition obligation", () => {
    expect(FINDINGS.find((entry) => entry.id === "FND-021")?.resolutionState).toBe("confirmed");
    const open = FINDINGS.find((entry) => entry.id === "FND-022");
    expect(open?.resolutionState).toBe("not-verified");
    expect(open?.requiredDecision).toBeTruthy();
  });
});
