/**
 * Workspace projection queries.
 *
 * Everything here is derived from canonical registers at read time. Nothing in
 * this module stores an obligation, a notification, or a search record of its
 * own: if a register changes, these projections change with it.
 */
import {
  ACTIVE_CAPACITY_ID,
  ACTING_CAPACITIES,
  CLAIMS,
  DECISIONS,
  EVIDENCE,
  FINDINGS,
  GLOBAL_UTILITIES,
  OPERATOR_IDENTITY,
  WORKSPACES,
  WORKSPACE_MEMBERSHIPS,
} from "@/fixtures";
import {
  compareActions,
  type ActingCapacity,
  type ActionItem,
  type NotificationRecord,
  type ProjectionStepRecord,
  type SearchableRecord,
  type SearchDomain,
  type SearchOutcome,
  type SearchQuery,
  type SurfaceState,
  type WorkspaceDefinition,
  type WorkspaceProjectionRecord,
} from "@/domain";

export function getCapacity(capacityId: string): ActingCapacity | undefined {
  return ACTING_CAPACITIES.find((capacity) => capacity.capacityId === capacityId);
}

export const ACTIVE_CAPACITY = getCapacity(ACTIVE_CAPACITY_ID)!;

export function getWorkspace(workspaceId: string): WorkspaceDefinition | undefined {
  return WORKSPACES.find((workspace) => workspace.workspaceId === workspaceId);
}

export function membershipsFor(capacityId: string) {
  return WORKSPACE_MEMBERSHIPS.filter((membership) => membership.capacityId === capacityId);
}

/* ------------------------------------------------------------------ actions */

/**
 * Projects obligations that already exist on canonical register records.
 * The Action Center creates nothing.
 */
export function buildActions(): ActionItem[] {
  const actions: ActionItem[] = [];

  for (const finding of FINDINGS) {
    if (finding.resolutionState !== "blocked" && finding.resolutionState !== "conflicted") continue;
    actions.push({
      actionId: `action-finding-${finding.id}`,
      kind: "unresolved-finding",
      title: finding.title,
      whatNeedsAttention: finding.description,
      why: finding.boundary,
      dueBy: null,
      canonicalSource: { objectId: finding.id, objectType: "finding", route: "/findings" },
      authorityBasis: "Founder operator holds resolution authority within the governed boundary.",
      availableActions: [
        finding.requiredDecision
          ? `Record the decision: ${finding.requiredDecision}`
          : "Record a resolution",
        "Record why the finding stays open",
      ],
      requiredContext: ["The evidence the finding rests on", "Any decision that would resolve it"],
      consequence: "Dependent work stays blocked until this is resolved or explicitly accepted.",
      valueStreamId: "governance-artifact-lifecycle",
      stageId: null,
      topFactor:
        finding.severity === "governance" ? "governance-gate-blocker" : "cross-stream-dependency",
      restriction: null,
      ownerPriorityDirective: finding.ownerPriorityDirective ?? null,
      synthetic: finding.synthetic,
    });
  }

  for (const decision of DECISIONS) {
    if (decision.state !== "required" && decision.state !== "pending") continue;
    actions.push({
      actionId: `action-decision-${decision.id}`,
      kind: "decision-needed",
      title: decision.title,
      whatNeedsAttention: decision.context,
      why: "Downstream work cannot claim authority until this decision is recorded.",
      dueBy: null,
      canonicalSource: { objectId: decision.id, objectType: "decision", route: "/decisions" },
      authorityBasis: "Governance decision right held by the founder operator.",
      availableActions: ["Accept", "Decline", "Defer with a recorded reason"],
      requiredContext: ["The artifacts the decision governs", "The consequences already recorded"],
      consequence: "An accepted decision becomes citable authority for implementation work.",
      valueStreamId: "requirement-decision",
      stageId: null,
      topFactor: "governance-gate-blocker",
      restriction: null,
      ownerPriorityDirective: null,
      synthetic: decision.synthetic,
    });
  }

  for (const record of EVIDENCE) {
    if (record.collectedOn !== null) continue;
    actions.push({
      actionId: `action-evidence-${record.id}`,
      kind: "evidence-request",
      title: record.title,
      whatNeedsAttention: `${record.subject} has no executed check.`,
      why: "An unrun check cannot support any claim about this subject.",
      dueBy: null,
      canonicalSource: { objectId: record.id, objectType: "evidence", route: "/evidence" },
      authorityBasis: "Assurance obligation recorded on the evidence register.",
      availableActions: ["Run the check and record the result", "Withdraw the associated claim"],
      requiredContext: ["What this evidence would support", "What it explicitly could not support"],
      consequence: "Until it runs, the subject remains unverified rather than passing.",
      valueStreamId: "build-validation",
      stageId: null,
      topFactor: "safety-security-privacy-accessibility-stop",
      restriction: null,
      ownerPriorityDirective: null,
      synthetic: record.synthetic,
    });
  }

  for (const claim of CLAIMS) {
    if (claim.posture !== "refused") continue;
    actions.push({
      actionId: `action-claim-${claim.id}`,
      kind: "review",
      title: `Refused claim stands: ${claim.claim}`,
      whatNeedsAttention: claim.reason,
      why: "A refusal is reviewed when new evidence appears, and left standing otherwise.",
      dueBy: null,
      canonicalSource: { objectId: claim.id, objectType: "claim", route: "/boundaries" },
      authorityBasis: "Claims governance: no claim without evidence.",
      availableActions: ["Leave refused", "Record new evidence and re-review"],
      requiredContext: ["Evidence bound to the exact version being claimed"],
      consequence: "Leaving it refused keeps SSLS able to defend everything it does say.",
      valueStreamId: "evidence-claim",
      stageId: null,
      topFactor: "strategic-importance",
      restriction: null,
      ownerPriorityDirective: null,
      synthetic: true,
    });
  }

  return actions.sort(compareActions);
}

