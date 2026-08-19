# FND-022 owner disposition packet — WP-007 Cycle 5 review, Cycle 6 dispositions recorded

> Generated from `data/historical/fnd-022-owner-review.json` by
> `scripts/gen-fnd-022-packet.ts`. Do not edit by hand.
> Cycle 5 prepared the decision. Cycle 6 transcribes the owner decision
> recorded as DEC-020 in `data/historical/fnd-022-owner-dispositions.json`.
> This document originates no decision.

## Owner decision of record

- Decision: DEC-020, recorded 2026-08-19 by Founder / Operator.
- Canonical record: `data/historical/fnd-022-owner-dispositions.json`.
- Owner fields below are transcribed from the canonical Cycle 6 disposition record. This packet remains a projection surface and originates no decision.

| Disposition | Candidates |
| --- | --- |
| ADOPT-AS-CANDIDATE | 7 |
| MERGE-OR-RESTATEMENT | 3 |
| NEEDS-EVIDENCE / DEFER | 1 |
| RETAIN-HISTORICAL | 5 |

## Packet boundary

Projection surface only. Every descriptive field in this record is copied unchanged from a governed register or is non-binding executor analysis, and every owner field is transcribed unchanged from the canonical Cycle 6 disposition record. No field in this packet originates a disposition, promotes a source, completes a package, implements or assesses any candidate, changes any Cycle 4 classification, or asserts any accessibility conformance. Only a recorded owner decision may dispose of anything, and DEC-020 is the decision this packet transcribes.

## Authority

DEC-019 is the accepted authority for the Cycle 4 extraction this packet reviews. DEC-020 is the accepted authority for the owner dispositions transcribed into the owner fields below. This packet carries no authority of its own: it prepared a decision in Cycle 5 and reports one in Cycle 6.

## Advisory notice

Every advisory_recommendation and advisory_rationale field in this packet is NON-BINDING executor analysis. It is not an owner decision, does not preselect an owner option, and is written into no governed disposition field anywhere in this repository. The advisory fields are preserved unchanged for audit comparison against the recorded owner decisions; where they differ, the owner decision governs.

## Owner option vocabulary

The seven options presented on each item are the plain-language review vocabulary the owner was offered in Cycle 5, and the unmatched current rows carry the separate conclusion NO-ACTION-CURRENT-STANDS. Presenting an option assigns nothing; only the owner value recorded in DEC-020 and transcribed here states what was decided.

Options presented for every item: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER.

## Entry state

| Item | State |
| --- | --- |
| GATE A | OPEN |
| WP 007 | ACTIVE |
| WP 038 | CLOSED BY OWNER |
| WP 039 | NOT AUTHORIZED |
| FND 022 | OPEN |
| PKG 001 | PARTIAL |
| HS 023 | NOT-PROMOTED |

## Reconciliation against the Cycle 4 record

- Candidates presented: 16 (HREQ-015..HREQ-030).
- Restatement rows presented: 17.
  - RESTATES: 3
  - NARROWS: 2
  - BROADENS: 6
  - CONFLICTS: 0
  - NEW: 6
- Unmatched current candidates: 3, listed separately and not counted among the rows.

## Candidate review

### HREQ-015 — claim-discipline (UNSTATED as worded)

> Minimum target: WCAG 2.2 AA-informed implementation, without an independent conformance claim until tested.

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-012).
- Cycle 4 basis: The August 5 target sentence has no counterpart in the HS-011 restatement; FND-016 records that HS-011 names no WCAG version in its own text.
- Substantive delta: The historical sentence names a specific accessibility target — WCAG 2.2 AA-informed — and pairs it with its own refusal of an independent conformance claim. HS-011 carries an equivalent refusal (HREQ-014) but names no WCAG version in its own text (FND-016). The delta is therefore the named version and level, not the refusal.
- Scope or authority implication: Version naming is an authority question, not an interface question. DEC-012 already names WCAG 2.2 Level AA as the internal target, so adopting this wording could either corroborate DEC-012 or create a second place where the target is stated.
- Evidence gaps: The sentence does not state who tests, what testing would suffice, or what 'AA-informed' excludes. No test evidence of any kind exists for the target.
- Recorded ambiguity: SCOPE — The sentence carries both a target and a refusal; it does not state who tests, what testing would suffice, or what 'AA-informed' excludes.
- Affected requirements, controls, or claims: DEC-012; HREQ-014; readiness axis AX-A11Y; docs/ACCESSIBILITY_ACCEPTANCE.md.
- Impact if adopted or merged: A second version-naming statement would exist alongside DEC-012 and would have to be kept synchronized with it.
- Impact if rejected or deferred: Nothing changes. The historical wording stays traceable as evidence that the WCAG 2.2 AA target predates DEC-012.
- NON-BINDING advisory: RETAIN-HISTORICAL
- NON-BINDING analysis only. DEC-012 is the accepted, current statement of the target. Adopting a 2026-08-05 historical restatement of the same target would create a second source of truth for one concept without adding a testable expectation.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): RETAIN-HISTORICAL
- Owner rationale: DEC-012 remains the sole controlling statement of the WCAG 2.2 Level AA internal target; HREQ-015 remains historical corroboration and creates no second target or conformance claim.

