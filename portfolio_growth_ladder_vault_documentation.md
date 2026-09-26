# Portfolio Growth Ladder & Capital Vault — Complete System Documentation

---

## 1. System Vision & Core Philosophy

The **Portfolio Growth Ladder & Capital Vault** is an execution dashboard engineered for disciplined trading compounding, capital protection, and real-world wealth extraction. 

Trading accounts starting with low capital (e.g., $\$120$–$\$150$) typically suffer from a severe psychological obstacle: as the account grows, traders either over-leverage to accelerate gains or freeze due to fear of losing paper profits, inevitably cycling between violent runs and total drawdowns.

This system resolves that breakdown through four operational pillars:
1. **Decoupled Execution Sessions:** Removes calendar pressure. Non-trading days, weekends, or travel breaks do not penalize streaks or distort metrics.
2. **Tri-Pace Compounding:** Visualizes three distinct risk corridors (**Relaxed**, **Mid**, and **Aggressive**) with built-in plateau/consolidation sessions.
3. **Smart Vault Skimming:** Decouples active trading capital from banked cash. Profits pulled out to pay real-world obligations (e.g., personal bills) do not count as trading drawdowns.
4. **Organic Editorial Design:** Replaces stressful, aggressive crypto/trading UI with a calm, tactile, editorial aesthetic that promotes patient execution.

---

## 2. Mathematical Foundation & Target Paces

The standard system is initialized from a **$\$120.00$ base capital** over **28 discrete trading sessions**.

### 2.1 The Tri-Pace Targets Matrix

| Session | Relaxed ($7,000 Finish) | Mid ($12,600 Finish) | Aggressive ($17,500 Finish) | Notes / Checkpoints |
|:---:|:---:|:---:|:---:|:---|
| **1** | $\$120.00$ | $\$120.00$ | $\$120.00$ | Starting Base Capital |
| **2** | $\$170.86$ | $\$188.45$ | $\$199.06$ | Initial Velocity Sprint |
| **3** | $\$243.29$ | $\$295.95$ | $\$330.19$ | |
| **4** | $\$346.41$ | $\$464.76$ | $\$547.72$ | |
| **5** | $\$493.24$ | $\$729.86$ | $\$908.56$ | |
| **6** | $\$702.31$ | $\$1,146.19$ | $\$1,507.12$ | |
| **7** | $\$1,000.00$ | $\$1,800.00$ | $\$2,500.00$ | **Stage 1 Milestone Checkpoint** |
| **8** | $\$1,000.00$ | $\$1,800.00$ | $\$2,500.00$ | **Consolidation / Skim Window (Flat)** |
| **9** | $\$1,140.43$ | $\$2,052.78$ | $\$2,851.09$ | Stage 2 Scaling Begins |
| **10** | $\$1,300.59$ | $\$2,341.06$ | $\$3,251.48$ | |
| **11** | $\$1,483.24$ | $\$2,669.83$ | $\$3,708.10$ | |
| **12** | $\$1,691.54$ | $\$3,044.77$ | $\$4,228.85$ | |
| **13** | $\$1,929.09$ | $\$3,472.36$ | $\$4,822.72$ | |
| **14** | $\$2,200.00$ | $\$3,960.00$ | $\$5,500.00$ | **Stage 2 Milestone Checkpoint** |
| **15** | $\$2,200.00$ | $\$3,960.00$ | $\$5,500.00$ | **Consolidation / Skim Window (Flat)** |
| **16** | $\$2,430.50$ | $\$4,374.90$ | $\$6,076.25$ | Stage 3 Scaling Begins |
| **17** | $\$2,685.15$ | $\$4,833.27$ | $\$6,712.87$ | |
| **18** | $\$2,966.48$ | $\$5,339.66$ | $\$7,416.20$ | |
| **19** | $\$3,277.29$ | $\$5,899.11$ | $\$8,193.21$ | |
| **20** | $\$3,620.65$ | $\$6,517.18$ | $\$9,051.64$ | |
| **21** | $\$4,000.00$ | $\$7,200.00$ | $\$10,000.00$ | **Stage 3 Milestone Checkpoint** |
| **22** | $\$4,000.00$ | $\$7,200.00$ | $\$10,000.00$ | **Consolidation / Skim Window (Flat)** |
| **23** | $\$4,391.03$ | $\$7,903.85$ | $\$10,977.57$ | Final Expansion Stretch |
| **24** | $\$4,820.28$ | $\$8,676.51$ | $\$12,050.71$ | |
| **25** | $\$5,291.50$ | $\$9,524.70$ | $\$13,228.76$ | |
| **26** | $\$5,808.79$ | $\$10,455.81$ | $\$14,521.96$ | |
| **27** | $\$6,376.64$ | $\$11,477.95$ | $\$15,941.59$ | |
| **28** | $\$7,000.00$ | $\$12,600.00$ | $\$17,500.00$ | **Final Cycle Target Finish** |

