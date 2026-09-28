# _Days — sign-off

**Figma**: `_Days` `6607:12895` (page Date picker `15305:6737`) · **Variants**: State (Enabled, Hovered, Pressed, Focused, Selected, In range, Disabled) = 7 · Component prop: Today (boolean)
**Status**: ✅ Built 2026-09-15 (private — not exported from `src/index.ts`)

## Implementation
`src/components/_days/Days.tsx` — `<button>` cell, 52px high with 4px vertical padding and flexible "Range left/right" spacers, holding a 50×50 "Picker" (radius medium). Label 16/24, 2px below centre like Figma.
Props: `children` (label), `selected`, `inRange`, `today`, `disabled`, `focusableWhenDisabled`, `data-state` (`hovered | pressed | focused`), `className`, native button props.

| Figma state | Picker | Label |
|---|---|---|
| Enabled | — | text-primary |
| Hovered (`:hover` / `data-state`) | `background-layer-hovered` → `--scanner-bg-hover` | text-primary |
| Pressed (`:active` / `data-state`) | `layer-pressed` → `--scanner-bg-active` | text-primary |
| Focused (`:focus-visible` / `data-state`) | 1px inset `border-focus` | text-primary |
| Selected | `background-brand` | `text-on-color-primary` |
| In range | `background-layer-selected` | text-primary |
| Disabled | — | `text-disabled` (no today indicator) |
| Today | 24×2 pill, 6px above picker bottom: `border-interactive`; `border-on-color-strong` when Selected | `aria-current="date"` |

Component tokens (`src/tokens/components/date-picker.css`): `--scanner-days-cell-height` 52, `--scanner-days-picker-size` 50, `--scanner-days-today-width|height|offset` 24/2/6.

## Storybook coverage (`Private/_Days`)
`Default` (controls incl. Forced state) · `State: Enabled / Hovered / Pressed / Focused / Selected / In range / Disabled` · `Today: True` · `Today: True, State: Selected` · `AllStates` · `Figma matrix (all 7 states × Today)` · `PeriodLabels` (month/year 90px cells) · play tests `ClickSelects`, `KeyboardActivation`, `DisabledIgnoresClick`, `TodayHasAriaCurrent` (all reach phase `finished` in the browser).
Unit tests: `days.test.tsx` — 9 passing.

## Visual comparison
Figma matrix render vs `get_design_context` screenshot of the set: picker size/radius, hover/pressed/in-range fills, 1px focus stroke, brand fill + white label, disabled label and today indicator position/colour match.

## Deviations / Figma notes
- In range + hover/pressed use `background-layer-selected-hovered/pressed` (Figma has no In range × Hovered variant). Selected has no hover feedback (as drawn).
- Figma "Range left/Right" frames have no fill in any variant; they're rendered as empty spacers (no connecting range strip).
- Figma draws the today indicator as a 2px stroke inside a 2px-high rectangle; implemented as a filled pill in the stroke colour (identical pixels).
- `focusableWhenDisabled` (aria-disabled only) is an addition so the Calendar grid can move keyboard focus through disabled dates.
