# Portfolio Growth Ladder & Capital Vault

## Interface Restructure and Implementation Specification

**Purpose:** Restructure the existing Portfolio Growth Ladder & Capital
Vault website into a simpler, more intuitive application with five
primary sections. This document is the complete specification;
implementation must not depend on a separate image reference.

> **Critical direction:** Simplify the information architecture and
> interaction flow while preserving the existing website's visual
> identity, accounting logic, stored data, and integrations. This is a
> restructure of the current application, not a redesign from scratch.

------------------------------------------------------------------------

## 1. Project Goals

The current interface has too many buttons and input fields for users to
accomplish common tasks. Reorganize it so the same core tasks take fewer
steps and the most important information is easy to find.

The redesigned application should:

-   Make daily portfolio tracking the main, low-friction workflow.
-   Organize functionality into five clearly named primary sections.
-   Remove duplicate controls and repeated data entry.
-   Show essential information first and keep secondary details
    accessible.
-   Preserve the existing visual theme and all working functionality.
-   Keep trading capital, savings, and bill obligations distinct.
-   Preserve existing data and integrations.
-   Remain responsive across desktop, tablet, and mobile.

Do not add features just to make the interface look more complete. Do
not remove useful existing features merely because they are not
prominent in the new layout.

## 2. Existing Application: Inspect Before Editing

Before changing code, inspect the current application and establish how
it works.

The existing project has been described as a single `index.html` using
vanilla JavaScript and Tailwind CSS via CDN, with versioned localStorage
keys (including `_v10`) and optional Firebase/Firestore synchronization
and Google Sheets integration. Verify these details in the actual code
before relying on them.

Identify and document:

-   The current design tokens and styling conventions.
-   Existing navigation and page/section structure.
-   Reusable UI components and interaction patterns.
-   State management and data models.
-   localStorage keys, versioning, and persistence behavior.
-   Financial formulas and calculation dependencies.
-   Firebase/Firestore behavior, if configured.
-   Google Sheets behavior, if configured.
-   Existing import/export, synchronization, validation, and recovery
    behavior.
-   Existing features that must be retained even if they are moved or
    made less prominent.

Map each existing feature to one of the five sections below before
implementing changes. Avoid a wholesale rewrite unless there is a clear
technical need.

------------------------------------------------------------------------

## 3. Visual Design: Preserve the Existing Style

**The existing website is the source of truth for visual style.**

There will be no image reference supplied to the coding AI. Use this
written specification to build the layout, and inspect the actual
existing website and code to understand its visual identity.

Preserve the website's established:

-   Color palette and color relationships.
-   Typography, font choices, and type hierarchy.
-   Backgrounds, textures, and surface treatments.
-   Existing cards, boxes, borders, radii, shadows, and spacing
    conventions.
-   Button, input, dropdown, and toggle styles.
-   Icon style.
-   Animation and transition language.
-   Hover, focus, pressed, loading, and disabled states.
-   Existing component behavior and interaction feel.

Do **not** introduce a new palette or copy a generic finance-dashboard
aesthetic. In particular, do not introduce olive, bronze, gold, or other
colors merely because they are common in dashboard designs. Use them
only if they already belong to the existing site's design system.

Do not change the user's existing box or button behavior just to
simplify the layout. Reorganize the controls and reduce their number on
screen; preserve their established functionality and interaction
behavior.

The desired result should feel like a cleaner, more considered version
of the same product---not a new product with a different identity.

### Layout direction

Use a clear dashboard structure with:

-   A consistent primary navigation for the five sections.
-   A clear page title and a concise description or context where
    useful.
-   One visually prominent primary action per workflow.
-   Important summary information grouped near the relevant action.
-   Secondary details in compact, discoverable areas.
-   Consistent spacing and alignment based on the existing design
    system.
-   Responsive behavior that keeps the primary action easy to find on
    small screens.

Do not fill the screen with every possible metric, control, or field at
once.

------------------------------------------------------------------------

## 4. Primary Navigation and Information Architecture

Organize the application into these five primary sections:

1.  **Setup**
2.  **Daily Tracker**
3.  **Trading Sessions**
4.  **Capital Vault**
5.  **Stats & Performance**

The five sections should be easy to access through a consistent
navigation system. Reuse the existing navigation style if it can support
the new organization.

Avoid unnecessary nested menus, duplicate destinations, and extra
navigation layers. Do not create a separate page for every small action
when an inline form, compact panel, or existing modal pattern would work
better.

Where possible, keep the user in the section where the task naturally
belongs.

------------------------------------------------------------------------

## 5. Section One: Setup

### Purpose

Provide one clear place to configure the trading challenge and its
related financial targets.

### Fields and actions

-   Starting trading balance.
-   Target trading balance.
-   Start date.
-   Challenge duration or deadline.
-   Optional savings target.
-   Optional bills, amounts, and due dates.
-   Activate challenge.

