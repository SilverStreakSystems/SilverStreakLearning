# SSLS Brand Visual System and Enterprise Experience Template Architecture v0.1

Authority: **Working direction.** Not promoted to canonical. This document
describes the visual and interface layer implemented in this repository and
states plainly what has not been verified.

## What this increment does

- Establishes one token source of truth in `src/styles.css` (color, spacing,
  type, radius, motion, control geometry).
- Provides brand asset components in `src/components/brand/` with recorded
  provenance.
- Models eight composition layers, eighteen universal interface templates,
  nine enterprise workspaces, and nine experience families in
  `src/domain/experience/` with fixtures in `src/fixtures/experience/`.
- Publishes the whole system at `/design-system` with thirteen addressable
  views.

## Authority rule

Visual consistency does not change artifact authority. A screen that renders
is not thereby approved, implemented, or validated. Every template carries a
declared maturity label — Implemented, Prototype, Specified, Research
candidate, Gated future — recorded by the founder and never derived from the
existence of a route, a passing test, or a rendered surface.

## Refused claims

| Refused claim                              | Reason                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| WCAG 2.2 AA conformance                    | No independent audit has been performed. The implementation is AA-informed.                             |
| Responsive validation across all viewports | No measurement run has been recorded for any of the nine required viewports.                            |
| Design-system completeness percentage      | It would merge declared maturity, implementation evidence, and validation into one unexaminable figure. |
| Canonical brand identity                   | No validated vector master and no approved decision exist. The assets here are reference geometry.      |

## Document set

- `01-tokens.md` — token architecture and the gradient rule
- `02-typography.md` — type roles, fluid rules, alignment rules
- `03-coordinate-grid.md` — the battleship grid and coordinate contracts
- `04-brand-assets.md` — asset geometry, sizing floors, provenance
- `05-interface-templates.md` — the eighteen templates and their anatomy
- `06-experience-families.md` — capacity-differentiated projections
- `07-states-and-language.md` — the eight content states and status language
- `08-accessibility-and-validation.md` — requirements and the unvalidated matrix
- `09-conformance.md` — definition of visual-system done
