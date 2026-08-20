/**
 * Import is a previewed replace, never a silent merge.
 *
 * The caller sees exactly what would be added, removed, and changed before
 * anything is written, and must confirm. This module computes that difference
 * and decides nothing on its own.
 */
import type { LearningLoopDocument } from "@/domain/learning-loop";

export interface FamilyDiff {
  family: string;
  added: string[];
  removed: string[];
  changed: string[];
  unchanged: number;
}

function diffFamily<T>(
  family: string,
  current: T[],
  incoming: T[],
  id: (row: T) => string,
): FamilyDiff {
  const currentMap = new Map(current.map((row) => [id(row), JSON.stringify(row)]));
  const incomingMap = new Map(incoming.map((row) => [id(row), JSON.stringify(row)]));
  const added: string[] = [];
  const changed: string[] = [];
  let unchanged = 0;
  for (const [key, value] of incomingMap) {
    if (!currentMap.has(key)) added.push(key);
    else if (currentMap.get(key) !== value) changed.push(key);
    else unchanged += 1;
  }
  const removed = [...currentMap.keys()].filter((key) => !incomingMap.has(key));
  return { family, added: added.sort(), removed: removed.sort(), changed: changed.sort(), unchanged };
}

export interface ImportPreview {
  families: FamilyDiff[];
  totalAdded: number;
  totalRemoved: number;
  totalChanged: number;
  identical: boolean;
}

export function buildImportPreview(
  current: LearningLoopDocument | null,
  incoming: LearningLoopDocument,
): ImportPreview {
  const empty: LearningLoopDocument["learners"] = [];
  const families: FamilyDiff[] = [
    diffFamily("Learners", current?.learners ?? empty, incoming.learners, (row) => row.learnerId),
    diffFamily("Goals", current?.goals ?? [], incoming.goals, (row) => row.goalId),
    diffFamily(
      "Observations",
      current?.observations ?? [],
      incoming.observations,
      (row) => row.observationId,
    ),
    diffFamily(
      "Support actions",
      current?.supportActions ?? [],
      incoming.supportActions,
      (row) => row.supportActionId,
    ),
    diffFamily("Results", current?.goalReviews ?? [], incoming.goalReviews, (row) => row.goalReviewId),
  ];
  const totalAdded = families.reduce((sum, row) => sum + row.added.length, 0);
  const totalRemoved = families.reduce((sum, row) => sum + row.removed.length, 0);
  const totalChanged = families.reduce((sum, row) => sum + row.changed.length, 0);
  return {
    families,
    totalAdded,
    totalRemoved,
    totalChanged,
    identical: totalAdded + totalRemoved + totalChanged === 0,
  };
}
