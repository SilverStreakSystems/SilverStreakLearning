# Build Manifest

> STATUS: SUPERSEDED HISTORICAL RECORD. Retained unchanged as a historical record of the
> commit-bound current-state mechanism. It is not the canonical current state. The canonical
> current state is the generated projection at `docs/CURRENT_STATE.md`, derived from the inputs
> declared in `data/current-state/current-state-inputs.json`. Superseded by DEC-022; the
> commit-binding guard it describes has been removed (FND-011).

All values inspected at commit `c1f06016c5eb4e4b19e9b5821f525be4131d639a` on 2026-08-19 02:13–02:14 UTC.
This capture supersedes the captures at `6aa254e` (2026-08-19 01:40 UTC) and `70c1f89`
(2026-08-17), both now historical.
Results below were executed at this commit, not reused from an earlier run.

| Field                     | Value                                                                                                                                                                                                                                                                                                  | Status |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Runtime / framework       | TanStack Start v1 (`@tanstack/react-start` 1.168.32) on React 19.2, TanStack Router 1.170.18                                                                                                                                                                                                           | [C]    |
| Server runtime target     | Cloudflare Worker via Nitro (`dist/server/wrangler.json` emitted by the build)                                                                                                                                                                                                                         | [C]    |
| Package manager           | Bun (`bun.lock`, `bunfig.toml`)                                                                                                                                                                                                                                                                        | [C]    |
| Package name / version    | `tanstack_start_ts`, private, no semantic version field                                                                                                                                                                                                                                                | [C]    |
| Dependency lockfile       | `bun.lock`, sha256 `591f58340f2ccd70a596f7a8e2ff8b0eeeb62a667cb4fe8a660a111a0d58fd13`                                                                                                                                                                                                                  | [C]    |
| TypeScript                | 5.9.3 resolved; `tsconfig.json` at repo root                                                                                                                                                                                                                                                           | [C]    |
| Build tool                | Vite 8.2.x with `@tailwindcss/vite`, `@tanstack/router-plugin`, `vite-tsconfig-paths`                                                                                                                                                                                                                  | [C]    |
| Styling                   | Tailwind CSS v4 via `src/styles.css` theme tokens                                                                                                                                                                                                                                                      | [C]    |
| Test runner               | Vitest 4.1.x, jsdom environment, `vitest.config.ts`, setup `src/test/setup.ts`                                                                                                                                                                                                                         | [C]    |
| Lint                      | ESLint 9 flat config (`eslint.config.js`) with typescript-eslint and prettier integration                                                                                                                                                                                                              | [C]    |
| Formatter                 | Prettier 3.7                                                                                                                                                                                                                                                                                           | [C]    |
| Accessibility tooling     | No axe/pa11y dependency in `package.json`. The WP-000-era axe run recorded in `docs/ACCESSIBILITY_EVIDENCE.md` was executed with an ad-hoc harness, not a committed tool.                                                                                                                              | [C]    |
| Browser / runtime targets | Not declared (no browserslist, no explicit target field)                                                                                                                                                                                                                                               | [C]    |
| Environment model         | No `.env` or `.env.example` in the tree; no `import.meta.env.VITE_*` or `process.env` read anywhere under `src/` outside tests                                                                                                                                                                         | [C]    |
| Backend status            | None. No server functions, no `src/routes/api`, no integrations directory.                                                                                                                                                                                                                             | [C]    |
| Database status           | NOT IMPLEMENTED (see `DATA_BACKEND_STATUS.md`)                                                                                                                                                                                                                                                         | [C]    |
| Repository CI             | One workflow, `.github/workflows/ssot-binding.yml` (SSOT declared-binding guard). No build, test, or lint job runs in CI.                                                                                                                                                                              | [C]    |
| Deployment provider       | Lovable preview only; not published                                                                                                                                                                                                                                                                    | [C]    |
| Build command             | `bun run build` (`vite build`)                                                                                                                                                                                                                                                                         | [C]    |
| Test command              | `bun run test` (`vitest run`)                                                                                                                                                                                                                                                                          | [C]    |
| Build result              | Succeeded; Nitro emitted worker output and client bundle                                                                                                                                                                                                                                               | [C]    |
| Test result               | 9 files, 217 tests, 217 passed, 0 failed, 0 skipped; duration 14.48 s                                                                                                                                                                                                                                  | [C]    |
| Lint result               | `eslint .` executed: 683 problems (669 errors, 14 warnings), overwhelmingly Prettier formatting errors spread across pre-existing files; 664 auto-fixable. The two guard scripts lint clean; `src/fixtures/registers.ts` carries 6 Prettier errors. Recorded as FND-014, not presented as a lint PASS. | [C]    |
| Typecheck result          | Not executed separately; the build compiled without error                                                                                                                                                                                                                                              | [I]    |

## Scale

| Measure                           | Value                                       |
| --------------------------------- | ------------------------------------------- |
| Tracked files                     | 372                                         |
| Files under `src/`                | 211 (209 TypeScript/TSX)                    |
| TypeScript/TSX lines under `src/` | 36,916                                      |
| Files under `docs/`               | 130 (including this work package's outputs) |
| Route files                       | 30 (including `__root.tsx`)                 |

## Binding rule

Every result above is bound to `c1f0601`. After any commit to any ref, these results become
historical and must be re-executed before being reported as current.