### HREQ-016 — accessibility-interface (MUST as worded)

> semantic headings and landmarks

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-001, HREQ-002 (BROADENS, RESTATES; rows RST-001, RST-002).
- Cycle 4 basis: Both statements require semantic landmark structure; the historical v0.2.0 wording adds headings to the same bullet. 'Semantic headings' covers heading structure generally, where the HS-011 row states the narrower rule of exactly one top-level heading per view.
- Substantive delta: The bullet couples headings and landmarks in one expectation. HS-011 states landmarks (HREQ-001) and the one-H1 rule (HREQ-002) as two separate, more testable rows.
- Scope or authority implication: Interface-level only. Adoption would not raise any authority; the HS-011 rows are already the more specific statement of the same expectation.
- Evidence gaps: No scope of application and no acceptance test are stated in the historical wording.
- Recorded ambiguity: VERIFIABILITY — The bullet names the expectation without stating scope of application or an acceptance test.
- Affected requirements, controls, or claims: HREQ-001; HREQ-002; docs/ACCESSIBILITY_ACCEPTANCE.md; the heading and landmark assertions in src/test/accessibility.test.ts.
- Impact if adopted or merged: A third, less specific heading and landmark expectation would sit beside two testable ones.
- Impact if rejected or deferred: Lineage is still recorded through RST-001 and RST-002; nothing is lost.
- NON-BINDING advisory: MERGE-OR-RESTATEMENT
- NON-BINDING analysis only. The historical wording says nothing the two HS-011 rows do not already say more precisely; recording it as a restatement preserves lineage without adding a duplicate expectation.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): MERGE-OR-RESTATEMENT
- Owner rationale: Preserve HREQ-001 and HREQ-002 as the controlling, more testable expectations; record HREQ-016 as historical lineage, not a third requirement.

### HREQ-017 — accessibility-interface (MUST as worded)

> skip link

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-003 (BROADENS; rows RST-003).
- Cycle 4 basis: The historical v0.2.0 bullet names the skip link only; the HS-011 row additionally fixes its tab position and its target.
- Substantive delta: The historical bullet names the skip link only. HS-011 (HREQ-003) additionally fixes its tab position and its target, so the current row is strictly more specific.
- Scope or authority implication: Interface-level only.
- Evidence gaps: Tab position, target, and the surfaces on which the link must appear are unstated in the historical wording.
- Recorded ambiguity: SCOPE — The bullet names the control without stating its tab position, its target, or where it must appear.
- Affected requirements, controls, or claims: HREQ-003; the skip-link assertion in src/test/accessibility.test.ts.
- Impact if adopted or merged: A weaker parallel statement of an already-testable rule.
- Impact if rejected or deferred: No effect on the current acceptance contract; the historical bullet remains traceable.
- NON-BINDING advisory: RETAIN-HISTORICAL
- NON-BINDING analysis only. Adopting a less specific wording alongside a more specific one weakens the testable rule without adding information.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): RETAIN-HISTORICAL
- Owner rationale: HREQ-003 remains controlling because it states the skip-link position and target more specifically.

### HREQ-018 — accessibility-interface (MUST as worded)

