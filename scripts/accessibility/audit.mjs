/**
 * TTR-001 v1.0.0 touch-target verification runner (audit TTA-001).
 *
 * Executes the verification protocol declared by the touch-target acceptance
 * rule against the served production build, captures raw measurements, derives
 * classifications through the pure rules in ./classify.mjs, and writes the
 * canonical audit record.
 *
 * The runner measures and classifies. It changes no interface, remediates
 * nothing, adopts no historical requirement, and states no conformance.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { chromium } from "playwright-core";

import { classifyTarget, evaluateSpacing, recomputeTotals } from "./classify.mjs";
import { SCENARIOS, buildRouteInventory } from "./inventory.mjs";

const AUDIT_RUNNER_VERSION = "1.0.0";
const AUDIT_ID = "TTA-001";
const AUDIT_VERSION = "1.0.0";
const CONTROLLING_DECISION = "DEC-022";
const PORT = Number(process.env["SSLS_AUDIT_PORT"] ?? 4173);
const REPO = process.cwd();
const DIST = join(REPO, "dist");
const RULE_PATH = join(REPO, "data", "accessibility", "touch-target-rule.json");
const OUT_PATH = join(REPO, "data", "accessibility", "touch-target-audit.json");
const CHROMIUM = process.env["SSLS_CHROMIUM"] ?? "/bin/chromium";

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
];

const TARGET_SELECTOR = [
  "a[href]",
  "button",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  "summary",
  "details > summary",
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function fail(code, message) {
  console.error(`\nAUDIT HALTED — ${message}`);
  process.exit(code);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

async function main() {
  // Gate 1 — the production build must exist.
  if (!existsSync(join(DIST, "server", "index.mjs")) || !existsSync(join(DIST, "client"))) {
    fail(2, "no production build is present; run `bun run build` before the audit");
  }

  // Gate 2 — the controlling rule must be the one this audit claims to execute.
  const ruleBytes = await readFile(RULE_PATH);
  const rule = JSON.parse(ruleBytes.toString("utf8"));
  if (rule.rule_id !== "TTR-001" || rule.rule_version !== "1.0.0") {
    fail(2, `expected rule TTR-001 v1.0.0, found ${rule.rule_id} v${rule.rule_version}`);
  }
  const declaredViewports = [...rule.verification.viewports_css_px].sort((a, b) => a - b).join(",");
  if (declaredViewports !== "320,768,1366") {
    fail(2, `rule declares viewports ${declaredViewports}, runner executes 320,768,1366`);
  }

  const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: REPO }).toString().trim();
  const routeRegistryDigest = sha256(await readFile(join(REPO, "src", "lib", "route-registry.ts")));

  const { serveProductionBuild } = await import("./serve.mjs");
  const server = await serveProductionBuild({ distDir: DIST, port: PORT });

  if (!existsSync(CHROMIUM)) {
    await server.close();
    fail(2, `no browser binary at ${CHROMIUM}; set SSLS_CHROMIUM`);
  }

  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ executablePath: CHROMIUM, headless: true });
  const browserVersion = browser.version();

  const routes = buildRouteInventory();
  const measurements = [];
  const classifications = [];
  let measurementSeq = 0;

  try {
    for (const route of routes) {
      if (route.outcome === "BLOCKED") continue;
      let routeOutcome = "AUDITED";
      let routeReason = "Route loaded and every visible enabled pointer target was enumerated.";

      for (const viewport of VIEWPORTS) {
        const scenarios = SCENARIOS.filter((scenario) =>
          scenario.applies_to_viewport_css_px.includes(viewport.width),
        );

        for (const scenario of scenarios) {
          const context = await browser.newContext({
            viewport,
            deviceScaleFactor: 1,
            reducedMotion: "reduce",
          });
          const page = await context.newPage();
          try {
            const response = await page.goto(`${server.origin}${route.route_url}`, {
              waitUntil: "domcontentloaded",
              timeout: 30_000,
            });
            if (!response || response.status() >= 400) {
              routeOutcome = "BLOCKED";
              routeReason = `route returned HTTP ${response ? response.status() : "no response"}`;
              await context.close();
              continue;
            }
            await page.waitForLoadState("load", { timeout: 30_000 }).catch(() => {});
            await page.waitForTimeout(400);

            if (scenario.scenario_id === "SCN-MOBILE-NAV-OPEN") {
              const trigger = page.locator(
                'button[aria-controls="primary-navigation-mobile"][aria-expanded="false"]',
              );
              if ((await trigger.count()) === 0) {
                await context.close();
                continue;
              }
              await trigger.first().click();
              await page.waitForTimeout(250);
            }

            const found = await page.evaluate(collectTargets, TARGET_SELECTOR);

            const pageTargets = found.map((entry, index) => ({
              id: `${route.route_id}|${scenario.scenario_id}|${viewport.width}|${index}`,
              rect: entry.rect,
              entry,
            }));

            const locatorCounts = new Map();
            for (const target of pageTargets) {
              locatorCounts.set(
                target.entry.locator,
                (locatorCounts.get(target.entry.locator) ?? 0) + 1,
              );
            }

            const seen = new Map();
            for (const target of pageTargets) {
              const entry = target.entry;
              const duplicate = locatorCounts.get(entry.locator) > 1;
              const occurrence = (seen.get(entry.locator) ?? 0) + 1;
              seen.set(entry.locator, occurrence);

              measurementSeq += 1;
              const measurementId = `TTM-${String(measurementSeq).padStart(5, "0")}`;
              const width = round(entry.rect.width);
              const height = round(entry.rect.height);

              measurements.push({
                measurement_id: measurementId,
                route_id: route.route_id,
                route_url: route.route_url,
                scenario_id: scenario.scenario_id,
                viewport_css_px: viewport.width,
                viewport_height_css_px: viewport.height,
                locator: duplicate ? `${entry.locator} >> nth=${occurrence - 1}` : entry.locator,
                locator_strategy: entry.locatorStrategy,
                locator_stable: entry.locatorStrategy !== "dom-path" && !duplicate,
                semantic_element: entry.tagName,
                aria_role: entry.role,
                accessible_name: entry.accessibleName,
                computed_display: entry.display,
                inline_context_observed: entry.inlineContext,
                native_control_observed: entry.nativeControl,
                visible: true,
                enabled: true,
                bounding_rect_css_px: {
                  x: round(entry.rect.x),
                  y: round(entry.rect.y),
                  width,
                  height,
                },
                unit: "CSS-PIXEL",
                measured_at: new Date().toISOString(),
                audited_commit: commit,
              });

              const belowFloor = width < 24 || height < 24;
              let spacing = null;
              let assertedExceptions = [];
              let exceptionEvidence = null;

              if (belowFloor) {
                spacing = evaluateSpacing(target, pageTargets);
                if (spacing.result === "SPACING-SATISFIED") {
                  assertedExceptions = ["SPACING"];
                  exceptionEvidence = {
                    determination: "MECHANICAL",
                    bounding_rectangles_considered: spacing.neighbours_considered,
                    computed_circle_geometry: {
                      center_x_css_px: spacing.circle_center_x_css_px,
                      center_y_css_px: spacing.circle_center_y_css_px,
                      radius_css_px: spacing.circle_radius_css_px,
                    },
                    intersection_result: spacing.result,
                  };
                }
              }

              const judgmentPending =
                (belowFloor && assertedExceptions.length === 0) || entry.inlineContext;

              const derived = classifyTarget({
                widthCssPx: width,
                heightCssPx: height,
                standaloneAuthorControlled: true,
                compactContextRationale: null,
                assertedExceptions,
                exceptionEvidence,
                reviewState: judgmentPending ? "PENDING-MANUAL-REVIEW" : "NOT-REQUIRED",
              });

              const ambiguities = [];
              if (entry.inlineContext) {
                ambiguities.push(
                  "Inline text context was observed. Whether this target is standalone, or falls under the INLINE exception, is a judgment reserved to a named reviewer and was not decided by the runner.",
                );
              }
              if (entry.nativeControl) {
                ambiguities.push(
                  "The element is a native form control. Whether its size is user-agent determined and unmodified by the author is a judgment reserved to a named reviewer and was not decided by the runner.",
                );
              }
              if (belowFloor && assertedExceptions.length === 0) {
                ambiguities.push(
                  "The mechanical SPACING test did not pass. EQUIVALENT-CONTROL, INLINE, USER-AGENT-CONTROL, and ESSENTIAL were not assessed by the runner and require a named reviewer.",
                );
              }

              classifications.push({
                classification_id: measurementId.replace("TTM-", "TTC-"),
                measurement_id: measurementId,
                classification: derived.classification,
                classification_reason: derived.classification_reason,
                failure_reason: derived.failure_reason,
                default_rule_result: derived.default_rule_result,
                measurable_floor_result: derived.measurable_floor_result,
                standalone_author_controlled: true,
                compact_context_rationale: null,
                exception_type: assertedExceptions[0] ?? null,
                exception_determination: assertedExceptions.length === 1 ? "MECHANICAL" : null,
                exception_evidence: exceptionEvidence,
                equivalent_control_locator: null,
                spacing_calculation: spacing,
                reviewer_requirement: judgmentPending
                  ? "MANUAL-REVIEW-REQUIRED"
                  : "MANUAL-REVIEW-NOT-REQUIRED",
                reviewer_identity: null,
                review_state: judgmentPending ? "PENDING-MANUAL-REVIEW" : "NOT-REQUIRED",
                reviewer_and_evidence_reference: null,
                unresolved_ambiguity: ambiguities.length > 0 ? ambiguities.join(" ") : null,
                linked_finding_ids: [],
              });
            }
          } catch (error) {
            routeOutcome = "BLOCKED";
            routeReason = `execution error: ${String(error?.message ?? error)}`;
          } finally {
            await context.close();
          }
        }
      }

      route.outcome = routeOutcome;
      route.outcome_reason = routeReason;
    }
  } finally {
    await browser.close();
    await server.close();
  }

  const finishedAt = new Date().toISOString();
  const auditedRoutes = routes.filter((route) => route.outcome === "AUDITED");
  const blockedRoutes = routes.filter((route) => route.outcome !== "AUDITED");

  const record = {
    schema_version: "1.0.0",
    audit_id: AUDIT_ID,
    audit_version: AUDIT_VERSION,
    title: "SSLS touch-target verification execution — TTR-001 v1.0.0",
    controlling_decision: CONTROLLING_DECISION,
    rule_binding: {
      rule_id: rule.rule_id,
      rule_version: rule.rule_version,
      rule_record_sha256: sha256(ruleBytes),
      rule_lifecycle_state_at_execution: rule.lifecycle_state,
    },
    audited_commit: commit,
    audit_completion_state: blockedRoutes.length === 0 ? "COMPLETE" : "PARTIAL",
    environment: {
      started_at: startedAt,
      finished_at: finishedAt,
      browser_engine: "chromium",
      browser_version: browserVersion,
      automation_library: "playwright-core",
      device_scale_factor: 1,
      reduced_motion: "reduce",
      viewports_css_px: VIEWPORTS.map((viewport) => viewport.width),
      viewport_dimensions_css_px: VIEWPORTS,
      audit_runner_version: AUDIT_RUNNER_VERSION,
      route_registry_sha256: routeRegistryDigest,
      artifact_under_test: "production build served locally from dist/",
      serve_method:
        "The built Worker server entry is executed in-process behind a local HTTP listener; built client assets are served through the ASSETS binding.",
      command_sequence: ["bun run build", "bun run audit:touch-targets"],
    },
    route_inventory: routes,
    scenario_inventory: SCENARIOS,
    measurements,
    classifications,
    totals: {},
    limitations: [
      "Every target was treated as standalone and author-controlled. The runner does not decide whether a target is inline, user-agent sized, or otherwise non-standalone; those determinations are reserved to a named reviewer, so no target was passed on that basis.",
      "No compact-context rationale exists in any authorized record, so no target between 24 and 43 CSS pixels could be classified as a passing departure.",
      "Only the mechanical SPACING exception was applied. EQUIVALENT-CONTROL, INLINE, USER-AGENT-CONTROL, and ESSENTIAL were not asserted by the runner.",
      "Measurement uses the element bounding rectangle. Interactive area contributed by pseudo-elements or ancestor hit areas was not modelled.",
      "The audit covers the rendered default state of each route plus the declared mobile navigation disclosure scenario. Dialogs, menus, and other transient surfaces that require further interaction were not enumerated.",
      "Remote web fonts are loaded over the network, so text-derived target metrics depend on font availability at execution time.",
      "Locators marked unstable are order dependent and must be re-derived before any future remediation is attributed to them.",
    ],
    evidence_references: ["EV-044"],
    non_claims: [
      "No WCAG 2.2 conformance is claimed at any level.",
      "No ADA, Section 508, or other legal compliance is claimed.",
      "No independent, expert, or district validation has occurred.",
      "This audit adopts, assesses, implements, and promotes no historical requirement; HREQ-025 remains NEEDS-EVIDENCE / DEFER and EV-003 remains NOT-RUN.",
      "A passing classification records the result of one internal SSLS acceptance rule and confers no accessibility, release, or production-readiness authority.",
      "No interface change, remediation, or design decision is authorized by this audit.",
    ],
    history: [
      {
        audit_version: AUDIT_VERSION,
        recorded_on: finishedAt.slice(0, 10),
        decision: CONTROLLING_DECISION,
        change:
          "First execution of the TTR-001 v1.0.0 verification protocol against the served production build, capturing measurements and derived classifications at 320, 768, and 1366 CSS pixels.",
        boundary:
          "Execution records what the interface measures. It changes no interface and creates no conformance.",
      },
    ],
  };

  record.totals = recomputeTotals(record);

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(record, null, 2)}\n`, "utf8");

  const totals = record.totals;
  console.log(`audit ${AUDIT_ID} v${AUDIT_VERSION} — ${record.audit_completion_state}`);
  console.log(`commit ${commit}`);
  console.log(`routes audited ${auditedRoutes.length} of ${routes.length}`);
  console.log(`measurements ${totals.measurement_count}`);
  console.log(`classifications ${JSON.stringify(totals.by_classification)}`);
  console.log(`failure reasons ${JSON.stringify(totals.by_failure_reason)}`);
  console.log(`pending manual review ${totals.pending_manual_review_count}`);

  // Gate 3 — an audit that measured nothing is not an audit.
  if (totals.measurement_count === 0) fail(3, "no targets were measured");
  if (totals.classification_count !== totals.measurement_count) {
    fail(3, "every measurement must carry exactly one classification");
  }
  for (const viewport of VIEWPORTS) {
    if (!totals.by_viewport[String(viewport.width)]) {
      fail(3, `viewport ${viewport.width} produced no classifications`);
    }
  }
  if (auditedRoutes.length === 0) fail(3, "no route was audited");

  console.log("\nAudit record written to data/accessibility/touch-target-audit.json");
  console.log(
    "Execution measures and classifies only. No interface changed and no conformance is claimed.",
  );
}

/** Runs inside the page. Enumerates visible, enabled pointer targets. */
function collectTargets(selector) {
  const isVisible = (element, style, rect) => {
    if (rect.width <= 0 || rect.height <= 0) return false;
    if (style.visibility === "hidden" || style.display === "none") return false;
    if (Number(style.opacity) === 0) return false;
    if (element.closest("[hidden]") !== null) return false;
    if (element.closest('[aria-hidden="true"]') !== null) return false;
    return true;
  };

  const accessibleName = (element) =>
    (
      element.getAttribute("aria-label") ??
      element.getAttribute("title") ??
      element.textContent ??
      ""
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);

  const domPath = (element) => {
    const parts = [];
    let node = element;
    while (node && node.nodeType === 1 && parts.length < 8) {
      const parent = node.parentElement;
      const index = parent ? Array.from(parent.children).indexOf(node) + 1 : 1;
      parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);
      node = parent;
    }
    return parts.join(" > ");
  };

  const implicitRole = (element) => {
    const tag = element.tagName.toLowerCase();
    if (element.getAttribute("role")) return element.getAttribute("role");
    if (tag === "a") return "link";
    if (tag === "button" || tag === "summary") return "button";
    if (tag === "select") return "combobox";
    if (tag === "textarea") return "textbox";
    if (tag === "input") {
      const type = (element.getAttribute("type") ?? "text").toLowerCase();
      if (type === "checkbox") return "checkbox";
      if (type === "radio") return "radio";
      if (type === "button" || type === "submit" || type === "reset") return "button";
      return "textbox";
    }
    return null;
  };

  const results = [];
  const seen = new Set();

  for (const element of Array.from(document.querySelectorAll(selector))) {
    if (seen.has(element)) continue;
    seen.add(element);

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (!isVisible(element, style, rect)) continue;
    if (element.hasAttribute("disabled")) continue;
    if (element.getAttribute("aria-disabled") === "true") continue;

    const role = implicitRole(element);
    const name = accessibleName(element);
    const tag = element.tagName.toLowerCase();

    let locator = domPath(element);
    let locatorStrategy = "dom-path";
    if (role && name) {
      locator = `role=${role}[name="${name}"]`;
      locatorStrategy = "role-and-name";
    } else if (element.id) {
      locator = `#${element.id}`;
      locatorStrategy = "id";
    }

    const parent = element.parentElement;
    const parentText = parent ? (parent.textContent ?? "").replace(/\s+/g, " ").trim() : "";
    const inlineContext = style.display.startsWith("inline") && parentText.length > name.length + 8;

    results.push({
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      tagName: tag,
      role,
      accessibleName: name,
      display: style.display,
      inlineContext,
      nativeControl: ["input", "select", "textarea"].includes(tag),
      locator,
      locatorStrategy,
    });
  }

  return results;
}

await main();
