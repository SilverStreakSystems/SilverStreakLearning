/**
 * Value stream normalization findings.
 *
 * The candidate list of eighteen streams was supplied as a proposal. This file
 * records what was kept, merged, demoted, deferred, or rejected, and why. Every
 * finding is a judgment about the model, not a claim about operations.
 */
import type { ValueStreamNormalizationFinding } from "@/domain";

export const VALUE_STREAM_NORMALIZATION_FINDINGS: ValueStreamNormalizationFinding[] = [
  {
    findingId: "VSN-001",
    check: "duplicate-streams",
    candidateName: "Requirement → Decision and Feedback → Decision",
    resolvedValueStreamId: "requirement-decision",
    disposition: "kept-as-stream",
    observation:
      "Both candidates end at an approved decision, which reads at first like one duplicated flow.",
    judgment:
      "They are kept separate. Their triggers, entry evidence, and refusal grounds differ: one begins from a stated requirement, the other from unsolicited signal that may not deserve a decision at all.",
    consequence:
      "Feedback → Decision must be able to close with no decision taken, and that closure is a success, not a failure.",
  },
  {
    findingId: "VSN-002",
    check: "subflow-not-stream",
    candidateName: "Evidence collection",
    resolvedValueStreamId: "build-validation",
    disposition: "demoted-to-subflow",
    observation:
      "Collecting evidence was proposed as a stream of its own, running alongside every other stream.",
    judgment:
      "Evidence collection has no independent outcome. It is a stage obligation inside whichever stream needs the proof, and a first-class object elsewhere.",
    consequence:
      "Stage evidence requirements carry the obligation; only Evidence → Claim remains an end-to-end stream, because a public claim is a distinct outcome.",
  },
  {
    findingId: "VSN-003",
    check: "departmental-process",
    candidateName: "Finance operations",
    resolvedValueStreamId: null,
    disposition: "rejected-departmental-process",
    observation:
      "A general finance operations flow was proposed covering invoicing, payroll, and reporting.",
    judgment:
      "This is a departmental process, not an end-to-end value stream: it produces no outcome for a person the enterprise serves and has no learning loop back into direction.",
    consequence:
      "Finance obligations appear as gates and commitments inside Opportunity → Contract and Vendor Lifecycle rather than as a stream.",
  },
  {
    findingId: "VSN-004",
    check: "missing-end-to-end-outcome",
    candidateName: "Enablement and training",
    resolvedValueStreamId: "implementation-adoption",
    disposition: "merged-into-stream",
    observation: "Enablement was proposed as its own stream ending at 'training delivered'.",
    judgment:
      "Training delivered is an output, not an outcome. The outcome is durable practice change, which Implementation → Adoption already carries.",
    consequence:
      "Enablement work appears as stages inside Implementation → Adoption, measured by sustained use rather than sessions run.",
  },
  {
    findingId: "VSN-005",
    check: "overlong-stream",
    candidateName: "Research → Release",
    resolvedValueStreamId: "research-requirement",
    disposition: "merged-into-stream",
    observation:
      "A single stream was proposed running from raw research all the way to a released capability.",
    judgment:
      "That span crosses four separate authority handoffs and could not be governed as one flow. It is split into Research → Requirement, Requirement → Decision, Decision → Build, Build → Validation, and Validation → Release.",
    consequence:
      "Each split point becomes an explicit gate with its own owner, refusal grounds, and evidence requirements.",
  },
  {
    findingId: "VSN-006",
    check: "broken-handoff",
    candidateName: "Validation → Release",
    resolvedValueStreamId: "validation-release",
    disposition: "kept-as-stream",
    observation: "The original candidate advanced to release when validation was marked complete.",
    judgment:
      "Completion of validation work is not release authority. Release requires a declared authority decision that a validated capability may be exposed, and a separate decision before anything may be claimed publicly.",
    consequence:
      "The release gate cannot read the validation axis as permission; it requires an approval record on the approval axis.",
  },
  {
    findingId: "VSN-007",
    check: "overlapping-authority",
    candidateName: "Build → Validation",
    resolvedValueStreamId: "build-validation",
    disposition: "kept-as-stream",
    observation:
      "The builder function was proposed as both producer and validator of the same increment.",
    judgment:
      "Builder and validator must be separable functions. Where the founder-operator currently occupies both, that is recorded as an independence exception, not resolved by pretending two functions exist.",
    consequence:
      "Independence exceptions are visible on the stream and must be disclosed on any claim resting on that validation.",
  },
  {
    findingId: "VSN-008",
    check: "unnecessary-object-copying",
    candidateName: "Contract → Implementation",
    resolvedValueStreamId: "contract-implementation",
    disposition: "kept-as-stream",
    observation: "The candidate copied commitment records into an implementation plan object.",
    judgment:
      "A commitment is canonical wherever it is created. Implementation references it; it does not hold a second copy that can drift.",
    consequence:
      "Handoffs transfer references and required states, never duplicates of governed objects.",
  },
  {
    findingId: "VSN-009",
    check: "missing-learning-loop",
    candidateName: "Adoption → Outcome",
    resolvedValueStreamId: "adoption-outcome",
    disposition: "kept-as-stream",
    observation:
      "The candidate ended at a measured outcome with no destination for what was learned.",
    judgment:
      "A stream that produces learning and discards it is not governed. Every stream must name where its learning goes.",
    consequence:
      "Adoption → Outcome closes into Outcome → Research, which is the only stream permitted to reopen direction.",
  },
  {
    findingId: "VSN-010",
    check: "future-shown-as-active",
    candidateName: "AI Capability Lifecycle",
    resolvedValueStreamId: "ai-capability-lifecycle",
    disposition: "deferred-gated-future",
    observation:
      "The candidate described an operating lifecycle for building and releasing AI capabilities.",
    judgment:
      "No AI feature exists, is authorized, or is being built. The stream is modeled only as target-state architecture so its gates are known before anything is attempted.",
    consequence:
      "The stream reports implementation status not implemented, is rendered behind a visible gate, and may not appear in any readiness or coverage summary as available work.",
  },
  {
    findingId: "VSN-011",
    check: "departmental-process",
    candidateName: "Hire → Develop → Retain",
    resolvedValueStreamId: "hire-develop-retain",
    disposition: "kept-as-stream",
    observation: "Staffing looked like a departmental process rather than a value stream.",
    judgment:
      "It is kept because it produces a durable enterprise outcome, sustained capacity to operate capabilities, and it feeds directly into which capabilities may advance a maturity stage. It carries no personal data in this boundary.",
    consequence:
      "All roles are candidate and unstaffed. No record in this stream may hold a real person, and no productivity measure of an individual is permitted.",
  },
  {
    findingId: "VSN-012",
    check: "subflow-not-stream",
    candidateName: "Governance artifact review",
    resolvedValueStreamId: "governance-artifact-lifecycle",
    disposition: "kept-as-stream",
    observation: "Artifact review was proposed as a subflow of Requirement → Decision.",
    judgment:
      "Promotion and supersession of a governing artifact changes what governs the enterprise. That is an outcome in its own right and needs its own refusal grounds.",
    consequence:
      "Governance Artifact Lifecycle is the only stream permitted to change an artifact's declared authority class.",
  },
];
