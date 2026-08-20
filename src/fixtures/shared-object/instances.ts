/**
 * Worked examples — SYNTHETIC ONLY.
 *
 * These records exist to prove the contracts can carry real shapes, including
 * the uncomfortable ones: work with a missing served object, evidence bound to
 * a version, a claim that must stay refused, and a context package that is
 * conflicted rather than tidy. No record describes a real person or district.
 */
import type {
  AuthorizationRule,
  ContextPackage,
  ContextProjectionDefinition,
  DeliverableInstance,
  EventRecord,
  GovernedClaim,
  HandoffTerms,
  KnowledgeObjectRecord,
  Provenance,
  ResearchRecord,
  SharedEvidenceRecord,
  SourceRecord,
  WorkItem,
} from "@/domain";

const provenance = (locator: string, limitation: string): Provenance => ({
  sourceType: "synthetic-fixture",
  sourceLocator: locator,
  recordedBy: "founder-developer",
  recordedAt: "2026-01-05",
  limitation,
});

export const EXAMPLE_WORK_ITEMS: WorkItem[] = [
  {
    workItemId: "WRK-001",
    workType: "governance-action",
    purpose:
      "Give the shared object catalog a reviewable definition before any storage is designed.",
    title: "Define the shared object catalog",
    description:
      "Produce candidate definitions for every shared object type, with normalization judgments recorded.",
    owner: "role-founder-developer",
    contributors: [],
    servedObjectId: "OBJ-TYPE-CATALOG",
    servedObjectException: null,
    relatedCapabilityIds: ["CAP-D01-003"],
    relatedRequirementIds: ["REQ-001"],
    relatedDecisionIds: ["DEC-001"],
    priority: "high",
    workflowState: "complete",
    dueDate: null,
    dependsOnWorkItemIds: [],
    acceptanceCriteria: [
      "Every type answers why it exists.",
      "Every type declares canonicality and instantiability.",
      "Rejected candidates are recorded with the cost of rejecting them.",
    ],
    requiredDeliverableTypeIds: ["DT-02"],
    requiredEvidenceIds: ["EVD-SO-001"],
    completionResult: "Catalog defined with thirty-two types; nine candidates demoted or deferred.",
    escalationRoleId: null,
    provenance: provenance(
      "src/fixtures/shared-object/catalog.ts",
      "Definition work only. No storage exists.",
    ),
    auditRequired: true,
    synthetic: true,
  },
  {
    workItemId: "WRK-002",
    workType: "validation-work",
    purpose:
      "Check that authority state cannot be read off implementation state anywhere in the shell.",
    title: "Validate state axis independence",
    description: "Automated checks over the domain vocabularies and fixtures.",
    owner: "role-founder-developer",
    contributors: [],
    servedObjectId: "OBJ-STATE-MODEL",
    servedObjectException: null,
    relatedCapabilityIds: ["CAP-D07-001"],
    relatedRequirementIds: ["REQ-002"],
    relatedDecisionIds: [],
    priority: "blocking",
    workflowState: "complete",
    dueDate: null,
    dependsOnWorkItemIds: ["WRK-001"],
    acceptanceCriteria: ["No axis value implies a value on another axis."],
    requiredDeliverableTypeIds: ["DT-09"],
    requiredEvidenceIds: ["EVD-SO-002"],
    completionResult:
      "Checks pass. Independence is asserted by the same operator who built the model.",
    escalationRoleId: null,
    provenance: provenance(
      "src/test/shared-object.test.ts",
      "Self-executed. Not independent validation.",
    ),
    auditRequired: true,
    synthetic: true,
  },
  {
    workItemId: "WRK-003",
    workType: "follow-up",
    purpose: "Investigate whether context packages should be persisted at all.",
    title: "Decide context package persistence",
    description: "Open question carried from the context contract. No served object yet by design.",
    owner: "role-founder-developer",
    contributors: [],
    servedObjectId: null,
    servedObjectException:
      "Exception accepted by the founder operator: the object this would serve does not exist until the question is answered.",
    relatedCapabilityIds: ["CAP-D05-003"],
    relatedRequirementIds: [],
    relatedDecisionIds: [],
    priority: "normal",
    workflowState: "open",
    dueDate: null,
    dependsOnWorkItemIds: [],
    acceptanceCriteria: ["A recorded decision either way, with the privacy trade-off stated."],
    requiredDeliverableTypeIds: ["DT-04"],
    requiredEvidenceIds: [],
    completionResult: null,
    escalationRoleId: "role-founder-developer",
    provenance: provenance(
      "docs/shared-object/OBJECT_OPEN_QUESTIONS.md",
      "An open question, not a plan.",
    ),
    auditRequired: true,
    synthetic: true,
  },
];

