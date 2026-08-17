/**
 * Value stream fixture aggregation.
 *
 * All 18 priority streams are candidate reference architecture. The AI
 * Capability Lifecycle is gated-future and is not implemented.
 */
import type { ValueStream } from "@/domain";
import { linkStreamRecords } from "./build";
import { GOVERNANCE_VALUE_STREAMS } from "./streams-governance";
import { OUTCOME_VALUE_STREAMS } from "./streams-market";
import { OPERATING_VALUE_STREAMS } from "./streams-operations";
import {
  buildDependencies,
  buildGates,
  buildHandoffs,
  buildMetrics,
  VALUE_STREAM_BURDENS,
  VALUE_STREAM_COMMITMENTS,
  VALUE_STREAM_ESCALATIONS,
  VALUE_STREAM_REFUSALS,
  VALUE_STREAM_TRANSITIONS,
} from "./records";

const seeded: ValueStream[] = [
  ...GOVERNANCE_VALUE_STREAMS,
  ...OUTCOME_VALUE_STREAMS,
  ...OPERATING_VALUE_STREAMS,
];

export const VALUE_STREAM_GATES = buildGates(seeded);
export const VALUE_STREAM_HANDOFFS = buildHandoffs(seeded);
export const VALUE_STREAM_DEPENDENCIES = buildDependencies(seeded);
export const VALUE_STREAM_METRICS = buildMetrics(seeded);

function group<T>(items: T[], key: (item: T) => string, id: (item: T) => string) {
  const map: Record<string, string[]> = {};
  for (const item of items) {
    (map[key(item)] ??= []).push(id(item));
  }
  return map;
}

export const VALUE_STREAMS: ValueStream[] = linkStreamRecords(seeded, {
  gateIds: group(VALUE_STREAM_GATES, (g) => g.valueStreamId, (g) => g.gateId),
  dependencyIds: group(VALUE_STREAM_DEPENDENCIES, (d) => d.valueStreamId, (d) => d.dependencyId),
  handoffIds: group(
    VALUE_STREAM_HANDOFFS,
    (h) => h.sourceStageId.replace(/-S\d\d$/, ""),
    (h) => h.handoffId,
  ),
  metricIds: group(VALUE_STREAM_METRICS, (m) => m.valueStreamId, (m) => m.metricId),
});

export {
  VALUE_STREAM_BURDENS,
  VALUE_STREAM_COMMITMENTS,
  VALUE_STREAM_ESCALATIONS,
  VALUE_STREAM_REFUSALS,
  VALUE_STREAM_TRANSITIONS,
};
export { buildValueStream } from "./build";
