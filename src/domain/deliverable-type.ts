import type { AuthorityClass, RecordState, VerificationState } from "./authority";

/**
 * Deliverable types are the *artifact shapes* a capability must produce to be
 * considered real. A deliverable type is never itself a capability, and
 * producing one never grants authority: authority still comes from a stored
 * declaration on the record that governs.
 */
export interface DeliverableType {
  id: string;
  name: string;
  definition: string;
  /** What question a reader can answer once this deliverable exists. */
  answersQuestion: string;
  requiredElements: string[];
  /** The authority class a deliverable of this type carries by default. */
  defaultAuthority: AuthorityClass;
  /** Whether a deliverable of this type may ever justify implementation. */
  canJustifyImplementation: boolean;
  reviewExpectation: string;
  supersessionRule: string;
  recordState: RecordState;
  existsToday: VerificationState;
  synthetic: boolean;
}
