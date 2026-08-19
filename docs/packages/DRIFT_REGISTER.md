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

## Drift — 4 unresolved, recorded and not resolved

| ID | Item | Package locator | Repository locator | Controlling authority | Disposition | Note |
| --- | --- | --- | --- | --- | --- | --- |
| PDR-001 | Test count: the package states "304 of 304 pass" | PDF section 9.2 | docs/wp-007/CHECKPOINT-003.md and the executed evidence baseline under evidence/ | Executed repository validation | UNRESOLVED | The package figure is version-bound to the Cycle 2 state and is stale by count only. The package is not edited; the current count is carried by the latest checkpoint and the evidence baseline. |
| PDR-002 | Lint problem count | Not stated in the package | FND-014; EV-029 (686 problems) | Executed repository validation | UNRESOLVED | No conflict. Recorded so the omission is visible. |
| PDR-003 | Owner-name attribution on the PDF cover | PDF page 1 | Repository records use the actor label "Founder / Operator" | Zero-real-PII repository boundary | UNRESOLVED | Not transcribed. Recorded as a per-artifact limitation on PKA-001 and as a reason the binary is not retained. |
| PDR-004 | Proposed next WP-007 cycle named in the package | PDF section 12 | Not authorized anywhere in the repository | Owner decision required | UNRESOLVED | Proposal only. Nothing executed against it. |

No drift row was resolved by this cycle. Resolving a drift row is an owner decision or a
later executed validation, never an edit made to make the two planes agree.
