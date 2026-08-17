# Accessibility evidence — machine checks only

Authority class: evidence record. This document records checks that were actually
run by a machine. It records no human, expert, assistive-technology, or district
review, because none has occurred.

## What was run

- Tool: axe-core 4.10.2, executed in headless Chromium against the running
  application at every registered route and every detail route (24 routes).
- Reflow check: 640 CSS pixel viewport, which is the reflow condition equivalent
  to 200% zoom at 1280 pixels. Measured document scroll width against client
  width and confirmed the page cannot be scrolled horizontally.
- Rendering invariants: Vitest suite, one H1 per route, landmark presence,
  boundary statement presence, skip link order, keyboard navigation.

## Recorded result

- axe-core violations across 24 routes: 0.
- Horizontal scroll at the reflow width: none on any route checked.
- Vitest: full suite passing.

## Defects found and corrected during this run

1. Page content sat outside every landmark: the boundary statement was rendered
   above the header. It now renders inside the header landmark.
2. Duplicate landmark name on the Command Center: two sections shared the id
   `standing`. The second is now `foundation-standing`.
3. Wide registry tables could push the page into horizontal scroll. The scroll
   container is now a positioned, focusable, labelled group so keyboard users
   can scroll it and absolutely positioned hidden text stays inside it.

## What this evidence does not establish

- No screen reader was used. No keyboard testing by a human occurred.
- No colour contrast judgement by a human occurred; axe-core contrast rules ran
  automatically and are the only contrast evidence here.
- No conformance claim to ULW-AS-001 v1.3 is made. Automated checks cannot
  establish conformance, and no reviewer has signed anything.
