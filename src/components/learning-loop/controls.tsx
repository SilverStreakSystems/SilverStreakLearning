import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Product form primitives.
 *
 * Accessibility contract applied here, consistent with TTR-001 v1.0.0:
 * - every control is at least 44 by 44 CSS pixels; nothing is below the 24px floor
 * - every control has a programmatically associated visible label
 * - help text and error text are linked with aria-describedby
 * - error state is carried by text, not by color alone
 *
 * This is an implementation of the acceptance rule. It is not a measurement of
 * the rule, and it is not a conformance claim. FND-024 stays open.
 */
const CONTROL_CLASS =
  "block w-full min-h-11 rounded-sm border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="ml-1 font-normal text-muted-foreground">(required)</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="measure mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children({ id, describedBy, invalid: Boolean(error) })}</div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-semibold text-foreground">
          Problem: {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextLine(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL_CLASS, props.className)} />;
}

export function TextBlock(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={cn(CONTROL_CLASS, "min-h-24", props.className)} />;
}

export function Choice(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(CONTROL_CLASS, props.className)} />;
}

export function CheckLine({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-foreground"
    >
      <input
        id={id}
        type="checkbox"
        {...props}
        className="size-6 rounded-sm border border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <span>{label}</span>
    </label>
  );
}

const BUTTON_BASE =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";

export function ActionButton({
  tone = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "secondary" | "quiet" }) {
  const tones = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "border border-border-strong bg-surface text-foreground hover:bg-muted",
    quiet: "border border-transparent text-foreground underline hover:bg-muted",
  } as const;
  return <button type="button" {...props} className={cn(BUTTON_BASE, tones[tone], className)} />;
}

/** A non-modal disclosure used for the record forms. Keeps focus order linear. */
export function Disclosure({
  summary,
  open,
  onToggle,
  children,
}: {
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="mt-4 rounded-md border border-border bg-surface">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span>{summary}</span>
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={id} hidden={!open} className="border-t border-border px-4 pt-1 pb-5">
        {children}
      </div>
    </div>
  );
}

/** Announces the result of a write without stealing focus. */
export function LiveNotice({ message, tone }: { message: string | null; tone: "ok" | "problem" }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "measure mt-3 text-sm",
        message ? "block" : "hidden",
        tone === "problem"
          ? "rounded-sm border-2 border-signal-halted-foreground bg-signal-halted px-3 py-2 font-semibold text-signal-halted-foreground"
          : "text-muted-foreground",
      )}
    >
      {message}
    </p>
  );
}
