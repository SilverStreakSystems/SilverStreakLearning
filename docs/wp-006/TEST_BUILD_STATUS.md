# Current test and build status

Bound to commit `6aa254e6f9ceeb06c60ae08827118fa5bf52001d`, executed 2026-08-17 06:57–07:02 UTC in
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
| Files | 8 |
| Tests | 210 |
| Passed | 210 |
| Failed | 0 |
| Skipped | 0 |
| Duration | 12.41 s |

Suites: `shell.test.tsx` (81), `governance.test.tsx`, `capability-architecture.test.tsx`,
`shared-objects.test.tsx`, `value-streams.test.tsx`, `workspaces.test.tsx` (25),
`design-system.test.tsx`, `accessibility.test.ts`.

## Not executed at this commit

| Check | Status |
|---|---|
| ESLint | [U] Not run in this pass |
| Standalone typecheck | [U] Not run; the build compiled without error |
| axe-core accessibility scan | [U] Not re-run at this commit; prior run recorded at an earlier commit in `docs/ACCESSIBILITY_EVIDENCE.md` |
| Screen-reader walkthrough | Not Run |
| Measured contrast ratios | Not Run |
| Independent verification of any kind | Not Run |

## Binding rule

These results establish the state of `6aa254e` only. Any later commit invalidates them as current
evidence.
