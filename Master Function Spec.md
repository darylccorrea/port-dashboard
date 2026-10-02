# Master Function Spec
**Portfolio Growth Ladder & Capital Vault System**
*Functional, Algorithmic, and Behavioral Specification*

---

## 1. System Overview & Core Architecture

### 1.1 Architectural Philosophy
The Portfolio Growth Ladder & Capital Vault is a client-side, local-first Single-Page Application (SPA) designed for structured portfolio compounding, capital preservation, real-world profit extraction, and personal expense planning.

The platform operates on four foundational pillars:
1. **Trading Desk Capital:** The active trading capital subject to market risk, daily compounding targets, and execution logging.
2. **Capital Vault:** An isolated, risk-free holding repository where realized trading profits are systematically deposited to fund fixed liabilities (Bills) and build permanent wealth (Savings).
3. **Trade Journal Independence:** Trade-by-trade analytics (entry, exit, fees, win rate) are tracked for execution quality without directly mutating the trading desk balance, preventing accounting drift.
4. **Unified Financial Goal:** A mathematically harmonized equation where the user's Total Financial Goal is always equal to:
   $$\text{Total Financial Goal} = \text{Trading Target} + \text{Savings Target} + \text{Monthly Bills Target}$$

### 1.2 Data Persistence Architecture
* **Primary Storage:** Web Browser `localStorage`. Every state mutation immediately serializes to typed JSON structures.
* **Secondary Storage:** `sessionStorage` for temporary UI states (e.g., dismissing session-specific alerts).
* **Remote Cloud Sync:**
  * **Firebase Firestore:** Direct document-level sync (`users/{syncKey}`) with debounced writes.
  * **Google Sheets Webhook:** HTTP POST dispatch to a Google Apps Script deployment for spreadsheet logging.

---

## 2. Global State & Data Schema Dictionary

### 2.1 Storage Keys & Data Models

| Storage Key | Data Type | Default Value | Functional Role |
| :--- | :--- | :--- | :--- |
| `pgl_ladder_profiles_v10` | `Array<Profile>` | `[default_28]` | Array of challenge roadmap profiles configured by the user. |
| `pgl_active_profile_v10` | `String` | `'default_28'` | ID of the currently active profile being traded and tracked. |
| `pgl_session_v10` | `Number` | `1` | Active session index (1-indexed). |
| `pgl_logs_v10` | `Record<number, number>` | `{}` | Map of session index to closing balance (e.g., `{ 1: 150.25 }`). |
| `pgl_locked_sessions_v10` | `Record<number, boolean>`| `{}` | Map of session index to lock status. Locked sessions cannot be edited without explicit unlock. |
| `pgl_notes_v10` | `Record<number, string>` | `{}` | Map of session index to free-form qualitative trader notes. |
| `pgl_timestamps_v10` | `Record<number, string>` | `{}` | ISO 8601 timestamps of when each session closing balance was recorded. |
| `pgl_pace_v10` | `String` | `'relaxed'` | Active pacing benchmark: `'relaxed'`, `'mid'`, `'aggressive'`, or `'finreq'`. |
| `pgl_plan_view_mode_v10` | `String` | `'original'` | Active roadmap display mode: `'original'` benchmark or `'rebased'` recovery scenario. |
| `pgl_vault_ledger_v10` | `Array<VaultRecord>` | `[]` | Immutable audit log of deposits, transfers, and bill payments in the Capital Vault. |
| `pgl_milestone_cfg_v10` | `MilestoneConfig` | Object | User savings targets, reserve floor, and pacing strategies. |
| `pgl_milestone_enabled_v10` | `Boolean` | `false` | Master toggle for milestone suggestions and alerts. |
| `pgl_skim_mode_v10` | `Boolean` | `false` | Master toggle to dynamically augment daily trading targets with scheduled cash-out requirements. |
| `pgl_bills_breakdown_v10` | `Array<BillRecord>` | `[]` | List of recurring expense liabilities, due dates, amounts, and reservation statuses. |
| `pgl_bills_basis_v10` | `String` | `'days'` | Calculation basis for bill pacing: `'days'` (calendar) or `'sessions'` (trading days). |
| `pgl_trade_logs_v10` | `Array<TradeRecord>` | `[]` | Trade journal execution entries (entry, exit, fees, status, notes). |
| `pgl_sync_key_v10` | `String` | `''` | User portfolio identifier for Firestore document partitioning. |
| `pgl_webhook_url_v10` | `String` | `''` | Google Apps Script Web App endpoint URL. |
| `pgl_firebase_cfg_v10` | `String` | `''` | JSON configuration object for Firebase project initialization. |

