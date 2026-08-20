import { cn } from "@/lib/utils";

/**
 * SSLS brand asset components.
 *
 * Authority note: the constellation / monogram family is the current working
 * visual direction. It has not been promoted to canonical, and no validated
 * vector master has been recorded in this repository. Geometry here is drawn
 * from the documented star, trajectory, and scaling tables in the
 * SSLS Brand Visual System v0.1 specification, not from an approved master.
 *
 * Accessibility contract:
 * - decorative instances carry aria-hidden="true" and focusable="false"
 * - meaningful instances expose the organization name as their accessible name
 * - no essential text is drawn inside an SVG; text is HTML
 */

export const BRAND_ASSET_PROVENANCE =
  "Working visual direction derived from the SSLS Brand Visual System v0.1 specification. No validated vector master is recorded in this repository, so these components are reference geometry, not an approved production asset.";

interface DecorableProps {
  className?: string;
  /** Provide a title to make the mark meaningful; omit it to mark it decorative. */
  title?: string;
}

function svgA11yProps(title: string | undefined, titleId: string) {
  return title
    ? { role: "img" as const, "aria-labelledby": titleId }
    : { "aria-hidden": true as const, focusable: "false" as const };
}

/**
 * Four-point endpoint star. Inline signal 12-16px, icon 20-32px,
 * hero endpoint 40-72px.
 */
export function SSLSStar({ className, title, size = 16 }: DecorableProps & { size?: number }) {
  const titleId = "ssls-star-title";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...svgA11yProps(title, titleId)}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Trajectory: converging direction lines ending in a star endpoint.
 * Strokes follow the documented scale table (compact 2px / component 2-3px).
 */
export function SSLSTrajectory({
  className,
  title,
  width = 160,
  height = 48,
}: DecorableProps & { width?: number; height?: number }) {
  const titleId = "ssls-trajectory-title";
  return (
    <svg
      viewBox="0 0 160 48"
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      {...svgA11yProps(title, titleId)}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M4 42 C 48 42, 84 28, 128 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M4 30 C 44 30, 76 20, 116 8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.55}
      />
      <path
        d="M136 4 L138.6 11.4 L146 14 L138.6 16.6 L136 24 L133.4 16.6 L126 14 L133.4 11.4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Monogram. Minimum compact digital size 32px; navigation use 32-44px high.
 */
export function SSLSMonogram({ className, title, size = 40 }: DecorableProps & { size?: number }) {
  const titleId = "ssls-monogram-title";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      {...svgA11yProps(title, titleId)}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={1.5}
        y={1.5}
        width={61}
        height={61}
        rx={12}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
      />
      <path
        d="M12 50 C 26 50, 36 38, 46 22"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M12 40 C 24 40, 32 32, 40 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path d="M50 8 L53 16 L61 19 L53 22 L50 30 L47 22 L39 19 L47 16 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Horizontal lockup. The organization name is HTML text, not SVG text, so it
 * remains translatable, selectable, and responsive.
 */
export function SSLSLockup({
  className,
  organizationName = "Silver Streak Learning Systems",
  descriptor,
}: {
  className?: string;
  organizationName?: string;
  descriptor?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <SSLSMonogram size={36} className="text-ssls-silver-blue" />
      <span className="min-w-0">
        <span className="block font-display text-base leading-tight font-bold">
          {organizationName}
        </span>
        {descriptor ? (
          <span className="block text-xs leading-tight opacity-90">{descriptor}</span>
        ) : null}
      </span>
    </span>
  );
}

/**
 * Constellation field. Decorative only: low frequency, low opacity, no motion.
 */
export function SSLSConstellation({ className }: { className?: string }) {
  const nodes = [
    [18, 30],
    [72, 14],
    [120, 46],
    [186, 22],
    [240, 54],
  ] as const;
  return (
    <svg
      viewBox="0 0 260 72"
      className={cn("h-16 w-full opacity-30", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={nodes.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      />
      {nodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} fill="currentColor" />
      ))}
    </svg>
  );
}
