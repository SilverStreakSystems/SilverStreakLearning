import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { PageHeader, Section } from "@/components/governance/page";
import {
  ActionButton,
  CheckLine,
  Choice,
  Disclosure,
  ErrorSummary,
  Field,
  LiveNotice,
  TextBlock,
  TextLine,
  type FormError,
} from "@/components/learning-loop/controls";
import { NextStepCard, StorageNotices, TimelineList } from "@/components/learning-loop/loop-views";
import {
  GOAL_STATUS_LABEL,
  GRADE_BAND_LABEL,
  OBSERVATION_SOURCE_KINDS,
  OBSERVATION_SOURCE_LABEL,
  REVIEW_RESULTS,
  REVIEW_RESULT_LABEL,
  SUPPORT_STATUS_LABEL,
  effectiveObservations,
  projectNextStep,
  readLoopSnapshot,
  type LearningLoopDocument,
  type NextStepCode,
  type ObservationSourceKind,
  type ReviewResult,
} from "@/domain/learning-loop";
import {
  cancelSupport,
  completeSupport,
  createGoal,
  planSupport,
  recordGoalReview,
  recordObservation,
  setFocusGoal,
  setGoalStatus,
} from "@/lib/learning-loop/commands";
import { formatMoment } from "@/lib/learning-loop/format";
import {
  useLearningLoop,
  type CommandRunner,
  type LearningLoopStore,
  type RunOutcome,
  type StoreProblem,
} from "@/lib/learning-loop/use-learning-loop";

