# Link — sign-off

**Figma**: `Link` set `36407:17744` (page `15305:6741`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Verified 2026-09-15.

**Variants**: Type (Primary, Secondary, Inversed, On color) × State (Enabled, Hovered, Focused, Disabled) × Size (Medium, Small) = 32, plus External and Text value.

**Storybook coverage** (`Components/Link`): `Default` (controls incl. Forced state), one story per Type, `External`, `AllSizes`, `AllStates`, `Hovered`, `Focused`, `Disabled`, `Figma matrix (all 32 variants)` (× External), `InlineInText`, play tests `ClickNavigates`, `KeyboardActivation`, `DisabledIgnoresClick`, `ExternalOpensNewTab`.

**Tests**: `link.test.tsx`, 15 passing.

## Fixed during audit
- Typography 14/20 (medium) and 12/16 (small) → Body 02 18/28 for both sizes (as in the component set)
- Gap 4 → 8px (Medium) / 4px (Small); external icon 20 / 16px
- External icon: a hand-drawn SVG → the Figma **Launch** glyph (registry `external` is a different glyph), coloured `icon-link` / `icon-primary` / `icon-inverse-secondary` / `icon-on-color-secondary`
- Hover: removed the colour change (On color went to primary). Figma only adds an underline (Link 02). The underline covers the text only, not the icon.
- Focus: 2px outline → 1px stroke, radius 4, 2px outside the content horizontally, in `border-focus` / `border-inverse-focus` / `border-on-color-focus` (before, it used hard-coded `white` and `blue-300` primitives)
- Disabled colours: `text-tertiary` / `white-alpha-25` primitives → `text-disabled` / `text-inverse-disabled` / `text-on-color-disabled`
- Added `disabled` prop (keeps `aria-disabled` support). Disabled links have no href, `role="link"`, `tabIndex=-1`, and clicks are ignored.
- Space opens the link (Figma keyboard spec), as well as Enter
- Click-only links (no `href`, e.g. PasswordInput's "Forgot password?") keep `role="link"`, stay focusable, and Enter/Space trigger `onClick`
- External links add an sr-only "(opens in a new tab)". Explicit `target` / `rel` are respected.
- Added `data-state` (hovered / focused) for forced states

## Remaining deviations / Figma notes
- **Size**: the Figma docs say Medium 18px / Small 14px, but every Small variant in the component set uses Body 02 (18/28). Scanner has no 14px body style. Implemented the component set: Size only changes gap and icon size.
- **Medium height**: Medium variants are fixed 60px frames, Small are 28px. Implemented a 28px line box for both.
- **On color text**: Medium Enabled/Hovered use `text-on-color-primary`, every other On color variant uses `-secondary`. Implemented secondary (the majority).
- **Stray stroke**: Small Inversed Enabled/Hovered/Disabled have a `border-inversed-focus` stroke on the component frame (Figma mistake). Not implemented.
- **Focus rectangle**: it sits at y=16 (Medium) and y=-2 (Small, Primary/Secondary/On color). Implemented it aligned to the text box for both.
- **Icon alignment**: Small variants top-align the 16px icon. Implemented centred for both sizes.
- **Skeleton**: the docs list a Skeleton state, but its example card shows a Disabled link and the set has no Skeleton variant. Not implemented.
- **Icon colours** for types other than Primary couldn't be read (the hidden icon instances have no children in the file). Mapped to the matching icon tokens.
