import { Link } from "@tanstack/react-router";
import {
  CONFORMANCE_STATUS_LABEL,
  TEMPLATE_MATURITY_META,
  VALIDATION_RESULT_LABEL,
  type ConformanceStatus,
  type TemplateMaturity,
  type ValidationResult,
} from "@/domain";
import {
  DEFAULT_DESIGN_SYSTEM_SEARCH,
  DESIGN_SYSTEM_VIEWS,
  type DesignSystemSearch,
  type DesignSystemView,
} from "./design-system-view-model";

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
