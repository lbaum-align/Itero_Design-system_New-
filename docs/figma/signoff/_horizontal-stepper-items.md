# _HorizontalStepperItems — sign-off

**Figma**: `_Horizontal stepper items` `34201:2302` (page "Stepper" `34201:1155`), file `TCdFM9Hy78GHyifCSlkedx` · Private
**Variants**: State (Not started, In progress, Completed, Error, Skeleton) = 5.

## Storybook coverage (`Private/_HorizontalStepperItems`)
`Default` (controls) · one story per State · `First step (no line)` · `AllStates` (with / without line) · `Figma matrix (all 5 variants)` ·
`Overflow: truncates with tooltip` (play test).
Unit tests: `horizontal-stepper-items.test.tsx` (6).

## Fixed during audit
- Indicators: same fixes as the vertical item (Figma number icons, "Checkmark outline" in `icon-link`, "Error" (!) in `icon-error`)
- Line: `border-t` in raw `h-[20px] w-[36px]` → 1px `border-subtle` line in a 36×20 wrapper (tokens)
- Label: raw 18px → Body 02 tokens; truncates with tooltip; item can shrink (`min-w-0`)
- Skeleton: `bg-hover` rounded 78×16 → `bg-highlight-gray` square 78×16 (token), `animate-pulse`
- Added `statusLabel`; props extend `HTMLAttributes`

## Component tokens (`src/tokens/components/stepper.css`)
`--scanner-stepper-line-wrapper-height` (20px), `--scanner-stepper-skeleton-width-horizontal` (78px) + shared stepper tokens.

## Remaining deviations
- Figma skeleton bar is 77.913px wide; rounded to 78px.
- Skeleton animation added (not in Figma).
