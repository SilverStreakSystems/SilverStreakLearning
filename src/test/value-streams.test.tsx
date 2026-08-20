import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderRoute } from "./render-route";
import {
  VALUE_STREAMS,
  VALUE_STREAM_BURDENS,
  VALUE_STREAM_COMMITMENTS,
  VALUE_STREAM_DEPENDENCIES,
  VALUE_STREAM_GATES,
  VALUE_STREAM_HANDOFFS,
  VALUE_STREAM_METRICS,
  VALUE_STREAM_NORMALIZATION_FINDINGS,
  VALUE_STREAM_PROJECTIONS,
  VALUE_STREAM_REFUSALS,
  VALUE_STREAM_TRANSITIONS,
} from "@/fixtures";
import {
  FUNCTION_NAMES_ALIGNED,
  ENTERPRISE_FUNCTION_IDS,
  PROHIBITED_METRICS,
  commitmentsWithoutAuthority,
  gateAllowsAdvance,
  isHandoffComplete,
  metricsMissingProhibitedInterpretation,
  refusalsMissingResolution,
  unjustifiedTransfers,
  validateDecisionPoints,
  validateGates,
  validateHandoffs,
  validateStages,
  validateTransitions,
  validateValueStreams,
} from "@/domain";
import { independenceExceptions } from "@/lib/value-stream-queries";

const allStages = VALUE_STREAMS.flatMap((stream) => stream.stages);
const allDecisionPoints = allStages.flatMap((stage) => stage.decisionPoints);

