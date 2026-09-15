# SplitButton — sign-off

**Figma**: `02 Split button` `36407:15124` (page Button `15305:6719`) · **Variants**: Emphasis (Primary, Secondary, Ghost) × Size (Large, Medium, Small) × Opened (False, True) = 18
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (controls incl. Emphasis/Size/Opened) · `Primary` · `Secondary` · `Ghost` · `Opened` · `AllSizes` · `AllStates` (enabled/disabled/loading/skeleton) · `Figma matrix (all 18 variants)` · `LongLabelWraps` · `Controlled` · play tests `MainClickTriggersAction`, `DropdownToggleKeyboard`, `DisabledIgnoresClicks`.
Unit tests: `split-button.test.tsx` — 9 passing.

## Fixed during audit
- Re-implemented as two `Button` instances exactly like Figma (Text only + Icon only) instead of a custom button — hover/pressed/focus/disabled/loading/skeleton now match the verified Button.
- Gap between segments: 1px (`--scanner-split-button-gap`); inner corners squared.
- Trigger was square-ish with 20px icon at every size → hugs padding + icon: 12/8/4px padding, 24/24/20px chevron (48×60, 40×48, 28×36).
- Main segment padding/typography (was `text-md` 17px, custom colours, 2px outline focus) now inherited from Button (18/28, 2px ring 4px outside).
- Secondary used a CSS border (2px wider) and background hover → Button's inset stroke + stroke-colour hover.
- Hardcoded `h-[60px]`, `min-w-[72px]` removed.
- `variant` prop was unused (oxlint warning) → passed to both segments.
- Trigger a11y: `aria-haspopup="menu"`, `aria-expanded`, configurable `dropdownLabel` (default "More options"; was "Toggle dropdown").
- Loading disables the trigger; props extend `HTMLAttributes<HTMLDivElement>`.

## Visual comparison
Every variant measured in Storybook: 120+1+48 × 60, 112+1+40 × 48, 104+1+28 × 36, radii 8/8/4 on outer corners only, chevron 24/24/20 — identical to Figma (169/153/133 wide).

## Remaining deviations / Figma inconsistencies
- Figma defines no states for the split button; disabled/loading/skeleton are code-only (Button styles).
- Figma only uses Type=Brand; `variant="danger" | "success"` is an extension.
- The dropdown menu itself isn't part of the Figma component — consumers render it and toggle `opened`.