> keyboard-operable navigation and controls

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-004 (BROADENS; rows RST-004).
- Cycle 4 basis: The historical v0.2.0 bullet extends keyboard operability to controls, where the HS-011 row states navigation between sections.
- Substantive delta: The historical bullet extends keyboard operability to controls. HS-011 (HREQ-004) states navigation between sections only, so 'and controls' is an expectation the current contract does not carry in words.
- Scope or authority implication: Interface-level, but genuinely wider: it brings every interactive control into scope rather than navigation alone.
- Evidence gaps: No acceptance test and no definition of the control set are stated.
- Recorded ambiguity: VERIFIABILITY — The bullet states the expectation without naming an acceptance test or the control set in scope.
- Affected requirements, controls, or claims: HREQ-004; keyboard assertions in src/test/accessibility.test.ts; every interactive component in src/components/.
- Impact if adopted or merged: The keyboard expectation would cover all interactive controls, which would require a broader acceptance test than currently exists.
- Impact if rejected or deferred: Keyboard operability of non-navigation controls remains unstated in the acceptance contract.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. The extension to controls is a substantive addition, not a restatement, and it is testable once a control set is named.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry keyboard operability for navigation and controls forward as a governed candidate requiring definition of the control set and an acceptance test before implementation or conformance assessment.

### HREQ-019 — accessibility-interface (MUST as worded)

> visible focus

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-006 (BROADENS; rows RST-005).
- Cycle 4 basis: The historical v0.2.0 bullet requires a visible focus indicator without the dual-color treatment the HS-011 row specifies.
- Substantive delta: The historical bullet requires a visible focus indicator without the dual-color treatment HS-011 (HREQ-006) specifies.
- Scope or authority implication: Interface-level only.
- Evidence gaps: Indicator style, contrast, and covered surfaces are unstated.
- Recorded ambiguity: SCOPE — The bullet does not state indicator style, contrast, or the surfaces on which it must be visible.
- Affected requirements, controls, or claims: HREQ-006; focus-indicator tokens in src/styles.css.
- Impact if adopted or merged: A weaker parallel focus rule would sit beside the dual-color rule.
- Impact if rejected or deferred: No change to the current expectation.
- NON-BINDING advisory: RETAIN-HISTORICAL
- NON-BINDING analysis only. The current row is the stronger and more specific statement of the same expectation.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): RETAIN-HISTORICAL
- Owner rationale: HREQ-006 remains controlling as the stronger dual-color visible-focus rule.

### HREQ-020 — accessibility-interface (MUST as worded)

> programmatic names

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-20; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-013).
- Cycle 4 basis: Programmatic names are not stated as a separate row in the HS-011 restatement.
- Substantive delta: Programmatic names are not stated as a row in HS-011 at all. This is an expectation the current acceptance contract does not carry in words, even though the interface partly implements it.
- Scope or authority implication: Interface-level, and it names the accessible-name mechanism HS-011 leaves implicit in HREQ-005.
- Evidence gaps: Which elements are in scope, and how a name is checked, are unstated.
- Recorded ambiguity: VERIFIABILITY — The bullet does not state which elements are in scope or how a name is checked.
- Affected requirements, controls, or claims: HREQ-005; every labelled control; assistive-technology review EV-003, which has never been run.
- Impact if adopted or merged: A new testable accessibility expectation with no current counterpart.
- Impact if rejected or deferred: Accessible naming remains an unstated expectation.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. It closes a named gap in the current contract and is mechanically checkable for a defined element set.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry programmatic names forward as a governed candidate requiring scoped elements and a verification method.

### HREQ-021 — accessibility-interface (MUST as worded)

> table captions and header cells

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-014).
- Cycle 4 basis: Table captions and header cells are not stated in the HS-011 restatement.
- Substantive delta: Table captions and header cells are not stated anywhere in HS-011. Governed registers are rendered largely as tables, so the expectation is directly relevant to the current interface.
- Scope or authority implication: Interface-level only.
- Evidence gaps: Whether every table is in scope, and how a caption relates to a visible heading, are unstated.
- Recorded ambiguity: SCOPE — The bullet does not state whether every table is in scope or how captions relate to visible headings.
- Affected requirements, controls, or claims: Every register table rendered under src/routes/; src/test/accessibility.test.ts.
- Impact if adopted or merged: A new expectation applying to every rendered register table.
- Impact if rejected or deferred: Table semantics stay outside the acceptance contract.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. The interface is table-dense and no current row covers table semantics.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry table captions and header cells forward as a governed candidate requiring table scope and caption/visible-heading rules.

### HREQ-022 — accessibility-interface (PROHIBITION as worded)

