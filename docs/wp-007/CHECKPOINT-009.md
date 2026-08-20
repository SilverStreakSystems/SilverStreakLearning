# CHECKPOINT-009 — WP-007 Cycle 7

Recorded: 2026-08-20
Entry commit: f8978cecbbe9dee01babc34ecc20540dd8d3b2e6
Controlling decision: DEC-021
Evidence: EV-043

## Authorization

The owner authorized exactly one bounded WP-007 Cycle 7, limited to resolving the
evidence-definition gap carried by FND-023. Nothing else was authorized: not
Cycle 8, not WP-039, not implementation of any HREQ candidate, not any
user-interface, CSS, component, or route change, not an interface audit, not
release, promotion, or any compliance claim.

## Entry state, verified rather than assumed

| Controlling fact | Verified at entry |
| --- | --- |
| DEC-020 | ACCEPTED |
| Latest checkpoint | CHECKPOINT-008 |
| WP-007 | ACTIVE |
| Gate A | OPEN |
| HREQ-025 | NEEDS-EVIDENCE / DEFER, NOT-ASSESSED, NOT-PROMOTED, NOT-IMPLEMENTED |
| FND-023 | Open, blocked, the current next defensible action |
| EV-003 | NOT-RUN |
| Baseline suite | 381 of 381 tests across 18 files |
| Lint debt | Retained under FND-014, not misreported |
| Cycle 7 identifiers | DEC-021, EV-043, CHECKPOINT-009 all unused at entry |

## What Cycle 7 did

The SSLS touch-target acceptance rule is recorded as one canonical structured
record, TTR-001 v1.0.0, at `data/accessibility/touch-target-rule.json`, bound by
the Draft 2020-12 schema `data/accessibility/TOUCH_TARGET_RULE_SCHEMA.json`,
typed and invariant-checked in `src/domain/touch-target.ts`, read by
`src/lib/touch-target-registry.ts`, and projected deterministically into
`docs/accessibility/TOUCH_TARGET_ACCEPTANCE.md` by
`scripts/gen-touch-target-docs.ts`.

The rule states a 44 by 44 CSS pixel SHOULD default for author-controlled
standalone pointer targets, a distinct 24 by 24 CSS pixel MUST floor for every
visible enabled pointer target, five documented exceptions aligned to WCAG 2.2
Success Criterion 2.5.8 as an input, a compact-target departure band of 24 to 43
CSS pixels that requires a recorded compact-context rationale and can never
reach below the floor, and a below-floor route that passes only through one
documented exception.

A deterministic verification protocol is defined at viewport widths of 320, 768,
and 1366 CSS pixels, with five classifications, nine record fields, a mechanical
24 CSS pixel circle spacing check, and named manual review for the judgment-based
exceptions. Its execution state is NOT-RUN.

## What Cycle 7 did not do

Cycle 7 closed nothing beyond the FND-023 definition gap. It ran no interface
audit; measured, classified, and recorded no target; changed no interface, CSS,
component, route, or responsive behaviour; implemented and assessed no candidate;
changed no HREQ-015 through HREQ-030 disposition; left HREQ-025 unchanged at
NEEDS-EVIDENCE / DEFER with its historical wording not rewritten; left EV-003
NOT-RUN; promoted neither HS-023 nor PKG-001; resolved no drift row; closed
neither WP-007 nor Gate A; and authorized no successor cycle.

## Findings

- FND-023 is discharged by DEC-021 and evidenced by EV-043. Its prior text is
  preserved unchanged; only a discharge sentence and the discharge boundary were
  appended.
- FND-024 is raised to carry the fact that TTR-001 is defined and never executed
  against the interface. It is a record of an unrun verification, not an
  authorization to run one.

## Terminal status

RULE FORMALIZED. INTERFACE AUDIT NOT RUN. HREQ-025 STILL DEFERRED. NO CYCLE 8
AUTHORIZED.
