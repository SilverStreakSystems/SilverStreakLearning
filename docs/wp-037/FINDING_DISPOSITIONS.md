# Finding Dispositions

What WP-037 does to each limitation inherited from WP-006, and what remains afterwards.

## FND-011 — Declaration drift between documents and repository state

**Disposition: dissolved by architecture.**

The commit under evidence is resolved at execution time and the baseline is regenerated rather than
hand-declared. There is no declared commit string left in the pipeline for a human to forget to
update, so the drift condition has no surface to occur on.

_Residual:_ predecessor WP-006 documents retain their hand-declared bindings and are unchanged.
Those documents remain historical evidence, and they are not rebound.

## FND-012 — CI workflow existence is not merge enforcement

**Disposition: open, and not resolvable from repository content.**

The pipeline records which workflow files exist and their hashes, and states in the same record that
presence is not enforcement. `branch_protection` is recorded literally as
`REQUIRED MERGE ENFORCEMENT - NOT VERIFIED`.

_Residual:_ branch protection is configured outside the repository. Closing this finding requires
evidence from a party with access to repository settings.

## FND-013 — Semantic freshness could not be established by string comparison

**Disposition: addressed.**

Freshness is decided by declared input-set hashes plus expiry policy. A documentation-only commit no
longer invalidates build evidence, and a source change no longer passes unnoticed behind a matching
commit string.

_Residual:_ input sets are declared by the pipeline. A real dependency omitted from a declaration
would not be detected as a change. The declarations are therefore reviewable content, and the
`pipeline` input set is itself hashed so changes to them are visible.

## FND-014 — Repository-wide lint is not passing

**Disposition: baselined, not resolved.**

Lint is collected as a debt baseline with counts of errors, warnings, auto-fixable problems, and
affected files, and is recorded with status `review-required`. It is never rendered as a pass.

_Residual:_ recording debt does not reduce it. A lint remediation decision has not been taken.

## Not dispositioned here

DEC-011 (program register text), DEC-012 (effective accessibility standard revision), and DEC-013
(gate lineage reconciliation) remain open and are routed as recorded in the WP-006 closure package.
WP-037 does not resolve them and must not be read as resolving them.

## Final dispositions recorded at WP-037 verification

| Finding | Disposition                                                                   | Residual                                                                                              |
| ------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| FND-011 | RESOLVED — ORIGINAL FAILURE MODE SUPERSEDED BY THE INPUT-AWARE EVIDENCE MODEL | Legacy hand-bound WP-006 documents still declare fixed commits and are not rebound                    |
| FND-012 | OPEN — REQUIRED MERGE ENFORCEMENT NOT VERIFIED                                | Requires evidence from a party with repository-settings access                                        |
| FND-013 | RESOLVED FOR MACHINE-DERIVED BASELINE FACTS                                   | Narrative semantic accuracy remains human-governed                                                    |
| FND-014 | OPEN / ADVISORY                                                               | Repository-wide lint reports 677 problems; WP-037 files report zero, so this package adds no new debt |

Acceptance proof for FND-011 and FND-013: evaluated against a later head, ten of fourteen records
from the `1f7c51e` run remained CURRENT purely on unchanged declared input sets, with no rebinding.
The four STALE records were the tree-wide and docs-scoped scans, which declare those inputs by design.

## Vulnerability criterion — bounded recovery pass (DEC-015)

**Disposition: NOT COMPLETED. Unchanged by the recovery pass.**

`bun audit` still returns HTTP 404; `EV-VULN` is preserved verbatim as a failed evidence-producing
attempt. The recovery scan authorized by DEC-015 completed against the npm bulk advisory service
(EV-021 / `EV-VULN-RECOVERY`, HTTP 200) and returned five unremediated high-severity advisories.

_Residual:_ the criterion is not satisfied by the existence of a completed scan. The findings are
untriaged, the declared scanner still cannot execute here, and no criterion is weakened to permit
closure. WP-037 stays HOLD.
