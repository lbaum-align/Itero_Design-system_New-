# ProgressBar — sign-off

**Figma**: `Progress bar` `25486:2635` (page "Progress bar" `15305:6756`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Progress (0%, 25%, 50%, 75%, 100%, Error) = 6, + Show label, Show helper text, Label / Helper / Error text.

## Storybook coverage (`Components/ProgressBar`)
`Default` (controls for every prop) · `Progress: 0% / 25% / 50% / 75% / 100% / Error` · `Any value (e.g. 42/256 items)` · `AllStates` (in progress, complete, error, indeterminate) ·
`Figma matrix (all 6 variants)` (× Show label × Show helper text) · `Overflow: long label and helper wrap` · `Error without retry action` ·
play tests `ExposesProgressbarRole`, `RetryByClickAndKeyboard`.
Unit tests: `progress-bar.test.tsx` (10).

## Fixed during audit
- Typography used raw `text-[18px]` / `text-[16px]` and an ambiguous `font-[var(...)]` → Label 02 (`text-scanner-md`/`leading-lg`) and Label 01 (`text-base`/`leading-md`) tokens
- Error variant: fill followed `value` → full-width `border-error` fill (Figma); Success fill is always full
- Error icon: registry `error` (circle ×) → Figma "Error" glyph (circle !) kept locally in `status-icons.tsx`
- "Try again" link: `href="#"` + `preventDefault`, size Medium → click-only Link (keyboard Enter/Space via Link), size Small as in Figma; only rendered when `onRetry` is set
- Accepts any numeric value: added `max` (default 100); value is clamped to 0…max, non-finite values → 0
- ARIA: progressbar is labelled by the visible label (`aria-labelledby`, falls back to `aria-label` when the label is hidden), described by helper/error text, `aria-valuemax` = `max`; indeterminate drops `aria-valuenow` and sets `aria-busy`
- Hard-coded `h-[8px]` / `size-[24px]` → component tokens; props document the Figma property names; `data-status` on the root

## Component tokens (`src/tokens/components/progress-bar.css`)
`--scanner-progress-bar-height` (8px), `--scanner-progress-bar-status-icon-size` (24px).

## Visual check
`Figma matrix` screenshot vs Figma `25486:2635`: label row 36px (28 + 8), track 8px radius 4, helper 32px (8 + 24), colours per status, checkmark / error icons and link position match.

## Remaining deviations / Figma inconsistencies
- Figma fills are not exact: 25% is 78.5px of 288 (27%), 50% is 162px (56%); 75% is exact. Implemented the exact percentage.
- 100% and Error variants don't bind "Show label" / "Show helper text" (only 0–75% do). Implemented both booleans for every status; the error message always replaces the helper text in the error state.
- The Link instance in the Error variant is 16/24 (older Link); the verified `Link` component is 18/28 at both sizes, so "Try again" renders at 18px.
- `indeterminate` is not a Figma variant (docs recommend a spinner) — kept for backwards compatibility.
- The retry link used to render in every error state; it now requires `onRetry` (a link without an action is not useful).
- Dark-mode token values not visually verified against Figma.

> **Update (icon registry audit):** local Figma glyph copies in this component were moved into the shared icon registry (`src/icons/registry.tsx`, exact Figma exports); rendered output is unchanged. See [icons.md](icons.md).