/* ------------------------------------------------------------ notifications */

export function buildNotifications(): NotificationRecord[] {
  const notifications: NotificationRecord[] = [];

  for (const finding of FINDINGS) {
    if (finding.resolutionState !== "blocked") continue;
    notifications.push({
      notificationId: `notify-${finding.id}`,
      trigger: "gate-blocked",
      severity: "stop",
      title: `Blocked: ${finding.title}`,
      detail: finding.description,
      canonicalSource: { objectId: finding.id, objectType: "finding", route: "/findings" },
      addressedToCapacity: ACTIVE_CAPACITY_ID,
      necessityBasis: "Work downstream of this finding must not advance while it stands.",
      actionRequired: finding.requiredDecision ?? "Record a resolution or an explicit acceptance.",
      raisedOn: finding.raisedOn,
      expiresOn: null,
      supersedes: null,
      synthetic: finding.synthetic,
    });
  }

  for (const decision of DECISIONS) {
    if (decision.state !== "required") continue;
    notifications.push({
      notificationId: `notify-${decision.id}`,
      trigger: "decision-needed",
      severity: "act",
      title: `Decision required: ${decision.title}`,
      detail: decision.context,
      canonicalSource: { objectId: decision.id, objectType: "decision", route: "/decisions" },
      addressedToCapacity: ACTIVE_CAPACITY_ID,
      necessityBasis: "Nothing downstream may cite authority until this is recorded.",
      actionRequired: "Accept, decline, or defer with a recorded reason.",
      raisedOn: "2026-01-01",
      expiresOn: null,
      supersedes: null,
      synthetic: decision.synthetic,
    });
  }

  for (const record of EVIDENCE) {
    if (record.collectedOn !== null) continue;
    notifications.push({
      notificationId: `notify-${record.id}`,
      trigger: "evidence-stale",
      severity: "act",
      title: `Never executed: ${record.title}`,
      detail: `${record.subject} has no recorded execution date.`,
      canonicalSource: { objectId: record.id, objectType: "evidence", route: "/evidence" },
      addressedToCapacity: ACTIVE_CAPACITY_ID,
      necessityBasis: "An unrun check is routinely mistaken for a passing check.",
      actionRequired: "Run the check, or record the subject as unverified.",
      raisedOn: "2026-01-01",
      expiresOn: null,
      supersedes: null,
      synthetic: record.synthetic,
    });
  }

  return notifications;
}

/* ------------------------------------------------------------------- search */

const ALL_CAPACITIES = [ACTIVE_CAPACITY_ID];

/** Canonical records exposed to search, each carrying its own authorization list. */
export function buildSearchIndex(): SearchableRecord[] {
  const records: SearchableRecord[] = [];

  for (const decision of DECISIONS) {
    records.push({
      recordId: decision.id,
      domain: "decisions",
      objectType: "decision",
      title: decision.title,
      snippet: decision.decision,
      authorityClass: decision.authorityClass,
      status: decision.state,
      freshness: decision.recordState === "current" ? "current" : "unknown",
      provenance: "Decisions register",
      tense: decision.recordState === "current" ? "current" : "historical",
      route: "/decisions",
      authorizedCapacities: ALL_CAPACITIES,
      synthetic: decision.synthetic,
    });
  }
  for (const finding of FINDINGS) {
    records.push({
      recordId: finding.id,
      domain: "findings",
      objectType: "finding",
      title: finding.title,
      snippet: finding.description,
      authorityClass: "provisional-implementation",
      status: finding.resolutionState,
      freshness: "current",
      provenance: "Findings register",
      tense: "current",
      route: "/findings",
      authorizedCapacities: ALL_CAPACITIES,
      synthetic: finding.synthetic,
    });
  }
  for (const record of EVIDENCE) {
    records.push({
      recordId: record.id,
      domain: "evidence",
      objectType: "evidence",
      title: record.title,
      snippet: record.supports,
      authorityClass: record.authorityClass,
      status: record.state,
      freshness: record.collectedOn ? "current" : "unknown",
      provenance: "Evidence register",
      tense: "current",
      route: "/evidence",
      authorizedCapacities: ALL_CAPACITIES,
      synthetic: record.synthetic,
    });
  }
  for (const workspace of WORKSPACES) {
    records.push({
      recordId: workspace.workspaceId,
      domain: "artifacts",
      objectType: "workspace-definition",
      title: workspace.name,
      snippet: workspace.purpose,
      authorityClass: workspace.authorityState,
      status: workspace.availability,
      freshness: "current",
      provenance: "Workspace architecture",
      tense: "current",
      route: `/workspaces/${workspace.workspaceId}`,
      // Gated workspaces are still discoverable as architecture: the gate is
      // public, only operational records behind it would not be.
      authorizedCapacities: ALL_CAPACITIES,
      synthetic: false,
    });
  }

  return records;
}

