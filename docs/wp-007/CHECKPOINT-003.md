# WP-007 — Checkpoint 003

Cycle: v0.3.0 governed package integration and synchronization.
Authority class: current-state record. Machine-verified only. No human, independent,
legal, security, accessibility, or district review has occurred.

## Target stack (stated before implementation)

| Layer | This cycle |
| --- | --- |
| North Star | Make Learning Visible. |
| Target product state | A governed, private, founder-only evidence shell in which the founder_developer can inspect authority, requirements, work, validations, findings, evidence, limitations, and claims without creating a competing source of truth. |
| Current program target | Keep Gate A open while strengthening the inspectability, provenance, internal consistency, and testability of the Governance Spine. |
| Active work package | WP-007 — Historical Requirement Conformance Recovery. |
| Locked cycle outcome | The founder_developer can identify, verify, and inspect the supplied SSLS v0.3.0 package inside the existing canonical artifact, evidence, and current-state structures — exact filenames, verified digests, package date and version, synchronized-reference role, relationship to the canonical registers, non-claim boundaries, and its relationship to the earlier v0.2.0 set — with every material synchronization supported by executing tests. |
| Current-to-target delta at entry | The v0.3.0 package existed only as an owner-supplied external package: not reconciled with the repository, not registered with exact provenance, and not tested against canonical state. |
| Acceptance evidence | `data/packages/governed-packages.json` under `GOVERNED_PACKAGE_SCHEMA.json` v1.0.0; `docs/packages/` projection; `docs/packages/DRIFT_REGISTER.md`; `src/test/governed-packages.test.ts`; EV-033 and EV-034. |
| Anti-targets | No WP-007 closure or disposition, no WP-039 or successor authorization, no HREQ disposition, no further requirement extraction, no inference of HS-018/HS-019, no HS-020 transcription, no new route, no new role, no AI capability, no PII, no deployment, publication, or release, and no compliance, conformance, certification, or independent-validation claim. |
| End-of-cycle evaluation | Recorded below against the acceptance criteria, not against effort. |
| Proposed next target | Extract candidate historical requirements from one bounded contiguous requirement-bearing section of a verified historical source, then build a cross-source restatement index against HREQ-001..HREQ-014 without merging, resolving, promoting, or assigning owner disposition. Proposed only; not self-authorized. |

## What this cycle established

- Canonical governed-package schema `data/packages/GOVERNED_PACKAGE_SCHEMA.json` v1.0.0 and
  register `data/packages/governed-packages.json`, following the existing
  `data/<domain>/<SCHEMA>.json` + register convention. No competing folder structure was invented.
- **PKG-002** — SSLS 2.0 v0.3.0, state date 2026-08-19, authority role SYNCHRONIZED-REFERENCE,
  canonical status NONCANONICAL, predecessor PKG-001. Three artifacts registered with exact
  filename, media type, byte size, measured SHA-256, declared SHA-256, integrity state,
  acquisition method OWNER-SUPPLIED-INPUT, retention state, governed locator, role, and
  per-artifact limitations.
- Digest verification: PDF `9632f08c…52f943` (123,284 bytes) and workbook `68064dcb…6fcce1e`
  (21,520 bytes) both recomputed and **matched** the supplied manifest. The manifest declares no
  digest for itself; its measured digest is recorded as a measurement, not a manifest claim.
- **PKG-001** — the August 5, 2026 v0.2.0 package, authority role HISTORICAL-EVIDENCE. The DOCX
  and ZIP named by its manifest are registered NOT-SUPPLIED with no size, no digest, and no
  repository locator. No content of either file is inferred or claimed.
- Retention: the repository holds no binary-artifact retention convention, and none was created.
  Every artifact is registered by digest and governed external locator. No repository locator was
  fabricated for a file that was not retained.
- Authority classification reused the existing taxonomy. `current-summary` already means "reports
  truth; does not create authority", so no ninth authority class was added; the package-level
  distinction is carried by `authority_role` and `canonical_status` in the new schema, and tests
  prove neither confers implementation authority.
- Reconciliation of every checked package assertion against the canonical registers, recorded in
  `docs/packages/DRIFT_REGISTER.md` with locators and controlling authority. Four drift rows are
  recorded and left unresolved.
- Twenty executing invariants in `src/test/governed-packages.test.ts`.

## What this cycle did not do

WP-007 is not closed. No candidate requirement received a disposition. No requirement was
extracted. No finding was closed. Gate A was not changed. WP-039 is not authorized. No route,
role, feature, deployment, or claim was added. The PDF and workbook are not registers.

## Validation executed this cycle

- Vitest: **324 of 324 tests pass across 14 files**, including the 20 new governed-package
  invariants.
- Production build succeeds.
- Cycle evaluation: **ACHIEVED** against the locked outcome and acceptance evidence above.

## Owner decisions outstanding

- Authorization of the next WP-007 cycle target proposed above.
- The package's own proposed next cycle (registering and extracting from the August 5 v0.2 set)
  remains unauthorized and depends on those files being supplied; they are currently NOT-SUPPLIED.

## Re-verification pass — 2026-08-19 (owner resupplied the same package)

The owner resupplied the three v0.3.0 files. No new cycle target was authorized, so this is
recorded here rather than as a new checkpoint.

Executor-recomputed digests over the resupplied files:

| File | Recomputed SHA-256 | Registered artifact | Result |
| --- | --- | --- | --- |
| `SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf` | `9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943` | PKA-001 | MATCH |
| `SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx` | `68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e` | PKA-002 | MATCH |
| `SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt` | `3a98382ee083b8aa3dd8f8182f14ef70b00617f62f356f43c4e817950ca7a130` | PKA-003 | MATCH (manifest does not print its own digest) |

The files are byte-identical to the artifacts already registered under PKG-002, so no second
package record was created and no register value changed. Supersession search found no accepted
decision or canonical record later than Cycle 3 that would alter the entry state. Stale-reference
searches for the superseded gate label, for WP-038 as active, for WP-039 as authorized, and for
the prior August 5 package returned no active claim: Gate A is the current gate, WP-038 is closed
by owner, WP-039 is unauthorized, and the earlier v0.2.0 set remains historical evidence that was
not supplied and is not the current synchronized package.

Recorded as **EV-036** and pinned by an executing invariant in
`src/test/governed-packages.test.ts`. Nothing was promoted, closed, disposed, or released.

### Validation executed during the re-verification pass

- Vitest: **341 of 341 tests pass across 15 files**, including the new re-verification invariant.
- Typecheck: clean. Production build: succeeds.
- Lint executes: **704 problems (690 errors, 14 warnings, 685 auto-fixable)**. FND-014 remains
  open; the figure recorded against EV-029 was 686 at that earlier commit, so the executed count
  has grown and the finding is not narrowed by this pass.
- Evidence pipeline: 15 records, **fail=0, review-required=2 (lint, SSOT binding guard),
  not-completed=1 (vulnerability scan, external source unavailable)**. Baseline freshness CURRENT;
  evidence verification PASSED against the current input sets.
- Package digest verification: three of three files match (table above).
- Schema validation: every governed-package record validates.
- Unchanged limitations: FND-012 branch-protection verification not performed, FND-014 lint debt,
  `bun audit` not completing, and no independent accessibility, security, privacy, legal, or
  district-readiness validation. None was converted to PASS.
