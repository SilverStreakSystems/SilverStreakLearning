# WP-037 Closure Recommendation

## Recommendation

**HOLD**

Recorded owner disposition: **DEC-015, accepted 2026-08-19 — HOLD.** DEC-015 is not a waiver, an
exception, a retroactive reinterpretation of the exit criteria, or a basis for closure.

## Basis

Every WP-037 deliverable other than the vulnerability criterion reconciles to PASS with cited source
and evidence. The blocking condition is narrow and specific.

### The original attempt remains a failed attempt

- `bun audit --json`, invoked by `scripts/evidence/supply-chain.mjs`, still fails in this
  environment: `audit request failed (status 404)`.
- `EV-VULN` is preserved verbatim: `status: not-completed`,
  `actual_result: "SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE."`, with its tool,
  version, timestamp, commit, and environment metadata intact.
- A 404 is never represented as a clean vulnerability result.

### The bounded recovery pass authorized by DEC-015

Executed once, additively, without modifying EV-019 or EV-VULN:

- Source: `https://registry.npmjs.org/-/npm/v1/security/advisories/bulk` (npm public registry
  advisory service, backed by the GitHub Advisory Database).
- Input: the 563 versions resolved across 527 packages in `bun.lock`; declared inputs unchanged.
- Result: HTTP 200. Complete raw response captured at
  `evidence/artifacts/vulnerability/advisory-recovery.json`, hashed in
  `evidence/records/EV-VULN-RECOVERY.json`, registered as **EV-021**.
- Matched advisories: **5, all high severity**, all unremediated and untriaged.

| Package | Resolved version | Advisory | Severity |
| --- | --- | --- | --- |
| brace-expansion | 1.1.16 | GHSA-mh99-v99m-4gvg | high |
| brace-expansion | 1.1.16 | GHSA-rgw5-rvv9-x895 | high |
| brace-expansion | 5.0.8 | GHSA-rgw5-rvv9-x895 | high |
| js-yaml | 4.3.0 | GHSA-5p4m-2wfm-xmqj | high |
| nanoid | 3.3.16 | GHSA-2v37-7h3g-55p8 | high |

Nothing is suppressed, summarized away, or substituted. All five are transitive development-time
dependencies of the resolved tree; that observation is context, not triage, and does not reduce the
findings.

## Why a completed scan does not close the criterion

The criterion is not "a scan ran". The recovery pass produced an authoritative result, and that
result reports unremediated high-severity advisories. Closing on that basis would require either
weakening the criterion or creating a new exception — both prohibited by DEC-015. The criterion
therefore remains **NOT COMPLETED**, and `bun audit`, the pipeline's declared scanner, still cannot
execute in this environment.

## What would change the recommendation

Only one of the following, and only on evidence:

1. The five advisories are remediated or dispositioned by the owner against the frozen criteria, and
   a fresh scan records that state.
2. The owner records a new, explicit decision on the vulnerability criterion. That decision is the
   owner's to make and is not prepared, inferred, or self-accepted here.

## Owner escalation

- **Attempted source 1:** `bun audit --json` → HTTP 404. Endpoint unavailable in this environment.
- **Attempted source 2:** npm bulk advisory endpoint → HTTP 200, 5 high-severity advisories.
- **Available alternatives not executed:** GitHub Dependabot alerts (requires repository-settings
  access, outside repository content, same access boundary as FND-012); OSV.dev batch query as a
  second independent corroborating source.
- **Decision genuinely required:** whether to remediate the five advisories before WP-037 closure,
  or to record a bounded, evidence-cited acceptance of them. Not whether to reinterpret the
  criterion.

## Non-claims

This recommendation creates no security, compliance, certification, accessibility-conformance,
release, or independent-validation claim. Nothing here closes a gate. WP-038 remains NOT AUTHORIZED
and NOT STARTED.
