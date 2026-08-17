# Findings Register

Text mirror of the Findings view. Source of truth: `src/fixtures/registers.ts`.

Open findings recorded in this build include:

1. Layer count language. "Seven foundation layers" is stated while L0–L7 is
   eight labels. Recorded as an ambiguity to resolve in canon, not silently
   corrected in code.
2. Authority of the shell itself. The shell is implemented but holds no
   authority; operators may misread implementation as approval. Mitigated by the
   Authority Ledger and the boundary banner.
3. Accessibility verification gaps. Screen reader behaviour, measured contrast,
   and device-level 200% zoom reflow are Not Run.
4. Capability ownership. Owning function and accountable role are candidates
   only; no role model exists yet.
5. Evidence thinness. Current evidence is limited to automated shell tests; no
   external or human verification exists.

Every finding must name what is affected, what is uncertain, and what would
close it. Findings are never closed by assertion.
