# WP-037 Frozen Exit-Criteria Reconciliation

States used: PASS, FAIL, NOT VERIFIED, NOT COMPLETED, N/A. No blended score is calculated and no
criterion is modified.

**Owner disposition, DEC-015 (accepted 2026-08-19).** WP-037 was placed on HOLD. No criterion below may be
weakened, inferred, reconstructed, or retroactively rewritten to permit closure, and the absence of
frozen Case 1 wording does not authorize the weaker interpretation.

**Recorded limitation on the criteria set.** No separately frozen, pre-registered WP-037
exit-criterion wording exists in the repository. The criteria below are the deliverable set named in
the WP-037 execution prompt, reconciled row by row. Because no pre-registered wording exists for the
vulnerability criterion, it is **not** reinterpreted in the executor's favour: see row 15 and
`CLOSURE_RECOMMENDATION.md`.

**Regenerated after the bounded remediation authorized by DEC-016 (accepted 2026-08-19).** Row 15 is
updated to record triage, remediation, and a completed post-remediation rescan with zero matched
advisories, and moves to PASS on the executed-evidence criterion. No other row changed state:
row 19 remains NOT VERIFIED for enforcement (FND-012), row 20 remains FAIL (advisory) (FND-014),
row 21 remains N/A. Executor reconciliation only; WP-037 is not closed here.

| # | Criterion | State | Evidence | Method | Source/input state | Limitation | Finding |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Evidence schema defined and enforced | PASS | `scripts/evidence/schema.mjs`; 8 schema tests | automated | source, tests CURRENT | Schema validity is not result correctness | — |
| 2 | Immutable execution evidence | PASS | `evidence/records/*.json`; archived run at `evidence/runs/1f7c51e/`; EV-019 | automated | tracked CURRENT | Immutability is procedural, not cryptographically enforced | — |
| 3 | Current baseline generator | PASS | `scripts/evidence/baseline.mjs`; `evidence/baseline.json` regenerated per run | automated | pipeline CURRENT | Baseline is derived; narrative prose is not | FND-013 residual |
| 4 | Applicability calculation | PASS | `scripts/evidence/applicability.mjs`; 8 applicability tests; verify output shows all 14 CURRENT | automated | source, tests CURRENT | Applicability depends on declared input sets | — |
| 5 | Evidence expiry | PASS | `scripts/evidence/expiry.mjs`; 3 expiry tests | automated | source CURRENT | Expiry windows are policy, not measurement | — |
| 6 | Evidence supersession | PASS | `superseded_by` handling in applicability; supersession test | automated | source CURRENT | — | — |
| 7 | Evidence index | PASS | `evidence/index.json` | automated | tracked CURRENT | — | — |
| 8 | Evidence bundle | PASS | `evidence/` bundle regenerated and verified in one run | automated | tracked CURRENT | — | — |
| 9 | Artifact hashing | PASS | `artifact_hash` on every record; `hashPathSet` in `util.mjs` | automated | source CURRENT | SHA-256 content hashes only | — |
| 10 | Reproduction process | PASS | `bun run evidence:run` then `bun run evidence:verify` executed once; VERIFICATION PASSED | automated | all sets CURRENT | External feed output varies with time | — |
| 11 | SBOM | PASS | `evidence/artifacts/sbom/sbom.cdx.json`; EV-SBOM | automated | manifest, lockfile CURRENT | Inventory only | — |
| 12 | License posture | PASS | `evidence/artifacts/licenses/licenses.json`; EV-LICENSE | automated | manifest, lockfile CURRENT | Inventory, not legal review | — |
| 13 | Secret scan | PASS | EV-SECRET; boundary controls in `scripts/evidence/boundary.mjs` | automated | tracked CURRENT | Pattern-based; absence of match is not proof of absence | — |
| 14 | Synthetic-data boundary scan | PASS | EV-PII; positive and negative control tests | automated | tracked CURRENT | Pattern-based | — |
| 15 | Vulnerability scanning | **PASS** | EV-VULN preserved unchanged (`bun audit`, HTTP 404, failed attempt); EV-021 recovery scan (5 high advisories); EV-022 triage; EV-023 remediation; EV-024 post-remediation rescan — HTTP 200, 526 packages / 560 resolved versions, 0 matched advisories; EV-025 regression verification | automated | manifest, lockfile CURRENT | Completed vulnerability evidence against one advisory source at one time. Not a security review, not proof that no vulnerability exists; `bun audit` still cannot execute in this environment and reachability/exploitability remain UNKNOWN | FND-015 REMEDIATED |
| 16 | Synthetic fixture generator | PASS | `src/fixtures/**`; synthetic flags on every governed record | automated | source CURRENT | — | — |
| 17 | Claim eligibility | PASS | Claims Register CLM-008 through CLM-012; claim-overreach test | automated | source, tests CURRENT | Register is human-authored | — |
| 18 | Gate evidence eligibility | PASS | reuse contract, 7 conditions, `evaluateReuse` | automated | source CURRENT | Eligibility is not gate closure | — |
| 19 | CI integration | PASS (existence) / **NOT VERIFIED** (enforcement) | `.github/workflows/evidence-pipeline.yml`; `configuration.json` records `REQUIRED MERGE ENFORCEMENT - NOT VERIFIED` | automated | workflows CURRENT | Workflow presence is not branch protection | FND-012 |
| 20 | Repository-wide lint passes | **FAIL (advisory)** | full lint run at this head | automated | source CURRENT | Formatter differences, not logic defects; WP-037 files report zero problems | FND-014 |
| 21 | Independent validation | N/A | none | — | — | Not authorized in this posture | EV-012 remains not-run |
