# WP-007 historical requirement candidates

> Generated from `data/historical/historical-requirements.json` by `scripts/gen-historical-requirement-docs.ts`. Do not edit by hand.
> Every record is a pre-disposition candidate. Nothing here is required now, satisfied, or accepted.


## Extraction boundary

WP-007 cycle 2 extracts candidate requirements from exactly one named historical source, HS-011, the ULW-AS-001 v1.3 accessibility acceptance contract as carried in this repository at docs/ACCESSIBILITY_ACCEPTANCE.md, bound to commit 6e447103fcb65c2054d2080a12847777960a4642. Every normative sentence and every table row of that document is extracted; nothing outside that file is read, and no second source is opened. Candidates are pre-disposition records: no owner disposition, no conformance state, and no implementation, testing, release, or claimability meaning is attached to any record. WP-007 cycle 4 adds exactly one further source under DEC-019: HS-023, Section 11 of the digest-verified historical August 5, 2026 v0.2.0 clean-room rewrite PDF, printed pages 20-21. Every normative statement on those two pages is extracted and nothing outside Section 11 of that document is read as an extraction surface. Candidates from the two sources are kept separate; they are related in data/historical/restatement-index.json and are never merged, deduplicated, or ranked.

## Candidates

### HREQ-001 — Each rendered view is expected to expose semantic landmark regions.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L7`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Semantic landmarks on every view

Normalized summary (executor restatement, not source text): Each rendered view is expected to expose semantic landmark regions.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-002 — A view is expected to carry a single top-level heading.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L8`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Exactly one H1 per view

Normalized summary (executor restatement, not source text): A view is expected to carry a single top-level heading.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-003 — A skip mechanism is expected to be the first focusable element and to move focus to the main region.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L9`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Skip link first in tab order, targets main

Normalized summary (executor restatement, not source text): A skip mechanism is expected to be the first focusable element and to move focus to the main region.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-004 — Movement between sections is expected to be possible without a pointing device.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L10`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Keyboard-only navigation between sections

Normalized summary (executor restatement, not source text): Movement between sections is expected to be possible without a pointing device.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-005 — Navigation on small viewports is expected to be reachable and to carry an accessible name.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L11`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Mobile navigation reachable and labelled

Normalized summary (executor restatement, not source text): Navigation on small viewports is expected to be reachable and to carry an accessible name.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-006 — Focus is expected to be shown with an indicator using two contrasting colors.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L12`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Visible dual-color focus indicator

Normalized summary (executor restatement, not source text): Focus is expected to be shown with an indicator using two contrasting colors.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-007 — State meaning is expected to be conveyed by more than color.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L13`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Status never carried by color alone

Normalized summary (executor restatement, not source text): State meaning is expected to be conveyed by more than color.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-008 — Text that carries meaning is expected not to be visually clipped.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L14`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Essential text not truncated

Normalized summary (executor restatement, not source text): Text that carries meaning is expected not to be visually clipped.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-009 — A reduced-motion user preference is expected to be honoured.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L15`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Reduced motion respected

Normalized summary (executor restatement, not source text): A reduced-motion user preference is expected to be honoured.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-010 — Layout is expected to remain usable at 200% zoom and to reflow responsively.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L16`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> 200% zoom resilience and responsive reflow

Normalized summary (executor restatement, not source text): Layout is expected to remain usable at 200% zoom and to reflow responsively.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-011 — A manual assistive-technology walkthrough is named as part of the acceptance contract.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L17`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: UNSTATED
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Screen reader walkthrough

Normalized summary (executor restatement, not source text): A manual assistive-technology walkthrough is named as part of the acceptance contract.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-012 — Color contrast is named as something to be measured rather than asserted.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L18`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: UNSTATED
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Measured color contrast ratios

Normalized summary (executor restatement, not source text): Color contrast is named as something to be measured rather than asserted.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-013 — The standard is declared adopted from outside and binding on this build, not written by it.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L3`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: governance-authority · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Authority: Adopted Standard. It constrains this build; it is not authored here.

Normalized summary (executor restatement, not source text): The standard is declared adopted from outside and binding on this build, not written by it.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-014 — Restating any row of the contract as an external assurance claim is refused at this stage.

