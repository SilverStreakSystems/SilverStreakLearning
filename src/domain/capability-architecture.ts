import type { AuthorityClass, RecordState, VerificationState } from "./authority";

/**
 * Enterprise Capability Architecture v0.1 — object model.
 *
 * A capability is a durable organizational ability SSLS must reliably possess.
 * A role, team, department, vendor, workflow, or product may implement or
 * support a capability, but none of those is automatically the capability.
 *
 * Every field below is declared by a human operator. Nothing here is inferred
 * from code, tests, file layout, or implementation status. Authority is stored,
 * never derived.
 */

/* ------------------------------------------------------------------ domains */

export const CAPABILITY_DOMAINS = [
  "D01",
  "D02",
  "D03",
  "D04",
  "D05",
  "D06",
  "D07",
  "D08",
  "D09",
  "D10",
  "D11",
  "D12",
] as const;

export type CapabilityDomainId = (typeof CAPABILITY_DOMAINS)[number];

export interface CapabilityDomainMeta {
  id: CapabilityDomainId;
  name: string;
  purpose: string;
}

export const CAPABILITY_DOMAIN_META: Record<CapabilityDomainId, CapabilityDomainMeta> = {
  D01: {
    id: "D01",
    name: "Enterprise Direction and Governance",
    purpose: "Decide what is true, what is authorized, and what may be claimed.",
  },
  D02: {
    id: "D02",
    name: "Learning, Academics and Educational Validity",
    purpose: "Make sure what SSLS teaches and measures is educationally sound.",
  },
  D03: {
    id: "D03",
    name: "Product and Experience",
    purpose: "Turn educational intent into usable, accessible product experience.",
  },
  D04: {
    id: "D04",
    name: "Engineering and Platform",
    purpose: "Build and operate the systems the product depends on.",
  },
  D05: {
    id: "D05",
    name: "Data, Analytics and Artificial Intelligence",
    purpose: "Govern, model, and reason over data without overstating what it shows.",
  },
  D06: {
    id: "D06",
    name: "Trust, Security, Privacy and Assurance",
    purpose: "Protect people and their information, and prove that protection independently.",
  },
  D07: {
    id: "D07",
    name: "Quality, Validation and Release",
    purpose: "Establish whether something actually works before it is released or claimed.",
  },
  D08: {
    id: "D08",
    name: "Revenue, Market and Partnerships",
    purpose: "Reach districts honestly and convert genuine fit into agreements.",
  },
  D09: {
    id: "D09",
    name: "Customer, Implementation and Service",
    purpose: "Make adoption succeed in real schools, and keep it working.",
  },
  D10: {
    id: "D10",
    name: "Finance, Legal and Corporate Operations",
    purpose: "Keep the enterprise solvent, lawful, and operationally intact.",
  },
  D11: {
    id: "D11",
    name: "People, Talent and Organizational Capability",
    purpose: "Get the right human capability in place and keep it healthy.",
  },
  D12: {
    id: "D12",
    name: "Organizational Learning and Continuous Improvement",
    purpose: "Convert what happened into what changes next.",
  },
};

/* -------------------------------------------------------------------- types */

export const CAPABILITY_TYPES = [
  "mission-doctrine",
  "governance",
  "educational",
  "product",
  "experience-accessibility",
  "technical",
  "data",
  "ai-automation-governance",
  "security",
  "privacy-trust",
  "quality-validation",
  "research-evidence",
  "revenue-commercial",
  "customer-implementation",
  "support-service",
  "finance-legal-operations",
  "workforce-people",
  "organizational-learning",
] as const;

export type CapabilityType = (typeof CAPABILITY_TYPES)[number];

export const CAPABILITY_TYPE_LABEL: Record<CapabilityType, string> = {
  "mission-doctrine": "Mission / Doctrine",
  governance: "Governance",
  educational: "Educational",
  product: "Product",
  "experience-accessibility": "Experience / Accessibility",
  technical: "Technical",
  data: "Data",
  "ai-automation-governance": "AI / Automation Governance",
  security: "Security",
  "privacy-trust": "Privacy / Trust",
  "quality-validation": "Quality / Validation",
  "research-evidence": "Research / Evidence",
  "revenue-commercial": "Revenue / Commercial",
  "customer-implementation": "Customer / Implementation",
  "support-service": "Support / Service",
  "finance-legal-operations": "Finance / Legal / Operations",
  "workforce-people": "Workforce / People",
  "organizational-learning": "Organizational Learning",
};

/* ------------------------------------------------------------ beneficiaries */

