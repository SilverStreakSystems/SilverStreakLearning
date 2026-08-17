/**
 * Read helpers for the shared object registry.
 *
 * Nothing here blends, scores, or ranks. Counting how many types sit in a
 * family is a fact; turning that into a completeness figure would not be.
 */
import type { ObjectSearch } from "@/components/governance/object-controls";
import {
  OBJECT_FAMILIES,
  OBJECT_FAMILY_META,
  RELATIONSHIP_KIND_META,
  RELATIONSHIP_KINDS,
  type ObjectFamily,
  type RelationshipKind,
  type SharedObjectTypeId,
  type SharedObjectTypeRecord,
} from "@/domain";

export function filterObjectTypes(
  records: SharedObjectTypeRecord[],
  search: ObjectSearch,
): SharedObjectTypeRecord[] {
  const q = search.q.trim().toLowerCase();

  return records.filter((record) => {
    if (search.family !== "all" && record.family !== search.family) return false;
    if (search.canonicality !== "all" && record.canonicality !== search.canonicality) return false;
    if (search.instantiability !== "all" && record.instantiability !== search.instantiability) return false;
    if (search.axis !== "all" && !record.stateAxes.includes(search.axis)) return false;
    if (
      search.classification !== "all" &&
      !record.permittedDataClassifications.includes(search.classification)
    ) {
      return false;
    }
    if (q.length === 0) return true;

    const haystack = [
      record.name,
      record.typeId,
      record.definition,
      record.reasonForExistence,
      record.sharedRationale,
      record.ownerCapabilityId,
      ...record.purposeRestrictions,
      ...record.prohibitedRelationships,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export interface FamilyGroup {
  family: ObjectFamily;
  label: string;
  purpose: string;
  records: SharedObjectTypeRecord[];
}

export function familyGroups(records: SharedObjectTypeRecord[]): FamilyGroup[] {
  return OBJECT_FAMILIES.map((family) => ({
    family,
    label: OBJECT_FAMILY_META[family].label,
    purpose: OBJECT_FAMILY_META[family].purpose,
    records: records.filter((record) => record.family === family),
  })).filter((group) => group.records.length > 0);
}

export function findObjectType(
  records: SharedObjectTypeRecord[],
  typeId: string,
): SharedObjectTypeRecord | undefined {
  return records.find((record) => record.typeId === typeId);
}

/** Relationship kinds a given type may participate in, as source or as target. */
export function relationshipsForType(typeId: SharedObjectTypeId): {
  asSource: RelationshipKind[];
  asTarget: RelationshipKind[];
} {
  const asSource: RelationshipKind[] = [];
  const asTarget: RelationshipKind[] = [];

  for (const kind of RELATIONSHIP_KINDS) {
    const meta = RELATIONSHIP_KIND_META[kind];
    if (meta.permittedSourceTypes.includes(typeId)) asSource.push(kind);
    if (meta.permittedTargetTypes.includes(typeId)) asTarget.push(kind);
  }

  return { asSource, asTarget };
}
