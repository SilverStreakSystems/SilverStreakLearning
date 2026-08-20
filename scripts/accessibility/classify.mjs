/**
 * TTR-001 classification and spacing geometry. Pure functions only.
 *
 * This module derives classifications from measurements. It performs no
 * measurement, reads no file, and states no conformance. Every judgment-based
 * exception is left to a named human reviewer; nothing here infers one.
 */

export const CLASSIFICATIONS = [
  "PASS-44-DEFAULT",
  "PASS-24-FLOOR",
  "PASS-EXCEPTION",
  "FAIL",
  "NOT-APPLICABLE",
];

export const EXCEPTION_TYPES = [
  "SPACING",
  "EQUIVALENT-CONTROL",
  "INLINE",
  "USER-AGENT-CONTROL",
  "ESSENTIAL",
];

export const MECHANICAL_EXCEPTION_TYPES = ["SPACING", "EQUIVALENT-CONTROL"];

export const FAILURE_REASONS = [
  "BELOW-FLOOR-NO-COMPLETED-EXCEPTION",
  "MISSING-COMPACT-CONTEXT-RATIONALE",
  "MULTIPLE-EXCEPTIONS-ASSERTED",
  "EXCEPTION-EVIDENCE-MISSING",
  "MANUAL-REVIEW-UNAVAILABLE",
  "UNSTABLE-LOCATOR",
];

export const REVIEW_STATES = ["NOT-REQUIRED", "PENDING-MANUAL-REVIEW", "COMPLETED"];

export const DEFAULT_CSS_PX = 44;
export const FLOOR_CSS_PX = 24;
export const SPACING_CIRCLE_DIAMETER_CSS_PX = 24;

/** Geometric circle used by the mechanical SPACING test. */
export function spacingCircle(rect) {
  return {
    center_x: rect.x + rect.width / 2,
    center_y: rect.y + rect.height / 2,
    radius_css_px: SPACING_CIRCLE_DIAMETER_CSS_PX / 2,
  };
}

