# Evidence Architecture — Two Layers

WP-006 kept execution evidence and the current-state summary in a single document set. That
conflation is what produced FND-011 and FND-013: an unrelated documentation commit forced a
meaningless rebind of historical evidence, and the only available freshness test was a string
comparison of declared commits.

WP-037 separates the two classes.

```text
LAYER A — IMMUTABLE EXECUTION EVIDENCE     LAYER B — CURRENT BASELINE MANIFEST
- bound to the commit and input set        - describes the tree it was generated from
  where it was produced                    - cites the Layer A records it rests on
- never rebound, never edited              - regenerated, never hand-edited
- superseded, not replaced                 - stale when not re-derived
- "stale" means its inputs changed         - "stale" means it was not regenerated
```

## Layer A — immutable execution evidence

A Layer A record answers one question: what happened when this check ran, at this commit, in this
environment, by this method. Once written it is never modified. A correction is a new record that
names the old one in `supersedes`, and the old record gains `superseded_by`. History is preserved
because decisions taken on the old value must remain explainable.

Each record carries the hashes of the input sets its result depended on. That is what makes
applicability decidable later without touching the record.

## Layer B — current baseline manifest

The baseline is derived. It is written by `scripts/evidence/baseline.mjs` and rendered to
`evidence/BASELINE.md`, both marked `GENERATED - DO NOT HAND EDIT`. It states the tracked-tree
measures, the derived results, the records it cites, and the applicability of each of those records.

The freshness question becomes: was the baseline re-derived for the present input sets. That is a
machine-checkable proposition, and it is exactly what `bun run evidence:verify` checks.

## What neither layer does

Neither layer declares authority. Authority is declared by owner decisions and stored on governance
records. A passing check does not promote a claim, close a gate, or upgrade an authority class, and
no aggregate score is produced from these records.
