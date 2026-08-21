# Battleship coordinate grid

Authority: Working direction. Generated from fixtures.

Twelve columns labelled A to L, twelve conceptual rows. Placement is stated as
a coordinate range so it can be reviewed without ambiguity.

## Viewport bands

| Band             | Columns | Outer gutter | Column gap | Max content       | Shell                                           | Content                                                   |
| ---------------- | ------- | ------------ | ---------- | ----------------- | ----------------------------------------------- | --------------------------------------------------------- |
| 320 to 479px     | 4       | 12 to 16px   | 12px       | 100%              | Compact nav or drawer; global utilities reduced | Single column; context rails become drawers or accordions |
| 480 to 767px     | 4       | 16px         | 16px       | 100%              | Compact mobile shell                            | Single column with selective two-up controls              |
| 768 to 1023px    | 8       | 16 to 24px   | 16 to 20px | 100%              | Tablet shell; collapsible primary rail          | Eight-column grid; secondary rail collapses               |
| 1024 to 1279px   | 12      | 24px         | 20 to 24px | 100% up to 1180px | Compact desktop shell; sidebar 240px            | Twelve-column grid                                        |
| 1280 to 1439px   | 12      | 24px         | 24px       | 1280px            | Standard enterprise shell; sidebar 256 to 280px | Twelve-column grid                                        |
| 1440 to 1919px   | 12      | 32px         | 24 to 32px | 1360px            | Centered wide shell                             | Do not endlessly stretch content                          |
| 1920px and wider | 12      | 32 to 48px   | 32px       | 1440px            | Centered wide shell                             | Keep the work surface centered                            |

## Coordinate contracts

| Region                  | Desktop | Tablet | Mobile                 |
| ----------------------- | ------- | ------ | ---------------------- |
| Page identity           | A1-C2   | A1-C2  | A1-D1                  |
| Primary actions         | J1-L2   | G1-H2  | A2-D2                  |
| Context or status strip | D1-I2   | C1-F2  | A3-D3                  |
| Primary work surface    | A3-I12  | A3-F12 | A4-D12                 |
| Context rail            | J3-L12  | G3-H12 | Collapsed drawer       |
| Persistent subnav       | A3-L3   | A2-H2  | Scrollable row or menu |

Prose values mark regions that leave the grid, for example a collapsed mobile
drawer.

## Component geometry

| Component          | Height or size              | Minimum target  | Radius     | Padding               | Notes                                              |
| ------------------ | --------------------------- | --------------- | ---------- | --------------------- | -------------------------------------------------- |
| Primary button     | 44 to 48px                  | 44px            | 8 to 10px  | 12 to 16px horizontal | One primary action per region where possible       |
| Secondary button   | 44 to 48px                  | 44px            | 8 to 10px  | 12 to 16px horizontal | Border or light-surface treatment                  |
| Icon button        | 44 by 44px                  | 44px            | 8px        | Icon centered         | Accessible name required when no visible label     |
| Text input         | 44 to 48px                  | 44px            | 8px        | 12 to 14px horizontal | Label above; helper and error below                |
| Select or combobox | 44 to 48px                  | 44px            | 8px        | 12 to 14px            | Full keyboard semantics                            |
| Checkbox or radio  | 20 to 24px visual           | 44px            | 4px to 50% | 44px hit area         | Do not shrink the hit target to the visual control |
| Card               | auto                        | Not interactive | 12px       | 16 to 24px            | Border over shadow by default                      |
| Modal              | min 320px, max 720px common | Not interactive | 16px       | 24 to 32px            | Only when interruption is justified                |
| Drawer             | 320 to 480px desktop        | Not interactive | 0 to 16px  | 20 to 24px            | Mobile may use a full-width sheet                  |
| Table row          | 44 to 56px                  | 44px            | 0          | 8 to 12px cell        | Compact 44px only for expert operational tables    |
| Status chip        | 28 to 32px                  | Not interactive | 999px      | 8 to 10px             | Status only; do not pill-ify the interface         |
| Tooltip            | auto                        | Not interactive | 6px        | 8 to 10px             | Short explanatory copy only                        |

## Page blueprints

### Command Center (BP-COMMAND-CENTER)

Desktop, twelve column. Show what needs attention before showing anything else.

