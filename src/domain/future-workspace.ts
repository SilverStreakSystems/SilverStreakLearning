/**
 * Target-state workspace projection.
 *
 * There is exactly one canonical workspace model in this system:
 * `WorkspaceDefinition` in `./workspace/workspace`. This module holds no
 * records of its own. It derives the gated future view from that canonical
 * source so the two can never drift apart.
 *
 * A derived view is not a source of truth and carries no authority of its own.
 */
import type { AuthorityClass } from "./authority";
import {
  WORKSPACE_AVAILABILITY_META,
  operatesNow,
  type WorkspaceAvailability,
  type WorkspaceDefinition,
} from "./workspace/workspace";

export const FUTURE_GATE_NOTICE = "Target-state candidate. Not current implementation authority.";

/**
 * A workspace as shown on the Future Architecture page. Every field is read
 * from the canonical definition; none of them is separately authored.
 */
export interface FutureWorkspaceView {
  workspaceId: string;
  name: string;
  /** The canonical purpose. */
  intent: string;
  /** Capabilities the canonical definition says this workspace requires. */
  requiredCapabilities: string[];
  /** The canonical future boundary, which states what is still not permitted. */
  promotionRequirement: string;
  /** What triggers a re-read of this workspace's gate. */
  reviewTrigger: string;
  availability: WorkspaceAvailability;
  availabilityLabel: string;
  availabilityMarker: string;
  authorityClass: Extract<AuthorityClass, "gated-future">;
  gateNotice: string;
  /** Recorded so the page can never imply a gated workspace is running. */
  operatesNow: boolean;
}

export function toFutureWorkspaceView(workspace: WorkspaceDefinition): FutureWorkspaceView {
  const availability = WORKSPACE_AVAILABILITY_META[workspace.availability];
  return {
    workspaceId: workspace.workspaceId,
    name: workspace.name,
    intent: workspace.purpose,
    requiredCapabilities: workspace.requiredCapabilities,
    promotionRequirement: workspace.futureBoundary,
    reviewTrigger: workspace.reviewTrigger,
    availability: workspace.availability,
    availabilityLabel: availability.label,
    availabilityMarker: availability.marker,
    authorityClass: "gated-future",
    gateNotice: FUTURE_GATE_NOTICE,
    operatesNow: operatesNow(workspace),
  };
}

/**
 * The target-state view: every canonical workspace that is not operating now.
 * A workspace leaves this list only by becoming current in the canonical
 * source, never by being edited here.
 */
export function deriveFutureWorkspaces(
  workspaces: WorkspaceDefinition[],
): FutureWorkspaceView[] {
  return workspaces.filter((workspace) => !operatesNow(workspace)).map(toFutureWorkspaceView);
}