> status not conveyed by color alone

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-007 (RESTATES; rows RST-006).
- Cycle 4 basis: Both state the same prohibition on color-only status.
- Substantive delta: No substantive delta. Both wordings state the same prohibition on status carried by color alone.
- Scope or authority implication: None. Adoption would not change the expectation.
- Evidence gaps: None identified in either wording.
- Recorded ambiguity: NONE — None identified; the constraint is stated without qualification.
- Affected requirements, controls, or claims: HREQ-007; state-chip and marker components under src/components/governance/.
- Impact if adopted or merged: A duplicate prohibition.
- Impact if rejected or deferred: Nothing is lost; RST-006 preserves the lineage.
- NON-BINDING advisory: MERGE-OR-RESTATEMENT
- NON-BINDING analysis only. Two identical prohibitions should be recorded as one expectation with two sources rather than two rules.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): MERGE-OR-RESTATEMENT
- Owner rationale: Treat both sources as one prohibition; HREQ-007 remains the controlling current wording.

### HREQ-023 — accessibility-interface (MUST as worded)

> contrast review

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-012 (BROADENS; rows RST-007).
- Cycle 4 basis: 'Contrast review' names an activity, where the HS-011 row names measured contrast ratios.
- Substantive delta: 'Contrast review' names an activity. HS-011 (HREQ-012) names measured contrast ratios, which is the more verifiable statement.
- Scope or authority implication: Interface and process. The historical wording implies a reviewer and a cadence that neither source names.
- Evidence gaps: No ratio, no tool, no reviewer, and no cadence are stated.
- Recorded ambiguity: VERIFIABILITY — The bullet names an activity, not a measured threshold, and does not state who reviews or against what ratio.
- Affected requirements, controls, or claims: HREQ-012; EV-003; docs/ACCESSIBILITY_EVIDENCE.md.
- Impact if adopted or merged: A process expectation with no threshold and no owner.
- Impact if rejected or deferred: Contrast remains governed by the measured-ratio row.
- NON-BINDING advisory: RETAIN-HISTORICAL
- NON-BINDING analysis only. An unquantified activity is weaker than the measured ratio the current row already states.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): RETAIN-HISTORICAL
- Owner rationale: HREQ-012 remains controlling; the historical phrase contrast review adds no measurable ratio, tool, owner, or cadence.

### HREQ-024 — accessibility-interface (MUST as worded)

> 200% zoom and 320-pixel reflow

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-010 (NARROWS; rows RST-008).
- Cycle 4 basis: The historical v0.2.0 bullet fixes reflow at a 320-pixel width, where the HS-011 row states responsive reflow without a figure.
- Substantive delta: The historical bullet adds a numeric 320-pixel reflow width to the 200% zoom expectation HS-011 (HREQ-010) states without a figure.
- Scope or authority implication: Interface-level, and it converts an unverifiable statement into a measurable one.
- Evidence gaps: No measurement environment or pass condition is stated, though both figures are numeric.
- Recorded ambiguity: NONE — None identified; both figures are stated numerically.
- Affected requirements, controls, or claims: HREQ-010; responsive layout across every route; the mobile viewport rules in the workspace UX standard.
- Impact if adopted or merged: A measurable reflow target that current tests do not yet assert.
- Impact if rejected or deferred: Reflow remains stated without a width and stays hard to verify.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. It is the single most testable addition in the historical set and directly supports the existing mobile-viewport rule.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry the 200% zoom and 320-pixel reflow expectation forward as a governed candidate; measurement environment and pass conditions remain required before assessment.

### HREQ-025 — accessibility-interface (MUST as worded)

> touch targets appropriate to context

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-015).
- Cycle 4 basis: Touch target sizing is not stated in the HS-011 restatement.
- Substantive delta: Touch target sizing has no counterpart in HS-011, but the historical wording states no minimum dimension.
- Scope or authority implication: Interface-level. Without a figure the expectation cannot be tested as written.
- Evidence gaps: 'Appropriate to context' is undefined; no minimum dimension and no measurement method are named.
- Recorded ambiguity: TERMINOLOGY — 'Appropriate to context' is not defined and no minimum dimension is stated.
- Affected requirements, controls, or claims: Every interactive control at mobile viewports.
- Impact if adopted or merged: An expectation that cannot be verified as worded.
- Impact if rejected or deferred: Touch target sizing stays unstated; the gap remains recorded here.
- NON-BINDING advisory: NEEDS-EVIDENCE / DEFER
- NON-BINDING analysis only. Adopting an untestable sizing rule would add an expectation no evidence could ever discharge; a decision needs a named minimum first.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): NEEDS-EVIDENCE / DEFER
- Owner rationale: Do not adopt an untestable appropriate-to-context rule. Preserve the gap requiring a named touch-target dimension, exceptions, and verification method.