export const BENEFICIARY_CLASSES = [
  "learner",
  "educator",
  "family",
  "specialist",
  "school-leader",
  "district-leader",
  "implementation-professional",
  "support-professional",
  "ssls-employee",
  "partner",
  "customer-organization",
  "ssls-enterprise",
  "public",
] as const;

export type BeneficiaryClass = (typeof BENEFICIARY_CLASSES)[number];

export const BENEFICIARY_LABEL: Record<BeneficiaryClass, string> = {
  learner: "Learner",
  educator: "Educator",
  family: "Family / caregiver",
  specialist: "Specialist",
  "school-leader": "School leader",
  "district-leader": "District leader",
  "implementation-professional": "Implementation professional",
  "support-professional": "Support professional",
  "ssls-employee": "SSLS employee",
  partner: "Partner",
  "customer-organization": "Customer organization",
  "ssls-enterprise": "SSLS enterprise",
  public: "Public / community",
};

/* ------------------------------------------------------------- scale stages */

export const SCALE_STAGES = ["S0", "S1", "S2", "S3", "S4", "S5"] as const;
export type ScaleStage = (typeof SCALE_STAGES)[number];

export const SCALE_STAGE_LABEL: Record<ScaleStage, string> = {
  S0: "S0 — Founder / Governed Proof",
  S1: "S1 — Core Product Team",
  S2: "S2 — Early Customer / Controlled Pilot",
  S3: "S3 — Growth",
  S4: "S4 — Scale",
  S5: "S5 — Mature Enterprise",
};

/** The stage SSLS is currently operating in. Declared, not calculated. */
export const CURRENT_SCALE_STAGE: ScaleStage = "S0";

export function stageIndex(stage: ScaleStage): number {
  return SCALE_STAGES.indexOf(stage);
}

/** True when a stage is at or before the current declared stage. */
export function stageReached(
  stage: ScaleStage,
  current: ScaleStage = CURRENT_SCALE_STAGE,
): boolean {
  return stageIndex(stage) <= stageIndex(current);
}

export interface CapabilityStageProfile {
  /** Earliest stage where the architecture must exist. */
  architecture: ScaleStage;
  /** Earliest stage where execution must exist. */
  execution: ScaleStage;
  /** Stage where dedicated staffing is required. */
  dedicatedStaffing: ScaleStage;
  /** Stage where independent assurance becomes mandatory. */
  independentAssurance: ScaleStage;
  /** Stage where redundancy and succession become mandatory. */
  succession: ScaleStage;
}

/* --------------------------------------------------------------- maturities */

export const MATURITY_LEVELS = ["absent", "initial", "defined", "managed", "assured"] as const;
export type MaturityLevel = (typeof MATURITY_LEVELS)[number];

export const MATURITY_LEVEL_LABEL: Record<MaturityLevel, string> = {
  absent: "Absent",
  initial: "Initial",
  defined: "Defined",
  managed: "Managed",
  assured: "Assured",
};

/* ----------------------------------------------------------------- triggers */

export const TRIGGER_GATES = [
  "before-live-pii",
  "before-product-ai",
  "before-district-pilot",
  "before-public-outcome-claims",
  "before-enterprise-scale",
] as const;

export type TriggerGate = (typeof TRIGGER_GATES)[number];

export interface TriggerGateMeta {
  id: TriggerGate;
  label: string;
  marker: string;
  meaning: string;
  /** Whether the gate has been crossed in the current authorized posture. */
  crossed: boolean;
}

export const TRIGGER_GATE_META: Record<TriggerGate, TriggerGateMeta> = {
  "before-live-pii": {
    id: "before-live-pii",
    label: "Before live personal data",
    marker: "[PII]",
    meaning: "Must exist before any real personal information enters a system.",
    crossed: false,
  },
  "before-product-ai": {
    id: "before-product-ai",
    label: "Before product-facing AI",
    marker: "[AI]",
    meaning: "Must exist before any AI feature reaches a person outside SSLS.",
    crossed: false,
  },
  "before-district-pilot": {
    id: "before-district-pilot",
    label: "Before district pilot",
    marker: "[PILOT]",
    meaning: "Must exist before a district uses the product with real staff or learners.",
    crossed: false,
  },
  "before-public-outcome-claims": {
    id: "before-public-outcome-claims",
    label: "Before public outcome claims",
    marker: "[CLAIM]",
    meaning: "Must exist before SSLS states publicly that it improves outcomes.",
    crossed: false,
  },
  "before-enterprise-scale": {
    id: "before-enterprise-scale",
    label: "Before enterprise scale",
    marker: "[SCALE]",
    meaning: "Must exist before the enterprise operates beyond a small team.",
    crossed: false,
  },
};

