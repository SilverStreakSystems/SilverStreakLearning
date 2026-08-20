/**
 * View model for the shared object command surface.
 *
 * Search shape, defaults, and validated parsing live here rather than in the
 * component module so the component module exports components only. Moving
 * them changes no behaviour: the same constants, the same defaults, and the
 * same parser are re-used unchanged by the routes and the component module.
 */
import {
  CANONICALITY,
  DATA_CLASSIFICATIONS,
  INSTANTIABILITY,
  OBJECT_FAMILIES,
  STATE_AXES,
  type Canonicality,
  type DataClassification,
  type Instantiability,
  type ObjectFamily,
  type StateAxis,
} from "@/domain";

export const OBJECT_VIEWS = [
  { id: "catalog", label: "Object catalog" },
  { id: "types", label: "Object types" },
  { id: "relationships", label: "Relationship model" },
  { id: "states", label: "State models" },
  { id: "work", label: "Work model" },
  { id: "deliverables", label: "Deliverable model" },
  { id: "evidence", label: "Evidence model" },
  { id: "context", label: "Context model" },
  { id: "authorization", label: "Authorization model" },
  { id: "lifecycle", label: "Lifecycle model" },
  { id: "normalization", label: "Normalization findings" },
] as const;

export type ObjectView = (typeof OBJECT_VIEWS)[number]["id"];

export interface ObjectSearch {
  view: ObjectView;
  family: ObjectFamily | "all";
  canonicality: Canonicality | "all";
  instantiability: Instantiability | "all";
  axis: StateAxis | "all";
  classification: DataClassification | "all";
  q: string;
}

export const DEFAULT_OBJECT_SEARCH: ObjectSearch = {
  view: "catalog",
  family: "all",
  canonicality: "all",
  instantiability: "all",
  axis: "all",
  classification: "all",
  q: "",
};

/* ------------------------------------------------------- search validation */

function option<T extends string>(value: unknown, allowed: readonly T[]): T | "all" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "all";
}

export function parseObjectSearch(search: Record<string, unknown>): ObjectSearch {
  const view = OBJECT_VIEWS.map((v) => v.id).includes(search["view"] as ObjectView)
    ? (search["view"] as ObjectView)
    : "catalog";
  return {
    view,
    family: option<ObjectFamily>(search["family"], OBJECT_FAMILIES),
    canonicality: option<Canonicality>(search["canonicality"], CANONICALITY),
    instantiability: option<Instantiability>(search["instantiability"], INSTANTIABILITY),
    axis: option<StateAxis>(search["axis"], STATE_AXES),
    classification: option<DataClassification>(search["classification"], DATA_CLASSIFICATIONS),
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  };
}
