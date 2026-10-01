# Visual Style & Navigation Specification
## Portfolio Growth Ladder & Capital Vault

**Purpose:** This document governs visual styling, navigation, iconography, themes, and micro-interactions only. Use it alongside `portfolio_growth_ladder_restructure_spec.md`.

The functional MD remains the source of truth for app structure, workflows, calculations, data, and behavior. This document must not override those requirements.

---

## 1. Art Direction

Create a polished, earthy, dark-nature-inspired interface that feels warm, tactile, modern, and enjoyable to use.

Use the supplied dashboard reference as inspiration for:
- A slim, persistent left sidebar on desktop.
- Warm cream typography against deep charcoal/forest surfaces.
- Muted earthy colors and subtle landscape-inspired details.
- Compact, well-organized cards.
- Plenty of useful, attractive mini icons.
- Refined borders, restrained highlights, and gentle motion.

Adapt the visual language to the real application; do not copy the reference literally. Preserve the existing site's recognizable style and earthy palette.

**Desired feeling:** grounded, calm, crafted, subtly playful, and easy to read. The app should not feel like a stressful finance terminal.

**Avoid:** generic blue/purple gradients, neon colors, sterile white dashboards, excessive glassmorphism, oversized illustrations, noisy backgrounds, and distracting animation.

## 2. Scope and Preservation

This is a styling and navigation specification, not permission to change functionality.

- Keep the five destinations in the functional MD: Setup, Daily Tracker, Trading Sessions, Capital Vault, and Stats & Performance.
- Preserve existing workflows, inputs, calculations, validation, records, storage, and integrations.
- Do not add, remove, or relocate controls in a way that conflicts with the functional specification.
- Do not change the meaning of buttons or financial actions.
- Do not change the combined financial goal, trading target, savings target, bill calculations, or account boundaries.
- Do not replace working features with decorative mockups.
- Reuse the existing stack and components where practical; avoid unnecessary dependencies.

If the two documents appear to conflict, the functional MD controls behavior and layout requirements; this document controls visual presentation and motion.

## 3. Earthy Color System

Inspect the current CSS and palette before changing colors. Prefer semantic CSS custom properties so dark and light themes remain consistent. The values below are starting points only: preserve or tune the actual existing brand colors if they fit better.

### Dark theme

Use deep natural colors, not pure black:
- App background: charcoal with a subtle green/brown undertone.
- Sidebar: warmer or darker charcoal-olive.
- Main cards: dark forest-charcoal.
- Raised cards and inputs: subtly lighter charcoal-green.
- Borders: muted olive/stone.
- Primary text: warm ivory, not pure white.
- Secondary text: soft sage-grey.
- Primary accent: muted clay, terracotta, or bronze.
- Supporting accents: moss, sage, and muted ochre.
- Status colors: natural green, amber, and restrained brick red.

Suggested starting tokens:

```css
:root[data-theme="dark"] {
  --app-bg: #171b18;
  --sidebar-bg: #20231e;
  --surface: #202621;
  --surface-raised: #272d26;
  --surface-hover: #30362d;
  --border: #3b4237;
  --text-primary: #eee7d8;
  --text-secondary: #b7b8a8;
  --text-muted: #8d9384;
  --accent: #b98255;
  --accent-hover: #ca9568;
  --accent-soft: #463526;
  --sage: #91ad8d;
  --moss: #718766;
  --ochre: #c5a568;
  --success: #83b997;
  --warning: #d8b36b;
  --danger: #d77f73;
}
```

### Light theme

Design the light theme intentionally rather than simply inverting dark mode:
- Warm parchment, oatmeal, or ivory background.
- Warm white or pale stone cards.
- Soft olive/stone borders.
- Deep olive-charcoal text.
- Earthy terracotta/bronze primary actions.
- Sage and moss supporting accents.
- Pale sand/ochre highlights.

Suggested starting tokens:

