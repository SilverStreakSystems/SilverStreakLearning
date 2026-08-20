/**
 * Enterprise Experience Template Architecture v0.1.
 *
 * Governing rule carried forward from the foundation shell: a template's
 * maturity is declared, never derived. Rendering a screen does not make a
 * template implemented, and an implemented template must name the routes that
 * provide its implementation evidence.
 */

export const TEMPLATE_MATURITIES = [
  "implemented",
  "prototype",
  "specified",
  "research-candidate",
  "gated-future",
] as const;

export type TemplateMaturity = (typeof TEMPLATE_MATURITIES)[number];

export const TEMPLATE_MATURITY_META: Record<
  TemplateMaturity,
  { label: string; definition: string; marker: string }
> = {
  implemented: {
    label: "Implemented",
    definition: "Exists in the current runtime and has direct implementation evidence.",
    marker: "[IMP]",
  },
  prototype: {
    label: "Prototype",
    definition: "Interactive or rendered proof. Not production authorized.",
    marker: "[PRO]",
  },
  specified: {
    label: "Specified",
    definition: "Defined well enough to implement but not yet built.",
    marker: "[SPE]",
  },
  "research-candidate": {
    label: "Research candidate",
    definition: "Target-state pattern requiring a governing decision before implementation.",
    marker: "[RES]",
  },
  "gated-future": {
    label: "Gated future",
    definition: "Explicitly out of current scope until authority changes.",
    marker: "[GAT]",
  },
};

/* ------------------------------------------------------------------ layers */

export interface ArchitectureLayer {
  layerId: string;
  name: string;
  responsibility: string;
  examples: string[];
}

/* --------------------------------------------------------------- templates */

export interface InterfaceTemplate {
  templateId: string;
  name: string;
  primaryJob: string;
  requiredAnatomy: string[];
  maturity: TemplateMaturity;
  /** Routes that provide implementation evidence. Required when implemented. */
  implementingRoutes: string[];
  /** Blueprint that fixes this template's grid coordinates, when one exists. */
  blueprintId: string | null;
  openUnknowns: string[];
}

export interface WorkspaceTemplate {
  workspaceId: string;
  name: string;
  templateFamily: string[];
  maturity: TemplateMaturity;
  note: string;
}

export const DENSITY_PROFILES = [
  "operational-compact",
  "operational",
  "executive-standard",
  "standard",
  "practitioner",
  "practitioner-operational",
  "guided",
  "guided-restricted",
] as const;

export type DensityProfile = (typeof DENSITY_PROFILES)[number];

export const DENSITY_PROFILE_LABEL: Record<DensityProfile, string> = {
  "operational-compact": "Operational compact",
  operational: "Operational",
  "executive-standard": "Executive standard",
  standard: "Standard",
  practitioner: "Practitioner",
  "practitioner-operational": "Practitioner operational",
  guided: "Guided",
  "guided-restricted": "Guided restricted",
};

export interface ExperienceFamily {
  familyId: string;
  capacity: string;
  density: DensityProfile;
  homeExperience: string;
  templateEmphasis: string;
  accessibilityEmphasis: string;
  maturity: TemplateMaturity;
}

/* -------------------------------------------------------------------- grid */

export interface ViewportBand {
  bandId: string;
  range: string;
  minWidth: number;
  /** Null means the band is open ended at the top. */
  maxWidth: number | null;
  columns: 4 | 8 | 12;
  outerGutter: string;
  columnGap: string;
  maxContent: string;
  shellBehavior: string;
  contentBehavior: string;
}

export interface CoordinateContract {
  region: string;
  desktop: string;
  tablet: string;
  mobile: string;
}

export interface BlueprintRegion {
  region: string;
  coordinates: string;
  measure: string;
  behavior: string;
}

export interface PageBlueprint {
  blueprintId: string;
  name: string;
  viewport: string;
  purpose: string;
  regions: BlueprintRegion[];
}

/** Desktop planning grid columns, A through L. */
export const GRID_COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export const GRID_ROW_COUNT = 12;

export interface GridCoordinate {
  column: string;
  row: number;
}

/** Parses "A3" into a coordinate. Returns null for prose such as "Collapsed drawer". */
export function parseCoordinate(value: string): GridCoordinate | null {
  const match = /^([A-L])(\d{1,2})$/.exec(value.trim());
  if (!match) return null;
  const row = Number(match[2]);
  if (row < 1 || row > GRID_ROW_COUNT) return null;
  return { column: match[1]!, row };
}

/**
 * True when a value is a well formed coordinate range inside A-L / 1-12 and
 * reads top left to bottom right. Prose fallbacks return false; callers decide
 * whether prose is acceptable for that field.
 */
export function isCoordinateRange(value: string): boolean {
  const [start, end, ...rest] = value.split("-").map((part) => part.trim());
  if (!start || !end || rest.length > 0) return false;
  const from = parseCoordinate(start);
  const to = parseCoordinate(end);
  if (!from || !to) return false;
  const fromColumn = GRID_COLUMNS.indexOf(from.column as (typeof GRID_COLUMNS)[number]);
  const toColumn = GRID_COLUMNS.indexOf(to.column as (typeof GRID_COLUMNS)[number]);
  return toColumn >= fromColumn && to.row >= from.row;
}

/* ------------------------------------------------------------------ states */

export interface StateTemplate {
  stateId: string;
  name: string;
  requiredContent: string[];
  visualRule: string;
  statusLanguage: string;
}

