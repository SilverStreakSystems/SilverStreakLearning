/**
 * Shared presentation for the technology decision planning surfaces.
 *
 * Two rules are enforced visually, not just in prose: supplied source text and
 * derived analysis are never mixed in the same block, and every surface says
 * plainly that this is planning scope.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { EvaluationResult, OptionId } from "@/domain/technology-decisions";
import { describeOptions, optionById } from "@/lib/technology-decision-registry";
import { cn } from "@/lib/utils";

export const PLANNING_SCOPE_STATEMENT =
  "Planning scope. Nothing on this page activates a role, authorizes an implementation, closes a finding, or changes Gate A. The analysis behind it is owner-supplied future-state input, not a district commitment and not a record of any real person.";

export function PlanningScopeNotice({ className }: { className?: string }) {
  return (
    <p
      data-planning-scope="true"
      className={cn(
        "measure rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground",
        className,
      )}
    >
      {PLANNING_SCOPE_STATEMENT}
    </p>
  );
}

/** A verbatim supplied value. Never edited, never summarized. */
export function SourceValue({ label, value }: { label: string; value: string }) {
  const empty = value.trim().length === 0;
  return (
    <div className="border-b border-border py-2 last:border-b-0">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="measure mt-1 text-sm">
        {empty ? <span className="text-muted-foreground">Not stated in the source.</span> : value}
      </dd>
    </div>
  );
}

export function OptionBadge({ optionId }: { optionId: OptionId }) {
  const option = optionById(optionId);
  return (
    <span className="inline-flex items-center rounded-sm border border-border-strong bg-surface px-2 py-0.5 text-xs font-semibold">
      Option {option.ordinal} — {option.short_name}
    </span>
  );
}

/** The derived result, always labelled as derived and never as source text. */
export function EvaluationPanel({
  evaluation,
  heading = "Derived minimum effective solution",
}: {
  evaluation: EvaluationResult;
  heading?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <h3 className="font-display text-base font-semibold">{heading}</h3>
      <p className="mt-1 text-sm font-semibold">
        {evaluation.outcome === "resolved"
          ? describeOptions(evaluation.optionIds)
          : "No recommendation — the evaluator abstained."}
      </p>
      {evaluation.optionIds.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {evaluation.optionIds.map((id) => (
            <OptionBadge key={id} optionId={id} />
          ))}
        </div>
      ) : null}
      <h4 className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Why
      </h4>
      <ol className="measure mt-1 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
        {evaluation.rationale.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
      {evaluation.unresolvedQuestions.length > 0 ? (
        <>
          <h4 className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Answer these before a recommendation is possible
          </h4>
          <ul className="measure mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {evaluation.unresolvedQuestions.map((question) => (
              <li key={question}>{question.replaceAll("_", " ")}</li>
            ))}
          </ul>
        </>
      ) : null}
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            AI boundary
          </dt>
          <dd className="text-sm">{evaluation.aiBoundary}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Named human approval
          </dt>
          <dd className="text-sm">
            {evaluation.requiresNamedApprover ? "Required before use" : "Not triggered"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Invariants applied
          </dt>
          <dd className="text-sm">
            {evaluation.invariantsApplied.length > 0
              ? evaluation.invariantsApplied.join(", ")
              : "None constrained this result"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function SubNav({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Technology decisions" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {children}
    </nav>
  );
}

export function SubNavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      activeProps={{ className: "font-semibold" }}
    >
      {children}
    </Link>
  );
}
