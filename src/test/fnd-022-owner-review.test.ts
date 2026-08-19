import { describe, expect, it } from "vitest";

import { loadHistoricalRequirementFile } from "@/lib/historical-requirement-registry";
import { loadRestatementIndexFile } from "@/lib/restatement-registry";
import {
  OWNER_REVIEW_OPTIONS,
  UNMATCHED_CONCLUSION,
  loadOwnerDispositionFile,
  loadOwnerReviewFile,
  loadOwnerReviewSchema,
} from "@/lib/fnd-022-review-registry";

const packet = loadOwnerReviewFile();
const index = loadRestatementIndexFile();
const requirements = loadHistoricalRequirementFile().records;
const dispositions = loadOwnerDispositionFile();

describe("FND-022 owner review packet — structure", () => {
  it("declares the schema version the schema file declares", () => {
    const schema = loadOwnerReviewSchema() as { schema_version: string };
    expect(packet.schema_version).toBe(schema.schema_version);
  });

  it("presents every Cycle 4 candidate exactly once", () => {
    const ids = packet.candidates.map((c) => c.candidate_id);
    expect(ids).toEqual([...new Set(ids)]);
    const expected = requirements
      .filter((r) => r.source_id === "HS-023")
      .map((r) => r.requirement_id);
    expect(ids.sort()).toEqual(expected.sort());
    expect(ids).toHaveLength(packet.reconciliation.candidate_count);
  });

  it("quotes each candidate verbatim from the governed requirement record", () => {
    for (const candidate of packet.candidates) {
      const record = requirements.find((r) => r.requirement_id === candidate.candidate_id);
      expect(record, candidate.candidate_id).toBeDefined();
      expect(candidate.exact_text).toBe(record!.original_wording);
      expect(candidate.source_id).toBe(record!.source_id);
      expect(candidate.source_locator).toBe(record!.source_locator);
      expect(candidate.requirement_family).toBe(record!.requirement_family);
      expect(candidate.modality_as_worded).toBe(record!.modality);
      expect(candidate.current_status.disposition).toBe(record!.disposition);
      expect(candidate.current_status.conformance_state).toBe(record!.conformance_state);
    }
  });

  it("presents every restatement row and preserves its Cycle 4 classification", () => {
    expect(packet.restatement_review_rows).toHaveLength(index.relations.length);
    for (const row of packet.restatement_review_rows) {
      const source = index.relations.find((r) => r.relation_id === row.relation_id);
      expect(source, row.relation_id).toBeDefined();
      expect(row.relationship_classification).toBe(source!.relationship);
      expect(row.historical_candidate).toBe(source!.subject_requirement);
      expect(row.mapped_current_requirement).toBe(source!.related_requirement);
      expect(row.classification_rationale).toBe(source!.basis);
      expect(row.cycle4_classification_preserved).toBe(true);
    }
  });

  it("lists the unmatched current candidates without counting them as rows", () => {
    expect(packet.unmatched_current_candidates.map((u) => u.requirement_id).sort()).toEqual(
      index.unmatched_related_candidates.map((u) => u.requirement_id).sort(),
    );
    expect(packet.reconciliation.unmatched_counted_in_rows).toBe(false);
    expect(packet.reconciliation.unmatched_count).toBe(packet.unmatched_current_candidates.length);
  });

  it("reconciles its declared totals with the governed registers", () => {
    for (const [relationship, total] of Object.entries(packet.reconciliation.relationship_totals)) {
      expect(index.relations.filter((r) => r.relationship === relationship)).toHaveLength(total);
    }
    expect(packet.reconciliation.restatement_row_count).toBe(index.relations.length);
  });
});

