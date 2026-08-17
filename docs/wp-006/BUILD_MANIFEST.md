# Build Manifest

All values inspected at commit `70c1f891c5d341c60132d0109979042004425a4b` on 2026-08-17 (UTC).
Results below were executed at this commit, not reused from an earlier run.

| Field | Value | Status |
|---|---|---|
| Runtime / framework | TanStack Start v1 (`@tanstack/react-start` 1.168.32) on React 19.2, TanStack Router 1.170.18 | [C] |
| Server runtime target | Cloudflare Worker via Nitro (`dist/server/wrangler.json` emitted by the build) | [C] |
| Package manager | Bun (`bun.lock`, `bunfig.toml`) | [C] |
| Package name / version | `tanstack_start_ts`, private, no semantic version field | [C] |
| Dependency lockfile | `bun.lock`, sha256 `591f58340f2ccd70a596f7a8e2ff8b0eeeb62a667cb4fe8a660a111a0d58fd13` | [C] |
| TypeScript | 5.9.3 resolved; `tsconfig.json` at repo root | [C] |
| Build tool | Vite 8.2.x with `@tailwindcss/vite`, `@tanstack/router-plugin`, `vite-tsconfig-paths` | [C] |
| Styling | Tailwind CSS v4 via `src/styles.css` theme tokens | [C] |
| Test runner | Vitest 4.1.x, jsdom environment, `vitest.config.ts`, setup `src/test/setup.ts` | [C] |
| Lint | ESLint 9 flat config (`eslint.config.js`) with typescript-eslint and prettier integration | [C] |
| Formatter | Prettier 3.7 | [C] |
| Accessibility tooling | No axe/pa11y dependency in `package.json`. The WP-000-era axe run recorded in `docs/ACCESSIBILITY_EVIDENCE.md` was executed with an ad-hoc harness, not a committed tool. | [C] |
| Browser / runtime targets | Not declared (no browserslist, no explicit target field) | [C] |
| Environment model | No `.env` or `.env.example` in the tree; no `import.meta.env.VITE_*` or `process.env` read anywhere under `src/` outside tests | [C] |
| Backend status | None. No server functions, no `src/routes/api`, no integrations directory. | [C] |
| Database status | NOT IMPLEMENTED (see `DATA_BACKEND_STATUS.md`) | [C] |
| Deployment provider | Lovable preview only; not published | [C] |
| Build command | `bun run build` (`vite build`) | [C] |
| Test command | `bun run test` (`vitest run`) | [C] |
| Build result | Succeeded; Nitro emitted worker output and client bundle | [C] |
| Test result | 8 files, 210 tests, 210 passed, 0 failed, 0 skipped; duration 12.41 s | [C] |
| Lint result | Not executed in this pass — status Unknown for this commit | [U] |
| Typecheck result | Not executed separately; the build compiled without error | [I] |

## Scale

| Measure | Value |
|---|---|
| Tracked files | 348 |
| Files under `src/` | 210 |
| TypeScript/TSX lines under `src/` | 35,556 |
| Files under `docs/` | 111 (before this work package's additions) |
| Route files | 30 (including `__root.tsx`) |

## Binding rule

Every result above is bound to `70c1f89`. After any commit to any ref, these results become
historical and must be re-executed before being reported as current.
