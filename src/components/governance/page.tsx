import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard page frame. Every route renders exactly one H1 through this
 * component, which keeps heading structure consistent across the workspace.
 */
export function PageHeader({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border pb-5">
      <h1 className="font-display text-2xl leading-tight font-bold sm:text-3xl">{title}</h1>
      <p className="measure mt-2 text-base text-muted-foreground">{summary}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  );
}

export function Section({
  title,
  description,
  children,
  className,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} className={cn("mt-8", className)}>
      <h2 id={id ? `${id}-heading` : undefined} className="font-display text-xl font-semibold">
        {title}
      </h2>
      {description ? (
        <p className="measure mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * Registry table wrapper. Tables scroll horizontally on narrow viewports rather
 * than truncating cell text, so essential content is never cut off.
 */
export function RegistryTable({
  caption,
  headers,
  children,
}: {
  caption: string;
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border-strong bg-muted">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-2 align-bottom font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Cell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-b border-border px-3 py-3 align-top", className)}>{children}</td>;
}

export function RowHeader({ children }: { children: ReactNode }) {
  return (
    <th
      scope="row"
      className="border-b border-border px-3 py-3 text-left align-top font-semibold whitespace-normal"
    >
      {children}
    </th>
  );
}

export function RecordCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={cn("rounded-md border border-border bg-surface p-4 sm:p-5", className)}>
      {children}
    </article>
  );
}
