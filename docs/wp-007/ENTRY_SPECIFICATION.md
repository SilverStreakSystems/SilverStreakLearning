# WP-007 — Historical Requirement Conformance Recovery: entry specification

Authority class: work-package entry record. Machine-verified only. No human, independent,
legal, security, accessibility, or district review has occurred.

## Entry authority

| Item | Verified state at entry |
|---|---|
| Governing program | SSLS-BPP-001 v2.0, ratified by DEC-007 |
| Software SSOT | Current Lovable-managed repository, adopted by DEC-010 |
| WP-038 | CLOSED BY OWNER under DEC-018 (2026-08-19) |
| WP-007 | NEXT ELIGIBLE by DEC-018, sequence-based not numerical |
| Gate A | OPEN — no accepted decision closes it |
| DEC-012 | ACCEPTED — WCAG 2.2 Level AA internal target, no conformance claim |
| Later superseding decision | none — DEC-018 is the most recent accepted decision |
| FND-016 | PARTIALLY RESOLVED by DEC-012 (named target only) |
| FND-010, FND-017, FND-018 | OPEN |
| FND-012, FND-014 | OPEN, unchanged |

Verification was performed by reading `src/fixtures/registers.ts` and `docs/CURRENT_STATE.md`
at commit `62ce7d3a9c305674de5bd83801af3bf5c41edf83` before any WP-007 artifact was written.

## Entry defect repaired before substantive work

The WP-038 handoff still carried a locator naming a work package that does not exist and is not
authorized. `docs/wp-038/HANDOFF_TO_WP-039.md` was renamed to `docs/wp-038/HANDOFF_TO_WP-007.md`,
and the active references in `docs/wp-038/README.md` and `scripts/gen-obligation-docs.ts` were
updated. Remaining occurrences of the string WP-039 are refusal statements — each says WP-039 is
not authorized — and are retained deliberately. Recorded as STL-006 and EV-030.

A second entry defect was found and repaired: FND-016's structured `resolutionState` still read
`unknown` while its recorded description carried the owner's PARTIALLY RESOLVED disposition. The
machine field was corrected to `partial`. No wording was changed and no portion of the finding
was closed.

## Cycle 1 locked target

By the end of this cycle, the founder_developer can inspect a canonical, machine-readable,
schema-validated historical-source register covering the defined repository source universe, with
every source assigned an evidence-backed authority classification, exact locator, version or hash
where available, access limitation, and recovery relevance, without promoting any historical
source into current authority.

## Method

The register is data-first, matching the WP-038 pattern: a JSON Schema at
`data/historical/HISTORICAL_SOURCE_SCHEMA.json`, canonical data at
`data/historical/historical-sources.json`, a filesystem loader used only by tests and the
generator, executing invariant tests, and a documentation projection under `docs/wp-007/`.
Locator, version, authority classification, access limitation, recovery relevance and promotion
state are independent dimensions and are never collapsed.

## Anti-targets held in this cycle

No bulk historical requirement extraction, no restoration of legacy code, no promotion of
historical authority, no rewriting of historical artifacts, no real personal data, no product
features or routes, no resolution of WP-008 authority conflicts, no gate or work-package closure,
no WP-039 work.