### 2.2 Entity Schemas

#### Profile (`Profile`)
```typescript
interface Profile {
  id: string;                    // Unique identifier (e.g., 'default_28', 'prof_169...')
  name: string;                  // User-defined challenge name
  base: number;                  // Starting capital balance in USD
  portTarget: number;            // Final summit target balance in USD
  targetBalance: number;         // Synchronized target balance
  totalSessions: number;         // Total duration in trading sessions (e.g., 28)
  startDate: string;             // ISO Date string ('YYYY-MM-DD')
  curveType: string;             // 'tri_pace_independent' | 'smooth' | 'decay' | 'port_target_withdrawal'
  withdrawalTarget?: number;     // Optional cash-out goal
  withdrawalDays?: number;       // Sessions over which cash-out is accumulated
  adjustedSummit?: number;       // portTarget + withdrawalTarget
  dailySkimRate?: number;        // Daily cash-out run rate needed
  skimMode?: boolean;            // Profile-level skim mode flag
  sessions: Array<SessionRow>;   // Computed day-by-day roadmap targets
}
```

#### SessionRow (`SessionRow`)
```typescript
interface SessionRow {
  s: number;                     // 1-indexed session number
  r: number;                     // Relaxed target balance
  m: number;                     // Mid-pace target balance
  a: number;                     // Aggressive-pace target balance
  target: number;                // Primary target reference (equals r)
  deskTarget?: number;           // Trading desk balance required (if cash-out configured)
  withdrawalGoal?: number;       // Cumulative cash-out checkpoint
  tag?: string;                  // Milestone label (e.g., 'Week 1 Checkpoint')
}
```

#### VaultRecord (`VaultRecord`)
```typescript
interface VaultRecord {
  id: string;                    // Unique ID ('vrec_...')
  session: number;               // Session number when recorded
  date: string;                  // ISO 8601 timestamp
  amount: number;                // Dollar amount transferred
  note: string;                  // User description / category
  bucket: string;                // 'bills' | 'savings' | 'general'
  billId?: string;               // Associated Bill ID if this was a bill payment
}
```

#### BillRecord (`BillRecord`)
```typescript
interface BillRecord {
  id: string;                    // Unique ID ('bill_...')
  name: string;                  // Label (e.g., 'Rent', 'Electricity')
  amountDue: number;             // Total dollar liability due
  amountReserved: number;        // Capital currently set aside in vault for this bill
  dueDate: string;               // Date string ('YYYY-MM-DD')
  priority: string;              // 'high' | 'medium' | 'low'
  status: string;                // 'unfunded' | 'partial' | 'funded' | 'paid'
  notes?: string;                // Account details, auto-pay flags, etc.
}
```

#### TradeRecord (`TradeRecord`)
```typescript
interface TradeRecord {
  id: string;                    // Unique ID ('trade_...')
  sessionNum: number;            // Trading session index
  tradeNo: string;               // Label (e.g., 'Trade A', 'Trade 1')
  date: string;                  // Date string ('YYYY-MM-DD')
  status: string;                // 'closed' | 'open'
  entryAmount: number;           // Capital deployed
  exitValue: number;             // Capital returned at exit
  fees: number;                  // Brokerage, commissions, slippage
  notes?: string;                // Execution setup notes
}
```

---

## 3. Mathematical & Algorithmic Engines

### 3.1 Daily Desk Balance & PnL Formula
To guarantee that capital transferred to the Vault is **never penalized as a trading loss**, the system calculates daily realized profit and desk balance through normalized aggregation:

