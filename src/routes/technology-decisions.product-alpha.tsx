import { createFileRoute } from "@tanstack/react-router";
import { Cell, PageHeader, RegistryTable, RowHeader, Section } from "@/components/governance/page";
import { PlanningScopeNotice, SubNav, SubNavLink } from "@/components/technology-decisions/parts";
import { describeOptions, productAlphaAssessment } from "@/lib/technology-decision-registry";

const ASSESSMENT = productAlphaAssessment();

const BELONGS_LABEL: Record<string, string> = {
  yes: "Belongs in the application",
  no: "Does not belong in the application",
  partly: "Partly — only the recorded part",
  "only-as-a-view": "Only as a view over data held elsewhere in the application",
};

export const Route = createFileRoute("/technology-decisions/product-alpha")({
  head: () => ({
    meta: [
      { title: "Product Alpha 001 Fit Assessment | SSLS" },
      {
        name: "description",
        content: `Each of the ${ASSESSMENT.steps.length} steps in the implemented learning loop, tested against the decision process to ask whether it needed an application at all.`,
      },
      { property: "og:title", content: "Product Alpha 001 Fit Assessment | SSLS" },
      {
        property: "og:description",
        content:
          "The same test applied to work already built, so the answer can still come back as no.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductAlphaFitPage,
});

function ProductAlphaFitPage() {
  const { meta, steps } = ASSESSMENT;

  return (
    <div>
      <PageHeader
        title="Product Alpha 001 fit assessment"
        summary={`${steps.length} steps of the implemented learning loop, each run through the same decision process used for every other workflow. Applying the test to work already built is the only way the test stays honest.`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to="/technology-decisions">Overview</SubNavLink>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section id="method" title="Method">
        <p className="measure text-sm text-muted-foreground">{meta.method}</p>
        <p className="measure mt-3 text-sm text-muted-foreground">{meta.authority_note}</p>
      </Section>

      <Section
        id="steps"
        title="Step-by-step assessment"
        description="Derived option sets come from the evaluator, not from any judgement recorded in the assessment file."
      >
        <RegistryTable
          caption="Learning loop steps with fit judgement and derived option set."
          headers={["Step", "Surface", "Belongs in the application", "Derived result"]}
        >
          {steps.map((step) => (
            <tr key={step.step_id}>
              <RowHeader>{step.step}</RowHeader>
              <Cell>{step.surface}</Cell>
              <Cell>{BELONGS_LABEL[step.belongs_in_ssls] ?? step.belongs_in_ssls}</Cell>
              <Cell>
                {step.evaluation.outcome === "resolved"
                  ? describeOptions(step.evaluation.optionIds)
                  : "Abstained"}
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="detail"
        title="Why each step resolved the way it did"
        description="Data needs, audit needs, the deterministic boundary, and what may never be interpreted for the operator."
      >
        <div className="grid gap-4">
          {steps.map((step) => (
            <article key={step.step_id} className="rounded-md border border-border bg-surface p-4">
              <h3 className="font-display text-base font-semibold">
                {step.step_id} — {step.step}
              </h3>
              <p className="measure mt-1 text-sm text-muted-foreground">{step.reason}</p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Data needs
                  </dt>
                  <dd className="text-sm">{step.data_needs}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Audit needs
                  </dt>
                  <dd className="text-sm">{step.audit_needs}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Deterministic boundary
                  </dt>
                  <dd className="text-sm">{step.deterministic_boundary}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Human review
                  </dt>
                  <dd className="text-sm">{step.human_review}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Never interpreted for the operator
                  </dt>
                  <dd className="text-sm">{step.prohibited_interpretation}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
