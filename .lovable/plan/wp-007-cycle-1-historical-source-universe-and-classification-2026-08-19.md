# WP-007 Cycle 1 — Historical Source Universe and Classification Register

## Authority state recovered (verified, read-only)

| Item                       | Verified state                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------- |
| DEC-012                    | `accepted` in `src/fixtures/registers.ts`                                           |
| DEC-018                    | `accepted` in `src/fixtures/registers.ts`                                           |
| WP-038                     | CLOSED BY OWNER (DEC-018)                                                           |
| WP-007                     | NEXT ELIGIBLE (DEC-018 consequences)                                                |
| Gate A                     | OPEN — no accepted decision closes it                                               |
| FND-010, FND-017, FND-018  | open (`conflicted` / `unknown`)                                                     |
| FND-016                    | description records PARTIALLY RESOLVED, but its machine field still reads `unknown` |
| Later superseding decision | none — DEC-018 is the highest-numbered accepted decision and is not superseded      |

One defect found during recovery: FND-016's structured `resolutionState` does not
match the owner's recorded disposition. This is repaired as part of entry hygiene,
not by reinterpretation — the description text already carries the owner wording.

## Step 1 — Repair the stale handoff locator

The actual file is `docs/wp-038/HANDOFF_TO_WP-039.md` (underscore form).

- `git mv docs/wp-038/HANDOFF_TO_WP-039.md docs/wp-038/HANDOFF_TO_WP-007.md` so
  history is preserved as a rename.
- Update references in `docs/wp-038/README.md`, `docs/wp-038/CLOSURE_RECOMMENDATION.md`,
  `docs/CURRENT_STATE.md`, and the file's own heading.
- `scripts/gen-obligation-docs.ts` and `src/fixtures/registers.ts` matches will be
  checked; any active locator is updated, any historical mention is left in place only
  where it is explicitly labelled historical or superseded.
- `evidence/artifacts/lint/eslint.json` is immutable execution evidence and is not edited.
- Record the correction as documentation lineage: a new STL entry in the WP-007
  documents plus an evidence record, with no claim that WP-039 exists or is authorized.
- Re-run repository search for remaining active `WP-039` strings and report the residue.

## Step 2 — WP-007 entry specification

Record the authoritative WP-007 entry basis in `docs/wp-007/ENTRY_SPECIFICATION.md`:
the DEC-018 authorization, the cycle target below, the anti-targets, and the
verification that no later accepted decision supersedes the sequence.

## Step 3 — Historical-source schema

New `data/historical/HISTORICAL_SOURCE_SCHEMA.json`, modelled on the WP-038
obligation schema (draft 2020-12, `schema_version`, independent dimensions never
collapsed). Fields per source:

- `source_id`, `title`, `source_family` (repository / document / drive-folder /
  chat-history / external-service / bootstrap-artifact)
- `exact_locator` (path, URL, or commit-bound reference)
- `version_or_hash` — commit SHA, content hash, or `NOT-AVAILABLE`
- `authority_classification` — `CURRENT-AUTHORITY`, `HISTORICAL-EVIDENCE`,
  `RESEARCH-INPUT`, `REFERENCE-ONLY`, `REFUSED`
- `classification_basis` and `classification_evidence` (evidence IDs)
- `access_limitation` — `FULL`, `READ-ONLY`, `NOT-ACCESSIBLE-TO-EXECUTOR`, `UNKNOWN`
- `immutability` — whether the source may be edited by this program
- `recovery_relevance` — `HIGH`, `MEDIUM`, `LOW`, `NONE`, with a stated reason
- `promotion_state` — fixed at `NOT-PROMOTED` for every historical source
- `pii_status` — asserted zero-real-PII boundary per source

The schema forbids any field expressing conformance, satisfaction, or promotion.

## Step 4 — Bounded source universe inventory

`data/historical/historical-sources.json`, covering the declared universe only:

1. The current Lovable-managed repository (DEC-010 SSOT) — current authority.
2. Governance document families under `docs/` — WP-000, WP-006, WP-037, WP-038,
   capability, shared-object, value-stream, workspace, design-system, trust.
3. Machine registers — `data/governance/`, `evidence/records/`, `evidence/baseline.json`.
4. Application registers — `src/fixtures/registers.ts` decisions, findings, evidence, claims.
5. Historical bootstrap and prior-repository artifacts named in WP-006 provenance.
6. The external Drive folder supplied in the instruction, recorded by exact URL with
   `access_limitation: NOT-ACCESSIBLE-TO-EXECUTOR`, `version_or_hash: NOT-AVAILABLE`,
   and no content-derived claims. Its contents are not inventoried this cycle.

Every entry gets provenance and access limitation; nothing is opened, copied,
restored, or promoted.

## Step 5 — Loader, generator, tests

- `src/lib/historical-source-registry.ts` — filesystem loader mirroring
  `obligation-registry.ts` (test and generator use only; no route imports it).
- `src/domain/historical-source.ts` — types matching the schema.
- `scripts/gen-historical-source-docs.ts` — projects the register into
  `docs/wp-007/` (SOURCE_UNIVERSE, CLASSIFICATION_REGISTER, ACCESS_LIMITATIONS,
  PROVENANCE_INDEX, REFUSED_CLAIMS, CHECKPOINT).
- `src/test/historical-sources.test.ts` — invariants: schema validity, unique IDs,
  every source has locator + classification + basis + access limitation +
  recovery relevance, exactly one `CURRENT-AUTHORITY` source, every historical
  source `NOT-PROMOTED`, no compliance vocabulary, no real-PII markers, and no
  active WP-039 authorization string.

## Step 6 — Evidence and state

- Run `bun run evidence:run` so the register files enter the input sets and the
  baseline is re-derived; register the resulting new evidence IDs (EV-030 onward)
  in `src/fixtures/registers.ts` alongside the handoff-rename lineage record.
- Correct FND-016's `resolutionState` to the partial value already described.
- Update `docs/CURRENT_STATE.md`: WP-007 in progress, cycle 1 target, no gate change.
- Write `docs/wp-007/CHECKPOINT-001.md` with the Controller v1.1 checkpoint.

## Verification to run

`bun run test`, `tsgo` typecheck, production build, `bun run evidence:run`,
and a repository search for residual active WP-039 references. Lint is run and
reported as pre-existing governed debt under FND-014 only.

## Explicit non-actions

No requirement extraction, no legacy code restoration, no promotion of historical
authority, no rewriting of historical artifacts, no PII, no product features or
routes, no WP-008 conflict resolution, no gate or work-package closure, no WP-039 work.
