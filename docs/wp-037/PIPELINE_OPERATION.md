# Pipeline Operation

## Commands

| Command | Purpose |
|---|---|
| `bun run evidence:run` | Execute every check, write Layer A records and artifacts, re-derive the baseline |
| `bun run evidence:run --fast` | Skip build, tests, typecheck, and lint; useful while iterating on the pipeline |
| `bun run evidence:run --commit=<sha>` | Record against an explicit commit rather than resolved HEAD |
| `bun run evidence:verify` | Verify the committed evidence set against present input sets |
| `bun scripts/gen-current-state.ts --check` | Current-state projection freshness check (replaced the removed commit-binding guard under DEC-022) |

## Output layout

```text
evidence/
  index.json                  record index with hashes
  baseline.json               Layer B manifest, machine form
  BASELINE.md                 Layer B manifest, human form
  records/EV-*.json           Layer A records, one file each
  artifacts/                  raw tool output, hashed and referenced by records
```

Everything under `evidence/` carries `GENERATED - DO NOT HAND EDIT`. Editing an artifact breaks the
hash recorded against it, which is the intended behaviour.

## Commit resolution

The commit under evidence is resolved at execution time, in this order: `--commit=`,
`SSLS_EVIDENCE_COMMIT`, `GITHUB_SHA`, then `git rev-parse HEAD`. It is never read from a constant in
source. If no commit can be resolved, the run aborts rather than writing unbound records.

## Exit behaviour

`evidence:run` exits non-zero when a schema violation occurs or any record records a `fail`.
`review-required` and `not-completed` do not fail the run: they are recorded conditions requiring a
human read, and converting them to failures would push the operator toward suppressing them.

`evidence:verify` exits non-zero when a required evidence type is missing, a cited record is STALE
or EXPIRED, a record recorded a `fail`, or the baseline was not re-derived for the present input
sets.

## Reading the output

Start at `evidence/BASELINE.md`. Its freshness line answers whether the manifest still describes the
tree. The applicability table shows each cited record and why it holds or does not. Individual
records carry `supports` and `does_not_support`, which bound what may be said on the strength of
each result.
