/**
 * Reusable projection patterns.
 *
 * One configurable projection architecture, not fifteen disconnected
 * dashboards. Each pattern is a contract that a future function, manager,
 * individual, or programme surface will be configured against.
 */

export const PROJECTION_PATTERNS = [
  "function-command-center",
  "manager-view",
  "individual-action-center",
  "cross-functional-program",
] as const;

export type ProjectionPatternId = (typeof PROJECTION_PATTERNS)[number];

export const PROJECTION_PATTERN_LABEL: Record<ProjectionPatternId, string> = {
  "function-command-center": "Function command center",
  "manager-view": "Manager view",
  "individual-action-center": "Individual action center",
  "cross-functional-program": "Cross-functional program view",
};

export interface ProjectionPatternContract {
  patternId: ProjectionPatternId;
  purpose: string;
  /** Availability is candidate: none of these are staffed or operating. */
  availability: "candidate";
  /** Sections in display order, each with the canonical objects it reads. */
  sections: { sectionId: string; label: string; reads: string[] }[];
  requiredContext: string[];
  prohibitedContent: string[];
  duplicationRule: string;
  accessibilityRequirements: string[];
  configurationNote: string;
}

export const FUNCTION_COMMAND_CENTER_SECTIONS = ["incoming", "internal", "outgoing"] as const;

export interface CrossFunctionalProgram {
  programId: string;
  name: string;
  question: string;
  participatingFunctions: string[];
  sharedValueStreamStages: string[];
  sharedDecisions: string[];
  sharedDeliverables: string[];
  sharedDependencies: string[];
  sharedGates: string[];
  sharedEvidence: string[];
  sharedRisks: string[];
  sharedFindings: string[];
  availability: "candidate";
  duplicationRule: string;
}
