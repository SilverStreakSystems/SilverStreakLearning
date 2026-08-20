import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, Section } from "@/components/governance/page";
import {
  ActionButton,
  Choice,
  Disclosure,
  Field,
  TextLine,
} from "@/components/learning-loop/controls";
import { DataControls, StorageNotices } from "@/components/learning-loop/loop-views";
import {
  GRADE_BANDS,
  GRADE_BAND_LABEL,
  recommendNextStep,
  type GradeBand,
} from "@/domain/learning-loop";
import { createLearner } from "@/lib/learning-loop/commands";
import { useLearningLoop } from "@/lib/learning-loop/use-learning-loop";

export const Route = createFileRoute("/learners/")({
  head: () => ({
    meta: [
      { title: "Learners | Learning Loop Synthetic Preview" },
      {
        name: "description",
        content:
          "A working synthetic preview of the SSLS learning loop: record what you saw, plan support, record the result, and see the next step.",
      },
      { property: "og:title", content: "Learners | Learning Loop Synthetic Preview" },
      {
        property: "og:description",
        content:
          "Fictional learners only. Records are saved in your browser, never sent anywhere, and carry no real personal data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnersIndex,
});

function LearnersIndex() {
  const store = useLearningLoop();
  const [addOpen, setAddOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [gradeBand, setGradeBand] = useState<GradeBand>("unspecified");
  const [labelError, setLabelError] = useState<string | null>(null);

  const document = store.document;
  const asOf = new Date().toISOString();

  return (
    <div>
      <PageHeader
        title="Learners"
        summary="A working preview of one loop: notice something, plan a support, see what happened, decide what it showed, and get a next step. Every learner here is fictional and every record is saved in this browser only."
      />

      <p className="measure mt-4 rounded-md border border-border-strong bg-muted p-4 text-sm font-semibold">
        Fictional learners only. Do not type anything about a real person into this preview. There
        is no account, no server, and no shared storage behind it.
      </p>

      <StorageNotices store={store} />

      {store.state === "loading" ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Reading anything saved in this browser…
        </p>
      ) : null}

      {store.state !== "loading" && !document ? (
        <Section
          id="get-started"
          title="Nothing is saved yet"
          description="Load the four sample learners to see the loop working, or add a fictional learner of your own."
        >
          <DataControls store={store} />
        </Section>
      ) : null}

      {document ? (
        <>
          <Section
            id="learner-list"
            title={`${document.learners.length} learner${document.learners.length === 1 ? "" : "s"}`}
            description="Each row shows the goal being worked on now and the step the rule suggests next."
          >
            <ul className="grid gap-3 md:grid-cols-2">
              {document.learners.map((learner) => {
                const recommendation = recommendNextStep(document, learner.learnerId, asOf);
                const focusGoal = document.goals.find(
                  (goal) => goal.goalId === recommendation.focusGoalId,
                );
                return (
                  <li key={learner.learnerId}>
                    <article className="flex h-full flex-col rounded-md border border-border bg-surface p-4">
                      <h3 className="font-display text-lg font-semibold">
                        <Link
                          to="/learners/$learnerId"
                          params={{ learnerId: learner.learnerId }}
                          className="flex min-h-11 items-center rounded-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {learner.displayLabel}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {GRADE_BAND_LABEL[learner.gradeBand]} — {learner.learnerId}
                        {learner.state === "archived" ? " — archived" : ""}
                      </p>
                      <p className="measure mt-3 text-sm">
                        <span className="font-semibold">Working on: </span>
                        {focusGoal ? focusGoal.title : "No goal chosen yet"}
                      </p>
                      <p className="measure mt-2 text-sm">
                        <span className="font-semibold">Next step: </span>
                        {recommendation.title}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>

            <Disclosure
              summary="Add a fictional learner"
              open={addOpen}
              onToggle={() => setAddOpen((open) => !open)}
            >
              <Field
                label="Label for this fictional learner"
                hint="Use something obviously made up, such as Sample Learner E."
                required
                error={labelError}
              >
                {({ id, describedBy, invalid }) => (
                  <TextLine
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                  />
                )}
              </Field>
              <Field label="Rough age group">
                {({ id }) => (
                  <Choice
                    id={id}
                    value={gradeBand}
                    onChange={(event) => setGradeBand(event.target.value as GradeBand)}
                  >
                    {GRADE_BANDS.map((band) => (
                      <option key={band} value={band}>
                        {GRADE_BAND_LABEL[band]}
                      </option>
                    ))}
                  </Choice>
                )}
              </Field>
              <div className="mt-5">
                <ActionButton
                  onClick={() => {
                    if (label.trim().length === 0) {
                      setLabelError("Enter a label so this learner can be told apart.");
                      return;
                    }
                    setLabelError(null);
                    store.apply(
                      (current, now) =>
                        createLearner(current, { displayLabel: label.trim(), gradeBand }, now)
                          .document,
                    );
                    setLabel("");
                    setAddOpen(false);
                  }}
                >
                  Add this learner
                </ActionButton>
              </div>
            </Disclosure>
          </Section>

          <Section
            id="data-controls"
            title="Your saved records"
            description="Saved in this browser only. Export a file to keep them, or import one to replace what is here."
          >
            <DataControls store={store} />
          </Section>
        </>
      ) : null}
    </div>
  );
}
