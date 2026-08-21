# CI Integration

Workflow: `.github/workflows/evidence-pipeline.yml`, named "SSLS Evidence Pipeline".

## Design

| Property          | Value                                                              | Reason                                                                     |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Triggers          | push to `main`, pull request, manual dispatch                      | Evidence is collected on the change, not after the fact                    |
| Permissions       | `contents: read` only                                              | Least privilege; the pipeline reads the tree and writes nothing back       |
| Checkout depth    | full history                                                       | Provenance requires ancestry, which a shallow clone does not carry         |
| Install           | `bun install --frozen-lockfile`                                    | The lockfile is a declared input; CI must not silently resolve differently |
| Commit binding    | `SSLS_EVIDENCE_COMMIT: github.sha`                                 | The commit under evidence is passed in, never inferred from a constant     |
| Artifacts         | `evidence/` uploaded, 90-day retention, `if-no-files-found: error` | An empty evidence upload is a failure, not a silent pass                   |
| Predecessor guard | `continue-on-error: true`                                          | Retained for visibility; superseded for freshness purposes                 |
| Concurrency       | one run per ref, cancel superseded                                 | Avoids racing runs producing conflicting evidence                          |

## Steps

1. Collect evidence (`bun run evidence:run`).
2. Verify applicability (`bun run evidence:verify`).
3. Run the predecessor declared-binding guard, non-blocking.
4. Upload the evidence directory, on success or failure.

## The enforcement gap — FND-012

The presence of this workflow is **not** merge enforcement. Whether a check is required before merge
is decided by branch protection, which is configured in repository settings outside the tree. No
file in this repository can establish that branch protection is enabled.

This is recorded as an open limitation, not resolved by WP-037, and no document may state or imply
that a check "blocks merge" until branch protection has been configured and evidenced by a party
with access to those settings. The pipeline instead records the honest form: the workflow exists and
runs; enforcement is unverified.
