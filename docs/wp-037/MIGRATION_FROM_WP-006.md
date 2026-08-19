# Migration from the WP-006 Binding Guard

## What the predecessor did

`scripts/ssot-binding.mjs` and `scripts/check-ssot-binding.mjs` parse a declared commit string out
of governed documents and compare it to repository HEAD. `.github/workflows/ssot-binding.yml` runs
that comparison, and `src/test/ssot-binding.test.ts` locks the parser contract.

That guard answered a narrow question correctly: does the document say it describes this commit. It
could not answer the question the operator actually has: are the figures inside the document still
true.

## What is retained

All of it. The guard is preserved, still runs, and is collected by the new pipeline as
`EV-SSOT-GUARD` with evidence type `SSOT_BINDING`. Its record states plainly that it supports only
whether bound documents declare the commit under review, and that it does not support semantic
freshness. In CI it runs with `continue-on-error: true`.

Nothing about the WP-006 documents is rewritten. Their bindings are historical evidence, and
historical evidence is never rebound.

## What changes

| Question | WP-006 answer | WP-037 answer |
|---|---|---|
| Is this evidence still valid? | Declared SHA equals HEAD | Declared input hashes unchanged, unexpired, unsuperseded, applicable environment |
| What happens on a docs-only commit? | Every bound document must be rebound by hand | Build and test evidence stays CURRENT; nothing is rebound |
| What happens on a one-line source change? | Rebinding the string makes it look fresh | Build and test evidence goes STALE immediately |
| Who keeps the baseline true? | A human editing declarations | `bun run evidence:run` regenerating it |
| Can the answer be "I don't know"? | No | Yes — `UNKNOWN` is a first-class state |

## Coexistence rule

Where the two disagree, applicability governs freshness and the declared-binding guard governs only
document self-declaration. Neither closes a gate, and neither promotes a claim.
