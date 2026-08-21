/**
 * Drift mechanism calibration tests.
 *
 * These prove the mechanism, not the conclusions. A passing suite says the
 * comparison is computed honestly and that no generated artefact can carry an
 * owner decision. It says nothing about whether any given recommendation is
 * right.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import analysisJson from "../../data/technology-decisions/generated/drift-analysis.json";
import sampleJson from "../../data/technology-decisions/generated/drift-sample.json";
import {
  buildProposalBatches,
  compareRecommendation,
  contentFingerprint,
  evaluate,
  parseSourceRecommendation,
  selectRepresentativeSample,
  sha256Hex,
  stableStringify,
} from "@/domain/technology-decisions";
import {
  driftAnalysisDocument,
  driftAnalysisRecords,
  mandatoryCohort,
  negativeControls,
  nonIdenticalRecords,
  representativeSample,
  samplePopulation,
} from "@/lib/technology-decision-drift";
import {
  WORKFLOW_REGISTER,
  analysisFingerprint,
  analyzedWorkflows,
} from "@/lib/technology-decision-registry";
import { applyReviewFilters } from "@/lib/drift-review-view";
import { ComparisonPanel, ReviewQueueTable } from "@/components/technology-decisions/drift-review";

const RECORDS = driftAnalysisRecords();

describe("fingerprinting", () => {
  it("produces the published SHA-256 vector", () => {
    expect(sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("ignores key order but not values", () => {
    expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
    expect(contentFingerprint({ a: 1 })).not.toBe(contentFingerprint({ a: 2 }));
  });
});

describe("source parsing", () => {
  it("does not treat a staged option as a present commitment", () => {
    const expression = parseSourceRecommendation(
      "Option 2 + 3 now: validated tracker with scripted alerts; Option 4 as initiatives scale",
    );
    expect(expression.primaryOptionIds).toEqual(["OPT-2", "OPT-3"]);
    expect(expression.deferredOptionIds).toEqual(["OPT-4"]);
  });

  it("separates an optional reference from the recommendation", () => {
    const expression = parseSourceRecommendation(
      "Option 2 + 3: templated report with scripted merge; optional bounded AI drafting (Option 6)",
    );
    expect(expression.primaryOptionIds).toEqual(["OPT-2", "OPT-3"]);
    expect(expression.deferredOptionIds).toEqual(["OPT-6"]);
  });

  it("records an interim option separately from the committed one", () => {
    const expression = parseSourceRecommendation(
      "Option 4: SSLS decisions module; Option 2 + 3 workbook as interim",
    );
    expect(expression.primaryOptionIds).toEqual(["OPT-4"]);
    expect(expression.deferredOptionIds).toEqual(["OPT-2", "OPT-3"]);
  });

  it("keeps 'or' distinct from 'then' and refuses to collapse either", () => {
    const alternatives = parseSourceRecommendation("Option 2 or Option 4 for the register");
    const ordered = parseSourceRecommendation("Option 2 then Option 4 once volume grows");
    expect(alternatives.expressionType).toBe("UNORDERED-ALTERNATIVES");
    expect(ordered.expressionType).toBe("ORDERED-PREFERENCE");
    expect(alternatives.parseStatus).toBe("ambiguous");
    expect(ordered.parseStatus).toBe("ambiguous");
  });

  it("never decomposes Option 6 into Option 2 plus Option 5", () => {
    const expression = parseSourceRecommendation("Option 6: governed hybrid with human approval");
    expect(expression.expressionType).toBe("HYBRID");
    expect(expression.primaryOptionIds).toEqual(["OPT-6"]);
  });

  it("preserves an explicit exclusion", () => {
    const expression = parseSourceRecommendation("Option 2 + 3 only; not Option 5");
    expect(expression.excludedOptionIds).toEqual(["OPT-5"]);
    expect(expression.primaryOptionIds).not.toContain("OPT-5");
  });

  it("fails into an unresolved state when no option is named", () => {
    const expression = parseSourceRecommendation("Keep doing what the team already does.");
    expect(expression.parseStatus).toBe("unparseable");
    expect(expression.primaryOptionIds).toEqual([]);
  });

  it("stores the supplied wording verbatim for every register row", () => {
    for (const item of analyzedWorkflows()) {
      expect(item.expression.verbatim).toBe(item.record.source.recommended_solution);
    }
  });

  it("gives every distinct source form a documented parse outcome", () => {
    const forms = new Set(analyzedWorkflows().map((item) => item.expression.expressionType));
    expect(forms.size).toBeGreaterThan(1);
    for (const item of analyzedWorkflows()) {
      expect(item.expression.diagnostics.length + item.expression.references.length).toBeGreaterThan(
        0,
      );
    }
  });
});

describe("comparison", () => {
  const evaluation = (optionIds: string[]) =>
    ({
      outcome: "resolved",
      optionIds,
      decidedAtStep: "STEP-APPLICATION",
      rationale: [],
      unresolvedQuestions: [],
      aiBoundary: "unnecessary",
      requiresNamedApprover: false,
      invariantsApplied: [],
    }) as never;

  it("does not create drift from ordering alone", () => {
    const expression = parseSourceRecommendation("Option 3 + 2: scripted workbook");
    expect(compareRecommendation(expression, evaluation(["OPT-2", "OPT-3"])).relation).toBe("EXACT");
  });

  it("resolves exactly one relation per record", () => {
    for (const item of analyzedWorkflows()) {
      expect(typeof item.comparison.relation).toBe("string");
      expect(item.comparison.identical).toBe(item.comparison.relation === "EXACT");
    }
  });

  it("reports abstention as abstention, not as disagreement", () => {
    const abstained = analyzedWorkflows().filter(
      (item) => item.evaluation.outcome === "unresolved",
    );
    expect(abstained.length).toBeGreaterThan(0);
    for (const item of abstained) {
      expect(item.comparison.relation).toBe("DERIVED-ABSTAIN");
      expect(item.comparison.comparable).toBe(false);
    }
  });

  it("keeps the legacy status a faithful projection of the relation", () => {
    for (const item of analyzedWorkflows()) {
      if (item.comparison.relation === "EXACT") expect(item.drift.status).toBe("agrees");
      if (item.comparison.relation === "DERIVED-ABSTAIN") {
        expect(item.drift.status).toBe("derived-unresolved");
      }
    }
  });
});

describe("evaluator and safety", () => {
  it("derives options only from the TDP option identifiers", () => {
    const valid = ["OPT-1", "OPT-2", "OPT-3", "OPT-4", "OPT-5", "OPT-6", "OPT-7"];
    for (const record of RECORDS) {
      for (const optionId of record.derived_option_ids) expect(valid).toContain(optionId);
    }
  });

  it("never recommends AI for a consequential determination about a person", () => {
    for (const record of RECORDS) {
      if (!record.consequential) continue;
      expect(record.ai_boundary).toBe("prohibited");
      expect(record.derived_option_ids).not.toContain("OPT-5");
      expect(record.derived_option_ids).not.toContain("OPT-6");
    }
  });

  it("keeps the source AI-prohibited count distinct from the applied guard count", () => {
    const sourceProhibited = WORKFLOW_REGISTER.records.filter((record) =>
      /prohibit/i.test(record.source.ai_necessity),
    ).length;
    const guardApplied = RECORDS.filter((record) => record.ai_boundary === "prohibited").length;
    expect(sourceProhibited).toBe(32);
    expect(guardApplied).toBe(106);
    expect(sourceProhibited).not.toBe(guardApplied);
  });

  it("cannot read a maturity value", () => {
    const withMaturity = WORKFLOW_REGISTER.records.find(
      (record) => record.source.future_maturity_provisional.trim().length > 0,
    );
    expect(withMaturity).toBeDefined();
    const answers = analyzedWorkflows().find(
      (item) => item.record.workflow_id === withMaturity?.workflow_id,
    )!.answers;
    expect(stableStringify(answers)).not.toContain(
      withMaturity!.source.future_maturity_provisional,
    );
  });

  it("cannot read the supplied recommendation", () => {
    const item = analyzedWorkflows()[0]!;
    const before = evaluate(item.answers);
    expect(before).toEqual(item.evaluation);
  });

  it("leaves Option 7 reachable", () => {
    const reached = RECORDS.some((record) => record.derived_option_ids.includes("OPT-7"));
    const humanSufficient = RECORDS.some((record) =>
      record.decision_drivers.includes("HUMAN-PROCESS-SUFFICIENT"),
    );
    expect(reached || humanSufficient).toBe(true);
  });
});

describe("memoization", () => {
  it("keys the analysis to its inputs rather than to module lifetime", () => {
    const first = analysisFingerprint();
    expect(analyzedWorkflows()).toBe(analyzedWorkflows());
    expect(analysisFingerprint()).toBe(first);
    expect(contentFingerprint({ ...WORKFLOW_REGISTER, records: [] })).not.toBe(first);
  });
});

describe("analysis records", () => {
  it("covers every workflow and every non-identical record", () => {
    expect(RECORDS).toHaveLength(WORKFLOW_REGISTER.records.length);
    expect(nonIdenticalRecords().length).toBe(
      RECORDS.filter((record) => record.comparison_relation !== "EXACT").length,
    );
  });

  it("never carries an owner disposition", () => {
    for (const record of [...RECORDS, ...analysisJson.records]) {
      expect(record.owner_disposition).toBeNull();
      expect(record.review_status).toBe("NOT-REVIEWED");
      expect(record.owner_decision_id).toBeNull();
    }
  });

  it("declares itself non-authoritative", () => {
    expect(analysisJson.authority_status).toBe("GENERATED-NONAUTHORITATIVE");
    expect(sampleJson.authority_status).toBe("GENERATED-NONAUTHORITATIVE");
  });

  it("regenerating the document reproduces the committed fingerprint", () => {
    expect(driftAnalysisDocument().generation_fingerprint).toBe(analysisJson.generation_fingerprint);
  });

  it("proposes nothing where the evidence does not support a reading", () => {
    for (const record of RECORDS) {
      if (record.evidence_state === "MISSING" || record.evidence_state === "CONTRADICTORY") {
        expect(["NEEDS-EVIDENCE", "OWNER-POLICY-DECISION"]).toContain(record.proposed_resolution);
      }
    }
  });

  it("puts every high-risk, consequential, or AI-boundary record in individual review", () => {
    for (const record of nonIdenticalRecords()) {
      if (record.risk_level === "high" || record.consequential) {
        expect(record.mandatory_review).toBe(true);
        expect(record.batch_eligible).toBe(false);
      }
    }
  });
});

describe("batching", () => {
  it("only batches records whose basis fingerprint is identical", () => {
    for (const batch of buildProposalBatches(RECORDS)) {
      const members = RECORDS.filter((record) =>
        batch.member_workflow_ids.includes(record.workflow_id),
      );
      expect(members.length).toBeGreaterThan(1);
      for (const member of members) {
        expect(member.proposal_basis_fingerprint).toBe(batch.proposal_basis_fingerprint);
        expect(member.mandatory_review).toBe(false);
      }
    }
  });

  it("excludes a record whose basis differs in a single dimension", () => {
    const base = RECORDS.find((record) => record.batch_eligible)!;
    const twin = { ...base, workflow_id: "TDW-A-999", risk_level: "high" as const };
    const batches = buildProposalBatches([base, twin]);
    for (const batch of batches) expect(batch.member_workflow_ids).not.toContain("TDW-A-999");
  });
});

describe("sampling", () => {
  it("is invariant under row order", () => {
    const population = samplePopulation();
    const reversed = [...population].reverse();
    expect(selectRepresentativeSample(reversed, 48, 36).selected.map((s) => s.workflow_id)).toEqual(
      selectRepresentativeSample(population, 48, 36).selected.map((s) => s.workflow_id),
    );
  });

  it("never samples a mandatory-review record", () => {
    const mandatoryIds = new Set(mandatoryCohort().map((record) => record.workflow_id));
    for (const entry of representativeSample().selected) {
      expect(mandatoryIds.has(entry.workflow_id)).toBe(false);
    }
  });

  it("stays within its declared bounds and matches the committed sample", () => {
    const sample = representativeSample();
    expect(sample.selected.length).toBeGreaterThanOrEqual(36);
    expect(sample.selected.length).toBeLessThanOrEqual(48);
    expect(sample.population_fingerprint).toBe(
      sampleJson.representative_sample.population_fingerprint,
    );
  });

  it("draws negative controls only from agreements", () => {
    for (const record of negativeControls()) {
      expect(record.comparison_relation).toBe("EXACT");
    }
  });
});

describe("review surfaces", () => {
  it("filters the queue without resolving anything", () => {
    const mandatory = applyReviewFilters(nonIdenticalRecords(), {
      relation: "all",
      risk: "all",
      group: "all",
      cohort: "mandatory",
    });
    expect(mandatory.length).toBe(mandatoryCohort().length);
    for (const record of mandatory) expect(record.review_status).toBe("NOT-REVIEWED");
  });

  it("shows the supplied wording and the derived reading separately", () => {
    const record = nonIdenticalRecords()[0]!;
    render(<ComparisonPanel record={record} />);
    expect(screen.getByText(record.source_recommendation_verbatim)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Derived result" })).toBeInTheDocument();
    expect(screen.getByText(/OWNER REVIEW PENDING/)).toBeInTheDocument();
  });

  it("states review status in words, not by colour alone", () => {
    render(<ReviewQueueTable records={nonIdenticalRecords().slice(0, 3)} />);
    expect(screen.getAllByText("Not reviewed").length).toBe(3);
  });
});
