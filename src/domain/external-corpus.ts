/**
 * External corpus observation model.
 *
 * An observation records that material was seen in an external location at a
 * point in time. It is deliberately incapable of carrying authority: the
 * authority class is a fixed literal, and no field exists for an acceptance,
 * promotion, or adoption outcome. Placement in a location, and indexing in this
 * record, both confer nothing.
 */

export const EXTERNAL_CORPUS_AUTHORITY_CLASS = "HISTORICAL_REFERENCE — NON-CONTROLLING" as const;

/** Status words an observed item may never be recorded as carrying. */
export const PROHIBITED_STATUS_WORDS = [
  "accepted",
  "canonical",
  "approved",
  "promoted",
  "adopted",
  "implemented",
  "ratified",
  "conformant",
] as const;

export type LocationClass =
  "connected-storage" | "owner-supplied-upload" | "external-service" | "unknown";

export type ObservedItemClass =
  "foundation-document" | "workbook" | "spreadsheet" | "probe" | "other";

export type ReadState = "content-read" | "metadata-only";

export interface ObservedItem {
  readonly item_name: string;
  readonly item_class: ObservedItemClass;
  readonly provider_file_id: string;
  readonly media_type: string;
  readonly byte_size: number | null;
  readonly modified_at: string | null;
  readonly observed_at: string;
  readonly location_class: LocationClass;
  readonly declared_document_id: string | null;
  readonly declared_status: string | null;
  readonly declared_role: string | null;
  readonly read_state: ReadState;
}

export interface DeclaredButAbsentItem {
  readonly declared_document_id: string;
  readonly declared_title: string;
  readonly cited_by: readonly string[];
  readonly presence: "ABSENT-AT-OBSERVATION";
  readonly note?: string;
}

export interface ExternalCorpusObservation {
  readonly schema_version: string;
  readonly corpus_id: string;
  readonly corpus_title: string;
  readonly location_class: LocationClass;
  readonly location_reference?: string;
  readonly observed_at: string;
  readonly observed_by: string;
  readonly observation_method: string;
  readonly observation_independence?: string;
  readonly authority_class: typeof EXTERNAL_CORPUS_AUTHORITY_CLASS;
  readonly non_authority_statement: string;
  readonly item_count: number;
  readonly items: readonly ObservedItem[];
  readonly declared_but_absent: readonly DeclaredButAbsentItem[];
  readonly non_effects: readonly string[];
}

/** Items grouped by class, in a stable class order for projection. */
export function groupItemsByClass(
  items: readonly ObservedItem[],
): ReadonlyArray<readonly [ObservedItemClass, readonly ObservedItem[]]> {
  const order: ObservedItemClass[] = [
    "foundation-document",
    "workbook",
    "spreadsheet",
    "probe",
    "other",
  ];
  return order
    .map((cls) => [cls, items.filter((item) => item.item_class === cls)] as const)
    .filter(([, group]) => group.length > 0);
}

/** True when a declared status contains a word that would imply granted authority. */
export function declaresProhibitedStatus(status: string | null): boolean {
  if (!status) return false;
  const lowered = status.toLowerCase();
  return PROHIBITED_STATUS_WORDS.some((word) => lowered.includes(word));
}

/** Structural defects in an observation record. An empty array means no defect found. */
export function observationDefects(record: ExternalCorpusObservation): string[] {
  const defects: string[] = [];

  if (record.authority_class !== EXTERNAL_CORPUS_AUTHORITY_CLASS) {
    defects.push(`${record.corpus_id}: authority class is not the fixed non-controlling literal.`);
  }
  if (record.non_authority_statement.trim().length === 0) {
    defects.push(`${record.corpus_id}: non-authority statement is empty.`);
  }
  if (record.non_effects.length === 0) {
    defects.push(`${record.corpus_id}: no non-effects recorded.`);
  }
  if (record.item_count !== record.items.length) {
    defects.push(
      `${record.corpus_id}: item_count ${record.item_count} disagrees with ${record.items.length} items.`,
    );
  }

  const seen = new Set<string>();
  for (const item of record.items) {
    if (seen.has(item.provider_file_id)) {
      defects.push(`${item.item_name}: duplicate provider file id.`);
    }
    seen.add(item.provider_file_id);

    if (item.observed_at.trim().length === 0) {
      defects.push(`${item.item_name}: missing observation timestamp.`);
    }
    if (declaresProhibitedStatus(item.declared_status)) {
      defects.push(`${item.item_name}: declared status implies granted authority.`);
    }
  }

  const present = new Set(record.items.map((item) => item.declared_document_id ?? ""));
  for (const absent of record.declared_but_absent) {
    if (present.has(absent.declared_document_id)) {
      defects.push(
        `${absent.declared_document_id}: recorded absent while also present in the item list.`,
      );
    }
  }

  return defects;
}
