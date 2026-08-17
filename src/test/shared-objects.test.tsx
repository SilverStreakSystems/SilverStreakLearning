import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderRoute } from "./render-route";
import {
  EXAMPLE_CLAIMS,
  EXAMPLE_CONTEXT_PACKAGES,
  EXAMPLE_EVIDENCE,
  EXAMPLE_HANDOFFS,
  EXAMPLE_WORK_ITEMS,
  OBJECT_NORMALIZATION_FINDINGS,
  RELATIONSHIP_NORMALIZATION_FINDINGS,
  SHARED_OBJECT_CATALOG,
} from "@/fixtures";
import {
  OBJECT_FAMILIES,
  RELATIONSHIP_KINDS,
  RELATIONSHIP_KIND_META,
  SHARED_OBJECT_TYPE_IDS,
  STATE_AXES,
  STATE_AXIS_META,
  VERSION_BOUND_EVIDENCE_TYPES,
  validateClaims,
  validateEvidence,
  validateWorkItems,
} from "@/domain";

describe("shared object catalog", () => {
  it("covers every declared type identifier exactly once", () => {
    const ids = SHARED_OBJECT_CATALOG.map((record) => record.typeId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(SHARED_OBJECT_TYPE_IDS.length);
  });

  it("places every type in a declared family", () => {
    for (const record of SHARED_OBJECT_CATALOG) {
      expect(OBJECT_FAMILIES, record.typeId).toContain(record.family);
    }
  });

  it("gives every type a definition, a reason to exist, and an owner", () => {
    for (const record of SHARED_OBJECT_CATALOG) {
      expect(record.definition.length, record.typeId).toBeGreaterThan(0);
      expect(record.reasonForExistence.length, record.typeId).toBeGreaterThan(0);
      expect(record.ownerCapabilityId.length, record.typeId).toBeGreaterThan(0);
    }
  });
});

describe("state axes stay independent", () => {
  it("declares eight axes, each with its own meaning", () => {
    expect(STATE_AXES).toHaveLength(8);
    for (const axis of STATE_AXES) {
      expect(STATE_AXIS_META[axis].label.length).toBeGreaterThan(0);
    }
  });

  it("never lets one axis be described as implying another", () => {
    for (const axis of STATE_AXES) {
      const meta = STATE_AXIS_META[axis];
      expect(meta.neverImplies.length, axis).toBeGreaterThan(0);
    }
  });
});

describe("relationship model", () => {
  it("gives every relationship kind an inverse verb and a cardinality", () => {
    for (const kind of RELATIONSHIP_KINDS) {
      const meta = RELATIONSHIP_KIND_META[kind];
      expect(meta.inverseVerb.length, kind).toBeGreaterThan(0);
      expect(meta.cardinality.length, kind).toBeGreaterThan(0);
    }
  });

  it("records a judgment on every normalization finding", () => {
    for (const finding of [...OBJECT_NORMALIZATION_FINDINGS, ...RELATIONSHIP_NORMALIZATION_FINDINGS]) {
      expect(finding.judgment.length).toBeGreaterThan(0);
    }
  });
});

describe("work, evidence, and claim contracts", () => {
  it("passes work item invariants: every item names a purpose and a served object", () => {
    expect(validateWorkItems(EXAMPLE_WORK_ITEMS)).toEqual([]);
  });

  it("passes evidence invariants and binds evidence to a version where required", () => {
    expect(validateEvidence(EXAMPLE_EVIDENCE)).toEqual([]);
    for (const record of EXAMPLE_EVIDENCE) {
      if ((VERSION_BOUND_EVIDENCE_TYPES as readonly string[]).includes(record.evidenceType)) {
        expect(record.versionBinding, record.evidenceId).not.toBeNull();
      }
    }
  });

  it("passes claim invariants: no claim stands without supporting evidence", () => {
    expect(validateClaims(EXAMPLE_CLAIMS)).toEqual([]);
  });

  it("keeps a context package bound to the single purpose it was assembled for", () => {
    for (const pkg of EXAMPLE_CONTEXT_PACKAGES) {
      expect(pkg.purpose.length, pkg.packageId).toBeGreaterThan(0);
      expect(pkg.reusePolicy.toLowerCase(), pkg.packageId).toMatch(/not|only|single/);
    }
  });

  it("never completes a handoff the receiver has not accepted", () => {
    for (const handoff of EXAMPLE_HANDOFFS) {
      if (!handoff.receiverAccepted) {
        expect(handoff.outcome, handoff.handoffId).not.toBe("accepted");
      }
    }
  });
});

describe("shared object surfaces", () => {
  it("renders the registry with exactly one H1", async () => {
    await renderRoute("/objects");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders a type detail page", async () => {
    await renderRoute("/objects/evidence");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
  });
});
