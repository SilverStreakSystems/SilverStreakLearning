# Gate A Handoff Note — WP-006 to WP-037

Prepared at commit `9a257f754e97b9cddf9a474009c5947488102c04`, 2026-08-19.
This note takes effect only if WP-006 is owner-closed. WP-037 is not started here.

## Next eligible work package

**WP-037 — Evidence & Verification Pipeline**, eligible on owner closure of WP-006 and not before.

## Inputs WP-037 inherits

| Input | Where it lives | Condition on inheritance |
|---|---|---|
| Go-forward repository identity | `PROVENANCE_REPORT.md`, `REPOSITORY_MANIFEST.md` | Authoritative only once DEC-010 is accepted; until then it is a recommendation |
| Current baseline manifest | `SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md`, `BUILD_MANIFEST.md` | Candidate authority; bound to `9a257f7` |
| Evidence schema | `EVIDENCE_INDEX.md` plus the in-app evidence record shape | Method separation must be preserved: automated, document review, executor observation, independent |
| Binding lineage | EV-013 (`70c1f89`, stale), EV-014 (`6aa254e`, stale), EV-015 (guard), EV-016 (`9a257f7`, current), EV-017 (negative control) | Historical evidence is never rebound; only current summaries are |
| Binding-guard implementation | `scripts/ssot-binding.mjs`, `scripts/check-ssot-binding.mjs`, `.github/workflows/ssot-binding.yml`, `src/test/ssot-binding.test.ts` | Reuse rather than replace; the parser is the current contract for declaration forms |
| Semantic-freshness limitation | FND-013, `SSOT_BINDING_GUARD.md` | Open. WP-037 is the intended resolver |
| Declaration-drift limitation | FND-011 | Open. Expected to be dissolved by the split below rather than patched |
| CI enforcement limitation | FND-012 | Open, and not resolvable from repository content |
| Build and test commands | `bun run build`, `bun run test`, `bun run lint`, `bun run check:ssot-binding` | No build, test, or lint job currently runs in CI |
| Fixture posture | All fixtures synthetic, `synthetic` flags set; zero real PII | Non-negotiable boundary |
| Claims Register | `docs/trust/SSLS-GOV-002-claims-register-v0.1-CANDIDATE.md` | Permitted wording is exact; automated results never promote a claim |
| Current findings | FND-006…FND-014, `FINDINGS_REGISTER.md` | None closed by WP-006 |

## Recommended architecture for WP-037

Separate two record classes that WP-006 currently conflates in a single document set:

```text
IMMUTABLE EXECUTION EVIDENCE        CURRENT BASELINE MANIFEST
- bound permanently to the commit   - declares the commit it describes
  where it was produced             - regenerated, not hand-edited
- never rebound, never rewritten    - must be re-derived when it moves
- superseded, not replaced          - stale when unre-derived
```

With that split, an unrelated commit no longer forces a meaningless rebind of historical evidence,
and the freshness question becomes "was the manifest re-derived at this commit" — a machine-checkable
proposition, unlike the current string comparison.

## Explicitly not inherited

Authority to close a gate, to certify anything, to make a public claim, to introduce real data or a
backend, or to configure repository branch protection.
