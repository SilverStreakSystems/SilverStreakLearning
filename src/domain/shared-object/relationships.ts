/**
 * Typed relationship model.
 *
 * Relationships are records, not properties. They carry their own identity,
 * their own history, and their own rationale, so an edge can be superseded
 * without editing either object it connects.
 */
import type { SharedObjectTypeId } from "./object-types";

export const RELATIONSHIP_KINDS = [
  "decided-by",
  "implemented-by",
  "creates-work",
  "produces-deliverable",
  "verified-by",
  "produces-finding",
  "supported-by-evidence",
  "supports-claim",
  "limits-claim",
  "supersedes",
  "blocks",
  "depends-on",
  "enables",
  "constrained-by",
  "fulfills-requirement",
  "evaluates",
  "authorizes-version",
  "projects-from",
  "acts-in-capacity",
  "related-to-organization",
  "handed-off-to",
  "escalates-to",
  "commits-to",
  "relates-to-event",
  "supports-research",
  "informs-requirement",
] as const;

export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];

export type Cardinality = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";

export interface RelationshipKindMeta {
  id: RelationshipKind;
  /** Verb read from source to target. Unambiguous by design. */
  verb: string;
  /** Verb read from target to source. */
  inverseVerb: string;
  meaning: string;
  cardinality: Cardinality;
  permittedSourceTypes: SharedObjectTypeId[];
  permittedTargetTypes: SharedObjectTypeId[];
  /** Whether ending this relationship must preserve the historical edge. */
  historyPreserving: boolean;
  /** What this edge must never be read to mean. */
  doesNotImply: string;
}


/** Projection may read from canonical sources, never from another projection. */
const SHARED_OBJECT_TARGETS_FOR_PROJECTION = [
  "person-reference",
  "organization",
  "organizational-unit",
  "acting-capacity",
  "role-reference",
  "enterprise-capability",
  "requirement",
  "decision",
  "policy-rule",
  "standard",
  "approval",
  "review",
  "risk",
  "finding",
  "claim",
  "work-item",
  "deliverable-instance",
  "event",
  "evidence",
  "source",
  "research-record",
  "artifact-reference",
  "validation",
  "knowledge-object",
];

const G = (...ids: SharedObjectTypeId[]) => ids;

