/**
 * Catalog seed builder.
 *
 * Every catalog record answers the same eighteen questions. Rather than repeat
 * boilerplate rules thirty-two times, the rules that follow deterministically
 * from canonicality are defaulted here and overridden only where a type
 * genuinely differs. The defaults are visible, not hidden: they are the same
 * text the registry renders.
 */
import type {
  Canonicality,
  DataClassification,
  Instantiability,
  ObjectFamily,
  SharedObjectTypeId,
  SharedObjectTypeRecord,
  StateAxis,
} from "@/domain";

export interface CatalogSeed {
  id: SharedObjectTypeId;
  name: string;
  family: ObjectFamily;
  def: string;
  why: string;
  canon: Canonicality;
  inst: Instantiability;
  owner: string;
  usedBy: string[];
  cond: string[];
  axes: StateAxis[];
  classes: DataClassification[];
  purpose: string[];
  rels: string[];
  prohibited: string[];
  shared: string;
  future: string[];
  open?: string[];
  versioning?: string;
  audit?: string;
  correction?: string;
  supersession?: string;
  archival?: string;
  validation?: string;
}

const VERSIONING: Record<Canonicality, string> = {
  canonical: "Every material change increments the version and writes a new provenance entry.",
  derived: "Versioned by the derivation rule that produced it, never edited directly.",
  projection: "Not versioned. Re-assembled from current sources when needed.",
  reference: "Versioned only when the external thing it names is re-declared.",
};

const AUDIT: Record<Canonicality, string> = {
  canonical:
    "All create, update, supersede, and archive actions are audited with actor and reason.",
  derived: "Each computation records source facts, rule version, and timestamp.",
  projection: "Assembly is audited: purpose, requester, capacity, sources, and refusals.",
  reference: "Declaration and retirement are audited. No routine writes occur.",
};

const CORRECTION: Record<Canonicality, string> = {
  canonical: "Corrected in place with a recorded reason; the prior value stays in history.",
  derived: "Not corrected directly. Correct the source fact or the rule, then recompute.",
  projection: "Not corrected. Discard and re-assemble from corrected sources.",
  reference: "Corrected by re-declaring the reference; old declarations stay visible.",
};

const SUPERSESSION: Record<Canonicality, string> = {
  canonical: "Superseded by a named successor. The predecessor remains readable and marked.",
  derived: "Superseded when the rule version changes. Prior results stay attached to their rule.",
  projection: "Expires rather than supersedes.",
  reference: "Superseded when the named structure is replaced.",
};

const ARCHIVAL: Record<Canonicality, string> = {
  canonical: "Archived, never deleted, unless a retention rule requires deletion.",
  derived: "Archived with the facts and rule version that produced it.",
  projection: "Expired packages are retained only as an audit record of what was shown.",
  reference: "Retired in place. Pointers to it remain resolvable.",
};

const VALIDATION: Record<Canonicality, string> = {
  canonical: "A test proves the type has a stable identifier and independent state axes.",
  derived: "A test proves the derived value cannot overwrite a source fact.",
  projection: "A test proves the projection is never treated as a source of truth.",
  reference: "A test proves no records of this type are instantiated in the current boundary.",
};

export function buildCatalog(seeds: CatalogSeed[]): SharedObjectTypeRecord[] {
  return seeds.map((s) => ({
    typeId: s.id,
    name: s.name,
    family: s.family,
    definition: s.def,
    reasonForExistence: s.why,
    canonicality: s.canon,
    instantiability: s.inst,
    ownerCapabilityId: s.owner,
    usedByCapabilityIds: s.usedBy,
    universalFieldsApply: true,
    conditionalFields: s.cond,
    stateAxes: s.axes,
    permittedDataClassifications: s.classes,
    purposeRestrictions: s.purpose,
    versioningRule: s.versioning ?? VERSIONING[s.canon],
    auditRule: s.audit ?? AUDIT[s.canon],
    correctionRule: s.correction ?? CORRECTION[s.canon],
    supersessionRule: s.supersession ?? SUPERSESSION[s.canon],
    archivalRule: s.archival ?? ARCHIVAL[s.canon],
    validationExpectation: s.validation ?? VALIDATION[s.canon],
    futureConsumers: s.future,
    permittedRelationshipKinds: s.rels,
    prohibitedRelationships: s.prohibited,
    sharedRationale: s.shared,
    openQuestions: s.open ?? [],
    synthetic: true,
  }));
}
