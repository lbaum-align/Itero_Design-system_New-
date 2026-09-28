# Combobox — sign-off

**Figma**: `Combobox` `34220:8533` (page Dropdown `15305:6738`) · **Variants**: Layer set (Set 01, Set 02) × Size (X-Large, Large, Medium, Small) × Type (Single, Multi) × Selected (False, True) × State (Enabled, Hovered, Focused, Disabled, Error, Skeleton) = 192 · Component props: Show label, Show helper, Required field, Show explainer, Filled / Placeholder / Label / Helper / Error text value
**Status**: ✅ Built 2026-09-15

## Implementation
- `src/components/combobox/Combobox.tsx` — WAI-ARIA editable combobox with list autocomplete: `<input role="combobox" aria-autocomplete="list">` + `SelectMenu` listbox via `aria-activedescendant`; a non-tabbable chevron button toggles the menu. Reuses the Dropdown private helpers (`dropdown/select-field.ts`, `dropdown/select-field-parts.tsx`), `text-input/field-parts` and `field-styles`, `Tag`.
- Props: same as Dropdown (`size`, `layer`, `type`, `value`/`defaultValue`/`onChange`, `open`/`defaultOpen`/`onOpenChange`, `options`, `label`, `helperText`, `errorText`, `error`, `required`, `tooltip`, `placeholder`, `disabled`, `skeleton`, `menuMaxHeight`, `name`, `data-state`) plus `filter` (custom predicate or `false` for server-side filtering), `onInputChange`, `noResultsText`. Ref → input.
- Tokens appended to `src/tokens/components/dropdown.css`: `--scanner-combobox-height-{xl,lg,md,sm}` (52/44/36/28), `--scanner-combobox-skeleton-height-xl` (60), `--scanner-combobox-input-min-width` (40, code-only); skeleton bars reuse `--scanner-dropdown-skeleton-bar-*`.

| Size | Field (Single) | Field with tags (Multi) | Text | Label/helper | Chevron | Tags | Skeleton |
|---|---|---|---|---|---|---|---|
| X-Large | 52 · 12/16 · gap 8 · r8 | 8/16/8/8 | 18/28 | 16/24 | 24 | Small | field 60, bars 16 |
| Large | 44 · 12/16 · gap 8 · r8 | 8/16/8/8 | 14/20 | 12/16 | 20 | Small | field 44, bars 8 |
| Medium | 36 · 8/12 · gap 8 · r8 | 4/16/4/4 | 14/20 | 12/16 | 20 | Small | field 36, bars 8 |
| Small | 28 · 4/8 · gap 4 · r4 | 4/8/4/4 | 14/20 | 12/16 | 20 | Extra small (gap 4) | field 28 r4, bars 8 |

States: placeholder `text-tertiary`, value `text-primary`; Hovered → chevron `icon-primary`; Focused → `border-focus` (`:focus-within`, `data-state="focused"`, menu open); Disabled → `text-disabled` / `icon-disabled`, no stroke; Error → `border-error`, error message, `aria-invalid`; Skeleton → bars + field box.

Behaviour: typing opens and filters (case-insensitive "contains"), first enabled match becomes active; ArrowDown opens on the selected/first option, ArrowUp opens on the last; arrows move (wrapping, skipping disabled); Enter selects (Single fills the input and closes; Multi toggles, clears the text and stays open); Escape closes, then clears the text (and a Single value); Backspace in an empty Multi input removes the last tag; Tab / outside press close. Leaving a Single field restores the selected label, commits an exact label match, or clears the value if the text was emptied. No matches → disabled "No results found" option. Next to tags the input collapses when idle and takes ≥40px while focused.

## Storybook coverage (`Components/Combobox`)
`Default` (controls incl. Forced state) · `Size: X-Large / Large / Medium / Small` · `Type: Single / Multi` · `Selected: False` · `Layer set: Set 01 / Set 02` · `State: Hovered / Focused / Disabled / Error / Skeleton` · `Required field` · `Show explainer` · `Show label: False, Show helper: False` · `Menu open: Single / Multi` · `Menu: no results` · `Menu: Scroll` · `Menu: headline, subtext, divider, disabled` · `Controlled (Multi)` · `AllSizes` · `AllStates` · `Figma matrix (all 192 variants)` · `Optional elements per size` · `Overflow content` · play tests `TypeToFilterAndSelect`, `MouseSelect`, `KeyboardNavigation`, `MultiTypeAndRemove`, `ClickOutsideCloses`, `DisabledIgnoresInput`.
Unit tests: `combobox.test.tsx` — 14 passing.

## Visual comparison
Rendered `Figma matrix` and `AllStates` (2×) against the Figma variant dump and the screenshot of `34220:8766` (Large Multi Selected Focused): heights 52/44/36/28 (48/48/40/32 with tags), paddings, radii, strokes, typography, chevron and tag sizes match. Play stories reach their expected end state in the browser.

## Remaining deviations / Figma inconsistencies
- **Error label colour** `text-disabled` in every Figma Error variant — implemented as in Figma; please confirm with design (contrast).
- **Value colour**: Figma Medium Single Selected Enabled/Hovered/Focused/Error (Set 01) and Set 02 Focused X-Large/Large use `text-tertiary` for the value; the majority is `text-primary` → implemented. Medium Multi placeholder is `text-primary` in some Set 01 variants; majority `text-tertiary` implemented.
- **X-Large skeleton** field box is 60px while the real field is 52px — implemented as in Figma (token `--scanner-combobox-skeleton-height-xl`).
- Figma has no text caret / input or clear button; code adds the editable input and uses Escape to clear (APG). Multi Selected Figma variants show only tags; the input sits after the tags.
- Figma Focused Multi Selected (Set 02, X-Large/Large) shows "Chevron up"; code shows chevron up while the menu is open.
- Disabled tags render in Tag State=Disabled (Figma keeps Enabled tags). "No results" state isn't designed in Figma.
- Skeleton label/helper bars render only when `label` / `helperText` are set. Dark mode not verified.
