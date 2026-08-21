# AUDIT-001 — End-to-end repository audit

| Field | Value |
|---|---|
| Audit ID | AUDIT-001 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Date | 2026-08-21 |
| Method | Direct inspection of the repository at the audited commit: file reads, pattern searches, the full verification gate, and the committed evidence set. |
| Review class | AI-assisted self-audit. Not independent review, not human review, not validation. A single operator with no second reviewer cannot produce independent evidence. |
| Authority level | Descriptive. Records findings. Closes nothing. |

## Scope

Both planes and the container: the SSLS 2.0 synthetic prototype, the SSLS 3.0 foundation canon, and
the repository's own build, tests, evidence, and supply chain. Ten lenses. Every finding names what
was inspected. `[C]`

## Summary

| Severity | Count | Meaning |
|---|---|---|
| Material | 3 | Something asserted is not so, or something required is absent |
| Notable | 5 | Correct but incomplete, or correct and unenforced |
| Observation | 4 | Recorded for the owner's awareness; no defect asserted |

No finding is a stop condition. No PII, secret, or organizational identifier was found. `[C]`

Two of the three material findings were remediated in the same pass that raised them (A-001, A-002);
the third (A-003) is a documentation gap the owner may want worded differently, so it is left open.

---

## Lens 1 — Governance and authority

**A-001 · Material · Remediated.** The twelve SSLS 3.0 foundation documents existed only as loose
markdown. No file in `data/`, `src/`, or `scripts/` referenced `docs/ssls-3.0/`; the package was
absent from the current-state input manifest and from every generator and test. Every other governed
concept in this repository has a controlling data file, a domain model, a generator, tests, and a
surface. The canon had none, which means nothing prevented a later edit from marking a document
CANONICAL, deleting an open decision, or quietly promoting a reconstruction.

*Remediation in this pass:* `data/ssls-3.0/canon.json` under a schema, `src/domain/ssls-3-0/canon.ts`
with refusal invariants, `scripts/gen-ssls-3-0-docs.ts`, `src/test/ssls-3-0-canon.test.tsx`, and the
`/ssls-3-0` route. Registration is index-only and confers no authority. Routed to OD-03-2.

**A-004 · Notable.** Ten of the twelve documents state a review class. `SSLS3-DOC-00` does not,
although the definition of done in that same document requires every artifact to state one. Recorded
as `U3-002` rather than filled in by inference. Routed to OD-00-3.

**A-005 · Notable.** Three documents (08, 09, 10) are reconstructions composed from content cited
elsewhere, not transcriptions of a source. Each says so in its own provenance section, and the canon
record now enforces that a reconstruction can never be marked CANONICAL. A faithful reconstruction
can still be wrong about intent. Recorded as `U3-003`, routed to OD-08-2.

## Lens 2 — Truth-plane integrity

**Observation A-006.** Controlling and derived state are cleanly separated and enforced:
`check:generated` re-runs all governed generators (now fifteen) and fails on any tree diff. Every
generator round-trips at the audited commit. The convention that any `scripts/gen-*.ts` is a governed
generator means the new generator was discovered without registration — the mechanism works. `[C]`

**Observation A-007.** One prior incident is worth remembering: a formatting pass reflowed
`docs/wp-006/ROUTE_MANIFEST.md` and silently broke the Wave 0 snapshot parser, dropping row counts to
zero without failing a test. Generators that parse prose remain fragile in this specific way. No
current defect; recorded so the pattern is not rediscovered the hard way. `[C]`

## Lens 3 — Cross-plane coherence

**A-002 · Material · Remediated.** `data/external-corpora/ssls-3.0-foundation.json` recorded the 3.0
package as observed in connected storage, non-controlling, with three registers ABSENT-AT-OBSERVATION.
Twelve of those items now live in this repository and the three absent registers have been composed.
The observation was still true about what was seen and when, but silent about what happened after,
which is how a stale record becomes a misleading one.

*Remediation in this pass:* a `subsequent_disposition` field appended to the record. The observation
text is unchanged and nothing was deleted. The disposition states plainly that transcription is
copying and reconstruction is composition, and that neither promotes anything.

**A-003 · Material · Open.** `README.md` and `CLAUDE.md` describe this repository as an SSLS 2.0
prototype and say nothing about the 3.0 canon or how the two planes coexist. A reader arriving at
either file learns half the picture. `docs/ssls-3.0/PLANE_RECONCILIATION.md` now states the rule —
scope decides which plane governs, location never does — but the entry-point documents do not point
at it. Left open because the wording of a repository's own self-description is the owner's call, not
an audit's. Routed to OD-05-1.

**Observation A-008.** File 11 proposes `docs/00-governance/` and `registers/` at the repository
root. The documents actually sit in `docs/ssls-3.0/`. The proposed structure is unimplemented and
implementing it is blocked by OD-11-1 and OD-11-2. Not a defect: a proposal that has not been
approved should not have been implemented.

## Lens 4 — Claims and evidence

