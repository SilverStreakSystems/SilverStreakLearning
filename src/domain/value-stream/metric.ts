/**
 * Value stream metrics.
 *
 * Every metric states the question it answers and the interpretation it does
 * not support. No metric is combined into a single enterprise readiness score,
 * and no metric measures an individual person's activity.
 */
import type { EnterpriseFunctionId } from "./functions";

export const METRIC_CLASSES = ["flow", "quality", "evidence", "outcome"] as const;
export type MetricClass = (typeof METRIC_CLASSES)[number];

export const METRIC_CLASS_LABEL: Record<MetricClass, string> = {
  flow: "Flow",
  quality: "Quality",
  evidence: "Evidence",
  outcome: "Outcome",
};

export interface ValueStreamMetric {
  metricId: string;
  valueStreamId: string;
  /** Null when the metric spans the whole stream. */
  stageId: string | null;
  metricClass: MetricClass;
  name: string;
  questionAnswered: string;
  source: string;
  numerator: string | null;
  denominator: string | null;
  calculation: string;
  freshness: string;
  owner: EnterpriseFunctionId;
  interpretation: string;
  prohibitedInterpretation: string;
  actionTriggered: string;
  perverseIncentiveRisk: string;
}

/**
 * Measures that are refused by design. These are not thresholds to tune; they
 * are surveillance patterns that will not be built.
 */
export const PROHIBITED_METRICS = [
  "keystroke counts",
  "mouse or screen activity monitoring",
  "arbitrary activity counts as productivity",
  "individual productivity scores",
  "individual ranking of staff",
  "time-at-keyboard measures",
  "blended enterprise readiness percentage",
  "single composite maturity score",
] as const;

export type ProhibitedMetric = (typeof PROHIBITED_METRICS)[number];

export const PROHIBITED_METRIC_REASON: Record<ProhibitedMetric, string> = {
  "keystroke counts": "Measures presence, not contribution, and constitutes surveillance.",
  "mouse or screen activity monitoring": "Surveillance of people rather than measurement of work.",
  "arbitrary activity counts as productivity": "Rewards visible motion over completed governed work.",
  "individual productivity scores": "Collapses judgment-heavy work into a false comparable number.",
  "individual ranking of staff": "Creates competition where coordination is required.",
  "time-at-keyboard measures": "Penalizes thinking, reading, and collaboration.",
  "blended enterprise readiness percentage": "Hides stop-ship gates behind an average.",
  "single composite maturity score": "Merges independent axes that must stay separately visible.",
};

export function metricsMissingProhibitedInterpretation(metrics: ValueStreamMetric[]): ValueStreamMetric[] {
  return metrics.filter((m) => m.prohibitedInterpretation.trim() === "");
}
