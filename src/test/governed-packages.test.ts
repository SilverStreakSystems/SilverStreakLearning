import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { AUTHORITY_CLASS_META, carriesImplementationAuthority } from "@/domain/authority";
import {
  ACQUISITION_METHODS,
  PACKAGE_AUTHORITY_ROLES,
  RETENTION_STATES,
  packageCarriesImplementationAuthority,
  validateGovernedPackage,
} from "@/domain/governed-package";
import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures/registers";
import {
  loadGovernedPackageFile,
  loadGovernedPackageSchema,
  loadGovernedPackages,
} from "@/lib/governed-package-registry";
import { loadHistoricalRequirements } from "@/lib/historical-requirement-registry";
import { loadHistoricalSources } from "@/lib/historical-source-registry";

const file = loadGovernedPackageFile();
const packages = loadGovernedPackages();
const schema = loadGovernedPackageSchema();
const v030 = packages.find((record) => record.package_id === "PKG-002")!;
const v020 = packages.find((record) => record.package_id === "PKG-001")!;

const DECLARED_PDF_SHA = "9632f08cd4afa0bfbbf7767a328fe3bbca2528314f34e39a078975619852f943";
const DECLARED_XLSX_SHA = "68064dcb39bea9e3a23f7593f65f00310a28254535c47aa1995c431bd6fcce1e";

describe("governed package schema", () => {
  it("declares a versioned schema that matches the register", () => {
    expect(schema["schema_version"]).toBe("1.0.0");
    expect(file.schema_version).toBe(schema["schema_version"]);
    expect(file.package_boundary.length).toBeGreaterThan(80);
  });

  it("keeps the package vocabularies aligned with the schema", () => {
    const defs = schema["$defs"] as Record<string, { enum?: string[] }>;
    expect(defs["authorityRole"]?.enum).toEqual([...PACKAGE_AUTHORITY_ROLES]);
    expect(defs["retentionState"]?.enum).toEqual([...RETENTION_STATES]);
    expect(defs["acquisitionMethod"]?.enum).toEqual([...ACQUISITION_METHODS]);
  });

  it("validates every package record", () => {
    expect(packages.flatMap((record) => validateGovernedPackage(record))).toEqual([]);
  });
});

describe("v0.3.0 package integrity", () => {
  it("records the two declared digests exactly as the manifest prints them", () => {
    const pdf = v030.artifacts.find((a) => a.media_type === "application/pdf")!;
    const xlsx = v030.artifacts.find((a) => a.filename.endsWith(".xlsx"))!;

    expect(pdf.declared_sha256).toBe(DECLARED_PDF_SHA);
    expect(pdf.sha256).toBe(DECLARED_PDF_SHA);
    expect(pdf.integrity_state).toBe("VERIFIED-MATCH");

    expect(xlsx.declared_sha256).toBe(DECLARED_XLSX_SHA);
    expect(xlsx.sha256).toBe(DECLARED_XLSX_SHA);
    expect(xlsx.integrity_state).toBe("VERIFIED-MATCH");
  });

  it("does not claim the manifest hashes itself", () => {
    const manifest = v030.artifacts.find((a) => a.filename.endsWith(".txt"))!;
    expect(manifest.declared_sha256).toBeNull();
    expect(manifest.integrity_state).toBe("NOT-APPLICABLE-SELF-HASH-EXCLUDED");
  });

  it("registers exactly the three supplied files", () => {
    expect(v030.artifacts.map((a) => a.filename).sort()).toEqual([
      "SSLS_2.0_Comprehensive_Governed_Rewrite_v0.3.0_2026-08-19.pdf",
      "SSLS_2.0_Control_Workbook_v0.3.0_2026-08-19.xlsx",
      "SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt",
    ]);
    expect(v030.declared_contents).toHaveLength(3);
  });

  it("never represents the absent v0.2.0 DOCX and ZIP as v0.3.0 artifacts", () => {
    const v030Types = v030.artifacts.map((a) => a.media_type);
    expect(v030Types).not.toContain("application/zip");
    expect(v030Types.some((type) => type.includes("wordprocessingml"))).toBe(false);
    expect(v030.completeness_boundary.toLowerCase()).toContain("not supplied");

    for (const artifact of v020.artifacts) {
      expect(artifact.retention_state).toBe("NOT-SUPPLIED");
      expect(artifact.sha256).toBeNull();
      expect(artifact.byte_size).toBeNull();
      expect(artifact.integrity_state).toBe("NOT-VERIFIABLE-FILE-NOT-SUPPLIED");
    }
  });

  it("keeps the v0.3.0 and v0.2.0 packages distinguishable and correctly ordered", () => {
    expect(v030.authority_role).toBe("SYNCHRONIZED-REFERENCE");
    expect(v020.authority_role).toBe("HISTORICAL-EVIDENCE");
    expect(v030.predecessor_package).toBe("PKG-001");
    expect(v020.state_date < v030.state_date).toBe(true);
  });

  it("fabricates no repository locator for a file that was not retained", () => {
    for (const record of packages) {
      for (const artifact of record.artifacts) {
        expect(artifact.retention_state).not.toBe("RETAINED-IN-REPOSITORY");
        expect(artifact.locator.startsWith("repository:")).toBe(false);
      }
    }
  });
});

