/**
 * Generates the design-system reference documents directly from the fixtures
 * so the documents cannot drift from the implemented registry.
 *
 * Run: bun scripts/gen-design-system-docs.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  ACCESSIBILITY_REQUIREMENTS,
  BRAND_ASSETS,
  COMPONENT_GEOMETRY,
  CONFORMANCE_CHECKS,
  COORDINATE_CONTRACTS,
  DESIGN_TOKENS,
  ENTERPRISE_WORKSPACE_TEMPLATES,
  EXPERIENCE_FAMILIES,
  INTERFACE_TEMPLATES,
  MOTION_REFUSALS,
  MOTION_TOKENS,
  PAGE_BLUEPRINTS,
  STATE_TEMPLATES,
  TYPE_ROLES,
  VALIDATION_VIEWPORTS,
  VIEWPORT_BANDS,
} from "../src/fixtures";
import {
  DENSITY_PROFILE_LABEL,
  REFUSED_STATUS_LANGUAGE,
  STATUS_LANGUAGE,
  TEMPLATE_MATURITY_META,
} from "../src/domain";

const OUT = join(process.cwd(), "docs", "design-system");
mkdirSync(OUT, { recursive: true });

const esc = (value: string) => value.replace(/\|/g, "\\|");
const table = (headers: string[], rows: string[][]) =>
  [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(esc).join(" | ")} |`),
  ].join("\n");

const write = (name: string, body: string) => {
  writeFileSync(join(OUT, name), `${body.trim()}\n`, "utf8");
  console.log(`wrote docs/design-system/${name}`);
};

write(
  "01-tokens.md",
  `# Token architecture

Authority: Working direction. Generated from fixtures.

Every visual value lives in \`src/styles.css\`. Components consume tokens and
never carry their own hex codes or one-off pixel values.

${table(
  ["Token", "Group", "Value", "Use"],
  DESIGN_TOKENS.map((t) => [t.name, t.group, t.value, t.use]),
)}

## Gradient rule

The extended gradient is a signal layer, not a page fill. Permitted: thin
progress and signal treatments. Refused: full-page gradient fills, gradient
hero wallpaper, gradient text on operational surfaces.

## Motion

${table(
  ["Token", "Duration", "Easing", "Use"],
  MOTION_TOKENS.map((t) => [t.token, `${t.durationMs}ms`, t.easing, t.use]),
)}

Motion refusals:

${MOTION_REFUSALS.map((r) => `- ${r}`).join("\n")}
`,
);

write(
  "02-typography.md",
  `# Typography and text geometry

Authority: Working direction. Generated from fixtures.

Poppins carries display and headings, Plus Jakarta Sans carries body and
interface text, JetBrains Mono carries identifiers and metadata.

${table(
  ["Role", "Font", "Weight", "Desktop size", "Fluid rule", "Alignment"],
  TYPE_ROLES.map((r) => [r.role, r.font, r.weight, r.desktopSize, r.fluidRule, r.alignment]),
)}

## Alignment rules

- Long prose is left aligned and never fully justified.
- Table text is left aligned; numeric data is right aligned.
- Button labels are centered inside the control.
- Center alignment is permitted only on hero and title surfaces.
- Operational instructions are never centered.
`,
);

write(
  "03-coordinate-grid.md",
  `# Battleship coordinate grid

Authority: Working direction. Generated from fixtures.

Twelve columns labelled A to L, twelve conceptual rows. Placement is stated as
a coordinate range so it can be reviewed without ambiguity.

## Viewport bands

${table(
  ["Band", "Columns", "Outer gutter", "Column gap", "Max content", "Shell", "Content"],
  VIEWPORT_BANDS.map((b) => [
    b.range,
    String(b.columns),
    b.outerGutter,
    b.columnGap,
    b.maxContent,
    b.shellBehavior,
    b.contentBehavior,
  ]),
)}

## Coordinate contracts

${table(
  ["Region", "Desktop", "Tablet", "Mobile"],
  COORDINATE_CONTRACTS.map((c) => [c.region, c.desktop, c.tablet, c.mobile]),
)}

Prose values mark regions that leave the grid, for example a collapsed mobile
drawer.

## Component geometry

${table(
  ["Component", "Height or size", "Minimum target", "Radius", "Padding", "Notes"],
  COMPONENT_GEOMETRY.map((c) => [
    c.component,
    c.height,
    c.minTargetPx === null ? "Not interactive" : `${c.minTargetPx}px`,
    c.radius,
    c.padding,
    c.notes,
  ]),
)}

## Page blueprints

${PAGE_BLUEPRINTS.map(
  (bp) => `### ${bp.name} (${bp.blueprintId})

${bp.viewport}. ${bp.purpose}

${table(
  ["Region", "Coordinates", "Measure", "Behavior"],
  bp.regions.map((r) => [r.region, r.coordinates, r.measure, r.behavior]),
)}`,
).join("\n\n")}
`,
);

write(
  "04-brand-assets.md",
  `# Brand assets and provenance

Authority: Working direction. Generated from fixtures.

These are reference geometry drawn from the specification. No validated vector
master is recorded in this repository, so nothing here is a production asset.

${table(
  ["Asset", "Component", "SVG", "PNG sizes", "Backgrounds", "Decorative only", "Provenance"],
  BRAND_ASSETS.map((a) => [
    `${a.assetId} ${a.name}`,
    a.componentName,
    a.svg,
    a.pngSizes,
    a.backgroundVariants,
    a.decorativeOnly ? "Yes, aria-hidden" : "No",
    a.provenance,
  ]),
)}
`,
);

write(
  "05-interface-templates.md",
  `# Universal interface templates

Authority: Working direction. Generated from fixtures.

Maturity is a declared field. It is never derived from implementation status,
test success, or the existence of a route.

${table(
  ["Label", "Meaning"],
  Object.entries(TEMPLATE_MATURITY_META).map(([, meta]) => [meta.label, meta.definition]),
)}

${table(
  ["Template", "Primary job", "Maturity", "Implementing routes"],
  INTERFACE_TEMPLATES.map((t) => [
    `${t.templateId} ${t.name}`,
    t.primaryJob,
    TEMPLATE_MATURITY_META[t.maturity].label,
    t.implementingRoutes.length === 0 ? "None" : t.implementingRoutes.join(", "),
  ]),
)}

## Required anatomy and open unknowns

${INTERFACE_TEMPLATES.map(
  (t) => `### ${t.templateId} — ${t.name}

- Declared maturity: ${TEMPLATE_MATURITY_META[t.maturity].label}
- Required anatomy: ${t.requiredAnatomy.join(", ")}
- Blueprint: ${t.blueprintId ?? "None recorded"}
- Open unknowns:
${t.openUnknowns.map((u) => `  - ${u}`).join("\n")}`,
).join("\n\n")}

## Enterprise workspace templates

Target-state architecture. None is authorized as a released capability.

${table(
  ["Workspace", "Template family", "Maturity", "Note"],
  ENTERPRISE_WORKSPACE_TEMPLATES.map((w) => [
    `${w.workspaceId} ${w.name}`,
    w.templateFamily.join(", "),
    TEMPLATE_MATURITY_META[w.maturity].label,
    w.note,
  ]),
)}
`,
);

write(
  "06-experience-families.md",
  `# End-to-end experience families

Authority: Working direction. Generated from fixtures.

Density and emphasis change with acting capacity. Only the founder and
developer family is implemented; no family may hold live learner data in this
posture.

${table(
  ["Capacity", "Density", "Home experience", "Template emphasis", "Access emphasis", "Maturity"],
  EXPERIENCE_FAMILIES.map((f) => [
    `${f.familyId} ${f.capacity}`,
    DENSITY_PROFILE_LABEL[f.density],
    f.homeExperience,
    f.templateEmphasis,
    f.accessibilityEmphasis,
    TEMPLATE_MATURITY_META[f.maturity].label,
  ]),
)}

## Learner projection rules

- Strengths and assets appear before deficits.
- Language proficiency, disability, academic mastery, behavior, attendance,
  and wellbeing are never combined into one composite risk score.
- Source and freshness are shown for derived or imported data.
- Every sensitive projection states who can see it and why.
- A sentence or a table is preferred over a chart when it says the same thing
  more clearly.
`,
);

write(
  "07-states-and-language.md",
  `# Content states and status language

Authority: Working direction. Generated from fixtures.

Every state says what happened, why, and what to do next. Refusal is presented
as successful governance where that is the truth.

${table(
  ["State", "Required content", "Visual rule", "Status language"],
  STATE_TEMPLATES.map((s) => [
    `${s.stateId} ${s.name}`,
    s.requiredContent.join("; "),
    s.visualRule,
    s.statusLanguage,
  ]),
)}

## Permitted status language

${STATUS_LANGUAGE.map((s) => `- ${s}`).join("\n")}

## Refused status language

${REFUSED_STATUS_LANGUAGE.map((s) => `- ${s}`).join("\n")}

"Good" usually means "we currently lack evidence of a problem", which is a
different statement and must be written as one.
`,
);

write(
  "08-accessibility-and-validation.md",
  `# Accessibility requirements and responsive validation

Authority: Working direction. Generated from fixtures.

The target is a WCAG 2.2 AA-informed implementation. This is not an
independent conformance determination.

${table(
  ["Requirement", "Minimum"],
  ACCESSIBILITY_REQUIREMENTS.map((r) => [`${r.requirementId} ${r.requirement}`, r.minimum]),
)}

## Responsive validation matrix

A \`clamp()\` in the stylesheet is an intention, not a measurement.

${table(
  ["Viewport", "Width", "Result", "Recorded on"],
  VALIDATION_VIEWPORTS.map((v) => [
    v.label,
    `${v.width}px`,
    v.result,
    v.recordedOn ?? "No run recorded",
  ]),
)}
`,
);

write(
  "09-conformance.md",
  `# Definition of visual-system done

Authority: Working direction. Generated from fixtures.

Each check carries a status and the basis for that status. Unverified means
nobody has looked, which is different from met.

${table(
  ["Check", "Status", "Basis"],
  CONFORMANCE_CHECKS.map((c) => [`${c.checkId} ${c.check}`, c.status, c.basis]),
)}

## Why there is no score

A single completeness percentage would merge declared maturity, implementation
evidence, and validation results into one figure that cannot be examined or
challenged. Read the status column instead.
`,
);
