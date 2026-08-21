# SSLS Brand Visual System + Enterprise Experience Template Architecture v0.1

Implements the uploaded specification end to end as the next governed increment, on top of the existing foundation (authority ledger, capabilities, shared objects, value streams). Same posture: founder/operator only, synthetic fixtures, no PII, no AI features.

## 1. Token layer (governed, single source of truth)

Rewrite `src/styles.css` as the SSLS token architecture from Section 17, keeping the existing semantic signal tokens so no current route breaks:

- Brand palette as named tokens: Midnight Navy `#07132E`, Deep Navy `#050B18`, Silver Blue `#B9DFF2`, Ice Blue `#D8F1FA`, Signal Blue `#3BA8E6`, Signal Cyan `#22C9C0`, Neutral Ink `#2A3656`, Progress Green, Attention Yellow (converted to oklch, hex recorded in comments).
- Semantic status tokens: success, warning, danger, information, unknown — each still rendered with label + shape, never color alone.
- Spacing ladder `--space-1: 4px` … `--space-32: 128px`; layout tokens `--page-gutter`, `--content-max`, `--sidebar-width`, `--context-rail-width` using the clamp rules from Section 4.2.
- Type scale tokens with the clamp() values from Section 3 (Poppins display, Plus Jakarta Sans body, JetBrains Mono for IDs/metadata), radius (6/8/12/16), motion (120/200/320ms), focus (2px width, 2px offset), control heights (44/48px).
- Fonts loaded via `<link>` in `__root.tsx` (adds JetBrains Mono).
- Gradient stays a thin signal layer only; no page-fill decoration.

## 2. Brand asset components

New `src/components/brand/`: `SSLSStar`, `SSLSTrajectory`, `SSLSMonogram`, `SSLSLockup`, `SSLSConstellation` — inline SVG, geometry built from the documented star/trajectory stroke and scaling tables. Decorative instances are `aria-hidden`/`focusable="false"`; meaningful lockups carry the organization name as accessible name. Each component exports a provenance note (working direction, vector master not yet validated) surfaced in the asset register.

## 3. Template architecture domain + fixtures

New `src/domain/experience/` and `src/fixtures/experience/` modelling, with maturity labels (Implemented / Prototype / Specified / Research candidate / Gated future) — the label is declared, never inferred from the fact that a screen renders:

- 8 architecture layers (tokens → primitives → components → patterns → page templates → workspace templates → role projection → product experience).
- 18 universal interface templates with primary job and required anatomy.
- 9 enterprise workspace templates.
- 9 user/capacity experience families with density profile, home experience, emphasis.
- Grid system: 7 viewport bands, battleship A–L / 1–12 coordinate contracts, and blueprint region tables for Command Center, Registry, Record Detail, Educator Home, Student Home.
- 8 content-state templates (loading, empty, no results, permission denied, validation error, network error, stale/partial, blocked dependency).
- Asset export matrix, accessibility requirement table, responsive validation matrix (9 viewports) with results recorded as "not yet validated" until measured.

Every template record links to the routes that currently implement it, so unimplemented templates cannot masquerade as built.

## 4. Interface surfaces

New route group `/design-system` (added to the route registry, nav, and traceability) with addressable tabs:

Overview · Tokens · Typography · Grid & Coordinates · Brand Assets · Templates · Workspaces · Experience Families · Blueprints · States · Motion & Responsive · Accessibility · Conformance.

Plus `/design-system/templates/$templateId` detail pages: job, required anatomy, maturity label, blueprint coordinates, implementing routes, open unknowns.

The States tab renders live examples of the eight state templates. The Conformance tab lists the Section 19.1 "definition of done" checks with honest current status (met / not met / unverified), including the responsive validation matrix as unrecorded until a run exists.

## 5. Shell and existing-route alignment

Non-destructive pass over `AppShell` and the shared `page.tsx` primitives so they consume the new layout, control-height, and grid tokens: sidebar width tokens, page gutter clamp, 44px minimum targets, one H1 per page, breadcrumb/section-nav pattern, brand lockup in the shell header. Existing route content and governance semantics are unchanged.

## 6. Tests

Extend Vitest with `src/test/design-system.test.tsx`:

- All 18 universal templates, 9 workspaces, 9 experience families, 8 state templates present and uniquely identified.
- Every template carries an explicit maturity label; maturity is never derived from route existence.
- No template claims Implemented without a listed implementing route.
- Grid bands cover 320px through 1920px with no gaps; blueprint coordinates stay inside A–L / 1–12.
- Control tokens meet 44px minimum; body type never below 16px; motion tokens match spec durations.
- Decorative brand SVGs render `aria-hidden`; the lockup exposes an accessible name.
- Routes render with exactly one H1.

## 7. Documentation

`docs/brand-visual-system/` — token architecture, brand asset standards and provenance, grid and coordinate system, typography and text geometry, component geometry, template architecture, workspace templates, experience families, blueprints, state templates, motion and responsive behavior, accessibility and validation matrix, conformance status, source basis and evidence notes. Indexed from `docs/README.md`.

## Refusals recorded

- No claim of WCAG conformance — the spec is AA-informed, automated checks are evidence only.
- No claim that the constellation family is canonical; it stays working direction pending explicit promotion.
- No blended "design system completeness percentage".
- No PNG-in-SVG assets, no decorative full-page gradient, no infinite star-field motion.
