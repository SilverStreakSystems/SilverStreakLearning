/**
 * Prompt 005 invariants: workspace contracts, projection discipline, action
 * projection, search leakage, notification necessity, and prohibited signals.
 *
 * These are invariants, not scores. A single violation is a defect.
 */
import { describe, expect, it } from "vitest";
import {
  ACTING_CAPACITIES,
  ACTIVE_CAPACITY_ID,
  CROSS_FUNCTIONAL_PROGRAMS,
  GLOBAL_UTILITIES,
  HELP_ENTRIES,
  PROJECTION_PATTERN_CONTRACTS,
  WORKSPACES,
  WORKSPACE_MEMBERSHIPS,
} from "@/fixtures";
import {
  BLENDED_READINESS_REFUSAL,
  GLOBAL_UTILITY_IDS,
  PRIORITY_FACTORS,
  PROHIBITED_PRIORITY_FACTORS,
  PROHIBITED_WORKSPACE_SIGNALS,
  PROJECTION_ASSEMBLY_STEPS,
  SURFACE_STATES,
  WORKSPACE_IDS,
  governsWork,
  operatesNow,
  priorityRank,
  validateActions,
  validateNotifications,
  validateWorkspaces,
} from "@/domain";
import {
  ACTIVE_CAPACITY,
  assembleProjection,
  buildActions,
  buildNotifications,
  buildSearchIndex,
  runSearch,
} from "@/lib/workspace-queries";
import { ROUTE_REGISTRY } from "@/lib/route-registry";

describe("workspace contracts", () => {
  it("defines all nine workspaces exactly once", () => {
    expect(WORKSPACES).toHaveLength(WORKSPACE_IDS.length);
    expect(new Set(WORKSPACES.map((workspace) => workspace.workspaceId)).size).toBe(
      WORKSPACE_IDS.length,
    );
  });

  it("passes every structural workspace invariant", () => {
    expect(validateWorkspaces(WORKSPACES)).toEqual([]);
  });

  it("gives every workspace a purpose, a fundamental question, and a boundary", () => {
    for (const workspace of WORKSPACES) {
      expect(workspace.purpose.length).toBeGreaterThan(20);
      expect(workspace.fundamentalQuestion).toMatch(/\?$/);
      expect(workspace.currentBoundary.length).toBeGreaterThan(20);
      expect(workspace.futureBoundary.length).toBeGreaterThan(20);
    }
  });

  it("never derives authority or availability from the existence of a route", () => {
    const gated = WORKSPACES.filter((workspace) => !operatesNow(workspace));
    expect(gated.length).toBeGreaterThan(0);
    for (const workspace of gated) {
      expect(workspace.implementationState).not.toBe("implemented");
      for (const surface of workspace.primarySurfaces) {
        expect(surface.availability).not.toBe("current");
      }
    }
  });

  it("requires every metric to state a prohibited interpretation and a triggered action", () => {
    for (const workspace of WORKSPACES) {
      for (const metric of workspace.metrics) {
        expect(metric.prohibitedInterpretation.trim()).not.toBe("");
        expect(metric.actionTriggered.trim()).not.toBe("");
        expect(metric.source.trim()).not.toBe("");
      }
    }
  });

  it("refuses a blended readiness percentage and every surveillance signal", () => {
    expect(BLENDED_READINESS_REFUSAL).toMatch(/refused/i);
    expect(PROHIBITED_WORKSPACE_SIGNALS.length).toBeGreaterThan(4);
    // The phrase may appear only where it is being refused, never as a metric.
    for (const workspace of WORKSPACES) {
      const refusalText = [
        ...workspace.prohibitedObjects,
        ...workspace.metrics.map((metric) => metric.prohibitedInterpretation),
      ]
        .join(" ")
        .toLowerCase();
      const offered = [
        workspace.purpose,
        workspace.fundamentalQuestion,
        ...workspace.metrics.map((metric) => `${metric.name} ${metric.interpretation}`),
      ]
        .join(" ")
        .toLowerCase();
      expect(offered).not.toContain("readiness percentage");
      expect(offered).not.toContain("productivity score");
      expect(refusalText.length).toBeGreaterThan(0);
    }
  });

  it("names prohibited objects on every workspace so nothing is displayed by default", () => {
    for (const workspace of WORKSPACES) {
      expect(workspace.prohibitedObjects.length).toBeGreaterThan(0);
    }
  });

  it("keeps personal data out of every workspace definition", () => {
    for (const workspace of WORKSPACES) {
      expect(workspace.currentBoundary + workspace.prohibitedObjects.join(" ")).toMatch(
        /personal data|student|learner|employee|customer/i,
      );
    }
  });
});

