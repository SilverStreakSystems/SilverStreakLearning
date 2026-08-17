/**
 * Burden model.
 *
 * A workflow that reduces executive burden by transferring hidden work to
 * educators, support staff, families, or customers is not an improvement.
 * Burden is therefore recorded with the party who bears it.
 */

export const BURDEN_TYPES = [
  "setup",
  "recurring",
  "coordination",
  "documentation",
  "review",
  "correction",
  "training",
  "support",
] as const;

export type BurdenType = (typeof BURDEN_TYPES)[number];

export const BURDEN_TYPE_LABEL: Record<BurdenType, string> = {
  setup: "Setup burden",
  recurring: "Recurring burden",
  coordination: "Coordination burden",
  documentation: "Documentation burden",
  review: "Review burden",
  correction: "Correction burden",
  training: "Training burden",
  support: "Support burden",
};

export const BURDEN_BEARERS = [
  "founder-operator",
  "internal-function",
  "district-leader",
  "school-administrator",
  "educator",
  "support-staff",
  "student",
  "family",
  "vendor",
] as const;

export type BurdenBearer = (typeof BURDEN_BEARERS)[number];

export const BURDEN_BEARER_LABEL: Record<BurdenBearer, string> = {
  "founder-operator": "Founder or developer operator",
  "internal-function": "Internal enterprise function",
  "district-leader": "District leader",
  "school-administrator": "School administrator",
  educator: "Educator",
  "support-staff": "Support staff",
  student: "Student",
  family: "Family",
  vendor: "Vendor",
};

export const BURDEN_LEVELS = ["low", "moderate", "high"] as const;
export type BurdenLevel = (typeof BURDEN_LEVELS)[number];

export interface BurdenAssessment {
  burdenId: string;
  valueStreamId: string;
  burdenType: BurdenType;
  bearer: BurdenBearer;
  level: BurdenLevel;
  description: string;
  /** What is being reduced elsewhere to justify this burden, if anything. */
  offset: string | null;
  mitigation: string;
}

/** Burden shifted onto people served by the product, with no stated offset. */
export function unjustifiedTransfers(assessments: BurdenAssessment[]): BurdenAssessment[] {
  const servedParties: BurdenBearer[] = [
    "educator",
    "support-staff",
    "student",
    "family",
    "school-administrator",
  ];
  return assessments.filter(
    (a) => servedParties.includes(a.bearer) && a.level !== "low" && a.offset === null,
  );
}