export const RELATIONSHIP_KIND_META: Record<RelationshipKind, RelationshipKindMeta> = {
  "decided-by": {
    id: "decided-by",
    verb: "is decided by",
    inverseVerb: "decides",
    meaning: "A requirement's fate was settled by a decision record.",
    cardinality: "many-to-one",
    permittedSourceTypes: G("requirement", "risk", "finding"),
    permittedTargetTypes: G("decision"),
    historyPreserving: true,
    doesNotImply: "A decision does not implement, validate, or approve the result.",
  },
  "implemented-by": {
    id: "implemented-by",
    verb: "is implemented by",
    inverseVerb: "implements",
    meaning: "Work is being done that would satisfy the requirement.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("requirement", "decision", "standard"),
    permittedTargetTypes: G("work-item"),
    historyPreserving: true,
    doesNotImply: "Work existing is not work finished, and finished is not verified.",
  },
  "creates-work": {
    id: "creates-work",
    verb: "creates",
    inverseVerb: "was created by",
    meaning: "A decision or finding caused a work item to exist.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("decision", "finding", "review", "risk"),
    permittedTargetTypes: G("work-item"),
    historyPreserving: true,
    doesNotImply: "Creation does not assign priority or authority to the work.",
  },
  "produces-deliverable": {
    id: "produces-deliverable",
    verb: "produces",
    inverseVerb: "is produced by",
    meaning: "Completing the work yields a specific deliverable instance.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("work-item"),
    permittedTargetTypes: G("deliverable-instance"),
    historyPreserving: true,
    doesNotImply: "Producing an artifact does not make it reviewed or approved.",
  },
  "verified-by": {
    id: "verified-by",
    verb: "is verified by",
    inverseVerb: "verifies",
    meaning: "A validation activity checks the object against its requirement.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("work-item", "deliverable-instance", "requirement", "standard"),
    permittedTargetTypes: G("validation"),
    historyPreserving: true,
    doesNotImply: "A validation existing is not a validation passing.",
  },
  "produces-finding": {
    id: "produces-finding",
    verb: "produces",
    inverseVerb: "was produced by",
    meaning: "A validation or review surfaced an observation worth recording.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("validation", "review", "research-record"),
    permittedTargetTypes: G("finding"),
    historyPreserving: true,
    doesNotImply: "A finding is not a requirement and not a decision.",
  },
  "supported-by-evidence": {
    id: "supported-by-evidence",
    verb: "is supported by",
    inverseVerb: "supports",
    meaning: "Recorded evidence stands behind the object.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("finding", "validation", "claim", "requirement", "decision", "risk"),
    permittedTargetTypes: G("evidence"),
    historyPreserving: true,
    doesNotImply: "Evidence for one version does not carry to another version.",
  },
  "supports-claim": {
    id: "supports-claim",
    verb: "supports",
    inverseVerb: "is supported by",
    meaning: "Evidence is cited in support of a stated claim.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("evidence"),
    permittedTargetTypes: G("claim"),
    historyPreserving: true,
    doesNotImply: "Support is not sufficiency. A claim may still exceed its evidence.",
  },
  "limits-claim": {
    id: "limits-claim",
    verb: "limits",
    inverseVerb: "is limited by",
    meaning: "A finding constrains how far a claim may be stated.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("finding", "risk"),
    permittedTargetTypes: G("claim"),
    historyPreserving: true,
    doesNotImply: "A limit is not a prohibition unless the claim record says so.",
  },
  supersedes: {
    id: "supersedes",
    verb: "supersedes",
    inverseVerb: "is superseded by",
    meaning: "A later record replaces an earlier one of the same type.",
    cardinality: "one-to-many",
    permittedSourceTypes: [...([
      "requirement",
      "decision",
      "policy-rule",
      "standard",
      "claim",
      "deliverable-instance",
      "research-record",
      "context-package",
      "knowledge-object",
    ] as SharedObjectTypeId[])],
    permittedTargetTypes: [...([
      "requirement",
      "decision",
      "policy-rule",
      "standard",
      "claim",
      "deliverable-instance",
      "research-record",
      "context-package",
      "knowledge-object",
    ] as SharedObjectTypeId[])],
    historyPreserving: true,
    doesNotImply: "Supersession does not delete the earlier record or its history.",
  },
  blocks: {
    id: "blocks",
    verb: "blocks",
    inverseVerb: "is blocked by",
    meaning: "The source prevents the target from proceeding.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("finding", "risk", "work-item", "decision"),
    permittedTargetTypes: G("work-item", "deliverable-instance", "validation"),
    historyPreserving: true,
    doesNotImply: "Blocking is not prioritization and does not assign an owner.",
  },
  "depends-on": {
    id: "depends-on",
    verb: "depends on",
    inverseVerb: "is depended on by",
    meaning: "The source cannot complete until the target reaches a stated state.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("work-item", "deliverable-instance", "enterprise-capability", "event"),
    permittedTargetTypes: G("work-item", "deliverable-instance", "enterprise-capability", "evidence", "decision"),
    historyPreserving: true,
    doesNotImply: "A dependency is not a commitment by the other side.",
  },
  enables: {
    id: "enables",
    verb: "enables",
    inverseVerb: "is enabled by",
    meaning: "The source makes the target possible or materially easier.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("enterprise-capability", "shared-service-reference"),
    permittedTargetTypes: G("enterprise-capability", "value-stream-reference", "product-reference"),
    historyPreserving: true,
    doesNotImply: "Enabling is not owning and not funding.",
  },
  "constrained-by": {
    id: "constrained-by",
    verb: "is constrained by",
    inverseVerb: "constrains",
    meaning: "A standard or policy limits how the source may operate.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("enterprise-capability", "work-item", "deliverable-instance", "product-reference", "context-projection-definition"),
    permittedTargetTypes: G("standard", "policy-rule"),
    historyPreserving: true,
    doesNotImply: "A constraint existing is not a constraint being met.",
  },
  "fulfills-requirement": {
    id: "fulfills-requirement",
    verb: "fulfills",
    inverseVerb: "is fulfilled by",
    meaning: "A deliverable instance satisfies a stated requirement.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("deliverable-instance"),
    permittedTargetTypes: G("requirement"),
    historyPreserving: true,
    doesNotImply: "Fulfilment is asserted by the record; it is confirmed only by validation.",
  },
  evaluates: {
    id: "evaluates",
    verb: "evaluates",
    inverseVerb: "is evaluated by",
    meaning: "A review examines a deliverable, decision, or claim.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("review"),
    permittedTargetTypes: G("deliverable-instance", "decision", "claim", "research-record", "requirement"),
    historyPreserving: true,
    doesNotImply: "A review is not an approval, even when the reviewer could approve.",
  },
  "authorizes-version": {
    id: "authorizes-version",
    verb: "authorizes",
    inverseVerb: "is authorized by",
    meaning: "An approval record permits one specific version of one object.",
    cardinality: "one-to-one",
    permittedSourceTypes: G("approval"),
    permittedTargetTypes: G("deliverable-instance", "decision", "claim", "standard", "policy-rule"),
    historyPreserving: true,
    doesNotImply: "Authorizing one version never authorizes the next version.",
  },
  "projects-from": {
    id: "projects-from",
    verb: "projects from",
    inverseVerb: "is projected into",
    meaning: "A context package draws a minimum authorized view from a source object.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("context-package"),
    permittedTargetTypes: [...SHARED_OBJECT_TARGETS_FOR_PROJECTION],
    historyPreserving: true,
    doesNotImply: "Projecting from a source never transfers the source's authority.",
  },
  "acts-in-capacity": {
    id: "acts-in-capacity",
    verb: "acts in capacity",
    inverseVerb: "is a capacity held by",
    meaning: "A person reference acts under a named, time-bounded capacity.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("person-reference"),
    permittedTargetTypes: G("acting-capacity"),
    historyPreserving: true,
    doesNotImply: "Holding a capacity is not authorization for a specific action.",
  },
  "related-to-organization": {
    id: "related-to-organization",
    verb: "is related to",
    inverseVerb: "has related",
    meaning: "A person reference has a declared relationship with an organization or unit.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("person-reference"),
    permittedTargetTypes: G("organization", "organizational-unit"),
    historyPreserving: true,
    doesNotImply: "A relationship is not access. Purpose and policy still apply.",
  },
  "handed-off-to": {
    id: "handed-off-to",
    verb: "is handed off to",
    inverseVerb: "receives handoff from",
    meaning: "Responsibility for an object moves, under stated acceptance criteria.",
    cardinality: "one-to-many",
    permittedSourceTypes: G("work-item", "deliverable-instance"),
    permittedTargetTypes: G("work-item", "role-reference", "organizational-unit"),
    historyPreserving: true,
    doesNotImply: "A handoff sent is not a handoff accepted.",
  },
  "escalates-to": {
    id: "escalates-to",
    verb: "escalates to",
    inverseVerb: "is an escalation target of",
    meaning: "An unresolved item is raised to a named accountable role.",
    cardinality: "many-to-one",
    permittedSourceTypes: G("work-item", "risk", "finding"),
    permittedTargetTypes: G("role-reference", "enterprise-function-reference"),
    historyPreserving: true,
    doesNotImply: "Escalation is not a decision and does not transfer accountability.",
  },
  "commits-to": {
    id: "commits-to",
    verb: "commits to",
    inverseVerb: "holds a commitment from",
    meaning: "A party states it will deliver a named object by a named time.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("role-reference", "organizational-unit", "organization"),
    permittedTargetTypes: G("deliverable-instance", "work-item", "event"),
    historyPreserving: true,
    doesNotImply: "A commitment is not an approval and does not create authority.",
  },
  "relates-to-event": {
    id: "relates-to-event",
    verb: "relates to",
    inverseVerb: "has related",
    meaning: "Work, a review, or a deliverable is connected to a scheduled event.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("work-item", "deliverable-instance", "review", "validation"),
    permittedTargetTypes: G("event"),
    historyPreserving: true,
    doesNotImply: "Attending an event is not evidence that work occurred.",
  },
  "supports-research": {
    id: "supports-research",
    verb: "supports",
    inverseVerb: "draws on",
    meaning: "A source was used in a governed investigation.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("source"),
    permittedTargetTypes: G("research-record"),
    historyPreserving: true,
    doesNotImply: "Being cited is not being endorsed.",
  },
  "informs-requirement": {
    id: "informs-requirement",
    verb: "informs",
    inverseVerb: "is informed by",
    meaning: "Research contributed to a requirement without becoming one.",
    cardinality: "many-to-many",
    permittedSourceTypes: G("research-record", "finding", "knowledge-object"),
    permittedTargetTypes: G("requirement"),
    historyPreserving: true,
    doesNotImply: "Research never becomes a requirement without a decision record.",
  },
};




