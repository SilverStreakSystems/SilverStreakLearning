/**
 * View model for the capability command surface.
 *
 * Search shape, defaults, and validated parsing live here rather than in the
 * component module so the component module exports components only. Moving
 * them changes no behaviour: the same constants, the same defaults, and the
 * same parser are re-used unchanged by the routes and the component module.
 */
import {
  CAPABILITY_DOMAINS,
  CAPABILITY_TYPES,
  INDEPENDENCE_LEVELS,
  MATURITY_LEVELS,
  SCALE_STAGES,
  TRIGGER_GATES,
  type CapabilityDomainId,
  type CapabilityType,
  type IndependenceLevel,
  type MaturityLevel,
  type ScaleStage,
  type TriggerGate,
} from "@/domain";

export const CAPABILITY_VIEWS = [
  { id: "registry", label: "Registry" },
  { id: "domains", label: "Domain map" },
  { id: "dependencies", label: "Dependencies" },
  { id: "maturity", label: "Maturity and stages" },
  { id: "independence", label: "Independence" },
  { id: "gates", label: "Trigger gates" },
  { id: "coverage", label: "Coverage" },
  { id: "deliverables", label: "Deliverable types" },
  { id: "normalization", label: "Normalization" },
] as const;

export type CapabilityView = (typeof CAPABILITY_VIEWS)[number]["id"];

export interface CapabilitySearch {
  view: CapabilityView;
  domain: CapabilityDomainId | "all";
  type: CapabilityType | "all";
  stage: ScaleStage | "all";
  gate: TriggerGate | "all";
  independence: IndependenceLevel | "all";
  maturity: MaturityLevel | "all";
  q: string;
}

export const DEFAULT_CAPABILITY_SEARCH: CapabilitySearch = {
  view: "registry",
  domain: "all",
  type: "all",
  stage: "all",
  gate: "all",
  independence: "all",
  maturity: "all",
  q: "",
};

/* ------------------------------------------------------- search validation */

function option<T extends string>(value: unknown, allowed: readonly T[]): T | "all" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "all";
}

/** Shared search parser so filters survive navigation into a detail page. */
export function parseCapabilitySearch(search: Record<string, unknown>): CapabilitySearch {
  const view = CAPABILITY_VIEWS.map((v) => v.id).includes(search["view"] as CapabilityView)
    ? (search["view"] as CapabilityView)
    : "registry";
  return {
    view,
    domain: option<CapabilityDomainId>(search["domain"], CAPABILITY_DOMAINS),
    type: option<CapabilityType>(search["type"], CAPABILITY_TYPES),
    stage: option<ScaleStage>(search["stage"], SCALE_STAGES),
    gate: option<TriggerGate>(search["gate"], TRIGGER_GATES),
    independence: option<IndependenceLevel>(search["independence"], INDEPENDENCE_LEVELS),
    maturity: option<MaturityLevel>(search["maturity"], MATURITY_LEVELS),
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  };
}
