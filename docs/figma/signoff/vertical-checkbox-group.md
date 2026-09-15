# VerticalCheckboxGroup — sign-off

**Figma**: `02 Vertical checkbox group` `20619:27426` (page "Checkbox" `15305:6734`)
**Variants**: Levels (1, 2) = 2, + Show label, Label text, Show explainer, Required.

## Storybook coverage (`Components/VerticalCheckboxGroup`)
`Default` · `Levels=1` / `Levels=2` · `Show explainer` · `Required` · `Show label=False` · `Figma matrix (Levels × label properties)` ·
`AllStates` (enabled, forced focus, disabled, skeleton, error, helper) · `Nesting` (parent/child selection) · `LongValues` ·
play tests `ArrowKeyNavigation`, `ParentSelectsChildren`, `DisabledGroup`. Unit tests: `vertical-checkbox-group.test.tsx` (10).

## Fixed during audit
- Stories had hooks in anonymous render functions (oxlint rules-of-hooks) → named components; oxlint clean
- Label typography hardcoded `text-[16px] leading-[24px]` and `font-[var(...)]` (invalid weight utility) → tokens
- Explainer tooltip now placement Top (Figma "Placement=Top"); required asterisk also announced as "(required)"
- `disabled` only styled the label → disables every item (context); `skeleton` rendered 3 fake rows ignoring children → label placeholder + each child item as skeleton
- Arrow Up/Down move focus between enabled checkboxes (Figma keyboard spec)
- Items column now `items-start` so items hug their content (Figma hug width)
- Helper/error `<p>` margin reset; `aria-busy` while skeleton
- Verified in the browser: label row 39×32, item 162×60, 8px gap, group 160px tall — identical to Figma Levels=1

## Remaining deviations / Figma inconsistencies
- Levels=2 in the component set has **no indent** for the "Sub menu"; the Figma Nesting documentation (older "02 Checkbox group") indents children 32px. Implemented the 32px indent (`spacing-8`).
- Nesting auto-selection (parent selects/clears children) is app state; shown in the `Nesting` story, not built into the component.
- `helperText`, `error`, `errorMessage`, `disabled`, `skeleton` are not Figma properties; kept for backwards compatibility.
- Required "*" uses text style Label/$tp-label-01 overridden to 12/16 in Figma; implemented 12/16.