### Behavior

-   Keep the essential challenge fields visually prominent.
-   Keep optional financial details available without overwhelming the
    main setup workflow.
-   Avoid asking the user to enter the same value in multiple sections.
-   Once activated, use the setup values to populate the relevant parts
    of the application.
-   Allow setup details to be edited later without silently resetting
    progress or overwriting historical records.
-   Validate required fields and dates using the existing application's
    conventions.
-   Make the activation action clear and avoid accidental activation
    from unrelated controls.

Do not add mock values to the live application. Use actual existing data
where available and show an appropriate empty state for genuinely
missing data.

------------------------------------------------------------------------

## 6. Section Two: Daily Tracker

### Purpose

This is the primary day-to-day working screen. Recording a closing
portfolio balance should be the most obvious and straightforward action
in the application.

### Primary workflow

The user should be able to enter the day's closing balance, save it, and
immediately understand the resulting progress without navigating through
multiple screens.

### Information to show

Prioritize the following:

-   Current authoritative portfolio balance.
-   Closing-balance entry and save action.
-   Session profit or loss, where supported by existing records.
-   Overall profit or loss.
-   Progress toward the trading target.
-   Actual progress compared with the Relaxed, Mid, and Aggressive
    growth paces.
-   Whether the user is ahead of pace, on pace, or behind.
-   Progress calendar.
-   Upcoming milestones and relevant deadlines.
-   Recent ledger entries or recent balance records.

Keep historical details accessible, but do not let them overwhelm the
main daily entry workflow.

### Behavior and calculation rules

-   The recorded closing portfolio balance is authoritative.
-   Do not add journal profit and loss to the portfolio balance a second
    time.
-   Do not deduct a withdrawal a second time if it is already reflected
    in the closing balance.
-   Clearly distinguish actual recorded sessions from estimated
    calendar-based planning.
-   Calendar dates determine deadlines; actual recorded sessions
    determine trading progress.
-   The planning model may estimate five trading sessions per seven
    calendar days, but must never fabricate actual sessions.
-   Preserve the existing growth plan and its calculation rules.
-   If the user falls behind, create a separate recovery plan rather
    than silently replacing the original plan.
-   When the user catches up, mark the recovery item **"Shortfall
    Averted,"** remove it from the active view, and retain its history.

### Empty and error states

Make it clear what the user should do when no daily balance has been
recorded yet. Show validation or save errors without clearing the user's
entered value.

------------------------------------------------------------------------

## 7. Section Three: Trading Sessions

### Purpose

Provide a focused place to record and review individual trades without
mixing trade journaling with daily portfolio balance records.

### Supported information

Retain existing support for:

-   Trade name or identifier.
-   Generic trade labels such as Trade A, Trade B, and Trade C.
-   Entry amount or price.
-   Exit amount or price.
-   Fees.
-   Open, partial, and closed statuses.
-   Realized profit or loss.
-   Relevant trade statistics.
-   Historical trade records and notes, if currently supported.

Verify the existing data model and field meanings before changing or
relabeling them. Do not assume an entry field is a dollar amount if the
current implementation treats it as a token price, quantity, or another
value.

### Interaction design

-   Keep the common trade-entry workflow compact.
-   Show essential fields first.
-   Make optional or less frequently used fields available when needed.
-   Avoid repeating fields already captured elsewhere.
-   Keep the trade list readable and make statuses easy to distinguish
    using existing component styles.
-   Allow users to review existing trades without forcing them to open
    every record.

### Accounting boundary

Trade-journal PnL is a record of trading activity. It must not be added
again to the authoritative daily closing portfolio balance. Preserve
existing formulas and ensure that realized PnL, fees, and partial exits
are not counted twice.

------------------------------------------------------------------------

## 8. Section Four: Capital Vault

### Purpose

Give the user one place to manage bills, savings, and recorded capital
movements while keeping those categories logically separate from trading
performance.

### A. Bills

Retain fields and behaviors for:

-   Bill name.
-   Amount due.
-   Due date.
-   Paid or unpaid status.
-   Remaining amount due, where supported.
-   Relevant payment history or notes, if currently supported.

Make upcoming and overdue obligations easy to identify without making
the entire screen feel urgent or cluttered.

### B. Savings

Retain fields and behaviors for:

-   Current savings balance.
-   Savings target.
-   Deposits.
-   Withdrawals, where applicable.
-   Relevant history.

### C. Capital movements

Retain the ability to record withdrawals from trading capital, including
destination, date, and notes where the existing model supports them.

### Interaction design

-   Group bills, savings, and capital movements clearly.
-   Use concise summaries with access to their underlying records.
-   Make the action for adding or recording an item obvious.
-   Avoid duplicating the same bill or transaction in multiple places.
-   Do not create automatic transfers or financial adjustments.

### Accounting boundaries

Trading capital, savings, and money reserved for bills must remain
distinct.

