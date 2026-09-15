# RadioButtonsHorizontalGroup — sign-off

**Figma node**: `03 Radio buttons horizontal group` `27986:67760` (page "Radio button" `15305:6747`)
**Variants**: 1 component · props Show label, Label text value, Show explainer, Required (8 combinations)
**Status**: ✅ Verified 2026-09-15 (60px item height, 197px item pitch = 181px item + 16px gap — identical to Figma)

## Storybook coverage (`Components/RadioButtonsHorizontalGroup`)
`Default` · `Show label: False` · `Show explainer: True` · `Required: True` · `NothingSelected` · `Disabled` · `PartiallyDisabled` ·
`ErrorWithHelperText` · `Skeleton` · `AllStates` · `Figma matrix (all property combinations)` · `RealWorld` · `WrapsWhenNarrow` · `LongValuesWrap` ·
interaction tests `ClickSelects`, `ArrowKeysMoveSelection`, `ArrowKeysSkipDisabled`, `DisabledGroupIgnoresInput`.
Unit tests: `radio-buttons-horizontal-group.test.tsx` — 6 passing (shared behaviour is also covered by the vertical group's 15 tests).

## Fixed during audit
- **Keyboard**: roving tabindex + Arrow Left/Right (and Up/Down) move focus and selection, skipping disabled radios and wrapping; Space selects
- Label: hardcoded `text-[16px]`, `font-[var(…)]` → `scanner-text-label-01`
- Items: 16px vertical padding moved from the row to each item (Figma: each item instance is 60px tall); row now wraps when space runs out
- Hidden label → `aria-label`; `aria-disabled`; `aria-describedby` merges caller's value
- Explainer tooltip default `bottom` → `top` (Figma Placement=Top)
- Skeleton: primitive colour / fixed label box → `bg-highlight-gray`, item skeletons keep the selected dot
- `name` optional; added `defaultValue`; stories imported the removed `@storybook/test` package → `storybook/test`
- Same implementation as the vertical group (`radio-buttons-vertical-group/RadioGroupBase.tsx`)

## Remaining deviations / Figma inconsistencies
- Figma row does not wrap (fixed 969px for 5 items); code wraps to new rows on narrow containers (rows then sit 0px apart, the 16px item padding gives 32px between values).
- Explainer Alignment=Start not supported by `IconTriggerTooltip` (no alignment prop).
- `helperText` / `error` are code extensions.
