/**
 * WP-007 Cycle 6 — FND-022 owner disposition record.
 *
 * These tests verify that the recorded dispositions of DEC-020 are transcribed
 * completely and identically across the canonical JSON record, the review
 * packet, the generated Markdown projection, the governance registers, and the
 * program state, and that recording a disposition changed nothing else.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures";
import { PROGRAM_STATE } from "@/fixtures/program";
import { loadHistoricalRequirementFile } from "@/lib/historical-requirement-registry";
import { loadRestatementIndexFile } from "@/lib/restatement-registry";
import {
  OWNER_REVIEW_OPTIONS,
  UNMATCHED_CONCLUSION,
  loadOwnerDispositionFile,
  loadOwnerDispositionSchema,
  loadOwnerReviewFile,
} from "@/lib/fnd-022-review-registry";

const record = loadOwnerDispositionFile();
const packet = loadOwnerReviewFile();
const requirements = loadHistoricalRequirementFile().records;
const index = loadRestatementIndexFile();
const markdown = readFileSync(
  join(process.cwd(), "docs", "wp-007", "FND-022_OWNER_DISPOSITION_PACKET.md"),
  "utf8",
);

describe("DEC-020 disposition record — completeness", () => {
  it("declares the schema version its schema file declares", () => {
    const schema = loadOwnerDispositionSchema() as { schema_version: string };
    expect(record.schema_version).toBe(schema.schema_version);
  });

  it("carries exactly sixteen candidate decisions over HREQ-015..HREQ-030", () => {
    const ids = record.candidate_dispositions.map((d) => d.candidate_id);
    expect(ids).toHaveLength(16);
    expect(ids).toEqual([...new Set(ids)]);
    expect(ids.slice().sort()).toEqual(
      requirements
        .filter((r) => r.source_id === "HS-023")
        .map((r) => r.requirement_id)
        .sort(),
    );
  });

  it("carries exactly seventeen relationship-row conclusions and three unmatched conclusions", () => {
    expect(record.relationship_row_conclusions).toHaveLength(17);
    expect(record.relationship_row_conclusions.map((r) => r.relation_id).sort()).toEqual(
      index.relations.map((r) => r.relation_id).sort(),
    );
    expect(record.unmatched_conclusions).toHaveLength(3);
    expect(record.unmatched_conclusions.map((u) => u.requirement_id).sort()).toEqual(
      index.unmatched_related_candidates.map((u) => u.requirement_id).sort(),
    );
  });

  it("records the exact disposition totals the owner stated", () => {
    const counts = new Map<string, number>();
    for (const decision of record.candidate_dispositions) {
      counts.set(decision.owner_disposition, (counts.get(decision.owner_disposition) ?? 0) + 1);
    }
    expect(counts.get("RETAIN-HISTORICAL")).toBe(5);
    expect(counts.get("MERGE-OR-RESTATEMENT")).toBe(3);
    expect(counts.get("ADOPT-AS-CANDIDATE")).toBe(7);
    expect(counts.get("NEEDS-EVIDENCE / DEFER")).toBe(1);
    for (const absent of ["NARROW", "SUPERSEDE", "REJECT"]) {
      expect(counts.get(absent) ?? 0).toBe(0);
      expect(record.totals[absent]).toBe(0);
    }
    expect(record.totals["candidate_count"]).toBe(16);
    expect(record.totals["relationship_row_count"]).toBe(17);
    expect(record.totals["unmatched_conclusion_count"]).toBe(3);
    for (const [key, total] of Object.entries(record.totals)) {
      if (OWNER_REVIEW_OPTIONS.includes(key as (typeof OWNER_REVIEW_OPTIONS)[number])) {
        expect(counts.get(key) ?? 0, key).toBe(total);
      }
    }
  });

  it("gives every decision a rationale drawn from the presented vocabulary", () => {
    for (const decision of record.candidate_dispositions) {
      expect(OWNER_REVIEW_OPTIONS).toContain(decision.owner_disposition);
      expect(decision.owner_rationale.length).toBeGreaterThan(20);
    }
    for (const row of record.relationship_row_conclusions) {
      expect(OWNER_REVIEW_OPTIONS).toContain(row.owner_conclusion);
    }
    for (const unmatched of record.unmatched_conclusions) {
      expect(unmatched.owner_conclusion).toBe(UNMATCHED_CONCLUSION);
      expect(unmatched.authority_unchanged).toBe(true);
    }
  });
});

describe("DEC-020 disposition record — changes nothing it may not change", () => {
  it("quotes each candidate verbatim from the unchanged extraction record", () => {
    for (const decision of record.candidate_dispositions) {
      const source = requirements.find((r) => r.requirement_id === decision.candidate_id);
      expect(source, decision.candidate_id).toBeDefined();
      expect(decision.exact_text).toBe(source!.original_wording);
      expect(decision.post_disposition_state.extraction_record_unchanged).toBe(true);
      expect(
        packet.candidates.find((c) => c.candidate_id === decision.candidate_id)?.exact_text,
      ).toBe(source!.original_wording);
    }
  });

  it("preserves every Cycle 4 relationship classification and its provenance", () => {
    for (const row of record.relationship_row_conclusions) {
      const source = index.relations.find((r) => r.relation_id === row.relation_id);
      expect(source, row.relation_id).toBeDefined();
      expect(row.cycle4_classification).toBe(source!.relationship);
      expect(row.cycle4_classification_preserved).toBe(true);
      expect(row.historical_candidate).toBe(source!.subject_requirement);
    }
  });

  it("leaves the seven adopted candidates candidates only: not assessed, not implemented", () => {
    const adopted = record.candidate_dispositions.filter(
      (d) => d.owner_disposition === "ADOPT-AS-CANDIDATE",
    );
    expect(adopted).toHaveLength(7);
    for (const decision of record.candidate_dispositions) {
      expect(decision.post_disposition_state.conformance_state).toBe("NOT-ASSESSED");
      expect(decision.post_disposition_state.promotion_state).toBe("NOT-PROMOTED");
      expect(decision.post_disposition_state.implementation_state).toBe("NOT-IMPLEMENTED");
    }
  });

  it("states its non-effects: no promotion, no completion, no EV-003, no conformance", () => {
    const nonEffects = record.non_effects.join(" ").toLowerCase();
    expect(nonEffects).toContain("hs-023 remains not-promoted");
    expect(nonEffects).toContain("pkg-001 remains partial");
    expect(nonEffects).toContain("ev-003 remains not-run");
    const haystack = JSON.stringify(record).toLowerCase();
    for (const claim of ["is wcag", "wcag compliant", "conformant", "section 508 compliant"]) {
      expect(haystack.includes(claim), claim).toBe(false);
    }
  });
});

describe("DEC-020 projections agree", () => {
  it("projects every candidate disposition into the generated Markdown", () => {
    expect(markdown).toContain("DEC-020");
    for (const decision of record.candidate_dispositions) {
      expect(markdown, decision.candidate_id).toContain(
        `- Owner disposition (DEC-020): ${decision.owner_disposition}`,
      );
      expect(markdown).toContain(decision.owner_rationale);
    }
    expect(markdown).not.toContain("not recorded");
  });

  it("records DEC-020 and EV-042 on the governance registers", () => {
    const decision = DECISIONS.find((entry) => entry.id === "DEC-020");
    expect(decision?.state).toBe("accepted");
    expect(decision?.decidedBy).toBe(record.recorded_by);
    expect(decision?.decidedOn).toBe(record.recorded_on);
    const evidence = EVIDENCE.find((entry) => entry.id === "EV-042");
    expect(evidence?.state).toBe("confirmed");
    expect(evidence?.doesNotSupport.toLowerCase()).toContain("wp-007 or gate a closed");
  });

  it("discharges FND-022 and carries the deferred gap forward as FND-023 only", () => {
    const fnd022 = FINDINGS.find((entry) => entry.id === "FND-022");
    expect(fnd022?.resolutionState).toBe("confirmed");
    expect(fnd022?.evidenceReferences).toContain("EV-042");

    const fnd023 = FINDINGS.find((entry) => entry.id === "FND-023");
    // Cycle 7 discharged FND-023 under DEC-021 without rewriting its prior text.
    expect(fnd023?.resolutionState).toBe("confirmed");
    expect(fnd023?.description).toContain(record.deferred_evidence_gap.candidate_id);
    expect(record.deferred_evidence_gap.finding_id).toBe("FND-023");
    const text = `${fnd023?.description ?? ""} ${fnd023?.boundary ?? ""}`.toLowerCase();
    expect(text).toContain("asserts no accessibility conformance");
    for (const claim of ["is wcag", "conformant"]) {
      expect(text.includes(claim), claim).toBe(false);
    }
  });

  it("keeps the program state aligned with the recorded disposition", () => {
    expect(PROGRAM_STATE.ownerDisposition.state).toBe("accepted");
    // Cycle 6 remains recorded; the current obligation source advanced to DEC-021.
    expect(PROGRAM_STATE.ownerDisposition.obligationSource.recordId).toBe("DEC-021");
    expect(PROGRAM_STATE.latestCheckpoint.checkpointId).toBe("CHECKPOINT-009");
    expect(PROGRAM_STATE.activeWorkPackage.state).toBe("active");
    expect(PROGRAM_STATE.gate.state).toBe("open");
    const unauthorized = PROGRAM_STATE.unauthorizedStages.map((entry) => entry.stageId);
    expect(unauthorized).toContain("WP-039");
    expect(unauthorized).toContain("CYCLE-8");
    expect(unauthorized).toContain("HREQ-IMPLEMENTATION");
  });

});