export interface RelationshipRecord {
  relationshipId: string;
  kind: RelationshipKind;
  sourceObjectId: string;
  sourceTypeId: SharedObjectTypeId;
  targetObjectId: string;
  targetTypeId: SharedObjectTypeId;
  /** Why this edge exists. Required: an unexplained edge is unmaintainable. */
  rationale: string;
  active: boolean;
  effectiveFrom: string;
  effectiveUntil: string | null;
  recordedBy: string;
  synthetic: boolean;
}

export type RelationshipViolationKind =
  | "self-link"
  | "duplicate-active-edge"
  | "prohibited-type-combination"
  | "unknown-relationship-kind"
  | "missing-rationale";

export interface RelationshipViolation {
  kind: RelationshipViolationKind;
  relationshipId: string;
  detail: string;
}

/**
 * Pure validation. Returns every violation rather than throwing on the first,
 * because an operator fixing a model needs the whole list.
 */
export function validateRelationships(records: RelationshipRecord[]): RelationshipViolation[] {
  const violations: RelationshipViolation[] = [];
  const seenActive = new Set<string>();

  for (const record of records) {
    const meta = RELATIONSHIP_KIND_META[record.kind];

    if (!meta) {
      violations.push({
        kind: "unknown-relationship-kind",
        relationshipId: record.relationshipId,
        detail: `Relationship kind "${record.kind}" is not defined.`,
      });
      continue;
    }

    if (record.sourceObjectId === record.targetObjectId) {
      violations.push({
        kind: "self-link",
        relationshipId: record.relationshipId,
        detail: `${record.sourceObjectId} points at itself.`,
      });
    }

    if (record.rationale.trim().length === 0) {
      violations.push({
        kind: "missing-rationale",
        relationshipId: record.relationshipId,
        detail: "Every relationship must state why it exists.",
      });
    }

    const sourceAllowed = meta.permittedSourceTypes.includes(record.sourceTypeId);
    const targetAllowed = meta.permittedTargetTypes.includes(record.targetTypeId);
    if (!sourceAllowed || !targetAllowed) {
      violations.push({
        kind: "prohibited-type-combination",
        relationshipId: record.relationshipId,
        detail: `${record.sourceTypeId} ${meta.verb} ${record.targetTypeId} is not a permitted combination.`,
      });
    }

    if (record.active) {
      const key = `${record.kind}::${record.sourceObjectId}::${record.targetObjectId}`;
      if (seenActive.has(key)) {
        violations.push({
          kind: "duplicate-active-edge",
          relationshipId: record.relationshipId,
          detail: `A second active "${record.kind}" edge already connects these objects.`,
        });
      }
      seenActive.add(key);
    }
  }

  return violations;
}
