/**
 * Client-safe projection of the canonical governed-package registers.
 *
 * `src/lib/governed-package-registry.ts` reads the same JSON from disk for the
 * documentation generator and the tests. This module imports the identical
 * files as modules so route components can project them without a filesystem
 * dependency. Both paths resolve the same bytes: there is one register, and a
 * test asserts the two readers agree.
 */
import type {
  GovernedPackageRecord,
  PackageDriftFile,
  PackageDriftRow,
} from "@/domain/governed-package";
import { unresolvedDrift } from "@/domain/governed-package";

import driftJson from "../../data/packages/package-drift.json";
import packagesJson from "../../data/packages/governed-packages.json";

const driftFile = driftJson as PackageDriftFile;
const packageFile = packagesJson as unknown as {
  schema_version: string;
  generated_on: string;
  package_boundary: string;
  records: GovernedPackageRecord[];
};

export const GOVERNED_PACKAGES: GovernedPackageRecord[] = packageFile.records;
export const PACKAGE_BOUNDARY: string = packageFile.package_boundary;
export const PACKAGE_DRIFT: PackageDriftFile = driftFile;

export function currentReferencePackage(): GovernedPackageRecord | undefined {
  return GOVERNED_PACKAGES.find((record) => record.authority_role === "SYNCHRONIZED-REFERENCE");
}

export function unresolvedDriftRows(): PackageDriftRow[] {
  return unresolvedDrift(driftFile.drift);
}

/** Artifacts a package declares but that were never supplied to this program. */
export function notSuppliedArtifacts() {
  return GOVERNED_PACKAGES.flatMap((record) =>
    record.artifacts
      .filter((artifact) => artifact.retention_state === "NOT-SUPPLIED")
      .map((artifact) => ({ packageId: record.package_id, artifact })),
  );
}

/** Artifacts whose declared digest was independently recomputed and matched. */
export function verifiedDigestArtifacts() {
  return GOVERNED_PACKAGES.flatMap((record) =>
    record.artifacts
      .filter((artifact) => artifact.integrity_state === "VERIFIED-MATCH")
      .map((artifact) => ({ packageId: record.package_id, artifact })),
  );
}