export const Route = createFileRoute("/learners/$learnerId")({
  head: () => ({
    meta: [
      { title: "Learner detail | Learning Loop Synthetic Preview" },
      {
        name: "description",
        content:
          "One fictional learner: the goal being worked on, what was observed, what was tried, what it showed, and the suggested next step.",
      },
      { property: "og:title", content: "Learner detail | Learning Loop Synthetic Preview" },
      {
        property: "og:description",
        content:
          "Synthetic records held in your browser. No real personal data, no account, no server.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnerDetail,
});

type FormKey = "goal" | "observation" | "support" | "complete" | "review" | null;

/**
 * Which form the page opens on its own, given the projected next step.
 *
 * This only chooses what is already open. It never submits anything, and the
 * person can open any other form at any time.
 */
const FORM_FOR_STEP: Record<NextStepCode, FormKey> = {
  REVIEW_DATA_INTEGRITY: null,
  SELECT_OR_CREATE_FOCUS_GOAL: "goal",
  RECORD_BASELINE_OBSERVATION: "observation",
  PLAN_SUPPORT: "support",
  COMPLETE_OR_CANCEL_SUPPORT: "complete",
  RECORD_FOLLOW_UP_OBSERVATION: "observation",
  REVIEW_OBSERVATIONS: "review",
  COLLECT_MORE_EVIDENCE: "observation",
  COLLECT_COMPARABLE_EVIDENCE: "observation",
  ADJUST_SUPPORT: "support",
  CONTINUE_SUPPORT_AND_OBSERVE: "observation",
  HUMAN_REVIEW_GOAL_COMPLETION: null,
  REVIEW_LOOP_MANUALLY: null,
};

function toIso(localValue: string, fallback: string): string {
  if (!localValue) return fallback;
  const parsed = new Date(localValue);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

/**
 * A submit handler reports back the problem to show, or null when accepted.
 *
 * `scope` separates "what you typed is wrong" from "the save itself failed".
 * A storage failure or a revision conflict is not a field error: it must not
 * mark a valid control invalid, and there is nothing useful to link to.
 */
export type SubmitReport = { message: string; scope: "form" | "field" } | null;

function reportFrom(problem: StoreProblem | null, fallback: string): SubmitReport {
  const scope =
    problem && (problem.kind === "conflict" || problem.kind === "storage") ? "form" : "field";
  return { message: problem?.message ?? fallback, scope };
}

/** Turns a report into the error list for a form, keyed to a field or not. */
function errorsFor(report: NonNullable<SubmitReport>, controlId: string): FormError[] {
  return [{ controlId: report.scope === "form" ? null : controlId, message: report.message }];
}

function useFormErrors() {
  const ref = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormError[]>([]);
  function show(next: FormError[]) {
    setErrors(next);
    if (next.length > 0) window.setTimeout(() => ref.current?.focus(), 0);
  }
  function errorFor(controlId: string) {
    return errors.find((row) => row.controlId === controlId)?.message ?? null;
  }
  /** A submit handler that shows the report and keeps the typed values. */
  function report(next: SubmitReport, controlId: string): boolean {
    if (!next) {
      setErrors([]);
      return true;
    }
    show(errorsFor(next, controlId));
    return false;
  }
  return { ref, errors, show, report, clear: () => setErrors([]), errorFor };
}

function MissingLearner({ learnerId }: { learnerId: string }) {
  return (
    <div>
      <PageHeader
        title="This learner is not recorded"
        summary={`Nothing saved in this browser matches ${learnerId}. It may have been cleared, or the link may be from a different browser.`}
      />
      <p className="mt-6">
        <Link
          to="/learners"
          className="inline-flex min-h-11 items-center rounded-sm px-1 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to all learners
        </Link>
      </p>
    </div>
  );
}

/**
 * Unreadable data is not a missing learner.
 *
 * Saying "not recorded" when the stored bytes are corrupt, from a newer
 * version, or unreachable would invite someone to re-enter records that are
 * still on disk. This says what happened and points at recovery instead.
 */
function UnreadableLearner({ store, learnerId }: { store: LearningLoopStore; learnerId: string }) {
  if (store.status === "empty") return <MissingLearner learnerId={learnerId} />;

  return (
    <div>
      <PageHeader
        title="These records could not be read"
        summary="The data saved in this browser could not be opened, so nothing about this learner can be shown. Nothing has been changed or deleted."
      />
      <StorageNotices store={store} />
      <p className="measure mt-6 text-sm">
        Take a copy of the saved data first, then use the recovery controls on the learners page to
        replace it. Replacing keeps one copy of what was there before.
      </p>
      <p className="mt-4">
        <Link
          to="/learners"
          className="inline-flex min-h-11 items-center rounded-sm px-1 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Go to the recovery controls
        </Link>
      </p>
    </div>
  );
}

/** What a pinned form is working on, kept independent of the projection. */
type PinnedTarget = { key: "complete" | "review"; supportActionId: string; title: string };

function LearnerDetail() {
  const { learnerId } = Route.useParams();
  const store = useLearningLoop();
  const [openForm, setOpenForm] = useState<FormKey | "none">("none");
  const [notice, setNotice] = useState<string | null>(null);
  // A form kept mounted and open after a refused write, so the draft in it is
  // not thrown away when the projection stops offering that step.
  const [pinned, setPinned] = useState<PinnedTarget | null>(null);
  // Bumped after every successful write, so focus lands on the announced next
  // step once the new page state has actually rendered.
  const [focusTick, setFocusTick] = useState(0);

  useEffect(() => {
    if (focusTick === 0) return;
    window.document.getElementById("next-step-heading")?.focus();
  }, [focusTick]);

  const document = store.document;

  if (store.status === "loading")
    return (
      <div>
        <PageHeader title="Learner" summary="Reading anything saved in this browser…" />
      </div>
    );

  if (!document)
    return (
      <div>
        <UnreadableLearner store={store} learnerId={learnerId} />
      </div>
    );
  const learner = document.learners.find((row) => row.learnerId === learnerId);
  if (!learner) return <MissingLearner learnerId={learnerId} />;

  // One instant for the whole render, so the projection and every form agree.
  const asOf = new Date().toISOString();
  const projection = projectNextStep(document, learnerId, asOf);
  const snapshot = readLoopSnapshot(document, learnerId, asOf);
  const activeForm = openForm === "none" ? FORM_FOR_STEP[projection.code] : openForm;
  const toggle = (key: Exclude<FormKey, null>) => setOpenForm(activeForm === key ? null : key);

  /**
   * Every write action starts here.
   *
   * A message left over from a previous action must never be readable as the
   * outcome of the one just taken, so the success notice and the store-level
   * problem are both cleared before anything is attempted.
   */
  function beginAttempt() {
    setNotice(null);
    store.dismissProblem();
  }

  function attempt<T>(command: CommandRunner<T>): RunOutcome<T> {
    beginAttempt();
    return store.run(command);
  }

  /**
   * One place where a successful write ends.
   *
   * Stale messages are cleared, guidance goes back to automatic so the page
   * offers the newly projected step, and the next step is announced next to
   * the control that was just used. Focus is then moved to that announced
   * heading once the new state has rendered.
   */
  function afterSave(message: string, next: LearningLoopDocument) {
    store.dismissProblem();
    setOpenForm("none");
    setPinned(null);
    const projected = projectNextStep(next, learnerId, new Date().toISOString());
    setNotice(`${message} Next: ${projected.label}`);
    setFocusTick((tick) => tick + 1);
  }

  /**
   * A write that did not happen must not move the person away from their work:
   * the attempted form is pinned open, and kept mounted even if the projection
   * would no longer offer it, so the draft they typed stays on screen until
   * they retry or leave it themselves.
   */
  function pinnedFailure(
    key: Exclude<FormKey, null>,
    report: SubmitReport,
    target?: { supportActionId: string; title: string },
  ) {
    setOpenForm(key);
    if (target && (key === "complete" || key === "review")) setPinned({ key, ...target });
    return report;
  }

  const plannedSupport =
    snapshot.latestActionableSupport?.state === "planned"
      ? snapshot.latestActionableSupport.record
      : null;
  const completedSupports = snapshot.supports.filter((row) => row.state === "completed");
  const latestCompletedSupport = completedSupports.at(-1)?.record ?? null;
  const focusGoal = snapshot.focusGoal;

  // A pinned form outlives the projection that offered it. Nothing else about
  // the page changes: the same command runs against the same support.
  const completeTarget: { supportActionId: string; title: string } | null =
    plannedSupport ?? (pinned?.key === "complete" ? pinned : null);
  const reviewTarget: { supportActionId: string; title: string } | null =
    latestCompletedSupport ?? (pinned?.key === "review" ? pinned : null);

  return (
    <div>
      <PageHeader
        title={learner.displayLabel}
        summary={`${GRADE_BAND_LABEL[learner.gradeBand]} — ${learner.learnerId}. A fictional learner. Everything below is saved in this browser only.`}
      >
        <Link
          to="/learners"
          className="inline-flex min-h-11 items-center rounded-sm px-1 text-sm font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to all learners
        </Link>
      </PageHeader>

      <StorageNotices store={store} />
      <LiveNotice message={notice} tone="ok" />
      {notice ? (
        <p className="mt-2 text-sm">
          <a
            href="#next-step-heading"
            className="inline-flex min-h-11 items-center rounded-sm px-1 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={(event) => {
              event.preventDefault();
              const target = window.document.getElementById("next-step-heading");
              target?.focus();
              target?.scrollIntoView({ block: "center" });
            }}
          >
            Go to the suggested next step
          </a>
        </p>
      ) : null}

      <div className="mt-6">
        <NextStepCard projection={projection}>
          {projection.code === "HUMAN_REVIEW_GOAL_COMPLETION" && focusGoal ? (
            <div>
              <p className="measure mb-3 text-sm">
                The rule cannot close a goal. If you judge the success criterion met, record that
                decision yourself.
              </p>
              <ActionButton
                onClick={() => {
                  const outcome = attempt((current, context) =>
                    setGoalStatus(current, focusGoal.goalId, "achieved", context),
                  );
                  if (outcome.ok && outcome.value)
                    afterSave("The goal was recorded as met.", outcome.value.document);
                }}
              >
                I judge this goal met — record it
              </ActionButton>
            </div>
          ) : null}
        </NextStepCard>
      </div>

      <Section
        id="focus-goal"
        title="The goal being worked on"
        description="One goal at a time. Everything recorded below is attached to it."
      >
        {focusGoal ? (
          <article className="rounded-md border border-border bg-surface p-4 sm:p-5">
            <h3 className="font-display text-lg font-semibold">{focusGoal.title}</h3>
            <p className="measure mt-2 text-sm">
              <span className="font-semibold">Success looks like: </span>
              {focusGoal.successCriterion}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {GOAL_STATUS_LABEL[focusGoal.status]} — {focusGoal.goalId}
              {focusGoal.targetReviewDate
                ? ` — review by ${formatMoment(focusGoal.targetReviewDate)} UTC`
                : ""}
            </p>
            {focusGoal.status === "active" ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton
                  tone="secondary"
                  onClick={() => {
                    const outcome = attempt((current, context) =>
                      setGoalStatus(current, focusGoal.goalId, "paused", context),
                    );
                    if (outcome.ok && outcome.value)
                      afterSave("The goal was paused.", outcome.value.document);
                  }}
                >
                  Pause this goal
                </ActionButton>
              </div>
            ) : null}
          </article>
        ) : (
          <p className="text-sm text-muted-foreground">No goal is being worked on right now.</p>
        )}

        {snapshot.goals.filter((goal) => !goal.isFocusGoal).length > 0 ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Other goals for this learner</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {snapshot.goals
                .filter((goal) => !goal.isFocusGoal)
                .map((goal) => (
                  <li
                    key={goal.goalId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-3"
                  >
                    <span className="text-sm">
                      {goal.title}{" "}
                      <span className="text-muted-foreground">
                        ({GOAL_STATUS_LABEL[goal.status]})
                      </span>
                    </span>
                    <ActionButton
                      tone="secondary"
                      onClick={() => {
                        // Reactivating and focusing is one change, so it is one write.
                        const outcome = attempt((current, context) => {
                          if (goal.status === "active")
                            return setFocusGoal(current, learnerId, goal.goalId, context);
                          const activated = setGoalStatus(current, goal.goalId, "active", context);
                          if (!activated.ok) return activated;
                          return setFocusGoal(activated.document, learnerId, goal.goalId, context);
                        });
                        if (outcome.ok && outcome.value)
                          afterSave(
                            "That goal is now the one being worked on.",
                            outcome.value.document,
                          );
                      }}
                    >
                      Work on this one
                    </ActionButton>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        <GoalForm
          open={activeForm === "goal"}
          onToggle={() => toggle("goal")}
          onSubmit={(input) => {
            const outcome = attempt((current, context) =>
              createGoal(current, { learnerId, ...input }, context),
            );
            if (!outcome.ok || !outcome.value)
              return pinnedFailure("goal", reportFrom(outcome.problem, "The goal was not saved."));
            afterSave("The goal was saved.", outcome.value.document);
            return null;
          }}
        />
      </Section>

      <Section
        id="record"
        title="Record what happened"
        description="Observations and results are added, never edited over. A correction is a new record that replaces the old one, and both stay visible."
      >
        <ObservationForm
          open={activeForm === "observation"}
          onToggle={() => toggle("observation")}
          document={document}
          learnerId={learnerId}
          goalId={focusGoal?.goalId ?? null}
          suggestedSupportActionId={
            projection.code === "RECORD_FOLLOW_UP_OBSERVATION" ? projection.supportActionId : null
          }
          onSubmit={(input) => {
            if (!focusGoal)
              return pinnedFailure("observation", {
                message: "Choose a goal before recording an observation.",
                scope: "field",
              });
            const outcome = attempt((current, context) =>
              recordObservation(
                current,
                { learnerId, goalId: focusGoal.goalId, ...input },
                context,
              ),
            );
            if (!outcome.ok || !outcome.value)
              return pinnedFailure(
                "observation",
                reportFrom(outcome.problem, "The observation was not saved."),
              );
            afterSave("The observation was saved.", outcome.value.document);
            return null;
          }}
        />

        <SupportForm
          open={activeForm === "support"}
          onToggle={() => toggle("support")}
          observations={
            focusGoal
              ? effectiveObservations(document).filter((row) => row.goalId === focusGoal.goalId)
              : []
          }
          onSubmit={(input) => {
            if (!focusGoal)
              return pinnedFailure("support", {
                message: "Choose a goal before planning a support.",
                scope: "field",
              });
            const outcome = attempt((current, context) =>
              planSupport(current, { learnerId, goalId: focusGoal.goalId, ...input }, context),
            );
            if (!outcome.ok || !outcome.value)
              return pinnedFailure(
                "support",
                reportFrom(outcome.problem, "The plan was not saved."),
              );
            afterSave("The plan was saved.", outcome.value.document);
            return null;
          }}
        />

        {completeTarget ? (
          <CompleteSupportForm
            // One mount per support: the draft in it survives every re-render
            // and every projection change until that support is finished with.
            key={`complete-${completeTarget.supportActionId}`}
            open={activeForm === "complete"}
            onToggle={() => toggle("complete")}
            title={completeTarget.title}
            onComplete={(completedAt, note) => {
              const outcome = attempt((current, context) =>
                completeSupport(
                  current,
                  completeTarget.supportActionId,
                  completedAt,
                  note,
                  context,
                ),
              );
              if (!outcome.ok || !outcome.value)
                return pinnedFailure(
                  "complete",
                  reportFrom(outcome.problem, "Nothing was saved."),
                  completeTarget,
                );
              afterSave("The support was marked done.", outcome.value.document);
              return null;
            }}
            onCancel={(reason) => {
              const outcome = attempt((current, context) =>
                cancelSupport(current, completeTarget.supportActionId, reason, context),
              );
              if (!outcome.ok || !outcome.value)
                return pinnedFailure(
                  "complete",
                  reportFrom(outcome.problem, "Nothing was saved."),
                  completeTarget,
                );
              afterSave("The support was cancelled.", outcome.value.document);
              return null;
            }}
          />
        ) : null}

        {reviewTarget ? (
          <ReviewForm
            key={`review-${reviewTarget.supportActionId}`}
            open={activeForm === "review"}
            onToggle={() => toggle("review")}
            supportTitle={reviewTarget.title}
            observations={snapshot.observations.filter(
              (row) => row.supportActionId === reviewTarget.supportActionId,
            )}
            reviews={snapshot.reviews.filter(
              (row) => row.supportActionId === reviewTarget.supportActionId,
            )}
            onSubmit={(input) => {
              if (!focusGoal)
                return pinnedFailure(
                  "review",
                  {
                    message: "Choose a goal before recording a result.",
                    scope: "field",
                  },
                  reviewTarget,
                );
              const outcome = attempt((current, context) =>
                recordGoalReview(
                  current,
                  {
                    learnerId,
                    goalId: focusGoal.goalId,
                    supportActionId: reviewTarget.supportActionId,
                    ...input,
                  },
                  context,
                ),
              );
              if (!outcome.ok || !outcome.value)
                return pinnedFailure(
                  "review",
                  reportFrom(outcome.problem, "The result was not saved."),
                  reviewTarget,
                );
              afterSave(
                input.supersedesGoalReviewId
                  ? "The correction was saved. The earlier result is kept and marked replaced."
                  : "The result was saved.",
                outcome.value.document,
              );
              return null;
            }}
          />
        ) : null}
      </Section>

      <Section
        id="chain"
        title="What was tried, and what it showed"
        description="Each support names the observations it was based on. Each result names the observations it was judged from. Nothing here is inferred."
      >
        {snapshot.supports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No support has been planned yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {snapshot.supports.map(({ record: support }) => {
              const reviews = snapshot.reviews.filter(
                (row) => row.supportActionId === support.supportActionId,
              );
              return (
                <li
                  key={support.supportActionId}
                  className="rounded-md border border-border bg-surface p-4"
                >
                  <h3 className="font-display text-base font-semibold">{support.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {SUPPORT_STATUS_LABEL[support.status]} — {support.supportActionId} — based on{" "}
                    {support.basedOnObservationIds.join(", ")}
                  </p>
                  <p className="measure mt-2 text-sm">{support.rationale}</p>
                  <p className="measure mt-1 text-sm">
                    <span className="font-semibold">Expected to see: </span>
                    {support.intendedEvidence}
                  </p>
                  {reviews.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No result has been recorded for this yet.
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <p key={review.goalReviewId} className="measure mt-2 text-sm">
                        <span className="font-semibold">
                          {REVIEW_RESULT_LABEL[review.result]}:{" "}
                        </span>
                        {review.rationale}{" "}
                        <span className="text-xs text-muted-foreground">
                          (from {review.observationIds.join(", ")})
                        </span>
                      </p>
                    ))
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section
        id="timeline"
        title="Everything, in order"
        description="The full history for this learner, oldest first. Corrections are shown alongside what they replaced."
      >
        <TimelineList document={document} learnerId={learnerId} />
      </Section>
    </div>
  );
}

function GoalForm({
  open,
  onToggle,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  onSubmit: (input: {
    title: string;
    successCriterion: string;
    targetReviewDate: string | null;
    makeFocus: boolean;
  }) => SubmitReport;
}) {
  const [title, setTitle] = useState("");
  const [criterion, setCriterion] = useState("");
  const [target, setTarget] = useState("");
  const [makeFocus, setMakeFocus] = useState(true);
  const form = useFormErrors();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: FormError[] = [];
    if (title.trim().length === 0)
      found.push({ controlId: "goal-title", message: "Write what the goal is." });
    if (criterion.trim().length === 0)
      found.push({
        controlId: "goal-criterion",
        message: "Write how you will know the goal has been met.",
      });
    if (found.length > 0) {
      form.show(found);
      return;
    }
    // Values are kept on any failure, so nothing typed has to be typed twice.
    if (
      !form.report(
        onSubmit({
          title: title.trim(),
          successCriterion: criterion.trim(),
          targetReviewDate: target ? new Date(`${target}T00:00:00Z`).toISOString() : null,
          makeFocus,
        }),
        "goal-title",
      )
    )
      return;
    setTitle("");
    setCriterion("");
    setTarget("");
  }

  return (
    <Disclosure summary="Add a goal" open={open} onToggle={onToggle}>
      <form onSubmit={handleSubmit} noValidate>
        <ErrorSummary errors={form.errors} headingId="goal-form-errors" summaryRef={form.ref} />
        <Field
          label="What is the goal?"
          required
          controlId="goal-title"
          error={form.errorFor("goal-title")}
        >
          {({ id, describedBy, invalid }) => (
            <TextLine
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          )}
        </Field>
        <Field
          label="How will you know it has been met?"
          hint="Write it so someone else could check it: how often, how much, and in what situation."
          required
          controlId="goal-criterion"
          error={form.errorFor("goal-criterion")}
        >
          {({ id, describedBy, invalid }) => (
            <TextBlock
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={criterion}
              onChange={(event) => setCriterion(event.target.value)}
            />
          )}
        </Field>
        <Field label="Check back by (optional)" controlId="goal-target">
          {({ id }) => (
            <TextLine
              id={id}
              type="date"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
          )}
        </Field>
        <CheckLine
          label="Work on this goal now"
          checked={makeFocus}
          onChange={(event) => setMakeFocus(event.target.checked)}
        />
        <div className="mt-5">
          <ActionButton type="submit">Save this goal</ActionButton>
        </div>
      </form>
    </Disclosure>
  );
}

function ObservationForm({
  open,
  onToggle,
  document,
  learnerId,
  goalId,
  suggestedSupportActionId,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  document: LearningLoopDocument;
  learnerId: string;
  goalId: string | null;
  suggestedSupportActionId: string | null;
  onSubmit: (input: {
    supportActionId: string | null;
    observedAt: string;
    sourceKind: ObservationSourceKind;
    observationText: string;
    supersedesObservationId: string | null;
  }) => SubmitReport;
}) {
  const [when, setWhen] = useState("");
  const [source, setSource] = useState<ObservationSourceKind>("direct-observation");
  const [text, setText] = useState("");
  const [supersedes, setSupersedes] = useState("");
  // Controlled, and seeded from the projection rather than left to a default
  // that the form would then ignore on submit.
  const [followUp, setFollowUp] = useState<string | null>(null);
  const form = useFormErrors();

  const existing = goalId
    ? effectiveObservations(document).filter(
        (row) => row.goalId === goalId && row.learnerId === learnerId,
      )
    : [];
  const supports = goalId
    ? document.supportActions.filter((row) => row.goalId === goalId && row.status === "completed")
    : [];
  const selectedFollowUp = followUp ?? suggestedSupportActionId ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: FormError[] = [];
    if (text.trim().length === 0)
      found.push({
        controlId: "observation-text",
        message: "Write down what you saw before saving.",
      });
    if (when && Number.isNaN(new Date(when).getTime()))
      found.push({
        controlId: "observation-when",
        message: "That date and time cannot be read. Leave it blank to use right now.",
      });
    if (found.length > 0) {
      form.show(found);
      return;
    }
    if (
      !form.report(
        onSubmit({
          supportActionId: selectedFollowUp || null,
          observedAt: toIso(when, new Date().toISOString()),
          sourceKind: source,
          observationText: text.trim(),
          supersedesObservationId: supersedes || null,
        }),
        "observation-text",
      )
    )
      return;
    setText("");
    setWhen("");
    setSupersedes("");
    setFollowUp(null);
  }

  if (!goalId)
    return (
      <Disclosure summary="Record an observation" open={open} onToggle={onToggle}>
        <p className="mt-3 text-sm text-muted-foreground">
          Choose a goal first. Observations are always recorded against a goal.
        </p>
      </Disclosure>
    );

  return (
    <Disclosure summary="Record an observation" open={open} onToggle={onToggle}>
      <form onSubmit={handleSubmit} noValidate>
        <ErrorSummary
          errors={form.errors}
          headingId="observation-form-errors"
          summaryRef={form.ref}
        />
        <Field
          label="What did you see?"
          required
          controlId="observation-text"
          error={form.errorFor("observation-text")}
        >
          {({ id, describedBy, invalid }) => (
            <TextBlock
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          )}
        </Field>
        <Field label="Where did this come from?" controlId="observation-source">
          {({ id }) => (
            <Choice
              id={id}
              value={source}
              onChange={(event) => setSource(event.target.value as ObservationSourceKind)}
            >
              {OBSERVATION_SOURCE_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {OBSERVATION_SOURCE_LABEL[kind]}
                </option>
              ))}
            </Choice>
          )}
        </Field>
        <Field
          label="When did you see it?"
          hint="Leave blank to use right now."
          controlId="observation-when"
          error={form.errorFor("observation-when")}
        >
          {({ id, describedBy, invalid }) => (
            <TextLine
              id={id}
              type="datetime-local"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={when}
              onChange={(event) => setWhen(event.target.value)}
            />
          )}
        </Field>
        {supports.length > 0 ? (
          <Field
            label="Is this a follow-up to something you tried?"
            controlId="observation-followup"
            error={form.errorFor("observation-followup")}
          >
            {({ id, describedBy, invalid }) => (
              <Choice
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={selectedFollowUp}
                onChange={(event) => setFollowUp(event.target.value)}
              >
                <option value="">No, it stands on its own</option>
                {supports.map((support) => (
                  <option key={support.supportActionId} value={support.supportActionId}>
                    {support.title}
                  </option>
                ))}
              </Choice>
            )}
          </Field>
        ) : null}
        {existing.length > 0 ? (
          <Field
            label="Does this correct an earlier observation?"
            hint="The earlier record stays in the history and is marked as replaced."
            controlId="observation-supersedes"
          >
            {({ id, describedBy }) => (
              <Choice
                id={id}
                aria-describedby={describedBy}
                value={supersedes}
                onChange={(event) => setSupersedes(event.target.value)}
              >
                <option value="">No, this is new</option>
                {existing.map((row) => (
                  <option key={row.observationId} value={row.observationId}>
                    {formatMoment(row.observedAt)} — {row.observationText.slice(0, 60)}
                  </option>
                ))}
              </Choice>
            )}
          </Field>
        ) : null}
        <div className="mt-5">
          <ActionButton type="submit">Save this observation</ActionButton>
        </div>
      </form>
    </Disclosure>
  );
}

/**
 * A checkbox group with an error that an error summary can link to.
 *
 * The link target has to be something focus can land on, so the first checkbox
 * carries the group's control id, and the group is described by the message.
 */
function CheckGroup({
  legend,
  controlId,
  error,
  required,
  children,
}: {
  legend: string;
  controlId: string;
  error: string | null;
  required?: boolean;
  children: ReactNode;
}) {
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <fieldset className="mt-4" aria-describedby={errorId} aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-semibold">
        {legend}
        {required ? (
          <span className="ml-1 font-normal text-muted-foreground">(required)</span>
        ) : null}
      </legend>
      {error ? (
        <p id={errorId} className="mt-1 text-sm font-semibold">
          Problem: {error}
        </p>
      ) : null}
      {children}
    </fieldset>
  );
}

function SupportForm({
  open,
  onToggle,
  observations,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  observations: LearningLoopDocument["observations"];
  onSubmit: (input: {
    basedOnObservationIds: string[];
    title: string;
    rationale: string;
    intendedEvidence: string;
    plannedAt: string;
  }) => SubmitReport;
}) {
  const [selected, setSelected] = useState<string[] | null>(null);
  const [title, setTitle] = useState("");
  const [rationale, setRationale] = useState("");
  const [intended, setIntended] = useState("");
  const form = useFormErrors();

  // Default to the most recent observation, but once the person touches the
  // list their selection is the only thing that counts, including an empty one.
  const chosen = selected ?? observations.slice(-1).map((row) => row.observationId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: FormError[] = [];
    if (chosen.length === 0)
      found.push({
        controlId: "support-basis",
        message: "Pick at least one observation this support is based on.",
      });
    if (title.trim().length === 0)
      found.push({ controlId: "support-title", message: "Write what you will do." });
    if (rationale.trim().length === 0)
      found.push({
        controlId: "support-rationale",
        message: "Write why you are doing this, given what you saw.",
      });
    if (intended.trim().length === 0)
      found.push({
        controlId: "support-intended",
        message: "Write what would tell you it is working.",
      });
    if (found.length > 0) {
      form.show(found);
      return;
    }
    if (
      !form.report(
        onSubmit({
          basedOnObservationIds: chosen,
          title: title.trim(),
          rationale: rationale.trim(),
          intendedEvidence: intended.trim(),
          plannedAt: new Date().toISOString(),
        }),
        "support-title",
      )
    )
      return;
    setTitle("");
    setRationale("");
    setIntended("");
    setSelected(null);
  }

  return (
    <Disclosure summary="Plan a support" open={open} onToggle={onToggle}>
      {observations.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Record an observation first. A support has to be based on something you saw.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <ErrorSummary
            errors={form.errors}
            headingId="support-form-errors"
            summaryRef={form.ref}
          />
          <CheckGroup
            legend="Which observations is this based on?"
            controlId="support-basis"
            error={form.errorFor("support-basis")}
            required
          >
            {observations.map((row, index) => (
              <CheckLine
                key={row.observationId}
                id={index === 0 ? "support-basis" : undefined}
                label={`${formatMoment(row.observedAt)} — ${row.observationText.slice(0, 80)}`}
                checked={chosen.includes(row.observationId)}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? [...new Set([...chosen, row.observationId])]
                      : chosen.filter((id) => id !== row.observationId),
                  )
                }
              />
            ))}
          </CheckGroup>
          <Field
            label="What will you do?"
            required
            controlId="support-title"
            error={form.errorFor("support-title")}
          >
            {({ id, describedBy, invalid }) => (
              <TextLine
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            )}
          </Field>
          <Field
            label="Why this, given what you saw?"
            required
            controlId="support-rationale"
            error={form.errorFor("support-rationale")}
          >
            {({ id, describedBy, invalid }) => (
              <TextBlock
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
              />
            )}
          </Field>
          <Field
            label="What would tell you it is working?"
            required
            controlId="support-intended"
            error={form.errorFor("support-intended")}
          >
            {({ id, describedBy, invalid }) => (
              <TextBlock
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={intended}
                onChange={(event) => setIntended(event.target.value)}
              />
            )}
          </Field>
          <div className="mt-5">
            <ActionButton type="submit">Save this plan</ActionButton>
          </div>
        </form>
      )}
    </Disclosure>
  );
}

function CompleteSupportForm({
  open,
  onToggle,
  title,
  onComplete,
  onCancel,
}: {
  open: boolean;
  onToggle: () => void;
  title: string;
  onComplete: (completedAt: string, note: string | null) => SubmitReport;
  onCancel: (reason: string) => SubmitReport;
}) {
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const form = useFormErrors();

  // Two operations share one set of fields, so each has its own submit button
  // and the default (Enter) is the ordinary one: marking it done.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const intent =
      (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "cancel"
        ? "cancel"
        : "complete";

    if (intent === "cancel") {
      if (note.trim().length === 0) {
        form.show([
          {
            controlId: "complete-note",
            message: "Say why it was cancelled before cancelling it.",
          },
        ]);
        return;
      }
      if (!form.report(onCancel(note.trim()), "complete-note")) return;
      setNote("");
      return;
    }

    if (when && Number.isNaN(new Date(when).getTime())) {
      form.show([
        {
          controlId: "complete-when",
          message: "That date and time cannot be read. Leave it blank to use right now.",
        },
      ]);
      return;
    }
    if (
      !form.report(
        onComplete(toIso(when, new Date().toISOString()), note.trim() || null),
        "complete-when",
      )
    )
      return;
    setNote("");
    setWhen("");
  }

  return (
    <Disclosure summary={`Close off: ${title}`} open={open} onToggle={onToggle}>
      <form onSubmit={handleSubmit} noValidate>
        <ErrorSummary errors={form.errors} headingId="complete-form-errors" summaryRef={form.ref} />
        <Field
          label="When was it done?"
          hint="Leave blank to use right now."
          controlId="complete-when"
          error={form.errorFor("complete-when")}
        >
          {({ id, describedBy, invalid }) => (
            <TextLine
              id={id}
              type="datetime-local"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={when}
              onChange={(event) => setWhen(event.target.value)}
            />
          )}
        </Field>
        <Field
          label="Anything worth noting about how it went?"
          hint="Needed if you are cancelling instead."
          controlId="complete-note"
          error={form.errorFor("complete-note")}
        >
          {({ id, describedBy, invalid }) => (
            <TextBlock
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          )}
        </Field>
        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton type="submit" value="complete">
            Mark it done
          </ActionButton>
          <ActionButton tone="secondary" type="submit" value="cancel">
            Cancel it instead
          </ActionButton>
        </div>
      </form>
    </Disclosure>
  );
}

function ReviewForm({
  open,
  onToggle,
  supportTitle,
  observations,
  reviews,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  supportTitle: string;
  observations: LearningLoopDocument["observations"];
  reviews: LearningLoopDocument["goalReviews"];
  onSubmit: (input: {
    observationIds: string[];
    reviewedAt: string;
    result: ReviewResult;
    rationale: string;
    supersedesGoalReviewId: string | null;
  }) => SubmitReport;
}) {
  const [selected, setSelected] = useState<string[] | null>(null);
  const [result, setResult] = useState<ReviewResult>("progress-observed");
  const [rationale, setRationale] = useState("");
  const [supersedes, setSupersedes] = useState("");
  const form = useFormErrors();

  const chosen = selected ?? observations.map((row) => row.observationId);
  // Only a result that has not already been corrected can be corrected again.
  const correctable = reviews.filter(
    (row) => !reviews.some((other) => other.supersedesGoalReviewId === row.goalReviewId),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: FormError[] = [];
    if (chosen.length === 0)
      found.push({
        controlId: "review-basis",
        message: "Pick at least one observation to judge from.",
      });
    if (rationale.trim().length === 0)
      found.push({
        controlId: "review-rationale",
        message: "Write why the evidence shows that.",
      });
    if (found.length > 0) {
      form.show(found);
      return;
    }
    if (
      !form.report(
        onSubmit({
          observationIds: chosen,
          reviewedAt: new Date().toISOString(),
          result,
          rationale: rationale.trim(),
          supersedesGoalReviewId: supersedes || null,
        }),
        "review-rationale",
      )
    )
      return;
    setRationale("");
    setSelected(null);
    setSupersedes("");
  }

  return (
    <Disclosure
      summary={`Decide what happened after: ${supportTitle}`}
      open={open}
      onToggle={onToggle}
    >
      {observations.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Record what you saw after the support before judging it.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <ErrorSummary errors={form.errors} headingId="review-form-errors" summaryRef={form.ref} />
          <CheckGroup
            legend="Which observations are you judging from?"
            controlId="review-basis"
            error={form.errorFor("review-basis")}
            required
          >
            {observations.map((row, index) => (
              <CheckLine
                key={row.observationId}
                id={index === 0 ? "review-basis" : undefined}
                label={`${formatMoment(row.observedAt)} — ${row.observationText.slice(0, 80)}`}
                checked={chosen.includes(row.observationId)}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? [...new Set([...chosen, row.observationId])]
                      : chosen.filter((id) => id !== row.observationId),
                  )
                }
              />
            ))}
          </CheckGroup>
          <Field label="What does it show?" controlId="review-result">
            {({ id }) => (
              <Choice
                id={id}
                value={result}
                onChange={(event) => setResult(event.target.value as ReviewResult)}
              >
                {REVIEW_RESULTS.map((value) => (
                  <option key={value} value={value}>
                    {REVIEW_RESULT_LABEL[value]}
                  </option>
                ))}
              </Choice>
            )}
          </Field>
          <Field
            label="Why do you say that?"
            required
            controlId="review-rationale"
            error={form.errorFor("review-rationale")}
          >
            {({ id, describedBy, invalid }) => (
              <TextBlock
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
              />
            )}
          </Field>
          {correctable.length > 0 ? (
            <Field
              label="Does this correct an earlier result?"
              hint="The earlier result stays in the history and is marked as replaced. Nothing is edited over."
              controlId="review-supersedes"
            >
              {({ id, describedBy }) => (
                <Choice
                  id={id}
                  aria-describedby={describedBy}
                  value={supersedes}
                  onChange={(event) => setSupersedes(event.target.value)}
                >
                  <option value="">No, this is new</option>
                  {correctable.map((row) => (
                    <option key={row.goalReviewId} value={row.goalReviewId}>
                      {formatMoment(row.reviewedAt)} — {REVIEW_RESULT_LABEL[row.result]}
                    </option>
                  ))}
                </Choice>
              )}
            </Field>
          ) : null}
          <div className="mt-5">
            <ActionButton type="submit">Save this result</ActionButton>
          </div>
        </form>
      )}
    </Disclosure>
  );
}