1. **Current Desk Balance ($B_s$):**
   $$B_s = \begin{cases} 
   \text{sessionLogs}[s] & \text{if session } s \text{ is logged} \\
   \text{sessionLogs}[k] & \text{where } k \text{ is the highest logged session } < s \\
   \text{profile.base} & \text{if no previous sessions are logged}
   \end{cases}$$

2. **Previous Desk Balance ($B_{s-1}$):**
   $$B_{s-1} = \begin{cases} 
   \text{profile.base} & \text{if } s \le 1 \\
   \text{sessionLogs}[k] & \text{where } k \text{ is the highest logged session } < s \\
   \text{profile.base} & \text{if no previous sessions exist}
   \end{cases}$$

3. **Session Vault Skims ($W_s$):**
   $$W_s = \sum_{\substack{r \in \text{vaultLedger} \\ r.\text{session} = s}} r.\text{amount}$$

4. **Normalized Realized Daily PnL ($\Delta_s$):**
   $$\Delta_s = (B_s + W_s) - B_{s-1}$$

5. **Session Return Percentage ($R_s$):**
   $$R_s = \begin{cases}
   \left(\frac{\Delta_s}{B_{s-1}}\right) \times 100 & \text{if } B_{s-1} > 0 \\
   0 & \text{otherwise}
   \end{cases}$$

6. **True Total Wealth ($W_{\text{total}}$):**
   $$W_{\text{total}} = B_s + \sum_{r \in \text{vaultLedger}} r.\text{amount}$$

---

### 3.2 Compounding Curve Generators

#### A. Tri-Pace Independent Ladder Generator (`generateIndependentTriPaceLadder`)
Generates three concurrent compounding paths across $N$ sessions from starting capital $C_0$ to target $T$:
1. **Checkpoint Target ($C_k$):** Set at session $K = \text{round}(N \times 0.25)$.
   * Relaxed Checkpoint: $C_{k,\text{rel}} = \text{round}(T \times 0.10)$
   * Mid Checkpoint: $C_{k,\text{mid}} = \text{round}(T \times 0.18)$
   * Aggressive Checkpoint: $C_{k,\text{agg}} = \text{round}(T \times 0.25)$
2. **Segment 1 Growth Rate ($s \le K$):**
   $$r_1 = \left(\frac{C_k}{C_0}\right)^{\frac{1}{K-1}}, \quad \text{Balance}(s) = C_0 \times r_1^{s-1}$$
3. **Segment 2 Growth Rate ($s > K$):**
   $$r_2 = \left(\frac{T}{C_k}\right)^{\frac{1}{N-K}}, \quad \text{Balance}(s) = C_k \times r_2^{s-K}$$

#### B. Smooth Exponential Compounding (`calculateSmoothSeries`)
$$B(s) = C_0 \times \left(\frac{T}{C_0}\right)^{\frac{s-1}{N-1}}$$

#### C. Front-Loaded Decay Compounding (`calculateDecaySeries`)
Models aggressive compounding early with decelerating risk near the summit:
$$f(s) = \left(\frac{s-1}{N-1}\right)^{0.75}, \quad B(s) = C_0 \times \left(\frac{T}{C_0}\right)^{f(s)}$$

#### D. Portfolio Target with Scheduled Cash-Out (`port_target_withdrawal`)
Separates daily targets into Desk Compounding and Cumulative Banked Cash:
1. Desk target compounds smoothly from $C_0$ to $T$.
2. Withdrawal target $W_{\text{target}}$ accumulates linearly over $D_{\text{with}}$ sessions:
   $$W(s) = \begin{cases}
   W_{\text{target}} \times \left(\frac{s-1}{D_{\text{with}}-1}\right) & \text{if } s \le D_{\text{with}} \\
   W_{\text{target}} & \text{if } s > D_{\text{with}}
   \end{cases}$$
3. Total Roadmap Target: $\text{Target}(s) = B_{\text{desk}}(s) + W(s)$.

---

### 3.3 Shortfall Detection & Rebased Recovery Engine

1. **Shortfall Condition:**
   $$\text{Shortfall} = \text{Target}_{\text{active}}(s) - B_s > 0$$
