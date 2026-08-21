# Package integrity verification

> Generated from `data/packages/governed-packages.json` by `scripts/gen-governed-package-docs.ts`. Do not edit by hand.
> A package summarizes governed state. It is not a register, it carries no authority, and it closes nothing.

Digests were recomputed by this program against the supplied files and compared with the
digests printed in the supplied manifest. A verified match is a file-identity check only.
It is not independent validation and says nothing about the accuracy of package contents.

| Package                          | Filename                                                          | Declared SHA-256                                                   | Measured SHA-256                                                   | State                             |
| -------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------- |
| PKG-002 (SYNCHRONIZED-REFERENCE) | `SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf`   | `9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943` | `9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943` | VERIFIED-MATCH                    |
| PKG-002 (SYNCHRONIZED-REFERENCE) | `SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx`                | `68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e` | `68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e` | VERIFIED-MATCH                    |
| PKG-002 (SYNCHRONIZED-REFERENCE) | `SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt`                           | not declared                                                       | `3a98382ee083b8aa3dd8f8182f14ef70b00617f62f356f43c4e817950ca7a130` | NOT-APPLICABLE-SELF-HASH-EXCLUDED |
| PKG-001 (HISTORICAL-EVIDENCE)    | `v0.2.0 DOCX named by the prior manifest`                         | not declared                                                       | not measured                                                       | NOT-VERIFIABLE-FILE-NOT-SUPPLIED  |
| PKG-001 (HISTORICAL-EVIDENCE)    | `v0.2.0 ZIP named by the prior manifest`                          | not declared                                                       | not measured                                                       | NOT-VERIFIABLE-FILE-NOT-SUPPLIED  |
| PKG-001 (HISTORICAL-EVIDENCE)    | `SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf` | `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044` | `2c83e6b666a2857922c6b80be830f3e3738b24b76c49ae638df2c84d6827b044` | VERIFIED-MATCH                    |
| PKG-001 (HISTORICAL-EVIDENCE)    | `SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx`                | `f717dab3ad928ccd3bdcc96cf7b0054cc343edee276c4fbeb91063b4caf43dc1` | `f717dab3ad928ccd3bdcc96cf7b0054cc343edee276c4fbeb91063b4caf43dc1` | VERIFIED-MATCH                    |
| PKG-001 (HISTORICAL-EVIDENCE)    | `SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt`                           | not declared                                                       | `914b65e39895cbd225cf1211df242bae3804fc4fd561483f78a92987413d09a8` | NOT-APPLICABLE-SELF-HASH-EXCLUDED |

The v0.3.0 manifest declares no digest for itself, because hashing a file that contains its own
digest is circular. Its measured digest above is a measurement by this program, not a manifest claim.
