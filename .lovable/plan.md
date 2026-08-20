# Runtime Trust Spine — plan-only architecture and execution design

Plan only. Nothing below is authorized. No code, database, migration, identity, interface, decision, or closure is created by this document.

## A. Recovered current state and discrepancies

Verified by direct inspection, not assumed:

- HEAD is `d2109ee`; the parent chain is `d2109ee` → `f493f5f` → `b8e9630`. The only content change between `b8e9630` and HEAD is `.lovable/plan.md` (+58 lines). Worktree is clean.
- Cycle 8 is planned, not executed. `DEC-022`, `EV-044`, `CHECKPOINT-010`, and `TTA-001` appear nowhere in the repository outside that plan file.
- CHECKPOINT-009 / EV-043 remain the latest executed cycle; the measured suite is 405/405 across 19 files.
- TTR-001 v1.0.0 `execution_state` is `NOT-RUN`; FND-024 open; FND-023 discharged; HREQ-025 NEEDS-EVIDENCE / DEFER; EV-003 NOT-RUN.
- Gate A OPEN, WP-007 ACTIVE, WP-039 unauthorized.
- FND-012 (branch protection) not verified. FND-014 lint debt open; the latest measured figure carried in-repo is 699 problems, while an older register entry still narrates 683/686 — the plan uses "latest measured at execution time" and never a stale constant.
- No backend: no `supabase/`, no `src/integrations/`, no migrations, no env files. All data is compile-time fixtures.
- `AGENTS.md` contains only the Lovable integration warning — no durable SSLS controller.
- Discrepancy to record, not resolve here: the plan file at HEAD asserts Cycle 8 intent while no Cycle 8 evidence exists. Intent is not evidence; the executor must resolve this before touching authority records.

## B. Exact authority required before each stage

| Stage | Required owner decision before start |
| --- | --- |
| P1A | A recorded decision opening a named product work package, plus a disposition on Cycle 8 (complete it, or supersede it explicitly). |
| P1B | Adoption of ADR-001, plus explicit authorization to enable a development-only backend, apply additive migrations, and create synthetic identities. |
| P1C | Authorization to change Command Center and related routes for the workflow. |
| P1D | Authorization to execute TTR-001 against the resulting interface and to record commit-bound evidence and a checkpoint. |

No stage inherits a pass from another. No stage begins on the strength of this plan.

## C. Recommended work-package boundary

One umbrella product increment, named at authorization time. Identifiers (work package, decision, evidence, checkpoint, ADR) are allocated by collision scan at execution entry — this plan deliberately allocates none. Cycle 8's TTR-001 audit is a dependency of P1D, not part of P1A.

## D. ADR-001 decision structure

Proposed, not adopted. Sections: context and forces; decision statement; topology; trust boundaries; data classification and No-PII declaration; tenancy model; identity and session model; authorization model; RLS posture; audit model including denial limits; evidence model; failure behaviour; deployment boundary (development-only); canon-drift handling; explicit non-goals; consequences; authority state (`PROPOSED` until an owner records adoption); supersession rules.

## E. System and trust-boundary architecture

Three truth planes, never merged:

```text
Git canon            Runtime DB canon           Derived projections
doctrine, ADRs   ->  orgs, memberships,     ->  Command Center, trace,
schemas, migrations  requirements..audit        evidence, findings,
program registers    (synthetic only)           audit views
evidence code                                   (read-only, recomputed)
```

Trust boundaries: browser (untrusted; UX guards only) | server functions / RPC (trusted command boundary; role and tenant checks) | Postgres (final enforcement: constraints + RLS) | Git canon (immutable at runtime).

Runtime activity may never mutate Gate A, WP-007, accepted Git decisions, historical requirement dispositions, or repository evidence records. A canon-drift check compares a committed manifest fingerprint to the runtime `canonical_manifests` row and surfaces drift as a visible state, never as silent success.

## F. Table-by-table data model

Every table below is specified with: purpose, authority class, PK plus human-readable ID, tenant column, FKs with tenant-consistency enforcement (composite FK on `(id, org_id)`), indexes, immutable vs editable fields, `created_at` / `updated_at` plus a `version` column for optimistic concurrency, lifecycle status constraint, RLS policies, audit behaviour, retention limits, and classification (canonical / derived / evidentiary).

Identity and tenancy:
- `organizations` — fictional tenants. Canonical. No cross-tenant FK.
- `profiles` — one row per synthetic auth identity; no PII fields exist in the schema at all.
- `memberships` — `(org_id, profile_id, capacity)`; capacity is an enum in its own table-backed type, never a column on `profiles`.
- `canonical_manifests` — committed-canon fingerprint per org for drift detection.

