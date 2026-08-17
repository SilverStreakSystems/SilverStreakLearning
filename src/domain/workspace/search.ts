/**
 * Universal Search contract.
 *
 * Authorization runs before retrieval. Unauthorized records are removed from
 * the candidate set in one step, so they cannot leak through counts, facets,
 * suggestions, or the existence of a filter value.
 */

export const SEARCH_DOMAINS = [
  "capabilities",
  "requirements",
  "decisions",
  "policies",
  "standards",
  "research",
  "findings",
  "evidence",
  "risks",
  "work-items",
  "deliverables",
  "events",
  "products",
  "organizations",
  "value-streams",
  "artifacts",
  "documentation",
] as const;

export type SearchDomain = (typeof SEARCH_DOMAINS)[number];

export const SEARCH_DOMAIN_LABEL: Record<SearchDomain, string> = {
  capabilities: "Capabilities",
  requirements: "Requirements",
  decisions: "Decisions",
  policies: "Policies",
  standards: "Standards",
  research: "Research",
  findings: "Findings",
  evidence: "Evidence",
  risks: "Risks",
  "work-items": "Work items",
  deliverables: "Deliverables",
  events: "Events",
  products: "Products",
  organizations: "Organizations",
  "value-streams": "Value streams",
  artifacts: "Artifacts",
  documentation: "Documentation",
};

export const SEARCH_RECORD_TENSE = ["current", "historical"] as const;
export type SearchRecordTense = (typeof SEARCH_RECORD_TENSE)[number];

export interface SearchableRecord {
  recordId: string;
  domain: SearchDomain;
  objectType: string;
  title: string;
  /** Shown only after authorization succeeds. */
  snippet: string;
  authorityClass: string;
  status: string;
  freshness: "current" | "stale" | "expired" | "unknown";
  provenance: string;
  tense: SearchRecordTense;
  route: string;
  /** Capacities authorized to retrieve this record at all. */
  authorizedCapacities: string[];
  synthetic: boolean;
}

export interface SearchQuery {
  term: string;
  capacityId: string;
  domain: SearchDomain | "all";
  authority: string | "all";
  status: string | "all";
  freshness: SearchableRecord["freshness"] | "all";
  tense: SearchRecordTense | "all";
}

export interface SearchOutcome {
  /** Records the capacity may retrieve AND that match the query. */
  results: SearchableRecord[];
  /** Count of matching authorized records only. Never total matches. */
  authorizedMatchCount: number;
  /** Facets built from authorized records only. */
  domainFacets: { domain: SearchDomain; count: number }[];
  /** Suggestions drawn from authorized titles only. */
  suggestions: string[];
  /**
   * Number of records excluded because the capacity is unauthorized.
   * Reported as a single opaque figure and never broken down, so it cannot be
   * used to infer which records exist.
   */
  withheldNotice: string | null;
  surfaceStateHint: "normal" | "no-results" | "empty";
}

export const SEARCH_LEAK_RULES = [
  "Authorization filters the candidate set before matching, ranking, or counting.",
  "Result counts include authorized records only.",
  "Facet values, filter options, and suggestions are built from authorized records only.",
  "A withheld record is never named, counted per domain, or hinted at by a gap in identifiers.",
  "The absence of a result never confirms that a record exists somewhere else.",
] as const;
