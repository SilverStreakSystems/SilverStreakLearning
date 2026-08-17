import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Marks invented content so it can never be mistaken for a factual record. */
export function SyntheticMarker({ className }: { className?: string }) {
  return (
    <span
      data-synthetic="true"
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-sm border border-dashed border-border-strong bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        [SYN]
      </span>
      <span>Synthetic example</span>
    </span>
  );
}

/** Wraps target-state material behind a visible governance gate. */
export function GatedPanel({
  title,
  notice,
  children,
  className,
}: {
  title: string;
  notice: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-gated="true"
      aria-label={`${title}. ${notice}`}
      className={cn(
        "rounded-md border-4 border-double border-border-strong bg-surface p-4 sm:p-5",
        className,
      )}
    >
      <p className="mb-2 font-mono text-xs font-bold tracking-wide text-foreground uppercase">
        Target-state candidate
      </p>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 border-l-4 border-border-strong pl-3 text-sm font-semibold text-foreground">
        {notice}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Small labelled field used across registry detail views. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ValueList({ items, empty = "None recorded." }: { items: string[]; empty?: string }) {
  if (items.length === 0) {
    return <span className="text-muted-foreground">{empty}</span>;
  }
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
