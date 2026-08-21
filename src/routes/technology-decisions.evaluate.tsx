import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/governance/page";
import {
  EvaluationPanel,
  PlanningScopeNotice,
  SubNav,
  SubNavLink,
} from "@/components/technology-decisions/parts";
import type { DecisionAnswers } from "@/domain/technology-decisions";
import { evaluate } from "@/domain/technology-decisions";
import { DECISION_PROCESS } from "@/lib/technology-decision-registry";

const INITIAL: Record<string, string> = Object.fromEntries(
  DECISION_PROCESS.questions.map((question) => [question.question_id, "unknown"]),
);

export const Route = createFileRoute("/technology-decisions/evaluate")({
  head: () => ({
    meta: [
      { title: "Evaluate a Workflow | SSLS" },
      {
        name: "description",
        content:
          "Answer the decision questions for one workflow and see the minimum effective solution, including the answer that nothing new should be built.",
      },
      { property: "og:title", content: "Evaluate a Workflow | SSLS" },
      {
        property: "og:description",
        content: "A deterministic evaluator that abstains rather than guessing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvaluatePage,
});

function EvaluatePage() {
  const [answers, setAnswers] = useState<Record<string, string>>(INITIAL);

  const evaluation = useMemo(
    () => evaluate(answers as unknown as DecisionAnswers),
    [answers],
  );

  return (
    <div>
      <PageHeader
        title="Evaluate a workflow"
        summary="Answer what you actually know. Every question accepts “Not yet known”, and unknowns that would change the outcome produce an abstention rather than a recommendation."
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions">Overview</SubNavLink>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section id="questions" title="Decision questions">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {DECISION_PROCESS.questions.map((question) => {
            const fieldId = `question-${question.question_id}`;
            const helpId = `${fieldId}-help`;
            return (
              <div key={question.question_id} className="rounded-md border border-border bg-surface p-3">
                <label htmlFor={fieldId} className="block text-sm font-semibold">
                  {question.prompt}
                </label>
                {question.help ? (
                  <p id={helpId} className="mt-1 text-xs text-muted-foreground">
                    {question.help}
                  </p>
                ) : null}
                <select
                  id={fieldId}
                  aria-describedby={question.help ? helpId : undefined}
                  className="mt-2 w-full rounded-sm border border-border-strong bg-background px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  value={answers[question.question_id]}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.question_id]: event.target.value,
                    }))
                  }
                >
                  {question.answers.map((answer) => (
                    <option key={answer} value={answer}>
                      {answer === "unknown" ? "Not yet known" : answer}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </form>
        <p className="mt-4">
          <button
            type="button"
            className="rounded-sm border border-border-strong px-3 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setAnswers(INITIAL)}
          >
            Reset all answers
          </button>
        </p>
      </Section>

      <Section
        id="result"
        title="Result"
        description="Recomputed on every change. The same answers always produce the same result."
      >
        <div aria-live="polite">
          <EvaluationPanel evaluation={evaluation} heading="Minimum effective solution" />
        </div>
      </Section>
    </div>
  );
}