Governed runtime objects (all tenant-owned, all RLS-enforced):
- `requirements`, `decisions`, `work_items`, `validation_runs`, `evidence_artifacts`, `findings`, `record_links` (typed edges, tenant-consistent on both ends), `audit_events` (append-only).

Rules: `evidence_artifacts` requires SHA-256 digest, provenance, method, timestamp, validator/reviewer, and a non-empty limitations field before it may reach `verified`. Derived proof posture is computed by a deterministic function over the chain and is never a stored editable column. `audit_events` has no UPDATE or DELETE grant to any authenticated role.

Every `CREATE TABLE` is followed in the same migration by explicit `GRANT`s, then `ENABLE ROW LEVEL SECURITY`, then policies.

## G. RLS and resource/action matrix

A single matrix of {role capacity} × {table} × {select, insert, update, delete, transition} with the expected outcome, the enforcing mechanism (policy, constraint, or RPC), and the test that proves it. Capacities: owner, contributor, reviewer; plus anonymous and authenticated-without-membership.

- Owner: read own tenant; draft create/edit; accept decisions, verify evidence, review validations, resolve or defer findings — all through secured transition functions.
- Contributor: read own tenant; create assigned drafts, validation runs, evidence metadata. No acceptance, verification, disposition, membership admin, or audit mutation.
- Reviewer: read own tenant; record validation review; verify or reject evidence. No acceptance, disposition, membership admin, or audit mutation.
- All: zero other-tenant visibility through routes, direct IDs, relationships, search, counts, facets, audit views, RPCs, or direct API.

Roles live only in `memberships`, checked through a `security definer` function with a fixed `search_path`. No role is ever read from client-supplied metadata.

## H. Audit architecture, including denial limitations

Successful sensitive transitions emit an `audit_events` row inside the same transaction, carrying a correlation ID that also travels on the response.

Stated limitation, planned explicitly rather than papered over: a write rejected by RLS rolls back the whole transaction, so it cannot durably record its own denial. Therefore auditable refusals are produced only at the trusted RPC/server boundary, which evaluates authorization first and writes a denial event in a separate committed unit before returning the refusal. Direct-to-database denials are proven isolated but are recorded as **not fully audited**, and no evidence artifact may claim otherwise.

## I. Route and UX changes

Additive where possible: tenant selection, database-backed Command Center, chain trace view, evidence detail with provenance and limitations, finding detail with disposition action, and an authorized audit view. Every surface carries explicit loading, empty, error, forbidden, stale, unknown, blocked, refused, and canon-drift states. Existing governance routes keep their current fixture-backed behaviour and their non-claim language; product mode may not silently fall back to fixtures on failure — it must fail visibly.

## J. Stages, dependencies, gates

- **P1A — authority and architecture contract.** Forensic recovery; Cycle 8 disposition; durable SSLS controller in `AGENTS.md` and concise Project Knowledge; ADR-001 drafted; threat model, trust boundaries, resource/action matrix, canon boundaries, failure modes, migration and rollback strategy, non-goals. No database mutation. Gate: ADR-001 adopted by owner decision.
- **P1B — runtime trust foundation.** Development-only backend; migrations, constraints, deterministic seeds; auth with explicit tenant selection; RLS on every tenant-owned table; secured transitions; append-only audit. Gate: direct database/API isolation proof produced before any product-completion claim.
- **P1C — one complete product-spine workflow.** Typed repositories/services; no component-level ad-hoc table writes; the ten-step flow end to end; all declared states rendered; wrong-role, anonymous, and wrong-tenant refusals behave correctly. Gate: the flow is completed by a person, not asserted.
- **P1D — verification and evidence.** Full regression, schema/migration replay, constraint and transition tests, auth/session tests, the full role matrix, RLS CRUD tests, anonymous/direct-ID/IDOR/count/search/facet/relationship/existence-leak tests, revocation and metadata-spoofing tests, sensitive-function positive and negative tests, audit completeness/correlation/immutability/redaction, persistence/retry/idempotency/concurrency, E2E, keyboard walkthrough, automated accessibility scan, TTR-001 at 320/768/1366, typecheck, build, touched-file and repository lint, secret/PII/dependency/vulnerability/license/SBOM/provenance scans, canon guard and SSOT binding, evidence generation and verification, generator and seed determinism.

## K. File-level change map

