import { createFileRoute } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { StateChip } from "@/components/governance/state-chip";
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import { CAPABILITIES } from "@/fixtures";
import { RECORD_STATE_LABEL } from "@/domain";

export const Route = createFileRoute("/capabilities")({
  head: () => ({
    meta: [
      { title: "Capability Registry (Candidate) | SSLS Foundation Shell" },
      {
        name: "description",
        content:
          "A first slice of candidate SSLS enterprise capabilities with purpose, beneficiary, independence, evidence expectations, and risk if absent.",
      },
      { property: "og:title", content: "Capability Registry (Candidate) | SSLS Foundation Shell" },
      {
        property: "og:description",
        content: "Candidate capability records. Not an approved enterprise capability registry.",
      },
    ],
  }),
  component: CapabilityRegistry;
});

function CapabilityRegistry() {
  return <div />;
}