```css
:root[data-theme="light"] {
  --app-bg: #f1eee4;
  --sidebar-bg: #e6e1d3;
  --surface: #faf8f1;
  --surface-raised: #ffffff;
  --surface-hover: #ece8dc;
  --border: #d4cfbf;
  --text-primary: #292d25;
  --text-secondary: #5e6255;
  --text-muted: #777b6c;
  --accent: #986640;
  --accent-hover: #815333;
  --accent-soft: #efe1d0;
  --sage: #688268;
  --moss: #526b4d;
  --ochre: #a8833e;
  --success: #347653;
  --warning: #91681c;
  --danger: #b24f43;
}
```

### Color rules

- Use semantic tokens, not scattered hard-coded colors.
- Maintain readable contrast for text, icons, borders, fields, and statuses in both themes.
- Use color to establish hierarchy, not decorate every element.
- Pair status colors with text and/or an icon; never rely on color alone.
- Keep the main accent warm and earthy in both themes.
- Avoid making every card a different color or adding strong gradients to ordinary components.
- Charts must remain legible and use consistent semantic colors in both themes.

## 4. Layout and Surfaces

### App shell and sidebar

Use a persistent left sidebar on desktop, inspired by the reference image:
- App name/logo at the top.
- Five primary navigation items below.
- Clear active destination state.
- Theme switch and global utilities accessible without crowding navigation.
- Main content may scroll independently if suitable.
- An optional, very subtle landscape/nature detail may sit near the sidebar bottom. It must not compete with content; avoid adding a heavy image dependency.

Responsive behavior:
- Desktop: persistent, compact, readable sidebar.
- Tablet: retain labels when possible; otherwise use a deliberate compact mode.
- Mobile: accessible drawer or familiar compact navigation pattern; close the drawer after navigation.
- Never hide essential navigation behind hover-only interactions.

### Cards and panels

- Use consistent, moderately rounded corners; avoid exaggerated pill shapes.
- Use thin, subtle borders and small surface-tone differences for depth.
- Avoid heavy shadows and excessive nested cards.
- Keep padding and gaps consistent across all five sections.
- Make primary task panels more prominent than secondary information.
- Keep metric cards compact and aligned. Use whitespace for grouping and dividers sparingly.

### Typography

- Preserve the existing brand typography where practical.
- Use a clear hierarchy: page title, section heading, card heading, body, labels, helper text, and metadata.
- A refined serif may be used for page titles or the wordmark if it fits the existing identity; use a readable sans-serif for body text and controls.
- Avoid adding many font families or making metadata too small.
- Use tabular numerals for balances and percentages where supported.

### Spacing

Use a consistent spacing scale. Align headings, card edges, form fields, and actions. Keep layouts breathable without wasting vertical space or pushing primary tasks too far down the page.

## 5. Iconography: Fun, Consistent, Useful

Use plenty of well-chosen mini icons to add personality and make the app easier to scan. Icons should feel like one coherent family, not a mixture of unrelated styles.

- Prefer a consistent outline family such as Lucide if already available or usable without unnecessary dependencies.
- Favor clear silhouettes and rounded strokes.
- Navigation icons: approximately 16–20 px; compact inline icons: approximately 14–16 px.
- Reuse the same icon for the same concept everywhere.
- Align icons optically with labels and maintain consistent stroke weight.
- Use softly tinted icon containers sparingly for important categories.
- Every icon-only control must have an accessible name or tooltip.
- Provide hover, focus, active, and disabled states for interactive icons.
- Never rely on an icon alone to explain a destructive action.

Suggested icon mapping:

