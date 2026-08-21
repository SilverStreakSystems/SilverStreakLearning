# WP-007 Cycle 4 — v0.2.0 Partial Historical Package + Section 11 Extraction

## Entry verification (already performed, read-only)

The three authorized August 5 v0.2.0 inputs are present and measure exactly the digests DEC-019 declares:

| File | Measured SHA-256 | Match |
| --- | --- | --- |
| SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf | `2c83e6b6…7b044` | expected value matches |
| SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx | `f717dab3…3dc1` | expected value matches |
| SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt | `914b65e3…d09a8` | observed value matches |

The PDF's Section 11 on printed pages 20–21 is titled "Accessibility", exactly as DEC-019 names it. This confirms the reading recorded in PDR-006: the section-numbering discrepancy belonged to the v0.3.0 document, not to this one. Cycle 4 entry is therefore satisfied and FND-021 can be dispositioned.

## What gets built

1. **Register the partial package (PKG-003).** Add a record to `data/packages/governed-packages.json` for the v0.2.0 clean-room package with artifacts PKA-004 (PDF), PKA-005 (workbook), PKA-006 (manifest), each digest-bound, `NOT-RETAINED-GOVERNED-EXTERNAL-LOCATOR`, classified `HISTORICAL-EVIDENCE` / `NONCANONICAL`. Completeness boundary states plainly that the manifest declares four artifacts and only two plus the manifest were supplied — the DOCX and the source ZIP are absent, so v0.2.0 is registered as a **partial** package. Same non-claims block as PKG-002.

2. **Register the historical source.** Add an `HS-0xx` record in `data/historical/historical-sources.json` for the v0.2.0 PDF Section 11, classified HISTORICAL-EVIDENCE, bound to PKA-004's digest.

3. **Extract Section 11 into HREQ-015+.** Every normative statement on pages 20–21 becomes one candidate in `data/historical/historical-requirements.json`, following the existing schema: verbatim wording, executor normalized summary, family, modality as worded, inherited authority, `CANDIDATE-PRE-DISPOSITION` / `NOT-ASSESSED`. Scope is Section 11 only — no other section is read for extraction. Approximately 18 statements (the minimum-target sentence, the required-list bullets, and the evidence-content sentence).

4. **Cross-source restatement index.** New `data/historical/restatement-index.json` plus a generated Markdown view, relating each v0.2.0 Section 11 candidate to the corresponding HS-011 candidate (HREQ-001..014) as `RESTATES`, `NARROWS`, `BROADENS`, `NEW`, or `CONFLICTS`. The index records relationships only; it never merges records, never deletes a candidate, and never elects one wording as controlling.

5. **Governance records.**
   - `EV-039`: entry digest verification of the three v0.2.0 inputs.
   - `EV-040`: Section 11 extraction and restatement index construction.
   - `FND-021`: dispositioned as resolved by supply — inputs received and verified.
   - `PDR-006`: updated with the confirming observation (v0.2.0 Section 11 is Accessibility), disposition left for the owner.
   - New `docs/wp-007/CHECKPOINT-006.md` recording the cycle.
   - `data/governance` / `src/fixtures/program.ts` reference ranges widened to PKG-003 and the new HREQ span.

6. **Generated views + tests.** Re-run the doc generators (`gen-historical-requirement-docs.ts`, `gen-governed-package-docs.ts`) and update count assertions in `src/test/`. Add tests for restatement-index integrity (every referenced HREQ exists; no self-relation; relationship values constrained).

## Boundaries held

- No fabrication: only wording physically present on pages 20–21 is extracted.
- No merging of v0.2.0 and HS-011 candidates; the index relates, it does not reconcile.
- No promotion: nothing gains authority, no finding other than FND-021 is touched, no requirement gains a disposition.
- Gate A, WP-007 state, and WP-039 authorization are unchanged; the owner closes the cycle.
- Zero real PII: the PDF cover attribution is not transcribed.
- No accessibility conformance claim is created by extracting accessibility wording.

## Verification

Typecheck, full test suite, production build, and the evidence pipeline all re-run; the checkpoint records the commit the results bind to.
