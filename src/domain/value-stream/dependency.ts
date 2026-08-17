/**
 * Dependency model.
 *
 * A dependency that nobody owns is a hidden dependency, and hidden
 * dependencies surface as findings rather than staying invisible.
 */
import type { EnterpriseFunctionId } from "./functions";

export const STREAM_DEPENDENCY_KINDS = [
  "stage",
  "object",
  "capability",
  "external",
  "evidence",
  "decision",
] as const;

export type StreamDependencyKind = (typeof STREAM_DEPENDENCY_KINDS)[number];

export const STREAM_DEPENDENCY_KIND_LABEL: Record<StreamDependencyKind, string> = {
  stage: "Stage dependency",
  object: "Object dependency",
  capability: "Capability dependency",
  external: "External dependency",
  evidence: "Evidence dependency",
  decision: "Decision dependency",
};

export const DEPENDENCY_STATES = ["not-started", "in-progress", "satisfied", "at-risk", "failed"] as const;
export type DependencyState = (typeof DEPENDENCY_STATES)[number];

export const DEPENDENCY_CRITICALITY = ["critical", "high", "moderate", "low"] as const;
export type DependencyCriticality = (typeof DEPENDENCY_CRITICALITY)[number];

export interface DependencyRecord {
  dependencyId: string;
  kind: StreamDependencyKind;
  valueStreamId: string;
  /** The stage that cannot proceed while this dependency is unmet. */
  dependentStageId: string;
  description: string;
  /** Null owner is itself a finding: an unowned dependency blocks silently. */
  owner: EnterpriseFunctionId | null;
  state: DependencyState;
  blocking: boolean;
  criticality: DependencyCriticality;
  fallback: string | null;
  reviewDate: string;
  evidence: string | null;
  escalation: string;
}

export function isBlocked(dependency: DependencyRecord): boolean {
  return dependency.blocking && dependency.state !== "satisfied";
}

export function blockedStageIds(dependencies: DependencyRecord[]): string[] {
  return Array.from(new Set(dependencies.filter(isBlocked).map((d) => d.dependentStageId)));
}

export interface HiddenDependencyFinding {
  dependencyId: string;
  detail: string;
}

export function hiddenDependencies(dependencies: DependencyRecord[]): HiddenDependencyFinding[] {
  return dependencies
    .filter((d) => d.owner === null || d.escalation.trim() === "")
    .map((d) => ({
      dependencyId: d.dependencyId,
      detail:
        d.owner === null
          ? "No function owns this dependency, so nobody is accountable for clearing it."
          : "No escalation path, so a stalled dependency has nowhere to go.",
    }));
}