The combined financial objective may include the trading target, savings
target, and remaining unfunded bill requirements. However, this combined
objective must **not** inflate or alter the trading target itself.

All financial movements must be explicitly recorded by the user. Never
automatically transfer money between categories.

If a withdrawal is already reflected in the authoritative closing
portfolio balance, do not deduct it again.

------------------------------------------------------------------------

## 9. Section Five: Stats & Performance

### Purpose

Provide an overview of progress and historical performance without
forcing the user to inspect multiple sections.

### Potential summaries

Use the metrics supported by the existing data model, including:

-   Starting and current portfolio balance.
-   Net profit or loss.
-   Percentage growth.
-   Percentage of trading target completed.
-   Progress over time.
-   Performance relative to Relaxed, Mid, and Aggressive growth paces.
-   Trading-session statistics.
-   Historical milestones.
-   Relevant savings and bill summaries.

### Presentation

-   Prioritize the metrics most useful for understanding progress.
-   Use existing chart, typography, and card styles.
-   Avoid showing every possible statistic simultaneously.
-   Make supporting details discoverable without cluttering the main
    summary.
-   Ensure charts and summaries use the same underlying values as the
    rest of the application.

Do not invent data or introduce new calculations that conflict with
existing financial formulas.

------------------------------------------------------------------------

## 10. Core Financial Logic --- Must Be Preserved

The interface can change; the financial rules must not change
accidentally as a side effect.

### Authoritative balance

The recorded daily closing portfolio balance is the authoritative
portfolio balance.

### No double counting

-   Do not add trade-journal PnL to the closing portfolio balance a
    second time.
-   Do not deduct a withdrawal twice if it is already reflected in the
    closing balance.
-   Do not count the same deposit, fee, or transaction in multiple
    categories in a way that duplicates its financial effect.
-   Preserve the current meaning of all existing calculations unless a
    confirmed bug is found. If a bug is found, document it separately
    rather than silently changing the accounting model during the layout
    restructure.

### Separate objectives

-   The trading target remains independent of bills and savings.
-   A combined financial objective may summarize the trading target,
    savings target, and remaining unfunded bill needs.
-   The combined objective must never change the trading target itself.
-   Keep trading capital, savings, and bill obligations separately
    identifiable.

### Calendar and session logic

-   Calendar dates determine bill due dates and challenge deadlines.
-   Actual recorded sessions determine actual trading progress.
-   Five sessions per seven calendar days is a planning estimate only;
    it must not create fictional session records.

### Growth and recovery plans

-   Preserve the original growth plan and its history.
-   If the user falls behind, create a separate recovery plan.
-   Do not silently rewrite the original targets or erase the original
    plan.
-   When the user catches up, mark the relevant recovery shortfall as
    **"Shortfall Averted."**
-   Remove averted shortfalls from the active view while retaining them
    in history.

### No automatic financial movements

Never transfer, withdraw, deposit, or reallocate funds automatically.
All movements must be explicitly recorded by the user.

------------------------------------------------------------------------


------------------------------------------------------------------------

## 10.1 Total Financial Goal — Required Calculation Rules

The application must show both the user's individual financial targets and
one combined **Total Financial Goal**. This is a summary across categories;
it must not merge their balances or change the trading target.

### Targets included in the total

The combined target is calculated from:

1. **Trading portfolio target** — the target configured for the active
   trading challenge.
2. **Savings target** — the user's separately configured savings goal.
3. **Bills target for the planning period** — the total bill requirement
   for the relevant month or planning period, based on the bills recorded
   by the user.

Conceptually:

`Total Financial Goal = Trading Target + Savings Target + Bills Target`

Use the actual configured values. Do not use illustrative or demo values
as live defaults.

### Individual category tracking

Keep each category independently visible and calculated:

- **Trading:** Show the current authoritative portfolio balance, trading
  target, remaining amount, and trading-target progress.
- **Savings:** Show the actual savings balance, savings target, amount
  remaining to target when below target, and surplus when above target.
- **Bills:** Show the bill requirement for the relevant period, amounts
  paid or covered, and outstanding amount.

A category reaching its target must not silently change another
category's target. The user may deliberately edit a target, but the
application must not do so automatically.

### Overall progress and remaining amount

Show an overall progress summary alongside the category-level figures.
Calculate it from the amount achieved or covered in each category relative
to that category's target, using one consistent method throughout the
application.

For a straightforward target-based calculation:

- Trading contribution achieved is capped at the trading target for
  overall-goal progress; trading growth beyond the target may be shown
  separately as surplus or additional growth.
- Savings contribution achieved is capped at the savings target for
  overall-goal progress; savings above the target remains savings surplus
  and does not silently increase the configured target.
- Bill contribution achieved is the amount paid or otherwise explicitly
  recorded as covered toward the relevant period's bill requirement,
  capped at that period's bills target for progress reporting.