export const EXAMPLE_HANDOFFS: HandoffTerms[] = [
  {
    handoffId: "HDF-001",
    relationshipId: "REL-HDF-001",
    sendingRoleId: "role-founder-developer",
    receivingRoleId: "role-independent-validator",
    objectId: "WRK-002",
    requiredStateOnSend: "workflow: complete, evidence: current",
    requiredAccompanyingEvidenceIds: ["EVD-SO-002"],
    acceptanceCriteria: ["Validator can re-run the checks from the recorded locator."],
    rejectionPath: "Returned to the sender as an open finding naming what was missing.",
    overduePath: "Remains outstanding and visible. Nothing auto-accepts.",
    escalationRoleId: "role-founder-developer",
    accepted: false,
    acceptedBy: null,
    acceptedAt: null,
    synthetic: true,
  },
];

export const EXAMPLE_DELIVERABLES: DeliverableInstance[] = [
  {
    deliverableId: "DLV-001",
    deliverableTypeId: "DT-02",
    purpose: "Give every future capability one place to look up what an object means.",
    title: "Shared Object Catalog v0.1",
    accountableRoleId: "role-founder-developer",
    responsibleContributors: ["role-founder-developer"],
    requiredReviewerRoleId: "role-independent-validator",
    approverRoleId: "role-founder-developer",
    trigger: "Completion of the shared object normalization pass.",
    dueDate: null,
    cadence: null,
    linkedCapabilityIds: ["CAP-D01-003"],
    linkedRequirementIds: ["REQ-001"],
    linkedDecisionIds: ["DEC-001"],
    requiredContents: [
      "Type definitions",
      "Normalization dispositions",
      "Relationship permissions",
    ],
    acceptanceCriteria: ["Every type answers the eighteen detail questions."],
    artifactReferenceId: "ART-001",
    requiredEvidenceIds: ["EVD-SO-001"],
    workflowState: "complete",
    validationState: "not-run",
    evidenceState: "partial",
    approvalState: "pending",
    publicationState: "internal",
    authorityState: "research-candidate",
    currentVersion: "0.1.0",
    supersedes: [],
    supersededBy: null,
    claimRelevance: [],
    provenance: provenance(
      "src/fixtures/shared-object/catalog.ts",
      "Produced and reviewed by the same operator.",
    ),
    synthetic: true,
  },
];

export const EXAMPLE_EVENTS: EventRecord[] = [
  {
    eventId: "EVT-001",
    eventType: "governance-review",
    purpose: "Review whether the shared object architecture should be promoted beyond candidate.",
    title: "Shared object architecture review",
    startsAt: "2026-02-02T15:00:00Z",
    endsAt: "2026-02-02T16:00:00Z",
    timezone: "America/Chicago",
    participants: [
      {
        actingCapacityId: "CAP-CAPACITY-FOUNDER",
        required: true,
        reasonForParticipation: "Holds the authority to promote or refuse promotion.",
      },
    ],
    mode: "virtual",
    location: null,
    relatedObjectIds: ["OBJ-TYPE-CATALOG", "DLV-001"],
    visibilityRule: "Internal only. No external participants exist in the current boundary.",
    recurrenceRule: null,
    outcome: null,
    evidenceIds: [],
    cancelled: false,
    cancellationReason: null,
    provenance: provenance("docs/shared-object/OBJECT_OPEN_QUESTIONS.md", "Planned, not held."),
    synthetic: true,
  },
];