2. **Rebased Curve Calculation (`calculateRebasedPlan`):**
   If the user elects to rebase after a drawdown or missed session, the system computes an adjusted recovery curve starting from the actual current balance $B_s$ at session $s$, preserving the original final session endpoint $T$:
   $$B_{\text{rebased}}(i) = B_s \times \left(\frac{T}{B_s}\right)^{\frac{i - s}{N - s}} \quad \text{for } i \in [s, N]$$
3. **Recovery Rate Needed:**
   $$\text{Required Daily Growth Rate} = \left(\frac{T}{B_s}\right)^{\frac{1}{N - s}} - 1$$

---

### 3.4 Automated Realized Profit Allocation Engine (`calculateProfitAllocationPreview`)

When a session closes with realized profit ($\Delta_s > 0$), the engine partitions the net gain across three buckets according to life-priority phases:

#### Phase 1: Bills Priority (Unfunded Bills Exist)
* **Bills Reserve:** $70\%$
* **Trading Desk:** $20\%$
* **Savings Reserve:** $10\%$

#### Phase 2: Wealth Building (All Bills Fully Funded)
* **Trading Desk:** $45\%$
* **Savings Reserve:** $35\%$
* **Bills Reserve:** $20\%$

#### Overflow Redistribution Algorithm:
1. If the Bills allocation exceeds remaining unpaid bills:
   $$\text{Overflow} = \text{Alloc}_{\text{bills}} - \text{Bills}_{\text{remaining}}$$
2. The excess is distributed proportionally:
   * To Trading Desk: $60\%$ of Overflow
   * To Savings Reserve: $40\%$ of Overflow

#### Capital Floor Protection:
Before executing an allocation, the engine verifies that the post-allocation desk balance does not violate the user's configured reserve floor $F$:
$$B_s - (\text{Alloc}_{\text{bills}} + \text{Alloc}_{\text{savings}}) \ge F$$
If violated, the system presents an explicit confirmation modal preventing accidental desk depletion.

---

### 3.5 Total Financial Goal Unification Engine (`calculateTotalFinancialGoal`)

Calculates live financial health by aggregating three categories:
1. **Trading Component:**
   * Target: Active profile target $T_{\text{trading}}$
   * Achieved: $\min(T_{\text{trading}}, \max(0, B_{\text{desk}}))$
   * Remaining: $\max(0, T_{\text{trading}} - B_{\text{desk}})$
2. **Savings Component:**
   * Target: Milestone target $T_{\text{savings}}$
   * Achieved: $\min(T_{\text{savings}}, \text{Balance}_{\text{savings}})$
   * Remaining: $\max(0, T_{\text{savings}} - \text{Balance}_{\text{savings}})$
3. **Bills Component:**
   * Target: Total monthly bills due $\sum \text{Bill}_{\text{due}}$
   * Achieved: Total bills paid + capital reserved for unpaid bills
   * Remaining: Total unpaid, unreserved bills due
4. **Overall Progress:**
   $$\text{Progress \%} = \frac{\text{Achieved}_{\text{trading}} + \text{Achieved}_{\text{savings}} + \text{Achieved}_{\text{bills}}}{\text{Target}_{\text{trading}} + \text{Target}_{\text{savings}} + \text{Target}_{\text{bills}}} \times 100$$

---

## 4. Module Specifications

### 4.1 Module 1: Daily Tracker (`tabContentTracker`)

#### Persistent Top Position Bar
* **Current Balance (`posCurrentBal`):** Displays $B_s$.
* **Started Capital (`posStartBal`):** Displays initial capital $C_0$. Interactive: clicking opens the Quick Edit Parameters Modal.
* **Today's P&L (`posTodayPnL`):** Displays $\Delta_s$. Shows `+$0.00` if session is awaiting closing balance.
* **Today's Return (`posTodayReturn`):** Displays $R_s\%$.
* **All-Time P&L (`posOverallPnL`):** Displays $W_{\text{total}} - C_0$.
* **All-Time ROI (`posOverallReturn`):** Displays $\left(\frac{W_{\text{total}} - C_0}{C_0}\right) \times 100\%$.
* **Target Summit (`posOverallTarget`):** Displays profile target $T$.
* **Streak Counter (`posStreakCount`):** Consecutive sessions where closing balance $\ge$ previous balance.

