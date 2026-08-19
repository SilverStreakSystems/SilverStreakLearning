# WP-038 — Regulatory, Standards & Obligation Baseline

Authority verified before planning: DEC-007, DEC-010, DEC-014 and DEC-017 are all recorded
`state: "accepted"` in `src/fixtures/registers.ts`; DEC-017 closes WP-037 by owner and authorizes
generation and execution of WP-038 only. WP-038 has not been executed (no `docs/wp-038/`, no
obligation data files). Entry authority is established, so the stop condition in §1 of the prompt
does not fire.

## What this work package produces

A verified, machine-readable baseline of the external requirements that may apply to SSLS — now,
at pilot, at launch, or conditionally — with each obligation traced to an authoritative source, an
applicability trigger, a current control status, and a target work package. It is research and
governance only: no product features, no database, no AI, no PII, no compliance claim.

## Canonical data (single source of truth)

New governed data under `data/governance/`, machine-readable first, human views generated:

- `external-authorities.json` — one record per external source: issuing body, source type
  (statute / regulation / official guidance / standard / voluntary framework / market expectation),
  citation, URL, version, effective date, verification date, jurisdiction, source status
  (VERIFIED-CURRENT / VERIFIED-HISTORICAL / SUPERSEDED / UNVERIFIED / CONFLICTED).
- `obligations.json` — ObligationRecord with the full field set from §8 of the prompt, including the
  hard split between `source_statement_boundary` (what the source says) and `ssls_interpretation`.
- `OBLIGATION_SCHEMA.json` — the schema both files validate against.

Typed accessors in `src/domain/obligation.ts` plus fixtures/query helpers follow the existing
`src/domain` + `src/fixtures` + `src/lib/*-queries.ts` conventions. All state vocabularies
(applicability, control status, evidence status, source status) are closed unions — UNKNOWN is a
first-class value and is never collapsed.

## Research pass

Parallel research subagents, each restricted to primary sources (govinfo/eCFR, ED, FTC, DOJ,
Mass. Legislature/AGO/DESE, W3C/WAI, NIST, ISO metadata pages, 1EdTech, Ed-Fi, CycloneDX, SPDX):

1. Federal education privacy — FERPA, PPRA, IDEA confidentiality, COPPA.
2. Massachusetts — 603 CMR 23.00 student records, 201 CMR 17.00 / M.G.L. c.93H, DESE guidance,
   state accessibility and AI guidance.
3. Accessibility — WCAG current version, ADA Title II web rule and its compliance dates,
   Section 504/508, EN 301 549 status, VPAT/ACR actual authority.
4. Security, supply chain and AI — NIST CSF, SP 800-53, CIS, SOC 2 (attestation, not certification),
   ISO 27001/42001 editions, SBOM formats, NIST AI RMF and profiles, state AI law watch.
5. Interoperability — current OneRoster, LTI, QTI, Caliper, Ed-Fi versions and status.

Every source records its verification date. Where retrieval fails, the record is written as
`SOURCE VERIFICATION — NOT COMPLETED` rather than filled from memory. Contradictions between
authoritative sources become findings, never a silent choice.

## Analysis passes over the current build

- Public-prototype obligation check: inspect the actual deployed surface for forms, analytics,
  cookies, telemetry, third-party scripts and network requests, and record evidence of what it
  does or does not collect — not an inference from appearance.
- Current-control mapping: credit only controls the code and WP-037 evidence support (zero-PII
  boundary, Claims Register, evidence pipeline, secret scanning, vulnerability management,
  synthetic fixtures). Documentation of intent earns no implementation credit.
- Seed verification: each of the 22 seeded candidate authorities is VERIFIED, CORRECTED, NARROWED,
  RECLASSIFIED or REMOVED against evidence; stale project version references become findings in a
  stale-reference register.
- Public claims audit against the verified baseline; unsupported wording is either corrected within
  existing authority or raised as a finding.

## Documents (`docs/wp-038/`)

The 24 deliverables named in §69, generated from the canonical data wherever a table is involved:
obligation register (SSLS-GOV-003 CANDIDATE), source register, federal privacy, Massachusetts,
accessibility, security classification, supply chain, interoperability, AI governance, retention,
procurement, data-trigger matrix, control-coverage matrix, gap register, source conflicts, stale
references, claims delta, DEC-012 evidence brief, evidence index, exit-criteria matrix, closure
recommendation, handoff to WP-007, plus a `docs/CURRENT_STATE.md` update.

## Registers, evidence and decisions

- New findings for gaps, conflicts, stale references and any mandatory obligation without an owning
  work package.
- New evidence records via the WP-037 pipeline architecture (next free EV IDs, `independent: false`),
  binding the source register hash, obligation register hash, tests, typecheck and build.
- Claims Register reconciled: no compliance, certification, approval or validation claim is added.
- DEC-012 evidence brief prepared and left decision-required. DEC-011 and DEC-013 stay routed to
  WP-008, untouched.
- A proposed owner decision for WP-038 closure is written in `required` state. WP-038 is never
  self-closed.

## Tests

`src/test/obligations.test.ts` covering the 20 registry invariants and the source-quality checks:
stable IDs, source citation and verification date present, canonical state vocabularies, APPLIES-NOW
maps to a control or explicit gap, gaps map to a WP or decision, voluntary frameworks cannot render
as statutory, procurement expectation cannot render as law, proposed legislation cannot render as
effective, superseded sources cannot stay VERIFIED-CURRENT, conflicts surface, UNKNOWN preserved,
generated views match canonical data, and no protected standards text is embedded where only a
citation is authorized.

## Verification and deployment

Full test suite, typecheck, production build, changed-file lint, evidence pipeline run and
`evidence:verify`, then publish. Publishing does not change the classification: the surface remains
a PUBLIC PROTOTYPE.

## Boundaries preserved

Founder/developer operator only; synthetic data only; zero real PII; no database, integrations,
authentication or AI; no legal advice; no compliance score; no gate closure.

## Report

The response returns exactly sections A through AG as specified in §101, ending with one
recommendation (PROMOTE TO OWNER CLOSURE / HOLD / BLOCK / REVISE / TERMINATE) and the terminal
status line.
