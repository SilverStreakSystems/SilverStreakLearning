# WP-037 Closure Recommendation

## Recommendation

**PROMOTE TO OWNER CLOSURE**

Executor recommendation only. WP-037 is not closed by this document. Closure requires an accepted
owner decision — prepared as **DEC-017**, state _decision required_.

## Authority chain

- DEC-007 accepted — governing program SSLS-BPP-001 v2.0.
- DEC-010 accepted — go-forward software SSOT.
- DEC-014 accepted — WP-006 closed by owner; WP-037 authorized.
- **DEC-015 accepted, preserved intact** — HOLD disposition; authorized one bounded recovery pass.
- **DEC-016 accepted** — triage and bounded remediation authority. Supersedes DEC-015 only as
  current remediation authority; DEC-015's constraints on immutability, claim wording, and
  self-closure remain binding.

## What changed since the HOLD

### The original attempt is still a failed attempt

`bun audit --json` still fails in this environment (`audit request failed (status 404)`).
`EV-VULN` is preserved verbatim: `status: not-completed`. A 404 is never represented as a clean
result, and this remediation does not convert it into one.

### The five advisories were triaged, then remediated

EV-021 recorded five high-severity advisories over the pre-remediation dependency set. Under
DEC-016 each was triaged before any change (EV-022), with reachability and exploitability recorded
UNKNOWN rather than inferred. All five were transitive; none was a direct dependency.

Minimum-necessary remediation (EV-023) — three `overrides` entries applied through `bun install`,
seven lockfile resolution changes and no others:

| Package         | Current       | Target | Advisories removed                                     |
| --------------- | ------------- | ------ | ------------------------------------------------------ |
| brace-expansion | 1.1.16, 5.0.8 | 5.0.9  | GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895 (both majors) |
| js-yaml         | 4.3.0         | 4.3.1  | GHSA-5p4m-2wfm-xmqj                                    |
| nanoid          | 3.3.16        | 3.3.18 | GHSA-2v37-7h3g-55p8                                    |

No breaking or major upgrade was required, so nothing exceeded the DEC-016 boundary.

### The rescan completed with no matched advisories

EV-024: HTTP 200 against the npm bulk advisory service over 560 resolved versions across 526
packages, manifest hash `9d672fbe`, lockfile hash `38d150fa`, **0 matched advisories at every
severity**. The five EV-021 findings are absent; no new advisory appeared.

### No regression

EV-025: typecheck clean, 254/254 tests across 10 files, production build succeeded, repository lint
677 problems against 683 before (pre-existing debt, reduced, no new debt), route inventory
unchanged, licence posture unchanged, pipeline fail=0 with baseline freshness CURRENT.

## Why the vulnerability criterion now reconciles to PASS

The criterion concerns **completed vulnerability evidence**, not the non-existence of vulnerability.
It previously failed because no scan completed and, once one did, its findings were unremediated and
untriaged. Both conditions are now discharged on evidence: a completed scan exists, its findings
were triaged, remediated, and confirmed absent by rescan. The criterion wording is unchanged and no
exception was created.

## Limitations carried into closure, not resolved by it

- **FND-012 — OPEN / NOT VERIFIED.** Branch-protection enforcement remains unproven.
- **FND-014 — OPEN / ADVISORY.** Repository-wide lint does not pass.
- `bun audit`, the pipeline's originally declared scanner, still cannot execute here.
- One advisory source, point-in-time, no reachability analysis, no code audit.
- All evidence executor-produced: `independent = false` throughout.
- Published surface remains **PUBLIC PROTOTYPE** (EV-020). Closure is not release authorization.

## Owner disposition — recorded

**DEC-017 accepted 2026-08-19 by the Founder / Operator. WP-037 is CLOSED BY OWNER.**
WP-038 — Regulatory, Standards & Obligation Baseline is **NEXT ELIGIBLE**, authorized for
generation and execution only. Gate A is not closed and no later work package is authorized.
The limitations listed above are carried forward unchanged and are not resolved by closure.
