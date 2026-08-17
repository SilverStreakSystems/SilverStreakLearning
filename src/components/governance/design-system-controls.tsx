import { Link } from "@tanstack/react-router";
import {
  CONFORMANCE_STATUS_LABEL,
  TEMPLATE_MATURITY_META,
  VALIDATION_RESULT_LABEL,
  type ConformanceStatus,
  type TemplateMaturity,
  type ValidationResult,
} from "@/domain";

export const DESIGN_SYSTEM_VIEWS = [
  { id: "overview", label: "Overview" },
  { id: "tokens", label: "Tokens" },
  { id: "typography", label: "Typography" },
  { id: "grid", label: "Grid and coordinates" },
  { id: "assets", label: "Brand assets" },
  { id: "templates", label: "Interface templates" },
  { id: "workspaces", label: "Workspace templates" },
  { id: "families", label: "Experience families" },
  { id: "blueprints", label: "Blueprints" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion and responsive" },
  { id: "accessibility", label: "Accessibility" },
  { id: "conformance", label: "Conformance" },
] as const;

export type DesignSystemView = (typeof DESIGN_SYSTEM_VIEWS)[number]["id"];

export interface DesignSystemSearch {
  view: DesignSystemView;
  maturity: TemplateMaturity | "all";
  q: string;
}

export const DEFAULT_DESIGN_SYSTEM_SEARCH: DesignSystemSearch = {
  view: "overview",
  maturity: "all",
  q: "",
};

const VIEW_IDS = DESIGN_SYSTEM_VIEWS.map((view) => view.id) as readonly string[];

export function parseDesignSystemSearch(input: Record<string, unknown>): DesignSystemSearch {
  const rawView = input["view"];
  const rawMaturity = input["maturity"];
  const rawQuery = input["q"];
  const view =
    typeof rawView === "string" && VIEW_IDS.includes(rawView) ? (rawView as DesignSystemView) : "overview";
  const maturity =
    typeof rawMaturity === "string" && rawMaturity in TEMPLATE_MATURITY_META
      ? (rawMaturity as TemplateMaturity)
      : "all";
  const q = typeof rawQuery === "string" ? rawQuery : "";
  return { view, maturity, q };
}


/** Views are links, so each one is addressable and survives a detour into detail. */
export function DesignSystemViewTabs({
  current,
  search,
}: {
  current: DesignSystemView;
  search: DesignSystemSearch;
}) {
  return (
    <nav aria-label="Design system views" className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {DESIGN_SYSTEM_VIEWS.map((view) => {
          const isCurrent = view.id === current;
          return (
            <li key={view.id}>
              <Link
                to="/design-system"
                search={{ ...search, view: view.id }}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "inline-flex min-h-11 items-center rounded-sm border-2 border-border-strong bg-muted px-3 py-1.5 text-sm font-semibold underline underline-offset-4"
                    : "inline-flex min-h-11 items-center rounded-sm border border-border px-3 py-1.5 text-sm hover:bg-muted"
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

/** Maturity is declared. The marker text carries the meaning, not the border. */
export function MaturityChip({ maturity }: { maturity: TemplateMaturity }) {
  const meta = TEMPLATE_MATURITY_META[maturity];
  return (
    <span
      data-maturity={maturity}
      title={meta.definition}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-2 py-0.5 text-xs font-semibold"
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {meta.marker}
      </span>
      <span>{meta.label}</span>
    </span>
  );
}

export function ConformanceChip({ status }: { status: ConformanceStatus }) {
  const shape = status === "met" ? "[=]" : status === "not-met" ? "[x]" : "[?]";
  return (
    <span
      data-conformance={status}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-2 py-0.5 text-xs font-semibold"
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {shape}
      </span>
      <span>{CONFORMANCE_STATUS_LABEL[status]}</span>
    </span>
  );
}

export function ValidationChip({ result }: { result: ValidationResult }) {
  const shape = result === "pass" ? "[=]" : result === "fail" ? "[x]" : "[ ]";
  return (
    <span
      data-validation={result}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-2 py-0.5 text-xs font-semibold"
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        {shape}
      </span>
      <span>{VALIDATION_RESULT_LABEL[result]}</span>
    </span>
  );
}
