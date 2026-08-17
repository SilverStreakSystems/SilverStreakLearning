import type {
  BeneficiaryClass,
  CapabilityDomainId,
  CapabilityType,
  CoverageMode,
  EnterpriseCapability,
  EnterpriseFunction,
  IndependenceLevel,
  MaturityLevel,
  ScaleStage,
  TriggerGate,
  ValueStreamId,
} from "@/domain";

/**
 * Compact seed shape used by the domain seed files.
 *
 * The builder only fills *stated* defaults. It never infers authority: every
 * record produced here is a Research / Candidate record in candidate state,
 * because no Approved Decision has promoted the Enterprise Capability
 * Architecture.
 */
export interface CapabilitySeed {
  id: string;
  name: string;
  short: string;
  desc: string;
  purpose: string;
  types: CapabilityType[];
  northStar: string;
  benefits: BeneficiaryClass[];
  entBenefits?: string[];
  harm: string;
  burden: string;
  judgment: string;
  problem: string;
  principles?: string[];
  constraints?: string[];
  fn: EnterpriseFunction;
  exec?: string;
  authorityRole?: string;
  support?: EnterpriseFunction[];
  rights?: string[];
  consult?: string[];
  stop?: string;
  ind: IndependenceLevel;
  indTrigger?: string;
  sod?: string;
  streams?: ValueStreamId[];
  deliverables: string[];
  evidence: string[];
  data?: string[];
  systems?: string[];
  maturity?: MaturityLevel;
  target?: MaturityLevel;
  /** [architecture, execution, dedicated staffing, independent assurance, succession] */
  stages: [ScaleStage, ScaleStage, ScaleStage, ScaleStage, ScaleStage];
  gates?: TriggerGate[];
  staffTrigger?: string;
  consolidation?: CoverageMode[];
  incompatible?: string[];
  external?: string;
  succession?: string;
  risk: string;
  requirements?: string[];
  decisions?: string[];
  findings?: string[];
  evidenceRefs?: string[];
  products?: string[];
  services?: string[];
  roles?: string[];
  standards?: string[];
  conflicts?: string[];
  assumptions?: string[];
  unknowns?: string[];
  review?: string;
  next?: string;
  notes?: string;
}

export interface DomainDefaults {
  principles: string[];
  constraints: string[];
  streams: ValueStreamId[];
  exec: string;
  consolidation: CoverageMode[];
  review: string;
}

export function buildCapabilities(
  domain: CapabilityDomainId,
  defaults: DomainDefaults,
  seeds: CapabilitySeed[],
): EnterpriseCapability[] {
  return seeds.map((s) => {
    const maturity: MaturityLevel = s.maturity ?? "absent";
    return {
      capabilityId: s.id,
      name: s.name,
      shortName: s.short,
      description: s.desc,
      purpose: s.purpose,
      capabilityDomain: domain,
      capabilityTypes: s.types,

      northStarContribution: s.northStar,
      humanBeneficiaries: s.benefits,
      directEnterpriseBeneficiaries: s.entBenefits ?? ["SSLS enterprise"],
      harmedIfItFails: s.harm,
      carriesBurden: s.burden,
      retainsJudgment: s.judgment,
      problemSolved: s.problem,

      governingPrinciples: s.principles ?? defaults.principles,
      crossCuttingConstraints: s.constraints ?? defaults.constraints,

      owningFunctionCandidate: s.fn,
      accountableExecutiveRoleCandidate: s.exec ?? defaults.exec,
      accountableDomainAuthorityCandidate: s.authorityRole ?? null,
      supportingFunctions: s.support ?? [],
      requiredDecisionRights: s.rights ?? ["Approve the deliverables named on this record."],
      requiredConsultation: s.consult ?? [],
      stopAuthority: s.stop ?? "Founder operator, until a governed role exists.",
      independence: {
        level: s.ind,
        trigger: s.indTrigger ?? null,
        separationOfDuties:
          s.sod ??
          (s.ind === "not-required"
            ? "No separation required at the declared stage."
            : "The person who produces the work may not be its final validator."),
      },

      keyValueStreams: s.streams ?? defaults.streams,
      requiredDeliverableTypes: s.deliverables,
      requiredEvidence: s.evidence,
      requiredDataClasses: s.data ?? ["No personal data in the current posture."],
      systemDependencies: s.systems ?? ["None declared."],

      currentMaturity: maturity,
      targetMaturity: s.target ?? "defined",
      stages: {
        architecture: s.stages[0],
        execution: s.stages[1],
        dedicatedStaffing: s.stages[2],
        independentAssurance: s.stages[3],
        succession: s.stages[4],
      },
      triggerGates: s.gates ?? [],
      staffingTrigger: s.staffTrigger ?? `Dedicated staffing at ${s.stages[2]}.`,
      consolidationEligibility: s.consolidation ?? defaults.consolidation,
      incompatibleCombinations: s.incompatible ?? [],
      externalExpertEligibility:
        s.external ?? "External specialist support is permitted; accountability stays internal.",
      successionRequirement:
        s.succession ?? `Named backup and written handover required at ${s.stages[4]}.`,
      riskIfAbsent: s.risk,

      currentAuthority: "research-candidate",
      recordState: "candidate",
      implementationStatus: maturity === "absent" ? "not-run" : "not-verified",
      validationStatus: "not-run",
      evidenceStatus: maturity === "absent" ? "unknown" : "not-verified",

      relatedRequirements: s.requirements ?? [],
      relatedDecisions: s.decisions ?? [],
      relatedFindings: s.findings ?? [],
      relatedEvidence: s.evidenceRefs ?? [],
      relatedProducts: s.products ?? [],
      relatedSharedServices: s.services ?? [],
      relatedRoles: s.roles ?? [],
      relatedStandards: s.standards ?? [],

      knownConflicts: s.conflicts ?? [],
      assumptions: s.assumptions ?? [
        "The capability is described from the present architecture, not from an approved registry.",
      ],
      unknowns: s.unknowns ?? ["Whether this capability survives promotion review unchanged."],
      reviewTrigger: s.review ?? defaults.review,
      supersession: null,
      nextDefensibleAction:
        s.next ?? "Review this candidate record and decide whether to promote it to Requirement.",
      notes: s.notes ?? null,
      synthetic: true,
    } satisfies EnterpriseCapability;
  });
}
