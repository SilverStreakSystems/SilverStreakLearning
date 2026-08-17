import { AUTHORITY_CLASS_META, type AuthorityClass } from "@/domain";
import { cn } from "@/lib/utils";

/**
 * Authority class display.
 *
 * The value shown here is always the record's stored `authorityClass`.
 * It is never computed from implementation status, tests, or file location.
 * Visual weight communicates authority rank; the text always states the class,
 * so the meaning survives without color.
 */
const RANK_CLASS: Record<number, string> = {
  1: "bg-primary text-primary-foreground border-primary",
  2: "bg-primary/12 text-foreground border-primary",
  3: "bg-surface text-foreground border-border-strong",
  4: "bg-surface text-foreground border-border-strong border-dashed",
  5: "bg-muted text-muted-foreground border-border-strong border-dashed",
  6: "bg-muted text-muted-foreground border-border border-dotted",
  7: "bg-muted text-muted-foreground border-border border-dotted",
  8: "bg-surface text-foreground border-border-strong border-double border-4",
};

export function AuthorityBadge({
  authorityClass,
  className,
}: {
  authorityClass: AuthorityClass;
  className?: string;
}) {
  const meta = AUTHORITY_CLASS_META[authorityClass];

  return (
    <span
      data-authority-class={authorityClass}
      data-implementation-authority={meta.carriesImplementationAuthority ? "yes" : "no"}
      className={cn(
        "inline-flex min-h-6 items-center gap-2 rounded-sm border px-2 py-0.5 text-xs font-semibold",
        RANK_CLASS[meta.rank],
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem]">
        A{meta.rank}
      </span>
      <span>{meta.label}</span>
    </span>
  );
}

export function ImplementationAuthorityNote({
  granted,
  scope,
}: {
  granted: boolean;
  scope: string;
}) {
  return (
    <p className="text-sm">
      <span className="font-semibold">
        {granted ? "Carries implementation authority" : "No implementation authority"}:
      </span>{" "}
      <span className="text-muted-foreground">{scope}</span>
    </p>
  );
}

export function AuthorityLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {Object.values(AUTHORITY_CLASS_META)
        .sort((a, b) => a.rank - b.rank)
        .map((meta) => (
          <div key={meta.id} className="flex flex-col gap-1">
            <dt>
              <AuthorityBadge authorityClass={meta.id} />
            </dt>
            <dd className="text-sm text-muted-foreground">{meta.meaning}</dd>
          </div>
        ))}
    </dl>
  );
}
