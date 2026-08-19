# Repository Provenance Report — current executable baseline

Authority class: candidate. Evidence method: project self-inspection (executor). Not independent.
This does not substitute for a CI evidence architecture; that is WP-037 and is not started.

## Baseline

| Field | Value | Status |
|---|---|---|
| Repository | Lovable-managed private Git repository for project `87c55369-0a52-4467-a48b-f8adcfd7d11e` | [C] |
| Safe locator | `git.private.lovable-gcp.code.storage/87c55369-0a52-4467-a48b-f8adcfd7d11e.git` (remote `origin`; the checked-out URL embeds a scoped access token, which is deliberately not reproduced here) | [C] |
| Secondary remote | `s3://lovable-repositories/87c55369-0a52-4467-a48b-f8adcfd7d11e.git` | [C] |
| Branch | `edit/edt-32665212-9bdf-4b4a-90ea-b94f5470ba9b` | [C] |
| HEAD commit | `c1f06016c5eb4e4b19e9b5821f525be4131d639a` | [C] |
| Parent commit | `5011a40cd9990cd3e68998d7237442822ba6b749` ("Update plan", 2026-08-19 02:02:40 UTC) | [C] |
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` — "template: tanstack_start_ts_current-58df4fe22702", 2026-08-16 09:16:43 +0200 | [C] |
| Commit count on branch | 311 | [C] |
| Commit date distribution | 1 commit 2026-08-16, 293 commits 2026-08-17, 17 commits 2026-08-19 | [C] |
| HEAD tree hash | `cfc5aec6fe212c330d3a70e416876d2458100cde` | [C] |
| Lockfile hash | `bun.lock` sha256 `591f58340f2ccd70a596f7a8e2ff8b0eeeb62a667cb4fe8a660a111a0d58fd13` | [C] |
| Manifest hash | `package.json` sha256 `0ab32261ed51046c4556e280e76c17a2aa99b8825dbcf9ccd31ad8ae9a9dd029` | [C] |
| Tracked files | 372 | [C] |
| Build environment | Lovable sandbox, Bun toolchain, Vite 8 build targeting a Cloudflare Worker runtime via Nitro | [C] |
| Inspection timestamp | 2026-08-19 02:13–02:14 UTC (owner-authorization pass) | [C] |
| Build result | `vite build` succeeded; exit 0 | [C] |
| Test result | `vitest run` — 217 passed / 217, 9 files, 14.48 s | [C] |
| Source-tree delta since evidence execution | Test and build were executed at `7acb5d6`; the only change between `7acb5d6` and this HEAD is the addition of an archived plan document under `.lovable/plan/`. No file under `src/`, `scripts/`, or `package.json` differs. | [C] |
| Project visibility | Private (no published deployment recorded) | [C] |
| Preview locator | `https://id-preview--87c55369-0a52-4467-a48b-f8adcfd7d11e.lovable.app` | [C] |
| Published locator | None | [C] |
| Executor | Founder / Operator via Lovable agent session | [C] |

## Ancestry

[C] The root commit is a platform template scaffold (`tanstack_start_ts_current`). It contains no
SSLS legacy source, no legacy history, no fork, no cherry-pick, and no imported branch or tag.

[I] This satisfies the substance of ADR-002 and REPO-BOOT-001 "independent root commit / no legacy
ancestry", while diverging from FIRST-COMMIT-001, which specified a 12-file documentation-only first
commit. The divergence is recorded as discrepancy DSC-003, not silently reconciled.

[U] Whether copies of this source exist outside the platform repository cannot be determined from
inside the project. DEC-009 accepts this bounded unknown for the current phase.

## Limitations

- All hashes and results are bound to `c1f0601`, captured 2026-08-19 02:13–02:14 UTC. This capture
  supersedes the `6aa254e` capture of 2026-08-19 01:39–01:41 UTC, which supersedes the `70c1f89`
  capture of 2026-08-17. Both earlier captures remain valid statements about their own commits and
  must not be reported as current.
- These values may not be reported as current after any further commit. The platform commits once
  per authoring turn, so this document is expected to fall out of binding on the next commit; that is
  declaration drift (FND-011), not evidence corruption.
- Self-inspection cannot establish independence, authorization, or conformance.
