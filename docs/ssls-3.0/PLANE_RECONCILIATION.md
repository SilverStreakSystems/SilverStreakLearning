# Plane reconciliation — SSLS 2.0 prototype and SSLS 3.0 canon

| Field | Value |
|---|---|
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Descriptive. States how two co-located planes relate. Controls neither. |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Why this file exists

Two bodies of governed material now live in one repository:

- The **SSLS 2.0 plane** — a public synthetic prototype with registers, gates, work packages, an
  evidence pipeline, a generated current-state projection, and a running application.
- The **SSLS 3.0 canon** — twelve CANDIDATE foundation documents declaring a clean slate that
  explicitly does not inherit from SSLS 2.0.

Read separately, each is coherent. Read together without a rule, they contradict: `README.md` and
`CLAUDE.md` describe an SSLS 2.0 prototype, while the owner has directed that this repository is the
home of SSLS 3.0. This file states the rule. It resolves nothing else. `[C]`

## The rule

**Scope decides which plane governs. Location never does.** `[C]`

| Question | Governing plane | Controlling sources |
|---|---|---|
| What is true about the synthetic prototype, its gates, work packages, findings, evidence, and routes? | 2.0 | `src/fixtures/registers.ts`, `data/`, `docs/CURRENT_STATE.md` |
| What is true about SSLS 3.0 identity, scope, requirements, decisions, evidence, and claims? | 3.0 | `docs/ssls-3.0/` — all CANDIDATE, none yet authorized |
| What is true about this repository as an artifact — its build, tests, supply chain, and structure? | 2.0 | The evidence pipeline under `evidence/` |

## What does not cross

Nothing in the 2.0 plane carries into SSLS 3.0: no schema, role model, route set, module list,
technology choice, gate model, maturity claim, work-package state, or implementation status. `[C]`
This is the clean-slate mandate in file 01 §3 and file 02 §11, and it is not weakened by
co-location. A file sitting beside another file is not an inheritance.

Nothing in the 3.0 canon carries into the 2.0 plane either. The twelve documents are CANDIDATE with
zero authorizing decisions; they cannot change a 2.0 gate, checkpoint, decision, or claim. `[C]`

## What is shared

Exactly three things, and each is shared because it is a property of the container rather than of
either plane:

1. **The zero-real-PII boundary.** Both planes prohibit real personal data and organizational
   identifiers. The prohibition is stricter in neither direction, so no reconciliation is needed.
2. **The repository's own supply chain and build.** One `package.json`, one dependency tree, one
   verification gate. Evidence about the container describes the container.
3. **The owner.** One decision authority, and no second reviewer in either plane.

## What is unreconciled

| ID | Item | Label |
|---|---|---|
| PR-01 | `README.md` and `CLAUDE.md` describe this repository as an SSLS 2.0 prototype and do not mention the 3.0 canon or this rule. A reader arriving at either file learns only half the picture. | `[C]` |
| PR-02 | The 3.0 repository map (file 11) proposes `docs/00-governance/` and `registers/` at the root. The documents actually sit in `docs/ssls-3.0/`. The proposed structure is unimplemented, and implementing it is blocked by OD-11-1 and OD-11-2. | `[C]` |
| PR-03 | Whether SSLS 3.0 eventually supersedes the 2.0 prototype, runs alongside it, or renders it archival is undecided. Nothing here presumes an answer. | `[U]` |

## Non-effects

This file states a reading rule. It does not merge the planes, promote any 3.0 document, change any
2.0 register or gate, decide the 3.0 repository structure, retire the prototype, or record any owner
decision.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial statement of the co-location rule. | AI-assisted authorship |
