# Portfolio Growth Ladder & Capital Vault — Master System Manual
**The Complete Technical, Mathematical, and Operational Guide**

---

## Table of Contents
1. [Executive Overview & Trading Philosophy](#1-executive-overview--trading-philosophy)
   - [1.1 Simplified Strategy Language & Terminology Guide](#11-simplified-strategy-language--terminology-guide)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Design System & Interface Ergonomics](#3-design-system--interface-ergonomics)
4. [Master Features Breakdown by Module (The 5 Canonical Sections)](#4-master-features-breakdown-by-module)
   - [4.1 Global Header & Cloud Sync Hub](#41-global-header--cloud-sync-hub)
   - [4.2 True Realized Wealth & Hero Banner](#42-true-realized-wealth--hero-banner)
   - [4.3 Section 1: Setup](#43-section-1-setup)
   - [4.4 Section 2: Daily Tracker](#44-section-2-daily-tracker)
   - [4.5 Section 3: Trading Sessions](#45-section-3-trading-sessions)
   - [4.6 Section 4: Capital Vault](#46-section-4-capital-vault)
   - [4.7 Section 5: Stats & Performance](#47-section-5-stats--performance)
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
   - [5.10 Bills Breakdown Daily & Per-Session Set-Aside Engine](#510-bills-breakdown-daily--per-session-set-aside-engine)
   - [5.11 Trade Journal Realized PnL & Performance Analytics Engine](#511-trade-journal-realized-pnl--performance-analytics-engine)
   - [5.12 Total Financial Goal Engine (Combined Goal across Trading, Savings, and Bills)](#512-total-financial-goal-engine-combined-goal-across-trading-savings-and-bills)
6. [Data Schemas & Local Storage Architecture](#6-data-schemas--local-storage-architecture)
   - [6.1 LocalStorage Keys & Data Types](#61-localstorage-keys--data-types)
   - [6.2 Ladder Profile Schema](#62-ladder-profile-schema)
   - [6.3 Vault Ledger Entry Schema](#63-vault-ledger-entry-schema)
   - [6.4 Milestone Configuration Schema](#64-milestone-configuration-schema)
   - [6.5 Bills Breakdown Item Schema](#65-bills-breakdown-item-schema)
   - [6.6 Trade Journal Entry Schema](#66-trade-journal-entry-schema)
   - [6.7 Firestore Remote Document Payload Schema](#67-firestore-remote-document-payload-schema)
   - [6.8 Google Sheets Webhook Payload Schema](#68-google-sheets-webhook-payload-schema)
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

### 1.1 Simplified Strategy Language & Terminology Guide

To make the system effortless to understand, the dashboard replaces complex institutional financial jargon with natural English terminology:

| Institutional / Jargon Term | Simplified Natural English | Description & Purpose |
|:---|:---|:---|
| **Baseline trajectory** | **Original growth plan** | The mathematically pure compounding roadmap set when creating the challenge. |
| **Rebased trajectory** | **Updated plan from current balance** | Recalculates remaining session targets from your latest closing balance to reach the final goal. |
| **Session PnL** | **Today's profit / loss** | Net dollar amount earned or lost during the active session. |
| **Normalized PnL** | **Actual profit / loss** | Day profit calculated with total vault skims credited back, preserving accurate performance. |
| **Financial run rate** | **Amount needed per day** | Target dollar amount to bank per day or session to fund upcoming expenses or milestones. |
| **Summit / Summit Goal** | **Final target** | The ultimate dollar destination of the active challenge cycle. |
| **Variance / Deficit** | **Ahead or behind** | Dollar difference between your closing balance and the session's required target. |
| **Cumulative withdrawals** | **Total money taken out** | Aggregate profits permanently moved off the trading desk into protected Vault reserves. |
| **Portfolio retention** | **Trading desk target** | Capital intentionally kept on the trading desk to continue compounding. |
| **Realized PnL** | **Profit / loss from completed trades** | Net profit or loss from trades that have been closed and exited. |
| **Active target** | **Current target** | The exact dollar threshold for the active session and selected growth pace. |
| **Decay curve** | **Gradual growth plan** | A growth trajectory featuring higher early velocity that steadily levels off. |
| **Tri-pace** | **Three growth plans** | The three parallel operating tracks: Relaxed, Mid, and Aggressive. |

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

### 4.3 Section 1: Setup

The **Setup** section configures and manages the trading challenge. Designed around simplicity, it presents only essential inputs and converts into a concise summary once a challenge is active.

```
+------------------------------------------------------------------------+
|                         SECTION 1: SETUP                               |
|                                                                        |
|   Active Challenge Summary Card:                                       |
|   * Starting Balance ($)  * Target Portfolio Balance ($)               |
|   * Current Progress (Session X of Y, % to Goal) * Multiplier (X.Xx)   |
|   * Estimated Finish Date * Action: [Edit Settings] [+ New Challenge] |
|                                                                        |
|   Challenge Configuration Form (Shown on new / edit):                  |
|   * Essential Inputs Only: Name, Starting Bal, Target Bal,             |
|     Start Date, Duration (Sessions)                                    |
|   * Collapsed Optional Details: Bill/Cash-out goal, strategy type,     |
|     Skim Mode toggle, live projection preview                          |
|   * Editing Settings preserves historical records, trade logs,         |
|     and locked sessions without resetting progress                     |
|                                                                        |
|   Cloud Synchronization & Spreadsheet Integration:                     |
|   * Collapsed Firebase Firestore credentials & status                  |
|   * Collapsed Google Sheets Webhook URL & copy script tool             |
|   * Collapsed Data Management, CSV exports & challenge reset tools     |
+------------------------------------------------------------------------+
```

#### Core Setup Rules
- **Concise Active Summary:** Active challenge details appear in a compact 4-card overview bar.
- **Progress Preservation:** Editing challenge settings recomputes session pacing curves while preserving all historical session logs, timestamps, notes, and trade journals.
- **Default Load State:** If an active challenge exists, the dashboard loads directly into the **Daily Tracker**. If no challenge exists, it opens to **Setup**.

---

### 4.4 Section 2: Daily Tracker

The **Daily Tracker** is the primary operational console of the application, designed to let traders understand their position and log closing balances in seconds.

```
+------------------------------------------------------------------------+
|                      SECTION 2: DAILY TRACKER                          |
|                                                                        |
|   Current Position Top Bar (5 Key KPI Cards):                          |
|   +--------------+--------------+--------------+-----------+---------+ |
|   | Current Bal  | Today's PnL  | Overall PnL  | Target %  | Session | |
|   | $150.00      | +$30.00      | +$30.00      | 2.1%      | S1 / 28 | |
|   +--------------+--------------+--------------+-----------+---------+ |
|                                                                        |
|   Daily Execution Station:                                             |
|   * One primary input for Closing Portfolio Balance                    |
|   * Prominent "Save Session" button (locks & confirms balance)         |
|   * Collapsed "+ Add session notes" field (auto-saved & synced)        |
|   * Fast "Fill Target" action button                                   |
|                                                                        |
|   Three Growth Plans Comparison:                                       |
|   * Compact corridor comparing Relaxed, Mid, and Aggressive targets    |
|   * Visual indicators showing whether today's balance met the target   |
|                                                                        |
|   Weekly Progress Bar & Shortfall Averted Guidance:                    |
|   * Displays progress toward current 7-session checkpoint              |
|   * Calculates ahead / behind status without false drawdown alarms     |
+------------------------------------------------------------------------+
```

#### Operational Workflow
1. Open the app (automatically lands on Daily Tracker).
2. Check the 5 Current Position cards at a glance.
3. Enter today's closing balance into the primary input.
4. Optionally expand notes to record market observations or discipline checks.
5. Click **Save Session** - balance locks, timestamps save, and cloud sync broadcasts instantly.

---

### 4.5 Section 3: Trading Sessions

The **Trading Sessions** tab provides an observational trading journal for logging individual trade executions without affecting the portfolio growth ladder.

```
+------------------------------------------------------------------------+
|                    SECTION 3: TRADING SESSIONS                         |
|                                                                        |
|   [Session Selector: Session 1 v]       [+ Log Trade Button]           |
|  +----------------------+----------------------+--------------------+  |
|  | Starting Balance     | Trades Profit / Loss | Trades Logged      |  |
|  | $120.00              | +$33.50 (+33.5% avg) | 2 Wins / 0 Losses  |  |
|  +----------------------+----------------------+--------------------+  |
|                                                                        |
|   Session Trades Table:                                                |
|   * Sequential Generic Labels: Trade A, Trade B, Trade C...            |
|   * Entry Amount ($), Exit Value ($), Brokerage Fees ($)               |
|   * Realized Profit/Loss ($) & Return (%) per trade                    |
|   * Position Status: Closed, Partially Closed, or Open                 |
|                                                                        |
|   Overall Performance Analytics (All Sessions Combined):               |
|   * Total Realized PnL ($)  * Total Trades Logged & Open Positions     |
|   * Win / Loss Ratio        * Win Rate (%)  * Average Return (%)       |
+------------------------------------------------------------------------+
```

#### Core Journaling Principles
- **Strict Decoupling from Ladder Targets:** Logging a trade in this tab is an observational journal tool. It never mutates active desk capital, historical daily logs, or ladder compounding curves.
- **Generic Sequential Naming:** Trades in a given session are automatically assigned sequential labels (`Trade A`, `Trade B`, ...).
- **Open Trade Handling:** Open positions are flagged and their unrealized equity is explicitly excluded from realized profit/loss and win rate metrics until closed.

---

### 4.6 Section 4: Capital Vault

The **Capital Vault** manages all money outside the active trading portfolio, structured into three clearly separated, compact areas:

```
+------------------------------------------------------------------------+
|                       SECTION 4: CAPITAL VAULT                         |
|                                                                        |
|   Consolidated Summary Bar (4 Unified KPI Cards):                      |
|   +--------------+--------------+--------------+---------------------+ |
|   | Total Vault  | Bills Res.   | Savings Res. | Total True Wealth   | |
|   | $0.00        | $0.00 / $0   | $0.00        | $120.00             | |
|   +--------------+--------------+--------------+---------------------+ |
|                                                                        |
|   Area 1: Bills Breakdown & Planning                                   |
|   * Individual bill entries: Name, Amount Due, Due Date, Priority,     |
|     Amount Reserved, Status (Unfunded, Partial, Funded, Paid), Notes   |
|   * Calendar Days vs Trading Sessions set-aside calculation            |
|   * Set-aside suggestions: (Remaining Due / Time Units Left)           |
|   * Informational reference comparison with available skim             |
|   * Action to mark paid without duplicating withdrawal records         |
|                                                                        |
|   Area 2: Withdrawals & Transfers                                      |
|   * Simple transfer form to move profits into vault buckets            |
|   * Completed withdrawals & cash-outs audit history table              |
|                                                                        |
|   Area 3: Savings & Capital Safety                                     |
|   * Accumulated savings balance protected from trading risk           |
|   * 3 Capital Safety Milestones: Initial Recouped, Cushion, Goal Met   |
|   * Collapsed optional Vault planning & pacing settings                |
+------------------------------------------------------------------------+
```

---

### 4.7 Section 5: Stats & Performance

The **Stats & Performance** section reviews past results and analyzes progress toward the challenge goal, organized into four clean analytical groups:

```
+------------------------------------------------------------------------+
|                   SECTION 5: STATS & PERFORMANCE                       |
|                                                                        |
|   Rank & Discipline Banner: Level, Rank Title, Green Streak, Grade     |
|                                                                        |
|   1. Portfolio Growth & Trajectory:                                    |
|   * Goal Reach (%) toward final target                                 |
|   * Peak Capital Watermark (All-time high true wealth)                 |
|   * Net Profit generated above initial deposit                         |
|   * Daily Average session gain                                         |
|                                                                        |
|   2. Performance & Risk Analytics:                                     |
|   * Green Session Win Rate (%) & profitable session count              |
|   * Maximum Drawdown ($ and %) peak-to-trough retracement              |
|   * Profit Factor (Gross gains / Gross losses)                         |
|   * Best Session Gain ($ and session peak)                             |
|                                                                        |
|   3. Consistency & Pace Adherence:                                     |
|   * Pace Target Mastery distribution (Relaxed, Mid, Aggressive, Below) |
|   * Climber's Compass: Personalized algorithmic trading guidance       |
|   * Challenge Milestones & 7 Gamified Achievement Badges               |
|                                                                        |
|   4. Financial Overview:                                               |
|   * Total Cash Banked in Safe Vault                                    |
|   * Total Return on Investment (ROI %)                                 |
|   * Long-Term Savings Fortress Balance                                 |
|   * Active Trading Desk Balance                                        |
+------------------------------------------------------------------------+
```

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

### 5.10 Bills Breakdown Daily & Per-Session Set-Aside Engine

For each bill entry $b$ with amount due $A_b$ and amount reserved $R_b$:

$$\text{Remaining}(b) = \max\left(0, A_b - R_b\right)$$

#### 1. Calendar Days Basis:
Let $\Delta t$ be calendar days remaining until the bill's due date:

$$\Delta t = \left\lceil \frac{\text{Due Date} - \text{Today}}{86,400,000 \text{ ms}} \right\rceil$$

$$\text{Suggested Set-Aside}(b) = \begin{cases}
0 & \text{if Status} = \text{'paid'} \lor \text{Remaining} \le 0 \\
\text{Remaining}(b) & \text{if } \Delta t \le 1 \text{ (Due today, overdue, or tomorrow)} \\
\frac{\text{Remaining}(b)}{\Delta t} & \text{if } \Delta t > 1
\end{cases}$$

#### 2. Trading Sessions Basis:
Let $S_b$ be the target trading session and $s$ be the active trading session:

$$\Delta s = \max\left(1, S_b - s + 1\right)$$

$$\text{Suggested Per-Session Set-Aside}(b) = \begin{cases}
0 & \text{if Status} = \text{'paid'} \lor \text{Remaining} \le 0 \\
\frac{\text{Remaining}(b)}{\Delta s} & \text{otherwise}
\end{cases}$$

---

### 5.11 Trade Journal Realized PnL & Performance Analytics Engine

For each logged trade $t$ with entry amount $E_t$, exit value $X_t$, brokerage fees $F_t$, and status $S_t$:

$$\text{Realized PnL}(t) = \begin{cases}
0 & \text{if } S_t = \text{'open'} \\
X_t - E_t - F_t & \text{if } S_t \in \{\text{'closed'}, \text{'partial'}\}
\end{cases}$$

$$\text{Return \%}(t) = \begin{cases}
0 & \text{if } S_t = \text{'open'} \lor E_t \le 0 \\
\left(\frac{\text{Realized PnL}(t)}{E_t}\right) \times 100 & \text{otherwise}
\end{cases}$$

#### Aggregate Journal Metrics (Closed Trades Only):
Let $\mathcal{C} = \{t \mid S_t \in \{\text{'closed'}, \text{'partial'}\}\}$:

$$\text{Total Realized PnL} = \sum_{t \in \mathcal{C}} \text{Realized PnL}(t)$$

$$\text{Win Rate \%} = \left(\frac{|\{t \in \mathcal{C} \mid \text{Realized PnL}(t) > 0.001\}|}{|\mathcal{C}|}\right) \times 100$$

$$\text{Average Return \%} = \frac{1}{|\mathcal{C}|} \sum_{t \in \mathcal{C}} \text{Return \%}(t)$$

---

### 5.12 Total Financial Goal Engine (Combined Goal across Trading, Savings, and Bills)

The **Total Financial Goal** brings together the user's three primary financial targets into a unified planning summary without cross-contaminating accounts or executing automatic transfers:

$$\text{Total Financial Goal} = T_{\text{trading}} + T_{\text{savings}} + T_{\text{bills}}$$

Where:
- $T_{\text{trading}}$: Target configured for the active trading challenge.
- $T_{\text{savings}}$: Separately configured savings reserve goal (`milestoneConfig.targetGoal`).
- $T_{\text{bills}}$: Total bill requirement for the relevant period ($\sum b_i.\text{amountDue}$ across active bills).

#### Category Contribution & Achievement Formulas:
1. **Trading Portfolio:**
   - Balance: $B_{\text{trading}} = \text{Current Desk Balance}$
   - Achieved: $A_{\text{trading}} = \min(T_{\text{trading}}, \max(0, B_{\text{trading}}))$
   - Remaining: $R_{\text{trading}} = \max(0, T_{\text{trading}} - B_{\text{trading}})$
   - Surplus: $S_{\text{trading}} = \max(0, B_{\text{trading}} - T_{\text{trading}})$

2. **Savings Reserve:**
   - Balance: $B_{\text{savings}} = \text{Total Vault Savings Banked}$
   - Achieved: $A_{\text{savings}} = \min(T_{\text{savings}}, \max(0, B_{\text{savings}}))$
   - Remaining / Deficit: $R_{\text{savings}} = \max(0, T_{\text{savings}} - B_{\text{savings}})$
   - Surplus: $S_{\text{savings}} = \max(0, B_{\text{savings}} - T_{\text{savings}})$

3. **Bills Obligations:**
   - Achieved: $A_{\text{bills}} = \sum \min(b_i.\text{amountDue}, b_i.\text{status} = \text{'paid'} \ ? \ b_i.\text{amountDue} : b_i.\text{amountReserved})$
   - Remaining Outstanding: $R_{\text{bills}} = \max(0, T_{\text{bills}} - A_{\text{bills}})$

#### Combined Metrics & Progress Percentage:
$$\text{Total Achieved} = A_{\text{trading}} + A_{\text{savings}} + A_{\text{bills}}$$

$$\text{Total Remaining} = R_{\text{trading}} + R_{\text{savings}} + R_{\text{bills}}$$

$$\text{Overall Progress \%} = \begin{cases} 
0 & \text{if } \text{Total Financial Goal} \le 0 \\
\left(\frac{\text{Total Achieved}}{\text{Total Financial Goal}}\right) \times 100 & \text{otherwise}
\end{cases}$$

#### Strict Accounting Safeguards:
- **No Automatic Transfers:** A savings deficit or bill requirement never triggers automated withdrawals from trading desk balance.
- **No Double Counting:** Recording a bill payment marks the bill as covered without creating a duplicate withdrawal from the desk.
- **Independent Surplus Retention:** Savings or trading surpluses remain in their respective accounts.

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
| `pgl_bills_breakdown_v10` | `Array` | List of individual expense bill objects. |
| `pgl_bills_basis_v10` | `String` | Pacing basis for bills set-aside: `'days'` or `'sessions'`. |
| `pgl_trade_logs_v10` | `Array` | List of trade journal entry objects. |
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

### 6.5 Bills Breakdown Item Schema

Each individual bill in `pgl_bills_breakdown_v10`:

```json
{
  "id": 1790831000000,
  "name": "Apartment Rent",
  "amountDue": 1200.00,
  "amountReserved": 400.00,
  "dueDate": "2026-10-15",
  "priority": "high",
  "status": "partial",
  "notes": "Due by 15th via electronic transfer"
}
```

---

### 6.6 Trade Journal Entry Schema

Each logged trade in `pgl_trade_logs_v10`:

```json
{
  "id": 1790832000000,
  "session": 1,
  "label": "Trade A",
  "date": "2026-10-01",
  "status": "closed",
  "entryAmount": 100.00,
  "exitValue": 135.00,
  "fees": 1.50,
  "notes": "Clean breakout retest, locked in profit"
}
```

---

### 6.7 Firestore Remote Document Payload Schema
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
  "billsBreakdown": [...],
  "billsBasis": "days",
  "tradeLogs": [...],
  "updatedAt": "FieldValue.serverTimestamp()"
}
```

---

### 6.8 Google Sheets Webhook Payload Schema
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
