# Forensic review of the uploaded documents, and what can lawfully be integrated

## What was actually supplied

The three files attached to this message are the **v0.3.0** package, not the three
August 5 **v0.2.0** files that Cycle 4 authorizes. Digests measured against the attached
manifest:

| File | Measured SHA-256 | Manifest claim | Result |
| --- | --- | --- | --- |
| Governed Rewrite PDF | `9632f08c…52f943` | same | MATCH |
| Control Workbook XLSX | `68064dcb…6fcce1e` | same | MATCH |
| Manifest TXT | `3a98382e…50ca7a13` | self-hash excluded | n/a |

All three are byte-identical to the artifacts already registered as PKA-001, PKA-002 and
PKA-003 under PKG-002. Re-registering them would create a duplicate package, so no new
package record will be created.

Forensic content read of the PDF confirms a further mismatch with the Cycle 4 target: this
document has 14 sections and its **Section 11 is "Security, privacy, and release boundary"**;
accessibility is Section 10. The Cycle 4 extraction target ("Section 11 — Accessibility,
printed pages 20–21") describes the v0.2.0 document, which is still not supplied. FND-021
therefore stays open and Cycle 4 as authorized stays BLOCKED.

## What this plan does instead

A bounded, non-dispositive integration pass over the already-verified v0.3.0 package. It
records facts and reconciliations only. It closes no gate, promotes no source, and gives no
HREQ an owner disposition.

1. **Record a third re-verification event** (next free EV identifier) stating: three files
   supplied, digests recomputed, identical to PKA-001/002/003, no duplicate package created,
   authorized Cycle 4 inputs still absent.
2. **Forensic section-by-section read** of the governed rewrite PDF and every sheet of the
   control workbook, compared against current repository registers (program state,
   work-package state, decision register, finding register, evidence baseline, package
   register).
3. **Reconciliation table** written to a new `docs/wp-007/CHECKPOINT-005.md`: for each
   proposition in the package, whether the repository AGREES, DIFFERS, or the package states
   something the repository does not carry. Differences are recorded as drift rows in
   `data/packages/package-drift.json`, not silently corrected.
4. **No requirement extraction.** HREQ-015 onward is reserved for the authorized v0.2.0
   Section 11 source. Extracting accessibility requirements from the v0.3.0 Section 10
   instead would substitute a source the owner did not authorize, so it is refused here and
   listed as a decision the owner may authorize separately.
5. **Register/finding hygiene only**: FND-020 and FND-021 remain open, unmodified.

## Technical notes

- Files touched: `src/fixtures/registers.ts` (one EV record), `data/packages/package-drift.json`
  (new drift rows if any), `docs/wp-007/CHECKPOINT-005.md` (new), plus regenerated package docs
  via the existing `scripts/gen-governed-package-docs.ts` projection.
- No change to `data/packages/governed-packages.json` records or digests; the existing pinning
  invariants in `src/test/governed-packages.test.ts` must continue to pass unchanged.
- Validation after edits: full test suite, typecheck, production build, `bun run evidence:run`,
  reported against the current baseline (341 tests, fail=0, review-required=2, not-completed=1).

## Final state after this pass

Gate A OPEN · WP-007 ACTIVE · WP-039 NOT AUTHORIZED · no source promoted · no HREQ disposition ·
no finding auto-closed · Cycle 4 still BLOCKED pending the three August 5 v0.2.0 files.