- `docs/adr/` — ADR-001 and its authority binding.
- `docs/<work-package>/` — threat model, trust boundaries, role matrix, RLS inventory, audit spec, boundary and non-claim documents.
- `supabase/migrations/` — additive, reversible migrations plus grants, RLS, policies, and transition functions.
- `supabase/seed` or a committed seed script — deterministic, resettable synthetic data.
- `src/integrations/supabase/*` — generated client surface only.
- `src/lib/product/*.functions.ts` — typed server functions; `*.server.ts` helpers.
- `src/domain/product/*` — runtime object types and derived-posture calculation.
- `src/routes/*` — tenant selection plus the workflow surfaces.
- `src/test/product/*` — the negative-authorization and isolation suites.
- `scripts/evidence/*`, `scripts/canon-guard` — evidence and drift checks.
- Registers and program state — updated only at the end of P1D, from measured results.

## L. Migration and rollback strategy

Forward-only, additive, individually reversible. Each migration ships a documented down path. No destructive change to any existing object. The database must rebuild from committed migrations plus seeds with an identical fingerprint; a replay mismatch is a stop condition. Rollback triggers: failed replay, failed RLS test, seed non-determinism, or any migration that would require a destructive operation.

## M. Test and evidence matrix

Each acceptance criterion maps to at least one executed check and one artifact. Artifacts planned: ADR-001 and authority binding; product/runtime boundary; threat model and diagram; data classification and No-PII declaration; schema/migration manifest with fingerprint; seed manifest; role/action matrix; RLS inventory with raw negative results; audit spec and verification; E2E transcript; route captures; TTR-001 results; secret/PII/dependency/SBOM/provenance evidence; canon-binding manifest; exact test, typecheck, build, and lint transcripts; determinism results; commit-bound evidence manifest; and an explicit list of unresolved limitations and unavailable independent reviews.

## N. Acceptance criteria traceability

All 25 stated criteria are carried as a table in P1A and re-verified in P1D, each row naming the stage, the mechanism, the executed check, and the artifact. A criterion with no executed check is reported unmet — never inferred.

## O. Stop conditions and rollback triggers

Stop rather than improvise if: Cycle 8 remains ambiguous; repository authority conflicts; development-only status cannot be proven; any data might be real; a destructive or irreversible migration is required; PII or real identities appear; a secret would reach browser code or a committed file; RLS, cross-tenant, or audit tests fail; runtime and repository canon cannot be separated; success depends on fixtures; SSRA, AI, Learning Hub, or live-integration scope becomes necessary; owner acceptance, closure, publication, or deployment is required; evidence cannot be deterministically reproduced.

## P. Risks, anti-targets, mitigations

| Risk | Mitigation |
| --- | --- |
| Fixture fallback masks a broken backend | Product mode fails visibly; a test asserts no successful fixture substitution. |
| RLS proven only through the UI | Direct API and direct SQL negative tests, run as each identity. |
| Denial auditing overclaimed | Trusted-boundary refusals only; direct DB denials recorded as not fully audited. |
| Roles drift into profile columns | Roles exist only in `memberships`, read through a security-definer function. |
| Runtime state leaking into Git canon | Canon guard plus tests asserting Gate A, WP-007, HREQ, and evidence records unchanged. |
| Governance packet substituted for a working flow | P1C gate is a person completing the flow. |

Anti-targets: AI of any kind, learner experience, curriculum, real data, production deployment, binary uploads, generic rules engines, and any conformance or readiness claim.

## Q. Exact owner decisions needed

1. Dispose of Cycle 8: execute it, or supersede it explicitly.
2. Open the named product work package with a stated boundary.
3. Adopt ADR-001.
4. Authorize a development-only backend, additive migrations, and synthetic identities.
5. Authorize the Command Center and route changes the workflow requires.
6. Authorize TTR-001 execution against the resulting interface and the commit-bound evidence and checkpoint.

## R. Recommended terminal status and report format

Terminal status for the future execution is ACHIEVED, PARTIAL, or BLOCKED, reported as: task status; authority and entry baseline; stage results P1A–P1D; workflow demonstration; isolation and audit results; findings; governance records; files changed; validation transcripts; claim boundary; non-effects; blockers and human reviews; next owner decision.

## S. What follows only after this passes

Nothing is scheduled. Candidate successors, none authorized: TTR-001 remediation, independent review of isolation results, EV-003 assistive-technology review, and only then any consideration of a district-facing surface.

---

Terminal boundary for this document: PLAN ONLY. Nothing is implemented, enabled, migrated, seeded, executed, or decided. Gate A remains open, WP-007 remains active, TTR-001 remains NOT-RUN, EV-003 remains NOT-RUN, and no work package, decision, evidence record, or checkpoint is created or authorized.
