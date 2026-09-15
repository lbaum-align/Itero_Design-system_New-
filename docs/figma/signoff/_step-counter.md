# _StepCounter — sign-off

**Figma**: `_Step counter` `34201:2238` (page "Stepper" `34201:1155`), file `TCdFM9Hy78GHyifCSlkedx` · Private (not in `src/index.ts`)
**Variants**: State (Not started, In progress) × Step (1–8) = 16.

## Storybook coverage (`Private/_StepCounter`)
`Default` (State + Step controls) · `State: Not started` · `State: In progress` · `AllStates` · `Figma matrix (all 16 variants)` · `Edge case: steps outside 1–8 clamp`.
Unit tests: `step-counter.test.tsx` (5).

## Fixed during audit
- Was a CSS circle (1px `border-default` stroke / `bg-brand` fill) with 12px text → the Figma icons "Number outline / N" (`icon-secondary`) and "Number filled / N" (`icon-link`, digit cut out), path data exported from Figma into `step-icons.tsx`
- Hard-coded `size-[24px]` → `--scanner-stepper-indicator-size`
- Props extend `HTMLAttributes<HTMLSpanElement>`; `data-state` / `data-step` attributes

## Shared stepper parts (in this folder)
`step-icons.tsx` (Number outline/filled 1–8, Checkmark outline, Error), `step-parts.tsx` (`StepIndicator`, `StepLabel` with truncate + tooltip), `step-utils.ts` (`clampStep`). Used by both stepper item components.

## Remaining deviations / Figma notes
- Figma's number glyphs use a squared "digital" typeface; they are reproduced exactly from the exported paths, so they don't follow the Roboto font.
- Steps > 8 are clamped to the "8" glyph (Figma only draws 1–8; docs advise ≤ 8 steps).

> **Update (icon registry audit):** local Figma glyph copies in this component were moved into the shared icon registry (`src/icons/registry.tsx`, exact Figma exports); rendered output is unchanged. See [icons.md](icons.md).
