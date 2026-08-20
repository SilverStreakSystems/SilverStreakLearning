# SSLS 2.0 — Founder Operator Shell

Public synthetic prototype for Silver Streak Learning Systems. Every record in
the interface is synthetic. The application holds no personal data, no district
data, no production data, no AI features, and no external integrations.

Governance canon lives in `docs/`. The canonical program state is
`docs/CURRENT_STATE.md`, which is generated — never hand edited — from the
inputs declared in `data/current-state/current-state-inputs.json`.

## Quality commands

These commands are the engineering baseline. Each is expected to pass on a
clean tree, and `verify` runs the full set in order.

| Command | What it does | Expected result |
| --- | --- | --- |
| `bun run verify` | lint, typecheck, test, build, current-state check | all pass |
| `bun run lint` | ESLint with Prettier, `--max-warnings 0` | 0 problems |
| `bun run lint:fix` | applies the mechanical fixes | rewrites formatting only |
| `bun run typecheck` | `tsgo --noEmit` | 0 errors |
| `bun run test` | Vitest, whole suite | all tests pass |
| `bun run build` | production build | succeeds |
| `bun run check:current-state` | re-derives the projection and compares fingerprints | no diff |
| `bun run gen:current-state` | regenerates `docs/CURRENT_STATE.md` | writes the projection |

Warnings are not tolerated. A warning is either fixed or converted into a
recorded, dispositioned finding — it is never left to accumulate.

## Evidence pipeline

| Command | What it does |
| --- | --- |
| `bun run evidence:run` | executes the checks and writes records to `evidence/` |
| `bun run evidence:verify` | evaluates applicability of the committed evidence set |

Applicability is decided by declared input-set hashes, not by comparing commit
strings. Generated outputs (`evidence/`, `dist/`, `docs/CURRENT_STATE.md`, the
current-state fingerprint) are excluded from every input set, so writing
evidence cannot invalidate the evidence just written.

Verification passing is not certification, conformance, or release readiness.

## Development

```sh
bun install
bun run dev
```

## Built with

TanStack Start, React, TypeScript, Tailwind CSS, Vitest.