#### Static 3-Pace Targets Section (`dailyPaceTargetsSection`)
Positioned statically above the tab switchers:
* Displays cards for **Relaxed**, **Mid**, and **Aggressive** targets for the current session.
* Pacing Selector (`setPace`): Changes the active target across the application.
* Displays dollar difference between current desk balance and each target.

#### Sub-Header Navigation
Controls sub-tab views inside Daily Tracker:
1. **Daily Desk (`desk`):** Primary logging workspace (default active).
2. **Activity Calendar (`calendar`):** Monthly grid view of trades and sessions.
3. **Total Financial Goal (`tfg`):** 3-pillar goal progress breakdown.

#### Sub-Tab 1: Daily Desk Panel
* **Session Navigation:** Previous/Next session buttons (`navigateSession(-1)` / `navigateSession(+1)`). Enforces bounds between session 1 and total challenge sessions.
* **Closing Balance Input (`sessionBalanceInput`):** Number input for recording end-of-session balance. Automatically triggers PnL and return calculations.
* **Lock / Save Session (`toggleLockActiveSession`):**
  * Locks the active session to prevent accidental edits.
  * Disables input field, shows locked badge and execution timestamp.
  * Clicking again unlocks the session.
* **Auto-Fill Target Button (`fillTargetForActiveSession`):** Automatically sets closing balance to active target.
* **Session Notes (`sessionNotesInput`):** Autosaving textarea for trade psychological and tactical notes.
* **Shortfall & Rebase Card:** Appears when desk balance is below target. Allows switching between Original Plan and Rebased Plan.
* **Profit Allocation Card (`profitAllocationCard`):** Appears when session has realized profit. Displays Phase 1 or Phase 2 breakdown with 1-click execution.
* **Master Session Table (`renderMasterTable`):** Comprehensive table showing all sessions, targets, actuals, skims, PnL, notes, and lock states. Features table copy to clipboard.

#### Sub-Tab 2: Activity Calendar Panel (`renderCalendarView`)
* Displays an interactive monthly calendar.
* Maps calendar dates to logged trading sessions and journal trades.
* Green/Red badges indicate daily profit/loss.
* Month navigation (Previous, Next, Today).
* Clicking any day jumps the Daily Desk directly to that session.

#### Sub-Tab 3: Total Financial Goal Widget (`renderTotalFinancialGoal`)
* Displays combined progress bar partitioned into Trading, Savings, and Bills.
* Dedicated summary cards for each category showing balance, target, and remaining amounts.
* Dynamic surplus/deficit indicators.

#### Gamified Mountain Trail Progress Visualizer (`updateGrowthProgressChart`)
* Renders an interactive SVG mountain trail representing challenge checkpoints.
* Nodes represent completed sessions, active session, rest days, and milestones.
* Tooltips display session balance and target.

---

### 4.2 Module 2: Setup Plan & Challenge Roadmap (`tabContentConfig`)

#### Sub-Header Navigation
1. **Active Challenge (`active`):** Challenge summary and profile selection (default active).
2. **Challenge Wizard (`wizard`):** Multi-step generator for creating or modifying roadmaps.
3. **Cloud & Sheets Sync (`integrations`):** Firebase and Google Sheets configuration.
4. **Safe Reset (`safety`):** Data purge, selective reset, and backup/restore controls.

#### Sub-Tab 1: Active Challenge Overview
* **Summary Header:** Challenge title, estimated completion date, active badge.
* **Profile Selector (`ladderProfileSelector`):** Dropdown to switch between configured challenges.
* **Quick Edit Button:** Opens modal to change starting balance and target without touching the wizard.
* **Key Metric Cards:** Starting Deposit, Target Goal, Current Session progress, Growth Multiple ($T / C_0$).
* **Challenge List (`cfgActiveChallengeList`):** Grid of all saved challenges with Select and Edit buttons.

