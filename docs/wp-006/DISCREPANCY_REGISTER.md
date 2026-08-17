# WP-006 Discrepancy Register

Material disagreements between planes. No historical document was edited to remove a discrepancy.

---

## DSC-001 — Governing program register has no located text

- **Source A:** DEC-007 (repository, `src/fixtures/registers.ts`). Proposition: SSLS-BPP-001 v2.0 is
  the governing build program register and authorizes work packages under it.
- **Source B:** Drive corpus (568 nodes, four levels) and repository tree. Proposition: no artifact
  named SSLS-BPP-001, "Build Program Register", or equivalent exists in either plane.
- **Authority comparison:** DEC-007 is a current accepted decision and outranks absence of evidence,
  but a ratified register whose text cannot be produced cannot be applied or audited by a reviewer.
- **Current evidence:** repository-wide search; Drive enumeration to depth four.
- **Impact:** High. R-01…R-12, gate definitions, WP identifiers, and status enumerations are all
  cited from a document no reviewer can read.
- **Recommended disposition:** locate and mirror the register into the repository as the canonical
  copy, or author it as v2.0 text under owner ratification.
- **Decision required:** yes — DQ-R02-CAND.
- **Target WP:** WP-006 follow-on or the next foundation package.
- **Status:** open.

---

## DSC-002 — Two authority registers, different populations

- **Source A:** Drive `ASM-001 v1.0 Approved Active Source Manifest` plus `NSM-001` namespace map.
- **Source B:** In-app Authority Ledger (`/authority`, `src/fixtures/artifacts.ts`).
- **Authority comparison:** ASM-001 is owner-approved for Drive-side sources; the in-app ledger is a
  candidate model over shell artifacts. Neither governs the other.
- **Current evidence:** both inspected; no shared identifiers.
- **Impact:** Medium. A reviewer asking "what governs?" gets two different answers depending on plane.
- **Recommended disposition:** declare ASM-001 the authoritative source register and record the
  in-app ledger as a projection scoped to shell artifacts, or unify identifiers.
- **Decision required:** yes — DQ-R03-CAND.
- **Target WP:** WP-007.
- **Status:** open.

---

## DSC-003 — First-commit plan versus actual repository history

- **Source A:** FIRST-COMMIT-001 v0.1 and REPO-BOOT-001 v0.2 (Drive). Proposition: the controlled
  repository begins with a reviewed 12-file documentation-and-containment root commit, ratified by
  the owner before application code.
- **Source B:** Repository. Proposition: the root commit `3190f797` is a platform template scaffold
  (full dependency set and UI library), followed by 282 commits of application work, with no recorded
  first-commit ratification.
- **Authority comparison:** the Drive plan is candidate and was never ratified; DEC-007 later
  authorized work-package execution against the existing repository. Executable evidence establishes
  what happened; it does not retroactively authorize the deviation.
- **Current evidence:** `git log`, root commit stat, FIRST-COMMIT-001 text.
- **Impact:** Medium. Containment intent (no legacy ancestry, no legacy secrets) is met in substance;
  the review ritual was not performed.
- **Recommended disposition:** owner records either acceptance of the actual baseline as the
  controlled origin, or a remediation action; do not rewrite history either way.
- **Decision required:** yes — folded into DQ-R01.
- **Target WP:** WP-006 (evidence), owner decision.
- **Status:** open.

---

## DSC-004 — Accessibility standard version

- **Source A:** Repository. Proposition: work is governed by ULW-AS-001 v1.3.
- **Source B:** Drive `/10 …/07-accessibility/reference-materials/` holds both v1.3 and v1.4 PDFs.
- **Authority comparison:** no accepted decision names the effective version; presence of v1.4 in a
  folder does not promote it.
- **Current evidence:** Drive listing; repository citations.
- **Impact:** Medium. Acceptance criteria may be measured against a superseded standard.
- **Recommended disposition:** owner declares the effective version.
- **Decision required:** yes — DQ-R04-CAND.
- **Target WP:** WP-011.
- **Status:** open.

---

## DSC-005 — Gate taxonomy collision

- **Source A:** Drive Gate 0 (closed by OD-24) and Gate 1 (in progress, never closed).
- **Source B:** Program Gate A–D, under which WP-006 executes now.
- **Authority comparison:** OD-24 is owner-approved for its era; DEC-007 is current. Neither maps the
  taxonomies to each other.
- **Current evidence:** OD-24, G1-EXIT-001 v0.2, START HERE control posture, DEC-007.
- **Impact:** High. An open historical gate coexists with a proceeding current gate.
- **Recommended disposition:** owner records a gate-lineage decision.
- **Decision required:** yes — DQ-R05-CAND.
- **Target WP:** WP-006 follow-on.
- **Status:** open.

---

## DSC-006 — Drive control posture states no repository exists

- **Source A:** Drive `START HERE - SSLS Drive Map and Authority Boundary` (modified 2026-08-16).
  Proposition: "No repository, commit, containment result, or repository-proof record exists yet."
- **Source B:** Repository. Proposition: a private repository with root commit `3190f797` and 283
  commits exists, builds, and passes 210 tests.
- **Authority comparison:** the Drive map is explicitly a navigation aid, not a governance decision;
  executable evidence establishes existence.
- **Current evidence:** git inspection at HEAD; Drive document text.
- **Impact:** High for reviewer orientation; a reader starting from Drive is misinformed about the
  most basic current fact.
- **Recommended disposition:** update or supersede the Drive statement, referencing this manifest set
  as the current replacement. Preserve the original text.
- **Decision required:** no — factual update, owner-executed in Drive.
- **Target WP:** WP-006 follow-on.
- **Status:** open. Also recorded in `STALENESS_REGISTER.md` as STL-001.

---

## DSC-007 — Charter effectiveness not represented in the repository

- **Source A:** Drive. Proposition: GOV-001 v2.2 is effective through a controlled mirror; v2.3 is a
  stale candidate pending owner disposition.
- **Source B:** Repository. Proposition: no charter document exists in the tree; the in-app authority
  model does not reference GOV-001.
- **Authority comparison:** Drive is authoritative for the charter.
- **Current evidence:** Drive charter folder; repository search.
- **Impact:** Medium. The governing charter is invisible to anyone reading the code plane.
- **Recommended disposition:** mirror GOV-001 v2.2 into the repository with an explicit
  source → mirror marker, no promotion.
- **Decision required:** no, if executed as a marked mirror.
- **Target WP:** WP-007.
- **Status:** open.
