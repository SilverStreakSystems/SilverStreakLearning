# Token architecture

Authority: Working direction. Generated from fixtures.

Every visual value lives in `src/styles.css`. Components consume tokens and
never carry their own hex codes or one-off pixel values.

| Token                   | Group        | Value                           | Use                                                               |
| ----------------------- | ------------ | ------------------------------- | ----------------------------------------------------------------- |
| --ssls-midnight         | Brand color  | #07132E                         | Primary authority and identity color                              |
| --ssls-deep             | Brand color  | #050B18                         | Deepest dimensional background                                    |
| --ssls-silver-blue      | Brand color  | #B9DFF2                         | Monogram and structural light                                     |
| --ssls-ice-blue         | Brand color  | #D8F1FA                         | Light field and reverse secondary text                            |
| --ssls-signal-blue      | Brand color  | #3BA8E6                         | Interactive signal                                                |
| --ssls-signal-cyan      | Brand color  | #22C9C0                         | Action and trajectory signal                                      |
| --ssls-neutral-ink      | Brand color  | #2A3656                         | Light-mode secondary text                                         |
| --ssls-progress-green   | Brand color  | #86D04B                         | Progression, only where semantics support it                      |
| --ssls-attention-yellow | Brand color  | #F3D049                         | Attention, only where semantics support it                        |
| --status-success        | Status color | #22C55E                         | Success. Pair with label and shape. Never substitute signal cyan. |
| --status-warning        | Status color | #F59E0B                         | Caution or due soon, not generic emphasis                         |
| --status-danger         | Status color | #EF4444                         | Errors, destructive actions, blocking conditions                  |
| --status-information    | Status color | #3B82F6                         | Informational state independent of brand signal                   |
| --status-unknown        | Status color | #5B6885                         | Explicit unknown. Never implies approval.                         |
| --space-1               | Spacing      | 4px                             | Micro unit. Icon inset, optical offset.                           |
| --space-2               | Spacing      | 8px                             | Tight inline gap                                                  |
| --space-3               | Spacing      | 12px                            | Compact padding                                                   |
| --space-4               | Spacing      | 16px                            | Default control gap, mobile gutter                                |
| --space-6               | Spacing      | 24px                            | Desktop gutter, standard card padding                             |
| --space-8               | Spacing      | 32px                            | Section internal spacing                                          |
| --space-12              | Spacing      | 48px                            | Major component separation                                        |
| --space-16              | Spacing      | 64px                            | Section separation, shell band height                             |
| --space-24              | Spacing      | 96px                            | Hero or major region spacing                                      |
| --space-32              | Spacing      | 128px                           | Large structural interval                                         |
| --page-gutter           | Layout       | clamp(12px, 2vw, 32px)          | Viewport edge to content                                          |
| --section-gap           | Layout       | clamp(32px, 4vw, 64px)          | Major vertical regions                                            |
| --card-padding          | Layout       | clamp(16px, 1.5vw, 24px)        | Standard content cards                                            |
| --panel-gap             | Layout       | clamp(16px, 2vw, 32px)          | Dashboard columns                                                 |
| --sidebar-width         | Layout       | clamp(240px, 18vw, 288px)       | Desktop primary navigation                                        |
| --context-rail-width    | Layout       | clamp(280px, 24vw, 360px)       | Optional right context rail                                       |
| --content-max           | Layout       | 1360px                          | Wide desktop work surface ceiling                                 |
| --prose-measure         | Layout       | 72ch                            | Reading width for operational prose                               |
| --text-h1               | Type         | clamp(30px, 1.8vw + 20px, 40px) | Page H1                                                           |
| --text-body             | Type         | 16px                            | Body minimum for primary reading                                  |
| --radius-brand-sm       | Radius       | 6px                             | Tooltip and small surfaces                                        |
| --radius-brand-md       | Radius       | 8px                             | Controls and inputs                                               |
| --radius-brand-lg       | Radius       | 12px                            | Cards                                                             |
| --radius-brand-xl       | Radius       | 16px                            | Modals and drawers                                                |
| --motion-fast           | Motion       | 120ms                           | Hover and small focus-adjacent change                             |
| --motion-base           | Motion       | 200ms                           | Disclosure and selection                                          |
| --motion-slow           | Motion       | 320ms                           | Drawer and dialog transition                                      |
| --focus-width           | Focus        | 2px                             | Minimum focus outline width                                       |
| --focus-offset          | Focus        | 2px                             | Focus outline offset                                              |
| --control-min-h         | Control      | 44px                            | Minimum effective target                                          |
| --control-comfort-h     | Control      | 48px                            | Comfortable control height                                        |

## Gradient rule

The extended gradient is a signal layer, not a page fill. Permitted: thin
progress and signal treatments. Refused: full-page gradient fills, gradient
hero wallpaper, gradient text on operational surfaces.

## Motion

| Token         | Duration | Easing      | Use                                                   |
| ------------- | -------- | ----------- | ----------------------------------------------------- |
| --motion-fast | 120ms    | ease-out    | Hover, small focus-adjacent change                    |
| --motion-base | 200ms    | ease-out    | Disclosure, selection, short panel transition         |
| --motion-slow | 320ms    | ease-in-out | Drawer or dialog transition, larger structural change |

Motion refusals:

- No continuous decorative animation.
- No bouncing controls.
- No infinite twinkling star field.
- Trajectory reveal may occur once on orientation surfaces and must not run under prefers-reduced-motion.
- Large spatial shifts are not animated, because they impede orientation.
