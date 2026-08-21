/**
 * Generator — drift calibration analysis, sample, and review packet.
 *
 * Every artefact this script writes is a deterministic projection of the
 * workflow register, the TDP-001 contract, and the parser, evaluator, and
 * classifier versions. Nothing it writes is an owner decision, and it cannot
 * write one: the analysis model has no field an owner disposition could go in
 * other than the nulls it always emits.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import {
  type DriftAnalysisRecord,
  driftAnalysisDocument,
  mandatoryCohort,
  negativeControls,
  nonIdenticalRecords,
  representativeSample,
  samplePopulation,
  SAMPLE_CAP,
} from "../src/lib/technology-decision-drift";
import { contentFingerprint } from "../src/domain/technology-decisions";

const DATA_DIR = "data/technology-decisions/generated";
const DOC_DIR = "docs/technology-decisions";

const NON_AUTHORITY =
  "GENERATED ANALYSIS — NOT AN OWNER DECISION. Nothing in this document authorizes implementation, activates a workflow, adopts an option, or closes a gate. Every proposal is an engineering reading offered for owner review.";

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeDoc(path: string, lines: string[]): void {
  writeFileSync(path, `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`);
}

function table(headers: string[], rows: string[][]): string[] {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ];
}

function countTable(title: string, counts: Record<string, number>): string[] {
  return [
    `### ${title}`,
    "",
    ...table(
      ["Value", "Count"],
      Object.entries(counts).map(([key, value]) => [key, String(value)]),
    ),
    "",
  ];
}

function recordDetail(record: DriftAnalysisRecord): string[] {
  return [
    `### ${record.workflow_id} — ${record.role_group_name}`,
    "",
    `- Role: ${record.role}`,
    `- Workflow: ${record.workflow}`,
    `- Supplied recommendation (verbatim source): "${record.source_recommendation_verbatim}"`,
    `- Read as: ${record.expression_type} / ${record.parse_status} — committed ${record.supplied_option_ids.join(", ") || "none"}${
      record.supplied_deferred_option_ids.length > 0
        ? `; staged or optional ${record.supplied_deferred_option_ids.join(", ")}`
        : ""
    }`,
    `- Derived: ${record.derived_option_ids.join(", ") || "abstained"} (${record.deciding_step ?? "no deciding step"})`,
    `- Relation: ${record.comparison_relation} — ${record.comparison_explanation}`,
    `- Decision drivers: ${record.decision_drivers.join(", ") || "none recorded"}`,
    `- Evidence: ${record.evidence_state}; defect state: ${record.defect_state}`,
    `- Candidate causes: ${record.candidate_causes.join(", ") || "none"}`,
    `- Unresolved question: ${record.unresolved_question ?? "none recorded"}`,
    `- Mandatory review: ${record.mandatory_review ? record.mandatory_review_reasons.join(" ") : "no"}`,
    `- Proposed resolution (engineering proposal, not a disposition): ${record.proposed_resolution} — ${record.proposal_basis}`,
    `- Owner disposition: ${record.owner_disposition === null ? "none recorded" : "INVALID"}; review status: ${record.review_status}`,
    "",
  ];
}

function main(): void {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOC_DIR, { recursive: true });

  const analysis = driftAnalysisDocument();
  const sample = representativeSample();
  const mandatory = mandatoryCohort();
  const nonIdentical = nonIdenticalRecords();
  const controls = negativeControls();
  const byId = new Map(analysis.records.map((record) => [record.workflow_id, record]));

  writeJson(`${DATA_DIR}/drift-analysis.json`, analysis);
  writeJson(`${DATA_DIR}/drift-sample.json`, {
    authority_status: "GENERATED-NONAUTHORITATIVE",
    authority_note: NON_AUTHORITY,
    schema_version: "1.0.0",
    analysis_generation_fingerprint: analysis.generation_fingerprint,
    parser_version: analysis.parser_version,
    evaluator_version: analysis.evaluator_version,
    classifier_version: analysis.classifier_version,
    mandatory_cohort: {
      basis:
        "Reviewed in full, one record at a time. Batch treatment is prohibited for every record listed here.",
      size: mandatory.length,
      workflow_ids: mandatory.map((record) => record.workflow_id),
    },
    representative_sample: sample,
    negative_controls: {
      basis:
        "Drawn deterministically from records where both readings agree. A spurious relation here would indicate a mechanism defect.",
      workflow_ids: controls.map((record) => record.workflow_id),
    },
    sample_fingerprint: contentFingerprint([analysis.generation_fingerprint, sample]),
  });

  // ---- DRIFT-CALIBRATION-001 -------------------------------------------
  writeDoc(`${DOC_DIR}/DRIFT-CALIBRATION-001.md`, [
    "# DRIFT-CALIBRATION-001 — Technology decision comparison calibration",
    "",
    `> ${NON_AUTHORITY}`,
    "",
    "Generated by `scripts/gen-drift-calibration.ts`. Do not edit by hand.",
    "",
    "## Provenance",
    "",
    ...table(
      ["Field", "Value"],
      [
        ["Decision process", `${analysis.decision_process_id} v${analysis.decision_process_version}`],
        ["Parser version", analysis.parser_version],
        ["Evaluator version", analysis.evaluator_version],
        ["Classifier version", analysis.classifier_version],
        ["Analysis schema", analysis.analysis_schema_version],
        ["Fingerprint algorithm", analysis.fingerprint_algorithm],
        ["Register fingerprint", `\`${analysis.workflow_register_fingerprint}\``],
        ["Generation fingerprint", `\`${analysis.generation_fingerprint}\``],
      ],
    ),
    "",
    "## What was calibrated",
    "",
    "**Fact.** Every one of the " +
      `${analysis.totals.workflows} registered workflows was re-read by an explicit expression parser, re-evaluated by TDP-001, and assigned exactly one comparison relation.`,
    "",
    "**Fact.** The supplied `recommended_solution` text is stored verbatim in every record. The parsed reading is stored beside it, never in place of it.",
    "",
    "**Fact.** A staged, optional, or interim option reference is recorded separately from the committed set. Reading `Option 4 future` as a present commitment was the parser defect this increment corrected.",
    "",
    "**Inference.** Relation counts below describe the mechanism's current reading. They are not evidence that either side is correct.",
    "",
    "**Unresolved.** Whether a given disagreement should be resolved toward the source or the derived set is an owner judgement. No such judgement is recorded here.",
    "",
    "## Counts across all workflows",
    "",
    ...countTable("Comparison relation", analysis.totals.relations),
    ...countTable("Evidence state", analysis.totals.evidence_states),
    ...countTable("Candidate cause (non-exclusive)", analysis.totals.candidate_causes),
    ...countTable("Proposed resolution", analysis.totals.proposed_resolutions),
    "## Review population",
    "",
    ...table(
      ["Population", "Size"],
      [
        ["All workflows", String(analysis.totals.workflows)],
        ["Non-identical (analyzed in full)", String(nonIdentical.length)],
        ["Mandatory individual review", String(mandatory.length)],
        ["Eligible for the representative sample", String(samplePopulation().length)],
        ["Batch-eligible records", String(analysis.totals.batch_eligible)],
        ["Proposal batches", String(analysis.batches.length)],
        ["Negative controls", String(controls.length)],
      ],
    ),
    "",
    "## Owner disposition status",
    "",
    `**Fact.** ${analysis.records.length} of ${analysis.records.length} records carry \`owner_disposition: null\`, \`review_status: NOT-REVIEWED\`, and \`owner_decision_id: null\`. This increment recorded no dispositions.`,
    "",
  ]);

  // ---- DRIFT-SAMPLE-001 -------------------------------------------------
  writeDoc(`${DOC_DIR}/DRIFT-SAMPLE-001.md`, [
    "# DRIFT-SAMPLE-001 — Risk-weighted review sample",
    "",
    `> ${NON_AUTHORITY}`,
    "",
    "Generated by `scripts/gen-drift-calibration.ts`. Do not edit by hand.",
    "",
    "## Method",
    "",
    `Records that are high risk, consequential, student- or family-facing, AI-boundary conflicted, evidentially contradictory, or fully disjoint are reviewed individually and never sampled. From the remaining ${samplePopulation().length} non-identical records, selection maximises marginal strata coverage, capped at ${SAMPLE_CAP}, with SHA-256 tie-breaking over algorithm version, population fingerprint, and workflow id. Register row order cannot affect the result.`,
    "",
    ...table(
      ["Field", "Value"],
      [
        ["Algorithm version", sample.algorithm_version],
        ["Population fingerprint", `\`${sample.population_fingerprint}\``],
        ["Population size", String(sample.population_size)],
        ["Cap", String(sample.cap)],
        ["Selected", String(sample.selected.length)],
        ["Strata covered", String(sample.strata_covered.length)],
        ["Strata uncovered", String(sample.strata_uncovered.length)],
      ],
    ),
    "",
    sample.strata_uncovered.length > 0
      ? `**Unresolved.** These strata are not represented in the sample: ${sample.strata_uncovered.join(", ")}.`
      : "**Fact.** Every stratum present in the sampled population is represented.",
    "",
    "## Mandatory individual review",
    "",
    `${mandatory.length} records. Never batched.`,
    "",
    ...mandatory.flatMap((record) => recordDetail(record)),
    "## Sampled records",
    "",
    ...sample.selected.flatMap((entry) => {
      const record = byId.get(entry.workflow_id);
      return record ? recordDetail(record) : [];
    }),
    "## Negative controls",
    "",
    ...controls.flatMap((record) => recordDetail(record)),
  ]);

  // ---- FOUNDER-REVIEW-PACKET-001 ---------------------------------------
  writeDoc(`${DOC_DIR}/FOUNDER-REVIEW-PACKET-001.md`, [
    "# FOUNDER-REVIEW-PACKET-001 — Owner review packet",
    "",
    `> ${NON_AUTHORITY}`,
    "",
    "Generated by `scripts/gen-drift-calibration.ts`. Do not edit by hand.",
    "",
    "## What this packet is",
    "",
    "A prepared reading list. It states what the mechanism now reads, where the two readings differ, what evidence exists, and what an engineer would propose. It records no decision, and reading it changes nothing.",
    "",
    "## What is being asked of the owner",
    "",
    "Nothing yet. Dispositions are a separate, later act, recorded as an owner decision under the governing programme. See `docs/technology-decisions/FOUNDER_REVIEW_PROTOCOL.md`.",
    "",
    "## Scale of the review",
    "",
    ...table(
      ["Queue", "Size", "Handling"],
      [
        ["Mandatory individual review", String(mandatory.length), "One record at a time. No batching."],
        [
          "Representative sample",
          String(sample.selected.length),
          "Calibration read. Confirms the mechanism before wider review.",
        ],
        [
          "Batch-eligible proposals",
          String(analysis.totals.batch_eligible),
          `Grouped into ${analysis.batches.length} batches by identical basis fingerprint.`,
        ],
        [
          "Needs evidence",
          String(
            analysis.records.filter((record) => record.proposed_resolution === "NEEDS-EVIDENCE")
              .length,
          ),
          "Not a disagreement. Source fields are insufficient.",
        ],
      ],
    ),
    "",
    "## Batches",
    "",
    analysis.batches.length === 0
      ? "No batch met the identical-basis requirement."
      : table(
          ["Batch", "Proposal", "Members", "Workflow IDs"],
          analysis.batches.map((batch) => [
            batch.batch_id,
            batch.proposed_resolution,
            String(batch.member_workflow_ids.length),
            batch.member_workflow_ids.join(" "),
          ]),
        ).join("\n"),
    "",
    "## Standing limits",
    "",
    "- No supplied recommendation was altered.",
    "- No evaluator rule was changed to reduce the number of disagreements.",
    "- Records the source does not support are marked as needing evidence rather than resolved.",
    "- Product Alpha and roadmap proximity are not declared per workflow in the canonical register, so they could not be used as cohort criteria. This is a limitation, not a finding.",
    "",
  ]);

  console.log(
    `drift calibration: ${analysis.totals.workflows} workflows, ${nonIdentical.length} non-identical, ${mandatory.length} mandatory, ${sample.selected.length} sampled, ${analysis.batches.length} batches`,
  );
}

main();