export const EXAMPLE_SOURCES: SourceRecord[] = [
  {
    sourceId: "SRC-001",
    title: "Internal accessibility standard ULW-AS-001 v1.3",
    sourceKind: "internal-document",
    locator: "docs/ACCESSIBILITY_ACCEPTANCE.md",
    publishedOn: "2026-01-02",
    retrievedOn: "2026-01-05",
    reliabilityNote: "Internally authored. Not an external conformance authority.",
    synthetic: true,
  },
];

export const EXAMPLE_RESEARCH: ResearchRecord[] = [
  {
    researchId: "RSR-001",
    question: "Should dependency, handoff, escalation, and commitment be first-class objects?",
    method:
      "Comparison of the questions each must answer against the questions a typed edge can answer.",
    sourceIds: ["SRC-001"],
    observations: [
      {
        statement: "Each candidate always names exactly two parties and one object in between.",
        confidence: "confirmed",
      },
      {
        statement: "Handoff needs terms of acceptance that a bare edge cannot hold.",
        confidence: "confirmed",
      },
      {
        statement:
          "Making them objects would double the number of records without adding a question they answer.",
        confidence: "supported-interpretation",
      },
    ],
    interpretations: [
      "Typed relationships with attached terms are sufficient until a value stream needs to queue handoffs.",
    ],
    limitations: ["No operational workflow exists yet to test the judgment against."],
    couldInformRequirementIds: ["REQ-001"],
    authorityState: "research-candidate",
    freshnessState: "current",
    publicationState: "internal",
    provenance: provenance(
      "docs/shared-object/RELATIONSHIP_NORMALIZATION_FINDINGS.md",
      "Reasoning, not measurement.",
    ),
    synthetic: true,
  },
];

export const EXAMPLE_KNOWLEDGE: KnowledgeObjectRecord[] = [
  {
    knowledgeId: "KNW-001",
    knowledgeType: "guidance",
    title: "How to decide shared versus bounded",
    purpose: "Give a repeatable test so centralization stops being a matter of taste.",
    ownerCapabilityId: "CAP-D01-003",
    authorityState: "current-summary",
    publicationState: "internal",
    freshnessState: "current",
    version: "0.1.0",
    supersedes: [],
    supersededBy: null,
    reviewTrigger: "Any new product domain enters the architecture.",
    provenance: provenance(
      "docs/shared-object/SHARED_ENTERPRISE_OBJECT_ARCHITECTURE.md",
      "Guidance, not policy.",
    ),
    synthetic: true,
  },
];