### HREQ-026 — accessibility-interface (MUST as worded)

> reduced-motion support

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-009 (RESTATES; rows RST-009).
- Cycle 4 basis: Both require reduced-motion support.
- Substantive delta: No substantive delta. Both wordings require reduced-motion support.
- Scope or authority implication: None.
- Evidence gaps: Neither wording states which motion is affected or how support is demonstrated.
- Recorded ambiguity: VERIFIABILITY — The bullet does not state which motion is affected or how support is checked.
- Affected requirements, controls, or claims: HREQ-009; motion tokens in src/styles.css.
- Impact if adopted or merged: A duplicate expectation.
- Impact if rejected or deferred: Nothing is lost; RST-009 preserves the lineage.
- NON-BINDING advisory: MERGE-OR-RESTATEMENT
- NON-BINDING analysis only. One expectation with two sources is clearer than two identical rows.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): MERGE-OR-RESTATEMENT
- Owner rationale: Record one reduced-motion expectation with two sources; HREQ-009 remains controlling until a more testable formulation is approved.

### HREQ-027 — accessibility-interface (PROHIBITION as worded)

> no content loss in horizontal table scrolling

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-008 (NARROWS; rows RST-010).
- Cycle 4 basis: The historical v0.2.0 bullet limits the no-content-loss expectation to horizontal table scrolling, where the HS-011 row states that essential text is not truncated anywhere.
- Substantive delta: The historical bullet limits the no-content-loss expectation to horizontal table scrolling. HS-011 (HREQ-008) prohibits truncation of essential text anywhere, so the historical wording is the narrower one.
- Scope or authority implication: Interface-level. Adopting the narrower wording as a replacement would reduce coverage; adopting it alongside would add a specific case.
- Evidence gaps: None in the historical wording itself; the current row's term 'essential text' remains undefined.
- Recorded ambiguity: NONE — None identified; the constraint names both the mechanism and the prohibited outcome.
- Affected requirements, controls, or claims: HREQ-008; every register table with horizontal overflow.
- Impact if adopted or merged: A specific table-scroll case beside a general prohibition.
- Impact if rejected or deferred: Horizontal table scrolling stays covered by the general rule.
- NON-BINDING advisory: RETAIN-HISTORICAL
- NON-BINDING analysis only. The current prohibition already covers this case more broadly; recording the narrow case as history avoids weakening it.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): RETAIN-HISTORICAL
- Owner rationale: Treat horizontal table scrolling as historical evidence of a narrower case already governed by HREQ-008; do not weaken HREQ-008.

### HREQ-028 — accessibility-interface (MUST as worded)

> plain-language refusal and error states

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-016).
- Cycle 4 basis: Plain-language refusal and error wording is not stated as an accessibility row in the HS-011 restatement.
- Substantive delta: Plain-language refusal and error wording has no counterpart in HS-011 as an accessibility row, although the repository already writes refusals in plain language as a matter of practice.
- Scope or authority implication: Interface and content. It ties accessibility to the refusal language the governance surfaces already use.
- Evidence gaps: 'Plain language' is undefined; no reading level or style rule is named.
- Recorded ambiguity: TERMINOLOGY — 'Plain language' is not defined and no reading level or style rule is named.
- Affected requirements, controls, or claims: Every refusal, boundary, and error surface; docs/design-system/07-states-and-language.md.
- Impact if adopted or merged: A stated content expectation that current practice already largely meets but no test asserts.
- Impact if rejected or deferred: Refusal language quality stays an unwritten convention.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. It matches existing practice and would make that practice a stated, reviewable expectation rather than an unwritten habit.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry plain-language refusal and error states forward as a governed candidate requiring an approved plain-language measure or style rule.

### HREQ-029 — accessibility-interface (PROHIBITION as worded)