describe("capacity and membership", () => {
  it("has exactly one active capacity", () => {
    const active = ACTING_CAPACITIES.filter((capacity) => capacity.status === "active");
    expect(active).toHaveLength(1);
    expect(active[0]!.capacityId).toBe(ACTIVE_CAPACITY_ID);
  });

  it("states that membership authorizes no record", () => {
    for (const membership of WORKSPACE_MEMBERSHIPS) {
      expect(membership.authorizesAllWorkspaceRecords).toBe(false);
      expect(membership.objectScope.length).toBeGreaterThan(0);
      expect(membership.purpose.trim()).not.toBe("");
    }
  });

  it("records what each capacity may not do without another authority", () => {
    for (const capacity of ACTING_CAPACITIES) {
      expect(capacity.requiresOtherAuthority.length).toBeGreaterThan(0);
      expect(capacity.expiryTrigger.trim()).not.toBe("");
    }
  });
});

describe("projection discipline", () => {
  it("records all nine assembly steps in order for every workspace", () => {
    for (const workspace of WORKSPACES) {
      const projection = assembleProjection(workspace, ACTIVE_CAPACITY);
      expect(projection.steps.map((step) => step.step)).toEqual([...PROJECTION_ASSEMBLY_STEPS]);
      expect(projection.isSourceOfTruth).toBe(false);
      expect(projection.reusableForOtherPurpose).toBe(false);
      expect(projection.canonicalSourceRefs.length).toBeGreaterThan(0);
    }
  });

  it("marks a workspace the capacity has no membership in as restricted or gated", () => {
    const withoutMembership = WORKSPACES.filter(
      (workspace) =>
        !WORKSPACE_MEMBERSHIPS.some(
          (membership) =>
            membership.workspaceId === workspace.workspaceId &&
            membership.capacityId === ACTIVE_CAPACITY_ID,
        ),
    );
    for (const workspace of withoutMembership) {
      const projection = assembleProjection(workspace, ACTIVE_CAPACITY);
      expect(["restricted", "future-gated"]).toContain(projection.surfaceState);
    }
  });

  it("declares a governed meaning and next action for every surface state", () => {
    expect(SURFACE_STATES.length).toBe(11);
  });
});

