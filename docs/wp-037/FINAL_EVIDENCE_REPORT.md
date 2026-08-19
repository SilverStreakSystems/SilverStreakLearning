# WP-037 Final Evidence Report

Executor-produced. Method: automated. `independent = false` throughout. Verification executed in the
Lovable sandbox environment.

## Authority

DEC-007 (program ratification, accepted), DEC-010 (repository SSOT, accepted), and DEC-014 (WP-006
owner closure, accepted) are all recorded current, and DEC-014 names WP-037 as the next eligible work
package. No later decision supersedes that authority. Entry authority is established.

## Implementation result reconciled against repository truth

| Reported | Verified at this head | Match |
| --- | --- | --- |
| 254/254 tests | 254 passed, 254 total | yes |
| 10 test files | 10 passed | yes |
| Production build exit 0 | exit 0 | yes |
| 14 evidence records | 14 written | yes |
| fail = 0 | fail = 0 | yes |
| review-required = 2 | 2 (EV-LINT, EV-SSOT-GUARD) | yes |
| not-completed = 1 | 1 (EV-VULN) | yes |
| baseline CURRENT | CURRENT | yes |

## Input-aware applicability of the `1f7c51e` run

Evaluated against the current head before regeneration. Ten of fourteen records evaluated **CURRENT**
across unrelated commits — the acceptance proof for the FND-011/FND-013 architecture. Four evaluated
**STALE** for stated reasons: EV-PII, EV-PROVENANCE and EV-SECRET declare the whole tracked tree and
are marked non-reusable across commits; EV-SSOT-GUARD declares the `docs` set, which changed.

Build, test, typecheck, SBOM, dependency, licence, route, configuration and vulnerability evidence
were **not** invalidated by documentation-only drift. That is the intended behaviour.

## Pipeline reproduction

`bun run evidence:run` followed by `bun run evidence:verify`, executed once:

- pipeline executed — 14 records written, fail=0, review-required=2, not-completed=1
- baseline regenerated — freshness CURRENT
- evidence bundle generated — records, index, artifacts
- manifest validated and hashes validated — VERIFICATION PASSED
- applicability reproduced — all 14 records CURRENT

External advisory intelligence is time-varying and is recorded separately rather than expected to be
byte-identical.

## Deliverable verification

| Deliverable | State | Source | Test / evidence |
| --- | --- | --- | --- |
| Evidence schema | IMPLEMENTED | `scripts/evidence/schema.mjs` | 8 schema cases |
| Immutable execution evidence | IMPLEMENTED | `evidence/records/`, `evidence/runs/1f7c51e/` | EV-019 |
| Current baseline generator | IMPLEMENTED | `scripts/evidence/baseline.mjs` | baseline freshness CURRENT |
| Applicability calculation | IMPLEMENTED | `scripts/evidence/applicability.mjs` | 8 applicability cases |
| Evidence expiry | IMPLEMENTED | `scripts/evidence/expiry.mjs` | 3 expiry cases |
| Evidence supersession | IMPLEMENTED | `applicability.mjs` supersession branch | supersession case |
| Evidence index | IMPLEMENTED | `evidence/index.json` | verify gate |
| Evidence bundle | IMPLEMENTED | `evidence/` | reproduction run |
| Artifact hashing | IMPLEMENTED | `scripts/evidence/util.mjs` | schema requires `artifact_hash` |
| Reproduction process | IMPLEMENTED | `docs/wp-037/PIPELINE_OPERATION.md` | executed once, passed |
| SBOM | IMPLEMENTED | `scripts/evidence/supply-chain.mjs` | EV-SBOM |
| Vulnerability scanning | PARTIAL | `scripts/evidence/supply-chain.mjs` | EV-VULN not-completed |
| License posture | IMPLEMENTED | `scripts/evidence/supply-chain.mjs` | EV-LICENSE |
| Secret scan | IMPLEMENTED | `scripts/evidence/boundary.mjs` | EV-SECRET, boundary case |
| Synthetic-data boundary scan | IMPLEMENTED | `scripts/evidence/boundary.mjs` | EV-PII, positive and negative controls |
| Synthetic fixture generator | IMPLEMENTED | `src/fixtures/**` | governance suites |
| Claim eligibility | IMPLEMENTED | `src/domain/evidence-pipeline.ts`, Claims Register | claim-overreach case |
| Gate evidence eligibility | IMPLEMENTED | `evaluateReuse` reuse contract | 3 reuse cases |
| CI integration | IMPLEMENTED (existence only) | `.github/workflows/evidence-pipeline.yml` | NOT VERIFIED for enforcement, FND-012 |

## Pipeline test coverage — 37 cases inspected, not inferred

`src/test/evidence-pipeline.test.ts` contains 37 cases in 6 describe blocks:

- schema (8): well-formed acceptance, supports required, does-not-support required, independence
  refused when the method is not independent, pipeline output refused as independent, abbreviated
  commit refused, expiry-before-execution refused, artifact hash required.
- input sets (4): every type declares inputs, narrowing to declared sets, tree-wide scans
  non-reusable, declarations reviewable as data.
- applicability (8): CURRENT at a different commit, STALE on changed input, undeclared inputs
  ignored, EXPIRED, SUPERSEDED, INAPPLICABLE across environments, UNKNOWN preserved, non-reusable
  types re-executed.
- reuse contract (3): seven conditions, reuse only when all hold, reuse ended by an open finding.
- expiry policy (3): rationale per type, deterministic clock, external-feed bound.
- verification gate (6): passes when complete, fails on missing type, fails on non-re-derived
  baseline, does not fail on differing baseline commit, fails on recorded failure, records
  review-required and not-completed without failing.
- in-app contract (5): plain-language state meanings, supports/does-not-support pairing, surfaced
  checks aligned to declarations, residual limitation per dispositioned finding, blended scoring and
  self-closure refused.

Control families with **no dedicated case**: method validation is covered only through the
independence rules, and dependency invalidation is covered generically by the STALE-on-changed-input
case rather than by a lockfile-specific case. Both are recorded as coverage limitations.

## Findings

- **FND-011 — RESOLVED, original failure mode superseded by the input-aware evidence model.** Residual:
  legacy hand-bound WP-006 documents.
- **FND-012 — OPEN, NOT VERIFIED.** Workflow existence is not branch protection.
- **FND-013 — RESOLVED FOR MACHINE-DERIVED BASELINE FACTS; narrative semantic accuracy remains
  human-governed.**
- **FND-014 — OPEN / ADVISORY.** Repository-wide lint reports 677 problems (663 errors, 14 warnings)
  at the verification head. WP-037 files (`scripts/evidence`, `src/domain/evidence-pipeline.ts`,
  `src/test/evidence-pipeline.test.ts`, `src/routes/evidence.tsx`) report zero problems: this work
  package introduces no new lint debt.

## Unknowns and limitations

- Branch-protection state cannot be read from repository content.
- The advisory feed is unavailable in this environment; the dependency set is not scanned.
- All evidence is executor-produced; no independent review has occurred (EV-012 remains not-run).
- No frozen, pre-registered exit-criterion wording exists for the vulnerability criterion.
- Secret and personal-data scans are pattern-based; absence of a match is not proof of absence.

## Recommendation

**HOLD** — see `CLOSURE_RECOMMENDATION.md`. Terminal status: **WP-037 HOLD — EXIT CRITERION
UNRESOLVED**, pending owner disposition of DEC-015.