> no auto-updating content without announcement

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: none (NEW; rows RST-017).
- Cycle 4 basis: Auto-updating content and announcement are not stated in the HS-011 restatement.
- Substantive delta: Announcement of auto-updating content has no counterpart in HS-011.
- Scope or authority implication: Interface-level. The current build has few auto-updating surfaces, so the expectation is mostly forward-looking.
- Evidence gaps: The announcement mechanism and the assistive technology it must reach are unstated.
- Recorded ambiguity: VERIFIABILITY — The bullet does not state the announcement mechanism or the assistive technology it must reach.
- Affected requirements, controls, or claims: Any future live region, toast, or polling surface.
- Impact if adopted or merged: A forward-looking expectation with little current surface area.
- Impact if rejected or deferred: A future live surface could ship with no announcement expectation on record.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. Recording it now is cheap and prevents a later live-status surface from being built without an announcement path.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry announcement of auto-updating content forward as a governed candidate before any live-updating surface is built; announcement mechanism and target assistive technology remain undefined.

### HREQ-030 — evidence-verification (MUST as worded)

> Accessibility evidence must include scenario, browser/assistive technology where used, result, finding, and version.

- Source: HS-023, SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility, PKA-103#section-11-page-21; artifact PKA-103 of PKG-001 (PARTIAL); digest `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044`.
- Current status: CANDIDATE-PRE-DISPOSITION, NOT-ASSESSED, authority HISTORICAL-EVIDENCE, source NOT-PROMOTED.
- Mapped current requirements: HREQ-011 (BROADENS; rows RST-011).
- Cycle 4 basis: The historical v0.2.0 sentence states what accessibility evidence must record for any scenario, where the HS-011 row names a screen reader walkthrough as one such activity.
- Substantive delta: The historical sentence enumerates the fields accessibility evidence must record. HS-011 (HREQ-011) names a screen reader walkthrough as one activity but states no evidence schema.
- Scope or authority implication: Evidence and verification, not interface. It bears directly on the WP-037 evidence architecture already in the repository.
- Evidence gaps: It does not say who records the evidence or when, and no accessibility evidence of this shape has ever been collected (EV-003 is not-run).
- Recorded ambiguity: NONE — None identified; the required evidence fields are enumerated.
- Affected requirements, controls, or claims: HREQ-011; EV-003; docs/ACCESSIBILITY_EVIDENCE.md; the evidence record schema under evidence/.
- Impact if adopted or merged: Accessibility evidence would need scenario, browser or assistive technology, result, finding, and version fields.
- Impact if rejected or deferred: Accessibility evidence stays unstructured and hard to compare across runs.
- NON-BINDING advisory: ADOPT-AS-CANDIDATE
- NON-BINDING analysis only. It is the only historical statement that would make future accessibility evidence structurally comparable, and the repository already has an evidence schema to carry it.
- Owner options: RETAIN-HISTORICAL · ADOPT-AS-CANDIDATE · MERGE-OR-RESTATEMENT · NARROW · SUPERSEDE · REJECT · NEEDS-EVIDENCE / DEFER
- Owner disposition (DEC-020): ADOPT-AS-CANDIDATE
- Owner rationale: Carry the accessibility-evidence field set forward as a governed candidate. It governs evidence structure only and does not imply evidence exists; EV-003 remains NOT-RUN.

## Restatement row review

