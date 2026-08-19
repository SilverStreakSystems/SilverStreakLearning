# WP-007 cycle 2 source selection

> Generated from `data/historical/historical-requirements.json` by `scripts/gen-historical-requirement-docs.ts`. Do not edit by hand.
> Every record is a pre-disposition candidate. Nothing here is required now, satisfied, or accepted.


Sources extracted this cycle: HS-011 (exactly 1).

The owner named a verified August 5, 2026 clean-room v0.2 source as preferred if genuinely reachable. It is not reachable through the repository's governed source mechanism: the only clean-room packages recorded anywhere in the repository are the v0.15-v0.23 Drive ZIPs listed in docs/wp-006/DRIVE_REPOSITORY_AUTHORITY_MAP.md line 39, which are held under HS-018/HS-019, carry access_limitation NOT-ACCESSIBLE-TO-EXECUTOR and version_or_hash NOT-AVAILABLE, and whose import is recorded as prohibited. No repository artifact dated August 5, 2026 or versioned v0.2 exists as a requirement source, so no such source was opened, inferred, or simulated. The next highest-authority reachable HIGH-relevance source was selected: HS-011. Among reachable HIGH sources, HS-003 and HS-011 are both HISTORICAL-EVIDENCE while HS-006 is RESEARCH-INPUT and HS-005 is REFERENCE-ONLY; of the two HISTORICAL-EVIDENCE sources, HS-003 is a current-state report about the repository, whereas HS-011 is the only reachable source that carries adopted-standard normative requirement wording, which is the material this cycle exists to recover. HS-011 is recorded PARTIAL because only the repository-carried excerpt is reachable; that limitation is inherited by every record and no claim is made about the upstream full standard.

## Refused in this cycle

- multi-source extraction;
- opening, importing, or summarising unreachable Drive or prior-repository material;
- assigning REQUIRED-NOW, REMEDIATION, TARGET-STATE, UNNECESSARY or SUPERSEDED;
- asserting conformance, implementation, testing, release, or claimability;
- resolving WP-008 authority conflicts, closing WP-007, or advancing Gate A.
