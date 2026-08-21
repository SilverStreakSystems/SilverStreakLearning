# SSLS 3.0 Master Research Prompt — Integration Plan

| Field              | Value                                                                        |
| ------------------ | ---------------------------------------------------------------------------- |
| Artifact ID        | RES-STG-002                                                                  |
| Title              | SSLS 3.0 Master Research Prompt — Integration Plan                           |
| Version            | 0.1.0                                                                        |
| Status             | Draft / Proposed                                                             |
| Authority class    | Research — non-authoritative, `[AUTHORITY NOT YET ESTABLISHED]`              |
| Owner              | Shelby Russell                                                               |
| Author / generator | AI-assisted analysis; unreviewed                                             |
| Created            | 2026-08-21                                                                   |
| Source set         | RES-STG-001 (mining digest) + repository state at branch creation            |
| Limitations        | Proposes; does not decide. All decisions listed here require owner disposition |
| Supersession       | Superseded by an owner-approved charter and research-framework package       |

This plan maps the master prompt's contracts against the current repository and proposes the
optimal integration path. Per the prompt's §26 fallback, it is staged in an isolated
Draft/Research location because no approved charter or controlling policy files exist yet.

## 1. Repository reality check

Findings from inspecting the repository the prompt's §26 requires be inspected first:

1. **Repository identity is SSLS 2.0.** `README.md` declares "SSLS 2.0 — Founder Operator Shell."
   The prompt's §3 places SSLS 2.0 artifacts outside the active SSLS 3.0 corpus, and §26 forbids
   placing SSLS 2.0 artifacts in SSLS 3.0 current research.
2. **None of the 12 governance contract files exist.** `START_HERE.md`,
   `CURRENT_PROJECT_STATE.md`, `GOVERNING_AUTHORITY.md`, `SOURCE_AUTHORITY_POLICY.md`,
   `CANON_MANIFEST.md`, `BUILDER_OPERATING_CONTRACT.md`, `CLAUDE.md`,
   `PROJECT_SCOPE_AND_BOUNDARIES.md`, `ARTIFACT_AUTHORITY_MODEL.md`,
   `DOCUMENT_CONTROL_STANDARD.md`, `NAMING_AND_VERSIONING_STANDARD.md`, and
   `GOV-001_PROJECT_CHARTER.md` are all absent. The §26 fallback therefore governs: staged,
   isolated, `[AUTHORITY NOT YET ESTABLISHED]`.
3. **No research tree exists.** `docs/research/`, `data/research/`, `knowledge/`, and the root
   registers (`OPEN_QUESTIONS_REGISTER.csv`, `SOURCE_CONFLICT_REGISTER.csv`) do not exist;
   `data/governance/requirements.csv` does not exist.
4. **The prompt's governance philosophy is already implemented here — for 2.0.** The repository
   has exactly the machinery the prompt demands: controlling-vs-derived state separation, a
   no-parallel-truth-plane rule, governed generators with drift checks (`check:generated`),
   fingerprinted current-state projection, evidence registers with input-set hashing, an
   output-safety guard, status boundaries that refuse unearned claims, and CI gates. This is the
   single largest integration asset.
5. **Technology posture conflict.** This repository is Lovable-connected and built on TanStack
   Start/React/TypeScript/Bun. The prompt's §28 states SSLS 3.0 technology is **undecided** and
   must not be assumed. Running 3.0 inside this repo would silently inherit a technology decision
   the prompt reserves for an accepted ADR.

## 2. The one decision that gates everything: where SSLS 3.0 lives (D1)