#### Sub-Tab 2: Challenge Wizard (`setSetupStep`)
A 3-step structured configuration flow:
* **Step 1: Core Parameters**
  * Challenge Name (`genName`)
  * Starting Balance (`genBase`)
  * Target Summit (`genTarget`)
  * Total Sessions (`genSessions`)
  * Start Date (`genStartDate`)
  * **Quick Apply Button (`btnQuickSaveStep1`):** Immediately saves Step 1 inputs to the active challenge without requiring Steps 2 and 3.
  * Monthly Bills & Savings Target quick configuration.
  * Live Mountain Trail preview flags and chips.
* **Step 2: Growth Strategy & Pacing**
  * Growth Curve Selection: Independent Tri-Pace, Smooth Compounding, Front-Loaded Decay, Portfolio Target with Cash-Out.
  * Cash-Out / Withdrawal Target and accumulation window.
  * Skim Mode toggle.
* **Step 3: Verification & Activation**
  * Preview milestone checkpoints.
  * Submit button: Saves changes or creates a new challenge profile.

#### Sub-Tab 3: Cloud & Sheets Sync
* **Firebase Firestore Sync:**
  * Project Configuration input (JSON).
  * Sync Key definition for multi-device pairing.
  * Real-time bidirectional listener and debounced auto-sync.
  * Copy Firestore Security Rules helper.
* **Google Sheets Webhook Sync:**
  * Google Apps Script Web App URL input.
  * One-click Google Sheet creation with pre-built Apps Script code generator.
  * Manual "Sync to Cloud Now" button.
  * Connection health status indicator (Online, Syncing, Offline).
  * CSV / Excel data export.

#### Sub-Tab 4: Safe Reset & Data Management
* **Reset Session Logs:** Clears closing balances and timestamps while preserving challenge configuration and vault funds.
* **Clear Capital Vault:** Clears vault ledger and resets savings/bill allocations while keeping trading logs.
* **Restore Default Challenge:** Resets active profile to the canonical 28-session tri-pace roadmap.
* **Full Factory Reset:** Completely purges all `localStorage` keys and resets application to initial state.
* All reset actions enforce double-confirmation dialogs.

---

### 4.3 Module 3: Trading Sessions & Trade Journal (`tabContentTrades`)

#### Sub-Header Navigation
1. **Quick Logger (`logger`):** Rapid trade entry workspace (default active).
2. **Trade History (`journal`):** Historical execution log table.
3. **Analytics (`analytics`):** Win rate, return distribution, and trade metrics.

#### Sub-Tab 1: Quick Logger
* **Session Selector:** Binds the trade to an active or past session.
* **Trade Number / Label:** Sequential label generator (Trade A, Trade B, ...).
* **Entry Amount Input:** Position capital deployed.
* **Exit Value Input:** Total returned value at trade close.
* **Fees Input:** Broker commissions and transaction charges.
* **Live PnL & Return Preview:**
  $$\text{Net PnL} = \text{Exit Value} - \text{Entry Amount} - \text{Fees}$$
  $$\text{Return \%} = \frac{\text{Net PnL}}{\text{Entry Amount}} \times 100$$
* **Quick Add Button:** Appends trade record to `pgl_trade_logs_v10`.

#### Sub-Tab 2: Trade History Table
* Filter by session (All Sessions vs specific session).
* Filter by status (Open vs Closed).
* Edit trade modal (`openEditTradeModal`).
* Delete trade confirmation.

#### Sub-Tab 3: Trade Journal Analytics (`calculateTradeJournalAnalytics`)
* **Total Trades Logged:** Count of entries.
* **Closed Trades vs Open Trades.**
* **Win Rate Percentage:** $\left(\frac{\text{Wins}}{\text{Closed Trades}}\right) \times 100$.
* **Average Return Per Trade (%):** Arithmetic mean of closed trade return percentages.
* **Total Realized Trade PnL:** Sum of all closed trade net gains/losses.
* *Note:* Trade Journal PnL is tracked strictly for execution analytics and does not overwrite session closing balance.

---

### 4.4 Module 4: Capital Vault & Financial Planning (`tabContentMilestones`)

#### Sub-Header Navigation
1. **Vault Overview (`overview`):** High-level capital health and quick actions (default active).
2. **Bills & Schedule (`bills`):** Bill tracking and due dates.
3. **Savings Reserve (`savings`):** Permanent wealth storage and deposits.
4. **Safety Milestones & Skims (`milestones`):** Milestones, skim transfers, and pacing settings.