| Area/action | Icon direction |
|---|---|
| Setup | sliders, settings, compass |
| Daily Tracker | calendar-check, notebook, chart-line |
| Trading Sessions | candlestick-chart, activity, chart-line |
| Capital Vault | wallet, vault, wallet-cards |
| Stats & Performance | chart-no-axes-combined, chart-pie, trophy |
| Savings | piggy-bank, wallet, sprout |
| Bills | receipt, file-text, clipboard-list |
| Deposit | arrow-down-left, circle-plus |
| Withdrawal | arrow-up-right, hand-coins |
| Target reached | target, check-circle, trophy |
| Ahead/progress | trending-up, arrow-up-right |
| Warning/shortfall | triangle-alert, circle-alert |
| Notes | sticky-note, notebook-pen |
| Calendar | calendar-days |
| Add | plus |
| Edit | pencil |
| History | history, clock |
| Expand/collapse | chevron-down, chevron-up |
| Theme | sun, moon |
| Menu | menu, panel-left |
| Success | check-circle |
| Search/filter | search, list-filter |

Use icons available in the current icon library; if one is unavailable, choose the closest icon from the same family.

Add personality in small doses: a tiny sparkle for a milestone, a friendly empty-state icon, or a subtle accent behind a category icon. Avoid random decorative icons on every label.

## 6. Navigation Styling

Use only the five-section navigation defined in the functional specification.

Each item needs clear default, hover, keyboard-focus, active, and disabled states where relevant. The active item should have a warm, low-saturation accent surface, a clear icon treatment, and readable text. A slim indicator or border may reinforce selection.

- Hover transitions should be subtle and fast.
- Do not make navigation flash, bounce, or shift layout.
- A section change may use a short fade or tiny vertical shift.
- Do not animate every element independently on navigation.
- Preserve existing browser back/forward behavior if supported.
- Do not introduce a complex router solely for animation.

### Theme switch

Provide an easy-to-find light/dark toggle in the global shell:
- Use sun/moon icons with a smooth, restrained transition.
- Theme all surfaces, charts, menus, fields, tooltips, and overlays.
- Avoid bright flashes during switching.
- Persist the selected theme using the existing preference mechanism if available. If not, add an isolated preference without changing financial data or schemas.
- Do not unexpectedly force a new default theme.
- Verify the choice survives reloads.

## 7. Micro-Animations

I want lots of small, satisfying animations that make the interface feel polished and alive. Motion must communicate interaction, feedback, and state changes—not become constant decoration.

### Recommended effects

**Buttons:** slightly warm/deepen the surface on hover; add a tiny press response around `scale(0.98)`; return smoothly. No exaggerated bounce.

**Interactive cards:** subtle border/surface change on hover; a 1–2 px lift is acceptable when the card is genuinely clickable. Static cards must not look interactive.

**Navigation:** smoothly transition active background/indicator and icon/text colors.

**Icons:** purposeful micro-effects such as a gentle settings-icon turn, a brief checkmark reveal, a tiny upward motion for a positive change, or a small milestone sparkle. Do not continuously animate icons or restart effects on every render.

**Forms:** smooth focus-border transitions; brief validation feedback; optional sections may expand/collapse gently without interfering with accessibility. Do not bounce fields or move labels unexpectedly.

**Saving feedback:** show a subtle success state after a successful save. Keep errors visible long enough to read. Loading indicators should be restrained and must not block unrelated actions.

**Metrics:** a brief highlight or restrained count-up may be used when values change, but do not animate all financial values on every render. Never show misleading intermediate balances or delay the authoritative saved value.

**Progress bars/charts:** smooth progress fill and optional subtle initial chart reveal. Do not replay long animations on every interaction; animation must never affect calculation state.

**Milestones:** a tiny sparkle, gentle icon effect, or restrained highlight is acceptable. No loud confetti, flashing colors, or sounds by default.

### Timing and easing

Use a consistent system:
- Micro feedback: 100–160 ms.
- Hover/focus: 150–220 ms.
- Small panel expansion: 180–260 ms.
- Section transition: 160–240 ms.

Use gentle `ease-out` for entering states and `ease-in-out` for transitions. Keep the interface responsive and do not delay actions for animation.

### Accessibility and performance