- Overall amount remaining is the sum of the remaining amounts across
  those three categories.

Do not simply add all account balances and label the result as progress.
The trading balance, savings balance, and bill payments represent
different categories and must be accounted for separately. Do not count
the same money or transaction twice.

For the combined percentage, use:

`Overall Progress = Total Achieved Toward Targets / Total Financial Goal × 100`

Use the same category rules above to calculate `Total Achieved Toward
Targets`. If a category's target is zero or unset, handle it safely and
make its exclusion from the calculation clear; do not divide by zero or
invent a target.

### Bills target and paid bills

The bills target represents the user's planned bill requirement for the
relevant period. The application must distinguish:

- the total bill requirement for the period;
- how much has been paid or explicitly marked as covered; and
- how much remains outstanding.

Paying a bill reduces the outstanding bill requirement and increases the
amount covered toward the bills target. It does not change the trading
target or savings target. Avoid counting a paid bill both as a current
outstanding obligation and as a separate additional goal.

Where the current data model distinguishes bills created for a month from
bills paid in that month, preserve that distinction. Make the active
planning period clear in the interface and calculations.

### Savings is a separate account and target

Savings is an independent account with its own target and transaction
history.

- If the savings balance is below its target, show the deficit.
- If it equals the target, show that the target has been reached.
- If it is above the target, show the surplus.
- A surplus remains in savings unless the user decides what to do with it.
- The user may manually increase or change the savings target.
- An emergency withdrawal reduces the recorded savings balance and
  recalculates its deficit or surplus.
- A savings deficit is informational. It must not automatically withdraw
  money from trading capital or create an automatic transfer.
- Record deposits and withdrawals explicitly and preserve their history.

### User-directed allocation and default focus

The application calculates progress and identifies what remains to be
covered; it does not make allocation decisions.

- Never automatically transfer money between trading, savings, or bills.
- Never assume a bill is paid or savings is funded without an explicit
  user-recorded transaction or status update.
- Once the user's desired bills requirements for the month and savings
  target requirements for the month are covered, the default plan should
  focus on growing the trading portfolio.
- If the user chooses to allocate money differently, let them record that
  decision explicitly.
- A savings surplus does not automatically get redirected to bills or
  trading. A bill shortfall or savings deficit does not automatically
  reduce trading capital.
- Keep the total financial goal as a planning summary, not an instruction
  to move money.

### Display requirements

Show, in a compact overview:

- Total Financial Goal.
- Total achieved toward the combined goal.
- Overall progress percentage.
- Total remaining across the three categories.
- Individual trading, savings, and bills progress.
- Savings deficit or surplus, where applicable.
- Bills paid/covered and bills still outstanding for the active period.

The overview must agree with the values shown in Setup, Daily Tracker,
and Capital Vault. If category values change, recalculate the combined
summary from the same authoritative records rather than storing a
potentially stale duplicate total.

### Acceptance checks

Verify at minimum that:

1. Changing the trading target changes the combined target but does not
   alter savings or bills targets.
2. Changing the savings target changes the combined target and savings
   progress, without moving money.
3. Adding or editing a bill changes the relevant period's bill target
   and combined target according to the app's bill-period rules.
4. Recording a bill payment reduces the outstanding bill amount and
   updates bill progress without double-counting the payment.
5. A savings surplus remains in savings and does not trigger a transfer.
6. A savings deficit is displayed without automatically reducing the
   trading balance.
7. Explicitly recording a savings deposit, withdrawal, or transfer
   updates only the appropriate records and any legitimate source/destination
   balances, exactly once.
8. The combined target, achieved amount, percentage, and remaining amount
   agree with the individual category calculations.
9. A zero or unset target does not cause a division error or misleading
   progress percentage.
10. The existing trading-target calculation and challenge history remain
    unchanged by the combined-goal feature.

------------------------------------------------------------------------

## 11. Data Persistence and Integrations

This is an existing application with existing user data. Treat backward
compatibility as a requirement.

Preserve and verify, where configured:

-   localStorage data and versioned keys, including existing `_v10`
    keys.
-   Firebase/Firestore synchronization.
-   Google Sheets integration.
-   Existing saved challenges, balance records, trades, bills, savings,
    and transaction history.
-   Existing formulas, validation, import/export, and synchronization
    behavior.
-   Existing historical records and recovery-plan history.
-   Other working features not explicitly removed by this specification.

### Migration safety

-   Do not clear localStorage.
-   Do not replace existing data structures without a demonstrated need.
-   Do not rename or discard storage keys casually.
-   Do not perform destructive migrations.
-   If a schema migration is necessary, make it backward-compatible
    where possible, preserve the original data, and provide a safe
    fallback.
-   Do not introduce mock or demo data into the live user's records.
-   Do not overwrite synced data with empty defaults.
-   Do not assume Firebase or Google Sheets is configured; inspect the
    actual project and preserve the behavior that exists.