describe("synchronized reference is not authority", () => {
  it("gives no package any implementation authority", () => {
    expect(packageCarriesImplementationAuthority()).toBe(false);
    for (const record of packages) {
      expect(record.canonical_status).toBe("NONCANONICAL");
    }
  });

  it("keeps implementation authority limited to approved authority and accepted decisions", () => {
    const granting = Object.values(AUTHORITY_CLASS_META)
      .filter((meta) => meta.carriesImplementationAuthority)
      .map((meta) => meta.id);
    expect(granting).toEqual(["approved-authority", "accepted-decision"]);
    expect(carriesImplementationAuthority("current-summary")).toBe(false);
    expect(carriesImplementationAuthority("historical-evidence")).toBe(false);
  });

  it("states the non-claim boundary on every package", () => {
    for (const record of packages) {
      const text = record.non_claims.join(" ").toLowerCase();
      expect(record.non_claims.length).toBeGreaterThan(2);
      expect(text).toContain("does not close a finding");
      expect(record.release_state).toBe("NOT-RELEASE-AUTHORIZED");
      expect(record.personal_data_state).toBe("NO-PII");
    }
  });

  it("does not promote any historical source by inclusion, recency, or validation", () => {
    for (const source of loadHistoricalSources()) {
      expect(source.promotion_state).toBe("NOT-PROMOTED");
    }
  });
});

describe("package integration changed no owner-reserved state", () => {
  const decision = (id: string) => DECISIONS.find((record) => record.id === id);
  const finding = (id: string) => FINDINGS.find((record) => record.id === id);

  it("keeps DEC-012 and DEC-018 accepted", () => {
    expect(decision("DEC-012")?.state).toBe("accepted");
    expect(decision("DEC-018")?.state).toBe("accepted");
  });

  it("keeps FND-016 partial and FND-017/FND-018 open", () => {
    expect(finding("FND-016")?.resolutionState).toBe("partial");
    expect(finding("FND-017")?.resolutionState).toBe("unknown");
    expect(finding("FND-018")?.resolutionState).toBe("unknown");
  });

  it("keeps every candidate historical requirement pre-disposition and not assessed", () => {
    const requirements = loadHistoricalRequirements();
    expect(requirements).toHaveLength(14);
    expect(requirements.map((r) => r.requirement_id)).toEqual(
      Array.from({ length: 14 }, (_, index) => `HREQ-${String(index + 1).padStart(3, "0")}`),
    );
    for (const requirement of requirements) {
      expect(requirement.disposition).toBe("CANDIDATE-PRE-DISPOSITION");
      expect(requirement.conformance_state).toBe("NOT-ASSESSED");
    }
  });

  it("registers package evidence without promoting it to authority", () => {
    for (const id of ["EV-033", "EV-034"]) {
      const record = EVIDENCE.find((entry) => entry.id === id);
      expect(record).toBeDefined();
      expect(carriesImplementationAuthority(record!.authorityClass)).toBe(false);
      expect(record!.doesNotSupport.length).toBeGreaterThan(40);
    }
  });
});

describe("active documentation carries no stale package or gate reference", () => {
  const activeDocs = ["docs/CURRENT_STATE.md", "docs/packages", "docs/wp-007"];

  function filesUnder(target: string): string[] {
    const full = join(process.cwd(), target);
    if (target.endsWith(".md")) return [full];
    return readdirSync(full)
      .filter((name) => name.endsWith(".md"))
      .map((name) => join(full, name));
  }

  const texts = activeDocs.flatMap(filesUnder).map((path) => ({
    path,
    text: readFileSync(path, "utf8"),
  }));

  it("never presents Gate 0 as the current gate", () => {
    for (const { path, text } of texts) {
      const hits = text.split("\n").filter((line) => /\bGate 0\b/.test(line));
      for (const hit of hits) {
        expect(
          /historical|superseded|lineage|not the current|refus|prior/i.test(hit),
          `${path}: ${hit}`,
        ).toBe(true);
      }
    }
  });

  it("never presents the August 5 v0.2.0 package as the current synchronized package", () => {
    for (const { path, text } of texts) {
      const hits = text.split("\n").filter((line) => /v0\.2\.0/.test(line));
      for (const hit of hits) {
        expect(
          /historical|predecessor|not supplied|not the current|prior|earlier|absent/i.test(hit),
          `${path}: ${hit}`,
        ).toBe(true);
      }
    }
  });

  it("keeps current-state documentation aligned with the canonical registers", () => {
    const currentState = readFileSync(join(process.cwd(), "docs/CURRENT_STATE.md"), "utf8");
    expect(currentState).toContain("PKG-002");
    expect(currentState).toContain("Gate A is not closed");
    expect(currentState).toMatch(/WP-039 is (neither created nor implied|not authorized)/);
    expect(loadHistoricalSources()).toHaveLength(22);
  });
});