export const EXAMPLE_EVIDENCE: SharedEvidenceRecord[] = [
  {
    evidenceId: "EVD-SO-001",
    evidenceType: "document-review",
    propositionSupported: "Every shared object type in the catalog answers why it exists.",
    sourceId: "SRC-001",
    collectedAt: "2026-01-05",
    subjectVersion: "catalog 0.1.0",
    environment: null,
    scenario:
      "Read each catalog record and check the reason for existence is non-empty and specific.",
    method: "Manual read plus an automated non-empty check.",
    expectedResult: "No record has a missing or generic reason.",
    actualResult: "No record missing. Specificity is a judgment the same operator made.",
    executedBy: "founder-developer",
    reviewedBy: null,
    rawOutputLocator: "src/test/shared-object.test.ts",
    checksum: null,
    confidence: "supported-interpretation",
    limitations: ["Specificity was judged by the author of the records."],
    reusableAcrossVersions: false,
    reviewTrigger: "Any new object type is added.",
    expiresAt: null,
    relatedValidationIds: [],
    relatedFindingIds: ["FND-SO-001"],
    relatedClaimIds: [],
    retentionRule: "Retain while the catalog version is current.",
    state: "partial",
    provenance: provenance("src/test/shared-object.test.ts", "Self-review. Not independent."),
    synthetic: true,
  },
  {
    evidenceId: "EVD-SO-002",
    evidenceType: "automated-test",
    propositionSupported:
      "State axes are independent: no axis value implies a value on another axis.",
    sourceId: "SRC-001",
    collectedAt: "2026-01-05",
    subjectVersion: "shell 0.3.0",
    environment: "vitest / jsdom, local developer machine",
    scenario: "Assert every axis vocabulary is disjoint and that no derivation maps between axes.",
    method: "Vitest suite over the domain vocabularies and fixtures.",
    expectedResult: "All assertions pass.",
    actualResult: "All assertions pass.",
    executedBy: "founder-developer",
    reviewedBy: null,
    rawOutputLocator: "src/test/shared-object.test.ts",
    checksum: null,
    confidence: "confirmed",
    limitations: [
      "Proves the model, not any running system.",
      "Executed by the same person who wrote both the model and the test.",
    ],
    reusableAcrossVersions: false,
    reviewTrigger: "Any change to a state vocabulary.",
    expiresAt: null,
    relatedValidationIds: [],
    relatedFindingIds: [],
    relatedClaimIds: ["CLM-SO-001"],
    retentionRule: "Retain with the shell version it examined.",
    state: "current",
    provenance: provenance("src/test/shared-object.test.ts", "Static model checks only."),
    synthetic: true,
  },
];

export const EXAMPLE_CLAIMS: GovernedClaim[] = [
  {
    claimId: "CLM-SO-001",
    exactWording:
      "The SSLS shared object model keeps authority, implementation, validation, and evidence as independent recorded states.",
    claimClass: "capability-claim",
    audience: "Internal only",
    channels: ["internal-only"],
    supportingEvidenceIds: ["EVD-SO-002"],
    evidenceState: "current",
    contradictingFindingIds: [],
    limitations: ["Applies to the model, not to any operating system or district deployment."],
    requiredDisclaimer: "Candidate architecture. Not independently validated.",
    approverRoleId: "role-founder-developer",
    approvalState: "pending",
    effectiveFrom: null,
    reviewTrigger: "Any change to the state model.",
    expiresAt: null,
    prohibitedWording: [
      "validated authorization model",
      "certified privacy architecture",
      "district-ready",
      "production data architecture",
    ],
    supersededWording: [],
    provenance: provenance("src/domain/shared-object/states.ts", "Model-level claim only."),
    synthetic: true,
  },
  {
    claimId: "CLM-SO-002",
    exactWording: "SSLS context assembly is privacy-preserving.",
    claimClass: "compliance-claim",
    audience: "Prospective districts",
    channels: ["internal-only"],
    supportingEvidenceIds: [],
    evidenceState: "none",
    contradictingFindingIds: ["FND-SO-002"],
    limitations: ["No assembly is implemented and no review has occurred."],
    requiredDisclaimer: null,
    approverRoleId: null,
    approvalState: "refused",
    effectiveFrom: null,
    reviewTrigger: "Context assembly is implemented and independently reviewed.",
    expiresAt: null,
    prohibitedWording: ["privacy-preserving", "privacy-compliant", "FERPA compliant"],
    supersededWording: [],
    provenance: provenance(
      "docs/shared-object/CLAIM_MODEL.md",
      "Recorded so the wording stays refused.",
    ),
    synthetic: true,
  },
];

