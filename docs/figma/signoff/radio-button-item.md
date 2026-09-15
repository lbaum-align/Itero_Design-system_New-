# RadioButtonItem — sign-off

**Figma node**: `01 Radio button item` `1223:1419` (page "Radio button" `15305:6747`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Selected (True, False) × State (Enabled, Focused, Disabled, Skeleton) = 8 · component props Show value, Text value
**Status**: ✅ Verified 2026-09-15 (Storybook screenshot vs Figma set screenshot)

## Storybook coverage (`Components/RadioButtonItem`)
`Default` (controls incl. Forced state) · `Selected: False` / `Selected: True` · `Enabled` / `Focused` / `Disabled` / `Skeleton` ·
`AllStates` · `Figma matrix (all 8 variants)` (× Show value True/False) · `LongValueWraps` ·
interaction tests `ClickSelects`, `KeyboardSpaceSelects`, `DisabledIgnoresClick`.
Unit tests: `radio-button-item.test.tsx` — 12 passing.

## Fixed during audit
- Glyph: 22px box with 2px **blue** border + 10px `bg-brand` dot → Figma 23px glyph (1.64px ring, 13.1px dot) in `icon-primary` (unselected) / `icon-link` (selected)
- Disabled: `opacity-40` + `border-disabled` → `icon-disabled` glyph and `text-disabled` value
- Focus: 2px outline, 2px offset → 1px `border-focus` ring with 1px gap; glyph shrinks to 21px (tokens in `radio-button.css`)
- Indicator column 24×24 centred → 24×28 (value line height) with `items-start`, so the control stays top-aligned when the value wraps (Figma guideline)
- Value text: hardcoded `text-[18px] leading-7 font-normal max-w-[320px]` → `scanner-text-body-02` + `--scanner-radio-value-max-width`; now wraps instead of overflowing
- Skeleton: primitive `gray-alpha-10`, fixed 120×18 bar → `icon-disabled` glyph (dot kept when selected) + `bg-highlight-gray` 24px value box sized to the text
- State follows the native input (`peer-checked`) → works controlled (`selected`) and uncontrolled (`defaultSelected`)
- Input props (`tabIndex`, `onKeyDown`, `required`, `id`, …) now pass through — needed for group roving tabindex
- Added `data-state="focused"` forcing, `aria-disabled`, accessible name fallback when Show value = false
- `onChange(selected)` → `onChange(selected, event)` (backwards compatible)

## Remaining deviations / Figma inconsistencies
- Figma *Selected + Focused* uses a 24px glyph frame / 21.5px glyph / 26px ring, *Unselected + Focused* 23 / 21 / 25. Implemented 21px glyph + 25px ring for both.
- Figma "Value" text is `whitespace-nowrap` with max-width 320; the documentation says long values wrap under the first line. Implemented wrapping.
- Figma defines no Hovered / Pressed states — none implemented.
- Skeleton value box width follows the text (Figma: fixed ~150px for "Radio button value", which is the same width).
- Dark-mode values come from semantic tokens; not compared against a Figma dark screenshot.
