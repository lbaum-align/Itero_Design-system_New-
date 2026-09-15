# RadioButtonsVerticalGroup — sign-off

**Figma node**: `02 Radio buttons vertical group/Default` `25:1188` (page "Radio button" `15305:6747`)
**Variants**: 1 component · props Show label, Label text value, Show explainer, Required (8 combinations)
**Status**: ✅ Verified 2026-09-15 (label → first radio centre 62px, 68px row pitch — identical to Figma)

## Storybook coverage (`Components/RadioButtonsVerticalGroup`)
`Default` · `Show label: False` · `Show explainer: True` · `Required: True` · `NothingSelected` · `Disabled` · `PartiallyDisabled` ·
`ErrorWithHelperText` · `Skeleton` · `AllStates` · `Figma matrix (all property combinations)` · `RealWorld` · `LongValuesWrap` ·
interaction tests `ClickSelects`, `ArrowKeysMoveSelection`, `ArrowKeysSkipDisabled`, `DisabledGroupIgnoresInput`.
Unit tests: `radio-buttons-vertical-group.test.tsx` — 15 passing.

## Fixed during audit
- **Keyboard**: no radiogroup handling → roving tabindex (selected or first enabled radio is the tab stop), Arrow Up/Left and Down/Right move focus + selection, skip disabled radios and wrap; Space selects
- Rows were fixed `h-[60px]` (clipped wrapped values) → 16px top/bottom padding per item (60px for one line), 8px gap
- Label: hardcoded `text-[16px]` + ambiguous `font-[var(--scanner-font-regular)]` → `scanner-text-label-01` / `text-secondary`
- Required asterisk used `text-[var(--scanner-text-xs)]` (compiled as a colour) → `text-[length:…]` 12/16 `text-error`
- Explainer tooltip now defaults to Placement=Top (Figma); added `tooltipPosition`
- Hidden label now becomes the group's `aria-label` (group previously had no accessible name); `aria-disabled` on disabled groups; helper text linked via `aria-describedby`
- Skeleton used primitive `gray-alpha-10` fixed boxes → item skeletons (keeps the selected dot) + `bg-highlight-gray` label placeholder
- `name` is now optional (auto-generated); added uncontrolled `defaultValue`; accepts `div` HTML attributes
- Shared implementation with the horizontal group (`RadioGroupBase.tsx`, internal)

## Remaining deviations / Figma inconsistencies
- Explainer instance in Figma is Placement=Top, **Alignment=Start**; `IconTriggerTooltip` has no alignment prop (owned by the tooltip agent).
- `helperText` / `error` are code extensions (not in Figma).
- Required "*" uses text style "Label 01" in Figma but overridden to 12/16 — implemented 12/16.
- Figma label row aligns the explainer and asterisk to the top of the 24px label line — implemented as in Figma.
