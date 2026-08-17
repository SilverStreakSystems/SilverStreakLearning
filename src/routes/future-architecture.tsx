import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { GatedPanel } from "@/components/governance/markers";
import { FUTURE_WORKSPACES, getCapability } from "@/fixtures";

export const Route = createFileRoute("/future-architecture")({
  head: () => ({
    meta: [
      { title: "Future Architecture | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "The nine target-state SSLS enterprise workspaces, held as gated candidates with no current implementation authority.",
      },
      { property: "og:title", content: "Future Architecture | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Target-state workspaces and what each would require before it could be built.",
      },
    ],
  }),
  component: FutureArchitecture,
});

function FutureArchitecture() {
  return (
    <div>
      <PageHeader
        title="Future Architecture"
        summary="Target-state material, shown so it can be reasoned about without becoming a commitment. None of it is implemented, and none of it may be cited to justify present work."
      >
        <p className="rounded-md border-4 border-double border-border-strong bg-surface p-3 text-sm font-semibold">
          Everything on this page is a target-state candidate. Nothing on this page is current
          implementation authority.
        </p>
      </PageHeader>

      <Section
        id="workspaces"
        title="Target-state enterprise workspaces"
        description="Nine candidate workspaces. Each names what would have to be true before it could be built."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {FUTURE_WORKSPACES.map((workspace) => (
            <GatedPanel
              key={workspace.id}
              title={`${workspace.id} — ${workspace.name}`}
              notice={workspace.gateNotice}
            >
              <p className="measure text-sm text-muted-foreground">{workspace.intent}</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Candidate capabilities
                  </dt>
                  <dd>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {workspace.candidateCapabilities.map((id) => (
                        <li key={id}>
                          {id} — {getCapability(id)?.name ?? "Not recorded"}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Promotion requirement
                  </dt>
                  <dd className="mt-1">{workspace.promotionRequirement}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Authority
                  </dt>
                  <dd className="mt-1">
                    <AuthorityBadge authorityClass={workspace.authorityClass} />
                  </dd>
                </div>
              </dl>
            </GatedPanel>
          ))}
        </div>
      </Section>

      <Section
        id="why-gated"
        title="Why this stays gated"
        description="Building the operating model first would encode organizational structure that no capability architecture has justified yet."
      >
        <ul className="measure list-disc space-y-2 pl-5 text-sm">
          <li>
            The Enterprise Capability Architecture at L2 is candidate material, so workspace
            ownership cannot yet be assigned.
          </li>
          <li>
            The Core Beliefs Doctrine at L0 has no recorded content, so nothing above it can claim
            to answer to it.
          </li>
          <li>
            The current posture has one operator and no external users, so most workspaces have no
            one to serve.
          </li>
        </ul>
      </Section>
    </div>
  );
}
