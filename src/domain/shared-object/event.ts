/**
 * Shared event contract.
 *
 * An event is a bounded occurrence in time that people participate in. It is a
 * reference contract in this increment: no scheduling, no invitations, no
 * calendar integration, and no attendance tracking of real people.
 */
import type { Provenance } from "./governance-metadata";

export const EVENT_TYPES = [
  "meeting",
  "deadline",
  "assessment",
  "review",
  "implementation-milestone",
  "professional-learning",
  "support-event",
  "governance-review",
  "release-milestone",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  meeting: "Meeting",
  deadline: "Deadline",
  assessment: "Assessment",
  review: "Review",
  "implementation-milestone": "Implementation milestone",
  "professional-learning": "Professional learning",
  "support-event": "Support event",
  "governance-review": "Governance review",
  "release-milestone": "Release milestone",
};

export const EVENT_MODES = ["in-person", "virtual", "hybrid", "asynchronous"] as const;
export type EventMode = (typeof EVENT_MODES)[number];

export const EVENT_MODE_LABEL: Record<EventMode, string> = {
  "in-person": "In person",
  virtual: "Virtual",
  hybrid: "Hybrid",
  asynchronous: "Asynchronous",
};

export interface EventParticipantReference {
  /** A role or capacity reference. Never a named person in this boundary. */
  actingCapacityId: string;
  /** Whether attendance is required for the event to be valid. */
  required: boolean;
  reasonForParticipation: string;
}

export interface EventRecord {
  eventId: string;
  eventType: EventType;
  purpose: string;
  title: string;
  startsAt: string;
  endsAt: string;
  /** IANA zone. Stored explicitly, never inferred from the viewer. */
  timezone: string;
  participants: EventParticipantReference[];
  mode: EventMode;
  location: string | null;
  relatedObjectIds: string[];
  /** Who may see that this event exists, and why. */
  visibilityRule: string;
  recurrenceRule: string | null;
  outcome: string | null;
  evidenceIds: string[];
  cancelled: boolean;
  cancellationReason: string | null;
  provenance: Provenance;
  synthetic: boolean;
}
