/**
 * Output-safety guard execution modes and their wiring.
 *
 * The guard has two execution paths and both must fail closed:
 *   - check mode (`--check` / `--no-write`), used by the read-only aggregate
 *     `verify` command, which writes no file at all;
 *   - report mode, used for deliberate evidence generation and retention,
 *     which writes a result document excluded from its own scan.
 *
 * The wiring assertions exist so future drift — a package script or a CI
 * workflow that quietly stops checking the committed evidence tree — fails
 * here rather than passing silently.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  isCheckMode,
  listOutputFiles,
  runOutputSafety,
} from "../../scripts/evidence/output-safety.mjs";

const created: string[] = [];

function tree(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "ssls-out-modes-"));
  created.push(dir);
  for (const [name, content] of Object.entries(files)) {
    const target = join(dir, name);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, content);
  }
  return relative(process.cwd(), dir);
}

function runCli(args: string[]) {
  return spawnSync("node", ["scripts/evidence/output-safety.mjs", ...args], {
    encoding: "utf8",
    env: { ...process.env, SSLS_EVIDENCE_DIR: "" },
  });
}

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("output-safety execution modes", () => {
  it("recognises both non-writing flags", () => {
    expect(isCheckMode(["node", "x", "--check"])).toBe(true);
    expect(isCheckMode(["node", "x", "--no-write"])).toBe(true);
    expect(isCheckMode(["node", "x", "--dir=evidence"])).toBe(false);
  });

  it("check mode scans, passes, and creates no report file", () => {
    const dir = tree({ "baseline.json": JSON.stringify({ status: "pass" }) });
    const before = listOutputFiles(dir).length;

    const cli = runCli([`--dir=${dir}`, "--check"]);

    expect(cli.status).toBe(0);
    expect(cli.stdout).toContain("check mode, no file written");
    expect(cli.stdout).toContain("does not prove the absence");
    expect(listOutputFiles(dir).length).toBe(before);
    expect(existsSync(resolve("reports/evidence-output-safety.json"))).toBe(false);
  });

  it("report mode still writes a result document", () => {
    const dir = tree({ "baseline.json": JSON.stringify({ status: "pass" }) });
    const out = join(dir, "..", `ssls-report-${process.pid}.json`);

    const cli = runCli([`--dir=${dir}`, `--out=${out}`]);

    expect(cli.status).toBe(0);
    expect(existsSync(out)).toBe(true);
    const result = JSON.parse(readFileSync(out, "utf8"));
    expect(result.status).toBe("pass");
    expect(result.result_path_excluded_from_scan).toBe(out);
    rmSync(out, { force: true });
  });

  it("fails closed on a match in both execution paths", () => {
    const dir = tree({
      "leak.json": JSON.stringify({ token: `AK${"IA"}IOSFODNN7EXAMPLE` }),
    });

    expect(runOutputSafety({ dir }).ok).toBe(false);
    expect(runCli([`--dir=${dir}`, "--check"]).status).toBe(1);
    expect(runCli([`--dir=${dir}`, `--out=${join(dir, "..", "r.json")}`]).status).toBe(1);
    rmSync(join(dir, "..", "r.json"), { force: true });
  });

  it("fails closed on an empty or unreadable tree in both execution paths", () => {
    const empty = tree({});
    expect(runOutputSafety({ dir: empty }).ok).toBe(false);
    expect(runCli([`--dir=${empty}`, "--check"]).status).toBe(1);
    expect(runCli([`--dir=${join(empty, "does-not-exist")}`, "--check"]).status).toBe(1);
  });

  it("retains the ephemeral guard result inside the kept tree and excludes it from its own scan", () => {
    const source = readFileSync("scripts/evidence/ephemeral.mjs", "utf8");
    expect(source).toContain('join(outDir, "reports", "output-safety.json")');

    const dir = tree({ "baseline.json": JSON.stringify({ status: "pass" }) });
    const retained = join(dir, "reports", "output-safety.json");

    const cli = runCli([`--dir=${dir}`, `--out=${retained}`]);

    expect(cli.status).toBe(0);
    expect(existsSync(retained)).toBe(true);
    const result = JSON.parse(readFileSync(retained, "utf8"));
    expect(result.files_scanned).toBe(1);
    expect(listOutputFiles(dir, { exclude: [retained] })).not.toContain(
      relative(process.cwd(), retained),
    );
  });
});

describe("committed-evidence output safety is required by the toolchain", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };

  it("exposes a non-writing check script used by the aggregate verify command", () => {
    expect(pkg.scripts["evidence:output-safety:check"]).toContain("--check");
    expect(pkg.scripts["verify"]).toContain("evidence:output-safety:check");
    expect(pkg.scripts["verify"]).toContain("evidence:verify");
    expect(pkg.scripts["verify:ci"]).toContain("evidence:ephemeral");
  });

  it("requires the committed-evidence guard in both workflows without continue-on-error", () => {
    for (const file of [
      ".github/workflows/quality-gate.yml",
      ".github/workflows/evidence-pipeline.yml",
    ]) {
      const yaml = readFileSync(file, "utf8");
      expect(yaml).toContain("evidence:verify");
      expect(yaml).toContain("evidence:output-safety:check");
      expect(yaml).not.toContain("continue-on-error");
      expect(yaml).not.toContain("check:ssot-binding");
    }
  });
});
