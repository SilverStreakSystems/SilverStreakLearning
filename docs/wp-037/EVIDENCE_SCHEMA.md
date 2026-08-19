# Layer A Evidence Record Schema (v1.0.0)

Implemented in `scripts/evidence/schema.mjs`. Validation runs before any record is indexed; a
schema violation aborts the run and no index is written.

## Required fields

| Field | Meaning |
|---|---|
| `evidence_id` | Stable identifier for the record |
| `schema_version` | Schema version the record conforms to |
| `evidence_type` | One of the declared evidence types |
| `title`, `description` | What the check is, in plain language |
| `method` | `automated`, `manual`, `assistive-technology`, `independent` |
| `producer`, `producer_type` | Who or what produced it (`pipeline`, `operator`, `ai-assisted`, `external-party`) |
| `commit_sha` | 40-character lowercase hex commit the check ran against |
| `environment` | Where it ran |
| `timestamp` | ISO-8601 execution instant |
| `tool`, `command` | How it can be re-run |
| `actual_result` | What was observed, stated literally |
| `status` | `pass`, `fail`, `not-completed`, `review-required` |
| `supports` | Propositions the record does support |
| `does_not_support` | Propositions the record explicitly cannot support |
| `independent` | Declared, never inferred |
| `synthetic_data_only` | Boundary flag |

## Conditional and structural fields

`tree_hash`, `tool_version`, `expected_result`, `expires_at`, `input_set`, `artifact_path`,
`artifact_hash`, `reproduction`, `supersedes`, `superseded_by`, and the `related_*` link arrays.

## Enforced invariants

- `independent: true` is only permitted with `method: "independent"`.
- `method: "independent"` may not be combined with `producer_type: "pipeline"`. Pipeline output is
  never reported as independent evidence.
- `expires_at`, when set, must be later than `timestamp`.
- `supports` may not be empty. Evidence that supports nothing is not evidence.
- An indexed artifact must carry its content hash.
- `commit_sha` must be a full 40-character hex string, so a record can never be bound to an
  ambiguous abbreviation.

## Status vocabulary

`pass` and `fail` are results of a check with a declared expectation. `review-required` is used
where a numeric result exists but no pass criterion has been authorized — the lint baseline is the
standing example. `not-completed` is used when a check could not run, and it is never smoothed into
either a pass or a failure.
