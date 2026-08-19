# Package completeness boundary

> Generated from `data/packages/governed-packages.json` by `scripts/gen-governed-package-docs.ts`. Do not edit by hand.
> A package summarizes governed state. It is not a register, it carries no authority, and it closes nothing.


## PKG-002 — v0.3.0

The v0.3.0 package consists of exactly three supplied files: the governed rewrite PDF, the control workbook, and the SHA-256 manifest. The DOCX and ZIP named by the earlier v0.2.0 manifest were not supplied for this rewrite, are not part of v0.3.0, and are not represented as available v0.3.0 artifacts. v0.3.0 is therefore not a complete copy of the earlier four-artifact package.

### Per-artifact limitations

**PKA-001 — `SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf`**

- The repository holds no binary-artifact retention convention, so no byte-identical copy is stored and no repository locator exists for this file.
- The external file carries an owner-name attribution on its cover; that attribution is not transcribed into repository records under the zero-real-PII boundary.
- Digest verification proves file identity only; it proves nothing about the accuracy of the narrative.

**PKA-002 — `SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx`**

- Not retained as a binary in the repository; registered by digest and governed external locator only.
- Workbook formulas recompute inside the workbook and are not executed by any repository validation.

**PKA-003 — `SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt`**

- The manifest declares no digest for itself; a self-hash would be circular, so its recorded digest is a measurement by this program and not a manifest claim.
- The manifest names no DOCX or ZIP for v0.3.0.

## PKG-001 — v0.2.0

The v0.2.0 manifest named a DOCX and a ZIP that were not supplied to this program for the v0.3.0 rewrite. Both are registered as NOT-SUPPLIED with no measured size, no digest, and no repository locator. No content of either file is inferred, quoted, or claimed.

### Per-artifact limitations

**PKA-101 — `v0.2.0 DOCX named by the prior manifest`**

- Not supplied, not read, not inferred. Its exact filename and digest are unknown to this program.

**PKA-102 — `v0.2.0 ZIP named by the prior manifest`**

- Not supplied, not read, not inferred. Its exact filename and digest are unknown to this program.
