# Supply-Chain Evidence

Implemented in `scripts/evidence/supply-chain.mjs`. These collectors produce inventory and scanner
output. None of them produces a security or legal conclusion.

## Dependency inventory — `EV-DEPS`

Direct runtime and development dependencies with their declared ranges, plus the count of packages
resolved in `node_modules`, plus manifest and lockfile hashes. Supports: what is declared and what
resolved. Does not support: that the set is secure, minimal, or free of unused packages.

## Software bill of materials — `EV-SBOM`

CycloneDX 1.5 JSON at `evidence/artifacts/sbom/sbom.cdx.json`. One component per declared
dependency, carrying purl, resolved version, declared licence, and the originally declared range.
Components that cannot be resolved are emitted with version `UNKNOWN` and the record is marked
`review-required` rather than passing with a silent gap.

An SBOM is an inventory. It is not an assurance, and it is never cited as one.

## Vulnerability scan — `EV-VULN`

`bun audit --json` over the resolved dependency set, recorded with counts by severity and no risk
interpretation. The scan requires an external advisory feed. When the feed is unreachable the record
is written with status `not-completed` and the literal text
`SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE`. That is deliberately not a pass:
an unavailable scanner tells you nothing about your dependencies.

Stated limits: coverage is bounded by what the advisory source has published; absence of advisories
is not absence of vulnerability; a scanner result is not triage.

## Licence posture — `EV-LICENSE`

Declared licence strings read from resolved package metadata, classified into three postures:
commonly permissive, potentially restrictive (requires legal review), and unknown (requires legal
review). Anything not on the permissive list is routed to review rather than assumed benign.

The record states explicitly that it reaches no legal conclusion about compatibility, obligations,
or distribution rights. That determination requires qualified review, which has not occurred.