describe("action center", () => {
  const actions = buildActions();

  it("projects obligations from canonical registers without inventing tasks", () => {
    expect(actions.length).toBeGreaterThan(0);
    expect(validateActions(actions)).toEqual([]);
    for (const action of actions) {
      expect(action.canonicalSource.objectId).not.toBe("");
      expect(action.canonicalSource.route).toMatch(/^\//);
      expect(action.authorityBasis.trim()).not.toBe("");
      expect(action.consequence.trim()).not.toBe("");
    }
  });

  it("orders actions by named factors only, never by a score", () => {
    for (let index = 1; index < actions.length; index += 1) {
      expect(priorityRank(actions[index]!.topFactor)).toBeGreaterThanOrEqual(
        priorityRank(actions[index - 1]!.topFactor),
      );
    }
    expect(PRIORITY_FACTORS[0]).toBe("safety-security-privacy-accessibility-stop");
    expect(PROHIBITED_PRIORITY_FACTORS).toContain("employee productivity score");
  });

  it("does not project the same obligation twice", () => {
    const keys = actions.map((action) => `${action.kind}:${action.canonicalSource.objectId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("universal search", () => {
  it("filters by capacity before matching or counting", () => {
    const index = buildSearchIndex();
    const restricted = index.map((record) => ({ ...record, authorizedCapacities: ["nobody"] }));
    const outcome = runSearch(
      {
        term: "",
        capacityId: ACTIVE_CAPACITY_ID,
        domain: "all",
        authority: "all",
        status: "all",
        freshness: "all",
        tense: "all",
      },
      restricted,
    );
    expect(outcome.results).toEqual([]);
    expect(outcome.authorizedMatchCount).toBe(0);
    expect(outcome.domainFacets).toEqual([]);
    expect(outcome.suggestions).toEqual([]);
    expect(outcome.withheldNotice).not.toMatch(/\d/);
  });

  it("counts and facets authorized records only", () => {
    const outcome = runSearch({
      term: "",
      capacityId: ACTIVE_CAPACITY_ID,
      domain: "all",
      authority: "all",
      status: "all",
      freshness: "all",
      tense: "all",
    });
    const total = outcome.domainFacets.reduce((sum, facet) => sum + facet.count, 0);
    expect(total).toBe(buildSearchIndex().length);
    expect(outcome.authorizedMatchCount).toBe(outcome.results.length);
  });

  it("reports no results distinctly from an empty source", () => {
    const outcome = runSearch({
      term: "zzzz-no-such-record",
      capacityId: ACTIVE_CAPACITY_ID,
      domain: "all",
      authority: "all",
      status: "all",
      freshness: "all",
      tense: "all",
    });
    expect(outcome.surfaceStateHint).toBe("no-results");
  });
});

describe("notifications", () => {
  const notifications = buildNotifications();

  it("binds every notification to a canonical object and a named action", () => {
    expect(validateNotifications(notifications)).toEqual([]);
    for (const notification of notifications) {
      expect(notification.canonicalSource.route).toMatch(/^\//);
      expect(notification.necessityBasis.trim()).not.toBe("");
      expect(notification.addressedToCapacity).toBe(ACTIVE_CAPACITY_ID);
    }
  });

  it("raises a stop notification only for blocking states", () => {
    for (const notification of notifications) {
      if (notification.severity === "stop") {
        expect(["gate-blocked", "validation-failed", "critical-risk"]).toContain(notification.trigger);
      }
    }
  });
});

describe("global utilities, patterns, and help", () => {
  it("implements all six global utilities with a route in the registry", () => {
    expect(GLOBAL_UTILITIES.map((utility) => utility.utilityId).sort()).toEqual(
      [...GLOBAL_UTILITY_IDS].sort(),
    );
    const paths = new Set(ROUTE_REGISTRY.map((route) => route.path));
    for (const utility of GLOBAL_UTILITIES) {
      expect(paths.has(utility.route)).toBe(true);
      expect(utility.createsCanonicalObjects).toEqual([]);
      expect(utility.readsCanonicalObjects.length).toBeGreaterThan(0);
    }
  });

  it("keeps every reusable pattern free of surveillance content", () => {
    for (const pattern of PROJECTION_PATTERN_CONTRACTS) {
      expect(pattern.prohibitedContent.length).toBeGreaterThan(0);
      expect(pattern.duplicationRule).toMatch(/canonical|projection|no /i);
      expect(pattern.availability).toBe("candidate");
    }
    for (const program of CROSS_FUNCTIONAL_PROGRAMS) {
      expect(program.availability).toBe("candidate");
    }
  });

  it("separates governing help content from explanatory help", () => {
    const governing = HELP_ENTRIES.filter(governsWork);
    const explanatory = HELP_ENTRIES.filter((entry) => !governsWork(entry));
    expect(governing.length).toBeGreaterThan(0);
    expect(explanatory.length).toBeGreaterThan(0);
    for (const entry of HELP_ENTRIES) {
      expect(entry.version.trim()).not.toBe("");
      expect(entry.effectiveState).toBe("effective");
    }
  });
});
