# WP-007 — v0.3.0 Governed Package Integration and Synchronization Cycle

## Truth recovered before planning

- HEAD `53ac085881fd9cb994f00945d3f7b55b61ab5662`, working tree clean.
- Both supplied hashes independently recomputed and **matched** the manifest:
  - PDF `9632f08c…52f943`
  - XLSX `68064dcb…6fcce1e`
  - The manifest itself is unhashed by design (no self-hash claim).
- No later accepted decision supersedes the Cycle 2 checkpoint. `Gate 0` / `WP-039`
  strings appear only in refusal, lineage, or history text; the stale
  `HANDOFF_TO_WP-039.md` locator no longer exists.
- Existing canonical conventions to reuse (no new folder taxonomy):
  `data/<domain>/<SCHEMA>.json` + register JSON, `src/domain/*.ts` types,
  `src/lib/*-registry.ts`, `scripts/gen-*-docs.ts` projections, `src/test/*.test.ts`
  invariants, `src/fixtures/registers.ts` for decisions/findings/evidence.

## Locked cycle outcome

The founder-operator can inspect the supplied v0.3.0 package inside the existing
canonical structures — exact filenames, verified digests, version and state date,
synchronized-reference role, non-claim boundaries, and its predecessor relation to the
v0.2.0 set — with every synchronization backed by executing tests. No route is added.

## What will be built

**1. Canonical governed-package register (new data domain, mirrors existing pattern)**
- `data/packages/GOVERNED_PACKAGE_SCHEMA.json` v1.0.0.
- `data/packages/governed-packages.json`: package `PKG-002` (v0.3.0, 2026-08-19) with
  three artifact records (PDF, XLSX, manifest TXT) each carrying filename, MIME type,
  byte size, SHA-256 (manifest excluded from self-hash), acquisition method
  `OWNER-SUPPLIED-INPUT`, authority class, canonical status `NONCANONICAL`, register
  relationship, retention status, and governed external locator. Predecessor record
  `PKG-001` (v0.2.0) is registered as historical with an explicit
  `NOT-SUPPLIED` completeness limitation for the DOCX and ZIP.
- Binaries are **not** copied into the repository (no existing binary-retention
  convention). Retention is recorded as `NOT-RETAINED — governed external locator`;
  no repository locator is fabricated.

**2. Narrowest authority extension**
- Add one authority class, `synchronized-reference`, to `src/domain/authority.ts`
  (lowest-authority reference tier, `carriesImplementationAuthority: false`), only if
  no existing class already expresses "summarizes canonical state, is not a register".
  Existing class list is reviewed first; reuse is preferred over addition.

**3. Registry + generated projection**
- `src/domain/governed-package.ts`, `src/lib/governed-package-registry.ts`.
- `scripts/gen-governed-package-docs.ts` → `docs/packages/PACKAGE_REGISTER.md`,
  `INTEGRITY_MANIFEST.md`, `COMPLETENESS_BOUNDARY.md`, `NON_CLAIM_BOUNDARY.md`.
- Package facts are surfaced on the existing `/evidence` and foundation/artifact
  surfaces through the register only — no new route.

**4. Reconciliation and drift**
- Compare each v0.3.0 package assertion against repository truth (North Star, Gate A
  OPEN, WP-038 closed, WP-007 active, WP-039 unauthorized, DEC-012/DEC-018 accepted,
  WCAG 2.2 AA internal target only, FND-016 partial, FND-017/018 open, FND-019
  repaired, 22 sources / 3 inaccessible, HS-011, 14 pre-disposition HREQs).
- Matches are recorded as verified; any difference is recorded as drift in
  `docs/packages/DRIFT_REGISTER.md` with both locators and the controlling authority.
  Repository values are never overwritten by the package summary.

**5. Target-stack contract**
- Added to `docs/wp-007/ENTRY_SPECIFICATION.md` and to the new
  `docs/wp-007/CHECKPOINT-003.md`, with the ten required layers. No new workflow.

**6. Tests** (`src/test/governed-packages.test.ts`, plus additions to existing suites)
Covering: both digests match the manifest; manifest does not self-hash; package
contains exactly the three supplied files; absent v0.2.0 DOCX/ZIP are not represented
as v0.3.0 artifacts; DEC-012/DEC-018 accepted; WP-038 closed; WP-007 active; WP-039
unauthorized; FND-016 partial; FND-017/018 open; package closure never mutates a
finding; HREQ-001..014 pre-disposition and not assessed; reserved dispositions absent;
`synchronized-reference` carries no implementation authority; inclusion, recency,
extraction, or passing validation never promotes a historical source; no active doc
presents Gate 0 as current or v0.2.0 as the current package; CURRENT_STATE agrees with
the registers.

**7. Validation and evidence**
- Full run: `bun run test`, typecheck, production build, `bun run lint` (expected to
  remain at existing debt, FND-014 open), `bun run evidence:run`,
  `bun run evidence:verify`, schema validation, stale-reference searches, SSOT binding
  guard. Unavailable checks (e.g. `bun audit` 404, branch protection FND-012) stay
  recorded as not-completed — never converted to PASS.
- Register new evidence records (EV-033 package integrity verification, EV-034
  reconciliation and drift) in `src/fixtures/registers.ts`, and update
  `docs/CURRENT_STATE.md`.

## Anti-targets held

No WP-007 closure or disposition, no WP-039 authorization, no HREQ disposition or
further extraction, no HS-018/019/020 inference, no routes, no roles, no AI, no PII,
no deploy/publish/release, and no compliance, conformance, or validation claim. The
PDF and workbook never become a competing SSOT.

## Completion report

The cycle ends with the full Controller v1.1 checkpoint (sections A–P), including the
locked-target evaluation of ACHIEVED / PARTIAL / NOT ACHIEVED / BLOCKED, and a proposed
— not self-authorized — next WP-007 target.
