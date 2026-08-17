import type { VerificationState } from "./authority";

/**
 * Two related traceability views over the same records.
 * The Governance Spine is preserved unchanged; the Enterprise Outcome chain
 * extends it. They are complementary views, not competing chains.
 */

export const GOVERNANCE_SPINE_STEPS = [
  "requirement",
  "decision",
  "task",
  "implementation",
  "validation",
  "finding",
  "evidence",
  "claim",
] as const;

export type GovernanceSpineStep = (typeof GOVERNANCE_SPINE_STEPS)[number];

export const GOVERNANCE_SPINE_LABEL: Record<GovernanceSpineStep, string> = {
  requirement: "Requirement",
  decision: "Decision",
  task: "Task",
  implementation: "Implementation",
  validation: "Validation",
  finding: "Finding",
  evidence: "Evidence",
  claim: "Claim",
};

export const ENTERPRISE_CHAIN_STEPS = [
  "north-star",
  "human-outcome",
  "principle",
  "enterprise-capability",
  "function",
  "role-decision-right",
  "value-stream",
  "work-deliverable",
  "validation",
  "evidence",
  "outcome",
  "learning",
] as const;

export type EnterpriseChainStep = (typeof ENTERPRISE_CHAIN_STEPS)[number];

export const ENTERPRISE_CHAIN_LABEL: Record<EnterpriseChainStep, string> = {
  "north-star": "North Star",
  "human-outcome": "Human / Educational Outcome",
  principle: "Principle / Constraint",
  "enterprise-capability": "Enterprise Capability",
  function: "Function",
  "role-decision-right": "Role / Decision Right",
  "value-stream": "Value Stream",
  "work-deliverable": "Work / Deliverable",
  validation: "Validation",
  evidence: "Evidence",
  outcome: "Outcome",
  learning: "Learning / Improvement",
};

export interface TraceNode<TStep extends string> {
  step: TStep;
  refId: string;
  summary: string;
  state: VerificationState;
}

export interface TraceThread<TStep extends string> {
  id: string;
  title: string;
  view: "governance-spine" | "enterprise-outcome";
  nodes: TraceNode<TStep>[];
  synthetic: boolean;
}

export type GovernanceSpineThread = TraceThread<GovernanceSpineStep>;
export type EnterpriseChainThread = TraceThread<EnterpriseChainStep>;
