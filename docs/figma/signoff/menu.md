# Menu — sign-off

**Figma**: `Menu` set `30413:43333` (page "Menu" `30413:41881`). **Status**: ✅ Verified 2026-09-15.

**Variants**: Size (Large, Medium, Small) = 3, plus Scroll boolean.

**Storybook coverage** (`Components/Menu`): `Default` (controls), `Size: Large/Medium/Small` (Figma content), `AllSizes`, `Figma matrix (3 sizes × Scroll)`, `AllStates` (forced item states per size), `Anatomy` (Figma anatomy example), `WithHeadlines`, `Scroll (long list)`, `LongLabelTruncates`, play tests (`KeyboardNavigation`, `ClickActivatesItem`).

**Tests**: `menu.test.tsx`, 8 passing.

## Fixed during audit
- Width: `min-w-[120px] max-w-[288px]` (hard-coded) → 180px default width, min 120 / max 288, via `menu.css` tokens
- Large border: CSS `border` (adds 2px to the layout) → 1px inset `border-subtle` ring
- Scroll: the fake absolute 116px bar is now a real scroll container (`overflow-y-auto`, thin `border-subtle` scrollbar) with a new `maxHeight` prop
- Keyboard: roving focus. The container is tabbable only while focus is outside and forwards focus to the first item; Arrow keys skip disabled items and wrap; Home/End; Escape → `onClose` (no longer `preventDefault` without a handler). Also matches `menuitemcheckbox`/`menuitemradio`. Added `autoFocus` (`true`/`'first'`/`'last'`) and `aria-orientation`.
- `MenuDivider`: same 8px / 1px line as the item divider; `role="separator"` is no longer hidden from AT
- Context now tells items they are in a menu (`inMenu`). The unused register callbacks are kept but deprecated.

## Remaining deviations / Figma notes
- **Shadow**: Figma "Depth 01" is `0 2px 12px #00000020`. `--scanner-shadow-depth-01` in `effects.css` is still a placeholder two-layer shadow. The code uses the token, so fixing the token fixes the Menu (shared change requested).
- Figma Scroll is a decorative 4×116 thumb at right 4 / top 12. Code uses the native thin scrollbar, like TextArea.
- Figma docs mention Placement (top/bottom) and Alignment (start/end) relative to a trigger. Positioning belongs to a future Popover/Menu button, not to this panel.
- Dark mode not verified against Figma.
