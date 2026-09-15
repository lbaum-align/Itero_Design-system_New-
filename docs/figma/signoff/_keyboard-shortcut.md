# _KeyboardShortcut — sign-off

**Figma**: `_Keyboard shortcut` component `30412:28270` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Verified 2026-09-15.

**Variants**: 1 component (no variant properties). Layer toggles: glyphs Command / Option / Shift / Erase (16×16, `icon-secondary`) and letters X / Y / Z (12/16, `text-secondary`). Right-aligned, no gap.

**Storybook coverage** (`Private/_KeyboardShortcut`): `Default` (controls), `Disabled`, `Glyphs` (every glyph layer + letters), `AllStates`, `Figma matrix`, `CommonShortcuts`, play test `GlyphsHaveAccessibleNames`.

**Tests**: `keyboard-shortcut.test.tsx`, 6 passing.

## Fixed during audit
- Removed key caps (border, background, radius, padding) — Figma draws bare glyphs and letters
- Modifier keys (`⌘`/Cmd/Meta, `⌥`/Opt/Alt, `⇧`/Shift, `⌫`/Backspace/Delete) now render the Figma vectors (exported paths at their Figma offsets in a 16×16 frame) with an `sr-only` name; other keys are 12/16 text
- Gap 2px → 0; key text colour `text-secondary`, glyph colour `icon-secondary`
- Added `disabled` (text/icon disabled colours) for use inside disabled menu items; props now extend `HTMLAttributes`
- Token: `--scanner-keyboard-shortcut-glyph-size` (16px) in `logos.css`

## Remaining deviations / Figma notes
- The Figma text style is "Label/$tp-label-01" at 12/16, but `typography.css` `.scanner-text-label-01` is 16/24. Used `text-xs`/`leading-xs` directly.
- Figma has no glyph for Control; "Ctrl" renders as text.
- `disabled` is not a Figma property (Figma's disabled menu item doesn't show a shortcut). Disabled colours are an extrapolation.
