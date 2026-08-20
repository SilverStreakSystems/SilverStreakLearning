import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader, Section } from "@/components/governance/page";
import { DataControls, StorageNotices } from "@/components/learning-loop/loop-views";
import { GRADE_BAND_LABEL, projectNextStep } from "@/domain/learning-loop";
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

/**
 * The learner list.
 *
 * There is deliberately no free-text way to add a learner here. The only way
 * records enter this preview is the fixed set of four visibly fictional sample
 * learners, or a file that was exported from this same preview. A blank name
 * field is an invitation to type a real child's name into a browser-local
 * prototype, and this build refuses to offer one.
 */
function LearnersIndex() {
  const store = useLearningLoop();

  const document = store.document;
  // One instant for the whole render, so every row is projected consistently.
  const asOf = new Date().toISOString();

  return (
    <div>
      <PageHeader
        title="Learners"
        summary="A working preview of one loop: notice something, plan a support, see what happened, decide what it showed, and get a next step. Every learner here is fictional and every record is saved in this browser only."
      />

      <p className="measure mt-4 rounded-md border border-border-strong bg-muted p-4 text-sm font-semibold">
        Fictional sample learners only. Do not type anything about a real person into this preview.
        There is no account, no server, and no shared storage behind it.
      </p>

      <StorageNotices store={store} />

      {store.status === "loading" ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Reading anything saved in this browser…
        </p>
      ) : null}

      {store.status !== "loading" && !document ? (
        <Section
          id="get-started"
          title={
            store.status === "empty" ? "Nothing is saved yet" : "The saved records cannot be read"
          }
          description={
            store.status === "empty"
              ? "Load the four fictional sample learners to see the loop working. That is the only way to start: this preview has no way to enter a real learner."
              : "The saved data has been left exactly as it is. Export it before replacing it with the sample records."
          }
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
                const projection = projectNextStep(document, learner.learnerId, asOf);
                const focusGoal = document.goals.find((goal) => goal.goalId === projection.goalId);
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
                        {projection.label}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>
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
