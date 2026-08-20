import type { ClaimRecord, DecisionRecord, EvidenceRecord, FindingRecord } from "@/domain";

export const FINDINGS: FindingRecord[] = [
  {
    id: "FND-001",
    title: "Layer labels L0 through L7 describe eight layers, not seven",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"],
    description:
      "The classification is described as seven layers, but the labels L0 through L7 produce eight. The labels are preserved exactly as issued and the discrepancy is raised here instead of renumbering.",
    boundary:
      "This finding does not decide which reading is correct. It records the ambiguity for an operator decision.",
    resolutionState: "blocked",
    requiredDecision: "DEC-004",
    evidenceReferences: ["EV-004"],
    synthetic: false,
  },
  {
    id: "FND-002",
    title: "Core Beliefs Doctrine has no recorded content",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L0"],
    description:
      "L0 is referenced as the foundation for everything above it, but no doctrine text is recorded in the registry. Layers above it are therefore candidate by default.",
    boundary: "Does not assert the doctrine is wrong or missing in the operator's own thinking.",
    resolutionState: "unknown",
    requiredDecision: null,
    evidenceReferences: [],
    synthetic: false,
  },
  {
    id: "FND-003",
    title: "Capability ownership overlaps between assurance capabilities",
    severity: "structural",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L2"],
    description:
      "Evidence and Traceability, Validation and Quality Assurance, and Claims Governance each expect evidence ownership. The boundaries between them are not yet defined.",
    boundary: "Does not propose a resolution. The candidate registry is not authoritative.",
    resolutionState: "conflicted",
    requiredDecision: "DEC-005",
    evidenceReferences: [],
    synthetic: true,
  },
  {
    id: "FND-004",
    title: "No accessibility evidence beyond automated shell checks",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "Automated checks cover structure and keyboard behavior. Assistive-technology testing, zoom behavior at 200 percent, and human review have not been executed.",
    boundary:
      "Does not assert the interface is inaccessible. It records that verification has not happened.",
    resolutionState: "not-run",
    requiredDecision: null,
    evidenceReferences: ["EV-002", "EV-003"],
    synthetic: false,
  },
  {
    id: "FND-005",
    title: "Registry persistence is not established",
    severity: "advisory",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L6"],
    description:
      "All records in this pass are code-resident fixtures. No storage decision has been made, deliberately, to avoid building a database for a target-state model that is still candidate.",
    boundary: "Does not recommend a storage technology.",
    resolutionState: "not-applicable",
    requiredDecision: "DEC-003",
    evidenceReferences: [],
    synthetic: false,
  },
  {
    id: "FND-006",
    title: "Governing program register text cannot be located in either plane",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "DEC-007 ratifies SSLS-BPP-001 v2.0 as the governing build program register, but no artifact carrying that text exists in the repository or in the inspected document corpus. Work-package identifiers, gate definitions, and requirement labels are cited from a document no reviewer can read.",
    boundary:
      "Does not assert the program is invalid or that DEC-007 is defective. It records that the ratified text is not producible on demand.",
    resolutionState: "unknown",
    requiredDecision: "DEC-011",
    evidenceReferences: ["EV-008"],
    synthetic: false,
  },
  {
    id: "FND-007",
    title: "Gate lineage between the historical and current taxonomies is unresolved",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "A historical gate sequence closed its first gate and left its second gate open. The current program proceeds under a separately named gate. No accepted decision maps one taxonomy onto the other, so an open historical gate coexists with a proceeding current gate.",
    boundary: "Does not assert that either taxonomy is wrong, and does not rename either one.",
    resolutionState: "conflicted",
    requiredDecision: "DEC-013",
    evidenceReferences: ["EV-008"],
    synthetic: false,
  },
  {
    id: "FND-008",
    title: "Actual repository origin diverges from the never-executed first-commit plan",
    severity: "structural",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L6"],
    description:
      "A candidate plan specified a reviewed documentation-only first commit before any application code. The repository instead begins with a platform template scaffold followed by application work, with no recorded first-commit ratification. Containment intent is met in substance; the review step was not performed.",
    boundary:
      "Does not assert contamination. No legacy ancestry, committed secrets, or legacy backend bindings were found in the root commit. DEC-010 (2026-08-19) accepted the actual root commit as the controlled origin; the divergence is dispositioned, not cured, and the missing first-commit review step is not retroactively performed.",
    resolutionState: "confirmed",

    requiredDecision: "DEC-010",
    evidenceReferences: ["EV-009", "EV-010"],
    synthetic: false,
  },
  {
    id: "FND-009",
    title: "Document-plane control map states no repository exists",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L6"],
    description:
      "The controlling navigation map in the document plane states that no repository, commit, or containment result exists yet. A repository exists, builds, and passes its test suite. A reviewer starting from the document plane is misinformed about the most basic current fact.",
    boundary:
      "The statement was true when written. This finding marks a single proposition stale, not the document as a whole.",
    resolutionState: "stale",
    requiredDecision: null,
    evidenceReferences: ["EV-009"],
    synthetic: false,
  },
  {
    id: "FND-010",
    title: "Effective version of the interface acceptance standard is not declared",
    severity: "governance",
    raisedOn: "2026-08-17",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "Repository work cites version 1.3 of the interface acceptance standard while the document corpus also holds a later revision. No accepted decision names which revision is effective, so acceptance criteria may be measured against a superseded version. DEC-012 (accepted 2026-08-19) names WCAG 2.2 Level AA as the external internal target; it does not declare which ULW-AS-001 revision is effective, so this finding remains open and is routed forward.",
    boundary:
      "Does not assert that the interface fails either revision, and does not promote the later revision.",
    resolutionState: "conflicted",
    requiredDecision: null,

    evidenceReferences: ["EV-008"],
    synthetic: false,
  },
  {
    id: "FND-011",
    title: "Declared binding drifts from HEAD on every authoring commit",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "The current-state record and its three manifests declare one commit. The platform commits once per authoring turn, so the declared commit falls behind the head under review immediately after each re-bind, and the binding check reports mismatch until the documents are re-bound again. WP-037 disposition: RESOLVED — ORIGINAL FAILURE MODE SUPERSEDED BY THE INPUT-AWARE EVIDENCE MODEL. Applicability is now decided by declared input-set hashes, so a documentation-only commit leaves build, test, typecheck, SBOM, and dependency evidence CURRENT without any re-binding.",
    boundary:
      "This is declaration drift, not corrupted evidence. It does not assert that any captured figure was wrong at the commit where it was captured. The resolution applies to pipeline-produced evidence only: the predecessor declared-binding guard over WP-006 prose documents still compares commit strings and is retained for compatibility, so hand-bound legacy documents remain subject to the original drift.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-016", "EV-017", "EV-018", "EV-019"],
    synthetic: false,
  },
  {
    id: "FND-012",
    title: "Required-merge enforcement of the binding check is not verified",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "A workflow that runs the binding check exists in the repository. Whether the hosting platform requires that check to pass before a merge is a repository-settings fact that cannot be read from repository content, so merge enforcement is recorded as not verified. Re-affirmed under WP-037: the evidence pipeline workflow exists as a file and records 'REQUIRED MERGE ENFORCEMENT - NOT VERIFIED' in its own configuration provenance artifact.",
    boundary:
      "Does not assert that enforcement is absent. It records that its presence is unproven and may not be claimed. The existence of CI workflow files is not evidence of branch protection.",
    resolutionState: "not-verified",
    requiredDecision: null,
    evidenceReferences: ["EV-018", "EV-019"],
    synthetic: false,
  },
  {
    id: "FND-013",
    title: "Binding identity does not establish semantic freshness",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "The binding check compares a declared commit string against the commit under review. It cannot detect a document that declares the correct commit while carrying route counts, test counts, dependency counts, capability counts, or backend statements captured at an earlier one. WP-037 disposition: RESOLVED FOR MACHINE-DERIVED BASELINE FACTS; NARRATIVE SEMANTIC ACCURACY REMAINS HUMAN-GOVERNED. Repository identity, current commit, tracked/source/test/doc counts, route modules, dependency identity, evidence applicability, and evidence expiry are now regenerated from the tree on every run and are never hand-edited.",
    boundary:
      "Not a defect in the check, which does exactly what it declares. Hand-written prose in governance documents is still authored by a human and can still be semantically wrong at a correct commit; no automated control asserts otherwise.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-018", "EV-019"],
    synthetic: false,
  },
  {
    id: "FND-014",
    title: "Repository-wide lint does not pass",
    severity: "advisory",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L7"],
    description:
      "A full lint run reports 677 problems across the repository (663 errors, 14 warnings), overwhelmingly formatter differences rather than logic defects. The condition predates this work package and is recorded rather than absorbed into a claim that lint passes. Scoped separately under WP-037: the WP-037 files (scripts/evidence, src/domain/evidence-pipeline.ts, src/test/evidence-pipeline.test.ts, src/routes/evidence.tsx) report zero lint problems, so this work package contributes no new lint debt.",
    boundary:
      "No lint problem observed affects rendered behavior, accessibility markup, or the governance records. Formatting is not correctness. Repository-wide lint must not be reported as passing.",
    resolutionState: "unknown",
    requiredDecision: null,
    evidenceReferences: ["EV-018", "EV-019"],
    synthetic: false,
  },
  {
    id: "FND-015",
    title: "Five high-severity dependency advisories reported against the resolved dependency set",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L7"],
    description:
      "The WP-037 bounded recovery scan (EV-021) matched five high-severity advisories over the versions resolved in bun.lock: brace-expansion 1.1.16 (GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895), brace-expansion 5.0.8 (GHSA-rgw5-rvv9-x895), js-yaml 4.3.0 (GHSA-5p4m-2wfm-xmqj), and nanoid 3.3.16 (GHSA-2v37-7h3g-55p8). All five were transitive, none direct. Under DEC-016 each was triaged (EV-022) and remediated by minimum-necessary version pinning (EV-023): brace-expansion to 5.0.9, js-yaml to 4.3.1, nanoid to 3.3.18. A post-remediation scan against the same advisory source (EV-024) matched zero advisories, and full verification (EV-025) recorded no regression. Disposition: REMEDIATED.",
    boundary:
      "Remediation removes the five named advisories from the recorded dependency set at the recorded time and advisory source. It does not assert that the application is secure, that no other vulnerability exists, that reachability or exploitability were determined (both remain UNKNOWN for all five), or that any advisory source is complete.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-021", "EV-022", "EV-023", "EV-024", "EV-025"],
    synthetic: false,
  },
  {
    id: "FND-016",
    title: "ULW-AS-001 v1.3 is not bound to a named WCAG version and level",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L5", "L7"],
    description:
      "The accessibility acceptance contract adopted under DEC-001 names no WCAG version or conformance level, so its coverage against WCAG 2.2, and against the WCAG 2.1 Level AA target named by ADA Title II, cannot be stated. Recorded in WP-038 as STL-001. Disposition after DEC-012 (accepted 2026-08-19): PARTIALLY RESOLVED. The absent-target portion is resolved — WCAG 2.2 Level AA is now the named internal SSLS accessibility design and validation target. The remaining portions are unresolved: ULW-AS-001 v1.3 itself still carries no version binding in its own text, its criteria have not been mapped to WCAG 2.2 success criteria, coverage against ADA Title II's WCAG 2.1 Level AA reference is still unstated, and no independent accessibility validation exists.",
    boundary:
      "This does not assert that the interface fails any success criterion, nor that binding a version creates a conformance claim. DEC-012 fixes what may be measured, not what has been validated. The finding may not be closed on the strength of DEC-012 alone.",
    resolutionState: "partial",
    requiredDecision: null,
    evidenceReferences: ["EV-026"],
    synthetic: false,
  },

  {
    id: "FND-017",
    title: "The BEFORE LIVE PII gate assumes student data is the first binding trigger",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L4", "L6"],
    description:
      "The capability architecture gates controls on BEFORE LIVE PII, which reads as student personal information. Massachusetts narrow personal information, including operator payroll or payment data, may attach 201 CMR 17.00 duties before any student data exists, so the gate can fire later than the first real obligation. Recorded in WP-038 as STL-002.",
    boundary:
      "No such data exists in the current posture and none is proposed. This is a gate-wording defect, not an assertion that any obligation currently applies.",
    resolutionState: "unknown",
    requiredDecision: null,
    evidenceReferences: ["EV-026"],
    synthetic: false,
  },
  {
    id: "FND-018",
    title: "CycloneDX is named without a specification version",
    severity: "advisory",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L7"],
    description:
      "WP-037 supply-chain documentation names CycloneDX with no specification version, while ECMA-424 corresponds to CycloneDX 1.6 and OWASP v1.7 (October 2025) is not Ecma ratified. The emitted SBOM therefore cannot be checked against a declared target version. Recorded in WP-038 as STL-003.",
    boundary:
      "The SBOM was produced and is inspectable; this concerns the declared target version only, and asserts nothing about SBOM completeness or accuracy.",
    resolutionState: "unknown",
    requiredDecision: null,
    evidenceReferences: ["EV-026", "EV-027"],
    synthetic: false,
  },
  {
    id: "FND-019",
    title: "The WP-037 brace-expansion pin disabled the lint check",
    severity: "structural",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L7"],
    description:
      "The minimum-necessary pin recorded in EV-023 forced brace-expansion 5.0.9 on every consumer. minimatch 3.1.5, reached through the ESLint config-array, requires the 1.x default function export, so ESLint aborted with `TypeError: expand is not a function` and the pipeline recorded LINT as not-completed rather than review-required. The flat override was removed so semver resolves 1.1.18 for minimatch 3.1.5 and 5.0.9 for minimatch 10.2.6; both versions return no advisories, and lint executes again. Recorded in EV-029. Disposition: REPAIRED.",
    boundary:
      "Repair restores the ability to run the check. It does not make lint pass — FND-014 stands, now at 686 problems — and asserts nothing about the completeness of any advisory source. It also does not assert that flat overrides are safe in general; a future pin must be checked against every consumer's expected export shape.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-023", "EV-029"],
    synthetic: false,
  },
  {
    id: "FND-020",
    title:
      "Review and disposition WP-007 Cycle 3; authorize or decline the proposed bounded Cycle 4 extraction.",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "WP-007 Cycle 3 execution is complete and recorded in `docs/wp-007/CHECKPOINT-003.md`: the v0.3.0 package is registered as PKG-002, both declared digests were recomputed and matched, four drift rows are recorded unresolved, and the cycle closed nothing. The owner supplied the disposition on 2026-08-19 as DEC-019: Cycle 3 accepted as ACHIEVED, and Cycle 4 authorized as a single bounded cycle. The obligation this record carried is therefore discharged; the successor obligation to disposition Cycle 4 is FND-022.",
    boundary:
      "Discharge of this obligation records only that a disposition exists. It does not close WP-007, does not change Gate A, does not resolve any drift row, does not promote PKG-002, and authorizes nothing beyond the single bounded cycle DEC-019 names.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-033", "EV-034", "EV-035"],
    synthetic: false,
  },
  {
    id: "FND-021",
    title:
      "Supply the three authorized August 5 v0.2.0 inputs so WP-007 Cycle 4 can execute its locked target.",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "DEC-019 authorizes WP-007 Cycle 4 and names three required inputs: SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf, SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx, and SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt. None was present in the executor's supplied-input surface at entry (EV-037); only the already registered v0.3.0 artifacts were available. The locked Cycle 4 outcome requires cryptographic verification of those files and extraction from Section 11 of the v0.2.0 PDF, so neither package acquisition nor requirement extraction can be executed. Cycle 4 is therefore BLOCKED at entry, before any register edit. The owner-declared digests are held as declared values only and were not measured.",
    boundary:
      "This record states an input-availability blockage only. It does not decline or amend DEC-019, does not close or change WP-007, Gate A, or WP-039, does not register, verify, promote, or infer the content of any August 5 v0.2.0 artifact, does not create an HREQ candidate or a restatement relationship, and does not resolve or change FND-001 through FND-020 or PDR-001 through PDR-004.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-037", "EV-038", "EV-039"],
    synthetic: false,
  },
  {
    id: "FND-022",
    title:
      "Disposition WP-007 Cycle 4: sixteen new requirement candidates and seventeen cross-source restatement rows await owner review.",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "WP-007 Cycle 4 executed its locked target under DEC-019. The three authorized August 5 v0.2.0 inputs were supplied and each measured digest matched the declared value (EV-039); PKG-001 now carries PKA-103, PKA-104, and PKA-105 as verified, with the DOCX and ZIP still not supplied; HS-023 is registered as a historical source; HREQ-015 through HREQ-030 were extracted verbatim from Section 11 of the v0.2.0 PDF; and data/historical/restatement-index.json records seventeen relationships between the HS-023 and HS-011 candidates (EV-040). Every candidate remains CANDIDATE-PRE-DISPOSITION and NOT-ASSESSED, and every restatement row is a read relationship only. Only a recorded owner decision can dispose of a candidate, elect a controlling wording, or resolve a conflict.",
    boundary:
      "This record states an owner obligation that has been discharged by DEC-020. Discharge records that a disposition exists. It does not implement or assess any candidate, does not promote HS-023 or PKG-001, does not close WP-007, does not advance Gate A, does not authorize WP-039 or a further cycle, and asserts no accessibility conformance of any kind.",
    resolutionState: "confirmed",
    requiredDecision: null,
    evidenceReferences: ["EV-039", "EV-040", "EV-041", "EV-042"],
    synthetic: false,
  },
  {
    id: "FND-023",
    title: "Define a testable touch-target rule before HREQ-025 can be reconsidered for adoption.",
    severity: "governance",
    raisedOn: "2026-08-19",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1"],
    description:
      "DEC-020 disposed of HREQ-025 as NEEDS-EVIDENCE / DEFER: the historical wording 'touch targets appropriate to context' names no minimum dimension, no exceptions, and no verification method, so it cannot be tested as worded. The deferral is recorded in data/historical/fnd-022-owner-dispositions.json, which names what is required before reconsideration: a named touch-target dimension, the exceptions that apply to it, and a stated verification method. This record carries that open gap so it is not lost when FND-022 is discharged. DISCHARGED on 2026-08-20 by DEC-021: the named dimension, the exception set, and the verification method are recorded as TTR-001 v1.0.0 in data/accessibility/touch-target-rule.json, evidenced by EV-043. The prior text above is preserved unchanged.",
    boundary:
      "This record states an open evidence gap only. It does not adopt, reject, or reinstate HREQ-025, does not block the deferral, does not require any interface change, does not close or reopen WP-007 or Gate A, and asserts no accessibility conformance. Discharge records that the rule definition now exists. It does not run a target-size audit, does not classify any interface target, does not adopt or assess HREQ-025, which remains NEEDS-EVIDENCE / DEFER, and asserts no accessibility conformance of any kind.",
    resolutionState: "confirmed",
    requiredDecision: "DEC-021",
    evidenceReferences: ["EV-042", "EV-043"],
    synthetic: false,
  },
  {
    id: "FND-024",
    title:
      "The touch-target acceptance rule TTR-001 is defined but has never been executed against the interface.",
    severity: "governance",
    raisedOn: "2026-08-20",
    raisedBy: "Founder / Operator",
    affectedLayers: ["L1", "L7"],
    description:
      "DEC-021 records TTR-001 v1.0.0 with a 44 by 44 CSS pixel default, a 24 by 24 CSS pixel floor, five documented exceptions, and a deterministic audit protocol at 320, 768, and 1366 CSS pixels. The protocol's execution state is NOT-RUN. No route, component, or control in this build has been measured, classified, or recorded against the rule, so no target is PASS and no target is FAIL: every target is simply unmeasured. On 2026-08-20 a bounded execution attempt added audit-only tooling and then exceeded the execution ceiling before measuring any page; DEC-022 defers further execution until a stable user-facing product workflow exists. The attempt is recorded as ATTEMPT-001 in ABORTED-DEFERRED state and produced no audit artifact. This finding therefore remains OPEN and deferred, not closed.",
    boundary:
      "This record states an unrun verification only. It does not authorize an audit, a cycle, an interface change, or any remediation; it does not assert that the interface fails the rule; and it asserts no accessibility conformance. Only a recorded owner decision may authorize execution.",
    resolutionState: "blocked",
    requiredDecision:
      "Authorize a bounded execution of the TTR-001 verification protocol, or record that it stays unrun.",
    evidenceReferences: ["EV-043", "EV-044"],
    synthetic: false,
  },
];

