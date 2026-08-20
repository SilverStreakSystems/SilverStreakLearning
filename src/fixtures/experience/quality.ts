import type {
  AccessibilityRequirement,
  ConformanceCheck,
  StateTemplate,
  ValidationViewport,
} from "@/domain";

/** Section 14: the eight required content states. */
export const STATE_TEMPLATES: StateTemplate[] = [
  {
    stateId: "ST-LOADING",
    name: "Loading",
    requiredContent: ["What is loading", "Non-blocking skeleton where appropriate"],
    visualRule: "No rapid pulse. Respects reduced motion.",
    statusLanguage: "Loading",
  },
  {
    stateId: "ST-EMPTY",
    name: "Empty",
    requiredContent: ["What belongs here", "Why it is empty", "One next action"],
    visualRule: "Restrained star or trajectory motif only when it adds orientation.",
    statusLanguage: "Unknown",
  },
  {
    stateId: "ST-NO-RESULTS",
    name: "No results",
    requiredContent: ["Search or filter explanation", "Reset option"],
    visualRule: "Do not imply system failure.",
    statusLanguage: "Unknown",
  },
  {
    stateId: "ST-DENIED",
    name: "Permission denied",
    requiredContent: ["What is unavailable", "Why", "A safe next step"],
    visualRule: "No withheld data may be present in the DOM or client state.",
    statusLanguage: "Not authorized",
  },
  {
    stateId: "ST-VALIDATION",
    name: "Validation error",
    requiredContent: ["The field and the problem", "Correction guidance"],
    visualRule: "Associated programmatically with the control.",
    statusLanguage: "Failed",
  },
  {
    stateId: "ST-NETWORK",
    name: "Network or server error",
    requiredContent: ["What happened", "Retry or safe next step"],
    visualRule: "Preserve entered data where practical.",
    statusLanguage: "Failed",
  },
  {
    stateId: "ST-STALE",
    name: "Stale or partial data",
    requiredContent: ["Freshness timestamp", "Missing source or conflict"],
    visualRule: "Never present partial data as complete.",
    statusLanguage: "Passed with findings",
  },
  {
    stateId: "ST-BLOCKED",
    name: "Blocked dependency",
    requiredContent: ["Blocking object or rule", "Owner", "Next action"],
    visualRule: "Refusal is treated as successful governance where appropriate.",
    statusLanguage: "Blocked",
  },
];

/** Section 18: accessibility minimums. Not a conformance determination. */
export const ACCESSIBILITY_REQUIREMENTS: AccessibilityRequirement[] = [
  { requirementId: "AC-01", requirement: "Body contrast", minimum: "4.5 to 1" },
  { requirementId: "AC-02", requirement: "Large text contrast", minimum: "3 to 1" },
  { requirementId: "AC-03", requirement: "Non-text and focus contrast", minimum: "3 to 1" },
  { requirementId: "AC-04", requirement: "Body text", minimum: "16px for primary reading" },
  { requirementId: "AC-05", requirement: "Touch target", minimum: "44 by 44px effective target" },
  {
    requirementId: "AC-06",
    requirement: "Zoom",
    minimum: "200 percent without loss of essential content",
  },
  { requirementId: "AC-07", requirement: "Reflow", minimum: "Usable at 320 CSS pixels" },
  {
    requirementId: "AC-08",
    requirement: "Keyboard",
    minimum: "Every interactive element operable; logical focus order",
  },
  { requirementId: "AC-09", requirement: "Focus", minimum: "Visible on all supported surfaces" },
  { requirementId: "AC-10", requirement: "Motion", minimum: "prefers-reduced-motion respected" },
  { requirementId: "AC-11", requirement: "Status", minimum: "Never color only" },
  {
    requirementId: "AC-12",
    requirement: "Tables",
    minimum: "Headers, captions, and scrolling preserve meaning",
  },
  {
    requirementId: "AC-13",
    requirement: "Language",
    minimum: "lang metadata; localization-safe strings; RTL-compatible layout",
  },
];

/**
 * Section 18.1: the responsive validation matrix.
 *
 * Every entry is unrecorded. A clamp() in the stylesheet is not a measurement,
 * and this build has not executed a viewport validation run.
 */
