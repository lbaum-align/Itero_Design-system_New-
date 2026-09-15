# PasswordInput — sign-off

**Figma**: `Password input` `6176:2285` (page Password input `15305:6752`) · **Variants**: Layer set (Set 01, Set 02) × Filled (True, False) × State (Enabled, Focused, Disabled, Error, Skeleton) × Visible (False, True) = 40 · Component props: Show label, Show helper, Show placeholder, Show explainer, Required, Show link, label/helper/error/password text
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/PasswordInput`)
`Default` (controls incl. Forced state) · `Layer set: Set 01 / Set 02` · `Filled: False / True` · `Visible: True` · `State: Focused / Disabled / Error / Skeleton` · `Required` · `Show explainer` · `Show label/link/helper: False` · `Controlled visibility` · `AllStates` · `Figma matrix (all 40 variants)` · `Overflow content` · play tests `ToggleVisibility`, `KeyboardToggle` (Tab + Enter/Space), `DisabledIgnoresInput`, `ErrorIsAnnounced`.
Unit tests: `password-input.test.tsx` — 14 passing.

## Fixed during audit
- **Colours**: label `text-primary` → **text-secondary** (disabled `text-tertiary` → **text-disabled**); value `icon-primary` → **text-primary**; placeholder `text-secondary` → **text-tertiary**; helper `text-primary` → **text-secondary**; toggle icon `icon-secondary` → **icon-tertiary** (disabled `icon-disabled`).
- **Visibility icons**: registry `eye`/`eye-off` (filled Material glyph) replaced by Figma's outlined "View on"/"View off" assets (local `visibility-icons.tsx`).
- **Toggle visibility rule**: previously always shown; Figma shows it when Filled or while Focused (empty) — implemented with `:focus-within` / `data-state`.
- **Visibility state**: passing only `onPasswordVisibleChange` used to break the toggle; now uncontrolled state always updates, callback always fires; new `defaultPasswordVisible`; `aria-pressed` + `aria-controls`.
- **Link**: Figma `Link / Primary / Small` with 16/24 text; uses the shared `Link` with size small.
- **Field**: strokes as inset shadows; Focused `border-focus` (`:focus-within` + `data-state="focused"`), Error `border-error`; background `--scanner-bg-layer-01/02`; height 60, padding 16, gap 8.
- **Skeleton**: `bg-disabled` → `bg-highlight-gray` + pulse; label and helper bars 40×16 (Figma), no explainer circle (hidden in Figma).
- Root no longer carries `data-state="error|disabled|skeleton"`; `data-state` is the forced visual state on the field (like the other inputs). `aria-required`, `aria-disabled` added; `aria-describedby` merges consumer ids.
- Explainer placement Top; clicking the field container focuses the input.

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot (`6176:2285`): all 40 variants match (label/link row, masked/visible value, eye icons, stroke colours, skeleton).

## Remaining deviations / Figma inconsistencies
- Figma Set 01 Disabled Filled Visible=False has no toggle icon while the other 3 Disabled Filled variants show it — code shows it (disabled).
- Figma keeps the "Forgot password?" link enabled in Disabled variants — implemented as in Figma.
- Figma "Scroll mask" (left fade while horizontally scrolling) not reproduced.
- Link is only a focusable anchor when `linkHref` is set (the shared `Link` renders no `href` otherwise).
- Figma defines no Hovered state; Error + focus keeps the error stroke.
- Dark-mode values not verified against Figma.

> **Update (icon registry audit):** local Figma glyph copies in this component were moved into the shared icon registry (`src/icons/registry.tsx`, exact Figma exports); rendered output is unchanged. See [icons.md](icons.md).