export const EVIDENCE: EvidenceRecord[] = [
  {
    id: "EV-001",
    title: "Boundary statement rendered on every screen",
    kind: "manual-check",
    subject: "No personal data and synthetic-content boundary",
    collectedOn: "2026-08-17",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports: "The current posture is visible to the operator wherever they are in the workspace.",
    doesNotSupport: "Any statement about privacy compliance or handling of real data.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-002",
    title: "Automated shell behavior test suite",
    kind: "automated-test",
    subject: "Routes, headings, skip link, gating, and state rendering",
    collectedOn: "2026-08-17",
    collectedBy: "Automated run",
    state: "partial",
    supports: "Structural interface behavior that a test can observe in a simulated browser.",
    doesNotSupport:
      "Assistive-technology behavior, visual rendering, or accessibility conformance.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-003",
    title: "Assistive technology review",
    kind: "manual-check",
    subject: "Screen reader names, roles, states, and reading order",
    collectedOn: null,
    collectedBy: "Not assigned",
    state: "not-run",
    supports: "Nothing yet. The check has never been executed.",
    doesNotSupport: "Any accessibility conformance statement.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-004",
    title: "Foundation registry field coverage review",
    kind: "document-review",
    subject: "Registry records against the required field list",
    collectedOn: "2026-08-17",
    collectedBy: "Founder / Operator",
    state: "partial",
    supports: "That each record carries every required field.",
    doesNotSupport: "That the values in those fields are correct or complete.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-005",
    title: "Independent security assessment",
    kind: "external-validation",
    subject: "Platform security posture",
    collectedOn: null,
    collectedBy: "Not assigned",
    state: "not-authorized",
    supports: "Nothing. Outside the current authorized posture.",
    doesNotSupport: "Any security certification statement.",
    authorityClass: "gated-future",
    synthetic: false,
  },
  {
    id: "EV-006",
    title: "District pilot outcome record",
    kind: "external-validation",
    subject: "Use of the platform by a real district",
    collectedOn: null,
    collectedBy: "Not assigned",
    state: "not-applicable",
    supports: "Nothing. No district users exist in the current boundary.",
    doesNotSupport: "Any district validation statement.",
    authorityClass: "gated-future",
    synthetic: false,
  },
  {
    id: "EV-007",
    title: "Prior-build validation report",
    kind: "document-review",
    subject: "Pre-rebuild platform",
    collectedOn: "2026-05-12",
    collectedBy: "Founder / Operator",
    state: "stale",
    supports: "What was observed on a system that no longer exists.",
    doesNotSupport: "Anything about the current clean-slate rebuild.",
    authorityClass: "historical-evidence",
    synthetic: true,
  },
  {
    id: "EV-008",
    title: "Document-corpus enumeration and authority mapping",
    kind: "document-review",
    subject: "Governing document corpus, four levels deep",
    collectedOn: "2026-08-17",
    collectedBy: "Founder / Operator",
    state: "partial",
    supports:
      "Which governing artifacts exist in the document plane, how they map to repository artifacts, and where the two planes disagree.",
    doesNotSupport:
      "Completeness. Enumeration stopped at four levels, and artifacts outside the inspected corpus were not reachable.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-009",
    title: "Repository provenance inspection at the current baseline",
    kind: "manual-check",
    subject: "Repository origin, history, branch, and working-tree state",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That exactly one repository holds executable code, that its root commit is a platform template scaffold with no legacy ancestry, and that every intermediate state is recoverable.",
    doesNotSupport:
      "Anything about copies outside this project, or about repositories that were never located.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-010",
    title: "Build and test execution bound to the current baseline",
    kind: "automated-test",
    subject: "Production build and full test suite at the recorded commit",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the recorded commit builds and that its declared test suite passes in full at that commit.",
    doesNotSupport:
      "Correctness, accessibility conformance, security, or fitness for use. Executor-run, not independent.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-011",
    title: "Backend and data-surface absence check",
    kind: "manual-check",
    subject: "Database, migrations, authentication, storage, and external integrations",
    collectedOn: "2026-08-17",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That no database, migration, authentication surface, storage bucket, or live external integration exists in the current implementation.",
    doesNotSupport:
      "Any statement about future data handling, or about privacy compliance once real data is introduced.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-013",
    title: "Superseded SSOT binding — commit 70c1f89",
    kind: "document-review",
    subject: "The 2026-08-17 binding of SSLS-FND-001 and its provenance, build, and test manifests",
    collectedOn: "2026-08-17",
    collectedBy: "Founder / Operator",
    state: "stale",
    supports:
      "That the current-state record and its three manifests were bound to commit 70c1f89 with build and test evidence executed at that commit. It remains a valid historical statement about that commit only.",
    doesNotSupport:
      "Anything about the present state of the repository. This binding is superseded by EV-014 and must not be reported as current.",
    authorityClass: "historical-evidence",
    synthetic: false,
  },
  {
    id: "EV-014",
    title: "Superseded SSOT binding — commit 6aa254e",
    kind: "automated-test",
    subject: "Re-executed build and full test suite bound to SSLS-FND-001 and its three manifests",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "stale",
    supports:
      "That the current-state record, provenance report, build manifest, and test and build status all declared commit 6aa254e, and that a production build and 210 of 210 tests were executed at that commit. It remains a valid historical statement about that commit only.",
    doesNotSupport:
      "Anything about the present state of the repository. This binding is superseded by EV-016 and must not be reported as current.",
    authorityClass: "historical-evidence",
    synthetic: false,
  },
  {
    id: "EV-015",
    title: "Automated SSOT binding guard in continuous integration",
    kind: "automated-test",
    subject:
      "Merge-blocking check comparing each bound document's declared commit against the commit under review",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That an executable check exists which fails when a bound document declares a commit other than the one under review, and that a workflow runs it on push and on pull request using the pull-request head commit.",
    doesNotSupport:
      "That the bound figures are accurate, that merge protection requires this check, or that any record carries authority. It checks declared commit identity only; required-merge enforcement is not verified (FND-012) and semantic freshness is out of its scope (FND-013).",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-016",
    title: "Superseded SSOT binding and build and test evidence — commit 9a257f7",
    kind: "automated-test",
    subject:
      "Re-bound current-state record and its three manifests, with build, test, and lint executed at that source tree",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "stale",
    supports:
      "That the current-state record, provenance report, build manifest, and test and build status once declared commit 9a257f7; that the binding check reported PASS for that commit; that a production build succeeded and 217 of 217 tests passed across 9 files; and that a full lint run reported 683 problems, recorded as FND-014 rather than as a pass.",
    doesNotSupport:
      "Any statement about the present repository. Superseded by EV-018 and retained unrewritten as historical execution evidence.",
    authorityClass: "historical-evidence",
    synthetic: false,
  },
  {
    id: "EV-018",
    title: "Owner-authorization pass: decisions recorded and evidence re-executed — commit c1f0601",
    kind: "automated-test",
    subject:
      "DEC-010 and DEC-014 recorded as accepted, exit criteria reconciled, and the four bound documents re-bound with build, test, lint, and both binding-check controls re-executed",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That DEC-010 and DEC-014 are recorded as accepted owner decisions; that the current-state record, provenance report, build manifest, and test and build status all declare commit c1f0601; that the binding check reports PASS for that commit and exits non-zero for a commit no document declares; that a production build succeeded and 217 of 217 tests passed across 9 files; and that a full lint run reported 683 problems, recorded as FND-014 rather than as a pass.",
    doesNotSupport:
      "Correctness, accessibility conformance, security, compliance, release readiness, gate closure, or merge enforcement. It does not establish that any figure inside a bound document was captured at the declared commit. Executor-run, not independent, and no longer current once a further commit lands.",
    authorityClass: "current-summary",
    synthetic: false,
  },

  {
    id: "EV-017",
    title: "Negative control for the SSOT binding guard",
    kind: "automated-test",
    subject: "Failure path of the declared-binding check",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the check fails as designed: run against a commit no document declares, it exited 1 and reported every bound document in a textual mismatch state rather than passing silently. No governed record was altered to produce the failure.",
    doesNotSupport:
      "That the check blocks a real merge, which depends on repository settings that were not inspected.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-012",
    title: "Independent verification of the current-state record",
    kind: "external-validation",
    subject: "Every WP-006 provenance and status assertion",
    collectedOn: null,
    collectedBy: "Not assigned",
    state: "not-run",
    supports: "Nothing yet.",
    doesNotSupport:
      "All current-state evidence is executor-produced and self-verified. No independent party has reviewed it.",
    authorityClass: "gated-future",
    synthetic: false,
  },
  {
    id: "EV-019",
    title:
      "WP-037 evidence and verification pipeline implementation — producing run at commit 1f7c51e",
    kind: "automated-test",
    subject:
      "The evidence pipeline executed end to end: fourteen immutable execution records, a derived baseline manifest, an evidence index, and the verification gate",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That at commit 1f7c51e the pipeline produced fourteen evidence records with zero failures, two review-required results (repository lint at 730 problems, predecessor SSOT binding guard exit 1) and one not-completed result (vulnerability advisory feed unavailable); that a production build exited 0 and 254 of 254 tests passed across 10 test files; and that the baseline manifest was derived, not hand-written, from the ten declared input sets. The producing run is archived unmodified at evidence/runs/1f7c51e.",
    doesNotSupport:
      "Security, compliance, certification, accessibility conformance, release readiness, merge enforcement, or independent validation. It does not support the claim that no vulnerability exists, since the advisory feed did not respond. Executor-run, method automated, independent = false. This record stays bound to 1f7c51e and is never rebound to a later commit.",
    authorityClass: "historical-evidence",
    synthetic: false,
  },
  {
    id: "EV-020",
    title: "Public deployment reachability observation",
    kind: "document-review",
    subject: "The published Lovable surface at https://vision-trunk.lovable.app",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the published URL responded 200 over HTTPS; that its document title is 'Command Center | SSLS Foundation Shell'; that the footer states 'Not production ready, not district validated, not independently accessibility validated, not security certified'; and that the refused-claims surface renders production-ready, district-validated, legally-compliant, and security-certified as REFUSED. Observed classification: PUBLIC PROTOTYPE.",
    doesNotSupport:
      "Production readiness, release authorization, compliance, certification, pilot status, or independent validation. Publication is not release authority. It observes one fetch at one moment and asserts nothing about availability, uptime, or access control.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-021",
    title:
      "Dependency vulnerability scan — WP-037 bounded recovery pass against the npm bulk advisory service",
    kind: "automated-test",
    subject:
      "The 563 package versions resolved in bun.lock across 527 packages, queried against https://registry.npmjs.org/-/npm/v1/security/advisories/bulk",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That an authoritative advisory query completed with HTTP 200 over the resolved dependency set at manifest hash 35e8c7d4 and lockfile hash 591f5834, and returned five matched advisories, all severity high: brace-expansion 1.1.16 (GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895), brace-expansion 5.0.8 (GHSA-rgw5-rvv9-x895), js-yaml 4.3.0 (GHSA-5p4m-2wfm-xmqj), and nanoid 3.3.16 (GHSA-2v37-7h3g-55p8). The full raw response and per-finding detail are recorded at evidence/artifacts/vulnerability/advisory-recovery.json and hashed in evidence/records/EV-VULN-RECOVERY.json.",
    doesNotSupport:
      "Security, remediation, triage, exploitability, compliance, certification, or closure of any gate. It does not supersede EV-VULN, which remains a preserved failed attempt (bun audit, HTTP 404). Executor-run, method automated, independent = false. Matched advisories are unremediated and untriaged; the vulnerability criterion is not satisfied by the existence of this scan alone.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-022",
    title: "Advisory triage record — the five WP-037 high-severity findings",
    kind: "document-review",
    subject:
      "The five advisories matched by EV-021, triaged per-advisory before any dependency was changed",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That each advisory was recorded with its identifier, package, installed version, dependency path, direct/transitive status, severity, fixed version, affected behaviour, and remediation route before remediation began, and that reachability and exploitability were recorded UNKNOWN [U] for all five rather than inferred. All five are transitive: brace-expansion via minimatch under eslint and @typescript-eslint/typescript-estree, js-yaml via @eslint/eslintrc and xmlbuilder2, nanoid via postcss. The full triage table is at docs/wp-037/VULNERABILITY_TRIAGE.md.",
    doesNotSupport:
      "Security, exploitability, reachability, risk acceptance, independent security review, or closure of any gate. Triage is a classification of scanner output, not an assessment of the running system.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-023",
    title: "Dependency remediation — minimum-necessary version pinning under DEC-016",
    kind: "automated-test",
    subject: "package.json overrides and the regenerated bun.lock resolution graph",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That three override entries were added to package.json — brace-expansion 5.0.9, js-yaml 4.3.1, nanoid 3.3.18 — and that the resulting lockfile delta is exactly seven resolution changes and no others: brace-expansion 1.1.16 to 5.0.9, js-yaml 4.3.0 to 4.3.1, nanoid 3.3.16 to 3.3.18, balanced-match 1.0.2 to 4.0.4, removal of the duplicate brace-expansion 5.0.8 and its balanced-match 4.0.4 subtree, and removal of concat-map 0.0.1. No direct dependency version was changed, no framework was migrated, and no unrelated package was upgraded.",
    doesNotSupport:
      "That the changed packages are free of undiscovered defects, that pinning is permanent, or that any claim of security follows. Overrides constrain resolution; they do not audit code.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-024",
    title: "Dependency vulnerability rescan — WP-037 post-remediation pass",
    kind: "automated-test",
    subject:
      "The 560 package versions resolved in bun.lock across 526 packages after remediation, queried against https://registry.npmjs.org/-/npm/v1/security/advisories/bulk",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the advisory query completed with HTTP 200 over the post-remediation dependency set at manifest hash 9d672fbe and lockfile hash 38d150fa, and that no known dependency vulnerabilities were reported by the npm bulk advisory service (GitHub Advisory Database) against that recorded dependency set at 2026-08-19T06:13:46Z: zero matched advisories at every severity. The five advisories recorded in EV-021 are absent from this result. The raw response is at evidence/artifacts/vulnerability/advisory-recovery.json.",
    doesNotSupport:
      "That the application is secure, that no vulnerability exists, that the advisory source is complete, that undisclosed or future advisories are absent, or that any gate may close. It does not supersede EV-VULN, which remains a preserved failed attempt (bun audit, HTTP 404, still failing in this environment). Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-025",
    title: "Post-remediation regression verification",
    kind: "automated-test",
    subject: "Typecheck, test suite, production build, lint, and the regenerated evidence bundle",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That after remediation the typecheck reported zero errors, 254 of 254 tests passed across 10 files, the production build succeeded, and a full lint run reported 677 problems (663 errors, 14 warnings) against 683 before this work package — a reduction, with no new lint debt introduced. The evidence pipeline regenerated 15 records with fail=0, review-required=2 (lint, predecessor binding guard), not-completed=1 (bun audit), and baseline freshness CURRENT. Route inventory, SBOM component identity apart from the seven remediated resolutions, and licence posture are unchanged.",
    doesNotSupport:
      "Release readiness, security, compliance, accessibility conformance, or independent validation. A passing suite is evidence about the suite, not about the product.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-026",
    title: "External authority register built from cited primary sources",
    kind: "document-review",
    subject: "43 external authorities recorded in data/governance/external-authorities.json",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That 43 external authorities were recorded with an identifier, issuing body, citation, retrieval reference, and currency note, spanning federal student privacy, Massachusetts statute and regulation, accessibility standards, security and AI frameworks, and interoperability specifications. Six conflicts and five stale project references were recorded rather than resolved silently.",
    doesNotSupport:
      "That the interpretations are legally correct, complete, or current beyond their recorded retrieval date; that any obligation applies or is satisfied; or that legal, professional, or independent review has occurred. Research was AI-assisted and executor-recorded; independent = false.",
    authorityClass: "research-candidate",
    synthetic: false,
  },
  {
    id: "EV-027",
    title: "Obligation register integrity tests",
    kind: "automated-test",
    subject: "src/test/obligations.test.ts against the canonical registers under data/governance",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the obligation registers satisfy their declared schema, that identifiers are unique, that every obligation cites an authority present in the authority register, that applicability, control, and evidence states are held on independent axes, and that prohibited claim wording is absent from the register text.",
    doesNotSupport:
      "That any obligation is satisfied, that the applicability judgements are correct, or that the register is complete. A schema check is evidence about structure, not about legal substance.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-028",
    title: "Data-collection inspection of the current prototype surface",
    kind: "manual-check",
    subject: "Routes, server entry, forms, storage, analytics and cookie usage in the tracked tree",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That inspection of the tracked source found no personal-data collection path: no account system, no submission form persisting input, no analytics collection, and one first-party sidebar preference cookie. This is consistent with the recorded zero-PII boundary at the inspected commit.",
    doesNotSupport:
      "That the platform host collects nothing, that the boundary holds at any later commit, or that any privacy obligation is satisfied. Executor-run inspection; independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-029",
    title: "Lint regression repair and post-repair verification",
    kind: "automated-test",
    subject: "The brace-expansion resolution, ESLint execution, tests, build and advisory rescan",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That `bunx eslint . -f json` crashed with `TypeError: expand is not a function` (exit 2, no report emitted) while the flat override pinned brace-expansion to 5.0.9, because minimatch 3.1.5 requires the 1.x default function export; that removing the flat override lets semver resolve brace-expansion 1.1.18 for minimatch 3.1.5 and 5.0.9 for minimatch 10.2.6; that an advisory query for both versions returned no advisories; and that after the change lint completed with 686 problems (672 errors, 14 warnings), 279 of 279 tests passed, typecheck reported no errors, the production build succeeded, and the pipeline recorded fail=0, review-required=2, not-completed=1 with baseline CURRENT.",
    doesNotSupport:
      "That lint passes, that the repository is free of vulnerabilities, or that any advisory source is complete. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-030",
    title: "WP-038 handoff locator correction and residual WP-039 reference search",
    kind: "manual-check",
    subject: "Rename of docs/wp-038/HANDOFF_TO_WP-039.md and every active reference to it",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That `docs/wp-038/HANDOFF_TO_WP-039.md` was renamed in place to `docs/wp-038/HANDOFF_TO_WP-007.md`, that the active locators in `docs/wp-038/README.md` and `scripts/gen-obligation-docs.ts` were updated to the new filename, and that a repository-wide search for the string WP-039 afterwards returned only refusal statements — each asserting that WP-039 is not authorized — plus immutable lint evidence under `evidence/artifacts/`, which is never edited. Recorded as documentation lineage STL-006.",
    doesNotSupport:
      "That WP-039 exists, is planned, or is authorized; that the rename changes any authority; or that historical documents were rewritten. Executor-run, method manual plus repository search, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-031",
    title: "WP-007 historical-source universe register and invariant tests",
    kind: "automated-test",
    subject:
      "data/historical/ schema and register, loader, projection, and register-integrity tests",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That `data/historical/HISTORICAL_SOURCE_SCHEMA.json` v1.0.0 and `data/historical/historical-sources.json` exist and validate, that 22 sources across the declared bounded universe each carry an exact locator, version or hash, authority classification with basis, access limitation, immutability, recovery relevance with reason, promotion state, personal-data status and boundary, that executing tests in `src/test/historical-sources.test.ts` enforce those invariants, and that the documents under `docs/wp-007/` are projected from the register by `scripts/gen-historical-source-docs.ts`.",
    doesNotSupport:
      "That any inventoried source has been read, verified, or reproduced; that the universe is complete beyond its declared boundary; that unreachable sources contain anything in particular; or that any source gained authority by being recorded. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-032",
    title: "WP-007 cycle 2 historical requirement candidate schema, register and invariant tests",
    kind: "automated-test",
    subject:
      "data/historical/HISTORICAL_REQUIREMENT_SCHEMA.json, data/historical/historical-requirements.json, loader, projection, and extraction-integrity tests",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That a versioned historical-requirement schema v1.0.0 exists and matches the register; that 14 candidate requirements carrying stable HREQ-001..HREQ-014 identifiers were extracted from exactly one named HIGH-relevance reachable source, HS-011 (`docs/ACCESSIBILITY_ACCEPTANCE.md`); that every candidate carries an exact in-source line locator, verbatim original wording verified by substring match against the live source file, a separate normalized summary, the source's authority classification inherited without upgrade, a requirement family, the modality as worded, extraction confidence with basis and an ambiguity classification with note; that every candidate remains CANDIDATE-PRE-DISPOSITION and NOT-ASSESSED; and that executing tests in `src/test/historical-requirements.test.ts` enforce those invariants while `scripts/gen-historical-requirement-docs.ts` projects the register into `docs/wp-007/`.",
    doesNotSupport:
      "That any extracted statement applies now, is met, is owner-accepted, or has any implementation, testing, release or claimability meaning; that the upstream ULW-AS-001 v1.3 text is identical to the repository-carried excerpt; that extraction is complete across the source universe; or that any owner disposition has been assigned. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-033",
    title: "SSLS v0.3.0 governed package integrity verification and provenance registration",
    kind: "automated-test",
    subject:
      "data/packages/GOVERNED_PACKAGE_SCHEMA.json, data/packages/governed-packages.json, digest recomputation over the three owner-supplied v0.3.0 files, and src/test/governed-packages.test.ts",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the three owner-supplied files dated 2026-08-19 were received and measured; that SHA-256 recomputed by this program over `SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf` (123,284 bytes) is 9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943 and over `SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx` (21,520 bytes) is 68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e, each exactly matching the digest printed in `SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt`; that the manifest declares no digest for itself; that PKG-002 is registered as a NONCANONICAL SYNCHRONIZED-REFERENCE package containing exactly those three artifacts, with byte sizes, media types, acquisition method OWNER-SUPPLIED-INPUT, retention NOT-RETAINED-GOVERNED-EXTERNAL-LOCATOR and governed external locators; and that the predecessor package PKG-001 registers the v0.2.0 DOCX and ZIP as NOT-SUPPLIED with no size, no digest and no repository locator.",
    doesNotSupport:
      "That the package narrative is accurate, complete, reviewed, or independently validated; that a digest match validates content rather than file identity; that any byte-identical copy of a supplied file is retained in this repository; that the v0.3.0 package is a complete copy of the earlier four-artifact v0.2.0 package; or that registration promotes the package, closes a finding or work package, changes Gate A, or authorizes a successor package. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-034",
    title: "v0.3.0 package reconciliation against canonical repository truth",
    kind: "document-review",
    subject:
      "docs/packages/DRIFT_REGISTER.md, the decision, finding, work-package, historical-source and historical-requirement registers, and src/test/governed-packages.test.ts",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That every package-level assertion checked against the canonical registers was reconciled item by item, with the controlling authority named in each row: North Star, Gate A OPEN, WP-038 CLOSED BY OWNER, WP-007 ACTIVE, WP-039 NOT AUTHORIZED, DEC-007/DEC-010/DEC-012/DEC-017/DEC-018 accepted, WCAG 2.2 Level AA as an internal target only, FND-016 partial, FND-017 and FND-018 open, FND-019 repaired, 22 historical sources with three NOT-ACCESSIBLE-TO-EXECUTOR, HS-011 as the Cycle 2 extraction source, and 14 candidate requirements remaining CANDIDATE-PRE-DISPOSITION and NOT-ASSESSED; and that executing tests hold DEC-012, DEC-018, FND-016, FND-017, FND-018 and HREQ-001..HREQ-014 at those states.",
    doesNotSupport:
      "That the package text was reviewed in full, that unreconciled package statements are correct, that any repository value was adopted from the package summary, or that agreement between a package and a register creates authority, closes a finding, or validates either record. Executor-run, method document review, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-035",
    title: "Command Center and Action Center synchronization to the post-Cycle-3 program state",
    kind: "automated-test",
    subject:
      "src/domain/program-state.ts, src/fixtures/program.ts, data/packages/package-drift.json, src/lib/package-projection.ts, src/routes/index.tsx, src/routes/actions.tsx, and src/test/program-state.test.tsx",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the Command Center and the Action Center project gate state, active work package, latest checkpoint, pending owner disposition, governed-package authority role and canonical status, unresolved drift count, and checkpoint-bound verification from canonical structured registers rather than from component constants or narrative Markdown; that the four recorded drift rows are carried as structured records PDR-001..PDR-004 in `data/packages/package-drift.json` from which `docs/packages/DRIFT_REGISTER.md` is now generated; that the pending owner obligation is carried once, on FND-020 in the findings register, and appears exactly once in the Action Center; and that executing invariants hold Gate A open, WP-007 active, the owner disposition pending, PKG-002 NONCANONICAL, four drift rows unresolved, and no WP-039, release, production, certification, district-use, or compliance-conformance claim on either surface.",
    doesNotSupport:
      "That any owner disposition was supplied or inferred, that WP-007 or Gate A changed state, that any drift row was resolved, that PKG-002 was promoted, that Cycle 4 or WP-039 is authorized, or that a synchronized surface validates the state it reports. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-036",
    title:
      "Independent re-verification of the owner-resupplied v0.3.0 package against registered digests",
    kind: "automated-test",
    subject:
      "Owner-resupplied SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf, SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx, and SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt, compared against PKA-001, PKA-002, and PKA-003 in data/packages/governed-packages.json; pinned by src/test/governed-packages.test.ts.",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the three files resupplied by the owner on 2026-08-19 are byte-identical to the artifacts already registered under PKG-002: SHA-256 9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943 for the PDF, 68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e for the workbook, and 3a98382ee083b8aa3dd8f8182f14ef70b00617f62f356f43c4e817950ca7a130 for the manifest, which the manifest itself does not print because a manifest cannot hash itself; that no new, changed, or additional v0.3.0 artifact was supplied and therefore no second package record was created; and that an executing test now pins the registered digests to the literal manifest values, the three-file completeness boundary, and the absence of any fabricated repository locator.",
    doesNotSupport:
      "That the package gained authority, that any register, finding, requirement, gate, work package, or claim changed state, that a drift row was resolved, or that the retained-copy question was reopened. Executor-run, method automated, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-037",
    title: "WP-007 Cycle 4 entry verification and authorized-input availability check",
    kind: "manual-check",
    subject:
      "Repository entry state at the Cycle 4 authorization, and the availability of the three authorized August 5 v0.2.0 inputs named by DEC-019: SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf, SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx, and SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt.",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That entry verification was executed before any Cycle 4 edit: Gate A is OPEN, WP-038 is CLOSED BY OWNER, WP-007 is ACTIVE, WP-039 is NOT AUTHORIZED, and no later accepted decision supersedes DEC-019; that the next unused identifiers were confirmed as HREQ-015, HS-023, EV-037, and docs/wp-007/CHECKPOINT-004.md; and that none of the three authorized August 5 v0.2.0 inputs was present in the executor's supplied-input surface, which held only the already registered v0.3.0 PDF, workbook, and manifest.",
    doesNotSupport:
      "That any August 5 v0.2.0 digest was recomputed or verified, that any v0.2.0 artifact was acquired, registered, or read, that any requirement was extracted, or that any restatement comparison was performed. The owner-declared digests are recorded as declared values only and were not measured by this program. Executor-run, method manual availability check, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-038",
    title:
      "Third owner supply of the v0.3.0 package: digest re-measurement and forensic content reconciliation",
    kind: "manual-check",
    subject:
      "The three files supplied by the owner on 2026-08-19 at 19:29 UTC — SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf, SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx, and SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt — measured against PKA-001, PKA-002, and PKA-003, and read section by section and sheet by sheet against the canonical repository registers.",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the three supplied files measured 9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943, 68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e, and 3a98382ee083b8aa3dd8f8182f14ef70b00617f62f356f43c4e817950ca7a130, matching the two digests the manifest declares and the digests already registered under PKG-002, so the supply is byte-identical to the existing artifacts and no second package record was created; that all fourteen PDF sections and all eleven workbook sheets were read and reconciled against the canonical registers, with the agreeing propositions recorded in the reconciled list of data/packages/package-drift.json and the differing ones recorded as drift rows PDR-005 and PDR-006; and that the supplied set does not contain any August 5 v0.2.0 artifact, so the three inputs DEC-019 names for Cycle 4 remain unavailable and FND-021 remains open.",
    doesNotSupport:
      "That the package or any historical source gained authority or was promoted, that any requirement candidate was extracted or given a disposition, that any drift row was resolved, that any finding was closed, that Gate A, WP-007, or WP-039 changed state, or that Cycle 4's locked outcome was executed in any part. The v0.3.0 Section 10 accessibility text was not used as a substitute extraction source. Executor-run, method manual forensic read plus automated digest measurement, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-039",
    title: "August 5 v0.2.0 partial package: independent digest verification at Cycle 4 entry",
    kind: "manual-check",
    subject:
      "The three files supplied by the owner on 2026-08-19 — 03-SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf, 01-SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx, and 02-SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt — measured with sha256sum before any register edit and compared against the digests DEC-019 declares.",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That the PDF measured 2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044 at 787,831 bytes, the workbook measured f717dab3ad928ccd3bdcc96cf7b0054cc343edee276c4fbeb91063b4caf43dc1 at 36,546 bytes, and the manifest measured 914b65e39895cbd225cf1211df242bae3804fc4fd561483f78a92987413d09a8 at 491 bytes, each matching the value DEC-019 declares; that the PDF carries 38 printed pages and its Section 11 on printed pages 20-21 is titled Accessibility, matching the extraction surface DEC-019 authorizes; and that the artifacts are registered under PKG-001 as PKA-103, PKA-104, and PKA-105.",
    doesNotSupport:
      "That the v0.2.0 DOCX or ZIP named by the manifest were supplied, read, or verified — both remain NOT-SUPPLIED; that PKG-001 is complete; that the package or any artifact gained authority, was promoted, or became canonical; that the workbook was used as an extraction surface; or that any accessibility conformance follows. A digest match is a file-identity check only. Executor-run, method sha256sum plus pdftotext page inspection, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-040",
    title: "WP-007 Cycle 4 bounded extraction and cross-source restatement index",
    kind: "manual-check",
    subject:
      "Section 11 of PKA-103 on printed pages 20-21, read verbatim into requirement candidates, and those candidates read against the HS-011 candidates HREQ-001 through HREQ-014.",
    collectedOn: "2026-08-19",
    collectedBy: "Founder / Operator",
    state: "confirmed",
    supports:
      "That HS-023 is registered as a HISTORICAL-EVIDENCE source bound to the verified PDF digest; that every normative statement on printed pages 20-21 was extracted verbatim into HREQ-015 through HREQ-030, each carrying its source locator, inherited authority, modality as worded, extraction confidence, and ambiguity note; and that data/historical/restatement-index.json records seventeen rows — eleven relating an HS-023 candidate to an HS-011 candidate as RESTATES, NARROWS, or BROADENS, and six recording NEW where no counterpart was found — plus three HS-011 candidates left unmatched.",
    doesNotSupport:
      "That any candidate is required now, correct, current, satisfied, tested, or implemented; that any candidate received a disposition, a conformance state, or promotion; that any two wordings were merged, deduplicated, superseded, or ranked; that any conflict was resolved or any controlling wording elected; that any WCAG, ADA Title II, Section 508, or accessibility conformance claim is made; or that WP-007, Gate A, WP-039, PKG-001 completeness, or any drift row changed state. Executor-run, method manual verbatim extraction plus pairwise comparison, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-041",
    title: "WP-007 Cycle 5 FND-022 owner disposition packet construction and validation",
    kind: "automated-test",
    subject:
      "data/historical/fnd-022-owner-review.json and its generated projection docs/wp-007/FND-022_OWNER_DISPOSITION_PACKET.md, checked against the governed Cycle 4 registers.",
    collectedOn: "2026-08-19",
    collectedBy: "Automated run",
    state: "confirmed",
    supports:
      "That the packet presents each of the sixteen HS-023 candidates exactly once with its wording, source locator, digest binding, and current status copied unchanged from data/historical/historical-requirements.json; that all seventeen restatement rows are presented with their Cycle 4 classification and basis preserved unchanged; that the three unmatched HS-011 candidates are listed separately and are not counted among the rows; that every owner disposition and owner rationale field is null; that every item carries the same seven review options with none preselected; and that every executor recommendation is labelled NON-BINDING.",
    doesNotSupport:
      "That any disposition was recorded, implied, or preselected; that any candidate is required now, correct, current, satisfied, tested, or implemented; that any wording was merged, superseded, narrowed, rejected, or elected as controlling; that HS-023 or PKG-001 gained promotion or completeness; that FND-022, WP-007, or Gate A changed state; that WP-039 is authorized; or that any WCAG, ADA Title II, Section 508, or accessibility conformance claim is made. Executor-run, method schema-bound construction plus automated cross-register reconciliation, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-042",
    title: "WP-007 Cycle 6 FND-022 owner disposition recording and mechanical validation",
    kind: "automated-test",
    subject:
      "data/historical/fnd-022-owner-dispositions.json, the transcribed owner fields of data/historical/fnd-022-owner-review.json, and the regenerated projection docs/wp-007/FND-022_OWNER_DISPOSITION_PACKET.md, checked against the governed Cycle 4 registers and the two JSON Schema documents that bind them.",
    collectedOn: "2026-08-19",
    collectedBy: "Automated run",
    state: "confirmed",
    supports:
      "That the owner dispositions recorded in DEC-020 are transcribed for all sixteen candidates HREQ-015 through HREQ-030, all seventeen restatement rows RST-001 through RST-017, and all three unmatched HS-011 rows, with candidate totals of five RETAIN-HISTORICAL, three MERGE-OR-RESTATEMENT, seven ADOPT-AS-CANDIDATE, one NEEDS-EVIDENCE / DEFER and zero NARROW, SUPERSEDE, or REJECT; that every extracted wording, source identity, digest, locator, and Cycle 4 relationship classification is unchanged; that the review packet and the canonical disposition record agree item by item; and that the generated Markdown projection reproduces byte-identically from the JSON.",
    doesNotSupport:
      "That any candidate is implemented, satisfied, tested, or assessed; that HS-023 gained promotion or PKG-001 gained completeness; that EV-003 was run; that WP-007 or Gate A closed; that WP-039 or any further cycle is authorized; or that any WCAG, ADA Title II, Section 508, or accessibility conformance claim is made. Executor-run, method schema-bound transcription plus automated cross-register reconciliation, independent = false. Checks actually executed on 2026-08-19: full suite 381 of 381 tests across 18 files; focused disposition, review-packet, restatement and program-state suites 55 of 55; Draft 2020-12 schema validation of both changed structured artifacts; tsgo --noEmit clean; production build succeeded; eslint zero errors on all nine touched source files; repository-wide lint still reports 699 problems, the known FND-014 debt, down from 711 at entry; and three documentation generators rerun with no diff.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-043",
    title: "WP-007 Cycle 7 touch-target rule formalization and mechanical validation",
    kind: "automated-test",
    subject:
      "data/accessibility/touch-target-rule.json, its Draft 2020-12 schema data/accessibility/TOUCH_TARGET_RULE_SCHEMA.json, the generated projection docs/accessibility/TOUCH_TARGET_ACCEPTANCE.md, the derived section of docs/ACCESSIBILITY_ACCEPTANCE.md, and the governance registers that bind them.",
    collectedOn: "2026-08-20",
    collectedBy: "Automated run",
    state: "confirmed",
    supports:
      "That the touch-target acceptance rule TTR-001 v1.0.0 exists as one canonical structured record carrying a 44 by 44 CSS pixel SHOULD default, a distinct 24 by 24 CSS pixel MUST floor, exactly five documented exceptions of the types SPACING, EQUIVALENT-CONTROL, INLINE, USER-AGENT-CONTROL and ESSENTIAL each enumerated once, a compact-target departure band of 24 to 43 CSS pixels that cannot authorize a below-floor target, a below-floor route through a documented exception only, a deterministic verification protocol at 320, 768 and 1366 CSS pixels with five classifications and nine record fields, a mechanical 24 CSS pixel circle spacing check, the two cited W3C sources marked input-only, explicit non-claims, and change history bound to DEC-021; that the record validates against its schema and against the domain invariants; and that the generated Markdown projection reproduces byte-identically from the JSON.",
    doesNotSupport:
      "That any interface target-size audit ran; that any route, component, or control was measured, classified, or recorded as passing or failing; that HREQ-025 was adopted, assessed, implemented, or promoted, it remains NEEDS-EVIDENCE / DEFER; that EV-003 ran, it remains NOT-RUN; that WP-007 or Gate A changed state; that WP-039, Cycle 8, release, or deployment is authorized; or that any WCAG, ADA Title II, Section 508, legal, or independent accessibility conformance claim is made. Executor-run, method schema-bound authoring plus automated cross-register reconciliation, independent = false. Checks actually executed on 2026-08-20: full suite 405 of 405 tests across 19 files; focused touch-target suite 24 of 24; Draft 2020-12 schema validation of the new structured artifact; tsgo --noEmit clean; production build succeeded; eslint zero errors on every file touched by this cycle; repository-wide lint still reports 699 problems, the known FND-014 debt, unchanged from entry; and the documentation generator rerun with no diff.",
    authorityClass: "current-summary",
    synthetic: false,
  },
  {
    id: "EV-044",
    title:
      "Cycle 8 attempt disposition, derived current-state architecture, and reconciliation validation",
    kind: "automated-test",
    subject:
      "data/program/checkpoints.json, data/program/program-policy.json, src/domain/program-state-derivation.ts, the generated docs/CURRENT_STATE.md projection and its input fingerprint, and the governance registers that bind them.",
    collectedOn: "2026-08-20",
    collectedBy: "Automated run",
    state: "confirmed",
    supports:
      "That the WP-007 Cycle 8 audit attempt is recorded as ATTEMPT-001 in ABORTED-DEFERRED state and produced no audit artifact; that the program-state projection is computed from the decision, finding, evidence, and checkpoint registers rather than restated; that canonical current state is generated deterministically from a declared input manifest and verified by regeneration with no diff; and that the published surface is described as a public synthetic prototype that is not access-controlled.",
    doesNotSupport:
      "That any interface target-size audit ran; that any route, component, or control was measured or classified; that FND-024 is closed, it remains open and deferred; that EV-003 ran, it remains NOT-RUN; that HREQ-025 changed state; that WP-007 or Gate A changed state; that Cycle 9, WP-039, product implementation, a backend, or release is authorized; or that any WCAG, ADA Title II, Section 508, legal, or independent accessibility conformance claim is made. Executor-run, method automated cross-register reconciliation plus deterministic generation, independent = false.",
    authorityClass: "current-summary",
    synthetic: false,
  },
];

