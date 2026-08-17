/**
 * Read helpers for the value stream registry.
 *
 * Nothing here blends axes, scores readiness, or reports progress. Counts are
 * counts. A count of modeled streams is not a measure of how ready anything is.
 */
import type { ValueStreamSearch } from "@/components/governance/value-stream-controls";
import {
  ENTERPRISE_FUNCTION_IDS,
  ENTERPRISE_FUNCTION_META,
  type DependencyRecord,
  type EnterpriseFunctionId,
  type HandoffContract,
  type ValueStream,
  type ValueStreamGate,
  type ValueStreamMetric,
} from "@/domain";

export function filterValueStreams(streams: ValueStream[], search: ValueStreamSearch): ValueStream[] {
  const q = search.q.trim().toLowerCase();

  return streams.filter((stream) => {
    if (search.status !== "all" && stream.operatingStatus !== search.status) return false;
    if (search.fn !== "all") {
      const involved =
        stream.primaryFunction === search.fn ||
        stream.supportingFunctions.includes(search.fn) ||
        stream.decisionAuthorities.includes(search.fn) ||
        stream.validationAuthorities.includes(search.fn) ||
        stream.stopAuthorities.includes(search.fn);
      if (!involved) return false;
    }
    if (search.maturity !== "all" && stream.currentMaturity !== search.maturity) return false;
    if (q.length === 0) return true;

    const haystack = [
      stream.name,
      stream.valueStreamId,
      stream.purpose,
      stream.description,
      stream.northStarContribution,
      stream.trigger,
      ...stream.stages.map((stage) => `${stage.name} ${stage.purpose}`),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function streamById(streams: ValueStream[], id: string): ValueStream | undefined {
  return streams.find((stream) => stream.valueStreamId === id);
}

export interface FunctionInvolvement {
  functionId: EnterpriseFunctionId;
  name: string;
  primaryFor: ValueStream[];
  supportingIn: ValueStream[];
  decidesIn: ValueStream[];
  validatesIn: ValueStream[];
  mayStop: ValueStream[];
}

export function functionInvolvement(streams: ValueStream[]): FunctionInvolvement[] {
  return ENTERPRISE_FUNCTION_IDS.map((functionId) => ({
    functionId,
    name: ENTERPRISE_FUNCTION_META[functionId].name,
    primaryFor: streams.filter((s) => s.primaryFunction === functionId),
    supportingIn: streams.filter((s) => s.supportingFunctions.includes(functionId)),
    decidesIn: streams.filter((s) => s.decisionAuthorities.includes(functionId)),
    validatesIn: streams.filter((s) => s.validationAuthorities.includes(functionId)),
    mayStop: streams.filter((s) => s.stopAuthorities.includes(functionId)),
  }));
}

/**
 * A function that both builds and validates the same stream. Recorded as an
 * exception to disclose, never silently resolved.
 */
export interface IndependenceException {
  stream: ValueStream;
  functionId: EnterpriseFunctionId;
  detail: string;
}

export function independenceExceptions(streams: ValueStream[]): IndependenceException[] {
  const exceptions: IndependenceException[] = [];
  for (const stream of streams) {
    for (const functionId of stream.validationAuthorities) {
      if (functionId === stream.primaryFunction) {
        exceptions.push({
          stream,
          functionId,
          detail: `${ENTERPRISE_FUNCTION_META[functionId].name} both runs and validates this stream. Any claim resting on that validation must disclose the exception.`,
        });
      }
    }
  }
  return exceptions;
}

export function recordsForStream(
  streamId: string,
  records: {
    gates: ValueStreamGate[];
    handoffs: HandoffContract[];
    dependencies: DependencyRecord[];
    metrics: ValueStreamMetric[];
  },
) {
  return {
    gates: records.gates.filter((gate) => gate.valueStreamId === streamId),
    handoffs: records.handoffs.filter((handoff) => handoff.sourceStageId.startsWith(`${streamId}-S`)),
    dependencies: records.dependencies.filter((dependency) => dependency.valueStreamId === streamId),
    metrics: records.metrics.filter((metric) => metric.valueStreamId === streamId),
  };
}

/** Streams that never appear as a learning destination close no loop for anyone else. */
export function learningLoopTargets(streams: ValueStream[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const stream of streams) {
    (map[stream.learningLoopDestination] ??= []).push(stream.valueStreamId);
  }
  return map;
}
