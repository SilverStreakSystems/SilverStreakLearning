/**
 * Evidence output-safety guard.
 *
 * Two properties are asserted here:
 *   1. Generated evidence outputs are actually scanned for credential-shaped
 *      and personal-data-shaped content, and the guard fails closed.
 *   2. Doing so does not reintroduce recursion: the generated outputs remain
 *      outside every declared evidence input set, so checking them cannot
 *      invalidate them.
 */
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  DERIVED_OUTPUT_EXACT,
  DERIVED_OUTPUT_PREFIXES,
  computeInputSets,
  isDerivedOutput,
} from "../../scripts/evidence/inputs.mjs";
import {
  OUTPUT_SAFETY_LIMITATIONS,
  listOutputFiles,
  runOutputSafety,
} from "../../scripts/evidence/output-safety.mjs";

const created: string[] = [];

function fixtureTree(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "ssls-out-safety-"));
  created.push(dir);
  for (const [name, content] of Object.entries(files)) {
    const target = join(dir, name);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, content);
  }
  return relative(process.cwd(), dir);
}

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("evidence output-safety guard", () => {
  it("passes over a clean generated tree and states its limitation", () => {
    const dir = fixtureTree({
      "baseline.json": JSON.stringify({ status: "pass", records: 15 }),
      "records/EV-BUILD.json": JSON.stringify({ evidence_id: "EV-BUILD", status: "pass" }),
    });

    const { ok, result } = runOutputSafety({ dir });

    expect(ok).toBe(true);
    expect(result.status).toBe("pass");
    expect(result.files_scanned).toBe(2);
    expect(result.limitations).toEqual(OUTPUT_SAFETY_LIMITATIONS);
    expect(result.limitations.join(" ")).toMatch(/does not prove the absence/i);
  });

  it("fails closed on a credential-shaped literal in a generated artefact", () => {
    const dir = fixtureTree({
      "artifacts/leak.json": JSON.stringify({ note: "AKIAIOSFODNN7EXAMPLE" }),
    });

    const { ok, result } = runOutputSafety({ dir });

    expect(ok).toBe(false);
    expect(result.status).toBe("fail");
    expect(result.secret_matches).toHaveLength(1);
    expect(result.secret_matches[0]?.pattern_id).toBe("aws-access-key-id");
    // The matched value is never written into the result.
    expect(JSON.stringify(result)).not.toContain("AKIAIOSFODNN7EXAMPLE");
  });

  it("fails closed on personal-data-shaped content in a generated artefact", () => {
    const dir = fixtureTree({ "artifacts/pii.json": JSON.stringify({ ssn: "123-45-6789" }) });

    const { ok, result } = runOutputSafety({ dir });

    expect(ok).toBe(false);
    expect(result.pii_matches.map((match) => match.pattern_id)).toContain("ssn");
  });

  it("fails closed when the generated tree is empty", () => {
    const dir = fixtureTree({});

    const { ok, result } = runOutputSafety({ dir });

    expect(ok).toBe(false);
    expect(result.reason).toMatch(/empty or unreadable/i);
  });

  it("excludes its own result file from the scanned tree", () => {
    const dir = fixtureTree({
      "baseline.json": "{}",
      "output-safety.json": JSON.stringify({ secret_matches: [] }),
    });
    const out = join(dir, "output-safety.json");

    const files = listOutputFiles(dir, { exclude: [out] });

    expect(files.some((file: string) => file.endsWith("output-safety.json"))).toBe(false);
    expect(files.some((file: string) => file.endsWith("baseline.json"))).toBe(true);
  });

  it("checks generated outputs without putting them back into any input set", () => {
    const tracked = [
      "src/domain/authority.ts",
      "evidence/baseline.json",
      "evidence/records/EV-BUILD.json",
      "docs/CURRENT_STATE.md",
    ];

    // The guard reads these paths, but they stay classified as derived output.
    expect(isDerivedOutput("evidence/baseline.json")).toBe(true);
    expect(DERIVED_OUTPUT_PREFIXES).toContain("evidence/");
    expect(DERIVED_OUTPUT_EXACT).toContain("docs/CURRENT_STATE.md");

    const before = computeInputSets(tracked);
    const after = computeInputSets([...tracked, "evidence/reports/output-safety.json"]);

    expect(after).toEqual(before);
  });
});
