import { Link } from "@tanstack/react-router";
import {
  CANONICALITY,
  CANONICALITY_META,
  DATA_CLASSIFICATIONS,
  DATA_CLASSIFICATION_LABEL,
  INSTANTIABILITY,
  INSTANTIABILITY_META,
  OBJECT_FAMILIES,
  OBJECT_FAMILY_META,
  STATE_AXES,
  STATE_AXIS_META,
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

/** Views are links so every view is addressable and survives a detour into detail. */
export function ObjectViewTabs({ current, search }: { current: ObjectView; search: ObjectSearch }) {
  return (
    <nav aria-label="Shared object views" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {OBJECT_VIEWS.map((view) => {
          const isCurrent = view.id === current;
          return (
            <li key={view.id}>
              <Link
                to="/objects"
                search={{ ...search, view: view.id }}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "inline-block rounded-sm border-2 border-accent-strong bg-muted px-3 py-1.5 text-sm font-semibold underline underline-offset-4"
                    : "inline-block rounded-sm border border-border px-3 py-1.5 text-sm hover:bg-muted"
                }
              >
                {view.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  optionLabel,
  onChange,
}: {
  id: string;
  label: string;
  value: T | "all";
  options: readonly T[];
  optionLabel: (option: T) => string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-sm border border-border-strong bg-surface px-2 py-1 text-sm"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ObjectFilterBar({
  search,
  resultCount,
  onChange,
}: {
  search: ObjectSearch;
  resultCount: number;
  onChange: (next: Partial<ObjectSearch>) => void;
}) {
  return (
    <section aria-labelledby="object-filters-heading" className="mt-4">
      <h2 id="object-filters-heading" className="font-display text-lg font-semibold">
        Filters
      </h2>
      <div className="mt-3 grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="object-search" className="text-xs font-semibold">
            Text search
          </label>
          <input
            id="object-search"
            type="search"
            value={search.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Name, definition, purpose, owner"
            className="min-h-11 rounded-sm border border-border-strong bg-surface px-2 py-1 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <FilterSelect
          id="object-family"
          label="Object family"
          value={search.family}
          options={OBJECT_FAMILIES}
          optionLabel={(option) => OBJECT_FAMILY_META[option].label}
          onChange={(value) => onChange({ family: value as ObjectSearch["family"] })}
        />
        <FilterSelect
          id="object-canonicality"
          label="Canonical or projection"
          value={search.canonicality}
          options={CANONICALITY}
          optionLabel={(option) => CANONICALITY_META[option].label}
          onChange={(value) => onChange({ canonicality: value as ObjectSearch["canonicality"] })}
        />
        <FilterSelect
          id="object-instantiability"
          label="May records exist now"
          value={search.instantiability}
          options={INSTANTIABILITY}
          optionLabel={(option) => INSTANTIABILITY_META[option].label}
          onChange={(value) => onChange({ instantiability: value as ObjectSearch["instantiability"] })}
        />
        <FilterSelect
          id="object-axis"
          label="Uses state axis"
          value={search.axis}
          options={STATE_AXES}
          optionLabel={(option) => STATE_AXIS_META[option].label}
          onChange={(value) => onChange({ axis: value as ObjectSearch["axis"] })}
        />
        <FilterSelect
          id="object-classification"
          label="May carry classification"
          value={search.classification}
          options={DATA_CLASSIFICATIONS}
          optionLabel={(option) => DATA_CLASSIFICATION_LABEL[option]}
          onChange={(value) => onChange({ classification: value as ObjectSearch["classification"] })}
        />
        <div className="flex items-end">
          <Link
            to="/objects"
            search={{ ...DEFAULT_OBJECT_SEARCH, view: search.view }}
            className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-3 text-sm font-semibold"
          >
            Clear all filters
          </Link>
        </div>
      </div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">
        {resultCount} object types match the current filters.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------- chips */

const CHIP = "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold";

export function CanonicalityChip({ value }: { value: Canonicality }) {
  const meta = CANONICALITY_META[value];
  return (
    <span className={`${CHIP} border-border-strong bg-muted`}>
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.marker}
      </span>
      <span>{meta.label}</span>
      <span className="sr-only">. {meta.meaning}</span>
    </span>
  );
}

export function InstantiabilityChip({ value }: { value: Instantiability }) {
  const meta = INSTANTIABILITY_META[value];
  return (
    <span className={`${CHIP} border-dashed border-border-strong bg-muted`}>
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.marker}
      </span>
      <span>{meta.label}</span>
      <span className="sr-only">. {meta.meaning}</span>
    </span>
  );
}

export function AxisChip({ axis }: { axis: StateAxis }) {
  return (
    <span className={`${CHIP} border-border bg-surface`}>
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        [AXIS]
      </span>
      <span>{STATE_AXIS_META[axis].label}</span>
    </span>
  );
}

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