describe("FND-022 owner review packet — transcribes DEC-020 and originates nothing", () => {
  it("names DEC-020 and the canonical disposition record as the source of every owner field", () => {
    expect(packet.owner_decision.decision_id).toBe(dispositions.decision_id);
    expect(packet.owner_decision.recorded_on).toBe(dispositions.recorded_on);
    expect(packet.owner_decision.recorded_by).toBe(dispositions.recorded_by);
    expect(packet.owner_decision.canonical_record).toBe(
      "data/historical/fnd-022-owner-dispositions.json",
    );
  });

  it("transcribes every candidate disposition and rationale unchanged", () => {
    expect(packet.candidates).toHaveLength(dispositions.candidate_dispositions.length);
    for (const candidate of packet.candidates) {
      const decision = dispositions.candidate_dispositions.find(
        (d) => d.candidate_id === candidate.candidate_id,
      );
      expect(decision, candidate.candidate_id).toBeDefined();
      expect(candidate.owner_disposition).toBe(decision!.owner_disposition);
      expect(candidate.owner_rationale).toBe(decision!.owner_rationale);
      expect(candidate.exact_text).toBe(decision!.exact_text);
    }
  });

  it("transcribes every relationship-row conclusion and unmatched conclusion unchanged", () => {
    for (const row of packet.restatement_review_rows) {
      const decision = dispositions.relationship_row_conclusions.find(
        (d) => d.relation_id === row.relation_id,
      );
      expect(decision, row.relation_id).toBeDefined();
      expect(row.owner_disposition).toBe(decision!.owner_conclusion);
      expect(row.relationship_classification).toBe(decision!.cycle4_classification);
    }
    for (const unmatched of packet.unmatched_current_candidates) {
      const decision = dispositions.unmatched_conclusions.find(
        (d) => d.requirement_id === unmatched.requirement_id,
      );
      expect(decision, unmatched.requirement_id).toBeDefined();
      expect(unmatched.owner_disposition).toBe(UNMATCHED_CONCLUSION);
      expect(unmatched.owner_rationale).toBe(decision!.owner_rationale);
    }
  });

  it("keeps every owner value inside the presented option vocabulary", () => {
    for (const item of [...packet.candidates, ...packet.restatement_review_rows]) {
      expect(item.owner_options).toEqual([...OWNER_REVIEW_OPTIONS]);
      expect(OWNER_REVIEW_OPTIONS).toContain(item.owner_disposition);
    }
  });

  it("labels every recommendation as non-binding executor analysis", () => {
    for (const candidate of packet.candidates) {
      expect(candidate.advisory_recommendation.startsWith("NON-BINDING advisory: ")).toBe(true);
      expect(candidate.advisory_rationale.startsWith("NON-BINDING analysis only. ")).toBe(true);
      const value = candidate.advisory_recommendation.replace("NON-BINDING advisory: ", "");
      expect(OWNER_REVIEW_OPTIONS).toContain(value as (typeof OWNER_REVIEW_OPTIONS)[number]);
    }
  });

  it("does not promote the source or the package", () => {
    for (const candidate of packet.candidates) {
      expect(candidate.current_status.inherited_authority).toBe("HISTORICAL-EVIDENCE");
      expect(candidate.current_status.promotion_state).toBe("NOT-PROMOTED");
      expect(candidate.current_status.conformance_state).toBe("NOT-ASSESSED");
      expect(candidate.package_completeness).toBe("PARTIAL");
    }
    expect(packet.entry_state["hs_023"]).toBe("NOT-PROMOTED");
    expect(packet.entry_state["pkg_001"]).toBe("PARTIAL");
  });

  it("keeps the work package and the gate open", () => {
    expect(packet.entry_state["wp_007"]).toBe("ACTIVE");
    expect(packet.entry_state["gate_a"]).toBe("OPEN");
    expect(packet.entry_state["wp_039"]).toBe("NOT AUTHORIZED");
  });

  it("asserts no accessibility conformance anywhere in the packet", () => {
    const haystack = JSON.stringify(packet).toLowerCase();
    for (const claim of ["is wcag", "wcag compliant", "conformant", "section 508 compliant"]) {
      expect(haystack.includes(claim), claim).toBe(false);
    }
  });

  it("states its refusals, including originating any disposition of its own", () => {
    expect(packet.refused_in_this_cycle.length).toBeGreaterThanOrEqual(5);
    const refusals = packet.refused_in_this_cycle.join(" ").toLowerCase();
    expect(refusals).toContain("originating, simulating, or inferring any owner disposition");
    expect(refusals).toContain("closing wp-007 or gate a");
    expect(refusals).toContain("implementing, satisfying, testing, or assessing any adopted");
  });
});
