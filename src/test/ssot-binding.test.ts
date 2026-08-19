import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BOUND_DOCUMENT_PATHS,
  SSOT_RECORD_PATH,
  evaluateBindings,
  extractDeclaredBinding,
  formatReport,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- plain JS guard module shared with the CI script
} from "../../scripts/ssot-binding.mjs";

const CURRENT_BINDING = "9a257f754e97b9cddf9a474009c5947488102c04";
const SUPERSEDED_BINDING = "6aa254e6f9ceeb06c60ae08827118fa5bf52001d";

describe("SSOT binding guard", () => {
  it("extracts the declared binding from the canonical record", () => {
    const markdown = readFileSync(resolve(SSOT_RECORD_PATH), "utf8");
    expect(extractDeclaredBinding(markdown)).toBe(CURRENT_BINDING);
  });

  it("declares the same binding commit across every bound document", () => {
    const declared = (BOUND_DOCUMENT_PATHS as string[]).map((path) =>
      extractDeclaredBinding(readFileSync(resolve(path), "utf8")),
    );
    expect(new Set(declared)).toEqual(new Set([CURRENT_BINDING]));
  });

  it("returns null when a document declares no binding", () => {
    expect(extractDeclaredBinding("# A document with no commit declaration")).toBeNull();
  });

  it("passes when every declaration matches the commit under review", () => {
    const evaluation = evaluateBindings(CURRENT_BINDING, [
      { path: "a.md", declared: CURRENT_BINDING },
      { path: "b.md", declared: CURRENT_BINDING.toUpperCase() },
    ]);
    expect(evaluation.ok).toBe(true);
  });

  it("fails when a document is still bound to a superseded commit", () => {
    const evaluation = evaluateBindings(CURRENT_BINDING, [
      { path: "a.md", declared: CURRENT_BINDING },
      { path: "b.md", declared: SUPERSEDED_BINDING },
    ]);
    expect(evaluation.ok).toBe(false);
    expect(formatReport(evaluation)).toContain("[MISMATCH]");
  });

  it("fails when a bound document declares no binding at all", () => {
    const evaluation = evaluateBindings(CURRENT_BINDING, [{ path: "a.md", declared: null }]);
    expect(evaluation.ok).toBe(false);
    expect(formatReport(evaluation)).toContain("[MISSING]");
  });

  it("reports state with textual markers, never color alone", () => {
    const report = formatReport(
      evaluateBindings(CURRENT_BINDING, [{ path: "a.md", declared: CURRENT_BINDING }]),
    );
    expect(report).toContain("[OK]");
    expect(report).toContain("PASS");
  });
});