If the current application uses one HTML file with vanilla JavaScript
and Tailwind CSS, keep that architecture unless there is a compelling
reason to change it. Avoid adding dependencies without a clear need.

------------------------------------------------------------------------

## 12. Usability and Responsive Behavior

Ensure the application works well at desktop, tablet, and mobile widths.

-   Keep navigation understandable and consistent at all sizes.
-   Keep the primary daily balance action easy to reach.
-   Avoid wide tables overflowing small screens.
-   Preserve readable text and clear input labels.
-   Ensure interactive controls have appropriate focus, hover, pressed,
    loading, and disabled states using the existing design conventions.
-   Keep forms short and avoid unnecessary repeated fields.
-   Provide useful empty states and clear validation messages.
-   Do not hide essential information behind excessive clicks.
-   Avoid adding animation that changes the established interaction
    style or makes routine tasks slower.

------------------------------------------------------------------------

## 13. Implementation Plan

Implement the work in two stages.

### Stage 1 --- Restructure the interface

1.  Inspect the current code and document the existing features, data
    structures, financial formulas, visual system, and integrations.
2.  Map current features to the five sections.
3.  Identify repeated controls and duplicate data entry.
4.  Reorganize the interface into Setup, Daily Tracker, Trading
    Sessions, Capital Vault, and Stats & Performance.
5.  Reuse existing components and styles wherever practical.
6.  Simplify the common workflows while retaining less common existing
    functionality.
7.  Keep the financial calculations and persistence behavior unchanged.

### Stage 2 --- Verify and refine

1.  Test each section and all navigation.
2.  Test creating, editing, saving, and reloading records.
3.  Verify that the existing theme and animations remain consistent.
4.  Test financial calculations and edge cases.
5.  Test integrations that are configured in the current application.
6.  Fix regressions before declaring the work complete.

Do not perform a full rewrite simply because it is easier than
understanding the existing implementation.

------------------------------------------------------------------------

## 14. Required Validation Checklist

Before declaring the work complete, verify each applicable item.

### Interface

-   [ ] All five primary sections are present and functional.
-   [ ] Navigation works correctly.
-   [ ] Existing visual identity is preserved.
-   [ ] Existing component behavior and animations still work.
-   [ ] The layout is responsive on desktop, tablet, and mobile.
-   [ ] Common tasks require fewer steps and less repeated data entry.
-   [ ] Secondary functionality remains accessible.

### Data and persistence

-   [ ] Existing user data remains available.
-   [ ] Saving and reloading records works.
-   [ ] Existing storage keys and versioning are handled safely.
-   [ ] No mock data has been introduced into live records.
-   [ ] Existing integrations continue to work where configured.

### Accounting

-   [ ] Daily closing balance remains authoritative.
-   [ ] Trade-journal PnL is not double-counted.
-   [ ] Withdrawals are not deducted twice.
-   [ ] Deposits, fees, and transactions are not duplicated.
-   [ ] Trading targets remain independent of bills and savings.
-   [ ] Combined financial objectives do not inflate trading targets.
-   [ ] Actual sessions are not fabricated from calendar estimates.
-   [ ] Original growth plans remain intact.
-   [ ] Recovery plans remain separate from original plans.
-   [ ] "Shortfall Averted" records are removed from the active view but
    retained in history.
-   [ ] No financial movement occurs automatically.

### Edge cases to test

-   [ ] No daily balance has been entered yet.
-   [ ] A closing balance is lower than the previous balance.
-   [ ] A withdrawal is recorded and also reflected in the closing
    balance.
-   [ ] A trade is open, partially closed, and fully closed.
-   [ ] Fees are present.
-   [ ] A bill is overdue, paid, or partially funded, as supported.
-   [ ] A user edits challenge settings after recording progress.
-   [ ] A user falls behind and later catches up.
-   [ ] Data synchronization is unavailable or fails.
-   [ ] A saved record is reloaded after a page refresh.

Record any tests that cannot be completed because of missing
credentials, unavailable integrations, or environment limitations. Do
not claim that an integration was tested if it was not.

------------------------------------------------------------------------

## 15. Final Direction

Build a simpler information architecture with five clear sections and a
prominent daily tracking workflow.

**Preserve the existing style. Simplify navigation and interaction---not
the visual personality, financial rules, saved data, or working
functionality.**

The finished application should feel familiar to an existing user, be
easier to operate, and remain reliable with the current data and
integrations.

Before finishing, summarize:

1.  What changed in the interface.
2.  Which existing features were retained and where they now live.
3.  What was done to protect existing data.
4.  Which accounting scenarios and integrations were tested.
5.  Any outstanding issues or tests that could not be completed.


---

# 16. Section-by-Section Layout and Control Placement Specification

