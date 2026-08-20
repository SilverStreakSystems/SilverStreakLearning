export const CLASSIFICATIONS: string[];
export const EXCEPTION_TYPES: string[];
export const MECHANICAL_EXCEPTION_TYPES: string[];
export const FAILURE_REASONS: string[];
export const REVIEW_STATES: string[];
export const DEFAULT_CSS_PX: number;
export const FLOOR_CSS_PX: number;
export const SPACING_CIRCLE_DIAMETER_CSS_PX: number;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpacingCircle {
  center_x: number;
  center_y: number;
  radius_css_px: number;
}

export function spacingCircle(rect: Rect): SpacingCircle;
export function circleIntersectsRect(circle: SpacingCircle, rect: Rect): boolean;
export function circlesIntersect(a: SpacingCircle, b: SpacingCircle): boolean;
export function centreDistance(a: SpacingCircle, b: SpacingCircle): number;
export function evaluateSpacing(
  target: { id: string; rect: Rect },
  neighbours: { id: string; rect: Rect }[],
): Record<string, unknown>;
export function classifyTarget(input: {
  widthCssPx: number;
  heightCssPx: number;
  standaloneAuthorControlled: boolean;
  compactContextRationale?: string | null;
  assertedExceptions?: string[];
  exceptionEvidence?: unknown;
  reviewState?: string;
  outOfScopeReason?: string | null;
}): {
  classification: string;
  classification_reason: string;
  failure_reason: string | null;
  default_rule_result: string;
  measurable_floor_result: string;
};
export function recomputeTotals(record: Record<string, never> | unknown): Record<string, unknown>;
