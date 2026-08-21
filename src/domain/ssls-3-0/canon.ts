/**
 * SSLS 3.0 canon domain model.
 *
 * The canon record indexes the SSLS 3.0 foundation documents held in this
 * repository. Indexing is not approving. Every invariant here exists to stop a
 * projection, a route, or a later edit from turning an index entry into an
 * authority claim.
 *
 * SSLS 3.0 is a clean-slate declaration. Nothing in this module reads, derives
 * from, or depends on the SSLS 2.0 registers that share this repository.
 */

export type DocumentClass =
  | "navigational"
  | "governance"
  | "status"
  | "product"
  | "register"
  | "structure";

export type CanonicalStatus =
  | "DRAFT"
  | "CANDIDATE"
  | "CANONICAL"
  | "SUPERSEDED"
  | "ARCHIVED"
  | "WITHDRAWN";

export type Provenance = "transcribed" | "reconstructed";

export type DecisionPriority = "1" | "2" | "3" | "unranked";

export interface CanonDocument {
  document_id: string;
  file_name: string;
  title: string;
  document_class: DocumentClass;
  version: string;
  status: string;
  canonical_status: CanonicalStatus;
  authority_level: string;
  review_class: string | null;
  controlled_concept: string;
  provenance: Provenance;
  provenance_note?: string;
  source_item_name?: string | null;
  authorizing_decision: string | null;
  open_decision_ids: string[];
}

export interface OpenDecision {
  decision_id: string;
  source_document_id: string;
  priority: DecisionPriority;
  question: string;
  state: "open";
}

export interface UnresolvedItem {
  item_id: string;
  summary: string;
  positions: string[];
  routed_to: string;
}

export interface CanonRecord {
  schema_version: string;
  canon_id: string;
  canon_title: string;
  recorded_at: string;
  recorded_by: string;
  authority_class: "INDEX ONLY — NON-CONTROLLING";
  non_authority_statement: string;
  clean_slate_statement: string;
  document_count: number;
  documents: CanonDocument[];
  open_decision_count: number;
  open_decisions: OpenDecision[];
  unresolved_items: UnresolvedItem[];
  non_effects: string[];
}

/** The only authority class a canon record may carry. */
export const CANON_AUTHORITY_CLASS = "INDEX ONLY — NON-CONTROLLING" as const;

const DOCUMENT_ID = /^SSLS3-DOC-\d{2}$/;
const DECISION_ID = /^OD-\d{2}-\d$/;
const UNRESOLVED_ID = /^U3-\d{3}$/;

/**
 * Structural and authority defects in a canon record.
 *
 * A non-empty result is a refusal, not a warning: the loader throws rather than
 * hand a defective record to a projection or a route.
 */