This section removes ambiguity about where content and controls belong. Follow the hierarchy below unless the existing application has a technical or usability constraint that requires a small adjustment. If a change is necessary, preserve the same priority order and explain the deviation in the completion summary.

**Important:** These are layout and information-hierarchy instructions, not new visual styling instructions. Use the existing website's colors, typography, components, button styles, animation behavior, spacing conventions, and surface treatments.

## 16.1 Global application shell

### Desktop

Use a consistent application shell on all five sections:

1. **Primary navigation:** Place the five section links in one persistent navigation area. Reuse the current site's navigation pattern if practical. Clearly indicate the active section using the existing active-state styling.
2. **Page content:** Place the current section's title and main content in a consistent content area beside or below the navigation, following the existing app's layout conventions.
3. **Page heading:** At the top of each section, show its title first, then a short explanatory line only if it adds useful context.
4. **Primary action:** Place the main action close to the content it affects. Do not make users scroll to a distant toolbar to save a record.
5. **Secondary actions:** Put edit, export, history, delete, and other less frequent actions beside the relevant record or inside an existing overflow/menu pattern. Do not give all actions equal visual prominence.
6. **Feedback:** Display success, validation, loading, and error feedback near the form or action that caused it.
7. **Content order:** Show essential current information and the primary task first; supporting summaries next; historical detail and advanced controls later.

Do not add a second navigation system if the existing one already serves this purpose.

### Mobile and narrow layouts

- Keep the same five destinations and active-state clarity.
- Use the existing responsive navigation pattern; if it cannot fit, collapse it using a familiar, accessible pattern.
- Stack content cards vertically in the same priority order as desktop.
- Make primary actions easy to reach and tap.
- Prevent tables, forms, and metric cards from overflowing the viewport.
- Keep form labels visible and associated with their fields.
- Avoid placing destructive actions next to primary actions without separation.
- Do not remove important functionality on mobile; rearrange it.

### Global action hierarchy

Use these action priorities consistently:

- **Primary:** The main action that completes the current workflow, such as Activate Challenge, Save Closing Balance, Save Trade, or Record Transaction.
- **Secondary:** Supporting actions such as Edit Settings, View History, Add Note, or Export.
- **Destructive:** Delete, reset, clear, or remove actions. Keep these visually and spatially distinct, use confirmation where appropriate, and never use them for routine navigation.

Do not add duplicate save buttons that perform the same action. Avoid global floating action buttons unless the existing application already uses them successfully.

---

## 16.2 Setup — detailed layout

### Recommended content order

**A. Page heading**
- Title: `Setup`
- Brief helper text explaining that this section configures the challenge and related optional targets.

**B. Challenge configuration — first and most prominent group**
Arrange these fields together in this order:
1. Starting trading balance
2. Target trading balance
3. Start date
4. Challenge duration or deadline

Keep labels directly associated with their inputs. On wider screens, related fields may share a row if the existing design supports it; on narrow screens, stack them vertically. Do not squeeze fields into columns that make labels or values hard to read.

**C. Optional financial planning — second group**
- Savings target.
- Bills list, including each bill's name, amount, and due date.
- An `Add Bill` action placed beside the Bills heading or at the end of the bill list.
- Each bill's edit/remove controls should be attached to that bill's row/card, not placed in a separate unrelated toolbar.

Keep optional planning visually subordinate to the core challenge configuration. Use the site's existing collapsible/expandable pattern only if one already exists or if it materially reduces clutter without hiding essential information.

**D. Activation and edit actions**
- Place `Activate Challenge` at the end of the required setup workflow, after the fields it depends on.
- Make it the primary action while the challenge is not active.
- If the challenge is already active, do not continue showing an activation action as though it were a fresh setup. Show the appropriate existing state and provide a secondary `Edit Setup` action.
- Editing must not silently erase existing progress. If an edit changes dates or targets that affect historical calculations, follow existing behavior or ask for explicit confirmation where necessary.

**E. Existing setup history or advanced controls**
- Keep infrequent controls, if any, below the main configuration or within the relevant existing secondary-action pattern.
- Preserve existing features such as synchronization or export, but do not place them ahead of the primary setup action.

### Setup interaction rules

- Avoid repeating the starting balance, target, dates, or savings target as editable fields in other sections unless the other section needs a clearly identified, separate value.
- Do not make the user re-enter setup information to activate the challenge.
- Do not prepopulate missing live data with fabricated demo values.

---

## 16.3 Daily Tracker — detailed layout

This is the primary operational screen. It should make the daily balance-entry workflow immediately obvious.

### Recommended content order

**A. Page heading**
- Title: `Daily Tracker`
- A concise status line may show the current challenge period or day/session context if that data already exists.
- Do not add a large motivational banner or unrelated illustration that pushes the main action down the page.

**B. Compact key-metrics row**
Place the most useful current metrics near the top, before secondary history:
- Current portfolio balance.
- Overall profit/loss.
- Target progress or target completion percentage.