describe("value stream registry shape", () => {
  it("seeds the eighteen priority streams with unique identifiers", () => {
    expect(VALUE_STREAMS).toHaveLength(18);
    const ids = VALUE_STREAMS.map((stream) => stream.valueStreamId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("passes every value stream invariant", () => {
    expect(validateValueStreams(VALUE_STREAMS)).toEqual([]);
  });

  it("gives every stream a stop authority and a learning destination", () => {
    for (const stream of VALUE_STREAMS) {
      expect(stream.stopAuthorities.length, stream.valueStreamId).toBeGreaterThan(0);
      expect(stream.learningLoopDestination.length, stream.valueStreamId).toBeGreaterThan(0);
    }
  });

  it("keeps every learning destination pointing at a real stream", () => {
    const ids = new Set(VALUE_STREAMS.map((stream) => stream.valueStreamId));
    for (const stream of VALUE_STREAMS) {
      expect(ids.has(stream.learningLoopDestination), stream.valueStreamId).toBe(true);
    }
  });

  it("uses the fifteen canonical enterprise functions", () => {
    expect(ENTERPRISE_FUNCTION_IDS).toHaveLength(15);
    expect(FUNCTION_NAMES_ALIGNED).toBe(true);
  });
});

describe("stage and transition discipline", () => {
  it("passes every stage invariant", () => {
    expect(validateStages(allStages)).toEqual([]);
  });

  it("never lets completion of the previous stage be the only entry criterion", () => {
    for (const stage of allStages) {
      const onlyCriterion =
        stage.entryCriteria.length === 1 ? stage.entryCriteria[0]!.toLowerCase() : "";
      expect(onlyCriterion.includes("previous stage complete"), stage.stageId).toBe(false);
    }
  });

  it("assigns exactly one decision authority at every decision point", () => {
    expect(validateDecisionPoints(allDecisionPoints)).toEqual([]);
    for (const point of allDecisionPoints) {
      const deciders = point.assignments.filter((assignment) => assignment.right === "decide");
      expect(deciders, point.decisionPointId).toHaveLength(1);
    }
  });

  it("passes every state transition invariant and never claims enforcement", () => {
    expect(validateTransitions(VALUE_STREAM_TRANSITIONS)).toEqual([]);
    for (const transition of VALUE_STREAM_TRANSITIONS) {
      expect(transition.enforced, transition.transitionId).toBe(false);
      expect(transition.refusalState.length).toBeGreaterThan(0);
    }
  });
});

describe("gates, handoffs, and refusal", () => {
  it("passes every gate invariant and gives each gate a stop condition", () => {
    expect(validateGates(VALUE_STREAM_GATES)).toEqual([]);
    for (const gate of VALUE_STREAM_GATES) {
      expect(gate.stopConditions.length, gate.gateId).toBeGreaterThan(0);
    }
  });

  it("treats refuse, hold, and block as dispositions that do not advance work", () => {
    expect(gateAllowsAdvance("refused")).toBe(false);
    expect(gateAllowsAdvance("hold")).toBe(false);
    expect(gateAllowsAdvance("blocked")).toBe(false);
  });

  it("shows at least one worked refusal or hold in the seeded gates", () => {
    const stopped = VALUE_STREAM_GATES.filter(
      (gate) => !gateAllowsAdvance(gate.exampleDisposition),
    );
    expect(stopped.length).toBeGreaterThan(0);
  });

  it("passes every handoff invariant and never completes without receiver acceptance", () => {
    expect(validateHandoffs(VALUE_STREAM_HANDOFFS)).toEqual([]);
    for (const handoff of VALUE_STREAM_HANDOFFS) {
      if (!handoff.receiverAccepted) {
        expect(isHandoffComplete(handoff), handoff.handoffId).toBe(false);
      }
    }
  });

  it("gives every refusal a resolution path", () => {
    expect(refusalsMissingResolution(VALUE_STREAM_REFUSALS)).toEqual([]);
    expect(VALUE_STREAM_REFUSALS.length).toBeGreaterThan(0);
  });
});

describe("dependencies, commitments, metrics, and burden", () => {
  it("records a review date and escalation on every dependency", () => {
    for (const dependency of VALUE_STREAM_DEPENDENCIES) {
      expect(dependency.reviewDate.length, dependency.dependencyId).toBeGreaterThan(0);
      expect(dependency.escalation.length, dependency.dependencyId).toBeGreaterThan(0);
    }
  });

  it("requires a source authority on every commitment", () => {
    expect(commitmentsWithoutAuthority(VALUE_STREAM_COMMITMENTS)).toEqual([]);
  });

  it("states a prohibited interpretation for every metric", () => {
    expect(metricsMissingProhibitedInterpretation(VALUE_STREAM_METRICS)).toEqual([]);
  });

  it("never seeds a prohibited surveillance measure", () => {
    const names = VALUE_STREAM_METRICS.map((metric) => metric.name.toLowerCase());
    for (const prohibited of PROHIBITED_METRICS) {
      expect(names).not.toContain(prohibited.toLowerCase());
    }
  });

  it("offsets or mitigates burden placed on people the product serves", () => {
    expect(unjustifiedTransfers(VALUE_STREAM_BURDENS)).toEqual([]);
  });
});

describe("authority is declared, never derived", () => {
  it("keeps gated future streams free of any implementation claim", () => {
    for (const stream of VALUE_STREAMS.filter((s) => s.operatingStatus === "gated-future")) {
      expect(stream.implementationStatus, stream.valueStreamId).toBe("not-implemented");
    }
  });

  it("models the AI capability lifecycle only as gated future architecture", () => {
    const ai = VALUE_STREAMS.find((stream) => stream.valueStreamId === "ai-capability-lifecycle");
    expect(ai).toBeDefined();
    expect(ai!.operatingStatus).toBe("gated-future");
    expect(ai!.implementationStatus).toBe("not-implemented");
  });

  it("declares every projection contract read-only and inactive", () => {
    for (const projection of VALUE_STREAM_PROJECTIONS) {
      expect(projection.readOnlyProjection).toBe(true);
      expect(projection.active).toBe(false);
      expect(projection.panels.length).toBeGreaterThan(0);
    }
  });

  it("exposes independence exceptions rather than hiding them", () => {
    const exceptions = independenceExceptions(VALUE_STREAMS);
    for (const exception of exceptions) {
      expect(exception.detail).toMatch(/disclose/i);
    }
  });

  it("records a judgment and a consequence on every normalization finding", () => {
    expect(VALUE_STREAM_NORMALIZATION_FINDINGS.length).toBeGreaterThanOrEqual(10);
    for (const finding of VALUE_STREAM_NORMALIZATION_FINDINGS) {
      expect(finding.judgment.length, finding.findingId).toBeGreaterThan(0);
      expect(finding.consequence.length, finding.findingId).toBeGreaterThan(0);
    }
  });
});

describe("value stream surfaces", () => {
  it("renders the registry with one H1 and a synthetic marker", async () => {
    await renderRoute("/value-streams");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Enterprise Value Stream Architecture (Candidate)");
    expect(screen.getAllByText("Synthetic example").length).toBeGreaterThan(0);
  });

  it("renders a stream detail page with its stages and gates", async () => {
    await renderRoute("/value-streams/research-requirement");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2, name: /Stages/ })).toBeInTheDocument();
  });

  it("marks the gated AI stream as target state on its detail page", async () => {
    await renderRoute("/value-streams/ai-capability-lifecycle");
    expect(screen.getAllByText(/Target-state candidate/i).length).toBeGreaterThan(0);
  });
});
