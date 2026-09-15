# Component Sign-off

Verification of each component against Figma "06. Scanner core 1.0.0 full" (`TCdFM9Hy78GHyifCSlkedx`).

| Component | Figma node | Status | Date |
|-----------|-----------|--------|------|
| Button | `36403:6395` (page `15305:6719`) | ✅ Verified | 2026-09-15 |

Per-component reports for the full audit live in [`signoff/`](signoff/).

---

## Button

**Figma variants**: Type (Brand, Danger, Success) × Emphasis (Primary, Secondary, Ghost) × Size (Large, Medium, Small) × Content (Text only, Text + icon, Icon only) × State (Enabled, Hovered, Focused, Pressed, Disabled, Loading, Skeleton) = 567.

**Storybook coverage**: `Default`, one story per Content / Type / Emphasis / State, `AllSizes`, `AllStates`, `Figma matrix (all 567 variants)`, `LongLabelWraps`, plus interaction tests (click, keyboard Enter/Space, disabled, loading).

**Fixed during audit**
- Secondary stroke 2px → 1px, drawn inside the box (inset shadow) like Figma
- Secondary hover/pressed changed background → Figma changes stroke only (`border-subtle-hover` / `-active`)
- Secondary min-width 100px → 72px (same as all emphases)
- Focus ring: outline → 2px `border-focus` ring 4px outside, radius 12 (L/M) / 8 (S); ghost adds subtle inner stroke
- Small icon 20px → 24px (Figma uses 24px at every size)
- Label 17px → 18px / 28px line height
- Loading: background/stroke switch to disabled colours, dark 20px spinner; button stays focusable (`aria-busy`)
- Skeleton: `bg-highlight-gray`; fixed icon-only skeleton size (dynamic Tailwind class never compiled)
- Labels wrap instead of `whitespace-nowrap` (Figma overflow guideline)
- Added `data-state` (hovered / focused / pressed) for forced states

**Token foundation** (rebuilt during the Button audit, affects all components)
- `semantic.css` regenerated from the Figma collection "Tokens - Self-contained" (02-Color-modes, Align light / Align dark): 117 colour tokens incl. dark mode.
  Notable corrections: text-primary #121212, text-secondary 0.63, text-tertiary 0.44, text-disabled 0.23, bg-active 0.09, border-strong #121212, overlay 0.63, dark-mode link/success/warning colours.
- `typography.css` text styles now mirror the 27 Figma text styles (body-01 16/24, body-02 18/28, …); line heights 5xl/6xl/7xl = 60/84/116; added `--scanner-text-base` (16px) and `--scanner-text-scanner-md` (18px, Button label).
- Component tokens split per Figma page in `src/tokens/components/*.css` (Button: heights, min-width, focus ring).

**Remaining deviations / notes**
- Figma inconsistency: Large *Focused* variants are 52px tall; all other Large states are 60px. Implemented 60px.
- Figma doc text says "Large: 64px"; the component is 60px. Implemented 60px.
- Skeleton widths in Figma are fixed per variant (e.g. 140px); code sizes the skeleton to the real button's content.
- Storybook interaction tests are written but not run headlessly (no test runner installed); the same behaviours are covered by `button.test.tsx` (Vitest, 12 tests passing).
