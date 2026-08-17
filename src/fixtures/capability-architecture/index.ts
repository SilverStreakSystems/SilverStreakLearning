import type { EnterpriseCapability } from "@/domain";
import { D01_CAPABILITIES } from "./d01-direction-governance";
import { D02_CAPABILITIES } from "./d02-learning-academics";
import { D03_CAPABILITIES } from "./d03-product-experience";
import { D04_CAPABILITIES } from "./d04-engineering-platform";
import { D05_CAPABILITIES } from "./d05-data-ai";
import { D06_CAPABILITIES } from "./d06-trust-security-privacy";
import { D07_CAPABILITIES } from "./d07-quality-validation";
import { D08_CAPABILITIES } from "./d08-revenue-market";
import { D09_CAPABILITIES } from "./d09-customer-service";
import { D10_CAPABILITIES } from "./d10-finance-legal-operations";
import { D11_CAPABILITIES } from "./d11-people-talent";
import { D12_CAPABILITIES } from "./d12-organizational-learning";

/**
 * Enterprise Capability Architecture v0.1 — candidate registry.
 * Every record is synthetic and carries Research / Candidate authority.
 */
export const ENTERPRISE_CAPABILITIES: EnterpriseCapability[] = [
  ...D01_CAPABILITIES,
  ...D02_CAPABILITIES,
  ...D03_CAPABILITIES,
  ...D04_CAPABILITIES,
  ...D05_CAPABILITIES,
  ...D06_CAPABILITIES,
  ...D07_CAPABILITIES,
  ...D08_CAPABILITIES,
  ...D09_CAPABILITIES,
  ...D10_CAPABILITIES,
  ...D11_CAPABILITIES,
  ...D12_CAPABILITIES,
];

export { CAPABILITY_DEPENDENCIES } from "./dependencies";
export { NORMALIZATION_FINDINGS } from "./normalization";
