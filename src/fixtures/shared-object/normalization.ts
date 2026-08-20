/**
 * Object and relationship normalization findings.
 *
 * Forty-three object candidates were considered. Thirty-two survived as types.
 * The rest were demoted, merged, deferred, or rejected — each with the cost of
 * that decision recorded, because every one of them is reversible.
 */
import type { ObjectNormalizationFinding, RelationshipNormalizationFinding } from "@/domain";

export const OBJECT_NORMALIZATION_FINDINGS: ObjectNormalizationFinding[] = [
  {
    findingId: "ONF-001",
    issue: "should-be-relationship",
    candidateName: "Dependency",
    resolvedTypeId: null,
    disposition: "demoted-to-relationship",
    observation: "Every dependency named exactly two objects and added no fields of its own.",
    judgment: "Modeled as the depends-on and blocks relationship kinds.",
    costOfDecision: "A dependency cannot currently hold its own owner or due date.",
    reversible: true,
  },
  {
    findingId: "ONF-002",
    issue: "should-be-relationship",
    candidateName: "Handoff",
    resolvedTypeId: null,
    disposition: "demoted-to-relationship",
    observation: "Handoff needs terms of acceptance, which is more than a bare edge carries.",
    judgment:
      "Kept as the handed-off-to relationship with a HandoffTerms record attached to the edge.",
    costOfDecision:
      "Queued handoffs cannot be listed as work in their own right until a value stream needs it.",
    reversible: true,
  },
  {
    findingId: "ONF-003",
    issue: "should-be-relationship",
    candidateName: "Escalation",
    resolvedTypeId: null,
    disposition: "demoted-to-relationship",
    observation: "Escalation is a routing property of work, not a thing that exists independently.",
    judgment: "Modeled as escalates-to plus an escalation role on the work item.",
    costOfDecision:
      "Escalation history is read from work history rather than from its own register.",
    reversible: true,
  },
  {
    findingId: "ONF-004",
    issue: "duplicate-object",
    candidateName: "Commitment",
    resolvedTypeId: null,
    disposition: "demoted-to-relationship",
    observation: "A commitment is a work item with an external counterparty and a promised date.",
    judgment: "Modeled as commits-to on a work item rather than a parallel object family.",
    costOfDecision:
      "Contractual commitments will likely need their own object once contracts are real.",
    reversible: true,
  },
  {
    findingId: "ONF-005",
    issue: "unnecessary-abstraction",
    candidateName: "Knowledge Object as abstract superclass",
    resolvedTypeId: "knowledge-object",
    disposition: "rejected-abstraction",
    observation:
      "Guidance, policy, standard, and curriculum differ in exactly the ways the abstraction hid.",
    judgment:
      "One record with an explicit knowledgeType; policy and standard remain separate first-class types.",
    costOfDecision: "Two places to look for something that is loosely 'knowledge'.",
    reversible: true,
  },
  {
    findingId: "ONF-006",
    issue: "overlapping-object",
    candidateName: "Artifact / File Reference",
    resolvedTypeId: "artifact-reference",
    disposition: "kept-first-class",
    observation: "Deliverables, evidence, and knowledge objects all point at files.",
    judgment: "Kept as a thin reference type so no file is ever duplicated per context.",
    costOfDecision: "An extra hop when reading a deliverable.",
    reversible: false,
  },
  {
    findingId: "ONF-007",
    issue: "should-be-object",
    candidateName: "Recipient Eligibility Snapshot",
    resolvedTypeId: "communication-reference",
    disposition: "merged-into-other-type",
    observation: "The snapshot has no meaning apart from the communication it belongs to.",
    judgment: "Folded into the gated communication reference.",
    costOfDecision:
      "Eligibility logic cannot be reviewed on its own until communication is authorized.",
    reversible: true,
  },
  {
    findingId: "ONF-008",
    issue: "not-currently-needed",
    candidateName: "Dispatch Intent",
    resolvedTypeId: null,
    disposition: "deferred",
    observation: "Nothing can be dispatched; no provider handoff exists.",
    judgment: "Deferred until communication execution is separately authorized.",
    costOfDecision:
      "The eventual send path is unmodeled, which is the correct state while it is prohibited.",
    reversible: true,
  },
  {
    findingId: "ONF-009",
    issue: "duplicate-object",
    candidateName: "Release Candidate",
    resolvedTypeId: "deliverable-instance",
    disposition: "merged-into-other-type",
    observation: "A release candidate is a publication state, not a separate object.",
    judgment: "Represented by the publication state axis.",
    costOfDecision: "None identified.",
    reversible: true,
  },
  {
    findingId: "ONF-010",
    issue: "should-be-relationship",
    candidateName: "Relationship (person to organization)",
    resolvedTypeId: null,
    disposition: "demoted-to-relationship",
    observation: "Listed as an object in the brief, but it is the definition of an edge.",
    judgment: "Modeled as related-to-organization with effective dates on the edge.",
    costOfDecision:
      "Relationship history needs edge versioning, which is asserted but not implemented.",
    reversible: true,
  },
  {
    findingId: "ONF-011",
    issue: "state-duplication",
    candidateName: "Milestone",
    resolvedTypeId: "event",
    disposition: "merged-into-other-type",
    observation: "A milestone is an event with no duration and an outcome.",
    judgment: "Represented as an event type.",
    costOfDecision: "Milestone-specific reporting will need a filter rather than a table.",
    reversible: true,
  },
  {
    findingId: "ONF-012",
    issue: "ambiguous-terminology",
    candidateName: "Enterprise Function Reference versus Organizational Unit",
    resolvedTypeId: "enterprise-function-reference",
    disposition: "kept-first-class",
    observation: "A function is an accountability; a unit is a real group inside an organization.",
    judgment: "Both kept, with the distinction written into each definition.",
    costOfDecision: "Two similar-sounding types that must be explained in onboarding.",
    reversible: false,
  },
  {
    findingId: "ONF-013",
    issue: "belongs-in-bounded-context",
    candidateName: "Student, Family, and Educator records",
    resolvedTypeId: "person-reference",
    disposition: "kept-bounded",
    observation:
      "These carry domain rules that do not generalize and personal data that is prohibited here.",
    judgment:
      "Only a minimal person reference is shared; the domain records stay in their bounded contexts.",
    costOfDecision: "Cross-context joins will need explicit mapping later.",
    reversible: false,
  },
  {
    findingId: "ONF-014",
    issue: "authority-duplication",
    candidateName: "A second authority vocabulary for objects",
    resolvedTypeId: null,
    disposition: "rejected-abstraction",
    observation:
      "The brief's example authority states overlapped the existing eight authority classes.",
    judgment: "Reused the existing vocabulary rather than defining a parallel one.",
    costOfDecision: "The brief's example names do not appear verbatim in the code.",
    reversible: false,
  },
  {
    findingId: "ONF-015",
    issue: "over-generalized-object",
    candidateName: "Generic status field",
    resolvedTypeId: null,
    disposition: "rejected-abstraction",
    observation:
      "One status field was being asked to mean workflow, authority, validation, and freshness at once.",
    judgment: "Split into eight independent axes; no combined status field exists.",
    costOfDecision: "More fields to populate and more columns to render.",
    reversible: false,
  },
  {
    findingId: "ONF-016",
    issue: "not-currently-needed",
    candidateName: "Capacity and workload objects for Command Center",
    resolvedTypeId: null,
    disposition: "deferred",
    observation: "Capacity modeling slides quickly into monitoring individuals.",
    judgment:
      "Deferred, and the prohibited monitoring fields are named explicitly and locked by test.",
    costOfDecision: "No capacity view is possible; this is intentional.",
    reversible: true,
  },
];