| Region                       | Coordinates | Measure             | Behavior                                                     |
| ---------------------------- | ----------- | ------------------- | ------------------------------------------------------------ |
| Identity and title           | A1-F2       | Minimum height 96px | Workspace name, current scope, short state sentence. One H1. |
| Global and primary actions   | J1-L2       | Minimum height 96px | At most one primary and two secondary actions.               |
| Critical attention           | A3-L4       | 112 to 160px        | Three to five high-value blockers or stop lines. No more.    |
| State summary                | A5-H7       | 200 to 280px        | Indicators must support an action or a decision.             |
| Context rail                 | I5-L10      | 320 to 480px        | Collapses under the main content on tablet and mobile.       |
| Primary work queue           | A8-H12      | 320px and taller    | Keyboard navigable and sortable.                             |
| Boundary and evidence footer | I11-L12     | 96 to 160px         | Plain-language boundary, freshness, unresolved unknowns.     |

### Registry (BP-REGISTRY)

Desktop, twelve column. Find and compare governed objects without losing filter state.

| Region                      | Coordinates | Measure                                            | Behavior                                                                               |
| --------------------------- | ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Page title and description  | A1-H2       | H1 36 to 40px; body maximum 72 characters per line | One H1 per page.                                                                       |
| Primary action              | J1-L2       | 44 to 48px control                                 | Single primary action.                                                                 |
| Search                      | A3-E3       | 44 to 48px height                                  | Labelled input.                                                                        |
| Filters                     | F3-J3       | 44 to 48px controls                                | Filter state is addressable in the URL.                                                |
| View and sort               | K3-L3       | 44px controls                                      | Accessible names on icon controls.                                                     |
| Result count and saved view | A4-L4       | 32 to 40px                                         | Announce result count changes.                                                         |
| Table or list               | A5-L12      | Rows 44 to 56px                                    | Sticky header when longer than one viewport; horizontal scroll rather than truncation. |

### Record Detail (BP-RECORD-DETAIL)

Desktop, twelve column. Inspect one object together with its provenance and access basis.

| Region                | Coordinates | Measure                                                      | Behavior                                               |
| --------------------- | ----------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Object identity       | A1-H2       | Type eyebrow 12px; H1 32 to 40px; identifier 12 to 13px mono | Identifier is selectable text.                         |
| Status and actions    | I1-L2       | Status plus at most three actions                            | Status carries a label and a shape, never color alone. |
| Summary facts         | A3-H5       | Two to four column key-value grid                            | Definition list semantics.                             |
| Context rail          | I3-L9       | 280 to 360px rail                                            | Collapses below the body on tablet.                    |
| Tabs or section nav   | A6-H6       | 44px minimum target                                          | Each section is addressable.                           |
| Detail body           | A7-H12      | Prose maximum 72 characters per line                         | Left aligned; never justified.                         |
| Provenance and access | I10-L12     | Source, freshness, visibility                                | Answers why this record is visible.                    |

### Educator Home (BP-EDUCATOR-HOME)

Desktop, twelve column. Put today's instructional work above everything else.

| Region                        | Coordinates | Measure                   | Behavior                 |
| ----------------------------- | ----------- | ------------------------- | ------------------------ |
| Today and immediate work      | A1-H4       | Up to five items          | Priority one.            |
| Courses and groups            | A5-H8       | Cards or compact list     | Priority two.            |
| Learners requiring attention  | I1-L6       | Purpose-limited summaries | No composite risk score. |
| Upcoming events and deadlines | I7-L10      | Compact list              | Priority four.           |
| Resources and recent updates  | A9-L12      | Full width                | Priority five.           |

### Student Home (BP-STUDENT-HOME)

Desktop, twelve column; guided density. Answer one question per region in plain language.

| Region               | Coordinates | Measure                   | Behavior                                 |
| -------------------- | ----------- | ------------------------- | ---------------------------------------- |
| What am I learning   | A1-H3       | Guided density            | Plain language heading.                  |
| What is due          | A4-H7       | 48 to 56px action targets | At most two cards before the first task. |
| My goals             | I1-L5       | Supportive rail           | Strengths before deficits.               |
| Feedback I received  | I6-L9       | Supportive rail           | Named source and date.                   |
| Where I can get help | A8-L12      | Full width                | Always reachable; never a dead end.      |
