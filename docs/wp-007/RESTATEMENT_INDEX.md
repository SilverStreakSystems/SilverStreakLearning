# WP-007 cross-source restatement index

> Generated from `data/historical/restatement-index.json` by
> `scripts/gen-restatement-docs.ts`. Do not edit by hand.
> A row records how one candidate wording reads against another. It merges nothing,
> supersedes nothing, resolves nothing, and claims no conformance.

## Index boundary

WP-007 cycle 4 cross-source restatement index. Each row states how one candidate wording from HS-023 reads against one candidate wording from HS-011. The index relates records; it never merges, deduplicates, edits, deletes, or ranks them, never elects a controlling wording, never assigns a disposition or a conformance state, and never resolves a conflict. Only a recorded owner decision may do any of those things.

## Relationship vocabulary

RESTATES means the two wordings state the same expectation. NARROWS means the subject wording is more specific or more limited than the related wording. BROADENS means the subject wording is more general or wider in scope. CONFLICTS means the two wordings cannot both be satisfied as written. NEW means the executor found no counterpart in the other source.

## Distribution

| Relationship | Rows |
| --- | --- |
| RESTATES | 3 |
| BROADENS | 6 |
| NARROWS | 2 |
| NEW | 6 |

## Relations

| Row | Subject | Reads as | Counterpart | Basis |
| --- | --- | --- | --- | --- |
| RST-001 | HREQ-016 (HS-023) — Rendered views are expected to expose semantic heading structure and landmark regions. | RESTATES | HREQ-001 (HS-011) — Each rendered view is expected to expose semantic landmark regions. | Both statements require semantic landmark structure; the historical v0.2.0 wording adds headings to the same bullet. |
| RST-002 | HREQ-016 (HS-023) — Rendered views are expected to expose semantic heading structure and landmark regions. | BROADENS | HREQ-002 (HS-011) — A view is expected to carry a single top-level heading. | 'Semantic headings' covers heading structure generally, where the HS-011 row states the narrower rule of exactly one top-level heading per view. |
| RST-003 | HREQ-017 (HS-023) — A skip link is expected. | BROADENS | HREQ-003 (HS-011) — A skip mechanism is expected to be the first focusable element and to move focus to the main region. | The historical v0.2.0 bullet names the skip link only; the HS-011 row additionally fixes its tab position and its target. |
| RST-004 | HREQ-018 (HS-023) — Navigation and interactive controls are expected to be operable by keyboard. | BROADENS | HREQ-004 (HS-011) — Movement between sections is expected to be possible without a pointing device. | The historical v0.2.0 bullet extends keyboard operability to controls, where the HS-011 row states navigation between sections. |
| RST-005 | HREQ-019 (HS-023) — A visible focus indicator is expected. | BROADENS | HREQ-006 (HS-011) — Focus is expected to be shown with an indicator using two contrasting colors. | The historical v0.2.0 bullet requires a visible focus indicator without the dual-color treatment the HS-011 row specifies. |
| RST-006 | HREQ-022 (HS-023) — Status is expected not to be carried by color alone. | RESTATES | HREQ-007 (HS-011) — State meaning is expected to be conveyed by more than color. | Both state the same prohibition on color-only status. |
| RST-007 | HREQ-023 (HS-023) — A contrast review is expected. | BROADENS | HREQ-012 (HS-011) — Color contrast is named as something to be measured rather than asserted. | 'Contrast review' names an activity, where the HS-011 row names measured contrast ratios. |
| RST-008 | HREQ-024 (HS-023) — Layouts are expected to hold at 200% zoom and to reflow at a 320-pixel width. | NARROWS | HREQ-010 (HS-011) — Layout is expected to remain usable at 200% zoom and to reflow responsively. | The historical v0.2.0 bullet fixes reflow at a 320-pixel width, where the HS-011 row states responsive reflow without a figure. |
| RST-009 | HREQ-026 (HS-023) — Reduced-motion preferences are expected to be supported. | RESTATES | HREQ-009 (HS-011) — A reduced-motion user preference is expected to be honoured. | Both require reduced-motion support. |
| RST-010 | HREQ-027 (HS-023) — Horizontally scrolling tables are expected not to lose content. | NARROWS | HREQ-008 (HS-011) — Text that carries meaning is expected not to be visually clipped. | The historical v0.2.0 bullet limits the no-content-loss expectation to horizontal table scrolling, where the HS-011 row states that essential text is not truncated anywhere. |
| RST-011 | HREQ-030 (HS-023) — Accessibility evidence is expected to record the scenario, the browser or assistive technology used, the result, the finding, and the version. | BROADENS | HREQ-011 (HS-011) — A manual assistive-technology walkthrough is named as part of the acceptance contract. | The historical v0.2.0 sentence states what accessibility evidence must record for any scenario, where the HS-011 row names a screen reader walkthrough as one such activity. |
| RST-012 | HREQ-015 (HS-023) — The source names an informed accessibility target and refuses any independent conformance claim before testing. | NEW | none found | The August 5 target sentence has no counterpart in the HS-011 restatement; FND-016 records that HS-011 names no WCAG version in its own text. |
| RST-013 | HREQ-020 (HS-023) — Interface elements are expected to carry programmatically determinable names. | NEW | none found | Programmatic names are not stated as a separate row in the HS-011 restatement. |
| RST-014 | HREQ-021 (HS-023) — Tables are expected to carry captions and header cells. | NEW | none found | Table captions and header cells are not stated in the HS-011 restatement. |
| RST-015 | HREQ-025 (HS-023) — Touch targets are expected to be sized appropriately for their context. | NEW | none found | Touch target sizing is not stated in the HS-011 restatement. |
| RST-016 | HREQ-028 (HS-023) — Refusal and error states are expected to be worded in plain language. | NEW | none found | Plain-language refusal and error wording is not stated as an accessibility row in the HS-011 restatement. |
| RST-017 | HREQ-029 (HS-023) — Content is expected not to update automatically without an announcement. | NEW | none found | Auto-updating content and announcement are not stated in the HS-011 restatement. |

## Candidates with no counterpart in the subject source

| Candidate | Source | Note |
| --- | --- | --- |
| HREQ-005 | HS-011 | Mobile navigation reachability and labelling is not stated as a separate bullet in v0.2.0 Section 11. |
| HREQ-013 | HS-011 | The adopted-standard authority statement is an HS-011 framing row with no Section 11 counterpart. |
| HREQ-014 | HS-011 | The compliance-claim refusal is an HS-011 framing row; v0.2.0 states its own refusal inside HREQ-015 rather than as a separate row. |

## Refused in this cycle

- merging, deduplicating, editing, or deleting any candidate wording;
- electing a controlling wording or resolving a conflict between sources;
- assigning any disposition or conformance state to any candidate;
- promoting HS-023 or PKG-001, or treating either as current authority;
- inferring anything about the unsupplied v0.2.0 DOCX and ZIP;
- asserting WCAG, ADA Title II, Section 508, or any other accessibility conformance;
- closing WP-007, advancing Gate A, or authorizing WP-039.