export function runSearch(query: SearchQuery, index = buildSearchIndex()): SearchOutcome {
  // Step one, before matching or counting: remove everything this capacity may
  // not retrieve. Nothing downstream can leak what was removed here.
  const authorized = index.filter((record) =>
    record.authorizedCapacities.includes(query.capacityId),
  );
  const withheldCount = index.length - authorized.length;

  const term = query.term.trim().toLowerCase();
  const results = authorized.filter((record) => {
    if (term && !`${record.title} ${record.snippet}`.toLowerCase().includes(term)) return false;
    if (query.domain !== "all" && record.domain !== query.domain) return false;
    if (query.authority !== "all" && record.authorityClass !== query.authority) return false;
    if (query.status !== "all" && record.status !== query.status) return false;
    if (query.freshness !== "all" && record.freshness !== query.freshness) return false;
    if (query.tense !== "all" && record.tense !== query.tense) return false;
    return true;
  });

  const facetCounts = new Map<SearchDomain, number>();
  for (const record of authorized) {
    facetCounts.set(record.domain, (facetCounts.get(record.domain) ?? 0) + 1);
  }

  return {
    results,
    authorizedMatchCount: results.length,
    domainFacets: [...facetCounts.entries()]
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => a.domain.localeCompare(b.domain)),
    suggestions: results.slice(0, 5).map((record) => record.title),
    withheldNotice:
      withheldCount > 0
        ? "Some records are not available to this capacity. They are not described here."
        : null,
    surfaceStateHint:
      authorized.length === 0 ? "empty" : results.length === 0 ? "no-results" : "normal",
  };
}

/* --------------------------------------------------------------- projection */

/**
 * Assembles the nine-step projection record for a workspace. The steps are the
 * audit trail: each one names what was used and what was deliberately not.
 */
export function assembleProjection(
  workspace: WorkspaceDefinition,
  capacity: ActingCapacity,
): WorkspaceProjectionRecord {
  const membership = membershipsFor(capacity.capacityId).find(
    (entry) => entry.workspaceId === workspace.workspaceId,
  );
  const operates = workspace.availability === "current";
  const surfaceState: SurfaceState = operates
    ? membership
      ? "normal"
      : "restricted"
    : "future-gated";

  const steps: ProjectionStepRecord[] = [
    { step: "purpose", value: workspace.purpose },
    {
      step: "authorized-participant",
      value: `${OPERATOR_IDENTITY.displayLabel}. ${OPERATOR_IDENTITY.purpose}`,
    },
    { step: "acting-capacity", value: `${capacity.name} (${capacity.status}).` },
    {
      step: "relationship",
      value: membership
        ? membership.relationship
        : "No membership connects this capacity to this workspace.",
    },
    { step: "applicable-policy", value: workspace.currentBoundary },
    {
      step: "canonical-source-objects",
      value: `Reads ${workspace.sharedObjectsUsed.join(", ")} from their owning registers.`,
    },
    { step: "minimum-authorized-projection", value: workspace.allowedProjections.join(" ") },
    {
      step: "freshness-missing-conflict-check",
      value: operates
        ? "Register freshness is stated on each surface; unrun checks are shown as unrun."
        : "Not performed: this workspace does not operate, so it has no live sources to check.",
    },
    {
      step: "workspace-projection",
      value: operates
        ? "Rendered with the surfaces marked current."
        : "Rendered as architecture with its gate stated.",
    },
  ];

  return {
    projectionId: `projection-${workspace.workspaceId}-${capacity.capacityId}`,
    workspaceId: workspace.workspaceId,
    name: `${workspace.name} projection for ${capacity.name}`,
    purpose: workspace.purpose,
    steps,
    canonicalSourceRefs: workspace.sharedObjectsUsed,
    fieldsShown: workspace.allowedProjections,
    fieldsWithheld: workspace.prohibitedObjects,
    withholdingReason:
      "Outside the governed boundary, or not required by the purpose this projection serves.",
    freshnessNote: operates
      ? "As fresh as the registers behind each surface."
      : "No live sources: this workspace does not operate.",
    missingInformation: membership
      ? []
      : ["No membership connects this capacity to this workspace, so no records are projected."],
    conflicts: [],
    surfaceState,
    isSourceOfTruth: false,
    reusableForOtherPurpose: false,
  };
}

export function utilityFor(route: string) {
  return GLOBAL_UTILITIES.find((utility) => utility.route === route);
}