export function canonDefects(record: CanonRecord): string[] {
  const defects: string[] = [];

  if (record.authority_class !== CANON_AUTHORITY_CLASS) {
    defects.push(
      `authority_class must be "${CANON_AUTHORITY_CLASS}"; registration never confers authority`,
    );
  }

  if (record.document_count !== record.documents.length) {
    defects.push(
      `document_count ${record.document_count} does not match ${record.documents.length} documents`,
    );
  }

  if (record.open_decision_count !== record.open_decisions.length) {
    defects.push(
      `open_decision_count ${record.open_decision_count} does not match ${record.open_decisions.length} open decisions`,
    );
  }

  if (record.non_effects.length === 0) {
    defects.push("non_effects must state at least one non-effect");
  }

  const documentIds = new Set<string>();
  for (const doc of record.documents) {
    if (!DOCUMENT_ID.test(doc.document_id)) {
      defects.push(`${doc.document_id}: malformed document identifier`);
    }
    if (documentIds.has(doc.document_id)) {
      defects.push(`${doc.document_id}: duplicate document identifier`);
    }
    documentIds.add(doc.document_id);

    // Authority is declared by a recorded owner decision, never by status text.
    if (doc.canonical_status === "CANONICAL" && doc.authorizing_decision === null) {
      defects.push(
        `${doc.document_id}: CANONICAL without an authorizing owner decision; only a recorded decision confers authority`,
      );
    }

    // A reconstruction is composed from statements cited elsewhere. It can never
    // be the thing it reconstructs, whatever else is recorded about it.
    if (doc.provenance === "reconstructed" && doc.canonical_status === "CANONICAL") {
      defects.push(
        `${doc.document_id}: a reconstructed document may not be CANONICAL; the owner authors or confirms the original first`,
      );
    }

    if (doc.provenance === "transcribed" && !doc.source_item_name) {
      defects.push(`${doc.document_id}: transcribed provenance requires a named source item`);
    }

    if (doc.provenance === "reconstructed" && !doc.provenance_note) {
      defects.push(
        `${doc.document_id}: reconstructed provenance requires a note stating what it was composed from`,
      );
    }
  }

  const decisionIds = new Set<string>();
  for (const decision of record.open_decisions) {
    if (!DECISION_ID.test(decision.decision_id)) {
      defects.push(`${decision.decision_id}: malformed decision identifier`);
    }
    if (decisionIds.has(decision.decision_id)) {
      defects.push(`${decision.decision_id}: duplicate decision identifier`);
    }
    decisionIds.add(decision.decision_id);

    if (!documentIds.has(decision.source_document_id)) {
      defects.push(
        `${decision.decision_id}: source document ${decision.source_document_id} is not registered`,
      );
    }
  }

  // Every decision a document raises must be indexed, and every indexed decision
  // must belong to a document. An orphan in either direction hides an open item.
  for (const doc of record.documents) {
    for (const id of doc.open_decision_ids) {
      if (!decisionIds.has(id)) {
        defects.push(`${doc.document_id}: raises ${id}, which is not in the open decision index`);
      }
    }
  }
  for (const decision of record.open_decisions) {
    const source = record.documents.find((d) => d.document_id === decision.source_document_id);
    if (source && !source.open_decision_ids.includes(decision.decision_id)) {
      defects.push(
        `${decision.decision_id}: not listed by its source document ${decision.source_document_id}`,
      );
    }
  }

  const unresolvedIds = new Set<string>();
  for (const item of record.unresolved_items) {
    if (!UNRESOLVED_ID.test(item.item_id)) {
      defects.push(`${item.item_id}: malformed unresolved item identifier`);
    }
    if (unresolvedIds.has(item.item_id)) {
      defects.push(`${item.item_id}: duplicate unresolved item identifier`);
    }
    unresolvedIds.add(item.item_id);

    if (item.positions.length < 2) {
      defects.push(
        `${item.item_id}: an unresolved item states at least two positions; one position is a conclusion`,
      );
    }
    if (!decisionIds.has(item.routed_to)) {
      defects.push(`${item.item_id}: routed to ${item.routed_to}, which is not an open decision`);
    }
  }

  return defects;
}

/** Documents that hold authority today. Always empty until an owner decides. */
export function authorizedDocuments(record: CanonRecord): CanonDocument[] {
  return record.documents.filter(
    (doc) => doc.canonical_status === "CANONICAL" && doc.authorizing_decision !== null,
  );
}

/** Documents composed rather than transcribed. These need owner confirmation. */
export function reconstructedDocuments(record: CanonRecord): CanonDocument[] {
  return record.documents.filter((doc) => doc.provenance === "reconstructed");
}

/** Documents that fail to state a review class. Stating one is required. */
export function documentsMissingReviewClass(record: CanonRecord): CanonDocument[] {
  return record.documents.filter((doc) => doc.review_class === null);
}

export function documentsByClass(record: CanonRecord): Map<DocumentClass, CanonDocument[]> {
  const grouped = new Map<DocumentClass, CanonDocument[]>();
  for (const doc of record.documents) {
    const bucket = grouped.get(doc.document_class) ?? [];
    bucket.push(doc);
    grouped.set(doc.document_class, bucket);
  }
  return grouped;
}

export function canonicalStatusCounts(record: CanonRecord): Map<CanonicalStatus, number> {
  const counts = new Map<CanonicalStatus, number>();
  for (const doc of record.documents) {
    counts.set(doc.canonical_status, (counts.get(doc.canonical_status) ?? 0) + 1);
  }
  return counts;
}

export const PRIORITY_ORDER: DecisionPriority[] = ["1", "2", "3", "unranked"];

export function decisionsByPriority(record: CanonRecord): Map<DecisionPriority, OpenDecision[]> {
  const grouped = new Map<DecisionPriority, OpenDecision[]>();
  for (const priority of PRIORITY_ORDER) {
    const matching = record.open_decisions.filter((d) => d.priority === priority);
    if (matching.length > 0) {
      grouped.set(priority, matching);
    }
  }
  return grouped;
}