export const VALIDATION_VIEWPORTS: ValidationViewport[] = [
  {
    viewportId: "VV-320",
    width: 320,
    height: 568,
    label: "320 by 568",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-375",
    width: 375,
    height: 667,
    label: "375 by 667",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-390",
    width: 390,
    height: 844,
    label: "390 by 844",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-768",
    width: 768,
    height: 1024,
    label: "768 by 1024",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-1024",
    width: 1024,
    height: 768,
    label: "1024 by 768",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-1280",
    width: 1280,
    height: 720,
    label: "1280 by 720",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-1366",
    width: 1366,
    height: 768,
    label: "1366 by 768",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-1440",
    width: 1440,
    height: 900,
    label: "1440 by 900",
    result: "not-run",
    recordedOn: null,
  },
  {
    viewportId: "VV-1920",
    width: 1920,
    height: 1080,
    label: "1920 by 1080",
    result: "not-run",
    recordedOn: null,
  },
];

/** Section 19.1: definition of visual-system done, stated honestly. */
export const CONFORMANCE_CHECKS: ConformanceCheck[] = [
  {
    checkId: "CF-01",
    check: "No hard-coded color drift in route components where semantic tokens should apply.",
    status: "unverified",
    basis: "Routes use semantic classes, but no automated check enforces this yet.",
  },
  {
    checkId: "CF-02",
    check: "No unexplained one-off spacing values.",
    status: "unverified",
    basis:
      "Spacing follows Tailwind's 4px scale, which resolves to the micro unit, but no audit has been run.",
  },
  {
    checkId: "CF-03",
    check: "Every route has one H1 and a stable page-header pattern.",
    status: "met",
    basis:
      "All routes render through PageHeader; the heading test asserts exactly one H1 per route.",
  },
  {
    checkId: "CF-04",
    check: "Every interactive state includes hover, focus, disabled, and error where applicable.",
    status: "not-met",
    basis: "Disabled and error states are not exercised: this workspace has no data entry.",
  },
  {
    checkId: "CF-05",
    check:
      "Every future-state template is labelled by maturity and does not masquerade as implemented capability.",
    status: "met",
    basis:
      "Maturity is a declared field, and the template invariant test refuses an implemented claim without an implementing route.",
  },
  {
    checkId: "CF-06",
    check: "SVG and PNG assets carry an explicit source and provenance note.",
    status: "met",
    basis:
      "Every brand component records provenance; the favicon is recorded as a template default, not an SSLS asset.",
  },
  {
    checkId: "CF-07",
    check:
      "Operational pages remain product first; constellation imagery accents rather than overwhelms.",
    status: "met",
    basis: "Brand marks appear in the shell header and the brand asset view only.",
  },
  {
    checkId: "CF-08",
    check: "Responsive validation matrix recorded at the nine required viewports.",
    status: "not-met",
    basis: "No validation run has been executed; all nine entries are recorded as not run.",
  },
  {
    checkId: "CF-09",
    check: "Contrast measured against the 4.5 to 1 and 3 to 1 minimums.",
    status: "unverified",
    basis: "Tokens were selected for contrast, but no measurement has been recorded.",
  },
];

/** Claims this increment refuses to make. */
export const VISUAL_SYSTEM_REFUSALS = [
  {
    refusalId: "VSR-01",
    claim: "This interface conforms to WCAG 2.2 AA.",
    reason:
      "The specification is AA informed. Automated checks are evidence, not certification, and no independent determination exists.",
  },
  {
    refusalId: "VSR-02",
    claim: "The constellation and monogram family is the canonical SSLS identity.",
    reason:
      "It is the current working visual direction. Canonical promotion requires an explicit approved decision and a validated vector master.",
  },
  {
    refusalId: "VSR-03",
    claim: "The design system is a stated percentage complete.",
    reason:
      "A blended completeness number would merge declared maturity, implementation, and validation into one unexaminable figure.",
  },
  {
    refusalId: "VSR-04",
    claim: "The responsive layout is validated because the CSS uses clamp().",
    reason:
      "A fluid rule is an intention. Validation requires a recorded measurement at each viewport.",
  },
  {
    refusalId: "VSR-05",
    claim: "These brand components are production vector assets.",
    reason: "No validated vector master is recorded in this repository.",
  },
];