#### Top KPI Cards
1. **Total Vault Balance (`vaultTotalWithdrawnVal`):** Sum of all deposits minus bill payments.
2. **Savings Balance (`vaultSavingsReserveVal`):** Current capital in savings bucket.
3. **Bills Reserved (`vaultBillsReserveVal`):** Capital earmarked for upcoming bills.
4. **Available to Trade (`vaultDeskDisplayVal`):** Current active desk balance.

#### Sub-Tab 1: Vault Overview
* **Quick Action Buttons:**
  * Add Savings (opens deposit modal).
  * Pay Bill (quick-pays next due bill from vault).
  * Add Transaction / Transfer Funds (opens manual ledger modal).
* **Monthly Overview:** Monthly bill coverage bar and savings goal bar with month switcher.
* **Allocation Distribution Donut:** Visualizes proportion of wealth across Desk, Savings, and Bills.

#### Sub-Tab 2: Bills & Schedule (`renderBillsBreakdown`)
* **Bill Management Modal:** Add/Edit bill name, amount due, amount reserved, due date, priority, status, notes.
* **Funding Actions:**
  * "Set Aside": Allocates available vault capital to a specific bill.
  * "Mark as Paid": Deducts amount due from Bills bucket and records payment in vault ledger.
  * "Toggle Paid": Toggles paid state without balance double-counting.
* **Calculation Basis Selector (`setBillsBasis`):** Toggles between calendar days and trading sessions for daily rate calculations.

#### Sub-Tab 3: Savings Reserve
* **Deposit to Savings Modal (`openAddSavingsModal`):** Records deposit to savings bucket with quick-amount chips (+$25, +$50, +$100, +$250).
* **Savings History:** Audit log of all savings deposits.
* **Target Progress:** Displays progress against milestone savings goal.

#### Sub-Tab 4: Safety Milestones & Controls
* **Three Safety Milestone Badges:**
  1. *Step 1: Recoup Start Deposit:* Unlocked when Total Vault $\ge C_0$.
  2. *Step 2: Safety Cushion:* Unlocked when Total Vault $\ge$ configured Reserve Floor.
  3. *Step 3: Target Goal Cleared:* Unlocked when Total Vault $\ge$ Milestone Savings Goal.
* **Manual Profit Skim & Transfer Form (`handleManualSkimSubmit`):**
  * Select Destination Bucket: Bills Reserve, Savings Reserve, General Vault.
  * Amount, Date/Time, Note.
  * Capital Floor Protection Warning dialog if desk balance drops below floor.
* **Savings Suggestion Pacing Controls (`saveMilestoneConfig`):**
  * Milestone Savings Goal ($).
  * Target Deadline date.
  * Keep on Trading Desk Reserve Floor ($).
  * Pacing Strategy:
    * *Gradual:* Suggests transfer when daily PnL > $30 (25% of gain).
    * *Checkpoints:* Suggests transfers when passing weekly roadmap checkpoints.
    * *Custom / Manual:* Disables automated alerts.

---

### 4.5 Module 5: Stats & Performance Analytics (`tabContentStats`)

#### Summary Metrics
* **All-Time ROI (%):** Total wealth gain divided by starting base.
* **Peak Watermark Balance:** Highest true wealth achieved during the challenge.
* **Maximum Drawdown (%):** Largest peak-to-trough decline in true wealth:
  $$\text{Drawdown} = \frac{\text{Peak} - \text{Trough}}{\text{Peak}} \times 100$$
* **Session Win/Loss Record:** Number of profitable vs unprofitable sessions.
* **Session Win Rate (%):** Profitable sessions divided by logged sessions.
* **Profit Factor (`calculateProfitFactor`):** Gross profits divided by gross losses.
* **Average Daily Return (%):** Mean return percentage across logged sessions.
* **Best Session PnL:** Highest single-session dollar gain.

