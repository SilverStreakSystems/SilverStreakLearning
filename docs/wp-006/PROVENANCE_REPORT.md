# Repository Provenance Report — current executable baseline

Authority class: candidate. Evidence method: project self-inspection (executor). Not independent.
This does not substitute for a CI evidence architecture; that is WP-037 and is not started.

## Baseline

| Field | Value | Status |
|---|---|---|
| Repository | Lovable-managed private Git repository for project `87c55369-0a52-4467-a48b-f8adcfd7d11e` | [C] |
| Safe locator | `git.private.lovable-gcp.code.storage/87c55369-0a52-4467-a48b-f8adcfd7d11e.git` (remote `origin`; the checked-out URL embeds a scoped access token, which is deliberately not reproduced here) | [C] |
| Secondary remote | `s3://lovable-repositories/87c55369-0a52-4467-a48b-f8adcfd7d11e.git` | [C] |
| Branch | `edit/edt-d7ef09cb-7b9d-43c9-8422-aee6050dc107` | [C] |
| HEAD commit | `9a257f754e97b9cddf9a474009c5947488102c04` | [C] |
| Parent commits | `70a11c889c61a71627fe9752b65e74feb1b7e901`, `cce526f4e051a301d01df34ab314114a803af961` (merge commit "Completed WP-006 SSOT findings", 2026-08-17 07:10:14 UTC) | [C] |
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` — "template: tanstack_start_ts_current-58df4fe22702", 2026-08-16 09:16:43 +0200 | [C] |
| Commit count on branch | 294 | [C] |
| Commit date distribution | 1 commit 2026-08-16, 293 commits 2026-08-17 | [C] |
| HEAD tree hash | `8ff51275baa0167fb25b31481ffb641c4b03a833` | [C] |
| Lockfile hash | `bun.lock` sha256 `591f58340f2ccd70a596f7a8e2ff8b0eeeb62a667cb4fe8a660a111a0d58fd13` | [C] |
| Manifest hash | `package.json` sha256 `eae91b5184064609178ad5d2b529678013349c898d0ccc55f9251e22ec7241fa` | [C] |
| Tracked files | 366 | [C] |
| Build environment | Lovable sandbox, Bun toolchain, Vite 8 build targeting a Cloudflare Worker runtime via Nitro | [C] |
| Inspection timestamp | 2026-08-19 01:39–01:41 UTC (re-bind pass) | [C] |
| Build result | `vite build` succeeded at HEAD | [C] |
| Test result | `vitest run` — 210 passed / 210, 8 files, at HEAD | [C] |
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

- All hashes and results are bound to `6aa254e`, re-executed 2026-08-19. This capture supersedes the
  2026-08-17 capture at `70c1f89`, which is now historical. These values may not be reported as
  current after any further commit.
- Self-inspection cannot establish independence, authorization, or conformance.
