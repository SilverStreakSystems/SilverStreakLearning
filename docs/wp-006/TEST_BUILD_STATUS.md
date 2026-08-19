# Current test and build status

Bound to commit `9a257f754e97b9cddf9a474009c5947488102c04`, executed 2026-08-19 02:04–02:06 UTC in
the Lovable sandbox by the Founder / Operator agent session. Evidence method: automated, executor-run.
Not independent.

## Build

| Field | Value |
|---|---|
| Command | `bun run build` (`vite build`) |
| Result | Success |
| Output | Client bundle plus Nitro Cloudflare Worker server output; `dist/server/wrangler.json` generated |
| Warnings material to governance | None observed |

## Tests

| Field | Value |
|---|---|
| Command | `bun run test` (`vitest run`) |
| Files | 9 |
| Tests | 217 |
| Passed | 217 |
| Failed | 0 |
| Skipped | 0 |
| Duration | 14.48 s |

Suites: `shell.test.tsx` (81), `governance.test.tsx`, `capability-architecture.test.tsx`,
`shared-objects.test.tsx`, `value-streams.test.tsx`, `workspaces.test.tsx` (25),
`design-system.test.tsx`, `accessibility.test.ts`, `ssot-binding.test.ts` (7).

## Not executed at this commit

| Check | Status |
|---|---|
| ESLint | Run. Full repository: 683 problems (669 errors, 14 warnings), predominantly pre-existing Prettier formatting errors. Guard scripts clean; `src/fixtures/registers.ts` 6 Prettier errors. FAIL as a repository-wide gate — see FND-014. |
| Standalone typecheck | [U] Not run; the build compiled without error |
| axe-core accessibility scan | [U] Not re-run at this commit; prior run recorded at an earlier commit in `docs/ACCESSIBILITY_EVIDENCE.md` |
| Screen-reader walkthrough | Not Run |
| Measured contrast ratios | Not Run |
| Independent verification of any kind | Not Run |

## Supersession

This capture replaces the `6aa254e` capture of 2026-08-19 01:40 UTC, which replaced the `70c1f89`
capture of 2026-08-17. Both earlier captures remain valid historical statements about their own
commits and are not rewritten.

Test and build commands were executed at `7acb5d6`. The only difference between `7acb5d6` and the
bound commit is an added archived plan document under `.lovable/plan/`; no source, script, or
manifest file differs, so the results are reported as current for the bound commit.

## Binding rule

These results establish the state of `9a257f7` only. Any later commit invalidates them as current
evidence.