/* ------------------------------------------------------------- independence */

export const INDEPENDENCE_LEVELS = ["required", "conditional", "not-required"] as const;
export type IndependenceLevel = (typeof INDEPENDENCE_LEVELS)[number];

export const INDEPENDENCE_LABEL: Record<IndependenceLevel, string> = {
  required: "Independent review required",
  conditional: "Independent review conditional",
  "not-required": "Independent review not required",
};

export const INDEPENDENCE_MARKER: Record<IndependenceLevel, string> = {
  required: "[IND REQ]",
  conditional: "[IND COND]",
  "not-required": "[IND N/R]",
};

export interface IndependenceRule {
  level: IndependenceLevel;
  /** Required when the level is conditional. Names the triggering condition. */
  trigger: string | null;
  /** Who may not also be the final validator. */
  separationOfDuties: string;
}

/* ---------------------------------------------------------- coverage modes */

export const COVERAGE_MODES = [
  "founder",
  "combined-internal-role",
  "dedicated-internal-role",
  "external-specialist",
  "independent-external-review",
  "automated-system-support",
  "not-yet-required",
] as const;

export type CoverageMode = (typeof COVERAGE_MODES)[number];

export const COVERAGE_MODE_LABEL: Record<CoverageMode, string> = {
  founder: "Founder",
  "combined-internal-role": "Combined internal role",
  "dedicated-internal-role": "Dedicated internal role",
  "external-specialist": "External specialist",
  "independent-external-review": "Independent external review",
  "automated-system-support": "Automated / deterministic system support",
  "not-yet-required": "Not yet required",
};

/* ------------------------------------------------------------ value streams */

export const VALUE_STREAMS = [
  "strategy-portfolio",
  "research-requirement",
  "requirement-decision",
  "decision-build",
  "build-validation",
  "validation-release",
  "opportunity-contract",
  "contract-implementation",
  "implementation-adoption",
  "adoption-outcome",
  "outcome-research",
  "incident-recovery-learning",
  "feedback-decision",
  "hire-develop-retain",
  "vendor-lifecycle",
  "evidence-claim",
  "governance-artifact-lifecycle",
  "ai-capability-lifecycle",
] as const;

export type ValueStreamId = (typeof VALUE_STREAMS)[number];

export const VALUE_STREAM_LABEL: Record<ValueStreamId, string> = {
  "strategy-portfolio": "Strategy → Portfolio",
  "research-requirement": "Research → Requirement",
  "requirement-decision": "Requirement → Decision",
  "decision-build": "Decision → Build",
  "build-validation": "Build → Validation",
  "validation-release": "Validation → Release",
  "opportunity-contract": "Opportunity → Contract",
  "contract-implementation": "Contract → Implementation",
  "implementation-adoption": "Implementation → Adoption",
  "adoption-outcome": "Adoption → Outcome",
  "outcome-research": "Outcome → Research / Improvement",
  "incident-recovery-learning": "Incident → Recovery → Learning",
  "feedback-decision": "Feedback → Decision",
  "hire-develop-retain": "Hire → Develop → Retain",
  "vendor-lifecycle": "Vendor → Review → Contract → Monitor → Exit",
  "evidence-claim": "Evidence → Claim",
  "governance-artifact-lifecycle": "Governance Artifact → Promotion / Supersession",
  "ai-capability-lifecycle": "AI Capability Lifecycle (gated future)",
};

/* ---------------------------------------------------------------- functions */

/**
 * The 15 candidate enterprise functions carried forward from the workforce
 * architecture candidate. Not rewritten in this increment.
 */
export const ENTERPRISE_FUNCTIONS = [
  "Strategy and Governance",
  "Research and Intelligence",
  "Learning Design and Academics",
  "Product and Learning Systems",
  "Experience and Accessibility",
  "Engineering and Delivery",
  "Data and Measurement",
  "Trust, Quality and Assurance",
  "Security and Privacy",
  "Revenue and Market",
  "Customer and Implementation",
  "Support and Service",
  "Finance and Legal",
  "Enterprise Operations",
  "People and Organizational Learning",
] as const;

export type EnterpriseFunction = (typeof ENTERPRISE_FUNCTIONS)[number];

/* --------------------------------------------------------------- dependency */

