# WP-037 — Evidence & Verification Pipeline

Execute the uploaded WP-037 execution prompt end to end, then publish.

Scope discipline: no product features, no database, no AI, no live integrations, no real PII.
DEC-011, DEC-012, DEC-013 stay open. FND-012 stays NOT VERIFIED.

## Core architecture

Two record classes, never conflated:

```text
LAYER A - IMMUTABLE EXECUTION EVIDENCE      LAYER B - CURRENT BASELINE MANIFEST
bound permanently to commit + input hashes  regenerated from live repo facts
never rebound, never edited                 GENERATED - DO NOT HAND EDIT
superseded, never replaced                  references evidence by applicability
```

Applicability replaces re-binding: evidence stays valid across a later commit when its
declared input-hash set, environment, expiry, and supersession state all still hold.
That is the direct remediation path for FND-011 and FND-013.

## Implementation

New `scripts/evidence/` (small composable Node ESM modules, no new runtime deps):

- `schema.mjs` — evidence record schema v1 (all 30+ prescribed fields), validator, method
  enumeration (automated / manual / assistive-technology / independent; `independent` never inferred).
- `inputs.mjs` — declared input-set hashing per evidence type (source globs, config, lockfile,
  test files, workflows) using git-tracked content hashes.
- `applicability.mjs` — returns CURRENT / STALE / EXPIRED / SUPERSEDED / INAPPLICABLE / UNKNOWN.
- `expiry.mjs` — per-type validity policy (invalidation conditions and/or time windows, each with rationale).
- `collect-*.mjs` — build, test, typecheck, lint, route inventory, provenance, dependency
  inventory, SBOM (CycloneDX JSON, generated from package manifest + lockfile), vulnerability
  scan (`bun audit`/`npm audit` with explicit NOT COMPLETED state when the feed is unavailable),
  license inventory (with REQUIRES LEGAL REVIEW for unknown/restrictive), secret scan (redacted
  identifiers only), PII-boundary scan.
- `baseline.mjs` — deterministic current-baseline generator; every derivable fact derived,
  anything else recorded UNKNOWN / MANUAL VERIFICATION REQUIRED.
- `bundle.mjs` — writes `artifacts/evidence/<shortsha>-<runid>/` with `manifest.json`,
  `baseline.json` and per-domain subdirectories; manifest hashes and indexes every artifact.
- `index.mjs` — evidence index generator (machine-readable + Markdown render).
- `render.mjs` — Markdown rendered from JSON; JSON is the only source of generated truth.
- `fixtures.mjs` — deterministic seeded synthetic fixture generator (obvious fictional
  identities, long-name / multiscript / boundary cases, `synthetic=true`, fixture_set_id + seed).
- `run.mjs` — orchestrator with fail-closed conditions and separate review conditions.

Commit SHA is always read from the environment/git at run time — no SHA constants in production
code paths (fixed fake SHAs only in test fixtures). This is the FND-011 acceptance condition.

`package.json` scripts: `evidence:baseline`, `evidence:run`, `evidence:index`, `evidence:verify`,
`evidence:reproduce`, `typecheck`, `lint:changed`.

Existing SSOT guard: retained, not deleted. Reclassified as a deprecated predecessor / compatibility
layer feeding baseline-manifest integrity; supersession recorded. EV-013…EV-018 preserved and mapped,
never mutated.

CI: new `.github/workflows/evidence-pipeline.yml` ("SSLS Evidence Pipeline") on pull_request,
push, and workflow_dispatch; jobs foundation → build-test → supply-chain → boundary-scans →
evidence-bundle, least-privilege permissions, pinned actions, text-only status.

## In-app surface

Extend `/evidence` with the two-layer model: immutable execution evidence, current baseline,
applicability state chips (text labels, never color-only), and claim/gate eligibility results.
Uses existing governance components and accessibility rules. No dashboard redesign.

## Registers

`src/fixtures/registers.ts`: new WP-037 evidence IDs continuing the sequence (EV-019 onward),
FND-011 and FND-013 given evidence-backed dispositions (resolved or materially narrowed),
FND-012 unchanged (NOT VERIFIED), FND-014 unchanged (advisory), plus a transitional lint policy
(baseline debt recorded; WP-037-touched files must pass lint). No mass reformat.

## Tests

New `src/test/evidence-pipeline.test.ts` covering the 17 prescribed self-tests plus validation
matrix A–H: schema accept/reject, immutability, supersession, docs-only commit preserves build
evidence, source change invalidates it, dependency change invalidates SBOM, expiry, environment
mismatch, claim wording exceeding `supports` rejected, automated evidence cannot satisfy an
independent requirement, secret/PII positive and negative controls, deterministic baseline regeneration.

## Documentation

The 24 prescribed deliverables under `docs/wp-037/` (spec SSLS-FND-002, EVIDENCE_SCHEMA.json,
type/expiry/reuse policies, baseline schema + generation, bundle manifest schema, pipeline
security and CI, SBOM / vulnerability / license / secret-scan policies, synthetic data boundary
and generator, claim and gate eligibility, findings, limitations, evidence index, exit-criteria
matrix, closure recommendation, handoff to WP-038). Claims Register updated with exact
evidence-supported wording only.

## Final evidence run and report

Capture HEAD, run the full pipeline, produce and verify the bundle, run self-tests, exercise one
controlled failure path, confirm no historical evidence was rewritten, compute eligibility, render
the baseline, and report the exact results in the prescribed A–AK section format with terminal
status `WP-037 EVIDENCE & VERIFICATION PIPELINE — EXECUTED, OWNER DISPOSITION REQUIRED`.

## Deploy

Publish after the run completes. Publishing deploys the app shell only; it is not a gate closure,
certification, or release claim.
