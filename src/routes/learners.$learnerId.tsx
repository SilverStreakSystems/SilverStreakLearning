import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, Section } from "@/components/governance/page";
import {
  ActionButton,
  CheckLine,
  Choice,
  Disclosure,
  Field,
  LiveNotice,
  TextBlock,
  TextLine,
} from "@/components/learning-loop/controls";
import {
  NextStepCard,
  StorageNotices,
  TimelineList,
  formatMoment,
} from "@/components/learning-loop/loop-views";
import {
  GOAL_STATUS_LABEL,
  GRADE_BAND_LABEL,
  OBSERVATION_SOURCE_KINDS,
  OBSERVATION_SOURCE_LABEL,
  REVIEW_RESULTS,
  REVIEW_RESULT_LABEL,
  SUPPORT_STATUS_LABEL,
  effectiveObservations,
  readLoopSnapshot,
  recommendNextStep,
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
import { useLearningLoop } from "@/lib/learning-loop/use-learning-loop";

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

const FORM_FOR_STEP: Record<NextStepCode, FormKey> = {
  REVIEW_DATA_INTEGRITY: null,
  SELECT_OR_CREATE_FOCUS_GOAL: "goal",
  RECORD_BASELINE_OBSERVATION: "observation",
  PLAN_SUPPORT: "support",
  COMPLETE_OR_CANCEL_SUPPORT: "complete",
  RECORD_FOLLOW_UP_OBSERVATION: "observation",
  REVIEW_OBSERVATIONS: "review",
  CLOSE_GOAL_AS_ACHIEVED: null,
  PLAN_NEXT_SUPPORT_CYCLE: "support",
  CHANGE_APPROACH: "support",
  GATHER_MORE_EVIDENCE: "observation",
  REVIEW_LOOP_MANUALLY: null,
};

function toIso(localValue: string, fallback: string): string {
  if (!localValue) return fallback;
  const parsed = new Date(localValue);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
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

function LearnerDetail() {
  const { learnerId } = Route.useParams();
  const store = useLearningLoop();
  const [openForm, setOpenForm] = useState<FormKey | "none">("none");

  const document = store.document;

  if (store.state === "loading")
    return (
      <div>
        <PageHeader title="Learner" summary="Reading anything saved in this browser…" />
      </div>
    );

  if (!document) return <MissingLearner learnerId={learnerId} />;
  const learner = document.learners.find((row) => row.learnerId === learnerId);
  if (!learner) return <MissingLearner learnerId={learnerId} />;

  const asOf = new Date().toISOString();
  const recommendation = recommendNextStep(document, learnerId, asOf);
  const snapshot = readLoopSnapshot(document, learnerId, asOf);
  const activeForm = openForm === "none" ? FORM_FOR_STEP[recommendation.stepCode] : openForm;
  const toggle = (key: Exclude<FormKey, null>) => setOpenForm(activeForm === key ? null : key);

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
      <LiveNotice message={store.writeProblem} tone="problem" />

      <div className="mt-6">
        <NextStepCard recommendation={recommendation}>
          {recommendation.stepCode === "CLOSE_GOAL_AS_ACHIEVED" && snapshot.focusGoal ? (
            <ActionButton
              onClick={() =>
                store.apply((current, now) =>
                  setGoalStatus(current, snapshot.focusGoal!.goalId, "achieved", now),
                )
              }
            >
              Mark this goal as met
            </ActionButton>
          ) : null}
        </NextStepCard>
      </div>

      <Section
        id="focus-goal"
        title="The goal being worked on"
        description="One goal at a time. Everything recorded below is attached to it."
      >
        {snapshot.focusGoal ? (
          <article className="rounded-md border border-border bg-surface p-4 sm:p-5">
            <h3 className="font-display text-lg font-semibold">{snapshot.focusGoal.title}</h3>
            <p className="measure mt-2 text-sm">
              <span className="font-semibold">Success looks like: </span>
              {snapshot.focusGoal.successCriterion}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {GOAL_STATUS_LABEL[snapshot.focusGoal.status]} — {snapshot.focusGoal.goalId}
              {snapshot.focusGoal.targetReviewDate
                ? ` — review by ${formatMoment(snapshot.focusGoal.targetReviewDate)} UTC`
                : ""}
            </p>
            {snapshot.focusGoal.status === "active" ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton
                  tone="secondary"
                  onClick={() =>
                    store.apply((current, now) =>
                      setGoalStatus(current, snapshot.focusGoal!.goalId, "paused", now),
                    )
                  }
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
                      onClick={() =>
                        store.apply((current, now) => {
                          const activated = setGoalStatus(current, goal.goalId, "active", now);
                          return setFocusGoal(activated, learnerId, goal.goalId, now);
                        })
                      }
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
            store.apply(
              (current, now) => createGoal(current, { learnerId, ...input }, now).document,
            );
            setOpenForm(null);
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
          goalId={snapshot.focusGoal?.goalId ?? null}
          defaultSupportActionId={
            recommendation.stepCode === "RECORD_FOLLOW_UP_OBSERVATION"
              ? recommendation.activeSupportActionId
              : null
          }
          onSubmit={(input) => {
            if (!snapshot.focusGoal) return;
            store.apply(
              (current, now) =>
                recordObservation(
                  current,
                  { learnerId, goalId: snapshot.focusGoal!.goalId, ...input },
                  now,
                ).document,
            );
            setOpenForm(null);
          }}
        />

        <SupportForm
          open={activeForm === "support"}
          onToggle={() => toggle("support")}
          observations={
            snapshot.focusGoal
              ? effectiveObservations(document).filter(
                  (row) => row.goalId === snapshot.focusGoal!.goalId,
                )
              : []
          }
          onSubmit={(input) => {
            if (!snapshot.focusGoal) return;
            store.apply(
              (current, now) =>
                planSupport(
                  current,
                  { learnerId, goalId: snapshot.focusGoal!.goalId, ...input },
                  now,
                ).document,
            );
            setOpenForm(null);
          }}
        />

        {snapshot.activeSupport ? (
          <CompleteSupportForm
            open={activeForm === "complete"}
            onToggle={() => toggle("complete")}
            title={snapshot.activeSupport.title}
            onComplete={(completedAt, note) => {
              store.apply((current, now) =>
                completeSupport(
                  current,
                  snapshot.activeSupport!.supportActionId,
                  completedAt,
                  note,
                  now,
                ),
              );
              setOpenForm(null);
            }}
            onCancel={(reason) => {
              store.apply((current, now) =>
                cancelSupport(current, snapshot.activeSupport!.supportActionId, reason, now),
              );
              setOpenForm(null);
            }}
          />
        ) : null}

        {snapshot.latestCompletedSupport ? (
          <ReviewForm
            open={activeForm === "review"}
            onToggle={() => toggle("review")}
            supportTitle={snapshot.latestCompletedSupport.title}
            observations={snapshot.observations.filter(
              (row) => row.supportActionId === snapshot.latestCompletedSupport!.supportActionId,
            )}
            onSubmit={(input) => {
              if (!snapshot.focusGoal) return;
              store.apply(
                (current, now) =>
                  recordGoalReview(
                    current,
                    {
                      learnerId,
                      goalId: snapshot.focusGoal!.goalId,
                      supportActionId: snapshot.latestCompletedSupport!.supportActionId,
                      supersedesGoalReviewId: null,
                      ...input,
                    },
                    now,
                  ).document,
              );
              setOpenForm(null);
            }}
          />
        ) : null}
      </Section>

      <Section
        id="chain"
        title="What was tried, and what it showed"
        description="Each support names the observations it was based on. Each result names the observations it was judged from. Nothing here is inferred."
      >
        {snapshot.supportActions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No support has been planned yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {snapshot.supportActions.map((support) => {
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
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [criterion, setCriterion] = useState("");
  const [target, setTarget] = useState("");
  const [makeFocus, setMakeFocus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <Disclosure summary="Add a goal" open={open} onToggle={onToggle}>
      <Field label="What is the goal?" required error={error}>
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
      >
        {({ id, describedBy }) => (
          <TextBlock
            id={id}
            aria-describedby={describedBy}
            value={criterion}
            onChange={(event) => setCriterion(event.target.value)}
          />
        )}
      </Field>
      <Field label="Check back by (optional)">
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
        <ActionButton
          onClick={() => {
            if (title.trim().length === 0 || criterion.trim().length === 0) {
              setError("Both the goal and how you will know it has been met are needed.");
              return;
            }
            setError(null);
            onSubmit({
              title: title.trim(),
              successCriterion: criterion.trim(),
              targetReviewDate: target ? new Date(`${target}T00:00:00Z`).toISOString() : null,
              makeFocus,
            });
            setTitle("");
            setCriterion("");
            setTarget("");
          }}
        >
          Save this goal
        </ActionButton>
      </div>
    </Disclosure>
  );
}

function ObservationForm({
  open,
  onToggle,
  document,
  learnerId,
  goalId,
  defaultSupportActionId,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  document: LearningLoopDocument;
  learnerId: string;
  goalId: string | null;
  defaultSupportActionId: string | null;
  onSubmit: (input: {
    supportActionId: string | null;
    observedAt: string;
    sourceKind: ObservationSourceKind;
    observationText: string;
    supersedesObservationId: string | null;
  }) => void;
}) {
  const [when, setWhen] = useState("");
  const [source, setSource] = useState<ObservationSourceKind>("direct-observation");
  const [text, setText] = useState("");
  const [supersedes, setSupersedes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const existing = goalId
    ? effectiveObservations(document).filter(
        (row) => row.goalId === goalId && row.learnerId === learnerId,
      )
    : [];
  const supports = goalId
    ? document.supportActions.filter((row) => row.goalId === goalId && row.status === "completed")
    : [];

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
      <Field label="What did you see?" required error={error}>
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
      <Field label="Where did this come from?">
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
      <Field label="When did you see it?" hint="Leave blank to use right now.">
        {({ id, describedBy }) => (
          <TextLine
            id={id}
            type="datetime-local"
            aria-describedby={describedBy}
            value={when}
            onChange={(event) => setWhen(event.target.value)}
          />
        )}
      </Field>
      {supports.length > 0 ? (
        <Field label="Is this a follow-up to something you tried?">
          {({ id }) => (
            <Choice id={id} defaultValue={defaultSupportActionId ?? ""}>
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
        <ActionButton
          onClick={() => {
            if (text.trim().length === 0) {
              setError("Write down what you saw before saving.");
              return;
            }
            setError(null);
            onSubmit({
              supportActionId: defaultSupportActionId,
              observedAt: toIso(when, new Date().toISOString()),
              sourceKind: source,
              observationText: text.trim(),
              supersedesObservationId: supersedes || null,
            });
            setText("");
            setWhen("");
            setSupersedes("");
          }}
        >
          Save this observation
        </ActionButton>
      </div>
    </Disclosure>
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
  }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [rationale, setRationale] = useState("");
  const [intended, setIntended] = useState("");
  const [error, setError] = useState<string | null>(null);

  const chosen =
    selected.length > 0 ? selected : observations.slice(-1).map((row) => row.observationId);

  return (
    <Disclosure summary="Plan a support" open={open} onToggle={onToggle}>
      {observations.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Record an observation first. A support has to be based on something you saw.
        </p>
      ) : (
        <>
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">
              Which observations is this based on?
              <span className="ml-1 font-normal text-muted-foreground">(required)</span>
            </legend>
            {observations.map((row) => (
              <CheckLine
                key={row.observationId}
                label={`${formatMoment(row.observedAt)} — ${row.observationText.slice(0, 80)}`}
                checked={chosen.includes(row.observationId)}
                onChange={(event) =>
                  setSelected((current) => {
                    const base = current.length > 0 ? current : chosen;
                    return event.target.checked
                      ? [...new Set([...base, row.observationId])]
                      : base.filter((id) => id !== row.observationId);
                  })
                }
              />
            ))}
          </fieldset>
          <Field label="What will you do?" required error={error}>
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
          <Field label="Why this, given what you saw?" required>
            {({ id }) => (
              <TextBlock
                id={id}
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
              />
            )}
          </Field>
          <Field label="What would tell you it is working?" required>
            {({ id }) => (
              <TextBlock
                id={id}
                value={intended}
                onChange={(event) => setIntended(event.target.value)}
              />
            )}
          </Field>
          <div className="mt-5">
            <ActionButton
              onClick={() => {
                if (
                  chosen.length === 0 ||
                  title.trim().length === 0 ||
                  rationale.trim().length === 0 ||
                  intended.trim().length === 0
                ) {
                  setError("Pick at least one observation and fill in all three boxes.");
                  return;
                }
                setError(null);
                onSubmit({
                  basedOnObservationIds: chosen,
                  title: title.trim(),
                  rationale: rationale.trim(),
                  intendedEvidence: intended.trim(),
                  plannedAt: new Date().toISOString(),
                });
                setTitle("");
                setRationale("");
                setIntended("");
                setSelected([]);
              }}
            >
              Save this plan
            </ActionButton>
          </div>
        </>
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
  onComplete: (completedAt: string, note: string | null) => void;
  onCancel: (reason: string) => void;
}) {
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Disclosure summary={`Close off: ${title}`} open={open} onToggle={onToggle}>
      <Field label="When was it done?" hint="Leave blank to use right now.">
        {({ id, describedBy }) => (
          <TextLine
            id={id}
            type="datetime-local"
            aria-describedby={describedBy}
            value={when}
            onChange={(event) => setWhen(event.target.value)}
          />
        )}
      </Field>
      <Field
        label="Anything worth noting about how it went?"
        hint="Needed if you are cancelling instead."
        error={error}
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
        <ActionButton
          onClick={() => {
            setError(null);
            onComplete(toIso(when, new Date().toISOString()), note.trim() || null);
            setNote("");
            setWhen("");
          }}
        >
          Mark it done
        </ActionButton>
        <ActionButton
          tone="secondary"
          onClick={() => {
            if (note.trim().length === 0) {
              setError("Say why it was cancelled before cancelling it.");
              return;
            }
            setError(null);
            onCancel(note.trim());
            setNote("");
          }}
        >
          Cancel it instead
        </ActionButton>
      </div>
    </Disclosure>
  );
}

function ReviewForm({
  open,
  onToggle,
  supportTitle,
  observations,
  onSubmit,
}: {
  open: boolean;
  onToggle: () => void;
  supportTitle: string;
  observations: LearningLoopDocument["observations"];
  onSubmit: (input: {
    observationIds: string[];
    reviewedAt: string;
    result: ReviewResult;
    rationale: string;
  }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<ReviewResult>("progress-observed");
  const [rationale, setRationale] = useState("");
  const [error, setError] = useState<string | null>(null);

  const chosen = selected.length > 0 ? selected : observations.map((row) => row.observationId);

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
        <>
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">
              Which observations are you judging from?
            </legend>
            {observations.map((row) => (
              <CheckLine
                key={row.observationId}
                label={`${formatMoment(row.observedAt)} — ${row.observationText.slice(0, 80)}`}
                checked={chosen.includes(row.observationId)}
                onChange={(event) =>
                  setSelected((current) => {
                    const base = current.length > 0 ? current : chosen;
                    return event.target.checked
                      ? [...new Set([...base, row.observationId])]
                      : base.filter((id) => id !== row.observationId);
                  })
                }
              />
            ))}
          </fieldset>
          <Field label="What does it show?">
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
          <Field label="Why do you say that?" required error={error}>
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
          <div className="mt-5">
            <ActionButton
              onClick={() => {
                if (chosen.length === 0 || rationale.trim().length === 0) {
                  setError("Pick at least one observation and say why.");
                  return;
                }
                setError(null);
                onSubmit({
                  observationIds: chosen,
                  reviewedAt: new Date().toISOString(),
                  result,
                  rationale: rationale.trim(),
                });
                setRationale("");
                setSelected([]);
              }}
            >
              Save this result
            </ActionButton>
          </div>
        </>
      )}
    </Disclosure>
  );
}
