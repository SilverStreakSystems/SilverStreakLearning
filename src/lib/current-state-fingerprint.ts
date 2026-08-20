/**
 * Deterministic input fingerprinting for the canonical current-state projection.
 *
 * The freshness contract is non-self-referential: no repository file has to
 * contain its own commit hash. Instead, the declared controlling inputs are
 * hashed, combined into one fingerprint, and compared against the fingerprint
 * recorded alongside the generated projection. Any change to a controlling
 * input changes the fingerprint, and regeneration is the only way to clear it.
 *
 * These helpers assert nothing about correctness or authority.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface CurrentStateInputManifest {
  manifest_id: string;
  manifest_version: string;
  controlling_decision: string;
  output: string;
  fingerprint_file: string;
  inputs: string[];
  superseded_documents: string[];
  superseded_marker: string;
}

export interface InputDigest {
  path: string;
  sha256: string;
  bytes: number;
}

export interface FingerprintResult {
  manifestId: string;
  manifestVersion: string;
  fingerprint: string;
  inputs: InputDigest[];
}

export function sha256(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/** Combine per-input digests into one order-independent fingerprint. */
export function combineDigests(inputs: InputDigest[]): string {
  const lines = [...inputs]
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((entry) => `${entry.path}:${entry.sha256}`);
  return sha256(lines.join("\n"));
}

export function loadInputManifest(root = process.cwd()): CurrentStateInputManifest {
  return JSON.parse(
    readFileSync(join(root, "data", "current-state", "current-state-inputs.json"), "utf8"),
  ) as CurrentStateInputManifest;
}

/** Returns the declared inputs that do not resolve to a file on disk. */
export function unresolvedInputs(
  manifest: CurrentStateInputManifest,
  root = process.cwd(),
): string[] {
  return manifest.inputs.filter((path) => !existsSync(join(root, path)));
}

export function fingerprintInputs(
  manifest: CurrentStateInputManifest,
  root = process.cwd(),
): FingerprintResult {
  const inputs: InputDigest[] = manifest.inputs.map((path) => {
    const content = readFileSync(join(root, path));
    return { path, sha256: sha256(content), bytes: content.byteLength };
  });
  return {
    manifestId: manifest.manifest_id,
    manifestVersion: manifest.manifest_version,
    fingerprint: combineDigests(inputs),
    inputs,
  };
}

/** Superseded documents that fail to declare themselves superseded. */
export function undeclaredSupersededDocuments(
  manifest: CurrentStateInputManifest,
  root = process.cwd(),
): string[] {
  return manifest.superseded_documents.filter((path) => {
    const full = join(root, path);
    if (!existsSync(full)) return true;
    return !readFileSync(full, "utf8").includes(manifest.superseded_marker);
  });
}
