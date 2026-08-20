import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { StateChip } from "@/components/governance/state-chip";
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { GateChip, IndependenceChip, StageChip } from "@/components/governance/capability-controls";
import { parseCapabilitySearch } from "@/components/governance/capability-view-model";
import { CAPABILITY_DEPENDENCIES, ENTERPRISE_CAPABILITIES } from "@/fixtures";
import {
  BENEFICIARY_LABEL,
  CAPABILITY_DOMAIN_META,
  CAPABILITY_TYPE_LABEL,
  COVERAGE_MODE_LABEL,
  DEPENDENCY_KIND_LABEL,
  INDEPENDENCE_LABEL,
  MATURITY_LEVEL_LABEL,
  RECORD_STATE_LABEL,
  VALUE_STREAM_LABEL,
} from "@/domain";
import { capabilityById, dependenciesFor } from "@/lib/capability-queries";

export const Route = createFileRoute("/capabilities/$capabilityId")({
  validateSearch: parseCapabilitySearch,
  head: ({ params }) => {
    const capability = capabilityById(ENTERPRISE_CAPABILITIES, params.capabilityId);
    const title = capability
      ? `${capability.capabilityId} ${capability.name} (Candidate) | SSLS`
      : "Capability not found | SSLS";
    const description = capability
      ? capability.purpose
      : "No candidate capability record exists with that identifier.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        ...(capability ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: CapabilityDetail,
});

function CapabilityDetail() {
  const { capabilityId } = Route.useParams();
  const search = Route.useSearch();
  const capability = capabilityById(ENTERPRISE_CAPABILITIES, capabilityId);

  if (!capability) {
    return (
      <div>
        <PageHeader
          title="Capability record not found"
          summary={`No candidate capability is recorded under the identifier ${capabilityId}. Absence here means no record exists, not that the ability is unnecessary.`}
        />
        <p className="mt-6">
          <Link
            to="/capabilities"
            search={search}
            className="font-semibold underline underline-offset-2"
          >
            Return to the capability registry
          </Link>
        </p>
      </div>
    );
  }

  const { outgoing, incoming } = dependenciesFor(CAPABILITY_DEPENDENCIES, capability.capabilityId);
  const domain = CAPABILITY_DOMAIN_META[capability.capabilityDomain];

  return (
    <div>
      <PageHeader
        title={`${capability.capabilityId} — ${capability.name}`}
        summary={capability.description}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass={capability.currentAuthority} />
          <StateChip state={capability.implementationStatus} />
          <IndependenceChip level={capability.independence.level} />
          <StageChip stage={capability.stages.execution} />
          {capability.synthetic ? <SyntheticMarker /> : null}
        </div>
        <p className="mt-3">
          <Link
            to="/capabilities"
            search={search}
            className="text-sm font-semibold underline underline-offset-2"
          >
            Back to the capability registry, with your filters kept
          </Link>
        </p>
      </PageHeader>

      <Section
        id="north-star"
        title="Connection to the North Star"
        description="How this ability would help make learning visible, and who is harmed if it is absent."
      >
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Purpose">{capability.purpose}</Field>
            <Field label="North Star contribution">{capability.northStarContribution}</Field>
            <Field label="Problem solved">{capability.problemSolved}</Field>
            <Field label="Human beneficiaries">
              <ValueList items={capability.humanBeneficiaries.map((b) => BENEFICIARY_LABEL[b])} />
            </Field>
            <Field label="Direct enterprise beneficiaries">
              <ValueList items={capability.directEnterpriseBeneficiaries} />
            </Field>
            <Field label="Who is harmed if it fails">{capability.harmedIfItFails}</Field>
            <Field label="Who carries the burden">{capability.carriesBurden}</Field>
            <Field label="Where human judgment is retained">{capability.retainsJudgment}</Field>
            <Field label="Risk if absent">{capability.riskIfAbsent}</Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="classification" title="Classification">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Domain">
              {capability.capabilityDomain} — {domain.name}
            </Field>
            <Field label="Capability types">
              <ValueList items={capability.capabilityTypes.map((t) => CAPABILITY_TYPE_LABEL[t])} />
            </Field>
            <Field label="Value streams">
              <ValueList
                items={capability.keyValueStreams.map((v) => VALUE_STREAM_LABEL[v])}
                empty="None recorded."
              />
            </Field>
            <Field label="Record state">{RECORD_STATE_LABEL[capability.recordState]}</Field>
            <Field label="Governing principles">
              <ValueList items={capability.governingPrinciples} />
            </Field>
            <Field label="Cross-cutting constraints">
              <ValueList items={capability.crossCuttingConstraints} />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section
        id="ownership"
        title="Ownership, decision rights, and independence"
        description="Every name below is a candidate. Nothing here assigns a person to anything."
      >
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Owning function (candidate)">
              {capability.owningFunctionCandidate ?? "Not yet assigned."}
            </Field>
            <Field label="Accountable executive role (candidate)">
              {capability.accountableExecutiveRoleCandidate ?? "Not yet assigned."}
            </Field>
            <Field label="Accountable domain authority (candidate)">
              {capability.accountableDomainAuthorityCandidate ?? "Not yet assigned."}
            </Field>
            <Field label="Supporting functions">
              <ValueList items={capability.supportingFunctions} empty="None recorded." />
            </Field>
            <Field label="Required decision rights">
              <ValueList items={capability.requiredDecisionRights} />
            </Field>
            <Field label="Required consultation">
              <ValueList items={capability.requiredConsultation} empty="None recorded." />
            </Field>
            <Field label="Stop authority">{capability.stopAuthority}</Field>
            <Field label="Independence">
              {INDEPENDENCE_LABEL[capability.independence.level]}.{" "}
              {capability.independence.separationOfDuties}
              {capability.independence.trigger
                ? ` Trigger: ${capability.independence.trigger}`
                : ""}
            </Field>
            <Field label="Incompatible combinations">
              <ValueList items={capability.incompatibleCombinations} empty="None recorded." />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="outputs" title="Required outputs and evidence">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Required deliverable types">
              <ValueList items={capability.requiredDeliverableTypes} />
            </Field>
            <Field label="Required evidence">
              <ValueList items={capability.requiredEvidence} />
            </Field>
            <Field label="Required data classes">
              <ValueList items={capability.requiredDataClasses} empty="None recorded." />
            </Field>
            <Field label="System dependencies">
              <ValueList items={capability.systemDependencies} empty="None recorded." />
            </Field>
            <Field label="Validation status">
              <StateChip state={capability.validationStatus} />
            </Field>
            <Field label="Evidence status">
              <StateChip state={capability.evidenceStatus} />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section
        id="maturity"
        title="Maturity, stages, and triggers"
        description="Stage obligations state when an ability must exist. They are not a schedule and not a claim of progress."
      >
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Current maturity (declared)">
              {MATURITY_LEVEL_LABEL[capability.currentMaturity]}
            </Field>
            <Field label="Target maturity">{MATURITY_LEVEL_LABEL[capability.targetMaturity]}</Field>
            <Field label="Architecture required by">{capability.stages.architecture}</Field>
            <Field label="Execution required by">{capability.stages.execution}</Field>
            <Field label="Dedicated staffing required by">
              {capability.stages.dedicatedStaffing}
            </Field>
            <Field label="Independent assurance required by">
              {capability.stages.independentAssurance}
            </Field>
            <Field label="Succession required by">{capability.stages.succession}</Field>
            <Field label="Staffing trigger">{capability.staffingTrigger}</Field>
            <Field label="Coverage eligibility">
              <ValueList
                items={capability.consolidationEligibility.map((c) => COVERAGE_MODE_LABEL[c])}
              />
            </Field>
            <Field label="External expert eligibility">
              {capability.externalExpertEligibility}
            </Field>
            <Field label="Succession requirement">{capability.successionRequirement}</Field>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {capability.triggerGates.length > 0 ? (
              capability.triggerGates.map((gate) => <GateChip key={gate} gate={gate} />)
            ) : (
              <span className="text-sm text-muted-foreground">No trigger gate recorded.</span>
            )}
          </div>
        </RecordCard>
      </Section>

      <Section
        id="dependencies"
        title="Dependencies"
        description="Relationships in both directions, listed rather than drawn."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-lg font-semibold">
              This capability depends on or affects
            </h3>
            {outgoing.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No outgoing relationship recorded.
              </p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {outgoing.map((dependency) => (
                  <li key={`${dependency.kind}-${dependency.to}`}>
                    <span className="font-semibold">{DEPENDENCY_KIND_LABEL[dependency.kind]}:</span>{" "}
                    <Link
                      to="/capabilities/$capabilityId"
                      params={{ capabilityId: dependency.to }}
                      search={search}
                      className="underline underline-offset-2"
                    >
                      {dependency.to}
                    </Link>
                    <span className="block text-muted-foreground">{dependency.rationale}</span>
                  </li>
                ))}
              </ul>
            )}
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-lg font-semibold">
              Other capabilities that rely on this one
            </h3>
            {incoming.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No incoming relationship recorded.
              </p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {incoming.map((dependency) => (
                  <li key={`${dependency.kind}-${dependency.from}`}>
                    <Link
                      to="/capabilities/$capabilityId"
                      params={{ capabilityId: dependency.from }}
                      search={search}
                      className="underline underline-offset-2"
                    >
                      {dependency.from}
                    </Link>{" "}
                    <span className="font-semibold">{DEPENDENCY_KIND_LABEL[dependency.kind]}</span>
                    <span className="block text-muted-foreground">{dependency.rationale}</span>
                  </li>
                ))}
              </ul>
            )}
          </RecordCard>
        </div>
      </Section>

      <Section
        id="open"
        title="What is unresolved"
        description="Recorded honestly rather than left blank."
      >
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Known conflicts">
              <ValueList items={capability.knownConflicts} empty="None recorded." />
            </Field>
            <Field label="Assumptions">
              <ValueList items={capability.assumptions} empty="None recorded." />
            </Field>
            <Field label="Unknowns">
              <ValueList items={capability.unknowns} empty="None recorded." />
            </Field>
            <Field label="Related requirements">
              <ValueList items={capability.relatedRequirements} empty="None recorded." />
            </Field>
            <Field label="Related decisions">
              <ValueList items={capability.relatedDecisions} empty="None recorded." />
            </Field>
            <Field label="Related findings">
              <ValueList items={capability.relatedFindings} empty="None recorded." />
            </Field>
            <Field label="Related evidence">
              <ValueList items={capability.relatedEvidence} empty="None recorded." />
            </Field>
            <Field label="Related standards">
              <ValueList items={capability.relatedStandards} empty="None recorded." />
            </Field>
            <Field label="Review trigger">{capability.reviewTrigger}</Field>
            <Field label="Supersession">{capability.supersession ?? "Not superseded."}</Field>
            <Field label="Next defensible action">{capability.nextDefensibleAction}</Field>
            <Field label="Notes">{capability.notes ?? "None."}</Field>
          </dl>
        </RecordCard>
      </Section>
    </div>
  );
}
