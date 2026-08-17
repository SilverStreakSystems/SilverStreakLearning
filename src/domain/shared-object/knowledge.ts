/**
 * Research and knowledge architecture.
 *
 * The abstract "knowledge object" superclass was rejected during normalization:
 * an abstraction that holds guidance, policy, and curriculum in one bucket
 * hides exactly the differences that matter — who may change it, what it
 * obliges, and how long it stays true. Instead there is one record with an
 * explicit `knowledgeType`, and the authority and lifecycle differences are
 * declared per type.
 */
import type { AuthorityClass } from "../authority";
import type { Provenance } from "./governance-metadata";
import type { FreshnessState, PublicationState } from "./states";

export const KNOWLEDGE_TYPES = [
  "research",
  "guidance",
  "procedure",
  "policy",
  "standard",
  "template",
  "reference",
  "learning-resource",
] as const;

export type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number];

export interface KnowledgeTypeMeta {
  id: KnowledgeType;
  label: string;
  /** Whether following it is obligatory. */
  obligatory: boolean;
  defaultAuthority: AuthorityClass;
  changeRule: string;
  lifecycleNote: string;
}

export const KNOWLEDGE_TYPE_META: Record<KnowledgeType, KnowledgeTypeMeta> = {
  research: {
    id: "research",
    label: "Research",
    obligatory: false,
    defaultAuthority: "research-candidate",
    changeRule: "Extended by further investigation. Never edited to fit a decision.",
    lifecycleNote: "Ages by evidence, not by calendar. Stale research is still a record of what was found.",
  },
  guidance: {
    id: "guidance",
    label: "Guidance",
    obligatory: false,
    defaultAuthority: "current-summary",
    changeRule: "Revised by its owning capability without a decision record.",
    lifecycleNote: "Should be reviewed when the practice it describes changes.",
  },
  procedure: {
    id: "procedure",
    label: "Procedure",
    obligatory: true,
    defaultAuthority: "accepted-decision",
    changeRule: "Changed only through the decision that adopted it.",
    lifecycleNote: "A procedure nobody follows is a finding, not a procedure.",
  },
  policy: {
    id: "policy",
    label: "Policy",
    obligatory: true,
    defaultAuthority: "approved-authority",
    changeRule: "Changed only by an approved decision, with an effective date.",
    lifecycleNote: "Supersession is mandatory; policies are never edited silently.",
  },
  standard: {
    id: "standard",
    label: "Standard",
    obligatory: true,
    defaultAuthority: "approved-authority",
    changeRule: "Adopted by version. Adopting a new version is a new decision.",
    lifecycleNote: "Conformance is evidence, not assertion.",
  },
  template: {
    id: "template",
    label: "Template",
    obligatory: false,
    defaultAuthority: "provisional-implementation",
    changeRule: "Owned by the capability that produces the deliverable it shapes.",
    lifecycleNote: "A template is not a requirement; the deliverable type is.",
  },
  reference: {
    id: "reference",
    label: "Reference",
    obligatory: false,
    defaultAuthority: "historical-evidence",
    changeRule: "Not changed. Superseded by a newer reference.",
    lifecycleNote: "Cite the version consulted, not the living document.",
  },
  "learning-resource": {
    id: "learning-resource",
    label: "Curriculum or learning resource",
    obligatory: false,
    defaultAuthority: "research-candidate",
    changeRule: "Governed by the learning capability that owns it.",
    lifecycleNote: "Kept distinct from platform content; different review cadence.",
  },
};

export interface SourceRecord {
  sourceId: string;
  title: string;
  sourceKind: "external-publication" | "regulation" | "internal-document" | "system-output" | "interview" | "dataset";
  locator: string;
  publishedOn: string | null;
  retrievedOn: string | null;
  /** How much weight the source can bear, stated rather than assumed. */
  reliabilityNote: string;
  synthetic: boolean;
}

export interface ResearchRecord {
  researchId: string;
  question: string;
  method: string;
  sourceIds: string[];
  /** Statements the research established, each labelled by confidence. */
  observations: { statement: string; confidence: "confirmed" | "supported-interpretation" | "unverified" }[];
  /** Inferences the project drew. Explicitly separate from observations. */
  interpretations: string[];
  /** What the research does not establish. */
  limitations: string[];
  /** Requirements this could inform. Informing is not becoming. */
  couldInformRequirementIds: string[];
  authorityState: AuthorityClass;
  freshnessState: FreshnessState;
  publicationState: PublicationState;
  provenance: Provenance;
  synthetic: boolean;
}

export interface KnowledgeObjectRecord {
  knowledgeId: string;
  knowledgeType: KnowledgeType;
  title: string;
  purpose: string;
  ownerCapabilityId: string;
  authorityState: AuthorityClass;
  publicationState: PublicationState;
  freshnessState: FreshnessState;
  version: string;
  supersedes: string[];
  supersededBy: string | null;
  reviewTrigger: string;
  provenance: Provenance;
  synthetic: boolean;
}

export const KNOWLEDGE_SEPARATION_RULES: { id: string; rule: string }[] = [
  { id: "KNW-01", rule: "A source is not a finding. Citing something does not establish it." },
  { id: "KNW-02", rule: "A finding is not a requirement. Only a decision creates an obligation." },
  { id: "KNW-03", rule: "An interpretation is labelled as one, and never presented as an observation." },
  { id: "KNW-04", rule: "Research never silently becomes policy, standard, or procedure." },
  { id: "KNW-05", rule: "Unknown is recorded as unknown rather than omitted." },
];