A session/day profit or loss figure may appear here only when it can be calculated correctly from existing records. Use a compact card or equivalent existing component; do not create a new visual language just for metrics.

On desktop, related metrics may appear side by side. On mobile, stack or wrap them in a readable order.

**C. Record closing balance — primary action area**
Place this immediately after the key metrics, near the top of the page.

It should contain:
1. A clear heading such as `Record Closing Balance`.
2. One clearly labelled input for the closing portfolio balance.
3. The primary `Save Closing Balance` button adjacent to or directly below that input.
4. Brief validation or save feedback in the same area.

Behavior:
- Do not require users to open a separate screen to record the closing balance.
- Do not show unrelated trade-entry, bill-entry, or savings fields in this form.
- Keep the entered value visible if validation or saving fails.
- Prevent accidental duplicate records according to the existing data model and date/session rules.
- If editing a previously recorded balance is supported, expose that action near the relevant record and preserve the existing confirmation/validation behavior.

**D. Growth pace comparison**
Place a clearly grouped pace comparison below the balance-entry area:
- Relaxed.
- Mid.
- Aggressive.

For each pace, show the target or expected balance for the relevant point in the plan and the actual comparison/status, using the existing calculation model. Make it possible to see whether the user is ahead, on pace, or behind without opening another page.

Do not imply that estimated sessions are actual recorded sessions. Preserve the distinction between calendar-based estimates and real records.

**E. Calendar and milestones**
Place the progress calendar after the key daily workflow and pace comparison.
- Show recorded activity using actual records.
- Make upcoming milestones and relevant deadlines accessible near the calendar or in a compact adjacent panel on wider screens.
- On narrow screens, stack milestones after the calendar or place them in the order most useful to the user.
- Do not generate fictional session markers for days without recorded sessions.

**F. Recent ledger/history**
Place recent balance records and relevant ledger information after the primary workflow, pace comparison, and calendar.
- Show a useful recent subset by default.
- Provide access to older history through the existing pagination, expansion, or history pattern.
- Keep edit actions attached to the relevant record.
- Preserve historical entries and do not hide important accounting information solely to make the page look cleaner.

### Daily Tracker should not contain

- The full trade-entry form.
- The full bills-management form.
- A second, independent portfolio-balance value that can conflict with the authoritative closing balance.
- Duplicate PnL summaries calculated from the same underlying events.
- Multiple buttons that all save the same closing-balance record.

---

## 16.4 Trading Sessions — detailed layout

### Recommended content order

**A. Page heading and main action**
- Title: `Trading Sessions`
- Place a primary `Add Trade` or equivalent existing action near the heading.
- Do not place this action on the Daily Tracker page as a second competing primary workflow.

**B. Compact trading summary**
Where supported by current records, show a small summary of relevant trade statistics, such as realized PnL or counts by status. Keep it below the heading and above the trade list. Do not duplicate the full Stats & Performance dashboard here.

**C. Trade list**
- Make the existing trade records the main content of the page.
- Use the current site's list, card, or table conventions.
- Show the most useful identifying information first: trade label/name, status, and relevant result/summary fields supported by the current model.
- Keep edit/view actions attached to each trade.
- Keep delete or other destructive actions separate from routine actions.
- If filters or status tabs already exist, keep them near the list heading rather than mixing them into the trade-entry form.

**D. Add/edit trade form**
Open the form using the application's existing interaction pattern, such as an inline panel, modal, or dedicated form area. Prefer the least disruptive pattern already used by the site.

Group fields in this order:
1. Trade identifier/name.
2. Entry information.
3. Exit information, when applicable.
4. Fees.
5. Status: open, partial, or closed.
6. Notes or additional existing fields, if supported.
7. Primary `Save Trade` action.
8. Secondary `Cancel` action, visually subordinate.

Only show exit-specific fields when appropriate to the existing status and data model. Preserve partial-close handling and do not discard previously entered values when changing status.

Do not assume that every existing field is a currency amount; inspect the current code to confirm whether it represents price, token quantity, total position value, fees, or another unit.

### Trading Sessions should not contain

- The main daily closing-balance form.
- Bill payment or savings deposit forms.
- A separate portfolio balance that competes with the authoritative balance.
- Trade PnL logic that updates the portfolio balance a second time.

---

## 16.5 Capital Vault — detailed layout

### Recommended content order

**A. Page heading**
- Title: `Capital Vault`
- A concise description may explain that this section tracks bills, savings, and recorded capital movements separately from trading performance.

**B. Compact financial overview**
Use a small, clearly labelled summary of:
- Savings balance and target progress.
- Upcoming or overdue bills, where supported.
- Relevant recorded capital movements.

Do not combine these into a single number that could be mistaken for trading capital. Label every balance by category.

