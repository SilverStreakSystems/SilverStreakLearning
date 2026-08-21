import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  EXTERNAL_CORPUS_AUTHORITY_CLASS,
  declaresProhibitedStatus,
  groupItemsByClass,
  observationDefects,
  PROHIBITED_STATUS_WORDS,
  type ExternalCorpusObservation,
} from "@/domain/external-corpus";
import {
  EXTERNAL_CORPUS_FILES,
  loadExternalCorpora,
  loadExternalCorpusSchema,
} from "@/lib/external-corpus-registry";

const records = loadExternalCorpora();
const ssls3 = records.find((record) => record.corpus_id === "XC-001");

function doc(name: string): string {
  return readFileSync(join(process.cwd(), "docs", "external-corpora", name), "utf8");
}

describe("external corpus observation records", () => {
  it("loads one record per declared file", () => {
    expect(records).toHaveLength(EXTERNAL_CORPUS_FILES.length);
    expect(ssls3).toBeDefined();
  });

  it("carries no structural defect", () => {
    for (const record of records) {
      expect(observationDefects(record)).toEqual([]);
    }
  });

  it("fixes the authority class to non-controlling external reference", () => {
    for (const record of records) {
      expect(record.authority_class).toBe(EXTERNAL_CORPUS_AUTHORITY_CLASS);
      expect(record.non_authority_statement.trim().length).toBeGreaterThan(0);
      expect(record.non_effects.length).toBeGreaterThan(0);
    }
  });

  it("gives every item an observation timestamp, location class and provider identifier", () => {
    for (const record of records) {
      for (const item of record.items) {
        expect(item.observed_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        expect(item.location_class.length).toBeGreaterThan(0);
        expect(item.provider_file_id.length).toBeGreaterThan(0);
      }
    }
  });

  it("records no item as accepted, canonical, approved, promoted, adopted or implemented", () => {
    for (const record of records) {
      for (const item of record.items) {
        expect(declaresProhibitedStatus(item.declared_status)).toBe(false);
      }
    }
  });

  it("detects a status word that would imply granted authority", () => {
    for (const word of PROHIBITED_STATUS_WORDS) {
      expect(declaresProhibitedStatus(`Currently ${word.toUpperCase()}`)).toBe(true);
    }
    expect(declaresProhibitedStatus("DRAFT — OWNER REVIEW REQUIRED / CANDIDATE")).toBe(false);
    expect(declaresProhibitedStatus(null)).toBe(false);
  });

  it("refuses a record whose item promotes itself", () => {
    const base = ssls3 as ExternalCorpusObservation;
    const firstItem = base.items[0];
    expect(firstItem).toBeDefined();
    const tampered: ExternalCorpusObservation = {
      ...base,
      items: [{ ...firstItem!, declared_status: "ACCEPTED — CANONICAL" }, ...base.items.slice(1)],
    };
    expect(observationDefects(tampered).join(" ")).toContain("implies granted authority");
  });

  it("refuses a record whose item count disagrees with its items", () => {
    const base = ssls3 as ExternalCorpusObservation;
    const tampered: ExternalCorpusObservation = { ...base, item_count: base.item_count + 1 };
    expect(observationDefects(tampered).join(" ")).toContain("disagrees");
  });

  it("refuses a record that lists an artifact as both present and absent", () => {
    const base = ssls3 as ExternalCorpusObservation;
    const absent = base.declared_but_absent[0];
    expect(absent).toBeDefined();
    const firstItem = base.items[0];
    const tampered: ExternalCorpusObservation = {
      ...base,
      items: [
        { ...firstItem!, declared_document_id: absent!.declared_document_id },
        ...base.items.slice(1),
      ],
    };
    expect(observationDefects(tampered).join(" ")).toContain("recorded absent while also present");
  });

  it("holds no item body text, so the record cannot drift from its source", () => {
    const raw = readFileSync(
      join(process.cwd(), "data", "external-corpora", "ssls-3.0-foundation.json"),
      "utf8",
    );
    // Section headings and status labels lifted from the observed documents would
    // indicate restatement rather than indexing.
    expect(raw).not.toContain("## Mandatory reading order");
    expect(raw).not.toContain("North Star");
    expect(raw).not.toContain("state-progression ladder");
  });
});

describe("XC-001 — SSLS 3.0 foundation corpus", () => {
  it("records the fifteen observed items", () => {
    expect(ssls3!.item_count).toBe(15);
    expect(ssls3!.items).toHaveLength(15);
  });

  it("records the nine present foundation documents with their declared identifiers", () => {
    const foundation = ssls3!.items.filter((item) => item.item_class === "foundation-document");
    expect(foundation).toHaveLength(9);
    expect(foundation.map((item) => item.declared_document_id).sort()).toEqual([
      "SSLS3-DOC-00",
      "SSLS3-DOC-01",
      "SSLS3-DOC-02",
      "SSLS3-DOC-03",
      "SSLS3-DOC-04",
      "SSLS3-DOC-05",
      "SSLS3-DOC-06",
      "SSLS3-DOC-07",
      "SSLS3-DOC-11",
    ]);
  });

  it("records the three cited registers as absent, never as present", () => {
    expect(ssls3!.declared_but_absent.map((entry) => entry.declared_document_id)).toEqual([
      "SSLS3-DOC-08",
      "SSLS3-DOC-09",
      "SSLS3-DOC-10",
    ]);
    for (const absent of ssls3!.declared_but_absent) {
      expect(absent.presence).toBe("ABSENT-AT-OBSERVATION");
      expect(absent.cited_by.length).toBeGreaterThan(0);
    }
  });

  it("introduces no SSLS 2.0 governance identifier", () => {
    const raw = readFileSync(
      join(process.cwd(), "data", "external-corpora", "ssls-3.0-foundation.json"),
      "utf8",
    );
    for (const pattern of [
      /\bDEC-\d{3}\b/,
      /\bFND-\d{3}\b/,
      /\bEV-\d{3}\b/,
      /\bCHECKPOINT-\d{3}\b/,
      /\bWP-\d{3}\b/,
    ]) {
      expect(raw).not.toMatch(pattern);
    }
  });

  it("groups items into stable classes for projection", () => {
    const groups = groupItemsByClass(ssls3!.items);
    expect(groups.map(([cls]) => cls)).toEqual([
      "foundation-document",
      "workbook",
      "spreadsheet",
      "probe",
    ]);
  });
});

describe("external corpus schema and projection", () => {
  it("pins the authority class as a constant in the schema", () => {
    const schema = loadExternalCorpusSchema() as {
      properties: { authority_class: { const: string } };
    };
    expect(schema.properties.authority_class.const).toBe(EXTERNAL_CORPUS_AUTHORITY_CLASS);
  });

  it("projects the observation index with its non-authority statement", () => {
    const projected = doc("SSLS_3.0_FOUNDATION_OBSERVATION.md");
    expect(projected).toContain("Generated by scripts/gen-external-corpus-docs.ts");
    expect(projected).toContain("XC-001");
    expect(projected).toContain(EXTERNAL_CORPUS_AUTHORITY_CLASS);
    expect(projected).toContain("SSLS3-DOC-08");
    expect(projected).toContain(ssls3!.non_authority_statement);
  });

  it("projects the non-promotion boundary", () => {
    const boundary = doc("NON_PROMOTION_BOUNDARY.md");
    expect(boundary).toContain("Observation is not promotion");
    expect(boundary).toContain(ssls3!.non_authority_statement);
    expect(boundary).toContain("cannot record an owner decision");
  });
});
