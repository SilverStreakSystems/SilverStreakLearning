import {
  CAPABILITY_DOMAINS,
  CAPABILITY_DOMAIN_META,
  SCALE_STAGES,
  TRIGGER_GATES,
  stageIndex,
  type CapabilityDomainId,
  type CapabilityType,
  type CoverageMode,
  type EnterpriseCapability,
  type IndependenceLevel,
  type MaturityLevel,
  type ScaleStage,
  type TriggerGate,
} from "@/domain";

/**
 * Query helpers for the Capability Command View.
 *
 * Deliberate omission: nothing here computes a blended readiness score,
 * percentage, or index. Counts are counts of declared records only, and a
 * count is never presented as progress.
 */

export interface CapabilityFilters {
  domain?: CapabilityDomainId | "all";
  type?: CapabilityType | "all";
  stage?: ScaleStage | "all";
  gate?: TriggerGate | "all";
  independence?: IndependenceLevel | "all";
  maturity?: MaturityLevel | "all";
  query?: string;
}

export function filterCapabilities(
  capabilities: EnterpriseCapability[],
  filters: CapabilityFilters,
): EnterpriseCapability[] {
  const q = filters.query?.trim().toLowerCase() ?? "";

  return capabilities.filter((capability) => {
    if (
      filters.domain &&
      filters.domain !== "all" &&
      capability.capabilityDomain !== filters.domain
    ) {
      return false;
    }
    if (
      filters.type &&
      filters.type !== "all" &&
      !capability.capabilityTypes.includes(filters.type)
    ) {
      return false;
    }
    if (
      filters.stage &&
      filters.stage !== "all" &&
      stageIndex(capability.stages.execution) > stageIndex(filters.stage)
    ) {
      return false;
    }
    if (filters.gate && filters.gate !== "all" && !capability.triggerGates.includes(filters.gate)) {
      return false;
    }
    if (
      filters.independence &&
      filters.independence !== "all" &&
      capability.independence.level !== filters.independence
    ) {
      return false;
    }
    if (
      filters.maturity &&
      filters.maturity !== "all" &&
      capability.currentMaturity !== filters.maturity
    ) {
      return false;
    }
    if (q.length > 0) {
      const haystack = [
        capability.capabilityId,
        capability.name,
        capability.shortName,
        capability.description,
        capability.purpose,
        capability.riskIfAbsent,
        capability.owningFunctionCandidate ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function capabilityById(
  capabilities: EnterpriseCapability[],
  id: string,
): EnterpriseCapability | undefined {
  return capabilities.find((c) => c.capabilityId === id);
}

export interface DomainSummary {
  id: CapabilityDomainId;
  name: string;
  purpose: string;
  count: number;
  independenceRequired: number;
  gatedBeforePii: number;
}

export function domainSummaries(capabilities: EnterpriseCapability[]): DomainSummary[] {
  return CAPABILITY_DOMAINS.map((id) => {
    const inDomain = capabilities.filter((c) => c.capabilityDomain === id);
    return {
      id,
      name: CAPABILITY_DOMAIN_META[id].name,
      purpose: CAPABILITY_DOMAIN_META[id].purpose,
      count: inDomain.length,
      independenceRequired: inDomain.filter((c) => c.independence.level === "required").length,
      gatedBeforePii: inDomain.filter((c) => c.triggerGates.includes("before-live-pii")).length,
    };
  });
}

/** Counts of capabilities by declared execution stage. Never a percentage. */
export function stageCounts(capabilities: EnterpriseCapability[]): Record<ScaleStage, number> {
  const counts = Object.fromEntries(SCALE_STAGES.map((s) => [s, 0])) as Record<ScaleStage, number>;
  for (const c of capabilities) counts[c.stages.execution] += 1;
  return counts;
}

export function gateGroups(
  capabilities: EnterpriseCapability[],
): { gate: TriggerGate; capabilities: EnterpriseCapability[] }[] {
  return TRIGGER_GATES.map((gate) => ({
    gate,
    capabilities: capabilities.filter((c) => c.triggerGates.includes(gate)),
  }));
}

export function independenceGroups(capabilities: EnterpriseCapability[]) {
  return {
    required: capabilities.filter((c) => c.independence.level === "required"),
    conditional: capabilities.filter((c) => c.independence.level === "conditional"),
    "not-required": capabilities.filter((c) => c.independence.level === "not-required"),
  } satisfies Record<IndependenceLevel, EnterpriseCapability[]>;
}

export function coverageGroups(capabilities: EnterpriseCapability[]) {
  const map = new Map<CoverageMode, EnterpriseCapability[]>();
  for (const capability of capabilities) {
    for (const mode of capability.consolidationEligibility) {
      const list = map.get(mode) ?? [];
      list.push(capability);
      map.set(mode, list);
    }
  }
  return map;
}

/** Dependencies touching a capability, in both directions. */
export function dependenciesFor<T extends { from: string; to: string }>(
  dependencies: T[],
  id: string,
): { outgoing: T[]; incoming: T[] } {
  return {
    outgoing: dependencies.filter((d) => d.from === id),
    incoming: dependencies.filter((d) => d.to === id),
  };
}
