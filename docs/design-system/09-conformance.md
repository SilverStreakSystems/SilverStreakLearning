# Definition of visual-system done

Authority: Working direction. Generated from fixtures.

Each check carries a status and the basis for that status. Unverified means
nobody has looked, which is different from met.

| Check | Status | Basis |
| --- | --- | --- |
| CF-01 No hard-coded color drift in route components where semantic tokens should apply. | unverified | Routes use semantic classes, but no automated check enforces this yet. |
| CF-02 No unexplained one-off spacing values. | unverified | Spacing follows Tailwind's 4px scale, which resolves to the micro unit, but no audit has been run. |
| CF-03 Every route has one H1 and a stable page-header pattern. | met | All routes render through PageHeader; the heading test asserts exactly one H1 per route. |
| CF-04 Every interactive state includes hover, focus, disabled, and error where applicable. | not-met | Disabled and error states are not exercised: this workspace has no data entry. |
| CF-05 Every future-state template is labelled by maturity and does not masquerade as implemented capability. | met | Maturity is a declared field, and the template invariant test refuses an implemented claim without an implementing route. |
| CF-06 SVG and PNG assets carry an explicit source and provenance note. | met | Every brand component records provenance; the favicon is recorded as a template default, not an SSLS asset. |
| CF-07 Operational pages remain product first; constellation imagery accents rather than overwhelms. | met | Brand marks appear in the shell header and the brand asset view only. |
| CF-08 Responsive validation matrix recorded at the nine required viewports. | not-met | No validation run has been executed; all nine entries are recorded as not run. |
| CF-09 Contrast measured against the 4.5 to 1 and 3 to 1 minimums. | unverified | Tokens were selected for contrast, but no measurement has been recorded. |

## Why there is no score

A single completeness percentage would merge declared maturity, implementation
evidence, and validation results into one figure that cannot be examined or
challenged. Read the status column instead.