export const EXAMPLE_PROJECTION_DEFINITIONS: ContextProjectionDefinition[] = [
  {
    projectionDefinitionId: "CPD-001",
    name: "Governance review projection",
    purpose: "Let a reviewer evaluate a deliverable without seeing unrelated registers.",
    sourceObjectTypeId: "deliverable-instance",
    allowedFields: [
      "title",
      "purpose",
      "acceptanceCriteria",
      "currentVersion",
      "evidenceState",
      "validationState",
    ],
    forbiddenFields: ["artifactReferenceId", "responsibleContributors"],
    requiredRelationshipBasis: "Reviewer is assigned to the deliverable under a review record.",
    requiredPolicyBasis: ["POL-INDEPENDENCE-001"],
    maxDataClassification: "internal",
    defaultExpiryRule: "Expires when the deliverable version changes.",
    reviewTrigger: "Any new field is added to the deliverable contract.",
    authorityState: "research-candidate",
    synthetic: true,
  },
];

export const EXAMPLE_CONTEXT_PACKAGES: ContextPackage[] = [
  {
    contextPackageId: "CTX-001",
    purpose: "Review whether the shared object catalog is ready to be promoted from candidate.",
    requestingActorId: "PER-001",
    actingCapacityId: "CAP-CAPACITY-FOUNDER",
    relationshipBasis: "Founder operator is the accountable role for the owning capability.",
    policyBasis: ["POL-AUTHORITY-001"],
    sourceProjections: [
      {
        sourceObjectId: "DLV-001",
        sourceObjectTypeId: "deliverable-instance",
        includedFields: [
          "title",
          "purpose",
          "acceptanceCriteria",
          "evidenceState",
          "validationState",
        ],
        excludedSensitiveFields: [
          { field: "responsibleContributors", reason: "Not needed to judge readiness." },
        ],
        sourceAuthority: "research-candidate",
        sourceVersion: "0.1.0",
        sourceUpdatedAt: "2026-01-05",
      },
    ],
    missingInformation: [
      "No independent review has been performed, so reviewer findings are absent.",
    ],
    conflicts: [
      "The deliverable reports evidence as partial while its supporting evidence record reports confidence as interpretation only.",
    ],
    uncertainty: ["Whether self-review can ever support promotion beyond candidate."],
    freshnessCheckedAt: "2026-01-05",
    generatedAt: "2026-01-05",
    expiresAt: "2026-02-05",
    allowedAudience: ["role-founder-developer"],
    reuseRestrictions: ["May not be reused for an external readiness discussion."],
    maxDataClassification: "internal",
    reviewRequirement: "Re-assemble before any promotion decision.",
    status: "conflicted",
    isSourceOfTruth: false,
    synthetic: true,
  },
];

export const EXAMPLE_AUTHORIZATION_RULES: AuthorizationRule[] = [
  {
    ruleId: "POL-AUTHORITY-001",
    name: "Founder operator scope",
    statement:
      "The founder operator may read and write every internal record in the private workspace for governance purposes.",
    requiredInputs: ["identity", "acting-capacity", "purpose"],
    defaultOutcome: "refused",
    doesNotGrant: [
      "No access to personal data, because none exists.",
      "No authority to publish a claim without evidence.",
      "No authority to mark a self-performed check as independent validation.",
    ],
    authorityNote:
      "Accepted decision under the current posture. Expires when a second operator exists.",
    synthetic: true,
  },
  {
    ruleId: "POL-INDEPENDENCE-001",
    name: "Reviewer is not the author",
    statement: "A review record may not name the same role that produced the reviewed object.",
    requiredInputs: ["identity", "acting-capacity", "relationship", "object-scope"],
    defaultOutcome: "refused",
    doesNotGrant: ["Nothing. It only constrains."],
    authorityNote: "Currently unsatisfiable in founder mode; that gap is recorded as a finding.",
    synthetic: true,
  },
];

export const EXAMPLE_ARTIFACT_REFERENCES = [
  {
    artifactReferenceId: "ART-001",
    canonicalLocator: "docs/shared-object/SHARED_OBJECT_CATALOG.md",
    format: "markdown",
    checksum: null,
    isCopy: false as const,
    synthetic: true,
  },
];
