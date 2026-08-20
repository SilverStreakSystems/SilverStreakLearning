import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import {
  ACTION_KIND_LABEL,
  PRIORITY_FACTORS,
  PRIORITY_FACTOR_LABEL,
  PROHIBITED_PRIORITY_FACTORS,
  PROHIBITED_PRIORITY_REASON,
  priorityRank,
  validateActions,
} from "@/domain";
import { ACTIVE_CAPACITY, buildActions } from "@/lib/workspace-queries";

export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Action Center | SSLS" },
      {
        name: "description",
        content:
          "Every obligation the authorized capacity currently owes, projected from the registers that already record them.",
      },
      { property: "og:title", content: "Action Center | SSLS" },
      {
        property: "og:description",
        content: "Ordered by named governance factors, never by a computed score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ActionCenter,
});

function ActionCenter() {
  const actions = buildActions();
  const violations = validateActions(actions);

  return (
    <div>
      <PageHeader
        title="Action Center"
        summary={`Obligations owed by the ${ACTIVE_CAPACITY.name.toLowerCase()}. Each one is projected from a canonical register record: this surface creates no tasks of its own.`}
      />

      <Section
        id="order"
        title="How this list is ordered"
        description="Position in the list below is the whole ranking rule. There is no weighting, no learned model, and no opaque score."
      >
        <p className="measure mb-3 text-sm text-muted-foreground">
          One input sits above this list: an obligation carrying a recorded owner instruction is
          placed first, and the instruction is printed next to it. It is a named human directive,
          never a computed score.
        </p>
        <ol className="measure list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {PRIORITY_FACTORS.map((factor) => (
            <li key={factor}>{PRIORITY_FACTOR_LABEL[factor]}</li>
          ))}
        </ol>
      </Section>

      <Section
        id="actions"
        title={`Open obligations (${actions.length})`}
        description="Resolve each in the register that owns it. The action disappears when the underlying record changes."
      >
        {actions.length === 0 ? (
          <p className="measure text-sm text-muted-foreground">
            <span className="font-mono text-xs">[EMPTY]</span> No obligation is currently recorded
            on any register. That is an empty source, not a completed enterprise.
          </p>
        ) : (
          <RegistryTable
            caption="Open obligations with kind, reason, authority basis, canonical source, and ranking factor."
            headers={[
              "Obligation",
              "Kind",
              "Why",
              "Authority basis",
              "Canonical source",
              "Position basis",
            ]}
          >
            {actions.map((action) => (
              <tr key={action.actionId}>
                <RowHeader>
                  {action.ownerPriorityDirective ? (
                    <span className="mb-1 block font-mono text-xs">[OWNER-DIRECTED FIRST]</span>
                  ) : null}
                  {action.title}
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {action.whatNeedsAttention}
                  </span>
                </RowHeader>
                <Cell>{ACTION_KIND_LABEL[action.kind]}</Cell>
                <Cell>
                  {action.why}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Consequence: {action.consequence}
                  </span>
                </Cell>
                <Cell>{action.authorityBasis}</Cell>
                <Cell>
                  <Link to={action.canonicalSource.route}>{action.canonicalSource.objectId}</Link>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {action.canonicalSource.objectType}
                  </span>
                </Cell>
                <Cell>
                  {action.ownerPriorityDirective ? (
                    <>
                      Placed first by recorded owner instruction.
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {action.ownerPriorityDirective} Its factor is otherwise{" "}
                        {priorityRank(action.topFactor)}. {PRIORITY_FACTOR_LABEL[action.topFactor]}
                      </span>
                    </>
                  ) : (
                    <>
                      {priorityRank(action.topFactor)}. {PRIORITY_FACTOR_LABEL[action.topFactor]}
                    </>
                  )}
                </Cell>
              </tr>
            ))}
          </RegistryTable>
        )}
      </Section>

      <Section
        id="integrity"
        title="Projection integrity"
        description="An action without a canonical source would be a new, ungoverned task."
      >
        <p className="measure text-sm text-muted-foreground">
          {violations.length === 0
            ? "Every action above references exactly one canonical source object, and no obligation is projected twice."
            : violations.map((violation) => `${violation.actionId}: ${violation.detail}`).join(" ")}
        </p>
      </Section>

      <Section id="refused" title="Refused ranking inputs">
        <RegistryTable
          caption="Ranking inputs that are refused, with the reason for each refusal."
          headers={["Refused input", "Reason"]}
        >
          {PROHIBITED_PRIORITY_FACTORS.map((factor) => (
            <tr key={factor}>
              <RowHeader>{factor}</RowHeader>
              <Cell>{PROHIBITED_PRIORITY_REASON[factor]}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </div>
  );
}