| Row | Historical | Reads as | Current | Owner question | Disposition |
| --- | --- | --- | --- | --- | --- |
| RST-001 | HREQ-016 | RESTATES | HREQ-001 | Are HREQ-016 and HREQ-001 one expectation with two sources, or two expectations to be carried separately? | MERGE-OR-RESTATEMENT |
| RST-002 | HREQ-016 | BROADENS | HREQ-002 | Does the broader 'semantic headings' wording of HREQ-016 change anything about the exactly-one-H1 rule in HREQ-002, or is HREQ-002 the controlling statement of heading structure? | MERGE-OR-RESTATEMENT |
| RST-003 | HREQ-017 | BROADENS | HREQ-003 | Should the specific skip-link rule in HREQ-003 remain the controlling statement, with HREQ-017 retained as history only? | RETAIN-HISTORICAL |
| RST-004 | HREQ-018 | BROADENS | HREQ-004 | Should keyboard operability be extended from navigation (HREQ-004) to controls as HREQ-018 words it, and if so under what acceptance test? | ADOPT-AS-CANDIDATE |
| RST-005 | HREQ-019 | BROADENS | HREQ-006 | Does the dual-color focus requirement in HREQ-006 remain controlling, with HREQ-019 retained as the weaker historical wording? | RETAIN-HISTORICAL |
| RST-006 | HREQ-022 | RESTATES | HREQ-007 | HREQ-022 and HREQ-007 state the same prohibition. Should they be recorded as one expectation with two sources? | MERGE-OR-RESTATEMENT |
| RST-007 | HREQ-023 | BROADENS | HREQ-012 | Does the 'contrast review' activity in HREQ-023 add anything to the measured-ratio row HREQ-012, or is it subsumed by it? | RETAIN-HISTORICAL |
| RST-008 | HREQ-024 | NARROWS | HREQ-010 | Should the numeric 320-pixel reflow width in HREQ-024 be added to the reflow expectation that HREQ-010 states without a figure? | ADOPT-AS-CANDIDATE |
| RST-009 | HREQ-026 | RESTATES | HREQ-009 | HREQ-026 and HREQ-009 state the same reduced-motion expectation. Should they be recorded as one? | MERGE-OR-RESTATEMENT |
| RST-010 | HREQ-027 | NARROWS | HREQ-008 | Does the narrower table-scroll case in HREQ-027 need to be carried separately, or is it already covered by the general no-truncation rule HREQ-008? | RETAIN-HISTORICAL |
| RST-011 | HREQ-030 | BROADENS | HREQ-011 | Should the evidence field list in HREQ-030 govern accessibility evidence generally, of which the HREQ-011 walkthrough is one instance? | ADOPT-AS-CANDIDATE |
| RST-012 | HREQ-015 | NEW | none found | HREQ-015 names a WCAG 2.2 AA-informed target with no counterpart in HS-011. Does DEC-012 already state this target authoritatively, making the historical sentence evidence only? | RETAIN-HISTORICAL |
| RST-013 | HREQ-020 | NEW | none found | HREQ-020 (programmatic names) has no counterpart. Should it be carried as a new candidate expectation? | ADOPT-AS-CANDIDATE |
| RST-014 | HREQ-021 | NEW | none found | HREQ-021 (table captions and header cells) has no counterpart. Should it be carried as a new candidate expectation for register tables? | ADOPT-AS-CANDIDATE |
| RST-015 | HREQ-025 | NEW | none found | HREQ-025 (touch targets) has no counterpart and states no minimum dimension. Should it be deferred pending a named figure? | NEEDS-EVIDENCE / DEFER |
| RST-016 | HREQ-028 | NEW | none found | HREQ-028 (plain-language refusal and error states) has no counterpart. Should existing practice become a stated expectation? | ADOPT-AS-CANDIDATE |
| RST-017 | HREQ-029 | NEW | none found | HREQ-029 (announcement of auto-updating content) has no counterpart. Should it be carried forward before any live-updating surface is built? | ADOPT-AS-CANDIDATE |

Every row above preserves its Cycle 4 classification unchanged. Full rationale,
source support, and recorded uncertainty for each row are in the JSON packet.

## Current candidates with no historical counterpart

| Requirement | Owner question | Disposition |
| --- | --- | --- |
| HREQ-005 | HREQ-005 has no HS-023 counterpart. Does that absence require any action, or does the current row stand unchanged? | NO-ACTION-CURRENT-STANDS — HREQ-005 remains unchanged and controlling. Absence from HS-023 is silence, not supersession. |
| HREQ-013 | HREQ-013 has no HS-023 counterpart. Does that absence require any action, or does the current row stand unchanged? | NO-ACTION-CURRENT-STANDS — HREQ-013 remains unchanged as adopted-standard authority framing and stays outside historical restatement disposition. |
| HREQ-014 | HREQ-014 has no HS-023 counterpart. Does that absence require any action, or does the current row stand unchanged? | NO-ACTION-CURRENT-STANDS — HREQ-014 remains unchanged as the controlling compliance-claim refusal. The refusal embedded in HREQ-015 is subordinate historical corroboration, not a second controlling refusal. |

## Refused in this cycle

- originating, simulating, or inferring any owner disposition; every owner field here is transcribed from DEC-020 and from no other source;
- implementing, satisfying, testing, or assessing any adopted candidate; each remains a candidate and NOT-ASSESSED;
- promoting HS-023 or PKG-001, or changing the partial state of PKG-001;
- changing any extracted wording, provenance value, digest, locator, or Cycle 4 relationship classification;
- re-extracting Section 11 or re-ingesting any August 5 or July source artifact;
- closing WP-007 or Gate A, authorizing WP-039, or authorizing any further cycle;
- asserting WCAG, ADA Title II, Section 508, or any other accessibility conformance.