export const RELATIONSHIP_NORMALIZATION_FINDINGS: RelationshipNormalizationFinding[] = [
  {
    findingId: "RNF-001",
    issue: "duplicate-semantics",
    candidateVerb: "requirement implemented_by work / decision creates work",
    resolvedKind: "creates-work",
    observation: "Both described work coming into existence because of a governance object.",
    judgment:
      "Kept both: implemented-by asserts satisfaction, creates-work asserts origin. Different questions.",
    costOfDecision: "Readers must learn the distinction.",
    reversible: true,
  },
  {
    findingId: "RNF-002",
    issue: "ambiguous-verb",
    candidateVerb: "relates_to",
    resolvedKind: "relates-to-event",
    observation: "A generic relates_to would absorb every edge and explain none.",
    judgment:
      "Narrowed to events only, where the association genuinely carries no further meaning.",
    costOfDecision:
      "Some legitimate loose associations have nowhere to go and must be named later.",
    reversible: true,
  },
  {
    findingId: "RNF-003",
    issue: "missing-inverse",
    candidateVerb: "supersedes",
    resolvedKind: "supersedes",
    observation: "Supersession was written one-directionally and would hide the predecessor.",
    judgment: "Declared with an inverse and marked history-preserving; both ends stay readable.",
    costOfDecision: "None identified.",
    reversible: false,
  },
  {
    findingId: "RNF-004",
    issue: "history-loss-risk",
    candidateVerb: "acts_in_capacity",
    resolvedKind: "acts-in-capacity",
    observation: "Removing a capacity would erase the basis for past actions.",
    judgment: "Edges are end-dated, never deleted.",
    costOfDecision: "Capacity lists grow and need filtering by date.",
    reversible: false,
  },
  {
    findingId: "RNF-005",
    issue: "should-be-object",
    candidateVerb: "work handoff_to work/team",
    resolvedKind: "handed-off-to",
    observation: "Acceptance terms are real content and argue for an object.",
    judgment: "Kept as an edge with attached terms; revisit when a value stream queues handoffs.",
    costOfDecision: "Handoffs cannot yet be listed as a work queue.",
    reversible: true,
  },
  {
    findingId: "RNF-006",
    issue: "cardinality-undefined",
    candidateVerb: "evidence supports claim",
    resolvedKind: "supports-claim",
    observation:
      "One evidence record may support several claims, and one claim needs several records.",
    judgment: "Declared many-to-many, with claim validation counting supporting records.",
    costOfDecision: "None identified.",
    reversible: false,
  },
  {
    findingId: "RNF-007",
    issue: "duplicate-semantics",
    candidateVerb: "finding limits claim / risk limits claim",
    resolvedKind: "limits-claim",
    observation: "Two sources of limitation with identical mechanics.",
    judgment: "One kind, permitting both finding and risk as the source type.",
    costOfDecision: "The source type must be read to know which kind of limit applies.",
    reversible: true,
  },
  {
    findingId: "RNF-008",
    issue: "ambiguous-verb",
    candidateVerb: "context_package projects_from source_object",
    resolvedKind: "projects-from",
    observation: "The direction was ambiguous and invited reading a package as owning its sources.",
    judgment:
      "Direction fixed from package to source, with an explicit note that authority never transfers.",
    costOfDecision: "None identified.",
    reversible: false,
  },
];
