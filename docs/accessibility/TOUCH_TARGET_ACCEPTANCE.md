# SSLS touch-target acceptance rule — TTR-001 v1.0.0

> Generated from `data/accessibility/touch-target-rule.json` by
> `scripts/gen-touch-target-docs.ts`. Do not edit by hand.

Authority: INTERNAL-SSLS-ACCEPTANCE-RULE. Controlling decision: DEC-021.
Lifecycle state: DEFINED-NOT-VERIFIED. Verification execution state: NOT-RUN.

## Scope and exclusions

This is an internal SSLS acceptance rule recorded by the owner under DEC-021. It is testable inside this program and carries no external authority.

Definition of the touch-target acceptance rule, its exceptions, and the protocol by which a future audit would verify it.

- No user-interface, CSS, component, route, or responsive-behaviour change is authorized by this rule.
- No target-size audit of the current interface is run, scheduled, or authorized by this rule.
- HREQ-025 is not adopted, rewritten, assessed, implemented, or promoted by this rule.
- No conformance conclusion, release authority, or successor cycle follows from this rule.

## Acceptance rule

| Element          | Obligation | Size            | Applies to                                    |
| ---------------- | ---------- | --------------- | --------------------------------------------- |
| SSLS default     | SHOULD     | 44 by 44 CSS px | Author-controlled standalone pointer targets. |
| Measurable floor | MUST       | 24 by 24 CSS px | Every visible, enabled pointer target.        |

Author-controlled standalone pointer targets SHOULD provide an interactive area at least 44 by 44 CSS pixels. Existing stricter adopted requirements continue to control.

Every visible, enabled pointer target MUST either provide an interactive target area at least 24 by 24 CSS pixels, or satisfy exactly one documented exception from the enumerated set.

### Compact-target departure

A standalone author-controlled target between 24 by 24 and 43 by 43 CSS pixels is a recorded departure from the SSLS 44 by 44 default. It may be accepted only with a compact-context rationale, and it must still satisfy the 24 by 24 floor.

- The target is standalone and author-controlled.
- The record contains a compact-context rationale explaining why the 44 by 44 default would materially impair information density or inline semantics.
- The target still measures at least 24 by 24 CSS pixels.

### Below-floor targets

A target below 24 by 24 CSS pixels cannot pass through a compact-context rationale. It passes only through exactly one of the five documented exceptions.

### Precedence

- An existing adopted requirement that is stricter than this rule continues to control; this rule never relaxes it.
- The 44 by 44 default is an SSLS preference expressed as SHOULD; the 24 by 24 floor is an obligation expressed as MUST. The two are distinct values and are never conflated.
- HREQ-025 remains NEEDS-EVIDENCE / DEFER. This rule fills the missing-rule gap; it does not adopt the historical wording.

## Documented exceptions

| Type               | Condition                                                                                                                                                         | Determination | Record required                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| SPACING            | The undersized target is spaced so that a 24 CSS pixel diameter circle centred on its bounding box intersects neither another target nor another target's circle. | MECHANICAL    | Bounding rectangles of the target and every neighbouring target considered; The computed circle geometry and the intersection result |
| EQUIVALENT-CONTROL | A different control on the same page performs the same action and itself meets at least the 24 by 24 CSS pixel floor.                                             | MECHANICAL    | Stable locator of the equivalent control; Measured size of the equivalent control                                                    |
| INLINE             | The target is positioned within a sentence or block of text, or its size is otherwise constrained by the line height of non-target text.                          | MANUAL-REVIEW | The text context the target sits inside; Reviewer and rationale for the inline determination                                         |
| USER-AGENT-CONTROL | The size of the target is determined by the user agent and is not modified by the author.                                                                         | MANUAL-REVIEW | The element and the user-agent behaviour relied on; Confirmation that no author style alters the target size                         |
| ESSENTIAL          | A particular presentation of the target is essential, or is legally required, for the information being conveyed.                                                 | MANUAL-REVIEW | Why the presentation is essential rather than preferred; Reviewer and evidence reference for the judgment                            |

## Verification protocol — defined, not run

Deterministic future audit: at each declared viewport width, enumerate every visible enabled pointer target, measure its bounding rectangle, classify it, and record the fields below. Mechanical classifications are computed; judgment-based exceptions require a named reviewer.

Viewport widths: 320, 768, 1366 CSS pixels.

Classifications: PASS-44-DEFAULT, PASS-24-FLOOR, PASS-EXCEPTION, FAIL, NOT-APPLICABLE.

| Field                           | Requirement | Description                                                                                                     |
| ------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| route                           | REQUIRED    | Application route audited.                                                                                      |
| locator                         | REQUIRED    | Stable locator for the target, preferring role and accessible name.                                             |
| viewport_css_px                 | REQUIRED    | One of the declared viewport widths.                                                                            |
| bounding_rect_css_px            | REQUIRED    | Measured x, y, width, and height of the interactive area.                                                       |
| classification                  | REQUIRED    | One of the five declared classifications.                                                                       |
| exception_type                  | CONDITIONAL | Required when the classification is PASS-EXCEPTION; exactly one of the five exception types.                    |
| rationale                       | REQUIRED    | Why the classification holds, including a compact-context rationale for any 24 to 43 CSS pixel departure.       |
| equivalent_control_locator      | CONDITIONAL | Required when the exception type is EQUIVALENT-CONTROL.                                                         |
| reviewer_and_evidence_reference | CONDITIONAL | Required for every judgment-based exception: named reviewer plus the evidence record that carries the judgment. |

### Spacing check

A circle of 24 CSS pixel diameter centred on the centre point of the undersized target's bounding box.

The circle intersects no other target's bounding box and no other target's circle.

The spacing exception is decided mechanically by this circle test and by nothing else.

Manual review is required for: INLINE, USER-AGENT-CONTROL, ESSENTIAL.

This protocol is defined and NOT-RUN. Defining it measures no target, sets no classification, produces no audit record, and establishes no passing state for any route or component.

## Sources, treated as inputs only

| Source  | Title                                                                        | URL                                                             | Role       |
| ------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| TTS-001 | Web Content Accessibility Guidelines (WCAG) 2.2, W3C normative specification | https://www.w3.org/TR/WCAG22/                                   | INPUT-ONLY |
| TTS-002 | Understanding Success Criterion 2.5.8: Target Size (Minimum)                 | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum | INPUT-ONLY |

## Non-claims

- No WCAG 2.2 conformance is claimed at any level.
- No ADA, Section 508, or other legal compliance is claimed.
- No independent, expert, or district validation has occurred.
- No interface target-size audit has been run; no route or component is recorded as passing.
- HREQ-025 is not adopted, assessed, implemented, or promoted, and EV-003 remains NOT-RUN.
- This rule confers no release, deployment, or production-readiness authority.

## History

| Version | Recorded   | Decision | Change                                                                                                                                           | Boundary                                                                                            |
| ------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-08-20 | DEC-021  | Rule created to resolve the missing-rule gap carried by FND-023: a named dimension, the exceptions that apply, and a stated verification method. | Creation of the rule discharges the definition gap only. It runs no audit and changes no interface. |
