# SearchInput — sign-off

**Figma**: `Search input` `849:95` (page Search input `15305:6748`) · **Variants**: Size (Large, Medium, Small) × Layer set (Set 01, Set 02) × {Filled=False State=Enabled, Filled=True State=Filled, Focused ×2 Filled, Skeleton ×2 Filled} = 36 · Component props: Show menu, Filled text value
**Status**: ✅ Built 2026-09-15

## API
`size` (`large` | `medium` | `small`, default `large`) · `layer` (1 | 2) · native input props (`value` / `defaultValue` / `onChange`, `placeholder` default "Search") · `onSearch(query)` on Enter · `onClear` · `clearLabel` · `skeleton` · `data-state="focused"` ·
Show menu → `suggestions` (`SelectMenuItem` children) + `showMenu` / `onShowMenuChange` (controlled or automatic) · `onSuggestionSelect(value)` · `menuSize` (default `x-large`, as Figma) · `menuMaxHeight`.
Filled is derived from the value. Tokens: `src/tokens/components/search-input.css` (heights 60/40/32, icon 24).

## Behaviour / a11y
- `<input type="search">` with `role="searchbox"`; accessible name = `aria-label` / `aria-labelledby`, else the placeholder. Native webkit cancel button hidden (the Figma Close icon is used).
- Clear (×) `button` while filled; Escape clears (focus returns to the input, `onChange` + `onClear` fire).
- With suggestions: `role="combobox"`, `aria-expanded`, `aria-controls` → `SelectMenu` (`focusMode="activedescendant"`, `tabIndex=-1`), `aria-autocomplete="list"`, `aria-activedescendant` → highlighted option.
  ArrowDown/ArrowUp open the menu and move the highlight (wrapping), Enter picks the highlighted option (else runs `onSearch`), Escape closes the menu first, then clears; blur and selection close it. Pressing the menu never moves focus out of the input.
  Menu is an absolutely positioned overlay 4px below the field, full field width.
- Enter without `onSearch` keeps native behaviour (form submit).
- Clicking anywhere on the field container focuses the input (Figma interaction zone).

## Storybook coverage (`Components/SearchInput`)
`Default` (controls incl. Forced state, Show menu) · `Size: Large / Medium / Small` · `Layer set: Set 01 / Set 02` · `State: Enabled / Filled / Focused / Focused (Filled) / Skeleton` · `Show menu` · `Suggestions (interactive)` · `AllSizes` · `AllStates` · `Figma matrix (all 36 variants)` · `Overflow content` ·
play tests `TypingAndEnterSearches`, `ClearButtonClears`, `EscapeClears`, `KeyboardSuggestions`, `ClickSuggestion`.
Unit tests: `search-input.test.tsx` — 23 passing.

## Figma values implemented
| Size | Height | Padding (v/h) | Gap | Text | Stroke (Enabled/Filled) |
|---|---|---|---|---|---|
| Large | 60 | 16 / 16 | 8 | Body 02 18/28 | `border-subtle` |
| Medium | 40 | 8 / 12 | 8 | Body 01 14/20 | none |
| Small | 32 | 4 / 8 | 4 | Body 01 14/20 | none |

Radius 8 · `background-layer-01/02` · Focused `border-focus` (inset, no layout shift) · Search icon + Close empty 24px `icon-tertiary` · placeholder `text-tertiary`, value `text-primary` · Skeleton `background-highlight-gray`.

## Remaining deviations / Figma inconsistencies
- **Skeleton heights**: Medium 36 / Small 28 in Figma (and Small skeleton padding 8/12), vs 40 / 32 for every other state. Implemented the field heights so the placeholder doesn't shift layout.
- **Close icon**: Large Set 02 Filled uses a 20px Close empty; the other 11 filled variants use 24px. Implemented 24px.
- **Filled text colour**: State=Filled binds the text to `icon-primary` (same value as `text-primary`); Focused+Filled uses `text-primary`. Implemented `text-primary`.
- Small: component radius 8 but its "Scroll mask" radius is 4 — implemented 8. The Scroll mask itself (a background patch hiding scrolled text under the icon; visible as a notch in the Large Filled stroke) is not reproduced.
- Figma "Show menu" places the menu in the auto-layout flow (pushes content); implemented as an overlay so it doesn't shift the page (e.g. Data table toolbar).
- No Hovered or Disabled variants in Figma. `disabled` is supported (disabled text/icon colours, no clear button) but not Figma-verified.
- Dark mode not verified against Figma.
