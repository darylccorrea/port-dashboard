# Master Styling Spec
**Portfolio Growth Ladder & Capital Vault System**
*Design Tokens, Visual Architecture, Micro-Interactions, Vectors, and UI Component Specifications*

---

## 1. Visual Philosophy & Design Identity

### 1.1 Tactile Art-Directed Foundations
The Portfolio Growth Ladder & Capital Vault is styled with an **expressive, grounded, and tactile natural aesthetic**. It replaces clinical corporate dashboards (sterile whites, generic grays, harsh neon blues) with an organic materiality reminiscent of fine textured paper, natural clays, forest moss, sunlit amber, and volcanic obsidian.

Key visual mandates:
1. **No Cold Whites or Grays:** Pure `#FFFFFF` canvas backgrounds and cold blue-grays (`#64748B`, `#1E293B`) are strictly avoided. The light theme uses a warm luminous paper canvas (`#FAF7F2`), while the dark theme uses an obsidian charcoal and forest green base (`#0F1411`).
2. **The Bento-Box Architecture:** Every functional group is enclosed in rounded bento-box containers (`.bento-card`) featuring clean hairline borders, warm subtle elevation shadows, and generous internal padding.
3. **Typographic Rhythm:** Clean contemporary humanist sans-serif (`Plus Jakarta Sans`) is paired with high-precision tabular grotesque numerals (`Space Grotesk`) to guarantee unshakeable decimal alignment in financial data.
4. **Tactile Interaction Physics:** Buttons, chips, and interactive cards provide instant physical feedback—rising slightly on hover and compressing with a subtle scale decrement on press (`scale-98`).

---

## 2. Comprehensive Color Token Architecture

### 2.1 Foundation Neutrals

| Token Name | CSS Custom Property | Light Mode Hex | Dark Mode Hex | Functional Description |
| :--- | :--- | :--- | :--- | :--- |
| **App Canvas** | `--app-bg` / `--bg-canvas` | `#FAF7F2` | `#0F1411` | Primary viewport background canvas. |
| **Sidebar Canvas** | `--sidebar-bg` / `--bg-secondary` | `#F2EDE4` | `#131A15` | Desktop sidebar and mobile sticky navigation header. |
| **Surface Card** | `--surface` / `--bg-card` | `#FFFFFF` | `#19221D` | Bento cards, modals, table surfaces, elevated containers. |
| **Surface Raised** | `--surface-raised` | `#FFFFFF` | `#222D26` | Higher elevation dropdowns, active navigation pills. |
| **Surface Subtle** | `--surface-subtle` / `--bg-elevated` | `#F5EFE6` | `#151C17` | Sub-tab switchers, input backgrounds, nested metric chips. |
| **Surface Hover** | `--surface-hover` | `#EDE6DA` | `#28362E` | Hover highlight on buttons, table rows, and list items. |
| **Hairline Border** | `--border` / `--border-divider` | `#E5DED2` | `#26342B` | Standard container outlines, divider rules, and separators. |
| **Strong Border** | `--border-strong` | `#D4C9BA` | `#384C3F` | Active hover outlines, table headers, emphasis borders. |
| **Focus Border** | `--border-focus` | `#2E9D68` | `#4EBA88` | Active input outline state and focus indicator. |

---

### 2.2 Typography Color Tokens

| Token Name | CSS Custom Property | Light Mode Hex | Dark Mode Hex | Usage Hierarchy |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Text** | `--text-primary` | `#1C1917` | `#F7F5F0` | Main headings, big dollar balances, active tab labels, card titles. |
| **Secondary Text** | `--text-secondary` | `#5C5549` | `#B2ABA0` | Subtitles, body descriptions, table headers, session labels. |
| **Muted Text** | `--text-muted` | `#8C8273` | `#7E776C` | Micro-captions, timestamps, disabled hints, helper texts. |

---

### 2.3 Expressive Semantic Accents

Semantic pigments are inspired by botanical forest elements, warm minerals, and earthy clays:

