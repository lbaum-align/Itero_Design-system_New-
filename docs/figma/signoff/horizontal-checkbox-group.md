# HorizontalCheckboxGroup — sign-off

**Figma**: `03 Horizontal checkbox group` `28129:11602` (page "Checkbox" `15305:6734`)
**Variants**: 1 component, + Show label, Label text, Show explainer, Required.

## Storybook coverage (`Components/HorizontalCheckboxGroup`)
`Default` · `Show explainer` · `Required` · `Show label=False` · `Figma matrix (label properties)` · `AllStates` (enabled, forced focus, disabled, skeleton, error, helper) ·
`ManyItems` · play tests `ArrowKeyNavigation`, `DisabledGroup`. Unit tests: `horizontal-checkbox-group.test.tsx` (7).

## Fixed during audit
- Hardcoded `text-[16px]`, invalid `font-[var(...)]` weight utilities → tokens; label row shared with the vertical group
- Label had `whitespace-nowrap` (overflowed) → wraps like Figma's label text
- Explainer tooltip placement Top; required asterisk announced as "(required)"
- `disabled` only styled the label → disables every item; added `skeleton` (every item as skeleton)
- Removed `role="presentation"` on the items row; added `aria-invalid` for error
- Arrow keys (Up/Down, plus Left/Right for the row) move focus between enabled checkboxes

Items row gap 16px (`spacing-5`) and label row (4px gap, 8px bottom padding) already matched.

## Remaining deviations / Figma inconsistencies
- Figma items row does not wrap; implemented the same (no wrap) — long rows overflow their container.
- `helperText`, `error`, `disabled`, `skeleton` are not Figma properties; kept/added for parity with the vertical group. Helper text top padding is 4px here vs 8px in the vertical group (pre-existing, not defined in Figma).
