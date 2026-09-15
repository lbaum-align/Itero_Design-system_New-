# _VerticalStepperItems — sign-off

**Figma**: `_Vertical stepper items` `34201:2271` (page "Stepper" `34201:1155`), file `TCdFM9Hy78GHyifCSlkedx` · Private
**Variants**: State (Not started, In progress, Completed, Error, Skeleton) = 5.

## Storybook coverage (`Private/_VerticalStepperItems`)
`Default` (controls) · one story per State · `First step (no line)` · `AllStates` (with / without line) · `Figma matrix (all 5 variants)` ·
`Overflow: truncates with tooltip` (play test).
Unit tests: `vertical-stepper-items.test.tsx` (6).

## Fixed during audit
- Indicators: CSS circle counter → Figma number icons; Completed `checkmark` (filled, `icon-success`) → Figma "Checkmark outline" in `icon-link`; Error registry `error` (×) → Figma "Error" (!) in `icon-error`
- Line: `border-l` inside a padded wrapper with raw `px-[11.5px]` / `h-[36px]` → 1px `border-subtle` line centred in a 24px × 36px wrapper (tokens)
- Label: raw `text-[length:18px]` → Body 02 tokens; long names truncate and show a tooltip (Figma "Overflow content")
- Skeleton: `bg-hover` bar with radius → `bg-highlight-gray`, square corners, 44×16 (tokens), `animate-pulse`; row 24px tall as in Figma
- Added `statusLabel` (visually hidden status for screen readers, set by `Stepper`); props extend `HTMLAttributes`

## Component tokens (`src/tokens/components/stepper.css`)
`--scanner-stepper-indicator-size`, `--scanner-stepper-line-width`, `--scanner-stepper-line-length`, `--scanner-stepper-skeleton-height`, `--scanner-stepper-skeleton-width-vertical`.

## Visual check
`Figma matrix` screenshot vs Figma `34201:2271`: line 36px + 8px gap + 28px row, indicator colours and label colours per state match.

## Remaining deviations
- Skeleton in Figma has no animation; `animate-pulse` added like other skeletons.