| Semantic Role | Accent Name | CSS Variable | Light Hex | Dark Hex | Tint Background (Light / Dark) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profit / Growth / Relaxed Pace** | **Mint (Moss)** | `--mint` / `--accent` | `#2E9D68` | `#4EBA88` | `rgba(46, 157, 104, 0.12)` / `rgba(78, 186, 136, 0.16)` |
| **Warning / Target / Mid Pace** | **Amber (Ochre)** | `--amber` | `#D97706` | `#F59E0B` | `rgba(217, 119, 6, 0.12)` / `rgba(245, 158, 11, 0.16)` |
| **Journal / Aggressive Pace / TFG** | **Lavender (Plum)** | `--lavender` | `#7C69AF` | `#A78BFA` | `rgba(124, 105, 175, 0.12)` / `rgba(167, 139, 250, 0.16)` |
| **Bills / Drawdown / Danger** | **Coral (Clay)** | `--coral` | `#DC4C3E` | `#F87171` | `rgba(220, 76, 62, 0.12)` / `rgba(248, 113, 113, 0.16)` |
| **Cloud Sync / Spreadsheets** | **Sky (Dusty Blue)** | `--sky` | `#4A88A9` | `#60A5FA` | `rgba(74, 136, 169, 0.12)` / `rgba(96, 165, 250, 0.16)` |

---

### 2.4 Tactile Elevation Shadows

| Shadow Token | CSS Property | Light Mode Definition | Dark Mode Definition |
| :--- | :--- | :--- | :--- |
| **Subtle** | `--shadow-subtle` | `0 1px 3px rgba(28, 25, 23, 0.04), 0 1px 2px rgba(28, 25, 23, 0.02)` | `0 1px 3px rgba(0, 0, 0, 0.35)` |
| **Card** | `--shadow-card` | `0 4px 14px -2px rgba(28, 25, 23, 0.06), 0 2px 4px -1px rgba(28, 25, 23, 0.03)` | `0 4px 16px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)` |
| **Lift / Hover** | `--shadow-lift` | `0 10px 24px -4px rgba(28, 25, 23, 0.09), 0 4px 8px -2px rgba(28, 25, 23, 0.04)` | `0 12px 28px -4px rgba(0, 0, 0, 0.65), 0 4px 8px -2px rgba(0, 0, 0, 0.4)` |

---

## 3. Typography Specifications

### 3.1 Font Families