---

### 2.2 Mathematical Structure: Compounding Decay Curve

The ladder's compounding rate is heavily front-loaded and decays as account size grows, protecting capital from exponential sizing risks:

1. **Stage 1 (Sessions 1 $\rightarrow$ 7) — The Initial Sprint:**
   * Relaxed requirement: $+42.38\%$ compounded daily.
   * Mid requirement: $+57.05\%$ compounded daily.
   * Aggressive requirement: $+65.88\%$ compounded daily.
   * *Rationale:* At $\$120$, capital is small and must be accelerated quickly through high-conviction trades and active rotation.
2. **Consolidation Plateaus (Sessions 7–8, 14–15, 21–22):**
   * Rate requirement: **$0.00\%$** (flat target).
   * *Rationale:* Deliberate "cooling-off" sessions designed for profit taking, de-risking, and emotional recalibration.
3. **Stage 2 (Sessions 8 $\rightarrow$ 14):** Compounding rate drops to **$+14.04\%$** per active session.
4. **Stage 3 (Sessions 15 $\rightarrow$ 21):** Compounding rate drops to **$+10.49\%$** per active session.
5. **Stage 4 (Sessions 22 $\rightarrow$ 28):** Compounding rate drops to **$+9.76\%$** per active session.

---

## 3. Core Feature Architecture

The application is structured into three primary operational tabs plus background calculation engines.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MAIN NAVIGATION BAR                             │
│  [📈 Tracker]         [🏦 Financial Milestones]     [⚙️ Config & Ladder]│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ▼                            ▼                           ▼
 ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
 │ TRACKER TAB   │           │ MILESTONES TAB│           │ CONFIG TAB    │
 │ • Bal. Input  │           │ • Toggle Alert│           │ • Profile Pick│
 │ • Dynamic PnL │           │ • $1.5k Target│           │ • Math Gen    │
 │ • Delta & Base│           │ • $1k Reserve │           │ • Curve Types │
 │ • Win/Loss WR │           │ • Skim Ledger │           │ • Reset Tools │
 │ • Master TSV  │           │ • Vault Gauge │           │ • Preset Init │
 └───────────────┘           └───────────────┘           └───────────────┘
