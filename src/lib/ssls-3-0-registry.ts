/**
 * Reads the SSLS 3.0 canon record from `data/ssls-3.0/canon.json`.
 *
 * The JSON file is the single source of truth. The record is imported directly
 * rather than read from disk so routes can use it without pulling filesystem
 * access into the client bundle.
 *
 * Loading refuses a defective record. A record that cannot satisfy its own
 * authority invariants must not reach a projection or a screen.
 */
import canonJson from "../../data/ssls-3.0/canon.json";

import type { CanonDocument, CanonRecord, OpenDecision } from "@/domain/ssls-3-0/canon";
import { canonDefects } from "@/domain/ssls-3-0/canon";

export function loadCanon(): CanonRecord {
  const record = canonJson as CanonRecord;
  const defects = canonDefects(record);
  if (defects.length > 0) {
    throw new Error(`SSLS 3.0 canon record is defective:\n  - ${defects.join("\n  - ")}`);
  }
  return record;
}

/** Documents in file-number order, which is the package's own reading order. */
export function canonDocuments(): CanonDocument[] {
  return [...loadCanon().documents].sort((a, b) => a.file_name.localeCompare(b.file_name));
}

export function findDocument(documentId: string): CanonDocument | undefined {
  return loadCanon().documents.find((doc) => doc.document_id === documentId);
}

export function openDecisions(): OpenDecision[] {
  return loadCanon().open_decisions;
}

/** Open decisions a given document raises, in the order the document lists them. */
export function decisionsRaisedBy(documentId: string): OpenDecision[] {
  const record = loadCanon();
  const doc = record.documents.find((d) => d.document_id === documentId);
  if (!doc) return [];
  return doc.open_decision_ids.flatMap((id) => {
    const match = record.open_decisions.find((d) => d.decision_id === id);
    return match ? [match] : [];
  });
}
