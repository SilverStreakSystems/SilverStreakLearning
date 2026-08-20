/**
 * View model for the value stream command surface.
 *
 * Search shape, defaults, and validated parsing live here rather than in the
 * component module so the component module exports components only. Moving
 * them changes no behaviour: the same constants, the same defaults, and the
 * same parser are re-used unchanged by the routes and the component module.
 */
import {
  ENTERPRISE_FUNCTION_IDS,
  SCALE_STAGES,
  STREAM_OPERATING_STATUS,
  type EnterpriseFunctionId,
  type ScaleStage,
  type StreamOperatingStatus,
} from "@/domain";

export const VALUE_STREAM_VIEWS = [
  { id: "registry", label: "Stream registry" },
  { id: "functions", label: "Functions and decision rights" },
  { id: "stages", label: "Stage and transition model" },
  { id: "gates", label: "Gates and refusal" },
  { id: "handoffs", label: "Handoffs" },
  { id: "dependencies", label: "Dependencies" },
  { id: "commitments", label: "Commitments" },
  { id: "metrics", label: "Metrics and prohibited measures" },
  { id: "burden", label: "Burden" },
  { id: "projections", label: "Command surface projections" },
  { id: "normalization", label: "Normalization findings" },
] as const;

export type ValueStreamView = (typeof VALUE_STREAM_VIEWS)[number]["id"];

export interface ValueStreamSearch {
  view: ValueStreamView;
  status: StreamOperatingStatus | "all";
  fn: EnterpriseFunctionId | "all";
  maturity: ScaleStage | "all";
  q: string;
}

export const DEFAULT_VALUE_STREAM_SEARCH: ValueStreamSearch = {
  view: "registry",
  status: "all",
  fn: "all",
  maturity: "all",
  q: "",
};

/* ------------------------------------------------------- search validation */

function option<T extends string>(value: unknown, allowed: readonly T[]): T | "all" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "all";
}

export function parseValueStreamSearch(search: Record<string, unknown>): ValueStreamSearch {
  const view = VALUE_STREAM_VIEWS.map((v) => v.id).includes(search["view"] as ValueStreamView)
    ? (search["view"] as ValueStreamView)
    : "registry";
  return {
    view,
    status: option(search["status"], STREAM_OPERATING_STATUS),
    fn: option(search["fn"], ENTERPRISE_FUNCTION_IDS),
    maturity: option(search["maturity"], SCALE_STAGES),
    q: typeof search["q"] === "string" ? search["q"] : "",
  };
}