| Option | Description | Assessment |
| --- | --- | --- |
| **A. Dedicated SSLS 3.0 repository (recommended)** | New repo scaffolded with the 12 governance files as Drafts, charter first | Cleanest match to §3 (nothing inherited), §26 (no 2.0 artifacts in 3.0 research), §28 (no inherited tech decision), §29 (activation order). SSLS 2.0 machinery is ported deliberately, as reviewed pattern reuse, not inheritance. |
| B. Isolated subtree in this repository | e.g. top-level `ssls-3.0/` with its own governance matrix | Faster start; keeps one repo. Costs: continuous vigilance against inheritance-by-osmosis; 2.0 drift/evidence gates begin policing 3.0 artifacts (an implicit, undecided tooling adoption); root-level deliverable paths in §23 collide with 2.0's root. |
| C. Research-only staging here, build elsewhere later | Keep only `docs/research/staging/` here; run the research program before deciding D1 | Defers the decision, which §29 permits (research may support the foundation). Risk: research deliverable paths (§23) are repo-relative and would need migration later. |

Recommendation: **Option A.** The prompt's default-deny inheritance model is nearly impossible to
honor inside a repository whose every gate, register, and README asserts SSLS 2.0 identity.
A new repository makes the greenfield boundary structural instead of disciplinary. Option C is
the acceptable interim while D1 awaits disposition — which is what this staging directory is.

## 3. Integration map — prompt contract → optimal mechanism

The optimal integration is **pattern port, not artifact inheritance**: reuse the 2.0 governance
*mechanisms* (which the owner built and understands) as the implementation of the 3.0 *contracts*,
with each reuse recorded as an explicit owner-authorized decision.

| Prompt contract | Optimal implementation |
| --- | --- |
| §26 governance file matrix + §29 charter-first order | Author all 12 files as Drafts in the 3.0 location; owner approves `GOV-001_PROJECT_CHARTER.md` first; nothing else gains authority until then. |
| §23 deliverable paths | Scaffold `docs/research/current/`, `docs/research/archive/`, `data/research/`, root registers, `knowledge/education/` exactly as named — the prompt is prescriptive and machine-checkable here. |
| §17/§18/§19 registers "filterable and machine-readable" | Controlling data as CSV/JSON with committed JSON-schema data dictionaries; generate the `.xlsx` workbooks and `.docx`/PDF framework via governed `gen-*` scripts. The prompt itself (§14, §23, §31.12) says spreadsheets and PDFs are *derived projections* — so making CSV canonical and XLSX generated is not a deviation, it is the only arrangement consistent with the prompt and with the no-parallel-truth-plane rule. |
| §25 count reconciliation gate | A `check:research` validation script (pattern: existing `check:current-state`) that fails when source/evidence/relationship/exclusion counts disagree across registers, manifest, and synthesis, when a crosswalk row lacks two-sided citations, or when a register row's Source ID does not resolve. Wire into `verify`/CI. |
| §17 dedupe by hash/fingerprint | Reuse the evidence pipeline's input-set hashing pattern for the source manifest: one canonical record per source, file hash + normalized title/issuer/version/URL as the dedupe key. |
| §27 artifact stamping | A front-matter convention (the stamp table used by the staging docs here) enforced by the same validation script; promotion recorded only via an owner-disposition record, mirroring the existing DEC-*/CHECKPOINT-* register pattern. |
| Appendix B response contract | Embed in the 3.0 `CLAUDE.md` / `BUILDER_OPERATING_CONTRACT.md` builder adapters so every research session inherits the per-phase status-block discipline. Per §30, adapters explain, never authorize. |
| §15 stop rules + `[LOCAL INPUT REQUIRED]` | Controlled-vocabulary markers in the registers plus rows in `OPEN_QUESTIONS_REGISTER.csv`; the validation script counts them so none silently disappear. |
| Appendix A source families | Seed `SOURCE_REGISTER.csv` with the 16 discovery rows at status `DISCOVERY — NOT VERIFIED`; verification (issuer, version, currency, successor pages) is Phase 2 work, done with web research enabled. |
| §11 copyright | Registers hold identifiers, metadata, and faithful paraphrase only; no framework text is committed wholesale; a licensing-flag column marks link-only material. The existing output-safety-guard pattern extends naturally to a "no wholesale reproduction" scan. |
| §7/§16 population model + §20 BICS/CALP safeguard | Population is a multi-valued controlled vocabulary (never a single collapsed column); BICS/CALP entries carry evidence type `conceptual lens` — the schema itself prevents the misuse the prompt warns about. Terminology register encodes the page-2 corrections (Learning for Justice; CALP not CALPS). |
| §10/§27 research → requirements firewall | Proposed requirements live only as `Proposed` staging artifacts; `data/governance/requirements.csv` (3.0) accepts rows only through the recorded human promotion step. Never auto-promote. |

