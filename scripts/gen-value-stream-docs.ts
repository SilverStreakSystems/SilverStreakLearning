import { mkdirSync, writeFileSync } from "node:fs";
import {
  VALUE_STREAMS,
  VALUE_STREAM_GATES,
  VALUE_STREAM_HANDOFFS,
  VALUE_STREAM_DEPENDENCIES,
  VALUE_STREAM_METRICS,
} from "../src/fixtures";
import { ENTERPRISE_FUNCTION_META } from "../src/domain";

const out = "/dev-server/docs/value-streams";
mkdirSync(out, { recursive: true });
const fn = (id: string) => (ENTERPRISE_FUNCTION_META as any)[id]?.name ?? id;
const list = (items: readonly string[]) =>
  items.length ? items.map((i) => `- ${i}`).join("\n") : "- None recorded.";

const index: string[] = [];

for (const s of VALUE_STREAMS) {
  const gates = VALUE_STREAM_GATES.filter((g) => g.valueStreamId === s.valueStreamId);
  const handoffs = VALUE_STREAM_HANDOFFS.filter((h) => h.sourceStageId.startsWith(s.valueStreamId));
  const deps = VALUE_STREAM_DEPENDENCIES.filter(
    (d: any) => d.dependentStreamId === s.valueStreamId || d.providerStreamId === s.valueStreamId,
  );
  const metrics = VALUE_STREAM_METRICS.filter((m: any) => m.valueStreamId === s.valueStreamId);
  const file = `${s.valueStreamId}.md`;
  index.push(`- [${s.name}](./${file}) — ${s.operatingStatus} / authority: ${s.currentAuthority}`);
  const body = `# ${s.name}

Stream id: \`${s.valueStreamId}\`
Authority: **${s.currentAuthority}** (declared, not derived from implementation)
Operating status: **${s.operatingStatus}**
Implementation status: **${s.implementationStatus}**
Maturity: current **${s.currentMaturity}**, target **${s.targetMaturity}**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

${s.purpose}

## North star contribution

${s.northStarContribution}

## Who this serves

Human beneficiaries:
${list(s.humanBeneficiaries)}

Enterprise beneficiaries:
${list(s.enterpriseBeneficiaries)}

## Trigger, entry, exit

Trigger: ${s.trigger}

Entry criteria:
${list(s.entryCriteria)}

Exit criteria:
${list(s.exitCriteria)}

## Authority separation

- Primary function: ${fn(s.primaryFunction)}
- Supporting functions: ${s.supportingFunctions.map(fn).join(", ") || "None"}
- Accountable role candidate: ${s.accountableRoleCandidate}
- Decision authorities: ${s.decisionAuthorities.map(fn).join(", ") || "None"}
- Validation authorities: ${s.validationAuthorities.map(fn).join(", ") || "None"}
- Stop authorities: ${s.stopAuthorities.map(fn).join(", ") || "None"}

## Stages

${s.stages
  .map(
    (st) => `### ${st.sequence}. ${st.name}

${st.purpose}

- Owner: ${fn(st.stageOwner)}
- Entry: ${st.entryCriteria.join("; ")}
- Exit: ${st.exitCriteria.join("; ")}
- Required deliverables: ${st.requiredDeliverables.join(", ") || "None"}
- Evidence: ${st.evidence.map((e) => e.proposition).join("; ") || "None"}
- Refusal states: ${st.refusalStates.join("; ")}
- Maximum waiting state: ${st.maximumWaitingState ?? "Not bounded"}
- Escalation: ${st.escalation}
- Audit: ${st.auditRequirement}`,
  )
  .join("\n\n")}

## Gates

${
  gates.length
    ? gates
        .map(
          (g) => `### ${g.name} (\`${g.gateId}\`)

${g.purpose}

- Owner: ${fn(g.owner)}
- Required evidence: ${g.requiredEvidence.join("; ") || "None"}
- Dispositions available: ${g.dispositionOptions.join(", ")}
- Stop conditions: ${g.stopConditions.join("; ")}
- Worked example disposition: ${g.exampleDisposition} — ${g.exampleRationale}`,
        )
        .join("\n\n")
    : "No gate is modelled on this stream. Every stage exit is still evidence-bound."
}

## Handoffs

${
  handoffs.length
    ? handoffs
        .map(
          (h) =>
            `- \`${h.handoffId}\`: ${fn(h.sourceOwner)} → ${fn(h.receivingOwner)}. Required state: ${h.requiredState} Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.`,
        )
        .join("\n")
    : "- No inter-stage handoff recorded."
}

## Dependencies

${
  deps.length
    ? deps
        .map((d: any) => `- \`${d.dependencyId}\`: ${d.description ?? d.kind} (${d.kind})`)
        .join("\n")
    : "- No cross-stream dependency recorded."
}

## Refusal and rollback

Refusal conditions:
${list(s.refusalConditions)}

Rollback and recovery: ${s.rollbackRecovery}

Escalations:
${list(s.escalations)}

## Measurement

Outcome measures:
${list(s.outcomeMeasures)}

Recorded metrics:
${metrics.length ? metrics.map((m: any) => `- ${m.name}: ${m.question}`).join("\n") : "- None recorded."}

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: \`${s.learningLoopDestination}\`.

## Risks, assumptions, unknowns

Risks:
${list(s.risks)}

Assumptions:
${list(s.assumptions)}

Unknowns:
${list(s.unknowns)}

Review trigger: ${s.reviewTrigger}
`;
  writeFileSync(`${out}/${file}`, body);
}

writeFileSync(
  `${out}/PRIORITY_VALUE_STREAMS.md`,
  `# Priority value streams (v0.1)

Eighteen priority value streams are modelled. Each is synthetic reference architecture with
declared authority. Nothing here claims an operating process.

${index.join("\n")}
`,
);
console.log("wrote", VALUE_STREAMS.length, "stream docs");
