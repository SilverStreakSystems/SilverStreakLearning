/**
 * Shared primitives for the SSLS evidence pipeline.
 *
 * Every fact this module produces is derived from the repository or the
 * execution environment at call time. Nothing here declares authority and
 * nothing here is hand-maintained.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

/** Canonical schema version for evidence records produced by this pipeline. */
export const EVIDENCE_SCHEMA_VERSION = "1.0.0";

/** Canonical schema version for the current baseline manifest. */
export const BASELINE_SCHEMA_VERSION = "1.0.0";

/** Marker written into every generated artifact. */
export const GENERATED_MARKER = "GENERATED - DO NOT HAND EDIT";

export function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

export function hashFile(path) {
  if (!existsSync(path)) return null;
  return sha256(readFileSync(path));
}

/**
 * Stable hash of a JSON-serialisable value. Keys are sorted so that the same
 * logical value always produces the same digest.
 */
export function stableHash(value) {
  return sha256(stableStringify(value));
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

/** Run a command, capturing status and output. Never throws on non-zero exit. */
export function run(command, args, options = {}) {
  try {
    const stdout = execFileSync(command, args, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    });
    return { ok: true, code: 0, stdout: stdout ?? "", stderr: "" };
  } catch (error) {
    return {
      ok: false,
      code: typeof error.status === "number" ? error.status : 1,
      stdout: error.stdout?.toString?.() ?? "",
      stderr: error.stderr?.toString?.() ?? String(error.message ?? error),
    };
  }
}

function git(args) {
  const result = run("git", args);
  return result.ok ? result.stdout.trim() : null;
}

/**
 * Resolve the commit under evidence. Read dynamically, never from a constant:
 * this is the acceptance condition recorded against FND-011.
 */
export function resolveCommit() {
  const flag = process.argv.find((arg) => arg.startsWith("--commit="));
  const sha =
    (flag ? flag.slice("--commit=".length) : null) ??
    process.env.SSLS_EVIDENCE_COMMIT ??
    process.env.GITHUB_SHA ??
    git(["rev-parse", "HEAD"]);
  return sha ? sha.trim().toLowerCase() : null;
}

export function resolveBranch() {
  return process.env.GITHUB_REF_NAME ?? git(["rev-parse", "--abbrev-ref", "HEAD"]) ?? "UNKNOWN";
}

export function rootCommit() {
  const out = git(["rev-list", "--max-parents=0", "HEAD"]);
  return out ? out.split("\n").pop().trim() : null;
}

export function treeHash() {
  return git(["rev-parse", "HEAD^{tree}"]);
}

export function commitCount() {
  const out = git(["rev-list", "--count", "HEAD"]);
  return out ? Number(out) : null;
}

/** All git-tracked paths, sorted. */
export function trackedFiles() {
  const out = git(["ls-files"]);
  return out ? out.split("\n").filter(Boolean).sort() : [];
}

/** Whether the working tree carries uncommitted changes. */
export function workingTreeDirty() {
  const out = git(["status", "--porcelain"]);
  if (out === null) return null;
  return out.length > 0;
}

/**
 * Content hash of a declared set of repository paths.
 *
 * Missing files are recorded explicitly so that deleting an input changes the
 * hash rather than silently shrinking the set.
 */
export function hashPathSet(paths) {
  const entries = paths
    .slice()
    .sort()
    .map((path) => [path, hashFile(path) ?? "MISSING"]);
  return { hash: stableHash(entries), files: entries.length, entries };
}

/** Expand declared prefixes/suffixes against the tracked file list. */
export function matchTracked(files, { prefixes = [], suffixes = [], exact = [] }) {
  return files.filter(
    (file) =>
      exact.includes(file) ||
      prefixes.some((prefix) => file.startsWith(prefix)) ||
      suffixes.some((suffix) => file.endsWith(suffix)),
  );
}

export function nowIso() {
  return new Date().toISOString();
}

export function shortSha(sha) {
  return sha ? sha.slice(0, 7) : "unknown";
}