- Source: `HS-011` at `docs/ACCESSIBILITY_ACCEPTANCE.md#L20-L21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-011 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: claim-discipline · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Nothing above may be restated as a compliance claim. Compliance is refused at this stage.

Normalized summary (executor restatement, not source text): Restating any row of the contract as an external assurance claim is refused at this stage.

Boundary: Records the wording carried in this repository at the cited line only. Does not assert that the statement applies now, that the build meets it, that the upstream ULW-AS-001 v1.3 text is identical, or that the source's own state column is evidence of anything. The state and verification columns are deliberately not carried into this record.

### HREQ-015 — The source names an informed accessibility target and refuses any independent conformance claim before testing.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: claim-discipline · Modality as worded: UNSTATED
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Minimum target: WCAG 2.2 AA-informed implementation, without an independent conformance claim until tested.

Normalized summary (executor restatement, not source text): The source names an informed accessibility target and refuses any independent conformance claim before testing.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-016 — Rendered views are expected to expose semantic heading structure and landmark regions.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> semantic headings and landmarks

Normalized summary (executor restatement, not source text): Rendered views are expected to expose semantic heading structure and landmark regions.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-017 — A skip link is expected.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> skip link

Normalized summary (executor restatement, not source text): A skip link is expected.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-018 — Navigation and interactive controls are expected to be operable by keyboard.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> keyboard-operable navigation and controls

Normalized summary (executor restatement, not source text): Navigation and interactive controls are expected to be operable by keyboard.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-019 — A visible focus indicator is expected.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> visible focus

Normalized summary (executor restatement, not source text): A visible focus indicator is expected.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-020 — Interface elements are expected to carry programmatically determinable names.

- Source: `HS-023` at `PKA-103#section-11-page-20`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> programmatic names

Normalized summary (executor restatement, not source text): Interface elements are expected to carry programmatically determinable names.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-021 — Tables are expected to carry captions and header cells.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> table captions and header cells

Normalized summary (executor restatement, not source text): Tables are expected to carry captions and header cells.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-022 — Status is expected not to be carried by color alone.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> status not conveyed by color alone

Normalized summary (executor restatement, not source text): Status is expected not to be carried by color alone.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-023 — A contrast review is expected.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> contrast review

Normalized summary (executor restatement, not source text): A contrast review is expected.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-024 — Layouts are expected to hold at 200% zoom and to reflow at a 320-pixel width.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> 200% zoom and 320-pixel reflow

Normalized summary (executor restatement, not source text): Layouts are expected to hold at 200% zoom and to reflow at a 320-pixel width.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-025 — Touch targets are expected to be sized appropriately for their context.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> touch targets appropriate to context

Normalized summary (executor restatement, not source text): Touch targets are expected to be sized appropriately for their context.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-026 — Reduced-motion preferences are expected to be supported.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> reduced-motion support

Normalized summary (executor restatement, not source text): Reduced-motion preferences are expected to be supported.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-027 — Horizontally scrolling tables are expected not to lose content.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> no content loss in horizontal table scrolling

Normalized summary (executor restatement, not source text): Horizontally scrolling tables are expected not to lose content.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-028 — Refusal and error states are expected to be worded in plain language.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> plain-language refusal and error states

Normalized summary (executor restatement, not source text): Refusal and error states are expected to be worded in plain language.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-029 — Content is expected not to update automatically without an announcement.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: accessibility-interface · Modality as worded: PROHIBITION
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> no auto-updating content without announcement

Normalized summary (executor restatement, not source text): Content is expected not to update automatically without an announcement.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.

### HREQ-030 — Accessibility evidence is expected to record the scenario, the browser or assistive technology used, the result, the finding, and the version.

- Source: `HS-023` at `PKA-103#section-11-page-21`
- Inherited authority: HISTORICAL-EVIDENCE (HS-023 is classified HISTORICAL-EVIDENCE in the WP-007 source register. This candidate inherits that classification unchanged; extraction does not raise it.)
- Family: evidence-verification · Modality as worded: MUST
- Disposition: CANDIDATE-PRE-DISPOSITION · Conformance: NOT-ASSESSED

Original wording, verbatim:

> Accessibility evidence must include scenario, browser/assistive technology where used, result, finding, and version.

Normalized summary (executor restatement, not source text): Accessibility evidence is expected to record the scenario, the browser or assistive technology used, the result, the finding, and the version.

Boundary: Records wording physically present in Section 11 of the digest-bound historical August 5, 2026 v0.2.0 document at the cited printed page only. Does not assert that the statement applies now, that the build meets it, that it supersedes or is superseded by the HS-011 wording, or that any accessibility conformance exists. The relationship between this candidate and any HS-011 candidate is recorded separately in the restatement index and is not a merge.
