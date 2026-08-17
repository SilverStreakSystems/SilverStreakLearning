# Capability Object Model

Source of truth: `src/domain/capability-architecture.ts`, interface
`EnterpriseCapability`. Every field is declared by a human. No field is inferred
from code, folder location, test results, or prior AI statements.

## Field groups

**Identity** — capabilityId, name, shortName, description, purpose,
capabilityDomain, capabilityTypes.

**Human meaning** — northStarContribution, humanBeneficiaries,
directEnterpriseBeneficiaries, harmedIfItFails, carriesBurden, retainsJudgment,
problemSolved.

**Constraints** — governingPrinciples, crossCuttingConstraints.

**Ownership and authority** — owningFunctionCandidate,
accountableExecutiveRoleCandidate, accountableDomainAuthorityCandidate,
supportingFunctions, requiredDecisionRights, requiredConsultation, stopAuthority,
independence.

**Work and output** — keyValueStreams, requiredDeliverableTypes,
requiredEvidence, requiredDataClasses, systemDependencies.

**Maturity and scale** — currentMaturity, targetMaturity, stages
(architecture, execution, dedicatedStaffing, independentAssurance, succession),
triggerGates, staffingTrigger, consolidationEligibility,
incompatibleCombinations, externalExpertEligibility, successionRequirement,
riskIfAbsent.

**Governed state** — currentAuthority, recordState, implementationStatus,
validationStatus, evidenceStatus.

**Traceability** — relatedRequirements, relatedDecisions, relatedFindings,
relatedEvidence, relatedProducts, relatedSharedServices, relatedRoles,
relatedStandards.

**Honesty fields** — knownConflicts, assumptions, unknowns, reviewTrigger,
supersession, nextDefensibleAction, notes, synthetic.

## Locked rules

- `implementationStatus`, `validationStatus`, and `evidenceStatus` are reported
  separately and never change `currentAuthority`. Locked by test.
- Every record must state a human beneficiary, a harm if it fails, a burden
  holder, a risk if absent, and a next defensible action. Locked by test.
- `synthetic` is true for every seeded record in v0.1. Locked by test.