/** Explicit status vocabulary. Optimistic labels are refused. */
export const STATUS_LANGUAGE = [
  "Approved",
  "In review",
  "Blocked",
  "Unknown",
  "Superseded",
  "Not run",
  "Failed",
  "Passed with findings",
  "Not authorized",
] as const;

export const REFUSED_STATUS_LANGUAGE = [
  "Good",
  "Healthy",
  "On track",
  "All clear",
  "Green",
] as const;

/* ------------------------------------------------------- tokens and assets */

export interface TokenRecord {
  group: string;
  name: string;
  value: string;
  use: string;
}

export interface TypeRoleRecord {
  role: string;
  font: "Poppins" | "Plus Jakarta Sans" | "JetBrains Mono";
  weight: string;
  desktopSize: string;
  fluidRule: string;
  alignment: string;
}

export interface ComponentGeometryRecord {
  component: string;
  height: string;
  /** Minimum effective target in CSS pixels, where the component is interactive. */
  minTargetPx: number | null;
  radius: string;
  padding: string;
  notes: string;
}

export interface MotionTokenRecord {
  token: string;
  durationMs: number;
  easing: string;
  use: string;
}

export interface BrandAssetRecord {
  assetId: string;
  name: string;
  componentName: string;
  svg: string;
  pngSizes: string;
  backgroundVariants: string;
  decorativeOnly: boolean;
  notes: string;
  provenance: string;
}

/* ----------------------------------------------------- quality and evidence */

export interface AccessibilityRequirement {
  requirementId: string;
  requirement: string;
  minimum: string;
}

export const VALIDATION_RESULTS = ["not-run", "pass", "fail"] as const;
export type ValidationResult = (typeof VALIDATION_RESULTS)[number];

export const VALIDATION_RESULT_LABEL: Record<ValidationResult, string> = {
  "not-run": "Not run",
  pass: "Pass",
  fail: "Fail",
};

export interface ValidationViewport {
  viewportId: string;
  width: number;
  height: number | null;
  label: string;
  result: ValidationResult;
  /** ISO date of the recorded run, or null when no run exists. */
  recordedOn: string | null;
}

export const CONFORMANCE_STATUSES = ["met", "not-met", "unverified"] as const;
export type ConformanceStatus = (typeof CONFORMANCE_STATUSES)[number];

export const CONFORMANCE_STATUS_LABEL: Record<ConformanceStatus, string> = {
  met: "Met",
  "not-met": "Not met",
  unverified: "Unverified",
};

export interface ConformanceCheck {
  checkId: string;
  check: string;
  status: ConformanceStatus;
  basis: string;
}

/* -------------------------------------------------------------- validators */

export function validateTemplates(templates: InterfaceTemplate[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const template of templates) {
    if (seen.has(template.templateId)) {
      problems.push(`Duplicate template identifier: ${template.templateId}`);
    }
    seen.add(template.templateId);
    if (template.requiredAnatomy.length === 0) {
      problems.push(`${template.templateId} declares no required anatomy.`);
    }
    if (!TEMPLATE_MATURITIES.includes(template.maturity)) {
      problems.push(`${template.templateId} carries an undeclared maturity label.`);
    }
    if (template.maturity === "implemented" && template.implementingRoutes.length === 0) {
      problems.push(
        `${template.templateId} claims implementation without naming an implementing route.`,
      );
    }
    if (template.maturity !== "implemented" && template.implementingRoutes.length > 0) {
      // Partial route coverage is allowed, but it must not be read as evidence.
      if (template.openUnknowns.length === 0) {
        problems.push(
          `${template.templateId} names routes without an implemented label and records no open unknown.`,
        );
      }
    }
  }
  return problems;
}

export function validateBlueprints(blueprints: PageBlueprint[]): string[] {
  const problems: string[] = [];
  for (const blueprint of blueprints) {
    if (blueprint.regions.length === 0) {
      problems.push(`${blueprint.blueprintId} defines no regions.`);
    }
    for (const region of blueprint.regions) {
      if (!isCoordinateRange(region.coordinates)) {
        problems.push(
          `${blueprint.blueprintId}: region "${region.region}" uses coordinates outside A-L / 1-12 (${region.coordinates}).`,
        );
      }
    }
  }
  return problems;
}

/** Viewport bands must cover 320px upward with no gap and no overlap. */
export function validateViewportBands(bands: ViewportBand[]): string[] {
  const problems: string[] = [];
  const ordered = [...bands].sort((a, b) => a.minWidth - b.minWidth);
  if (ordered[0]?.minWidth !== 320) {
    problems.push("Viewport bands must start at 320px, the reflow floor.");
  }
  ordered.forEach((band, index) => {
    const next = ordered[index + 1];
    if (!next) {
      if (band.maxWidth !== null) {
        problems.push("The widest viewport band must be open ended.");
      }
      return;
    }
    if (band.maxWidth === null) {
      problems.push(`${band.bandId} is open ended but is not the widest band.`);
      return;
    }
    if (next.minWidth !== band.maxWidth + 1) {
      problems.push(`Gap or overlap between ${band.bandId} and ${next.bandId}.`);
    }
  });
  return problems;
}

/** Interactive components must meet the 44 by 44 CSS pixel effective target. */
export function componentsBelowTarget(records: ComponentGeometryRecord[]): string[] {
  return records
    .filter((record) => record.minTargetPx !== null && record.minTargetPx < 44)
    .map((record) => record.component);
}

export function unrecordedValidationViewports(
  viewports: ValidationViewport[],
): ValidationViewport[] {
  return viewports.filter(
    (viewport) => viewport.result === "not-run" || viewport.recordedOn === null,
  );
}
