# Portfolio Growth Ladder & Capital Vault — Master System Manual
**The Complete Technical, Mathematical, and Operational Guide**

---

## Table of Contents
1. [Executive Overview & Trading Philosophy](#1-executive-overview--trading-philosophy)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Design System & Interface Ergonomics](#3-design-system--interface-ergonomics)
4. [Master Features Breakdown by Module](#4-master-features-breakdown-by-module)
   - [4.1 Global Header & Cloud Sync Hub](#41-global-header--cloud-sync-hub)
   - [4.2 True Realized Wealth & Hero Banner](#42-true-realized-wealth--hero-banner)
   - [4.3 Tab 1: Active Execution Tracker & Daily Console](#43-tab-1-active-execution-tracker--daily-console)
   - [4.4 Tab 2: Financial Milestones & Capital Vault](#44-tab-2-financial-milestones--capital-vault)
   - [4.5 Tab 3: Climber's Analytics & Stats Hub](#45-tab-3-climbers-analytics--stats-hub)
   - [4.6 Tab 4: Settings, Challenge Roadmaps & Cloud Integrations](#46-tab-4-settings-challenge-roadmaps--cloud-integrations)
5. [Complete Mathematical Formulas & Algorithms](#5-complete-mathematical-formulas--algorithms)
   - [5.1 Geometric Compounding Curve (Smooth)](#51-geometric-compounding-curve-smooth)
   - [5.2 Front-Loaded Compounding Decay Curve](#52-front-loaded-compounding-decay-curve)
   - [5.3 Port Target + Withdrawal Curve (Accelerated Cash-Out)](#53-port-target--withdrawal-curve-accelerated-cash-out)
   - [5.4 Tri-Pace Multipliers (Relaxed, Mid, Aggressive)](#54-tri-pace-multipliers-relaxed-mid-aggressive)
   - [5.5 Skim Mode Daily Increment Engine](#55-skim-mode-daily-increment-engine)
   - [5.6 Financial Requirement Daily Savings Run Rate](#56-financial-requirement-daily-savings-run-rate)
   - [5.7 Normalized PnL with Vault Extraction Invariance](#57-normalized-pnl-with-vault-extraction-invariance)
   - [5.8 Cumulative Wealth, All-Time High Watermark & Max Drawdown](#58-cumulative-wealth-all-time-high-watermark--max-drawdown)
   - [5.9 Win Rate, Streaks & Profit Factor](#59-win-rate-streaks--profit-factor)
6. [Data Schemas & Local Storage Architecture](#6-data-schemas--local-storage-architecture)
   - [6.1 LocalStorage Keys & Data Types](#61-localstorage-keys--data-types)
   - [6.2 Ladder Profile Schema](#62-ladder-profile-schema)
   - [6.3 Vault Ledger Entry Schema](#63-vault-ledger-entry-schema)
   - [6.4 Milestone Configuration Schema](#64-milestone-configuration-schema)
   - [6.5 Firestore Remote Document Payload Schema](#65-firestore-remote-document-payload-schema)
   - [6.6 Google Sheets Webhook Payload Schema](#66-google-sheets-webhook-payload-schema)
7. [Google Sheets Integration Guide (Apps Script)](#7-google-sheets-integration-guide-apps-script)
8. [Automated Verification & Test Suites](#8-automated-verification--test-suites)

---

## 1. Executive Overview & Trading Philosophy

The **Portfolio Growth Ladder & Capital Vault** is a high-performance, single-file financial web application engineered for disciplined trading compounding, psychological risk mitigation, and real-world capital extraction.

### The Problem It Solves
Trading accounts starting with modest capital (e.g., $\$120$–$\$150$) frequently encounter severe psychological and mathematical hurdles:
1. **The Compound Trap:** As the portfolio expands, position sizes grow exponentially. Traders often suffer emotional paralysis or over-leverage to accelerate returns, leading to catastrophic drawdowns.
2. **Calendar Pressure & False Drawdowns:** Traditional trading software penalizes skipped days, weekends, or market holidays. Furthermore, when a trader withdraws profits to satisfy real-world financial obligations (such as living expenses or bills), standard analytics register the withdrawal as an account drawdown or trading loss.
3. **Over-Aggressive UI Eyestrain:** High-contrast neon crypto dashboards induce adrenaline and overtrading.

### The Four Operational Pillars
- **Decoupled Execution Sessions:** Trading progress tracks discrete sessions ($s = 1 \dots N$) rather than rigid calendar days. If you do not trade on a given day, no penalties, streak resets, or metrics distortions occur.
- **Tri-Pace Compounding Corridors:** Every session presents three distinct operational tracks: **Relaxed** (low risk, high consistency), **Mid** (moderate acceleration), and **Aggressive** (maximum velocity sprint).
- **Vault Skimming & True Wealth Decoupling:** Profits extracted into the **Capital Vault** reduce active desk exposure without registering as a loss. Total wealth is continuously tracked as $\text{Desk Balance} + \text{Vault Banked}$.
- **Tactile Organic Editorial Design:** Built using an earth-toned naturalist aesthetic that eliminates pure white and pure black, minimizing cognitive fatigue during long market sessions.

---

## 2. Architecture & Technology Stack

The entire application runs as a self-contained, client-side web application strictly conforming to the **Single-File Mandate** (`index.html`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          index.html (Client)                           │
│  ┌──────────────────────┬──────────────────────┬────────────────────┐  │
│  │     Tailwind CSS     │   Vanilla JS ES6+    │  Embedded SVGs &   │  │
│  │ (Dark/Light Palette) │  (Zero Frameworks)   │ Canvas Particles   │  │
│  └──────────────────────┴──────────────────────┴────────────────────┘  │
│         │                          │                         │         │
│         ▼                          ▼                         ▼         │
│   LocalStorage              Firebase Firestore        Google Sheets    │
│  (Persistent State)     (Real-Time Atomic Sync)     (Webhook Sync)     │
└────────────────────────────────────────────────────────────────────────┘
```

- **Runtime Environment:** Pure client-side browser execution. Zero Node.js or server-side build dependencies required.
- **Styling Framework:** Tailwind CSS CDN with full custom color extensions for the Dark Earthy Naturalist palette.
- **Typography:**
  - `Newsreader` (Google Fonts): Elegant editorial serif for titles, milestones, and high-level ranks.
  - `Plus Jakarta Sans`: Geometric grotesque for clean UI navigation and labels.
  - `Space Grotesk`: Tabular monospace numbers for all financial balances, percentages, and metrics.
- **Icons & Visuals:** Pure SVG markup embedded inline (zero emoji characters across all UI elements).
- **Canvas Particle Engine:** Gentle ambient background particles drifting at low opacity with automatic `prefers-reduced-motion` detection.
- **Persistence Layer:**
  - Local browser storage via `localStorage` with prefix `pgl_` and versioning `_v10`.
  - Firebase Firestore (SDK v8.10.1) for multi-device real-time state synchronization.
  - Google Apps Script Webhook API for real-time automated spreadsheet backups.

---

## 3. Design System & Interface Ergonomics

The application utilizes the **Dark Earthy Naturalist Design System**, deliberately rejecting harsh neon blacks and clinical whites in favor of mineral, linen, and botanical tones.

### Color Palette Reference

| Token | Light Mode Hex | Dark Mode Hex | Semantic Role |
|:---|:---:|:---:|:---|
| **Root Background** | `#F5EBDD` | `#1D1915` | Ambient canvas |
| **Bento Surface** | `#F5EBDD` | `#41382D` | Primary card panels |
| **Inner Card Surface** | `#F0E6D5` | `#352E25` | Nested containers & inputs |
| **Borders** | `#CFC1AA` | `#514638` | Structural outlines |
| **Primary Text** | `#332B22` | `#E2D4BD` | High-contrast readability |
| **Muted Text** | `#716556` | `#B4A58F` | Labels, subtitles, timestamps |
| **Sage (Positive)** | `#607B5B` | `#789272` | Relaxed pace, profit, ahead-of-pace |
| **Ochre (Notice)** | `#C2984D` | `#D0AA63` | Mid pace, warnings, cash-out checkpoints |
| **Clay (Drawdown)** | `#B86652` | `#C77B68` | Aggressive pace, red days, delete actions |
| **Slate Blue (Calendar)** | `#617D91` | `#86A5BC` | Activity calendar, session steppers |
| **Mauve (Discipline)** | `#806A86` | `#9A849F` | Aggressive pace card, rank badges |

### Critical Design Constraints
- **Zero Pure White (`#FFFFFF`) & Zero Pure Black (`#000000`):** Prevents retinal burn-in and eye strain during extended chart-reading sessions.
- **Zero Emojis:** Professional editorial financial terminal presentation utilizing lightweight vector icons.

---

## 4. Master Features Breakdown by Module

### 4.1 Global Header & Cloud Sync Hub
- **Live Indian Standard Time:** Header clock displays `Asia/Kolkata` formatted date (e.g., `Thu, 01 Oct 2026`).
- **Session Navigation Indicator:** Displays active session vs total challenge sessions (`Session X of Y`).
- **Cloud Status Indicators:**
  - **Firebase Firestore Badge:** Real-time indicator displaying `Cloud Sync: Connected`, `Syncing...`, or `Local Mode`.
  - **Google Sheets Webhook Badge:** Indicates webhook connectivity for automated remote logging.
- **Theme Switcher:** Toggles between Earthy Light and Earthy Dark modes, stored in `pgl_theme_v10`.
- **Cloud Sync Key Manager:** Modal allowing the user to generate, copy, or link a unique Firestore secret key.

---

### 4.2 True Realized Wealth & Hero Banner
Located at the top of the Tracker tab:
- **True Wealth Counter:** Large animated odometer displaying:
  $$\text{True Wealth} = \text{Current Desk Balance} + \text{Total Vault Banked}$$
- **Deposit & Return Metrics:**
  - Initial Starting Deposit (e.g., $\$120.00$ or $\$150.00$).
  - Net Profit Generated ($\text{True Wealth} - \text{Starting Base}$).
  - Total Percentage Growth ($((\text{True Wealth} - \text{Base}) / \text{Base}) \times 100$).
- **Quick Action Bar:** Direct access to switch active challenges or execute a fast profit extraction to the Vault.

---

### 4.3 Tab 1: Active Execution Tracker & Daily Console

#### 1. Active Session Console (Box 1)
- **Session Stepper (`‹` and `›`):** Step backward or forward through trading history.
- **Closing Balance Input (`#sessionBalanceInput`):**
  - Currency-formatted input where the trader enters the final desk balance for the session.
  - Supports automatic comma formatting and numerical sanitization.
- **Session Lock Engine (`toggleLockActiveSession`):**
  - **Lock to Protect:** Freezes the closing balance, preventing accidental edits.
  - **Unlock to Edit:** Re-enables input with auto-focus and performs an atomic Firestore update so unlocked sessions stay unlocked across devices.
- **Day 1 Awaiting Balance Guard:** Prevents premature "Goal Met" badges on Session 1 until the trader explicitly enters a closing balance.
- **Session Notes System (`openSessionNotesModal`):**
  - Records trade execution notes, setups taken, or psychological observations tagged with execution timestamps.
- **Fast PnL Action Buttons:** Quick shortcuts (`+ Win`, `+ Loss`, `Clear`) to assist rapid logging.
- **Dynamic PnL & Psychological Vibe:**
  - Shows Dollar Gain/Loss and Percentage return for the active session.
  - Vibe Indicator dynamically adapts:
    - *Green Day:* "Awesome green day! Keep your cool and protect gains."
    - *Red Day:* "Small red day. Capital preservation is your superpower!"
    - *Even Day:* "Even session. Ready whenever good setups appear."
    - *Unlogged:* "Session live. Enter closing balance when session completes."

#### 2. Daily Pace Targets & Skim Mode (Box 2)
Presents three interactive pacing options for the active session:
- **Relaxed Pace Card:** Lowest stress baseline target designed to comfortably reach the challenge finish.
- **Mid Pace Card:** $+15\%$ over baseline, representing accelerated momentum.
- **Aggressive Pace Card:** $+30\%$ over baseline, designed for high-conviction market environments.
- **Active Card Selection:** Clicking any card switches the active target tracking to that pace (`setPace`).
- **Goal Completion Badges:** When the logged balance hits or exceeds a pace, the card illuminates with a distinct border and displays `Goal Met (+Delta)`.
- **Skim Mode Header Badge:** When Skim Mode is active, displays `Skim Mode (+$X.XX / session)` in the header.
- **Suggestive Desk Target Card:** Real-time computation showing the exact balance required today to maintain progress toward external financial targets and deadlines.

#### 3. Modular Tabbed Widget Hub (Box 3)
A flexible container with 4 switchable views:
1. **Trading Activity Calendar (`switchWidgetTab('calendar')`):**
   - Monthly summary bar: Days Traded, Green Sessions, Red Sessions, Net Monthly PnL.
   - 7-Day responsive grid (Mon–Sun) mapping execution sessions to calendar dates.
   - Color-coded cells with green/red badges and click-to-jump navigation.
2. **Daily Paces Deep Dive (`switchWidgetTab('paces')`):**
   - Stage-by-stage compounding corridor view with surplus cushions.
3. **Cycle Checkpoints (`switchWidgetTab('milestones')`):**
   - 4 modular compounding phase cards showing percentage progress toward the final challenge summit.
4. **Master Session Ledger Table (`switchWidgetTab('ledger')`):**
   - Comprehensive tabular breakdown of all $N$ sessions.
   - Displays Session Number, Execution Timestamp, Desk Balance, Session PnL, Surplus / Deficit vs Target, Checkpoint Tags, and Lock Status.
   - **Show All Paces Toggle:** Switches between a focused target view and a complete triple-column display (Relaxed, Mid, Aggressive).
   - **Copy Ledger TSV:** Copies the entire table in tab-separated format for pasting directly into Google Sheets or Microsoft Excel.

---

### 4.4 Tab 2: Financial Milestones & Capital Vault

Engineered for real-world capital extraction to ensure trading gains are secured outside the brokerage account.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPITAL VAULT WORKFLOW                          │
│                                                                        │
│   Active Trading Desk Balance ───► [Skim Form / Quick Preset]          │
│                                                   │                    │
│                                                   ▼                    │
│       ┌─────────────────────────────────────────────────────────┐      │
│       │ Capital Floor Check (Desk After >= Floor Reserve $1000) │      │
│       └───────────────────────────┬─────────────────────────────┘      │
│                                   │                                    │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│        [Passes Floor]                      [Below Floor Warning]       │
│                 │                                   │                  │
│                 ▼                                   ▼                  │
│   Transferred to Vault Ledger          Modal Confirmation Required     │
│   True Wealth Invariant Intact         User Override or Abort          │
└────────────────────────────────────────────────────────────────────────┘
```

- **Feature Toggle:** Enable or disable financial requirement tracking entirely.
- **Milestone Configuration:**
  - **Financial Target Goal ($):** The total cash amount required (e.g., $\$1,500.00$ or $\$500.00$).
  - **Target Deadline Date:** Calendar deadline for when the funds are required.
  - **Desk Reserve Floor ($):** Minimum working capital that must remain on the desk (e.g., $\$1,000.00$).
  - **Skim Strategy Selector:** Gradual ($25\%$ surplus extraction), Checkpoint (staged milestones), or Manual.
- **Dynamic Run Rate & Deadline Engine (`getFinancialRequirementMetrics`):**
  - Calculates days remaining, due today, or overdue status.
  - Computes the precise daily run rate needed: $\frac{\text{Remaining Cash Goal}}{\text{Days Left}}$.
  - Status badges: `Flexible`, `On Track`, `Due Soon`, `Past Deadline`, `Goal Reached`.
- **The Three Safety Milestone Badges:**
  - **Badge 1: Recoup Initial Deposit:** Unlocks when Vault $\ge \text{Initial Deposit}$ (e.g., $\$120.00$), marking the transition to trading on "pure house money."
  - **Badge 2: Safety Cushion:** Unlocks at $\$500.00$ banked in the Vault.
  - **Badge 3: Target Goal Cleared:** Unlocks when $100\%$ of the target goal is secured in the Vault.
- **Capital Extraction System (`executeSkim`):**
  - One-click presets: Quick Skim 25%, 50%, or 100% of available session surplus.
  - Manual withdrawal input with optional destination note.
  - **Capital Floor Protection Warning:** If a proposed skim drops the trading desk below the configured reserve floor, a safety confirmation modal prompts the user before executing.
- **Chronological Vault Ledger:**
  - Lists every extraction with ID, timestamp, amount banked, remaining desk balance, destination note, and individual delete action.

---

### 4.5 Tab 3: Climber's Analytics & Stats Hub

- **Trader Rank & Level System:**
  - **Rank I — Base Camp Pioneer (LVL 1):** Sessions 1 to 5. Initial capital foundation.
  - **Rank II — Steady Climber (LVL 2):** Sessions 6 to 11. Early compounding velocity.
  - **Rank III — Highland Navigator (LVL 3):** Sessions 12 to 18. Mid-cycle equity expansion.
  - **Rank IV — Alpine Ridge Master (LVL 4):** Sessions 19 to 24. High-altitude risk protection.
  - **Rank V — Summit Champion (LVL 5):** Sessions 25+. Challenge peak execution.
- **Discipline Scoring Engine:**
  - Computes trading consistency: Grade A+ ($\ge 75\%$ green rate), Grade A ($\ge 50\%$), Grade B ($\ge 35\%$), or Rebuilding Discipline.
- **Streak Tracker:** Real-time counter of consecutive profitable trading sessions.
- **Performance Metrics Grid:**
  - **Win Rate:** Percentage of green sessions over total logged sessions.
  - **Average Session Gain:** Mean dollar return across all logged sessions.
  - **Peak Capital (All-Time High Watermark):** Highest historical true wealth recorded.
  - **Max Drawdown:** Maximum dollar and percentage retracement from peak wealth.
  - **Profit Factor:** Ratio of gross profits to gross losses.
  - **Cycle ROI:** Total percentage return generated since Challenge Day 1.
- **Pace Corridor Distribution:** Bar chart showing how many sessions were completed in Aggressive, Mid, Relaxed, or Below-Pace territories.
- **Climber's Compass Tactical Insights:** Algorithmic coach delivering personalized feedback based on win rate, streak length, drawdown depth, and vault security status.

---

### 4.6 Tab 4: Settings, Challenge Roadmaps & Cloud Integrations

#### 1. Active Challenge Management
- **Profile Selector Dropdown:** Instant switching between stored challenge roadmaps.
- **Delete Selected Challenge:** Safely removes the currently selected challenge after user confirmation.
- **Visual Challenge Cards:** Previews each challenge's Starting Deposit, Final Target, Session Count, Multiple ($X\text{x}$), Strategy Type, and Cash-Out checkpoints.
- **Empty State Guard:** Allows completely deleting all challenges with zero default challenges retained, displaying clean creation prompts.

#### 2. Skim Mode (Withdrawal Rate Assist)
- Dedicated card featuring an interactive toggle switch (`toggleSkimMode`).
- Displays Targeted Withdrawal ($), Accumulation Timeline, and Daily Skim Increment ($+\$X.XX / \text{session}$).
- When enabled, automatically integrates the daily savings requirement into session targets across the dashboard.

#### 3. Start a New Challenge Form & Generator
Allows generating custom mathematical compounding roadmaps:
- **Challenge Name:** Descriptive roadmap label.
- **Starting Balance ($):** Initial deposit (e.g., $\$150.00$).
- **Portfolio Retained Target ($):** Desired trading desk balance at the end of the challenge.
- **Number of Sessions:** Total trading sessions ($3$ to $100$).
- **Withdrawal Target ($):** Amount of cash to extract for personal finances.
- **Withdrawal Timeline (Sessions / Days):** Number of sessions by which the withdrawal must be secured.
- **Type of Strategy:**
  - **`port target + withdrawal`:** Adjusts the final summit to $\text{Portfolio Target} + \text{Withdrawal Target}$, accelerating early pacing to ensure the cash-out is banked by session $D$, after which compounding continues to the portfolio target.
  - **`decay`:** Sprint early, protect gains later (exponential decay curve).
  - **`smooth`:** Constant geometric compounding rate every session.
- **Enable Skim Mode Checkbox:** Integrates daily withdrawal pacing into session targets.
- **Dynamic Live Strategy Preview Card:** Updates in real-time as values are typed, displaying Adjusted Summit, Desk Target, Withdrawal Goal, Daily Skim Rate, and tactical strategy explanations.

#### 4. Reset & Fresh Start Tools
- **Reset Progress to Session 1:** Clears logged balances and timestamps while keeping ladder curves and Vault records intact.
- **Clear Vault History:** Empties the Vault ledger without modifying desk balances.
- **Restore Default Preset:** Re-inserts the standard 28-Session Tri-Pace profile ($120 \rightarrow 7\text{K} / 12.6\text{K} / 17.5\text{K}$).
- **Wipe All Challenge Data:** Full system purge of all profiles, logs, and vaults for a 100% clean slate.

---

## 5. Complete Mathematical Formulas & Algorithms

### 5.1 Geometric Compounding Curve (Smooth)
Calculates a constant rate of return per session $r$ from starting balance $B$ to target $P$ over $S$ sessions:

$$r = \left(\frac{P}{B}\right)^{\frac{1}{S - 1}} - 1$$

Target balance for any session $s \in [1, S]$:

$$\text{Target}_{\text{smooth}}(s) = B \cdot (1 + r)^{s - 1} = B \cdot \left(\frac{P}{B}\right)^{\frac{s - 1}{S - 1}}$$

---

### 5.2 Front-Loaded Compounding Decay Curve
Accelerates compounding during low-capital sessions and decelerates as portfolio size increases to protect capital:

$$\text{Progress}(s) = \frac{s - 1}{S - 1}$$

$$\text{Factor}(s) = (\text{Progress}(s))^{0.72}$$

$$\text{Target}_{\text{decay}}(s) = B \cdot \left(\frac{P}{B}\right)^{\text{Factor}(s)}$$

---

### 5.3 Port Target + Withdrawal Curve (Accelerated Cash-Out)
When a trader targets a retained desk balance $P$ at session $S$ and an extracted withdrawal $W$ by session $D$ ($1 \le D \le S$):

$$\text{Adjusted Challenge Summit } T_{\text{summit}} = P + W$$

#### 1. Baseline Desk Growth Component:
$$C_{\text{desk}}(s) = B \cdot \left(\frac{P}{B}\right)^{\frac{s - 1}{S - 1}}$$

#### 2. Withdrawal Accumulation Schedule ($W_{\text{accum}}(s)$):
- For sessions prior to or at withdrawal deadline ($s \le D$):
  $$W_{\text{accum}}(s) = \begin{cases} W \cdot \left(\frac{s - 1}{D - 1}\right) & \text{if } D > 1 \\ W & \text{if } D = 1 \end{cases}$$
- For sessions following the withdrawal deadline ($s > D$):
  $$W_{\text{accum}}(s) = W$$

#### 3. Total Target Wealth Calculation:
$$\text{Target}(s) = C_{\text{desk}}(s) + W_{\text{accum}}(s)$$

- At Session $1$: $\text{Target}(1) = B + 0 = B$
- At Session $D$: $\text{Target}(D) = C_{\text{desk}}(D) + W$ *(Withdrawal Checkpoint: Bank $W$ to Vault)*
- At Session $S$: $\text{Target}(S) = C_{\text{desk}}(S) + W = P + W = T_{\text{summit}}$

---

### 5.4 Tri-Pace Multipliers (Relaxed, Mid, Aggressive)
For any session target $T(s)$:
- **Relaxed Pace ($r$):**
  $$\text{Relaxed}(s) = T(s)$$
- **Mid Pace ($m$):**
  $$\text{Mid}(s) = \text{Round}_2\left(T(s) \times 1.15\right)$$
- **Aggressive Pace ($a$):**
  $$\text{Aggressive}(s) = \text{Round}_2\left(T(s) \times 1.30\right)$$

*(Note: For the Default 28-Session Preset, pre-calculated historical corridor values are utilized with flat consolidation plateaus at sessions 7–8, 14–15, and 21–22).*

---

### 5.5 Skim Mode Daily Increment Engine
Calculates the linear savings increase added to daily sessions:

$$\text{Daily Skim Rate} = \frac{W}{D}$$

When Skim Mode is active on a standard challenge:

$$\text{Active Target}(s, \text{pace}) = \text{Base Target}(s, \text{pace}) + \text{Daily Skim Rate}$$

---

### 5.6 Financial Requirement Daily Savings Run Rate
Calculates dynamic capital needed to satisfy real-world deadlines:

$$\text{Remaining To Bank} = \max\left(0, \text{Milestone Goal} - \text{Total Vault Banked}\right)$$

If an explicit deadline date is set:

$$\text{Days Left} = \left\lceil \frac{\text{Target Date} - \text{Current Date}}{86,400,000 \text{ ms}} \right\rceil$$

$$\text{Daily Run Rate} = \begin{cases} 
0 & \text{if Remaining} \le 0 \\
\frac{\text{Remaining}}{\text{Days Left}} & \text{if Days Left} > 0 \\
\text{Remaining} & \text{if Days Left} \le 0 \text{ (Due today / Overdue)} 
\end{cases}$$

If no calendar date is set, sessions remaining in the active ladder are used:

$$\text{Daily Run Rate} = \frac{\text{Remaining}}{\max\left(1, S - s + 1\right)}$$

---

### 5.7 Normalized PnL with Vault Extraction Invariance
To prevent Vault withdrawals from registering as trading losses:

$$\text{Session Skims}(s) = \sum_{v \in \text{VaultLedger}, v.\text{session} = s} v.\text{amount}$$

$$\text{Normalized Session PnL}(s) = \left(\text{Desk Balance}(s) + \text{Session Skims}(s)\right) - \text{Desk Balance}(s - 1)$$

$$\text{Session PnL \%}(s) = \left(\frac{\text{Normalized Session PnL}(s)}{\text{Desk Balance}(s - 1)}\right) \times 100$$

$$\text{Session Surplus / Deficit}(s) = \left(\text{Desk Balance}(s) + \text{Session Skims}(s)\right) - \text{Target}(s)$$

---

### 5.8 Cumulative Wealth, All-Time High Watermark & Max Drawdown
$$\text{Total Vault Banked} = \sum_{v \in \text{VaultLedger}} v.\text{amount}$$

$$\text{True Wealth}(s) = \text{Desk Balance}(s) + \text{Total Vault Banked}$$

$$\text{Cycle ROI \%} = \left(\frac{\text{True Wealth} - \text{Starting Base}}{\text{Starting Base}}\right) \times 100$$

#### Peak Watermark & Max Drawdown:
For logged sessions $i \in [1, \text{currentSession}]$:

$$\text{Historical Peak}(s) = \max_{1 \le i \le s} \left(\text{True Wealth}(i)\right)$$

$$\text{Drawdown Dollar}(s) = \text{Historical Peak}(s) - \text{True Wealth}(s)$$

$$\text{Max Drawdown (\%)} = \max_{1 \le i \le s} \left(\frac{\text{Drawdown Dollar}(i)}{\text{Historical Peak}(i)} \times 100\right)$$

---

### 5.9 Win Rate, Streaks & Profit Factor
For all sessions with a logged closing balance:
- **Green Session:** $\text{Normalized Session PnL} > 0.001$
- **Red Session:** $\text{Normalized Session PnL} < -0.001$
- **Flat Session:** $|\text{Normalized Session PnL}| \le 0.001$

$$\text{Win Rate \%} = \left(\frac{\text{Count}(\text{Green Sessions})}{\text{Total Sessions Logged}}\right) \times 100$$

$$\text{Gross Gains} = \sum \max(0, \text{Session PnL})$$

$$\text{Gross Losses} = \sum |\min(0, \text{Session PnL})|$$

$$\text{Profit Factor} = \begin{cases} 
\frac{\text{Gross Gains}}{\text{Gross Losses}} & \text{if Gross Losses} > 0 \\
\text{Gross Gains} & \text{if Gross Losses} = 0 
\end{cases}$$

---

## 6. Data Schemas & Local Storage Architecture

### 6.1 LocalStorage Keys & Data Types

| Storage Key | Data Type | Description |
|:---|:---:|:---|
| `pgl_session_v10` | `Number` | Currently active session integer ($1 \dots N$). |
| `pgl_desk_balances_v10` | `Object` | Map of session index to closing desk balance: `{ [sessionNum]: balance }`. |
| `pgl_session_timestamps_v10` | `Object` | Map of session index to ISO timestamp string. |
| `pgl_locked_sessions_v10` | `Object` | Map of session index to locked boolean: `{ [sessionNum]: true }`. |
| `pgl_session_notes_v10` | `Object` | Map of session index to trade notes: `{ [sessionNum]: string }`. |
| `pgl_pace_v10` | `String` | Selected pace: `'relaxed'`, `'mid'`, `'aggressive'`, or `'finreq'`. |
| `pgl_theme_v10` | `String` | Interface theme mode: `'light'` or `'dark'`. |
| `pgl_milestones_enabled_v10` | `String` | Boolean string `'true'` or `'false'`. |
| `pgl_milestone_cfg_v10` | `Object` | Configuration object for bill targets, deadline, and reserve floor. |
| `pgl_vault_ledger_v10` | `Array` | List of profit skim objects. |
| `pgl_ladder_profiles_v10` | `Array` | List of all configured challenge profile objects. |
| `pgl_active_profile_v10` | `String` | ID of the active profile (e.g., `'custom_1790829582706'`). |
| `pgl_skim_mode_v10` | `String` | Boolean string `'true'` or `'false'` for Skim Mode. |
| `pgl_firestore_key_v10` | `String` | Unique secret key for Firebase Firestore multi-device sync. |
| `pgl_webhook_url_v10` | `String` | Target Google Apps Script Web App URL. |
| `pgl_show_all_paces_v10` | `String` | Boolean string `'true'` or `'false'` for Master Ledger column view. |

---

### 6.2 Ladder Profile Schema

```json
{
  "id": "custom_1790829582706",
  "name": "14-Session Sprint + $500 Cash-Out",
  "base": 150.00,
  "portTarget": 2500.00,
  "withdrawalTarget": 500.00,
  "withdrawalDays": 7,
  "adjustedSummit": 3000.00,
  "dailySkimRate": 71.43,
  "curveType": "port_target_withdrawal",
  "skimMode": true,
  "sessions": [
    {
      "s": 1,
      "r": 150.00,
      "m": 150.00,
      "a": 150.00,
      "target": 150.00,
      "deskTarget": 150.00
    },
    {
      "s": 7,
      "r": 1049.57,
      "m": 1207.01,
      "a": 1364.44,
      "target": 1049.57,
      "deskTarget": 549.57,
      "withdrawalGoal": 500.00,
      "tag": "Cash-Out Checkpoint: Bank $500.00"
    },
    {
      "s": 14,
      "r": 3000.00,
      "m": 3450.00,
      "a": 3900.00,
      "target": 3000.00,
      "deskTarget": 2500.00
    }
  ]
}
```

---

### 6.3 Vault Ledger Entry Schema

```json
{
  "id": 1790830100452,
  "amount": 250.00,
  "dateTime": "2026-10-01T04:45:00.452Z",
  "deskAfter": 1100.00,
  "note": "Secured $250 profit to bill reserve",
  "session": 7
}
```

---

### 6.4 Milestone Configuration Schema

```json
{
  "targetGoal": 500.00,
  "targetDeadline": "2026-10-08",
  "reserveFloor": 1000.00,
  "strategy": "gradual"
}
```

---

### 6.5 Firestore Remote Document Payload Schema
Document path: `portfolios/{syncKey}`:

```json
{
  "ladderProfiles": [...],
  "activeProfileId": "custom_1790829582706",
  "sessionLogs": { "1": 150.00, "2": 185.50 },
  "sessionTimestamps": { "1": "2026-10-01T02:00:00Z" },
  "lockedSessions": { "1": true },
  "sessionNotes": { "1": "Clean execution on ES breakout" },
  "vaultLedger": [...],
  "currentSession": 2,
  "currentPace": "relaxed",
  "milestoneConfig": { ... },
  "skimModeEnabled": true,
  "updatedAt": "FieldValue.serverTimestamp()"
}
```

---

### 6.6 Google Sheets Webhook Payload Schema
Dispatched via HTTP POST with `Content-Type: text/plain;charset=utf-8` and `mode: 'no-cors'`:

```json
{
  "action": "fullSync",
  "activeProfileName": "14-Session Sprint + $500 Cash-Out",
  "currentSession": 2,
  "ladder": [...],
  "sessionLogs": { "1": 150.00, "2": 185.50 },
  "sessionTimestamps": { "1": "2026-10-01T02:00:00Z" },
  "sessionNotes": { "1": "Clean execution on ES breakout" },
  "vaultLedger": [...],
  "stats": {
    "totalSessions": 14,
    "completedSessions": 2,
    "winRate": 100,
    "trueWealth": 185.50,
    "totalVault": 0.00,
    "profitFactor": 3.5,
    "maxDrawdown": 0.00,
    "cycleRoi": 23.67
  }
}
```

---

## 7. Google Sheets Integration Guide (Apps Script)

The dashboard integrates with Google Sheets via a Google Apps Script Web App.

### Setup Instructions
1. Open a new or existing spreadsheet at [sheets.new](https://sheets.new).
2. Navigate to **Extensions > Apps Script**.
3. Replace all editor contents with the script provided in Tab 4 of the dashboard (or the template below).
4. Click **Deploy > New Deployment**.
5. Select **Web app** as deployment type:
   - **Execute as:** *Me (your Google account)*.
   - **Who has access:** *Anyone* (required for browser `fetch` access).
6. Click **Deploy**, authorize permissions, and copy the generated **Web App URL**.
7. Paste the URL into **Tab 4 (Settings) > Google Sheets Cloud Integration** in the dashboard and click **Save & Sync Now**.

### Apps Script Engine Capabilities
- **Fast Batch Operations:** Uses `sheet.getRange().setValues()` to batch-write hundreds of rows in under $200\text{ ms}$.
- **Multi-Tab Organization:** Automatically constructs and updates 3 distinct tabs:
  1. `Ladder`: Session execution table with Relaxed, Mid, and Aggressive tracks, currency formatting (`$#,##0.00`), and dark/light styled headers.
  2. `Vault`: Complete historical ledger of every withdrawal.
  3. `Stats`: High-level metrics report (Win Rate, Profit Factor, Peak Watermark, Cycle ROI).

---

## 8. Automated Verification & Test Suites

The project repository includes 5 comprehensive test suites located in `scratch/`:

1. **`verify_all.js` (Design System & DOM Integrity):**
   - Asserts 0 occurrences of disallowed pure white (`#fff`, `#ffffff`, `bg-white`) and pure black (`#000`, `#000000`, `text-black`).
   - Asserts 0 deprecated palette tokens.
   - Validates that every `document.getElementById` identifier in JavaScript matches a valid element in HTML.
   - Runs syntax validation across all script blocks.
2. **`test_runtime.js` (Core Application Lifecycle):**
   - Simulates initial page boot, pace card switching, balance entry logging, vault profit skimming, tab transitions, and theme toggling.
3. **`test_challenge_management.js` (Challenge Roadmaps):**
   - Verifies system behavior with zero challenges, custom challenge generation, multi-profile switching, profile deletion, and preset restoration.
4. **`test_day1_and_sheets.js` (Edge-Case Invariants):**
   - Verifies that Day 1 remains in an "Awaiting Balance" state before input without prematurely triggering goal completion.
   - Verifies Google Sheets webhook serialization.
5. **`test_withdrawal_strategy.js` (Withdrawal Engine & Skim Mode):**
   - Validates the `port target + withdrawal` mathematical formula.
   - Asserts checkpoint tagging at session $D$.
   - Asserts milestone config synchronization.
   - Tests Skim Mode toggle and session unlock functionality.

To execute the test suite:
```bash
node scratch/verify_all.js
node scratch/test_runtime.js
node scratch/test_challenge_management.js
node scratch/test_day1_and_sheets.js
node scratch/test_withdrawal_strategy.js
```
