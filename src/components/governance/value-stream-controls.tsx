import { Link } from "@tanstack/react-router";
import {
  ENTERPRISE_FUNCTION_IDS,
  ENTERPRISE_FUNCTION_META,
  GATE_DISPOSITION_META,
  SCALE_STAGES,
  SCALE_STAGE_LABEL,
  STREAM_OPERATING_STATUS,
  STREAM_OPERATING_STATUS_META,
  type EnterpriseFunctionId,
  type GateDisposition,
  type ScaleStage,
  type StreamOperatingStatus,
} from "@/domain";
import {
  DEFAULT_VALUE_STREAM_SEARCH,
  VALUE_STREAM_VIEWS,
  type ValueStreamSearch,
  type ValueStreamView,
} from "./value-stream-view-model";

/** Views are links so each one is addressable and survives a detour into detail. */
export function ValueStreamViewTabs({
  current,
  search,
}: {
  current: ValueStreamView;
  search: ValueStreamSearch;
}) {
  return (
    <nav aria-label="Value stream views" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {VALUE_STREAM_VIEWS.map((view) => {
          const isCurrent = view.id === current;
          return (
            <li key={view.id}>
              <Link
                to="/value-streams"
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

export function ValueStreamFilterBar({
  search,
  resultCount,
  onChange,
}: {
  search: ValueStreamSearch;
  resultCount: number;
  onChange: (next: Partial<ValueStreamSearch>) => void;
}) {
  return (
    <section aria-labelledby="stream-filters-heading" className="mt-4">
      <h2 id="stream-filters-heading" className="font-display text-lg font-semibold">
        Filters
      </h2>
      <div className="mt-3 grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="stream-search" className="text-xs font-semibold">
            Text search
          </label>
          <input
            id="stream-search"
            type="search"
            value={search.q}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Name, purpose, trigger, stage"
            className="min-h-11 rounded-sm border border-border-strong bg-surface px-2 py-1 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <FilterSelect
          id="stream-status"
          label="Operating status"
          value={search.status}
          options={STREAM_OPERATING_STATUS}
          optionLabel={(option) => STREAM_OPERATING_STATUS_META[option].label}
          onChange={(value) => onChange({ status: value as ValueStreamSearch["status"] })}
        />
        <FilterSelect
          id="stream-function"
          label="Function involved"
          value={search.fn}
          options={ENTERPRISE_FUNCTION_IDS}
          optionLabel={(option) => `${option} ${ENTERPRISE_FUNCTION_META[option].name}`}
          onChange={(value) => onChange({ fn: value as ValueStreamSearch["fn"] })}
        />
        <FilterSelect
          id="stream-maturity"
          label="Current maturity"
          value={search.maturity}
          options={SCALE_STAGES}
          optionLabel={(option) => `${option} ${SCALE_STAGE_LABEL[option]}`}
          onChange={(value) => onChange({ maturity: value as ValueStreamSearch["maturity"] })}
        />
        <div className="flex items-end">
          <Link
            to="/value-streams"
            search={{ ...DEFAULT_VALUE_STREAM_SEARCH, view: search.view }}
            className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-3 text-sm font-semibold"
          >
            Clear all filters
          </Link>
        </div>
      </div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">
        {resultCount} value streams match the current filters.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------- chips */

const CHIP = "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold";

export function OperatingStatusChip({ status }: { status: StreamOperatingStatus }) {
  const meta = STREAM_OPERATING_STATUS_META[status];
  return (
    <span
      className={`${CHIP} ${
        status === "gated-future"
          ? "border-dashed border-border-strong bg-muted"
          : "border-border-strong bg-surface"
      }`}
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.marker}
      </span>
      <span>{meta.label}</span>
      <span className="sr-only">. {meta.meaning}</span>
    </span>
  );
}

export function GateDispositionChip({ disposition }: { disposition: GateDisposition }) {
  const meta = GATE_DISPOSITION_META[disposition];
  return (
    <span className={`${CHIP} border-border-strong bg-muted`}>
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.allowsAdvance ? "[ADVANCE]" : "[STOP]"}
      </span>
      <span>{meta.label}</span>
      <span className="sr-only">
        . {meta.allowsAdvance ? "Advance permitted" : "Advance not permitted"}. {meta.meaning}
      </span>
    </span>
  );
}

export function FunctionChip({ functionId }: { functionId: EnterpriseFunctionId }) {
  const meta = ENTERPRISE_FUNCTION_META[functionId];
  return (
    <span className={`${CHIP} border-border bg-surface`}>
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.id}
      </span>
      <span>{meta.name}</span>
      <span className="sr-only">. Candidate function, not staffed.</span>
    </span>
  );
}
