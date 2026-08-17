/**
 * Command surface projection contracts.
 *
 * Read contracts only. None of these surfaces exists, none is authorized, and
 * defining one does not permit building it.
 */
import type { ProjectionContract } from "@/domain";

export const VALUE_STREAM_PROJECTIONS: ProjectionContract[] = [
  {
    surface: "enterprise-command-center",
    purpose:
      "Show what is currently blocked, what is waiting on a decision, and what is refused across all streams.",
    audience: "Founder or developer operator, acting in a governance capacity.",
    readOnlyProjection: true,
    active: false,
    authorityNote:
      "The panel reflects declared states on governed objects. It never assigns authority and never creates a state.",
    panels: [
      {
        panelId: "ECC-P1",
        question: "Which stages cannot proceed, and who owns the reason?",
        sourceObjects: ["work-item", "finding", "value-stream-reference"],
        prohibitedInference:
          "A short blocked list does not mean the enterprise is healthy; it may mean nothing is being attempted.",
      },
      {
        panelId: "ECC-P2",
        question: "Which decisions are required before anything else may move?",
        sourceObjects: ["decision", "requirement", "approval"],
        prohibitedInference:
          "A pending decision is not an overdue decision unless a commitment says so.",
      },
      {
        panelId: "ECC-P3",
        question: "What has been refused, and on what ground?",
        sourceObjects: ["finding", "policy-rule", "claim"],
        prohibitedInference:
          "A refusal is not a failure metric and may not be counted against any function.",
      },
    ],
  },
  {
    surface: "function-command-center",
    purpose: "Show one function what it owns, what it is waiting on, and what is waiting on it.",
    audience: "A single enterprise function, candidate and unstaffed.",
    readOnlyProjection: true,
    active: false,
    authorityNote:
      "Ownership shown here is the candidate accountability recorded on the function, not a staffing assignment.",
    panels: [
      {
        panelId: "FCC-P1",
        question: "Which gates does this function own, and what is their disposition?",
        sourceObjects: ["review", "approval", "enterprise-function-reference"],
        prohibitedInference:
          "Owning a gate does not confer authority to approve the work that passes through it.",
      },
      {
        panelId: "FCC-P2",
        question: "Which handoffs to this function are pending acceptance?",
        sourceObjects: ["work-item", "deliverable-instance", "event"],
        prohibitedInference:
          "A pending handoff does not mean the receiver is late; the sender may not have met acceptance criteria.",
      },
    ],
  },
  {
    surface: "individual-action-center",
    purpose: "Show a person acting in a declared capacity the next legitimate action available to them.",
    audience: "One person, in one acting capacity, at one time.",
    readOnlyProjection: true,
    active: false,
    authorityNote:
      "Capacity is declared per session. The surface may not merge two capacities into one action list.",
    panels: [
      {
        panelId: "IAC-P1",
        question: "What may I legitimately do next in this capacity?",
        sourceObjects: ["work-item", "acting-capacity", "context-package"],
        prohibitedInference:
          "An empty action list is not evidence of idleness and may never be measured as such.",
      },
    ],
  },
  {
    surface: "manager-view",
    purpose: "Show sustained load and unresolved burden across work a function is accountable for.",
    audience: "A candidate accountable role. No such role is staffed.",
    readOnlyProjection: true,
    active: false,
    authorityNote:
      "This surface is gated. It may not be built until prohibited-measure rules are enforced in code, because it is the surface most likely to become surveillance.",
    panels: [
      {
        panelId: "MV-P1",
        question: "Where is burden accumulating without a stated offset?",
        sourceObjects: ["finding", "work-item", "risk"],
        prohibitedInference:
          "Burden is a property of work design, never a performance judgment about a person.",
      },
    ],
  },
  {
    surface: "cross-functional-program-view",
    purpose: "Show dependencies that cross function boundaries and have no single owner.",
    audience: "Governance capacity only.",
    readOnlyProjection: true,
    active: false,
    authorityNote: "Cross-function visibility does not create cross-function authority.",
    panels: [
      {
        panelId: "XP-P1",
        question: "Which dependencies are unowned or hidden?",
        sourceObjects: ["risk", "work-item", "enterprise-function-reference"],
        prohibitedInference:
          "An unowned dependency is a finding to resolve, not a reason to assign an owner without their acceptance.",
      },
    ],
  },
];
