/**
 * Contradiction tests for the role-first technology decision architecture.
 *
 * These are written to fail if the register drifts from its source, if derived
 * analysis is presented as supplied text, if the evaluator stops abstaining, or
 * if a planning surface starts implying authorization.
 */
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import registerJson from "../../data/technology-decisions/workflow-decisions.json";
import summarySource from "../../data/technology-decisions/sources.json";
import { evaluate, type DecisionAnswers, SOURCE_FIELDS } from "@/domain/technology-decisions";
import {
  DECISION_PROCESS,
  WORKFLOW_REGISTER,
  analyzedWorkflows,
  productAlphaAssessment,
  registerTotals,
  roleGroups,
} from "@/lib/technology-decision-registry";
import { ROUTE_REGISTRY } from "@/lib/route-registry";
import { renderRoute } from "./render-route";

const ANALYZED = analyzedWorkflows();

const UNKNOWN_ANSWERS = Object.fromEntries(
  DECISION_PROCESS.questions.map((question) => [question.question_id, "unknown"]),
) as unknown as DecisionAnswers;

describe("workflow register integrity", () => {
  it("carries every supplied row with all eighteen fields intact", () => {
    expect(WORKFLOW_REGISTER.records.length).toBe(registerJson.records.length);
    expect(WORKFLOW_REGISTER.field_order).toEqual([...SOURCE_FIELDS]);
    for (const record of WORKFLOW_REGISTER.records) {
      expect(Object.keys(record.source).sort()).toEqual([...SOURCE_FIELDS].sort());
    }
  });

  it("assigns a unique identifier to every workflow", () => {
    const ids = WORKFLOW_REGISTER.records.map((record) => record.workflow_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("traces every record to a registered source artifact, worksheet, row, and digest", () => {
    const artifactIds = new Set(summarySource.records.map((record) => record.source_artifact_id));
    for (const record of WORKFLOW_REGISTER.records) {
      expect(artifactIds.has(record.source_artifact_id)).toBe(true);
      expect(record.source_row).toBeGreaterThanOrEqual(2);
      expect(record.source_row_sha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("reconciles counted totals against the register totals, with both role counts explained", () => {
    const totals = registerTotals();
    expect(totals.workflows).toBe(WORKFLOW_REGISTER.records.length);
    expect(totals.groups).toBe(roleGroups().length);
    expect(totals.rolesCountedInGroups).toBe(WORKFLOW_REGISTER.totals.rolesCountedInGroups);
    expect(totals.rolesGloballyDistinct).toBe(WORKFLOW_REGISTER.totals.rolesGloballyDistinct);
    expect(totals.rolesCountedInGroups).toBeGreaterThanOrEqual(totals.rolesGloballyDistinct);
  });

  it("evaluates every record without a single unhandled row", () => {
    expect(ANALYZED.length).toBe(WORKFLOW_REGISTER.records.length);
    for (const item of ANALYZED) {
      expect(["resolved", "unresolved"]).toContain(item.evaluation.outcome);
      expect(item.evaluation.rationale.length).toBeGreaterThan(0);
    }
  });
});

describe("evaluator behaviour", () => {
  it("abstains rather than guessing when nothing is known", () => {
    const result = evaluate(UNKNOWN_ANSWERS);
    expect(result.outcome).toBe("unresolved");
    expect(result.optionIds).toEqual([]);
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });

  it("is deterministic: the same answers always produce the same result", () => {
    for (const item of ANALYZED.slice(0, 40)) {
      expect(evaluate(item.answers)).toEqual(item.evaluation);
    }
  });

  it("never permits AI to make a determination about a person", () => {
    const prohibited = ANALYZED.filter((item) => item.evaluation.aiBoundary === "prohibited");
    expect(prohibited.length).toBeGreaterThan(0);
    for (const item of prohibited) {
      expect(item.evaluation.optionIds).not.toContain("OPT-5");
    }
  });

  it("records drift instead of overwriting the supplied recommendation", () => {
    const disagreeing = ANALYZED.filter((item) => item.drift.status !== "agrees");
    expect(disagreeing.length).toBeGreaterThan(0);
    for (const item of disagreeing.slice(0, 20)) {
      expect(item.record.source.recommended_solution).toBe(
        registerJson.records.find((record) => record.workflow_id === item.record.workflow_id)!
          .source.recommended_solution,
      );
      expect(item.drift.explanation.length).toBeGreaterThan(0);
    }
  });
});

describe("product alpha fit assessment", () => {
  it("assesses every learning loop step and can still answer that it does not belong", () => {
    const { steps } = productAlphaAssessment();
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(["yes", "no", "partly", "only-as-a-view"]).toContain(step.belongs_in_ssls);
      expect(step.prohibited_interpretation.length).toBeGreaterThan(0);
    }
  });
});

describe("planning surfaces", () => {
  it("registers the planning route in the navigation registry", () => {
    const entry = ROUTE_REGISTRY.find((route) => route.path === "/technology-decisions");
    expect(entry).toBeDefined();
    expect(entry?.group).toBe("governance");
  });

  it("states planning scope and never implies authorization on the overview", async () => {
    await renderRoute("/technology-decisions");
    const notice = await screen.findByText(/Planning scope\./i);
    expect(notice.textContent).toMatch(/does not|Nothing on this page/i);
    expect(
      screen.getByRole("heading", { level: 1, name: "Role-First Technology Decisions" }),
    ).toBeInTheDocument();
  });

  it("shows derived analysis and supplied text in separate, labelled regions", async () => {
    const workflowId = ANALYZED[0]!.record.workflow_id;
    await renderRoute(`/technology-decisions/workflows/${workflowId}`);
    const derived = await screen.findByRole("heading", { name: /Derived analysis/i });
    const supplied = screen.getByRole("heading", { name: /Supplied analysis, verbatim/i });
    expect(derived).toBeInTheDocument();
    expect(supplied).toBeInTheDocument();
    expect(screen.getByText(/Recommended solution/i)).toBeInTheDocument();
  });

  it("recomputes the interactive evaluation without pretending to know unanswered questions", async () => {
    const user = userEvent.setup();
    await renderRoute("/technology-decisions/evaluate");
    const result = await screen.findByRole("heading", { name: /Minimum effective solution/i });
    const panel = result.parentElement as HTMLElement;
    expect(within(panel).getByText(/evaluator abstained/i)).toBeInTheDocument();

    const first = screen.getByLabelText(DECISION_PROCESS.questions[0]!.prompt);
    await user.selectOptions(first, "yes");
    expect(within(panel).getAllByText(/Option \d/).length).toBeGreaterThan(0);
  });
});

describe("no real people", () => {
  it("keeps the register free of contact details", () => {
    const serialized = JSON.stringify(registerJson);
    expect(serialized).not.toMatch(/@[a-z0-9.-]+\.(com|org|net|edu|gov)/i);
    expect(serialized).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/);
  });
});