```

### 3.1 Tab 1: Active Tracker
* **Session Stepper & Selector:** Jump to any session ($1$ to $N$) via `‹` and `›` controls or by clicking ledger rows.
* **Auto-PnL Engine:**
  $$\text{Session PnL (\$)} = \text{Current Session Desk Balance} - \text{Previous Session Desk Balance}$$
  $$\text{Session PnL (\%)} = \left(\frac{\text{Session PnL}}{\text{Previous Session Desk Balance}}\right) \times 100$$
* **Cumulative Base Progress:**
  $$\text{Cumulative Base PnL} = \text{True Wealth} - \text{Base Capital (\$120.00)}$$
* **Target Deviation Delta:** Compares live balance against the chosen pace target for that specific session.
* **Win Rate & Streak Engine:** Fast `+ Win` and `+ Loss` buttons tracking overall win rate and dynamic winning/drawdown streaks.
* **Full Compounding Matrix Ledger:** Displays Session, Execution Timestamp, Desk Balance, Session PnL, Surplus, Target Tracks, and custom note editing. Includes a one-click **"Copy Ledger TSV"** button for pasting directly into Google Sheets or Excel.

---

### 3.2 Tab 2: Financial Requirement Milestone & Capital Vault
This module solves the immediate real-world requirement: **securing $\$1,500$ for bills while preserving $\$1,000$ in active trading capital**.

* **On/Off Feature Toggle:** Can be completely disabled when the trader is not paying bills, hiding alerts and indicators to keep the tracker lean.
* **Non-Punitive Skimming:** 
  $$\text{True Realized Wealth} = \text{Working Desk Balance} + \text{Banked Vault Cash}$$
  Moving capital into the Vault decreases active desk exposure without recording an artificial trading loss or hurting win-rate metrics.
* **Milestone Configuration:**
  * **Financial Target:** Editable cash goal (e.g., $\$1,500.00$).
  * **Desk Reserve Floor:** Minimum working capital required before or after skims (e.g., $\$1,000.00$).
  * **Skim Strategy Selector:**
    * *Gradual:* Proposes a $25\%$ skim on profitable sessions exceeding $\$30.00$.
    * *Checkpoints:* Triggers suggestions at key thresholds ($\$450 \rightarrow \text{skim } \$100$, $\$900 \rightarrow \text{skim } \$400$, $\$1,500 \rightarrow \text{skim } \$500$).
    * *Manual:* Trader defines extraction amounts on demand.
* **Vault Ledger & Progress Gauge:** Complete chronological record of every withdrawal with timestamps, destination notes, and remaining desk balance.

---

### 3.3 Tab 3: Config & Universal Ladder Generator
Allows generating custom compounding curves from scratch for any challenge parameters.

* **Profile Management:** Save multiple ladder presets (e.g., "Default 28-Session Tri-Pace", "$150 to $5K Sprint") and switch between them dynamically.
* **Universal Compounding Engine:**
  * **Inputs:** Starting Base ($\$X$), Final Goal Target ($\$Y$), Total Sessions ($N$), and Curve Model.
  * **Smooth Constant Compounding:**
    $$r_{\text{session}} = \left(\frac{Y}{X}\right)^{\frac{1}{N - 1}} - 1$$
    $$\text{Target}(s) = X \cdot (1 + r_{\text{session}})^{s - 1}$$
  * **Decaying Phased Curve:**
    $$p = \frac{s - 1}{N - 1}$$
    $$\text{Target}(s) = X \cdot \left(\frac{Y}{X}\right)^{p^{0.72}}$$
    *(Accelerates growth in early low-capital sessions, smoothing into conservative requirements in late stages).*
* **Lifecycle & Reset Tools:**
  * Reset active session progress back to Session 1 while keeping target curves intact.
  * Clear Vault history.
  * Restore system default 28-session presets.

---

## 4. UI/UX Design System: Organic Editorial Aesthetic

The interface intentionally rejects flashy, high-contrast "crypto dashboard" conventions in favor of a calm, grounded, tactile aesthetic:

| Design Element | Specification | Semantic Purpose |
|:---|:---|:---|
| **Canvas Background** | `#FBF9F5` (Linen Stone) | Low-eyestrain warm organic canvas |
| **Grid Pattern** | Radial dots (`#E8E0D5`, $24\text{px}$ pitch) | Subtle technical alignment texture |
| **Card Surfaces** | `#FFFFFF` with `#E7DFD5` borders | Clean modular separation with soft shadow |
| **Editorial Serif** | `Newsreader` (Google Fonts) | Headings, milestone titles, and reflective text |
| **Modern Grotesque** | `Plus Jakarta Sans` | Body text, navigational elements, tooltips |
| **Monospace / Num** | `Space Grotesk` (tabular numbers) | Financial figures, balance inputs, calculations |
| **Primary Positive** | `#2D5A43` (Deep Earth Sage) | Relaxed track, positive PnL, surplus markers |
| **Warning / Skim** | `#85531B` (Burnished Amber Clay) | Vault cash, Mid track, skim notifications |
| **Drawdown / Alert** | `#9C412E` (Warm Terracotta) | Aggressive track, negative PnL, loss badges |

---

## 5. External Integrations & Webhook Architecture

To allow seamless synchronization with external spreadsheets, a dedicated **Google Apps Script Webhook** (`Code.gs`) handles two modes of data transfer:

### 5.1 Two-Way Synchronization Capabilities
1. **Direct Browser Visit Handling (`doGet`):**
   * Redirects direct browser navigations straight to the master Google Sheet.
2. **Full Multi-Tab Sync (`doPost` with `action: "fullSync"`):**
   * **Tab 1 ("Ladder"):** Builds a styled 28-session execution sheet with headers, currency formatting, and conditional color bands.
   * **Tab 2 ("Vault"):** Generates a dedicated extraction ledger detailing all banked cash, destination notes, and true realized wealth.
   * **Tab 3 ("Stats"):** Computes high-level performance metrics: Win Rate, Profit Factor, Gross Gains vs. Gross Losses, Peak Portfolio High-Watermark, Max Drawdown, and True Cycle ROI.
3. **Single-Day Auto-Update (`doPost` default):**
   * Performs an in-place cell update for the specific session row without rewriting the entire sheet.

---

## 6. Deployment & Hosting Guide

The web application is built strictly under the **Single-File Mandate** (`index.html`), containing all structural markup, Tailwind CSS configurations, and vanilla JavaScript logic.

### 6.1 Instant Free Hosting Options
* **GitHub Pages:**
  1. Create a repository on GitHub (e.g., `portfolio-ladder`).
  2. Commit `index.html` to the repository root.
  3. Navigate to **Settings > Pages > Branch: `main` > Save**.
  4. The site will publish live at `https://<username>.github.io/portfolio-ladder/`.
* **Netlify Drop:**
  1. Place `index.html` in an empty folder on your desktop.
  2. Drag and drop the folder into **[app.netlify.com/drop](https://app.netlify.com/drop)**.
  3. Provides an instant live `.netlify.app` production link.
* **Local Offline Execution:**
  * Double-click `index.html` to run locally in any modern browser (Chrome, Safari, Brave, Edge). All state persists permanently in browser `localStorage`.