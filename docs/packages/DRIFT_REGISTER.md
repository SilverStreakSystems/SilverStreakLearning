# v0.3.0 package reconciliation and drift register

Generated from `data/packages/package-drift.json` (schema 1.0.0). Edit the register, not this file. Recorded as EV-034.

Canonical machine-readable reconciliation of the SSLS 2.0 v0.3.0 governed reference package (PKG-002) against the canonical repository records. The canonical register and the accepted owner decision control in every case. A drift row is recorded, never silently reconciled: resolving one is an owner decision or a later executed validation, never an edit made to make the two planes agree.

## Reconciled — package agrees with the canonical record

| Assertion in PKG-002 | Canonical locator | Result |
| --- | --- | --- |
| North Star: Make Learning Visible | src/fixtures/artifacts.ts — FND-NORTHSTAR-001 | AGREES |
| Gate A open | docs/CURRENT_STATE.md; DEC-018 in src/fixtures/registers.ts | AGREES |
| WP-038 closed by owner | DEC-018 | AGREES |
| WP-007 active | docs/wp-007/ENTRY_SPECIFICATION.md; docs/CURRENT_STATE.md | AGREES |
| WP-039 not authorized | DEC-018; docs/wp-007/REFUSED_CLAIMS.md | AGREES |
| DEC-007, DEC-010, DEC-012, DEC-017, DEC-018 accepted | src/fixtures/registers.ts — DECISIONS | AGREES |
| WCAG 2.2 Level AA is an internal target only | DEC-012 | AGREES |
| Accessibility non-claim boundary in full | DEC-012; docs/ACCESSIBILITY_EVIDENCE.md | AGREES |
| FND-016 partially resolved | src/fixtures/registers.ts — FND-016 (resolutionState: partial) | AGREES |
| FND-017 and FND-018 open | FND-017, FND-018 (resolutionState: unknown) | AGREES |
| FND-019 repaired | FND-019 (resolutionState: confirmed, repair recorded); EV-029 | AGREES |
| 22 historical sources; 3 NOT-ACCESSIBLE-TO-EXECUTOR | data/historical/historical-sources.json (22 records, 3 inaccessible) | AGREES |
| HS-011 was the Cycle 2 extraction source | data/historical/historical-requirements.json; docs/wp-007/CYCLE2_SOURCE_SELECTION.md | AGREES |
| 14 candidates, HREQ-001..HREQ-014, pre-disposition and not assessed | data/historical/historical-requirements.json | AGREES |
| Evidence EV-026..EV-032 registered | src/fixtures/registers.ts — EVIDENCE | AGREES |
| Package contains exactly three files; v0.2.0 DOCX and ZIP not supplied | data/packages/governed-packages.json — PKG-002, PKG-001 | AGREES |
| Workbook Boundaries sheet: no PII, no AI product capability, no release authorization, historical evidence not promoted, work-package closure owner-reserved | src/fixtures/posture.ts; docs/wp-007/REFUSED_CLAIMS.md; DEC-018 | AGREES |
| Workbook Work Packages sheet: WP-038 CLOSED BY OWNER, WP-007 ACTIVE, WP-039 NOT AUTHORIZED | src/fixtures/program.ts; DEC-018 | AGREES |
| Workbook Validation sheet: bun audit NOT COMPLETED (HTTP 404) and independent validation NOT RUN | evidence/records/EV-VULN.json; docs/wp-037/VULNERABILITY_TRIAGE.md | AGREES |
| Workbook Evidence sheet lists EV-026..EV-032 only | src/fixtures/registers.ts — EVIDENCE (EV-026..EV-038) | AGREES |

## Drift — 6 unresolved, recorded and not resolved

| ID | Item | Package locator | Repository locator | Controlling authority | Disposition | Note |
| --- | --- | --- | --- | --- | --- | --- |
| PDR-001 | Test count: the package states "304 of 304 pass" | PDF section 9.2 | docs/wp-007/CHECKPOINT-003.md and the executed evidence baseline under evidence/ | Executed repository validation | UNRESOLVED | The package figure is version-bound to the Cycle 2 state and is stale by count only. The package is not edited; the current count is carried by the latest checkpoint and the evidence baseline. |
| PDR-002 | Lint problem count | Not stated in the package | FND-014; EV-029 (686 problems) | Executed repository validation | UNRESOLVED | No conflict. Recorded so the omission is visible. |
| PDR-003 | Owner-name attribution on the PDF cover | PDF page 1 | Repository records use the actor label "Founder / Operator" | Zero-real-PII repository boundary | UNRESOLVED | Not transcribed. Recorded as a per-artifact limitation on PKA-001 and as a reason the binary is not retained. |
| PDR-004 | Proposed next WP-007 cycle named in the package | PDF section 12 | Not authorized anywhere in the repository | Owner decision required | UNRESOLVED | Proposal only. Nothing executed against it. |
| PDR-005 | Lint problem count: the workbook states "686 problems: 672 errors, 14 warnings" | Workbook — Control Room current limitations; Findings sheet FND-014; Validation sheet | FND-014; docs/wp-007/CHECKPOINT-003.md and CHECKPOINT-004.md (704 problems at the current state) | Executed repository validation | UNRESOLVED | The package figure is version-bound to the Cycle 2 state and is stale by count only; FND-014 itself remains open on its own proposition. The package is not edited and the finding is not reconciled by this observation. PDR-002 records the PDF's omission of any lint figure; this row records the workbook's stated figure. |
| PDR-006 | Section numbering: DEC-019 locks extraction to "Section 11 — Accessibility, printed pages 20-21", but Section 11 of the v0.3.0 PDF is "Security, privacy, and release boundary" and accessibility is Section 10 | PDF sections 10 and 11 (14 sections total) | DEC-019; docs/wp-007/CHECKPOINT-004.md; FND-021 | Owner decision required | UNRESOLVED | Consistent with the reading that DEC-019 describes the August 5 v0.2.0 document, not this one. That cannot be confirmed while the v0.2.0 PDF is unavailable, so the numbering discrepancy is recorded and not resolved. No substitution of the v0.3.0 Section 10 text as an extraction source is authorized or made. |

No drift row was resolved by this cycle. Resolving a drift row is an owner decision or a
later executed validation, never an edit made to make the two planes agree.