**Observation A-009.** No prohibited claim was found in any document, route, or fixture. The
governance docs consistently preserve the precise framing — "recorded target, not achieved state",
"deployment is not release", "verification passing is not certification". The evidence pipeline
states this in its own output. Authorized claims across both planes: zero. `[C]`

**A-010 · Notable.** Every SSLS 3.0 evidence item and every audit in this repository, including this
one, is AI-assisted self-verification. Each says so. The limitation is stated honestly and
consistently, and it is also structural: it cannot be removed by better wording, only by a second
reviewer. Routed to OD-10-4.

## Lens 5 — Data boundary

**Observation A-011.** The PII boundary scan reports one candidate match across 546 files, in
`src/test/evidence-output-safety.test.ts`. It is a scanner test token — a synthetic string that
exists precisely so the detector can be proven to fire. Removing it would weaken the check that
proves the boundary works. The finding is correctly left as review-required rather than dispositioned
away, and the evidence record does not claim absence of personal data — only absence of matches by
these patterns. `[C]` No real PII, secret, credential, or organizational identifier was found.

## Lens 6 — Architecture and code

**A-012 · Notable.** Layering holds: `src/domain/` is pure, `src/lib/` reads and queries,
`src/routes/` renders. Strict TypeScript options are on throughout. The one recurring smell is that
several `src/lib/*` registry modules are imported by exactly one generator and one test, which is by
design for filesystem-reading loaders but leaves them invisible to the running application. Not a
defect; worth knowing before anyone assumes a registry is exercised at runtime.

## Lens 7 — Routes and UX

**Observation A-013.** The route registry is the single source of truth for paths, labels, and
headings, and the route tests read from it, so a route added without a registry entry fails. The
`/ssls-3-0` route added in this pass is registered, grouped under the governance workspace, and
read-only: it renders no button, textbox, or checkbox, which is proven by test rather than asserted.

## Lens 8 — Accessibility

**Observation A-014.** TTR-001 remains NOT-RUN and the audit script stays dormant. No touch-target
conformance is claimed anywhere. The new route reuses existing governance primitives and adds no new
interactive element, so it introduces no new accessibility surface. The 3.0 accessibility conformance
target is itself an open decision (OD-01-6), so there is no target to measure against.

## Lens 9 — Test and evidence coverage

**A-015 · Notable.** The suite covers every controlling data file in both planes, now including the
3.0 canon. What the tests prove is structural: schema conformance, refusal behaviour, identifier
uniqueness, projection determinism, and route rendering. They do not prove that any recorded fact is
true, that any reconstruction matches owner intent, or that any artifact is fit for its purpose. The
distinction is stated in the governance docs and should stay stated.

## Lens 10 — Supply chain and build

**A-016 · Notable.** The vulnerability scan records
`SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE`. The pipeline handles this correctly — it
records non-completion as a note rather than passing silently or claiming a clean result — but the
standing position is that no vulnerability assessment currently exists. SBOM, license, provenance,
lint, typecheck, build, and test evidence are all current and applicable.

---

## Findings index

| ID | Lens | Severity | State | Routed to |
|---|---|---|---|---|
| A-001 | Governance and authority | Material | Remediated | OD-03-2 |
| A-002 | Cross-plane coherence | Material | Remediated | — |
| A-003 | Cross-plane coherence | Material | Open | OD-05-1 |
| A-004 | Governance and authority | Notable | Open (`U3-002`) | OD-00-3 |
| A-005 | Governance and authority | Notable | Open (`U3-003`) | OD-08-2 |
| A-006 | Truth-plane integrity | Observation | — | — |
| A-007 | Truth-plane integrity | Observation | — | — |
| A-008 | Cross-plane coherence | Observation | — | OD-11-2 |
| A-009 | Claims and evidence | Observation | — | — |
| A-010 | Claims and evidence | Notable | Open | OD-10-4 |
| A-011 | Data boundary | Observation | — | — |
| A-012 | Architecture and code | Notable | Open | — |
| A-013 | Routes and UX | Observation | — | — |
| A-014 | Accessibility | Observation | — | OD-01-6 |
| A-015 | Test and evidence coverage | Notable | Open | — |
| A-016 | Supply chain and build | Notable | Open | — |

## Owner disposition

Three positions are available. Recording one is the owner's act alone; this audit records none.

| Position | Meaning |
|---|---|
| **ACCEPT** | The findings are recorded as written. Open items stay open and route to the decisions named. |
| **REVISE** | One or more findings are misstated. Name them; they are re-examined and re-recorded. |
| **HOLD** | No position is taken yet. Everything stays as it is; nothing is closed by waiting. |

## Non-effects

This audit records findings. It does not close a gate, record or answer an owner decision, authorize
a claim, promote any artifact, change any 2.0 register or checkpoint, establish independence for
self-produced evidence, or assert that this repository is correct, complete, secure, compliant,
accessible, or ready for anything.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial end-to-end audit across ten lenses. | AI-assisted authorship |