- Respect `prefers-reduced-motion`; remove or simplify movement, count-up effects, and decorative animation while retaining clear feedback.
- Prefer CSS transitions/keyframes for simple effects; do not add a heavy animation library for minor interactions.
- Avoid continuous particles, animated noise, parallax, large background movement, layout shifts, flicker, or dropped frames.
- Do not animate elements that are not visible.
- Provide equivalent feedback for keyboard and touch users; essential behavior must not depend on hover.

## 8. Buttons, Inputs, and Status Feedback

### Buttons

Maintain a clear hierarchy:
- **Primary:** warm earthy accent with readable contrast.
- **Secondary:** neutral surface with a subtle border.
- **Tertiary:** quiet text or icon action.
- **Destructive:** restrained danger treatment, clearly separated from routine actions.

Use consistent heights, padding, radii, and icon/text spacing. Keep labels concise and avoid making every button visually busy.

### Inputs

- Use consistent surface, border, radius, height, and padding.
- Keep labels readable and visible as required by the functional MD.
- Make focus states easy to see in both themes.
- Keep disabled and read-only states distinguishable.
- Preserve existing validation and submission behavior.

### Statuses

Style success, warning, error, neutral, ahead, behind, paid, pending, and completed consistently. Pair color with text and/or icons. Keep warning states clear without making the entire app feel urgent.

## 9. Charts and Data Visualization

- Reuse the existing charting solution wherever possible.
- Match chart surfaces, gridlines, labels, tooltips, and legends to the active theme.
- Use distinguishable earthy series colors and readable axes.
- Avoid unnecessary gradients, glow, 3D effects, or decorative chart elements.
- Use subtle initial animation only; data must remain immediately readable.
- Theme tooltips and axes as well as the chart background.
- Do not change chart data, formulas, target logic, or statistical definitions as part of styling.

## 10. Responsive and Accessible Behavior

- Preserve all five destinations on desktop, tablet, and mobile.
- Keep touch targets comfortable.
- Never rely on hover for essential actions.
- Ensure keyboard navigation and visible focus states.
- Give icon-only controls accessible names.
- Check contrast in both themes.
- Do not communicate status by color alone.
- Respect reduced-motion preferences.
- Avoid horizontal overflow and layout jumps.
- Ensure dialogs, dropdowns, drawers, and tooltips work on touch devices.

## 11. Implementation Guidance

1. Inspect the current CSS, palette, theme behavior, navigation, icon library, and component patterns.
2. Preserve the existing earthy identity and refine it consistently.
3. Introduce or improve semantic tokens for both themes.
4. Apply the system across all five sections.
5. Add consistent iconography and purposeful micro-interactions.
6. Verify theme persistence and all theme-dependent components.
7. Test reduced motion, keyboard focus, mobile navigation, and responsive layouts.
8. Confirm styling changes did not alter financial behavior, data, integrations, or workflows.

Do not rewrite the app simply to apply these styles. Prefer controlled changes to the existing implementation.

## 12. Visual Acceptance Checklist

- [ ] Existing earthy identity is preserved and more consistent.
- [ ] Dark and light themes both feel intentionally designed.
- [ ] All five destinations use consistent navigation and clear active states.
- [ ] Desktop sidebar is inspired by the reference without copying it literally.
- [ ] A coherent set of useful, attractive mini icons is used throughout.
- [ ] Buttons, cards, inputs, navigation, and statuses have polished interaction states.
- [ ] Micro-animations feel responsive, purposeful, and consistent.
- [ ] Motion does not interfere with calculations, forms, or navigation.
- [ ] Reduced-motion preferences are respected.
- [ ] Charts, overlays, and forms work in both themes.
- [ ] Mobile/tablet layouts remain practical and accessible.
- [ ] Existing functions, calculations, data, and integrations still work.

**Final instruction:** Use this document strictly for visual styling, navigation, iconography, themes, and micro-animations. Use `portfolio_growth_ladder_restructure_spec.md` for app structure, functional requirements, and financial behavior. Implement and test the changes in the existing project rather than producing a static mockup.