1. **Primary Interface Font:** `'Plus Jakarta Sans'`, `-apple-system`, `BlinkMacSystemFont`, `Roboto`, `sans-serif`
   * *Role:* Headings, navigation links, labels, body text, button labels.
   * *Weights Loaded:* `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold / Black).
2. **Financial Numeral Font (`.font-num`):** `'Space Grotesk'`, `-apple-system`, `monospace`
   * *Role:* Currency balances, PnL values, percentages, session counters, calendar numbers.
   * *Feature Flags:* `font-feature-settings: "tnum" 1, "cv05" 1; font-variant-numeric: tabular-nums;`
   * *Guarantee:* All digits (0–9), periods, and commas share identical character widths, eliminating visual jitter during live updates.
3. **Cursive Decorative Accent Font:** `'Georgia'`, `'Cambria'`, `serif`
   * *Role:* Atmospheric editorial quotes (e.g., Vault banner quote).
   * *Style:* `font-style: italic; font-weight: 500;`

### 3.2 Type Hierarchy Scale

| Level | Size Class | Equivalent Pixels | Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `text-3xl` / `text-4xl` | 30px / 36px | Tight (1.15) | 800 (Black) | `-0.025em` |
| **Header 1 / Page Title**| `text-2xl` | 24px | Snug (1.2) | 800 (Black) | `-0.02em` |
| **Header 2 / Card Title**| `text-base` / `text-lg` | 16px / 18px | Normal (1.3) | 700 (Bold) | `-0.01em` |
| **Section Subtitle** | `text-xs` / `text-sm` | 12px / 14px | Normal (1.4) | 500 (Medium) | Normal |
| **Body Text** | `text-xs` | 12px | Relaxed (1.5) | 400 (Regular) | Normal |
| **Micro Caption / Chips**| `text-[10px]` / `text-[11px]` | 10px / 11px | Tight (1.2) | 700 (Bold) | `+0.05em` (Uppercase) |
| **Metric Value** | `text-xl` / `text-2xl` | 20px / 24px | Tight (1.1) | 800 (Black, font-num) | `-0.02em` |

---

## 4. Layout, Grid & Spatial Architecture

### 4.1 Master Application Shell
* **Desktop Layout (`lg:flex`):**
  * Persistent Left Sidebar: Width `w-64` (256px) or `xl:w-72` (288px), fixed sticky positioning (`h-screen`, `sticky top-0`).
  * Main Content Area: Flexible `flex-1 min-w-0`, with adaptive container width `max-w-7xl mx-auto`.
* **Mobile / Tablet Layout (`lg:hidden`):**
  * Sticky App Bar: Height ~54px, backdrop blur `backdrop-blur-md`, hamburger navigation trigger on the left, brand mark in center, theme toggle on right.
  * Slide-Out Navigation Drawer: Fixed inset-y-0 overlay with dark backdrop blur (`bg-[#29241E]/60`).

### 4.2 Bento Card Geometry
All primary containers adhere to the `.bento-card` design pattern:
* **Background:** `var(--surface)`
* **Border:** `1px solid var(--border)`
* **Corner Radius:** `rounded-2xl` (16px / `1rem`)
* **Box Shadow:** `var(--shadow-card)`
* **Transitions:** `transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease-out`
* **Internal Padding Standard:**
  * Compact cards: `p-3.5` (14px)
  * Standard metric cards: `p-4 sm:p-5` (16px to 20px)
  * Major feature panels: `p-5 sm:p-6 lg:p-8` (20px to 32px)

### 4.3 Border Radius System

| Radius Token | Tailwind Class | Pixel Value | Applied Components |
| :--- | :--- | :--- | :--- |
| **Micro** | `rounded-md` | 6px | Small dropdown items, indicator dots. |
| **Small** | `rounded-lg` | 8px | Action icons, table cells, date badge selectors. |
| **Medium** | `rounded-xl` | 12px | Navigation buttons, text inputs, metric sub-cards. |
| **Large** | `rounded-2xl` | 16px | Bento cards, modal dialogs, top position bar. |
| **Extra Large** | `rounded-3xl` | 24px | Hero banners, Vault header banner. |
| **Pill** | `rounded-full` | 9999px | Status badges, step circles, pace buttons, lock tags. |

### 4.4 Spacing Scale
The layout follows a strict 4px base increment:
* `gap-1.5` (6px): Icon to text spacing within badges and chips.
* `gap-2.5` (10px): Sub-tab button spacing, action bar buttons.
* `gap-3.5` / `gap-4` (14px / 16px): Metric card grid gaps, form inputs.
* `gap-5` / `gap-6` (20px / 24px): Major grid column splits (e.g. 12-column bento layouts).
* `space-y-5` / `space-y-6` (20px / 24px): Vertical panel rhythm between cards.

---

## 5. Component Styling & Button Behaviors

### 5.1 Interactive Physics & States

```css
button {
  transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
              background-color 160ms ease-out,
              border-color 160ms ease-out,
              color 160ms ease-out,
              box-shadow 160ms ease-out;
}
button:hover:not(:disabled) {
  transform: translateY(-1px);
}
button:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}
button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}
```

### 5.2 Button Variant Hierarchy

#### 1. Primary Action Button (Mint Fill)
* **Classes:** `bg-[var(--mint)] hover:bg-[var(--accent-hover)] text-[#FAF7F2] dark:text-[#0F1411] font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-sm active:scale-95`
* **Use Cases:** "Save Today's Session", "Apply to Challenge", "Confirm Deposit", "Save Bill".

#### 2. Secondary Action Button (Subtle Tint Fill)
* **Classes:** `bg-[var(--mint-tint)] hover:bg-[var(--mint)]/25 text-[var(--mint)] border border-[var(--mint)]/30 font-bold text-xs rounded-xl px-3.5 py-2 shadow-xs active:scale-95`
* **Use Cases:** "Quick Edit", "+ New Challenge", "Add Trade".

#### 3. Neutral Action Button (Subtle Surface)
* **Classes:** `bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] font-bold text-xs rounded-xl px-3.5 py-2 shadow-xs active:scale-95`
* **Use Cases:** "Edit Settings", "Cancel", Table navigation, Quick amount chips (+$25, +$50).

#### 4. Warning / Danger Button (Coral Tint / Fill)
* **Classes:** `bg-[var(--coral-tint)] hover:bg-[var(--coral)]/25 text-[var(--coral)] border border-[var(--coral)]/30 font-bold text-xs rounded-xl px-3 py-2 active:scale-95`
* **Use Cases:** "Delete Challenge", "Clear Vault", "Reset Data".

#### 5. Unlock Warning Button (Amber Tint Fill)
* **Classes:** `bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-sm rounded-xl py-3.5 shadow-sm active:scale-98`
* **Use Cases:** "Unlock Session for Editing".

---

### 5.3 Navigation Bars & Sub-Tab Switchers

#### Desktop Sidebar Navigation Item (`.sidebar-nav-btn`)
* **Idle State:** Transparent border, `text-[var(--text-secondary)]`, hover background `var(--surface-hover)`, hover translates `translateX(3px)`.
* **Active State (`.active-nav-item`):**
  * Background: `var(--surface)` (Light) / `var(--surface-raised)` (Dark).
  * Border: `1px solid var(--border)`.
  * Shadow: `var(--shadow-subtle)`.
  * Left Accent Strip: 3.5px wide vertical pill colored `var(--accent)`.

#### Sub-Header Navigation Switcher Bar
* **Container:** Pill-shaped flex tray `rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] p-1 gap-1`.
* **Sub-Tab Buttons:** `rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer`.
* **Active Sub-Tab (`.active-subtab`):**
  * Background: `var(--surface)`.
  * Text: `var(--text-primary) font-bold`.
  * Border: `1px solid var(--border)`.
  * Shadow: `var(--shadow-xs)`.

---

### 5.4 Form Controls & Input Styling

* **Base Inputs (`input`, `select`, `textarea`):**
  * Background: `var(--surface-subtle)` (Wizard) or `var(--surface)` (Modals).
  * Border: `1px solid var(--border)`.
  * Radius: `rounded-xl` (12px).
  * Typography: `font-num font-bold text-sm text-[var(--text-primary)]`.
  * Placeholder: `text-[var(--text-muted)]`.
* **Focus Polish:**
  * `outline: none !important;`
  * `border-color: var(--border-focus) !important;`
  * `box-shadow: 0 0 0 2px var(--accent-soft) !important;`
* **Numeric Adornments:** Dollar sign prefixes (`$`) are styled in bold tabular font with subtle right-border divider within input wrappers.

---

### 5.5 Badge & Status Pill Hierarchy

1. **Live Beacon Pill:**
   * Contains a CSS pinging animation circle (`animate-ping`) paired with an inner solid green beacon dot.
   * Background: `var(--mint-tint)`, text: `var(--mint)`, border: `var(--mint)/30`.
2. **Locked Session Tag:**
   * Amber padlock icon, background: `amber-500/15`, text: `amber-700 dark:text-amber-300`, border: `amber-500/30`.
3. **Pace Target Pill:**
   * Small rounded-full chip displaying delta from daily benchmark (`+ ahead of pace` in green, `- behind pace` in coral).

---

## 6. Vector Artwork, Custom SVGs & Illustrations

### 6.1 Atmospheric Mountain Trail Visualization (Setup Wizard)
Located in Step 1 of the Challenge Wizard, this SVG (`viewBox="0 0 460 190"`) visualizes the compounding challenge as a mountain ascent:
* **Background Sky:** Linear gradient `#previewBgSky` shifting from deep pine night (`#0A120D`) to obsidian base (`#121914`).
* **Celestial Elements:** Four discrete starlight circles with varying opacities (`0.3` to `0.6`).
* **Layer 1 (Distant Peaks):** Dark shaded mountain silhouettes (`#prevMountainBack` gradient).
* **Layer 2 (Mid-Range Ridges):** Intermediate alpine ridge path (`#prevMountainMid` gradient).
* **Layer 3 (Foreground Slopes):** Sloping forest foreground (`#prevMountainFront` gradient).
* **Foliage Silhouettes:** Pine tree polygon silhouettes (`#080D09`) clustered at mountain flanks.
* **Compounding Trail:** Golden dashed bezier curve (`#D97706`, `stroke-width="2.5"`, `stroke-dasharray="6 5"`).
* **Waypoints:** Three glowing circular waypoint nodes:
  * Start Node: Green `#34D399` ($C_0$).
  * Checkpoint Node: Amber `#D97706` (25% checkpoint).
  * Summit Node: Gold `#FBBF24` (Final Target $T$).
* **Interactive Flags:**
  * START Flag (Bottom-Left): Mint green flag with bold dollar text.
  * TARGET Flag (Top-Right): Golden flag with bold summit dollar text.

---

### 6.2 Vault Safe Door & Botanical Foliage Art (Capital Vault Header)
Located in the organic header banner of the Capital Vault (`viewBox="0 0 220 120"`):
* **Ambient Glow:** Elliptical ground reflection glow with warm amber blur (`#F59E0B`, `opacity="0.15"`).
* **Barrel Safe Arch:** Deep obsidian safe door outer arch (`#1A2820`, `stroke="#334B3D"`).
* **Rivet Band:** Dashed architectural perimeter curve (`stroke-dasharray="3 5"`).
* **Vault Recess:** Layered inner shadow recess (`#101A14`).
* **Golden Spoke Lock:**
  * Concentric wheel circles with gold borders (`#D0AA63`).
  * 4 cross-axial lock spokes (`stroke-width="2.5"`).
  * Central brass spindle cap with golden glow center (`#FFE5A3`).
* **Stacked Treasure Chests:**
  * Left & Right wooden treasure chests with arched lids and brass corner brackets (`#8C5C26`, `#C28B38`).
  * Spilling golden coin ellipses cascading toward safe threshold.
* **Botanical Leaves & Foliage:**
  * Organic emerald leaf paths (`#10B981`, `#059669`, `#34D399`) curling around vault hinges and stone corners.
  * Amber floral berries (`#F59E0B`).
* **Floating Firefly Orbs:** Four luminous golden dust circles hovering in the upper ambient space.
* **Editorial Script Quote:**
  * Styled in serif italic (`Georgia`, `Cambria`).
  * Reads: *"Discipline today, freedom tomorrow."* in warm gold (`#FFE5A3`).

---

### 6.3 Topographical Elevation Contour Motion (Sidebar Background)
Positioned in the lower 54% of the desktop sidebar (`viewBox="0 0 280 420"`):
* **Vector Paths:** Eight organic bezier contour elevation curves (`stroke-width: 1.2px` to `1.6px`).
* **Gradients:**
  * `#sbContourGrad1`: Linear opacity falloff (`4%` $\to$ `16%` $\to$ `5%`).
  * `#sbContourGrad2`: Inverse opacity falloff (`6%` $\to$ `22%` $\to$ `4%`).
  * `#sbSoftMintGrad`: Mint accent contour line with dash pattern (`stroke-dasharray="3 3.5"`).
* **Elevation Nodes:** Eight tiny coordinate circles scattered across the contours.
* **Motion Physics:** Governed by `@keyframes contourDrift` (20-second continuous fluid drift).

---

### 6.4 Circular SVG Progress Gauges
Used in the Capital Vault for Savings and Bills mini-progress cards:
* **ViewBox:** `0 0 36 36`, rotated by `-90deg` so progress fills clockwise from 12 o'clock.
* **Background Track:** Complete circle `r="14"`, `stroke-width="3"`, color `var(--border)`.
* **Animated Fill Ring:**
  * Circumference: $C = 2\pi r = 2 \times 3.14159 \times 14 \approx 87.96$.
  * `stroke-dasharray="87.96"`
  * `stroke-dashoffset = 87.96 - (percent / 100) * 87.96`
  * `stroke-linecap="round"`
  * Transition duration: `500ms`.

---

### 6.5 Lucide-Style Icon Guidelines
All UI icons utilize standard inline SVG vectors following strict design rules:
* **ViewBox:** `0 0 24 24`
* **Fill:** `none` (unless explicit solid indicator)
* **Stroke:** `currentColor`
* **Stroke Width:**
  * Standard icons: `2`
  * Micro chips & sub-tabs: `1.75`
  * Emphasis / active indicators: `2.5`
* **Line Join & Cap:** `stroke-linecap="round"` and `stroke-linejoin="round"`

---

## 7. Animations, Transitions & Micro-Interactions

### 7.1 View Transition Animation (`viewDriftIn`)
Triggered whenever switching primary navigation tabs or sub-tabs:
```css
.view-transition {
  animation: viewDriftIn 200ms ease-out forwards;
}

@keyframes viewDriftIn {
  0% {
    opacity: 0.75;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 7.2 Icon Micro-Interactions

1. **Hover Rotation (`.icon-hover-rotate`):**
   * Applied to the theme toggle icon and action icons.
   * On hover: Rotates by `25deg` and scales to `1.1` in `220ms cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Hover Scale (`.icon-scale-hover`):**
   * Applied to quick-action icons and card headers.
   * On hover: Scales smoothly to `1.12` in `180ms`.

---

### 7.3 Number Animation Engine (`animateNumber`)
Provides an editorial ticking counter effect when dollar balances change:
* **Function:** `animateNumber(el, targetVal, isCurrency, showSign, duration = 400)`
* **Physics:** Cubic easing function:
  $$E(t) = 1 - (1 - t)^3 \quad \text{where } t \in [0, 1]$$
* **Behavior:** Renders intermediate values smoothly over 400ms at 60fps before snapping to exact two-decimal precision.

---

### 7.4 Topographical Drift Motion (`contourDrift`)
```css
@keyframes contourDrift {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.015);
  }
}
```

---

### 7.5 Accessibility & Reduced Motion Safeguards
The entire design system strictly honors user accessibility preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .sidebar-organic-bg svg {
    animation: none !important;
  }
  #organicParticlesCanvas {
    display: none !important;
  }
}
```
When reduced motion is active, all animated number counters immediately jump to their target values without interpolation.
