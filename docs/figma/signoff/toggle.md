# Toggle — sign-off

**Figma**: `Toggle` set `24292:6271` (page `15305:6753`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Verified 2026-09-15.

**Variants**: Selected (False, True) × State (Enabled, Hovered, Pressed, Focused, Disabled, Skeleton) = 12, plus component props Show value and Text value.

**Storybook coverage** (`Components/Toggle`): `Default` (controls incl. Forced state), `Selected: False/True`, `Show value: False`, `Controlled`, `AllStates`, `Hovered`, `Pressed`, `Focused`, `Disabled`, `Skeleton`, `Figma matrix (all 12 variants)` (× Show value), `LongValue`, plus play tests (`ClickToggles`, `ClickValueTextToggles`, `KeyboardToggles`, `DisabledIgnoresClick`).

**Tests**: `toggle.test.tsx`, 13 passing.

## Fixed during audit
- Track size 36×20 → 51.2×32, handle 16 → 28px, 2px padding (component tokens `--scanner-toggle-*`)
- Colours now use the bound variables: off `bg-accent` / `-hover` / `-active`, on `bg-brand` / `-hover` / `-active`, handle `bg-on-color`. Before, it used primitive aliases and a white hard-coded handle with a shadow.
- Pressed no longer stretches the handle (Figma only changes the track colour)
- Disabled: `opacity-40` → `bg-disabled` track + `bg-on-color-disabled` handle + `text-disabled` label; hover/pressed feedback removed while disabled
- Focus: 2px outline offset → 1px `border-interactive` stroke, radius 20, 1.4px/2px outside the track (Figma "Border focus")
- Skeleton: pale pill → Figma skeleton (disabled-coloured track with handle position kept, 40×12 `bg-highlight-gray` value bar)
- Added the missing **Show value / Text value**: `children` becomes a `<label>` that names the switch and toggles on click (Body 02, 18/28, 8px gap)
- Added `data-state` (hovered / pressed / focused) for forced states. Selection moved from `data-state="checked"` to `aria-checked` + `data-selected`.
- Props now extend the button HTML attributes. `onClick` is called before `onChange` and `preventDefault()` cancels the toggle.

## Remaining deviations / Figma notes
- The Figma focus rectangle is 54×36 on a 51.2px track, so it's 1.4px outside horizontally and 2px vertically. Implemented exactly.
- Skeleton in Figma has no animation. We add `animate-pulse` (same as the other skeletons).
- The Figma docs say "Tab navigates to the radio button". Copy error, ignored.
- The track is now bigger (51.2×32), so `_MenuTrailingElements` renders a bigger switch. That matches the Figma Toggle, but the Menu owner should check it against the menu item design.
- Dark-mode token values not verified against Figma.
