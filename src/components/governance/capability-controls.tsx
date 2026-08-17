import { Link } from "@tanstack/react-router";
import {
  CAPABILITY_DOMAINS,
  CAPABILITY_DOMAIN_META,
  CAPABILITY_TYPES,
  CAPABILITY_TYPE_LABEL,
  INDEPENDENCE_LABEL,
  INDEPENDENCE_LEVELS,
  INDEPENDENCE_MARKER,
  MATURITY_LEVELS,
  MATURITY_LEVEL_LABEL,
  SCALE_STAGES,
  SCALE_STAGE_LABEL,
  TRIGGER_GATES,
  TRIGGER_GATE_META,
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

/**
 * View switcher. Rendered as links so each view is addressable, shareable, and
 * preserved when the operator navigates into a detail page and back.
 */
export function CapabilityViewTabs({
  current,
  search,
}: {
  current: CapabilityView;
  search: CapabilitySearch;
}) {
  return (
    <nav aria-label="Capability views" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {CAPABILITY_VIEWS.map((view) => {
          const isCurrent = view.id === current;
          return (
            <li key={view.id}>
              <Link
                to="/capabilities"
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

export function CapabilityFilterBar({
  search,
  resultCount,
  onChange,
}: {
  search: CapabilitySearch;
  resultCount: number;
  onChange: (next: Partial<CapabilitySearch>) => void;
}) {
  return (
    <section aria-labelledby="capability-filters-heading" className="mt-4">
      <h2 id="capability-filters-heading" className="font-display text-lg font-semibold">
        Filters
      </h2>
      <div className="mt-3 grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="capability-search" className="text-xs font-semibold">
            Text search
          </label>
          <input
            id="capability-search"
            type="search"
            value={search.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Name, purpose, risk, owner"
            className="min-h-11 rounded-sm border border-border-strong bg-surface px-2 py-1 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <FilterSelect
          id="capability-domain"
          label="Domain"
          value={search.domain}
          options={CAPABILITY_DOMAINS}
          optionLabel={(option) => `${option} — ${CAPABILITY_DOMAIN_META[option].name}`}
          onChange={(value) => onChange({ domain: value as CapabilitySearch["domain"] })}
        />
        <FilterSelect
          id="capability-type"
          label="Capability type"
          value={search.type}
          options={CAPABILITY_TYPES}
          optionLabel={(option) => CAPABILITY_TYPE_LABEL[option]}
          onChange={(value) => onChange({ type: value as CapabilitySearch["type"] })}
        />
        <FilterSelect
          id="capability-stage"
          label="Required to execute by stage"
          value={search.stage}
          options={SCALE_STAGES}
          optionLabel={(option) => `${option} — ${SCALE_STAGE_LABEL[option]}`}
          onChange={(value) => onChange({ stage: value as CapabilitySearch["stage"] })}
        />
        <FilterSelect
          id="capability-gate"
          label="Trigger gate"
          value={search.gate}
          options={TRIGGER_GATES}
          optionLabel={(option) => TRIGGER_GATE_META[option].label}
          onChange={(value) => onChange({ gate: value as CapabilitySearch["gate"] })}
        />
        <FilterSelect
          id="capability-independence"
          label="Independence"
          value={search.independence}
          options={INDEPENDENCE_LEVELS}
          optionLabel={(option) => INDEPENDENCE_LABEL[option]}
          onChange={(value) => onChange({ independence: value as CapabilitySearch["independence"] })}
        />
        <FilterSelect
          id="capability-maturity"
          label="Declared current maturity"
          value={search.maturity}
          options={MATURITY_LEVELS}
          optionLabel={(option) => MATURITY_LEVEL_LABEL[option]}
          onChange={(value) => onChange({ maturity: value as CapabilitySearch["maturity"] })}
        />
        <div className="flex items-end">
          <Link
            to="/capabilities"
            search={{ ...DEFAULT_CAPABILITY_SEARCH, view: search.view }}
            className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-3 text-sm font-semibold"
          >
            Clear all filters
          </Link>
        </div>
      </div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">
        {resultCount} capability records match the current filters.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------- chips */

const CHIP = "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold";

export function StageChip({ stage }: { stage: ScaleStage }) {
  return (
    <span className={`${CHIP} border-border-strong bg-muted`}>
      <span aria-hidden="true">[{stage}]</span>
      <span>{SCALE_STAGE_LABEL[stage]}</span>
      <span className="sr-only">Stage {stage}</span>
    </span>
  );
}

export function GateChip({ gate }: { gate: TriggerGate }) {
  const meta = TRIGGER_GATE_META[gate];
  return (
    <span className={`${CHIP} border-border-strong bg-muted`}>
      <span aria-hidden="true">{meta.marker}</span>
      <span>{meta.label}</span>
    </span>
  );
}

export function IndependenceChip({ level }: { level: IndependenceLevel }) {
  return (
    <span className={`${CHIP} border-border-strong bg-muted`}>
      <span aria-hidden="true">{INDEPENDENCE_MARKER[level]}</span>
      <span>{INDEPENDENCE_LABEL[level]}</span>
    </span>
  );
}
