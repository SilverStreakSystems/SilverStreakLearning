/**
 * Import roster guard for the bounded synthetic preview.
 *
 * PRODUCT-ALPHA-001 is a local synthetic slice with an immutable fictional
 * roster. A `synthetic: true` flag on an imported record is a claim, not a
 * control: without this guard a hand-edited file could introduce arbitrary
 * learner identities into the preview and still look compliant.
 *
 * So the roster itself is fixed. Records about the seeded learners may come and
 * go through import; the learners may not. Their identifiers, display labels,
 * grade bands, origin, and synthetic flag must match the seed exactly, and no
 * learner may be added or removed. Everything else in the document is subject
 * to the ordinary schema and invariant checks.
 *
 * This is a preview boundary, not a privacy control. It reduces the ways real
 * identities can be typed into a surface that must never hold them.
 */
import {
  createSeedDocument,
  LEARNING_LOOP_APPLICATION,
  LEARNING_LOOP_SCHEMA_VERSION,
  LEARNING_LOOP_SEED_VERSION,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import { SEED_DATASET_ID } from "@/domain/learning-loop";

/** The learner fields that are frozen for the whole life of the preview. */
const FROZEN_FIELDS = ["displayLabel", "gradeBand", "origin", "synthetic"] as const;

export function checkImportedRoster(incoming: LearningLoopDocument): string[] {
  const problems: string[] = [];
  const seed = createSeedDocument();

  if (incoming.application !== LEARNING_LOOP_APPLICATION)
    problems.push("The file was not written by this preview application.");
  if (incoming.schemaVersion !== LEARNING_LOOP_SCHEMA_VERSION)
    problems.push("The file does not carry this preview's schema version.");
  if (incoming.datasetId !== SEED_DATASET_ID)
    problems.push("The file is not the synthetic dataset this preview is allowed to hold.");
  if (incoming.seedVersion !== LEARNING_LOOP_SEED_VERSION)
    problems.push("The file does not carry this preview's seed version.");
  if (incoming.syntheticOnly !== true)
    problems.push("The file is not marked as synthetic-only data.");

  const seedById = new Map(seed.learners.map((row) => [row.learnerId, row]));
  const incomingById = new Map(incoming.learners.map((row) => [row.learnerId, row]));

  for (const learnerId of seedById.keys())
    if (!incomingById.has(learnerId))
      problems.push(`The file removes seeded learner ${learnerId}.`);
  for (const learnerId of incomingById.keys())
    if (!seedById.has(learnerId))
      problems.push(`The file adds learner ${learnerId}, which is not in the fixed sample roster.`);

  for (const [learnerId, expected] of seedById) {
    const actual = incomingById.get(learnerId);
    if (!actual) continue;
    for (const field of FROZEN_FIELDS)
      if (actual[field] !== expected[field])
        problems.push(`The file changes the ${field} of learner ${learnerId}.`);
  }

  return problems;
}
