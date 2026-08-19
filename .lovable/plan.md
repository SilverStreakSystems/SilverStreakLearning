# WP-007 Cycle 5 — FND-022 Owner-Review Packet (non-dispositive)

## Entry baseline (verified read-only, this turn)

| Item | Repository truth |
| --- | --- |
| Gate A | OPEN |
| WP-007 | ACTIVE |
| FND-022 | OPEN, controlling owner obligation |
| PKG-001 | partial (manifest names four artifacts; DOCX/ZIP not supplied) |
| HS-023 | HISTORICAL-EVIDENCE, NOT-PROMOTED |
| Candidates | HREQ-015..030 present, exactly 16, all pre-disposition / not assessed |
| Restatement index | 17 relations — RESTATES 3, NARROWS 2, BROADENS 6, CONFLICTS 0, NEW 6 |
| Unmatched | HREQ-005, HREQ-013, HREQ-014 (HS-011), held separately |
| Latest evidence / checkpoint | EV-040, CHECKPOINT-006 |

Everything the prompt expects at entry reconciles against governed data, so the cycle is not blocked. Next collision-free identifiers: **EV-041**, **CHECKPOINT-007**, and **FND-023** only if a new obligation is actually required.

## What gets built

1. **`data/historical/fnd-022-owner-review.json`** — the machine-readable packet. One record per HREQ-015..030 carrying the fields the prompt names: candidate id, exact text copied byte-for-byte from `historical-requirements.json`, source id/title/digest/locator, current status, matched current requirement ids, relationship type and rationale, substantive delta, scope or authority implication, evidence gaps, affected requirements, the seven plain-language owner options, a **NON-BINDING** advisory recommendation with rationale, impact-if-adopted and impact-if-rejected, and `owner_disposition: null` / `owner_rationale: null`. A second section reconciles all 17 relation rows with the exact owner question per row, and a third lists the 3 unmatched HS-011 candidates separately.

2. **`data/historical/FND_022_OWNER_REVIEW_SCHEMA.json`** — new schema; no existing schema validates this shape. It constrains owner decision fields to `null`, forbids any governed disposition vocabulary, and pins the required counts.

3. **`docs/wp-007/FND-022_OWNER_DISPOSITION_PACKET.md`** — human-readable projection generated from the JSON by a new `scripts/gen-fnd-022-packet.ts`, following the existing generator convention so the two artifacts cannot drift.

4. **`docs/wp-007/CHECKPOINT-007.md`** — records the cycle, its refusals, and that it closed nothing.

5. **`src/lib/fnd-022-review-registry.ts`** — node-only loader matching `restatement-registry.ts`.

6. **`src/test/fnd-022-owner-review.test.ts`** — asserts the invariants: exactly 16 candidates HREQ-015..030 with no gaps or duplicates; 17 relation rows with exact classification totals; unmatched set of 3 kept out of the 17; every `exact_text` identical to the governed `original_wording`; every candidate traceable to HS-023 and PKG-001 digest; every owner field null; advisory fields labelled NON-BINDING and never written into a governed field; and the Markdown packet matching the JSON.

7. **`src/fixtures/registers.ts`** — add EV-041 (packet construction and mechanical validation). FND-022 stays OPEN with its text unchanged; the packet is referenced as supporting material only.

8. **`src/fixtures/program.ts`** — advance `latestCheckpoint` to CHECKPOINT-007 and add the packet as a supporting source under the still-pending FND-022 disposition. Gate, work-package, and unauthorized-stage records are untouched. `src/test/program-state.test.tsx` updated for the checkpoint id only.

## Boundaries held

- No disposition is recorded or preselected; advisory analysis is labelled NON-BINDING and lives only in packet fields.
- Cycle 4 relationship classifications are preserved as-is; no correction is proposed unless the data proves a transcription error, and any such correction would be isolated and reported, not decided.
- No re-extraction, no re-ingest of the August 5 or July artifacts, no promotion of HS-023, no change to PKG-001's partial state, no closure of FND-022, WP-007, or Gate A, no WP-039 authorization.
- No product route, feature, PII, deployment, or conformance/compliance claim.

## Validation

`bunx vitest run` (entry reference 353; expect an increase from the new focused suite, with the delta explained), typecheck, production build, `bun run lint`, generator determinism re-run, and JSON schema validation for every changed structured file. Any failure is reported as a blocker rather than absorbed.
