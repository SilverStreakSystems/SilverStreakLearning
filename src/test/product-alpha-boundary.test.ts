import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import * as commands from "@/lib/learning-loop/commands";
import {
  ID_PREFIX,
  RESERVED_GOVERNANCE_PREFIXES,
  createSeedDocument,
} from "@/domain/learning-loop";

const SEED = createSeedDocument();

describe("Product Alpha 001 boundary", () => {
  it("has no command that creates a learner from free text", () => {
    expect(Object.keys(commands)).not.toContain("createLearner");
  });

  it("does not offer a free-text learner field anywhere in the learner routes", () => {
    for (const path of ["src/routes/learners.index.tsx", "src/routes/learners.$learnerId.tsx"]) {
      const source = readFileSync(path, "utf8");
      expect(source).not.toContain("createLearner");
    }
  });

  it("keeps every record synthetic and the document marked synthetic-only", () => {
    expect(SEED.syntheticOnly).toBe(true);
    expect(SEED.learners.every((row) => row.synthetic)).toBe(true);
    expect(SEED.goals.every((row) => row.synthetic)).toBe(true);
    expect(SEED.observations.every((row) => row.synthetic)).toBe(true);
    expect(SEED.supportActions.every((row) => row.synthetic)).toBe(true);
    expect(SEED.goalReviews.every((row) => row.synthetic)).toBe(true);
  });

  it("labels every sample learner visibly as fictional", () => {
    for (const learner of SEED.learners) expect(learner.displayLabel).toMatch(/fictional/i);
  });

  it("never mints a governance identifier prefix", () => {
    for (const prefix of Object.values(ID_PREFIX))
      expect(RESERVED_GOVERNANCE_PREFIXES as readonly string[]).not.toContain(prefix);
  });

  it("keeps the product entirely local: no network call in the product code", () => {
    for (const path of [
      "src/lib/learning-loop/repository.ts",
      "src/lib/learning-loop/use-learning-loop.ts",
      "src/lib/learning-loop/commands.ts",
      "src/routes/learners.index.tsx",
      "src/routes/learners.$learnerId.tsx",
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source).not.toMatch(/\bfetch\(|XMLHttpRequest|createServerFn|supabase/);
    }
  });
});
