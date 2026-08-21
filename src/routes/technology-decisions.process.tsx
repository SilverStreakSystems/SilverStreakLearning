import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { DECISION_PROCESS } from "@/lib/technology-decision-registry";

export const Route = createFileRoute("/technology-decisions/process")({
  head: () => ({
    meta: [
      { title: "TDP-001 Decision Process | SSLS" },
      {
        name: "description",
        content:
          "The seven technology options, the order they are considered in, and the invariants that keep AI out of determinations about people.",
      },
      { property: "og:title", content: "TDP-001 Decision Process | SSLS" },
      {
        property: "og:description",
        content:
          "Ask whether anything needs to change before asking what to build, and reach AI only after every deterministic route is rejected on the merits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DecisionProcessPage,
});

function DecisionProcessPage() {
  return (
    <div>
      <PageHeader
        title={`${DECISION_PROCESS.process_id} — Technology Decision Process`}
        summary={`Version ${DECISION_PROCESS.version}. Seven options, considered in a fixed order, so the cheapest honest answer is reached before the most expensive one and AI is never chosen because it is available.`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions">Overview</SubNavLink>
          <SubNavLink to="/technology-decisions/evaluate">Evaluate a workflow</SubNavLink>
          <SubNavLink to="/technology-decisions/sources">Sources and provenance</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section
        id="options"
        title="The seven options"
        description="Option 7 is a successful outcome. Choosing nothing is a decision, not a gap."
      >
        <RegistryTable
          caption="The seven technology options with when each is the minimum effective solution."
          headers={["Option", "Use when", "Determinism", "Build burden", "Review burden"]}
        >
          {DECISION_PROCESS.options.map((option) => (
            <tr key={option.option_id}>
              <RowHeader>
                Option {option.ordinal} — {option.name}
              </RowHeader>
              <Cell>{option.use_when}</Cell>
              <Cell>{option.determinism}</Cell>
              <Cell>{option.implementation_burden}</Cell>
              <Cell>{option.human_review_burden}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="precedence"
        title="Order of consideration"
        description="The order is the control. A later option cannot be reached until every earlier one has been rejected on the merits."
      >
        <ol className="measure space-y-4">
          {DECISION_PROCESS.precedence.map((step) => (
            <li key={step.step_id} className="rounded-md border border-border bg-surface p-4">
              <h3 className="font-display text-base font-semibold">
                Step {step.step}: {step.decides}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.explanation}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="questions"
        title="What the process asks"
        description="Every question can be answered with uncertainty. Uncertainty that would change the outcome produces an abstention, not a guess."
      >
        <RegistryTable
          caption="Decision questions with their permitted answers."
          headers={["Question", "Why it is asked", "Answers"]}
        >
          {DECISION_PROCESS.questions.map((question) => (
            <tr key={question.question_id}>
              <RowHeader>{question.prompt}</RowHeader>
              <Cell>{question.help ?? "—"}</Cell>
              <Cell>{question.answers.join(", ")}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="invariants"
        title="Invariants"
        description="These are enforced in code, not asserted in prose. Each names the mechanism that enforces it."
      >
        <RegistryTable
          caption="Decision process invariants and how each is enforced."
          headers={["Invariant", "Statement", "Enforced by"]}
        >
          {DECISION_PROCESS.invariants.map((invariant) => (
            <tr key={invariant.invariant_id}>
              <RowHeader>{invariant.invariant_id}</RowHeader>
              <Cell>{invariant.statement}</Cell>
              <Cell>{invariant.enforced_by}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="override" title="Overriding a derived result">
        <p className="measure text-sm text-muted-foreground">
          {DECISION_PROCESS.override_requirements.statement} An override requires a written
          rationale and a named reviewer; without both it is refused.
        </p>
        <p className="measure mt-3 text-sm text-muted-foreground">
          {DECISION_PROCESS.abstention.statement}
        </p>
      </Section>
    </div>
  );
}
