# WP-007 source universe

> Generated from `data/historical/historical-sources.json` by `scripts/gen-historical-source-docs.ts`. Do not edit by hand.
> No source is promoted into current authority by appearing here.


## Boundary

WP-007 cycle 1 inventories the bounded source universe only: the current Lovable-managed repository adopted by DEC-010, the governance document families and machine registers it contains, the application registers, the historical bootstrap and prior-repository artifacts named in WP-006 provenance, and the externally held sources declared by the owner. Nothing outside this list is claimed to be complete, and no source is opened, copied, restored, or promoted by being inventoried. Repository-resident sources are bound to commit 62ce7d3a9c305674de5bd83801af3bf5c41edf83.

## Inventory

| ID | Source | Family | Exact locator |
| --- | --- | --- | --- |
| HS-001 | Current Lovable-managed SSLS repository | repository | `repository root at commit 62ce7d3a9c305674de5bd83801af3bf5c41edf83` |
| HS-002 | WP-000 exposure containment and trust document family | governance-document | `docs/trust/` |
| HS-003 | WP-006 current-state SSOT and provenance document family | governance-document | `docs/wp-006/` |
| HS-004 | WP-037 evidence and verification pipeline document family | governance-document | `docs/wp-037/` |
| HS-005 | WP-038 regulatory, standards and obligation baseline document family | governance-document | `docs/wp-038/` |
| HS-006 | Enterprise capability architecture document family | governance-document | `docs/capability-architecture/` |
| HS-007 | Shared enterprise object, context, work and evidence architecture | governance-document | `docs/shared-object/` |
| HS-008 | Enterprise value streams and operating workflow architecture | governance-document | `docs/value-streams/` |
| HS-009 | Command centers and workspace experience architecture | governance-document | `docs/workspaces/` |
| HS-010 | Brand visual system and experience template architecture | governance-document | `docs/design-system/` |
| HS-011 | ULW-AS-001 v1.3 accessibility acceptance contract as carried in this repository | governance-document | `docs/ACCESSIBILITY_ACCEPTANCE.md` |
| HS-012 | Foundation and traceability documents at the docs root | governance-document | `docs/ (root-level .md files, including FOUNDATION_AUTHORITY_MAP.md, TRACEABILITY_MODEL.md, FINDINGS.md)` |
| HS-013 | Canonical obligation and external-authority registers | machine-register | `data/governance/` |
| HS-014 | Immutable evidence records | machine-register | `evidence/records/` |
| HS-015 | Evidence baseline manifest and artifacts | machine-register | `evidence/baseline.json and evidence/artifacts/` |
| HS-016 | Application governance registers | application-register | `src/fixtures/registers.ts` |
| HS-017 | SSLS-FND-001 current-state SSOT candidate, commit-bound | governance-document | `docs/wp-006/SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md` |
| HS-018 | Prior repository and bootstrap artifacts named in WP-006 provenance | bootstrap-artifact | `named in docs/wp-006/DRIVE_REPOSITORY_AUTHORITY_MAP.md and docs/wp-006/REPOSITORY_CANDIDATE_COMPARISON.md; no reachable copy in this environment` |
| HS-019 | Owner-supplied external Drive folder | external-drive-folder | `https://drive.google.com/drive/folders/1ZfK6cXJhrD5l99sdWH9ComDzaOvmVzZG` |
| HS-020 | Build prompt and execution prompt inputs supplied through the operator session | chat-history | `operator session inputs: Build Prompts 001-005 and the WP-037, WP-038 and WP-007 execution prompts` |
| HS-021 | Published preview and production surfaces | external-service | `https://vision-trunk.lovable.app and the project preview URL` |
| HS-022 | Legacy SSLS 1.x application code | bootstrap-artifact | `not present in this repository; referenced historically in docs/wp-006/IMPLEMENTATION_INVENTORY.md` |
| HS-023 | SSLS 2.0 comprehensive clean-room rewrite v0.2.0 (August 5, 2026, historical), Section 11 accessibility | bootstrap-artifact | `owner-supplied historical input PKA-103 within PKG-001: SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf, Section 11 on printed pages 20-21` |