#### Analytics Visualizers
* **True Wealth vs Trading Desk Equity Curve:** Chart showing growth of total wealth alongside desk capital.
* **Daily PnL Distribution:** Bar breakdown of daily gains and losses.
* **Trade Size & Frequency Distribution:** Categorizes journal trades by position size.
* **Compounding Consistency Score:** Algorithmic rating evaluating adherence to pacing targets.

---

## 5. Modal Dialogs & Interactive Controls

| Modal Identifier | Invocation Function | Primary Purpose | Inputs / Actions |
| :--- | :--- | :--- | :--- |
| `quickEditParamsModal` | `openQuickEditParamsModal()` | Instant edit of Starting Balance and Target Goal | Starting Balance ($), Target Goal ($), Apply button. |
| `billModal` | `openAddBillModal()`, `openEditBillModal(id)` | Create or edit recurring bill liability | Name, Amount Due, Amount Reserved, Due Date, Priority, Status, Notes. |
| `savingsModal` | `openAddSavingsModal()` | Deposit funds into Savings Reserve bucket | Amount ($), Note, Quick +$25..+$250 chips, Confirm button. |
| `tradeModal` | `openLogTradeModal()`, `openEditTradeModal(id)` | Record or edit Trade Journal entry | Session, Trade Label, Date, Status, Entry, Exit, Fees, Notes. |
| `sheetSyncModal` | `openLinkSheetModal()` | Manage Firebase and Google Sheets sync | Firebase JSON config, Sync Key, Webhook URL, Test Sync button. |
| `customModal` | `openModal(...)` | Generic confirmation and prompt dialog | Confirm / Cancel buttons, optional text/number input prompt. |

---

## 6. Pacing & PnL Formula Reference Table

| Formula Name | Mathematical Definition | Functional Use |
| :--- | :--- | :--- |
| **Normalized PnL** | $\Delta_s = (B_s + W_s) - B_{s-1}$ | Authoritative daily dollar gain/loss including vault skims. |
| **Daily Return %** | $R_s = (\Delta_s / B_{s-1}) \times 100$ | Daily percentage yield on active capital. |
| **True Wealth** | $W_{\text{total}} = B_s + \sum W_i$ | Combined portfolio wealth (Trading Desk + Vault). |
| **Cumulative ROI** | $\text{ROI} = ((W_{\text{total}} - C_0) / C_0) \times 100$ | All-time return on initial seed deposit. |
| **Profit Factor** | $\sum \text{Gains} / \sum \|\text{Losses}\|$ | Risk-reward ratio of trading execution. |
| **Total Goal** | $T_{\text{trading}} + T_{\text{savings}} + T_{\text{bills}}$ | Unified financial finish line across all categories. |
| **Overall Goal %** | $(\text{Achieved}_{\text{total}} / \text{Goal}_{\text{total}}) \times 100$ | Universal financial completion metric. |
| **Rebased Daily Rate** | $(T / B_s)^{\frac{1}{N - s}} - 1$ | Required daily compounding rate to recover from drawdown. |

---

## 7. Edge Case Handling & Defensive Validation

1. **Unlogged Session Fallback:**
   If a user navigates to session 5 without logging sessions 1 through 4, the system automatically resolves the previous desk balance by walking backward to the nearest logged session or falling back to `profile.base`. It never yields `NaN`, `null`, or `$0.00`.
2. **Zero or Unset Targets:**
   If bills or savings targets are set to 0, completion metrics safely report `0%` or `100%` (if no obligations exist), preventing division-by-zero errors.
3. **Session Lock Protection:**
   Locked sessions cannot receive keystroke updates. The input field is disabled and marked read-only until the user explicitly toggles the lock button.
4. **Duplicate Skim Prevention:**
   When a bill is marked as paid via vault funds, the deduction is logged with `bucket: 'bills'` and tagged with `billId`, preventing double deductions from the trading desk or vault balance.
5. **Capital Floor Enforcement:**
   Manual skims and automated profit allocations verify that desk balance remains $\ge$ the configured reserve floor, triggering warning dialogs before execution.
6. **Data Migration & Schema Resilience:**
   Storage keys incorporate versioning (`_v10`). Corrupted or missing storage items trigger non-destructive fallbacks to default data structures without crashing the application runtime.