export const DECISIONS: DecisionRecord[] = [
  {
    id: "DEC-001",
    title: "Adopt ULW-AS-001 v1.3 as the interface acceptance contract",
    state: "accepted",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context:
      "Interface work needs a single binding accessibility contract that outranks visual preference.",
    decision:
      "ULW-AS-001 v1.3 governs interface acceptance within its declared scope. Where brand styling and the standard could conflict, the standard wins.",
    consequences: [
      "Brand expression is constrained by contrast, target size, and reflow requirements.",
      "No conformance claim follows from adoption alone.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["ULW-AS-001"],
    synthetic: false,
  },
  {
    id: "DEC-002",
    title: "Hold the nine-workspace operating model as gated target state",
    state: "accepted",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context:
      "The enterprise operating model is attractive to build early and would encode unvalidated structure.",
    decision:
      "The nine workspaces are displayed as gated candidates only. No workspace is implemented as working software in this pass.",
    consequences: [
      "Future Architecture is a read-only, clearly gated view.",
      "Promotion depends on a capability architecture that does not yet exist.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["FND-OPMODEL-001"],
    synthetic: false,
  },
  {
    id: "DEC-003",
    title: "Persistence approach for the foundation registry",
    state: "required",
    decidedOn: null,
    decidedBy: null,
    context:
      "Registry records are code-resident fixtures. Editing them requires a code change, which is acceptable for one operator but not beyond that.",
    decision: "Not yet decided.",
    consequences: [
      "Until decided, every registry change is a code change.",
      "No database is provisioned for target-state structures.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["FND-SHELL-001"],
    synthetic: false,
  },
  {
    id: "DEC-004",
    title: "Resolve the layer count and label discrepancy",
    state: "required",
    decidedOn: null,
    decidedBy: null,
    context:
      "The classification is called seven-layer while the labels L0 through L7 describe eight.",
    decision: "Not yet decided. Labels are preserved exactly as issued in the meantime.",
    consequences: ["Documentation continues to carry the discrepancy until resolved."],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["FND-SHELL-001"],
    synthetic: false,
  },
  {
    id: "DEC-005",
    title: "Assign evidence ownership across assurance capabilities",
    state: "pending",
    decidedOn: null,
    decidedBy: null,
    context: "Three candidate capabilities each expect ownership of evidence acceptance.",
    decision: "Pending capability architecture review.",
    consequences: ["Capability records remain candidate until ownership is settled."],
    authorityClass: "research-candidate",
    recordState: "candidate",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["FND-CAPREG-001"],
    synthetic: true,
  },
  {
    id: "DEC-006",
    title: "Build the target-state enterprise model in this pass",
    state: "superseded",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context: "Considered and rejected in favor of a bounded foundation shell.",
    decision:
      "Declined at the time of record. Superseded by DEC-007, which ratifies a governed build program under which target-state work proceeds only through authorized work packages.",
    consequences: [
      "Scope of the original pass stayed at the foundation shell.",
      "Target-state work is no longer refused outright; it is gated by DEC-007 work-package authorization.",
    ],
    authorityClass: "accepted-decision",
    recordState: "historical",
    supersedes: [],
    supersededBy: "DEC-007",
    relatedArtifacts: ["FND-OPMODEL-001"],
    synthetic: false,
  },
  {
    id: "DEC-007",
    title: "Ratify SSLS-BPP-001 v2.0 as the governing build program register",
    state: "accepted",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context:
      "Work packages were being issued against a build program that carried no ratification record, so no authority chain existed to authorize them. DEC-006 had declined target-state build outright, which is no longer the governing posture.",
    decision:
      "SSLS-BPP-001 v2.0 (SSLS Build Program Register) is ratified as the governing build program for this project. Work packages issued under it, beginning with WP-000 (Exposure Containment and Credential Remediation), are authorized work. Ratification authorizes execution only; it grants no conformance, validation, or public claim. DEC-006 is superseded: target-state work is permitted only through an authorized work package under this register, never by inference from a prompt.",
    consequences: [
      "WP-000 may be executed and its findings recorded against this authority chain.",
      "Every subsequent work package must name SSLS-BPP-001 v2.0 as its authorizing register.",
      "Founder/developer operator boundary holds: no live PII, no production data, no AI features.",
      "No readiness, conformance, or completion claim follows from ratification.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: ["DEC-006"],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "FND-OPMODEL-001"],
    synthetic: false,
  },
  {
    id: "DEC-008",
    title: "Owner closure of WP-000 exposure containment and credential remediation",
    state: "accepted",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context:
      "WP-000 was executed under DEC-007. Scans of the working tree, all refs, and full commit history found no real personal data and no exposed credential; no containment or rotation was triggered. That evidence is executor/self-verified and is not independent validation. The executor cannot close the gate, accept residual risk, decide precautionary rotation of the platform key, or declare independent verification.",
    decision:
      "WP-000 is closed on its current evidence package and the executor recommendation. This is an owner closure decision, not a technical certification. Precautionary rotation of CRED-001 is not required on the current evidence, and becomes required only if a new external fact establishes a plausible exposure path. The executor/self-verified limitation stands on the record and is not cured by this closure.",
    consequences: [
      "WP-000 status is OWNER CLOSED; Gate A may proceed to WP-006.",
      "Closure carries no security, privacy, legal, or compliance certification claim.",
      "Evidence remains executor/self-verified; independent validation is still absent.",
      "A new external fact indicating a plausible exposure path reopens WP-000 and the rotation question.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "SSLS-TRUST-001", "SSLS-GOV-002"],
    synthetic: false,
  },
  {
    id: "DEC-009",
    title: "Accept the bounded residual unknown on third-party and historical copies",
    state: "accepted",
    decidedOn: "2026-08-17",
    decidedBy: "Founder / Operator",
    context:
      "External caches, screenshots, shared links, prior repositories, and downstream forks cannot be enumerated from within the current Lovable project, and host access logs are unavailable. WP-000 records this as UNKNOWN rather than remediated.",
    decision:
      "The bounded residual UNKNOWN concerning third-party and historical copies is accepted for the present private, founder-only, zero-real-PII development phase. Acceptance bounds the risk; it does not resolve it and asserts nothing about what exists outside this project.",
    consequences: [
      "The claims 'all third-party copies were removed' and 'no external exposure ever occurred' remain prohibited.",
      "No breach or non-breach determination may be stated by anyone without qualified review.",
      "Acceptance is scoped to the current No-PII phase and lapses if real data, production use, or external distribution is introduced.",
      "New evidence indicating exposure reopens the issue.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-TRUST-001", "SSLS-GOV-002"],
    synthetic: false,
  },
  {
    id: "DEC-010",
    title: "Authorize the go-forward software source of truth and classify every other lineage",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "Exactly one repository holds executable code, with fully recoverable provenance to its root commit and a passing build and test suite. Its origin diverges from a candidate first-commit plan that was never executed, and other referenced lineages could not be located from inside this project. The executor recommended this adoption and could not close it.",
    decision:
      "The current Lovable-managed SSLS repository is adopted as the go-forward software source of truth. Historical repository and bootstrap artifacts remain historical governance and evidence lineage and do not control current executable implementation. Any subsequently discovered prior repository must be inventoried and explicitly dispositioned before use. The actual root commit is accepted as the controlled origin; the never-executed first-commit plan does not govern.",
    consequences: [
      "The current repository may be named the authorized source-code lineage in internal records.",
      "Historical lineages are evidence, not codebases; none may be used as an implementation source without an explicit disposition.",
      "A newly discovered prior repository is quarantined for forensic classification until dispositioned.",
      "The decision confers no security, privacy, accessibility, or compliance certification, authorizes no release or live data, and does not close a gate.",
      "Provenance evidence remains executor/self-verified; independent validation is still absent.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-FND-001"],
    synthetic: false,
  },
  {
    id: "DEC-011",
    title: "Locate or author the governing build program register text",
    state: "required",
    decidedOn: null,
    decidedBy: null,
    context:
      "The governing program register is ratified by reference, but no artifact carrying its text exists in either plane. Requirement labels, gate definitions, and work-package identifiers are cited from a document that cannot be produced.",
    decision:
      "Not decided. The owner must either locate the ratified text and mirror it as the canonical copy, or author it under explicit ratification. Routed to WP-008 (authority reconciliation) if not resolved sooner.",
    consequences: [
      "Until resolved, program citations cannot be independently checked.",
      "Ratification by reference remains in force; this does not invalidate the existing ratification decision.",
      "Open and non-blocking for WP-006 closure and WP-037 execution; blocking for gate closure.",
    ],
    authorityClass: "research-candidate",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-FND-001"],
    synthetic: false,
  },
  {
    id: "DEC-012",
    title: "Effective SSLS accessibility target",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "Implementation work cites ULW-AS-001 revision 1.3, which names no external accessibility version or conformance level, and SSLS references elsewhere name WCAG 2.1 Level AA as the current internal target. WP-038 raised FND-016 and prepared docs/wp-038/DEC-012-BRIEF.md.",
    decision:
      "ACCEPTED BY OWNER. Adopt WCAG 2.2 Level AA as the current internal SSLS accessibility design and validation target for new and actively governed implementation. This supersedes older SSLS references naming WCAG 2.1 Level AA as the current internal target; historical artifacts remain unchanged and retain their original version-bound wording. This establishes an internal engineering and accessibility requirement only. It does not establish WCAG 2.2 conformance, ADA compliance, Section 504 or Section 508 compliance, an independent accessibility review, an ACR or VPAT result, procurement acceptance, district approval, or certification of any kind. Automated, AI-assisted, or self-performed accessibility checks remain evidence only within their tested scope, and independent accessibility validation remains required at the applicable later gate. Where a verified external obligation requires a different or more specific standard, the verified external obligation controls that use case.",
    consequences: [
      "New and actively governed implementation is designed and self-tested against WCAG 2.2 Level AA as an internal target.",
      "No conformance, compliance, ACR, VPAT, procurement, or district-approval claim is created; independent validation remains required at the applicable later gate.",
      "FND-016 is partially resolved: the absence of a named target is closed, while coverage mapping, testing, stale references in ULW-AS-001 v1.3 itself, and independent validation remain unresolved.",
      "FND-010 is not resolved: which revision of the interface acceptance standard is effective remains undeclared and is routed forward.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["ULW-AS-001"],
    synthetic: false,
  },

  {
    id: "DEC-013",
    title: "Reconcile the historical and current gate taxonomies",
    state: "required",
    decidedOn: null,
    decidedBy: null,
    context:
      "A historical gate sequence left its second gate open. The current program proceeds under a separately named gate covering overlapping subject matter. No decision maps one taxonomy onto the other.",
    decision:
      "Not decided. The owner must state whether the current gate supersedes, incorporates, or runs independently of the open historical gate, and record the disposition of historical gate evidence. Routed to WP-008 (authority and gate-lineage reconciliation).",
    consequences: [
      "Until decided, the historical gate remains open and its evidence has no stated status under the current program.",
      "No statement may assert that the historical gate was completed.",
      "Open and non-blocking for WP-006 closure and WP-037 execution; blocking for gate closure.",
    ],
    authorityClass: "research-candidate",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-FND-001"],
    synthetic: false,
  },
  {
    id: "DEC-014",
    title: "Owner closure of WP-006 current-state SSOT and repository provenance",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "WP-006 was executed under DEC-007 following owner closure of WP-000. The reconciled exit-criteria matrix records eighteen criteria met, one not applicable, one explicitly NOT VERIFIED (repository branch-protection enforcement of the declared-binding check), and one blocked on an owner decision. That blocking criterion is resolved by DEC-010. All evidence is executor/self-verified.",
    decision:
      "WP-006 is closed on its current evidence package and the executor recommendation. WP-037 (Evidence and Verification Pipeline) becomes the next eligible work package and is not started by this decision. Recorded limitations are carried forward unchanged: declared-binding identity is not semantic freshness, and a workflow existing in the repository is not branch-protection enforcement.",
    consequences: [
      "WP-006 status is OWNER CLOSED; WP-037 is NEXT ELIGIBLE and not executed.",
      "Closure carries no security, privacy, accessibility, compliance, release, or readiness claim.",
      "FND-011 through FND-014 remain open and are inherited by WP-037.",
      "DEC-011, DEC-012, and DEC-013 remain open and are not resolved by this closure.",
      "Historical evidence records stay bound to the commits at which they were produced and are not rewritten.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-FND-001", "SSLS-BPP-001"],
    synthetic: false,
  },
  {
    id: "DEC-015",
    title: "Owner disposition of WP-037: HOLD, with one bounded evidence-recovery pass authorized",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "WP-037 was authorized as next eligible by DEC-014 under DEC-007 and the DEC-010 software SSOT. Executor verification recorded a passing build, a passing test suite, and a regenerated baseline, but the vulnerability criterion did not complete: bun audit returned HTTP 404 from its advisory endpoint. The executor recommended HOLD. This decision was prepared as a proposed closure and is revised here by the owner. It is not a waiver, not an exception, not a retroactive reinterpretation of the WP-037 exit criteria, and not a basis for closure.",
    decision:
      "WP-037 remains OPEN / HOLD and WP-038 remains NOT AUTHORIZED and must not begin. The vulnerability criterion remains PARTIAL / NOT COMPLETED: the bun audit 404 is a failed evidence-producing attempt, is preserved verbatim with its tool, timestamp, commit, and environment metadata, and may never be represented as a clean vulnerability result. No exit criterion may be weakened, inferred, reconstructed, or retroactively rewritten to permit closure; the absence of frozen Case 1 wording does not authorize the weaker interpretation, and no new exception is created to make a gate pass. One bounded evidence-recovery pass is authorized: inspect the package-manager and lockfile configuration, identify an authoritative advisory source compatible with the repository, execute one controlled scan, capture the complete raw result with tool, version, source, timestamp, commit, configuration, exit status, manifest, and hashes, register the result as new evidence without modifying EV-019, regenerate applicability, the evidence bundle, and the exit-criteria matrix, and verify internal consistency and hash integrity. The pass may not begin WP-038, add product functionality, alter declared inputs to avoid the failed scan, suppress, fabricate, substitute, or summarize away findings, treat unavailable advisory data as a pass, create a new closure rule, or self-close WP-037.",
    consequences: [
      "WP-037 is HOLD. WP-038 is NOT STARTED / NOT AUTHORIZED.",
      "EV-VULN is preserved exactly as produced: bun audit, HTTP 404, status not-completed. It is a failed attempt, not a clean result.",
      "The bounded recovery pass executed and completed against the npm bulk advisory service; it is recorded as new evidence EV-021 (pipeline record EV-VULN-RECOVERY) and returned five unremediated high-severity advisories. A completed scan is not closure: the criterion stays NOT COMPLETED until the findings are dispositioned under the frozen criteria by the owner.",
      "EV-019 remains permanently bound to commit 1f7c51e with independent = false; it is neither rebound nor relabelled, and the archived producing run is preserved.",
      "EV-020 and the publication boundary stand as recorded: PUBLIC PROTOTYPE only, with no production, district-ready, compliance, or certification claim, and existing refusal language intact.",
      "FND-012 remains OPEN / NOT VERIFIED. Branch-protection and merge enforcement remain unknown and may not be inferred from repository files, workflow configuration, or successful CI runs.",
      "FND-014 remains OPEN / ADVISORY. WP-037-controlled files introduce zero new lint debt; the repository-wide count is retained as existing debt and the repository is not characterized as lint-clean.",
      "DEC-011, DEC-012, and DEC-013 remain open and are not resolved by this decision.",
      "This decision creates no compliance, certification, security, accessibility-conformance, release, or independent-validation claim.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001"],
    synthetic: false,
  },
  {
    id: "DEC-016",
    title: "WP-037 vulnerability findings triage and bounded remediation authorization",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "DEC-015 recorded WP-037 as HOLD and authorized a single bounded evidence-recovery pass. That pass executed and returned five unremediated, untriaged high-severity advisories, which exhausted its authorization. The executor returned BLOCKED rather than self-authorizing a second pass. This decision supplies the missing authority.",
    decision:
      "Authorize one bounded sequence and nothing else: triage the five advisories, apply the minimum necessary dependency remediation, verify for regression, rescan, reconcile the evidence bundle and the frozen WP-037 exit matrix, and prepare a closure decision for owner disposition. DEC-016 supersedes DEC-015 only as current remediation authority; DEC-015 is preserved intact as the historical HOLD disposition and its constraints on evidence immutability, claim wording, and self-closure remain binding. The executor may not begin WP-038, may not close WP-037, may not perform unrelated upgrades or framework migrations, and must return any breaking or major upgrade as OWNER DECISION REQUIRED rather than applying it.",
    consequences: [
      "WP-037 remains open until a separate accepted owner decision closes it. WP-038 remains NOT STARTED.",
      "EV-VULN and EV-021 are preserved verbatim; remediation produces new records EV-022 through EV-025.",
      "A clean rescan supports only the wording recorded in CLM-013 and creates no security, compliance, or certification claim.",
      "FND-012 remains OPEN / NOT VERIFIED and FND-014 remains OPEN / ADVISORY.",
    ],
    authorityClass: "accepted-decision",
    recordState: "current",
    supersedes: ["DEC-015"],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001"],
    synthetic: false,
  },
  {
    id: "DEC-017",
    title: "Close WP-037 and authorize progression to WP-038",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "Under DEC-016 the five high-severity advisories reported by EV-021 were triaged (EV-022) and remediated by minimum-necessary pinning (EV-023). The post-remediation advisory scan completed and matched no advisories in its recorded scope at that point in time (EV-024); regression verification recorded no failure (EV-025). The pipeline is implemented and reproducible, immutable execution evidence is separated from current baseline state, and input-aware applicability is functioning.",
    decision:
      "ACCEPTED BY OWNER. WP-037 — Evidence & Verification Pipeline is CLOSED BY OWNER on the evidence produced through DEC-016 remediation. The closure recognises that FND-011 is resolved for pipeline-produced evidence with legacy residuals preserved; FND-013 is resolved for machine-derived baseline facts while narrative semantic accuracy remains human-governed; FND-012 remains OPEN / NOT VERIFIED because required branch-protection enforcement has not been evidenced; FND-014 remains OPEN / ADVISORY because repository-wide lint debt remains; bun audit remains unable to complete in this environment and that limitation is preserved unchanged; the vulnerability evidence is automated, point-in-time, and not independent security validation; and the published SSLS surface remains a PUBLIC PROTOTYPE, not a production release. Next eligible work package: WP-038 — Regulatory, Standards & Obligation Baseline. This decision authorizes generation and execution of WP-038 only. It does not close Gate A and does not authorize later work packages. It creates no security, privacy, accessibility, compliance, certification, district-readiness, or independent-validation claim.",
    consequences: [
      "WP-037 is CLOSED BY OWNER; WP-038 — Regulatory, Standards & Obligation Baseline is NEXT ELIGIBLE and authorized for generation and execution.",
      "Gate A remains open and work packages after WP-038 remain unauthorized.",
      "FND-012 and FND-014 remain open and are carried forward as limitations, not resolved by closure.",
      "The published surface remains classified PUBLIC PROTOTYPE; closure is not release authorization.",
    ],

    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001"],
    synthetic: false,
  },
  {
    id: "DEC-018",
    title: "Close WP-038 and authorize progression",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "WP-038 — Regulatory, Standards & Obligation Baseline is executor-complete under DEC-017 and its locked cycle target was achieved. The canonical registers under data/governance hold 43 primary-source-verified external authorities, 34 interpreted obligations, 6 conflicts, 5 stale references, 6 data-trigger classes, and 16 gaps, projected into docs/wp-038 and covered by executing register-integrity tests. 279 of 279 tests passed, typecheck and production build passed, the evidence pipeline completed with its review-required and unavailable checks preserved, lint executes again at 686 pre-existing problems, and the bun audit limitation remains disclosed.",
    decision:
      "ACCEPTED BY OWNER. WP-038 — Regulatory, Standards & Obligation Baseline is CLOSED BY OWNER on the machine-readable obligation baseline, verified authority register, findings, conflicts, stale-reference reconciliation, Claims Register controls, application-register propagation, executing tests, and registered evidence. Closure recognizes that WP-038 outputs are represented in the canonical application registers; that FND-016, FND-017 and FND-018 remain visible unless separately resolved against their exact propositions and evidence; that DEC-012 establishes WCAG 2.2 Level AA as the current internal accessibility target without creating a conformance claim; that the obligation baseline is a governed planning and engineering input and is not legal advice, certification, district approval, procurement approval, or proof of compliance; that public claims remain constrained by the Claims Register; that the founder-only, private, no-PII, synthetic-data boundary remains in force; and that the FND-019 / EV-029 dependency repair is bounded technical evidence, not independent security validation. Next eligible work package, subject to verification that no later accepted decision supersedes the current Build Program sequence: WP-007 — Historical Requirement Conformance Recovery. Numerical order does not confer authority; WP-039 is not authorized.",
    consequences: [
      "WP-038 is CLOSED BY OWNER; WP-007 — Historical Requirement Conformance Recovery is NEXT ELIGIBLE.",
      "Gate A remains open. Closure is not release authority and authorizes no work package other than the one named.",
      "Adoption of the obligation baseline creates no compliance, legal, conformance, certification, district-readiness, or independent-review claim, and no obligation is asserted to be satisfied.",
      "FND-016 (partially resolved by DEC-012), FND-017 and FND-018 remain open and are carried forward as limitations; FND-012 and FND-014 are unchanged.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001"],
    synthetic: false,
  },
  {
    id: "DEC-019",
    title: "Accept WP-007 Cycle 3 and authorize WP-007 Cycle 4 only",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "WP-007 Cycle 3 executed the v0.3.0 governed package integration and synchronization recorded in docs/wp-007/CHECKPOINT-003.md, and a re-verification pass at entry HEAD 3955257 established that the owner-resupplied v0.3.0 PDF, workbook, and manifest were byte-identical to the already registered PKA-001, PKA-002, and PKA-003. No duplicate package was created and no canonical register value changed. The owner supplied a disposition on 2026-08-19 together with an authorization for a single bounded successor cycle.",
    decision:
      "ACCEPTED BY OWNER. WP-007 Cycle 3 is accepted as ACHIEVED against its locked package-identity and inspectability target only. WP-007 Cycle 4 — August 5 v0.2.0 Partial Historical Package Acquisition, Bounded Accessibility Requirement Extraction, and Cross-Source Restatement Index — is authorized, and only that cycle is authorized. Acceptance does not close WP-007, does not close Gate A, does not authorize WP-039, does not promote v0.3.0 to canonical authority, does not resolve PDR-001 through PDR-004, and does not resolve or close FND-010, FND-012, FND-014, FND-016, FND-017, FND-018, or any other finding. It expands no accessibility, security, privacy, compliance, or release claim and authorizes no deployment, publication, district use, personal data, or AI product capability.",
    consequences: [
      "WP-007 remains ACTIVE; Gate A remains OPEN; WP-039 remains NOT AUTHORIZED.",
      "Cycle 4 is authorized as scoped and is bounded to the named August 5 v0.2.0 inputs and to Section 11 — Accessibility of the authorized v0.2.0 PDF.",
      "FND-020 carries a proposition broader than Cycle 3 review alone, so under the owner's own instruction it is neither closed nor rewritten by this decision; its lineage is preserved unchanged.",
      "No historical source is promoted, no HREQ receives an owner disposition, and no finding is closed by this decision.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "WP-007"],
    synthetic: false,
  },
  {
    id: "DEC-020",
    title:
      "Record the FND-022 owner disposition matrix for the WP-007 Cycle 4 historical candidates",
    state: "accepted",
    decidedOn: "2026-08-19",
    decidedBy: "Founder / Operator",
    context:
      "WP-007 Cycle 5 assembled the sixteen HS-023 candidates HREQ-015 through HREQ-030, the seventeen cross-source restatement rows RST-001 through RST-017, and the three unmatched HS-011 rows into the schema-bound review packet recorded as EV-041, with every owner field null. The owner authorized one bounded Cycle 6 disposition pass covering all three sets and supplied the decisions verbatim.",
    decision:
      "RECORDED BY OWNER. The complete disposition matrix is transcribed to data/historical/fnd-022-owner-dispositions.json and projected into data/historical/fnd-022-owner-review.json and docs/wp-007/FND-022_OWNER_DISPOSITION_PACKET.md. Candidates: RETAIN-HISTORICAL for HREQ-015, HREQ-017, HREQ-019, HREQ-023, and HREQ-027; MERGE-OR-RESTATEMENT for HREQ-016, HREQ-022, and HREQ-026, recording lineage to the controlling current requirements and creating no duplicate active requirement; ADOPT-AS-CANDIDATE for HREQ-018, HREQ-020, HREQ-021, HREQ-024, HREQ-028, HREQ-029, and HREQ-030, each remaining a candidate and NOT-ASSESSED; NEEDS-EVIDENCE / DEFER for HREQ-025. Rows RST-001 through RST-017 carry the conclusions the owner stated, with every Cycle 4 classification preserved. The three unmatched HS-011 rows HREQ-005, HREQ-013, and HREQ-014 carry NO-ACTION-CURRENT-STANDS and keep their current authority unchanged. This decision closes neither WP-007 nor Gate A, authorizes neither WP-039 nor any Cycle 7, implements nothing, promotes nothing, and makes no accessibility, security, legal, district-readiness, or release claim.",
    consequences: [
      "FND-022 is discharged; the obligation it carried is recorded as decided, evidenced by EV-042.",
      "The seven ADOPT-AS-CANDIDATE outcomes remain candidates that are NOT-ASSESSED and NOT-IMPLEMENTED; adoption states intent to govern the wording, not that the build satisfies it.",
      "The deferred touch-target gap behind HREQ-025 is carried forward as FND-023 and remains open.",
      "HS-023 remains NOT-PROMOTED, PKG-001 remains PARTIAL with the DOCX and ZIP not supplied, and EV-003 remains NOT-RUN.",
      "WP-007 remains ACTIVE; Gate A remains OPEN; WP-039 remains NOT AUTHORIZED; no successor cycle is authorized.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "WP-007"],
    synthetic: false,
  },
  {
    id: "DEC-021",
    title: "Record the SSLS touch-target acceptance rule that resolves the FND-023 definition gap",
    state: "accepted",
    decidedOn: "2026-08-20",
    decidedBy: "Founder / Operator",
    context:
      "DEC-020 deferred HREQ-025 because the historical wording 'touch targets appropriate to context' names no dimension, no exceptions, and no verification method. FND-023 carried that gap forward as the single open obligation. The owner authorized exactly one bounded WP-007 Cycle 7 to define an internally testable rule, using the W3C WCAG 2.2 specification and the Understanding document for Success Criterion 2.5.8 as inputs only.",
    decision:
      "RECORDED BY OWNER. The SSLS touch-target acceptance rule is recorded as TTR-001 v1.0.0 in data/accessibility/touch-target-rule.json. Author-controlled standalone pointer targets SHOULD provide at least 44 by 44 CSS pixels; existing stricter adopted requirements continue to control. Every visible, enabled pointer target MUST provide at least 24 by 24 CSS pixels or satisfy exactly one documented exception of type SPACING, EQUIVALENT-CONTROL, INLINE, USER-AGENT-CONTROL, or ESSENTIAL. A standalone author-controlled target between 24 by 24 and 43 by 43 CSS pixels is a departure from the default, acceptable only with a recorded compact-context rationale, and still bound by the 24 by 24 floor. A target below 24 by 24 CSS pixels cannot pass on a compact-context rationale and passes only through one documented exception. A deterministic verification protocol is defined at 320, 768, and 1366 CSS pixels and is NOT-RUN. This decision defines a rule only. It implements nothing, audits nothing, adopts nothing, closes neither WP-007 nor Gate A, authorizes neither WP-039 nor any Cycle 8, and makes no accessibility, WCAG, ADA, Section 508, legal, district-readiness, or release claim.",
    consequences: [
      "FND-023 is discharged; the definition gap it carried is recorded as resolved, evidenced by EV-043. Its prior text is preserved unchanged.",
      "HREQ-025 is unchanged and remains NEEDS-EVIDENCE / DEFER, NOT-ASSESSED, NOT-PROMOTED, and NOT-IMPLEMENTED; its historical wording is not rewritten and not adopted.",
      "The verification protocol is defined and NOT-RUN. No interface target has been measured or classified, so the interface is unmeasured rather than passing; that unrun state is carried as FND-024.",
      "EV-003 remains NOT-RUN, HS-023 remains NOT-PROMOTED, and PKG-001 remains PARTIAL.",
      "WP-007 remains ACTIVE; Gate A remains OPEN; WP-039 remains NOT AUTHORIZED; no successor cycle is authorized.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "WP-007", "TTR-001"],
    synthetic: false,
  },
  {
    id: "DEC-022",
    title:
      "Defer further execution of the TTR-001 touch-target audit and preserve the partial runner as dormant tooling",
    state: "accepted",
    decidedOn: "2026-08-20",
    decidedBy: "Founder / Operator",
    context:
      "DEC-021 defined TTR-001 v1.0.0 and left its verification protocol NOT-RUN, carried as FND-024. A bounded Cycle 8 execution attempt added audit-only tooling under scripts/accessibility/ and a playwright-core development dependency, but the browser run exceeded the execution ceiling before any page was measured and was stopped. No audit artifact, target measurement, classification, finding, or checkpoint was produced.",
    decision:
      "RECORDED BY OWNER. Further execution of the TTR-001 verification protocol is deferred until a stable user-facing product workflow exists. The partial runner and its git history are preserved as dormant, incomplete development tooling. It is not an executed audit, a validation, an evidence record, an accessibility result, or a conformance basis. The attempt is recorded as ATTEMPT-001 in ABORTED-DEFERRED state and is not a checkpoint. This decision defers execution only: it closes no finding, closes no work package, closes no gate, produces no audit result, authorizes no interface remediation, and authorizes no release. It does not erase the prior Cycle 8 authorization or the engineering attempt made under it.",
    consequences: [
      "FND-024 remains open as an acknowledged, deferred limitation. It is not closed, and no target is recorded as passing or failing.",
      "TTR-001 remains NOT-RUN. EV-003 remains NOT-RUN. HREQ-025 remains NEEDS-EVIDENCE / DEFER.",
      "Accessibility, WCAG, ADA Title II, Section 508, legal, district-readiness, conformance, and release claims remain refused.",
      "The canonical current state becomes a deterministic projection of the controlling registers and repository facts; the commit-bound WP-006 current-state documents are retained as historical records and are marked superseded.",
      "The program-state projection is derived from the controlling registers; it no longer restates them.",
      "The published surface is labelled truthfully as a public synthetic prototype that is not access-controlled and not released. Making it private or unpublishing it stays a manual owner action.",
      "WP-007 remains ACTIVE; Gate A remains OPEN; WP-039, Cycle 9, product implementation, backend, authentication, AI, and real personal data remain unauthorized.",
    ],
    authorityClass: "current-summary",
    recordState: "current",
    supersedes: [],
    supersededBy: null,
    relatedArtifacts: ["SSLS-BPP-001", "WP-007", "TTR-001", "ATTEMPT-001"],
    synthetic: false,
  },
];

export const CLAIMS: ClaimRecord[] = [
  {
    id: "CLM-001",
    claim: "A foundation shell is implemented within a governed proof scope.",
    posture: "supported",
    state: "confirmed",
    reason: "The routes, registries, and components in this pass are directly inspectable.",
  },
  {
    id: "CLM-002",
    claim: "This software is production ready.",
    posture: "refused",
    state: "refused",
    reason: "No release authority, no operations, no production data path.",
  },
  {
    id: "CLM-003",
    claim: "This software is district validated.",
    posture: "refused",
    state: "refused",
    reason: "No district users, no pilot, no district evidence.",
  },
  {
    id: "CLM-004",
    claim: "This software is legally compliant.",
    posture: "refused",
    state: "refused",
    reason: "No legal review has been performed and none is authorized in this posture.",
  },
  {
    id: "CLM-005",
    claim: "Accessibility conformance has been independently validated.",
    posture: "refused",
    state: "refused",
    reason:
      "The accessibility standard is applied as an acceptance contract. No independent validation exists.",
  },
  {
    id: "CLM-006",
    claim: "Security has been certified.",
    posture: "refused",
    state: "refused",
    reason: "No assessment has been performed and none is authorized in this posture.",
  },
  {
    id: "CLM-007",
    claim: "The enterprise capability registry is complete.",
    posture: "refused",
    state: "refused",
    reason: "Only a small candidate slice exists, explicitly labeled as candidate.",
  },
  {
    id: "CLM-008",
    claim:
      "SSLS has an automated evidence pipeline that binds execution evidence to defined implementation inputs and evaluates current evidence applicability.",
    posture: "supported",
    state: "confirmed",
    reason:
      "The pipeline in scripts/evidence produces immutable execution records with declared input-set hashes, and the verification gate reports CURRENT, STALE, EXPIRED, SUPERSEDED, INAPPLICABLE, or UNKNOWN per record. Evidenced by EV-019 and 37 pipeline test cases.",
  },
  {
    id: "CLM-009",
    claim: "Evidence in this repository is always current.",
    posture: "refused",
    state: "refused",
    reason:
      "Evidence is current only while its declared inputs are unchanged and its expiry has not passed. Records go STALE, EXPIRED, or UNKNOWN by design.",
  },
  {
    id: "CLM-010",
    claim:
      "Merge protection is active and governance compliance is proven by continuous integration.",
    posture: "refused",
    state: "refused",
    reason:
      "Workflow files exist in the repository; branch-protection enforcement is a repository-settings fact that has not been evidenced (FND-012). Running a check is not proof of governance compliance.",
  },
  {
    id: "CLM-011",
    claim: "The dependency set has been scanned and no vulnerability exists.",
    posture: "refused",
    state: "refused",
    reason:
      "The scanner executed and the advisory feed returned HTTP 404. The record is NOT COMPLETED; absence of a result is not absence of a vulnerability.",
  },
  {
    id: "CLM-012",
    claim: "Repository provenance has been independently validated.",
    posture: "refused",
    state: "refused",
    reason:
      "All provenance evidence is executor-produced and self-verified. independent = false on every record.",
  },
  {
    id: "CLM-013",
    claim:
      "No known dependency vulnerabilities were reported by the npm bulk advisory service against the dependency set recorded in bun.lock at 2026-08-19T06:13:46Z.",
    posture: "supported",
    state: "confirmed",
    reason:
      "EV-024 records a completed HTTP 200 query over 560 resolved versions across 526 packages with zero matched advisories. The wording is bound to that scanner, that advisory source, that dependency set, and that timestamp, and asserts nothing about security, completeness of the advisory source, or later intelligence.",
  },
];
