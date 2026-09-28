# Dropdown — sign-off

**Figma**: `Dropdowm` (sic) `20:610` (page Dropdown `15305:6738`) · **Variants**: Layer set (Set 01, Set 02) × Size (X-Large, Large, Medium, Small) × Type (Single, Multi) × Selected (False, True) × State (Enabled, Hovered, Focused, Disabled, Error, Skeleton) = 192 · Component props: Show label, Show helper, Required field, Show explainer, Filled / Placeholder / Label / Helper / Error text value
**Status**: ✅ Built 2026-09-15

## Implementation
- `src/components/dropdown/Dropdown.tsx` — WAI-ARIA select-only combobox: `<button role="combobox">` + `SelectMenu` listbox (`focusMode="activedescendant"`, option ids via `aria-activedescendant`), menu 4px below the field at full field width (Figma docs anatomy).
- Props: `size`, `layer`, `type` (`single` → `value: string | null`, `multi` → `value: string[]`), `value`/`defaultValue`/`onChange`, `open`/`defaultOpen`/`onOpenChange`, `options` (`{ value, label, disabled, headline, subtext, divider }`), `label`, `helperText`, `errorText`, `error`, `required`, `tooltip` (explainer), `placeholder`, `disabled`, `skeleton`, `menuMaxHeight` (Select menu "Scroll"), `name` (hidden inputs), `data-state` (`hovered` | `focused`). Ref → trigger button.
- Shared private helpers for Dropdown + Combobox: `select-field.ts` (selection/open state, navigation, type-ahead, outside press, truncation) and `select-field-parts.tsx` (chevron, tags, option menu, hidden inputs, skeleton). Label/helper/error from `text-input/field-parts`, backgrounds/strokes from `field-styles`.
- Tokens appended to `src/tokens/components/dropdown.css`: `--scanner-dropdown-height-{xl,lg,md,sm}` (60/48/36/28), `--scanner-dropdown-padding-y-lg` (10), `--scanner-dropdown-multi-padding-y-xl` (14), `--scanner-dropdown-skeleton-bar-{width,height-xl,height}` (40/16/8).

| Size | Field (Single) | Field with tags (Multi) | Text | Label/helper | Chevron | Tags | Skeleton bars |
|---|---|---|---|---|---|---|---|
| X-Large | 60 · 16/16 · gap 8 · r8 · `border-subtle` stroke | 14/16/14/8 | 18/28 | 16/24 | 24 (20 with tags) | Small | 16 |
| Large | 48 · 10/16 · gap 8 · r8 | 8/16/8/8 | 18/28 | 16/24 | 24 | Small | 8 |
| Medium | 36 · 8/12 · gap 8 · r8 | 4/16/4/4 | 14/20 | 12/16 | 20 | Small | 8 |
| Small | 28 · 4/8 · gap 4 · r4 | 4/8/4/4 | 14/20 | 12/16 | 20 | Extra small (gap 4) | 8 |

States: Hovered → chevron `icon-primary` (`:hover` / `data-state="hovered"`); Focused → `border-focus` stroke (`:focus-within`, `data-state="focused"`, and while the menu is open); Disabled → text/label/helper `text-disabled`, chevron `icon-disabled`, no stroke, disabled tags; Error → `border-error` stroke, error message (`role="alert"`), `aria-invalid`; Skeleton → label bar · field box · helper bar in `bg-highlight-gray` + pulse.

Behaviour: click field/trigger toggles; Enter/Space/ArrowDown/ArrowUp open (active = selected option or first); arrows (wrapping, skipping disabled) / Home / End move; Enter/Space select (Single closes, Multi toggles and stays open); Escape / Tab / outside press / blur close; type-ahead; Backspace/Delete on a closed Multi trigger removes the last tag; tag close buttons remove values and return focus to the trigger. Long Single values truncate with an ellipsis and show a tooltip (Figma "Overflow content"); tags wrap onto new rows and long tags truncate (Tag).

## Storybook coverage (`Components/Dropdown`)
`Default` (controls incl. Forced state) · `Size: X-Large / Large / Medium / Small` · `Type: Single / Multi` · `Selected: False` · `Layer set: Set 01 / Set 02` · `State: Hovered / Focused / Disabled / Error / Skeleton` · `Required field` · `Show explainer` · `Show label: False, Show helper: False` · `Menu open: Single / Multi` · `Menu: Scroll` · `Menu: headline, subtext, divider, disabled` · `Controlled (Multi)` · `AllSizes` · `AllStates` · `Figma matrix (all 192 variants)` · `Optional elements per size` · `Overflow content` · play tests `MouseSelect`, `KeyboardSelect`, `MultiSelectToggles`, `ClickOutsideCloses`, `DisabledIgnoresClick`.
Unit tests: `dropdown.test.tsx` — 15 passing.

## Visual comparison
Rendered `Figma matrix`, `AllStates` (2×), `Menu open: Multi` and `Overflow content` against Figma screenshots of `36616:12531` (X-Large Multi Selected), `33919:52407` (Medium Single Hovered), `33920:57393` (Small Multi Error) and the docs anatomy example `34121:35007`: field heights, paddings, radii, stroke colours per state, chevron sizes/colours, tag sizes, label/helper typography, menu offset/width match. Play stories reach their expected end state in the browser.

## Remaining deviations / Figma inconsistencies
- **Error label colour**: every Figma Error variant renders the label in `text-disabled` (likely copied from Disabled). Implemented as in Figma; this lowers label contrast — worth confirming with design (one-line change: pass `disabled` instead of `disabled || error` to `FieldHeader`).
- **Placeholder colour**: Dropdown placeholder is `text-primary` in Figma (same as the value); Combobox uses `text-tertiary`. Implemented per component.
- **X-Large stroke**: only X-Large has a `border-subtle` stroke in Enabled/Hovered; Large/Medium/Small have none. Implemented per size.
- X-Large Multi Selected chevron is 20px in 11 of 12 variants (24px in Set 01 Enabled); 20 implemented. Large Single Set 02 Enabled is 52px tall (12px padding) vs 48 everywhere else; 48 implemented.
- Figma Focused Multi Selected (Set 02, X-Large/Large) shows "Chevron up"; the docs anatomy shows the open menu with chevron down. Code shows chevron up while the menu is open, down otherwise.
- Figma Disabled Multi Selected keeps tags in Tag State=Enabled; code renders disabled tags (close buttons can't be used while the field is disabled).
- Figma docs say Multi select "includes checkboxes within the dropdown", but `_Select menu Item` only has Type=Single; selected options show the checkmark.
- Figma has no hover background on the field and no Hovered+Focused / Error+Focused variants; error keeps the error stroke while focused/open.
- Skeleton label/helper bars render only when `label` / `helperText` are set (Figma always shows both).
- Dark-mode values not verified against Figma.