export const DEPENDENCY_KINDS = [
  "depends_on",
  "enables",
  "constrained_by",
  "reviewed_by",
  "validated_by",
  "supplies_evidence_to",
  "required_before",
  "shares_service_with",
  "conflicts_with",
  "supersedes",
] as const;

export type DependencyKind = (typeof DEPENDENCY_KINDS)[number];

export const DEPENDENCY_KIND_LABEL: Record<DependencyKind, string> = {
  depends_on: "Depends on",
  enables: "Enables",
  constrained_by: "Constrained by",
  reviewed_by: "Reviewed by",
  validated_by: "Validated by",
  supplies_evidence_to: "Supplies evidence to",
  required_before: "Required before",
  shares_service_with: "Shares service with",
  conflicts_with: "Conflicts with",
  supersedes: "Supersedes",
};

export interface CapabilityDependency {
  from: string;
  kind: DependencyKind;
  to: string;
  /** Why the relationship exists, in plain language. */
  rationale: string;
}

/* ------------------------------------------------------- the capability itself */

export interface EnterpriseCapability {
  capabilityId: string;
  name: string;
  shortName: string;
  description: string;
  purpose: string;
  capabilityDomain: CapabilityDomainId;
  /** A capability may legitimately carry more than one type. */
  capabilityTypes: CapabilityType[];

  northStarContribution: string;
  humanBeneficiaries: BeneficiaryClass[];
  directEnterpriseBeneficiaries: string[];
  harmedIfItFails: string;
  carriesBurden: string;
  retainsJudgment: string;
  problemSolved: string;

  governingPrinciples: string[];
  crossCuttingConstraints: string[];

  owningFunctionCandidate: EnterpriseFunction | null;
  accountableExecutiveRoleCandidate: string | null;
  accountableDomainAuthorityCandidate: string | null;
  supportingFunctions: EnterpriseFunction[];
  requiredDecisionRights: string[];
  requiredConsultation: string[];
  stopAuthority: string;
  independence: IndependenceRule;

  keyValueStreams: ValueStreamId[];
  requiredDeliverableTypes: string[];
  requiredEvidence: string[];
  requiredDataClasses: string[];
  systemDependencies: string[];

  currentMaturity: MaturityLevel;
  targetMaturity: MaturityLevel;
  stages: CapabilityStageProfile;
  triggerGates: TriggerGate[];
  staffingTrigger: string;
  consolidationEligibility: CoverageMode[];
  incompatibleCombinations: string[];
  externalExpertEligibility: string;
  successionRequirement: string;
  riskIfAbsent: string;

  currentAuthority: AuthorityClass;
  recordState: RecordState;
  implementationStatus: VerificationState;
  validationStatus: VerificationState;
  evidenceStatus: VerificationState;

  relatedRequirements: string[];
  relatedDecisions: string[];
  relatedFindings: string[];
  relatedEvidence: string[];
  relatedProducts: string[];
  relatedSharedServices: string[];
  relatedRoles: string[];
  relatedStandards: string[];

  knownConflicts: string[];
  assumptions: string[];
  unknowns: string[];
  reviewTrigger: string;
  supersession: string | null;
  nextDefensibleAction: string;
  notes: string | null;
  synthetic: boolean;
}

/* ------------------------------------------------------------- normalization */

export const NORMALIZATION_KINDS = [
  "duplicate",
  "synonym",
  "actually-a-role",
  "actually-a-process",
  "actually-a-deliverable",
  "actually-a-module",
  "missing-capability",
  "over-specialized",
  "cross-cutting",
  "independence-sensitive",
] as const;

export type NormalizationKind = (typeof NORMALIZATION_KINDS)[number];

export const NORMALIZATION_KIND_LABEL: Record<NormalizationKind, string> = {
  duplicate: "Duplicate concept",
  synonym: "Synonym",
  "actually-a-role": "Actually a role",
  "actually-a-process": "Actually a process",
  "actually-a-deliverable": "Actually a deliverable",
  "actually-a-module": "Actually a module or product",
  "missing-capability": "Missing capability",
  "over-specialized": "Over-specialized",
  "cross-cutting": "Cross-cutting",
  "independence-sensitive": "Independence sensitive",
};

export interface NormalizationFinding {
  id: string;
  kind: NormalizationKind;
  /** The taxonomy terms the finding is about. */
  subjects: string[];
  /** Capability records the resolution produced or affected. */
  resolvedInto: string[];
  statement: string;
  /** What the finding explicitly does not assert. */
  boundary: string;
  resolutionState: VerificationState;
  synthetic: boolean;
}
