import { VERIFICATION_STATE_META, type VerificationState } from "@/domain";
import { cn } from "@/lib/utils";

/**
 * Renders a verification state.
 *
 * Accessibility contract: state is carried by text label, a bracketed text
 * marker, and a border shape — never by color alone. Color is decoration on
 * top of information that is already complete without it.
 */
const TONE_CLASS: Record<VerificationStateTone, string> = {
  affirmed: "bg-signal-affirmed text-signal-affirmed-foreground border-signal-affirmed-foreground",
  partial: "bg-signal-partial text-signal-partial-foreground border-signal-partial-foreground",
  open: "bg-signal-open text-signal-open-foreground border-signal-open-foreground",
  halted: "bg-signal-halted text-signal-halted-foreground border-signal-halted-foreground",
  excluded: "bg-signal-excluded text-signal-excluded-foreground border-signal-excluded-foreground",
};

type VerificationStateTone = "affirmed" | "partial" | "open" | "halted" | "excluded";

const TONE_BORDER: Record<VerificationStateTone, string> = {
  affirmed: "border-solid",
  partial: "border-dashed",
  open: "border-dotted",
  halted: "border-double border-4",
  excluded: "border-dotted opacity-95",
};

export function StateChip({
  state,
  className,
  describe = false,
}: {
  state: VerificationState;
  className?: string;
  /** When true, the meaning is read out alongside the label. */
  describe?: boolean;
}) {
  const meta = VERIFICATION_STATE_META[state];

  return (
    <span
      data-state-chip={state}
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold",
        TONE_CLASS[meta.tone],
        TONE_BORDER[meta.tone],
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono text-[0.65rem] tracking-tight">
        {meta.marker}
      </span>
      <span>{meta.label}</span>
      {describe ? <span className="sr-only">. {meta.meaning}</span> : null}
    </span>
  );
}

export function StateLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {Object.values(VERIFICATION_STATE_META).map((meta) => (
        <div key={meta.id} className="flex flex-col gap-1">
          <dt>
            <StateChip state={meta.id} />
          </dt>
          <dd className="text-sm text-muted-foreground">{meta.meaning}</dd>
        </div>
      ))}
    </dl>
  );
}
