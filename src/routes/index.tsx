import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { StateChip } from "@/components/governance/state-chip";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import {
  CLAIMS,
  DECISIONS,
  EVIDENCE,
  FINDINGS,
  FOUNDATION_ARTIFACTS,
  NEXT_DEFENSIBLE_ACTIONS,
  READINESS_AXES,
} from "@/fixtures";
import { carriesImplementationAuthority, operatesNow } from "@/domain";
import { WORKSPACES } from "@/fixtures";
import { ACTIVE_CAPACITY, buildActions, buildNotifications } from "@/lib/workspace-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "Current authority, implementation, validation, and the next defensible action for the SSLS foundation shell.",
      },
      { property: "og:title", content: "Command Center | SSLS Foundation Shell" },
      {
        property: "og:description",
        content:
          "Independent readiness axes, open decisions, and refused claims for the SSLS foundation shell.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const authoritative = FOUNDATION_ARTIFACTS.filter(
    (artifact) =>
      artifact.recordState === "current" && carriesImplementationAuthority(artifact.authorityClass),
  );
  const candidates = FOUNDATION_ARTIFACTS.filter(
    (artifact) => artifact.authorityClass === "research-candidate",
  );
  const provisional = FOUNDATION_ARTIFACTS.filter(
    (artifact) => artifact.authorityClass === "provisional-implementation",
  );
  const blocked = FINDINGS.filter(
    (finding) => finding.resolutionState === "blocked" || finding.resolutionState === "conflicted",
  );
  const decisionsRequired = DECISIONS.filter(
    (decision) => decision.state === "required" || decision.state === "pending",
  );
  const evidenceRun = EVIDENCE.filter(
    (record) => record.state === "confirmed" || record.state === "partial",
  );
  const evidenceNotRun = EVIDENCE.filter((record) => record.state !== "confirmed" && record.state !== "partial");
  const refusedClaims = CLAIMS.filter((claim) => claim.posture === "refused");
  const openActions = buildActions();
  const openNotifications = buildNotifications();
  const stopNotifications = openNotifications.filter(
    (notification) => notification.severity === "stop",
  );
  const openWorkspaces = WORKSPACES.filter(operatesNow);

  return (
    <div>
      <PageHeader
        title="Command Center"
        summary="What is currently authoritative, what is only built, what has actually been checked, and what decision comes next. Readiness is reported on separate axes and is never combined into a single score."
      />

      <Section
        id="standing"
        title="Where you are standing"
        description="Acting capacity, open obligations, and which workspaces are open right now. Each number links to the register that produced it; none of them are combined."
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-semibold">Acting as</dt>
            <dd className="text-muted-foreground">{ACTIVE_CAPACITY.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Obligations owed</dt>
            <dd className="text-muted-foreground">
              <Link to="/actions">{openActions.length} in the Action Center</Link>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Notifications</dt>
            <dd className="text-muted-foreground">
              <Link to="/notifications">
                {stopNotifications.length} stop, {openNotifications.length} total
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Workspaces open now</dt>
            <dd className="text-muted-foreground">
              <Link to="/workspaces">
                {openWorkspaces.length} of {WORKSPACES.length} operating
              </Link>
            </dd>
          </div>
        </dl>
      </Section>

      <Section
        id="axes"
        title="Readiness axes"
        description="Each axis stands alone. There is deliberately no blended readiness percentage anywhere in this workspace."
      >
        <ul data-readiness-axes="true" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {READINESS_AXES.map((axis) => (
            <li key={axis.id}>
              <RecordCard className="h-full">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">{axis.name}</h3>
                  <StateChip state={axis.state} describe />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{axis.basis}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Evidence: {axis.evidenceReferences.join(", ") || "None recorded"}
                </p>
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="foundation-standing"
        title="Where the foundation stands"
        description="Counts describe the registry as it is recorded, not as it is hoped to be."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Currently authoritative</h3>
            <ul className="mt-2 space-y-2">
              {authoritative.map((artifact) => (
                <li key={artifact.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <AuthorityBadge authorityClass={artifact.authorityClass} />
                  <span>
                    {artifact.title} (version {artifact.version})
                  </span>
                </li>
              ))}
            </ul>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Built, but not approved</h3>
            <ul className="mt-2 space-y-2">
              {provisional.map((artifact) => (
                <li key={artifact.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <AuthorityBadge authorityClass={artifact.authorityClass} />
                  <span>{artifact.title}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Existing in the repository grants no authority. Promotion is a separate, recorded act.
            </p>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Candidate and research</h3>
            <ul className="mt-2 space-y-2">
              {candidates.map((artifact) => (
                <li key={artifact.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <AuthorityBadge authorityClass={artifact.authorityClass} />
                  <span>{artifact.title}</span>
                </li>
              ))}
            </ul>
          </RecordCard>

          <RecordCard>
            <h3 className="font-display text-base font-semibold">Blocked or conflicted</h3>
            <ul className="mt-2 space-y-2">
              {blocked.map((finding) => (
                <li key={finding.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <StateChip state={finding.resolutionState} />
                  <span>
                    {finding.id}: {finding.title}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link to="/findings" className="font-semibold underline underline-offset-4">
                Open the findings register
              </Link>
            </p>
          </RecordCard>
        </div>
      </Section>

      <Section
        id="validation"
        title="What has actually been checked"
        description="Checks that have never run are reported as Not Run rather than as incomplete work."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Checks with a recorded result</h3>
            <ul className="mt-2 space-y-2">
              {evidenceRun.map((record) => (
                <li key={record.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <StateChip state={record.state} />
                  <span>{record.title}</span>
                </li>
              ))}
            </ul>
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Checks with no result</h3>
            <ul className="mt-2 space-y-2">
              {evidenceNotRun.map((record) => (
                <li key={record.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <StateChip state={record.state} />
                  <span>{record.title}</span>
                </li>
              ))}
            </ul>
          </RecordCard>
        </div>
      </Section>

      <Section id="decisions-required" title="Decisions required">
        <ul className="space-y-3">
          {decisionsRequired.map((decision) => (
            <li key={decision.id}>
              <RecordCard>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">
                    {decision.id}: {decision.title}
                  </h3>
                  <StateChip state={decision.state === "required" ? "blocked" : "unknown"} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{decision.context}</p>
              </RecordCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="next-action"
        title="Next defensible action"
        description="Ordered by what unblocks the most other work. Each is an action the current posture permits."
      >
        <ol className="space-y-3">
          {NEXT_DEFENSIBLE_ACTIONS.map((item, index) => (
            <li key={item.id}>
              <RecordCard>
                <h3 className="font-display text-base font-semibold">
                  {index + 1}. {item.action}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.why}</p>
                {item.blockedBy ? (
                  <p className="mt-2 text-sm">Blocked by: {item.blockedBy}</p>
                ) : null}
              </RecordCard>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="claims"
        title="Claims currently refused"
        description="These statements are withheld on purpose. Nothing in this workspace may be read as making them."
      >
        <ul className="space-y-2">
          {refusedClaims.map((claim) => (
            <li key={claim.id} className="flex flex-wrap items-start gap-2 text-sm">
              <StateChip state={claim.state} />
              <span className="measure">
                {claim.claim} <span className="text-muted-foreground">{claim.reason}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