/** True when a circle intersects an axis-aligned rectangle. */
export function circleIntersectsRect(circle, rect) {
  const nearestX = Math.max(rect.x, Math.min(circle.center_x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(circle.center_y, rect.y + rect.height));
  const dx = circle.center_x - nearestX;
  const dy = circle.center_y - nearestY;
  return dx * dx + dy * dy < circle.radius_css_px * circle.radius_css_px;
}

/** True when two circles overlap. */
export function circlesIntersect(a, b) {
  const dx = a.center_x - b.center_x;
  const dy = a.center_y - b.center_y;
  const reach = a.radius_css_px + b.radius_css_px;
  return dx * dx + dy * dy < reach * reach;
}

export function centreDistance(a, b) {
  const dx = a.center_x - b.center_x;
  const dy = a.center_y - b.center_y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Mechanical SPACING determination for one undersized target against every
 * other target rendered in the same route, scenario, and viewport.
 */
export function evaluateSpacing(target, neighbours) {
  const circle = spacingCircle(target.rect);
  const considered = [];
  let pass = true;

  for (const neighbour of neighbours) {
    if (neighbour.id === target.id) continue;
    const neighbourCircle = spacingCircle(neighbour.rect);
    const rectHit = circleIntersectsRect(circle, neighbour.rect);
    const circleHit = circlesIntersect(circle, neighbourCircle);
    if (rectHit || circleHit) pass = false;
    considered.push({
      neighbour_id: neighbour.id,
      neighbour_rect_css_px: neighbour.rect,
      centre_distance_css_px: round(centreDistance(circle, neighbourCircle)),
      intersects_neighbour_rect: rectHit,
      intersects_neighbour_circle: circleHit,
    });
  }

  return {
    circle_center_x_css_px: round(circle.center_x),
    circle_center_y_css_px: round(circle.center_y),
    circle_radius_css_px: circle.radius_css_px,
    neighbours_considered: considered.length,
    neighbours: considered,
    prohibited_intersection: !pass,
    result: pass ? "SPACING-SATISFIED" : "SPACING-NOT-SATISFIED",
  };
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

/**
 * Deterministic TTR-001 classification of one measurement.
 *
 * `assertedExceptions` carries only exceptions that a recorded determination
 * actually supports. An empty array never becomes a pass.
 */
export function classifyTarget(input) {
  const {
    widthCssPx,
    heightCssPx,
    standaloneAuthorControlled,
    compactContextRationale = null,
    assertedExceptions = [],
    exceptionEvidence = null,
    reviewState = "NOT-REQUIRED",
    outOfScopeReason = null,
  } = input;

  if (outOfScopeReason) {
    return {
      classification: "NOT-APPLICABLE",
      classification_reason: outOfScopeReason,
      failure_reason: null,
      default_rule_result: "NOT-EVALUATED",
      measurable_floor_result: "NOT-EVALUATED",
    };
  }

  const smallest = Math.min(widthCssPx, heightCssPx);
  const meetsDefault = widthCssPx >= DEFAULT_CSS_PX && heightCssPx >= DEFAULT_CSS_PX;
  const meetsFloor = widthCssPx >= FLOOR_CSS_PX && heightCssPx >= FLOOR_CSS_PX;

  const defaultResult = meetsDefault ? "MET" : "NOT-MET";
  const floorResult = meetsFloor ? "MET-GEOMETRICALLY" : "NOT-MET-GEOMETRICALLY";

  if (meetsDefault) {
    return {
      classification: "PASS-44-DEFAULT",
      classification_reason: `Both measured dimensions are at least ${DEFAULT_CSS_PX} CSS pixels.`,
      failure_reason: null,
      default_rule_result: defaultResult,
      measurable_floor_result: floorResult,
    };
  }

  if (meetsFloor) {
    if (!standaloneAuthorControlled) {
      return {
        classification: "PASS-24-FLOOR",
        classification_reason:
          "The target is not standalone author-controlled, so the 44 by 44 default does not apply; the 24 by 24 floor is met geometrically.",
        failure_reason: null,
        default_rule_result: defaultResult,
        measurable_floor_result: floorResult,
      };
    }
    if (compactContextRationale && compactContextRationale.trim().length > 0) {
      return {
        classification: "PASS-24-FLOOR",
        classification_reason:
          "The target meets the 24 by 24 floor and carries a recorded compact-context rationale for departing from the 44 by 44 default.",
        failure_reason: null,
        default_rule_result: defaultResult,
        measurable_floor_result: floorResult,
      };
    }
    return {
      classification: "FAIL",
      classification_reason: `The standalone author-controlled target measures ${widthCssPx} by ${heightCssPx} CSS pixels, below the 44 by 44 SSLS default, and carries no recorded compact-context rationale.`,
      failure_reason: "MISSING-COMPACT-CONTEXT-RATIONALE",
      default_rule_result: defaultResult,
      measurable_floor_result: floorResult,
    };
  }

  // Below the measurable floor: only exactly one completed documented exception passes.
  if (assertedExceptions.length > 1) {
    return {
      classification: "FAIL",
      classification_reason: `More than one exception is asserted (${assertedExceptions.join(", ")}); TTR-001 permits exactly one.`,
      failure_reason: "MULTIPLE-EXCEPTIONS-ASSERTED",
      default_rule_result: defaultResult,
      measurable_floor_result: floorResult,
    };
  }

  if (assertedExceptions.length === 1) {
    const type = assertedExceptions[0];
    if (!EXCEPTION_TYPES.includes(type)) {
      return {
        classification: "FAIL",
        classification_reason: `Asserted exception ${type} is not one of the five documented TTR-001 exceptions.`,
        failure_reason: "EXCEPTION-EVIDENCE-MISSING",
        default_rule_result: defaultResult,
        measurable_floor_result: floorResult,
      };
    }
    if (!exceptionEvidence) {
      return {
        classification: "FAIL",
        classification_reason: `Exception ${type} is asserted without the record TTR-001 requires.`,
        failure_reason: "EXCEPTION-EVIDENCE-MISSING",
        default_rule_result: defaultResult,
        measurable_floor_result: floorResult,
      };
    }
    if (!MECHANICAL_EXCEPTION_TYPES.includes(type) && reviewState !== "COMPLETED") {
      return {
        classification: "FAIL",
        classification_reason: `Exception ${type} requires a named human determination, which has not been recorded.`,
        failure_reason: "MANUAL-REVIEW-UNAVAILABLE",
        default_rule_result: defaultResult,
        measurable_floor_result: floorResult,
      };
    }
    return {
      classification: "PASS-EXCEPTION",
      classification_reason: `Exactly one documented exception applies and its required record is present: ${type}.`,
      failure_reason: null,
      default_rule_result: defaultResult,
      measurable_floor_result: floorResult,
    };
  }

  return {
    classification: "FAIL",
    classification_reason: `The target measures ${widthCssPx} by ${heightCssPx} CSS pixels; the smallest dimension ${smallest} is below the 24 by 24 CSS pixel floor and no documented exception is completed for it.`,
    failure_reason:
      reviewState === "PENDING-MANUAL-REVIEW"
        ? "MANUAL-REVIEW-UNAVAILABLE"
        : "BELOW-FLOOR-NO-COMPLETED-EXCEPTION",
    default_rule_result: defaultResult,
    measurable_floor_result: floorResult,
  };
}

/** Recomputes every total from the target records. Never trusts stored totals. */
export function recomputeTotals(record) {
  const tally = (list, key) => {
    const out = {};
    for (const entry of list) {
      const value = entry[key];
      if (value === null || value === undefined) continue;
      out[String(value)] = (out[String(value)] ?? 0) + 1;
    }
    return out;
  };

  const byMeasurement = new Map(record.measurements.map((m) => [m.measurement_id, m]));
  const withViewport = record.classifications.map((c) => ({
    ...c,
    viewport_css_px: byMeasurement.get(c.measurement_id)?.viewport_css_px ?? null,
    route_id: byMeasurement.get(c.measurement_id)?.route_id ?? null,
  }));

  const byViewport = {};
  for (const entry of withViewport) {
    const key = String(entry.viewport_css_px);
    byViewport[key] = byViewport[key] ?? { measured: 0, classifications: {} };
    byViewport[key].measured += 1;
    byViewport[key].classifications[entry.classification] =
      (byViewport[key].classifications[entry.classification] ?? 0) + 1;
  }

  const byRoute = {};
  for (const entry of withViewport) {
    const key = String(entry.route_id);
    byRoute[key] = byRoute[key] ?? { measured: 0, classifications: {} };
    byRoute[key].measured += 1;
    byRoute[key].classifications[entry.classification] =
      (byRoute[key].classifications[entry.classification] ?? 0) + 1;
  }

  return {
    measurement_count: record.measurements.length,
    classification_count: record.classifications.length,
    route_count: record.route_inventory.length,
    scenario_count: record.scenario_inventory.length,
    by_viewport: byViewport,
    by_route: byRoute,
    by_classification: tally(record.classifications, "classification"),
    by_failure_reason: tally(record.classifications, "failure_reason"),
    by_exception_type: tally(record.classifications, "exception_type"),
    by_review_state: tally(record.classifications, "review_state"),
    by_route_outcome: tally(record.route_inventory, "outcome"),
    blocked_route_count: record.route_inventory.filter((r) => r.outcome === "BLOCKED").length,
    pending_manual_review_count: record.classifications.filter(
      (c) => c.review_state === "PENDING-MANUAL-REVIEW",
    ).length,
    unstable_locator_count: record.measurements.filter((m) => m.locator_stable === false).length,
  };
}
