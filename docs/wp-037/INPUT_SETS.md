# Declared Input Sets

Implemented in `scripts/evidence/inputs.mjs`. An input set is a named collection of repository
paths, hashed as a sorted list of `[path, content hash]` pairs. Missing files hash as `MISSING`, so
deleting an input changes the hash rather than silently shrinking the set.

## Named sets

| Set         | Contents                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `source`    | `src/**` excluding test files                                                                                               |
| `tests`     | `*.test.ts`, `*.test.tsx`                                                                                                   |
| `config`    | `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `components.json`, `bunfig.toml` |
| `lockfile`  | Any recognised lockfile present                                                                                             |
| `manifest`  | `package.json`                                                                                                              |
| `routes`    | `src/routes/**`                                                                                                             |
| `pipeline`  | `scripts/evidence/**`                                                                                                       |
| `workflows` | `.github/workflows/**`                                                                                                      |
| `docs`      | `docs/**`, `.lovable/**`                                                                                                    |
| `tracked`   | Every git-tracked file, excluding the generated `evidence/` output                                                          |

`evidence/` is excluded from `tracked` for one reason: writing evidence must not invalidate the
evidence just written.

## Per-type declarations

| Evidence type           | Declared inputs                 | Reusable across commits |
| ----------------------- | ------------------------------- | ----------------------- |
| BUILD                   | source, config, lockfile        | yes                     |
| TEST                    | source, tests, config, lockfile | yes                     |
| TYPECHECK               | source, tests, config           | yes                     |
| LINT                    | source, tests, config           | yes                     |
| SSOT_BINDING            | docs, pipeline                  | no                      |
| SOURCE_PROVENANCE       | tracked                         | no                      |
| DEPENDENCY_INVENTORY    | manifest, lockfile              | yes                     |
| SBOM                    | manifest, lockfile              | yes                     |
| VULNERABILITY_SCAN      | manifest, lockfile              | yes                     |
| LICENSE_SCAN            | manifest, lockfile              | yes                     |
| SECRET_SCAN             | tracked                         | no                      |
| PII_BOUNDARY_SCAN       | tracked                         | no                      |
| ROUTE_INVENTORY         | routes                          | yes                     |
| BASELINE_MANIFEST       | tracked                         | no                      |
| CONFIGURATION           | config, workflows               | yes                     |
| ACCESSIBILITY_AUTOMATED | source, tests                   | yes                     |
| CUSTOM_VALIDATION       | source, tests, config           | yes                     |

## Consequence

A documentation-only commit leaves `source`, `tests`, `config`, and `lockfile` unchanged, so build
and test evidence stays applicable without being rebound. A one-line source change alters the
`source` hash, so that same evidence goes STALE immediately. Neither outcome requires a human to
edit a declared commit string.

## Stated limitation

Input sets are declared by this pipeline. A real dependency that the declaration omits would not be
detected as a change. The declarations are therefore part of the reviewable contract, and the
`pipeline` set is itself hashed so that changes to them are visible.