**C. Bills group — first detailed group**
- Place the Bills heading above the bill list.
- Put `Add Bill` beside the Bills heading or at the end of the list.
- Each bill row/card should show name, amount, due date, status, and remaining amount where supported.
- Place edit and payment/status actions on the relevant bill.
- Keep destructive removal actions separate from payment/status actions.
- Make overdue status legible using existing site styles, without turning the page into a warning-heavy interface.

If the current application supports partial payments or funding, preserve that behavior and show remaining amounts correctly. Do not invent a new payment model.

**D. Savings group — second detailed group**
- Show current savings balance and target.
- Place `Record Deposit` or the existing deposit action within this group.
- Place withdrawal actions only if supported by the current model.
- Keep the deposit/withdrawal form within this group and label the destination/source clearly.
- Keep transaction history below the summary and actions, with a compact recent view and access to older records.

**E. Capital movements group — third detailed group**
- Show recorded withdrawals from trading capital and their destinations where available.
- Place `Record Withdrawal` or the existing capital-movement action in this group.
- Put date, amount, destination, and notes in the relevant form, based on the existing data model.
- Keep historical movements below the form or summary.
- Do not automatically create a matching savings deposit or bill payment when a withdrawal is recorded. If a transfer needs to be represented in two places, require explicit user-recorded actions according to the existing model.

### Capital Vault separation rules

- Bills, savings, and trading capital must remain distinct.
- Do not put bill inputs into the Daily Tracker closing-balance form.
- Do not place savings deposit controls in the Trading Sessions trade form.
- A recorded withdrawal must not be subtracted again if it is already reflected in the closing portfolio balance.
- Make clear whether a number is a trading balance, savings balance, bill amount, or recorded transaction.

---

## 16.6 Stats & Performance — detailed layout

### Recommended content order

**A. Page heading**
- Title: `Stats & Performance`
- Use a short contextual subtitle only if useful.

**B. High-level performance summary**
Place the most important portfolio metrics first:
- Starting balance.
- Current balance.
- Net profit/loss.
- Percentage growth.
- Trading target completion.

Use the existing metric/card style and ensure labels make the meaning and time period clear.

**C. Growth progress visualization**
- Place the main historical progress chart or existing equivalent below the summary.
- Keep its time range, values, and labels clear.
- Use the existing chart styling and available records.
- Do not introduce a chart dependency solely for this restructure if the current app already has a suitable solution.

**D. Pace comparison**
- Compare actual progress with Relaxed, Mid, and Aggressive plans.
- Clearly distinguish target/plan values from actual recorded values.
- Use the existing pace formulas.
- Do not rank the plans as recommendations; present them as the user's selected planning scenarios.

**E. Trading statistics**
- Show relevant trading-session statistics after the overall progress summary.
- Use only metrics supported by the current data model.
- Do not count open or partial trades as realized results unless the existing formula explicitly and correctly defines that treatment.

**F. Milestones and financial context**
- Show historical milestones and relevant savings/bill summaries after the main performance information.
- Label savings and bill obligations separately from trading performance.
- Do not roll bills or savings into the trading balance or alter the trading target.

### Stats & Performance should not contain

- Primary forms for daily balance entry, trade creation, bill management, or deposits.
- Duplicate controls that belong to the section responsible for that data.
- Independently hard-coded figures that can drift from the underlying records.

---

## 16.7 Cross-section placement and ownership rules

Each data type should have one clear home for creation and editing:

| Data or action | Primary location | Other sections may show |
|---|---|---|
| Challenge targets and dates | Setup | Read-only summaries |
| Daily closing balance | Daily Tracker | Read-only summaries and history |
| Individual trades | Trading Sessions | Aggregate statistics |
| Bills and due dates | Capital Vault | Upcoming/overdue summaries |
| Savings deposits and balance | Capital Vault | Read-only summaries |
| Recorded capital withdrawals | Capital Vault | Read-only history where useful |
| Growth pace and overall performance | Daily Tracker / Stats & Performance, according to purpose | Consistent summaries |
| Historical overall statistics | Stats & Performance | Compact summaries only |

Do not create multiple independent sources of truth for the same value. If a value is displayed in multiple sections, it must be derived from the same stored record or calculation.

---

## 16.8 Final layout acceptance criteria

Before completion, confirm that:

- The primary navigation is consistent across all sections.
- Each section has one clear primary task and action.
- The primary action appears near the fields or content it affects.
- Add/edit controls are attached to the relevant section and records.
- Destructive actions are not confused with save or routine actions.
- The Daily Tracker's closing-balance workflow is visible near the top.
- Trading-session forms do not compete with daily balance entry.
- Bills, savings, and withdrawals are grouped in Capital Vault and remain separate.
- Stats & Performance is primarily for viewing, not duplicating data-entry forms.
- Each data type has one clear place where it is created and edited.
- Secondary details remain available without crowding the default view.
- Responsive layouts preserve the same content priority.
- The existing site's design system—not an invented replacement—is used throughout.

