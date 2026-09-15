# CheckboxItem — sign-off

**Figma**: `01 Checkbox item` `1223:1396` (page "Checkbox" `15305:6734`)
**Variants**: Selected (Unselected, Selected, Indeterminate) × State (Enabled, Focused, Disabled, Skeleton) = 12, + Show value, Text value.

## Storybook coverage (`Components/CheckboxItem`)
`Default` (uncontrolled; controls incl. Forced state) · `Unselected` / `Selected` / `Indeterminate` · `Enabled` / `Focused` / `Disabled` / `Skeleton` ·
`Show value: False` · `AllStates` · `Figma matrix (all 12 variants × Show value)` · `LongValueWraps` ·
play tests `ClickToggles` (box + value text), `KeyboardToggles` (Space + Enter), `IndeterminateSelects`, `DisabledIgnoresClick`.
Unit tests: `checkbox-item.test.tsx` (14).

## Fixed during audit
- Indicator was a 20px box with a hand-drawn blue stroke/white check → Figma 28×28 glyph (box with the mark cut out), `currentColor`
- Colours: unselected used `border-interactive` (blue) + `bg-white` → `icon-primary`; selected/indeterminate `action-primary` → `icon-link`; disabled used `opacity 0.23` → `icon-disabled` / `text-disabled`
- Focused state missing (outline offset ring) → 1.4px `border-focus` stroke inside the indicator, radius 4; forceable with `data-state="focused"`
- Skeleton used `gray-alpha-10` and a 16px bar → glyph in `icon-disabled` + 28px-tall 172px `bg-highlight-gray` value box
- Hardcoded `text-[18px] leading-[28px]`, `rounded-[4px]`, `bg-white`, `stroke="white"` → tokens
- Value text is part of the click target (single `<label>`), wraps top-aligned (Figma overflow rule) instead of centred
- Enter toggles (Figma keyboard spec); native `indeterminate` DOM property set (was only `aria-checked`)
- Unchecked-by-default checkboxes without `checked` could never toggle → uncontrolled mode + new `defaultChecked`
- Items inherit `disabled` / `skeleton` from checkbox groups (context)
- Root `data-state` previously held the selection → now `data-selection`; `data-state` is reserved for forced states
- Props extend native input attributes (id, required, onBlur…)

## Component tokens (`src/tokens/components/checkbox.css`)
`--scanner-checkbox-indicator-size` (28px), `--scanner-checkbox-focus-width` (1.4px), `--scanner-checkbox-skeleton-value-width` (172px).

## Remaining deviations / Figma inconsistencies
- Figma defines no hover or pressed states and the docs don't describe any → none implemented (cursor only).
- Skeleton value box: Figma shows it regardless of "Show value"; implemented it only when `showLabel` is true.
- Figma docs keyboard text says "Toggles the checkbox state when the radio button is focused" (copy-paste typo).
- Figma screenshots of this page render in dark mode; light-mode colours verified via variable bindings, dark-mode not visually verified.
