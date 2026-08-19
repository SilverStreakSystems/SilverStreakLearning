/**
 * Reads the canonical governed-package data from `data/packages/`.
 *
 * The JSON file is the single source of truth. This loader is used by tests and
 * by the documentation generator only; no route imports it, so no filesystem
 * access reaches the client bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { GovernedPackageRecord, PackageDriftFile } from "@/domain/governed-package";

const DATA_DIR = join(process.cwd(), "data", "packages");

export interface GovernedPackageFile {
  schema_version: string;
  generated_on: string;
  package_boundary: string;
  records: GovernedPackageRecord[];
}

export function loadGovernedPackageFile(): GovernedPackageFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "governed-packages.json"), "utf8"),
  ) as GovernedPackageFile;
}

export function loadGovernedPackages(): GovernedPackageRecord[] {
  return loadGovernedPackageFile().records;
}

export function loadGovernedPackageSchema(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "GOVERNED_PACKAGE_SCHEMA.json"), "utf8"),
  ) as Record<string, unknown>;
}

export function findGovernedPackage(packageId: string): GovernedPackageRecord | undefined {
  return loadGovernedPackages().find((record) => record.package_id === packageId);
}

export function loadPackageDriftFile(): PackageDriftFile {
  return JSON.parse(
    readFileSync(join(DATA_DIR, "package-drift.json"), "utf8"),
  ) as PackageDriftFile;
}
