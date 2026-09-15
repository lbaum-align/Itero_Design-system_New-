# _MenuItems — sign-off

**Figma**: `_Menu items` set `30413:41882` (page "Menu" `30413:41881`). **Status**: ✅ Verified 2026-09-15.

**Variants**: Size (Large, Medium, Small) × Type (Neutral, Destructive) × State (Enabled, Hovered, Focused, Disabled) = 24, plus Show divider, Show headline, Show subtext, Indented, Selected, Show trailing element, Option/Headline/Subhead text.

**Storybook coverage** (`Private/_MenuItems`): `Default` (controls incl. Forced state and every Figma property), `Type: Neutral/Destructive`, `Selected`, `Indented`, `Show headline`, `Show subtext`, `Show divider`, `Show trailing element (all types)`, `AllSizes`, `AllStates`, `Hovered`, `Focused`, `Disabled`, `Figma matrix (all 24 variants)` + boolean-property grid per size, `LongLabelTruncates`, play tests (`ClickActivates`, `KeyboardActivation`, `DisabledIgnoresClick`, `ToggleItemChecks`).

**Tests**: `menu-items.test.tsx`, 14 passing.

## Fixed during audit
- Item heights: Figma variants are fixed 60 / 58 / 52 blocks (row + optional 8px divider). The row fills the block and centres its content. Tokens: `--scanner-menu-item-height-*`.
- Option text: raw `text-[18px]`/`text-[16px]` → `text-scanner-md`/`leading-lg` (Large) and `text-base`/`leading-md` (Medium/Small)
- Text column gap 4px, subtext 14/20 `text-secondary` (disabled: `text-disabled`), headline 12/16 `text-secondary`
- Headline padding per size: Large 12/12/8/12, Medium 8, Small 8/4/4/4 (Medium was 8, Small was 12/4/4/4)
- Focus: 2px outline → 1px `border-focus` stroke inside the row (inset shadow). Forcing `data-state="focused"` on a disabled item no longer shows a ring.
- Selected checkmark: Material `check` icon → Figma "Checkmark empty" 20×20 glyph (`icon-primary` / `icon-disabled`). Selected replaces the Indented space.
- Divider: `border-t` on a 1px box → 1px `border-subtle` line 3px into an 8px frame
- Trailing element: removed the forced `h-6`, which squashed the 32px Toggle. Disabled items now pass `disabled` down instead of using `opacity-40`.
- A11y / keyboard: `role="none"` wrappers; roving `tabIndex=-1` inside `Menu`; `aria-labelledby` option text, `aria-describedby` subtext; `aria-keyshortcuts` from the shortcut. Boolean `selected` or a toggle trailing element makes the row a `menuitemcheckbox` with `aria-checked`; the row toggles on activation. Submenu rows get `aria-haspopup="menu"` and open with ArrowRight. Enter/Space trigger a real click instead of casting a KeyboardEvent.
- Added `data-state` typing; `label`/`headline`/`subtext` accept ReactNode. Size still comes from `Menu` context.

## Remaining deviations / Figma notes
- **Heights**: the Menu doc text says "Large 44px / Medium 36px / Small 28px", but every variant, every Menu instance and the doc illustrations use 60 / 58 / 52. Implemented the geometry (60 / 58 / 52).
- Figma Large *Disabled* option text is 14/20 (Body 01); the other Large states are 18/28. Implemented 18/28.
- Headline padding is inconsistent in Figma: Large Disabled 12/8/8/8, Medium Enabled 12/8/8/8. Implemented the majority value.
- Figma Destructive variants have no checkmark or trailing-element layers. `selected` is ignored for Destructive; the trailing element is still allowed (superset).
- Fixed heights are `min-height`, so a subtext or long content grows the item instead of clipping it like Figma.
- Figma asks for a tooltip on truncated labels. There is no tooltip here; the consumer can wrap the label.