## 4. Recommended execution sequence

Ordered per §29's dependency chain; each step is bounded and ends at an owner checkpoint.

1. **D1 disposition (owner).** Decide where SSLS 3.0 lives (Section 2). Also disposition D2:
   authorize the master prompt PDF itself as the governing research specification input, and D3:
   authorize any specific SSLS 2.0 items (e.g. generator/validation patterns) as non-authoritative
   historical inputs — §3 requires that authorization to be explicit and item-specific.
2. **Charter (owner-approved).** Draft and approve `GOV-001_PROJECT_CHARTER.md`. This is the
   first artifact that can carry authority; everything before it stays
   `[AUTHORITY NOT YET ESTABLISHED]`.
3. **Governance matrix.** Author the remaining 11 governance files as Drafts; owner reviews.
   Embed Appendix B's response contract in the builder adapters.
4. **Phase-1 research package (the prompt's §25 start instruction, exactly).** Produce only:
   source-discovery plan, research questions, terminology register, authority-register schema,
   standards-register schema, evidence-register schema, crosswalk schema, repository-placement
   plan. No extraction yet.
5. **Source-verification checkpoint (Phase 2).** With web research enabled, verify the 16
   Appendix-A families: current versions, dates, official status, successor pages. Populate
   `SOURCE_REGISTER.csv` and `SSLS_3.0_SOURCE_MANIFEST.csv`; record exclusions.
6. **Phases 3–7.** Extraction → normalization → crosswalk → synthesis → quality gates, each phase
   opening with the Appendix-B status block and ending with counts, exclusions, unresolved items,
   and one bounded next step. Build `check:research` alongside Phase 3 so reconciliation is
   continuous, not terminal.
7. **Promotion review (owner).** Walk Appendix C's map; owner dispositions promote artifacts out
   of Research/Draft status. Any proposed product requirements enter the requirements register
   only here.

## 5. What must NOT be done (from the prompt, applied to this repo)

- Do not treat this branch, this plan, or any polished artifact as authority (§27, §31.2).
- Do not copy SSLS 2.0 canon, decisions, gates, packages, or evidence into 3.0; port patterns only
  under an explicit D3 authorization (§3).
- Do not begin source extraction before the verification checkpoint (§25).
- Do not let the research program select technology, create roles/routes/persistence, or touch
  `GOVERNING_AUTHORITY.md` / `CANON_MANIFEST.md` / accepted decisions (§14, §25, §28).
- Do not write `data/governance/requirements.csv` entries directly from findings (§27).
- Do not paste the prompt into a session without web research enabled — source verification is a
  hard precondition of every downstream artifact (page 1, USE).

## 6. Open questions for owner disposition

| ID | Question | Blocking |
| --- | --- | --- |
| D1 | Repository location for SSLS 3.0 (Option A / B / C in Section 2) | Everything after staging |
| D2 | Is the uploaded master prompt PDF the accepted governing research specification (vs. a draft to revise)? | Charter drafting |
| D3 | Which SSLS 2.0 mechanisms (generators, drift checks, evidence hashing, register conventions) are authorized as non-authoritative historical inputs for pattern reuse? | Section 3 integration map |
| D4 | Register format ruling: CSV/JSON canonical with generated XLSX/DOCX projections (recommended, Section 3), or literal `.xlsx` as canonical per §23 filenames? | Phase-1 schemas |
| D5 | Does `knowledge/education/` live in-repo or in an external collection (Appendix C leaves both open)? | Knowledge governance step |
