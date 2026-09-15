# _MenuTrailingElements — sign-off

**Figma**: `_Menu trailing elements` set `31214:149912` (page "Menu" `30413:41881`). **Status**: ✅ Verified 2026-09-15.

**Variants**: Type (Submenu, Keyboard shortcut, Toggle) = 3, plus Show label (Submenu).

**Storybook coverage** (`Private/_MenuTrailingElements`): `Default` (controls), `Type: Keyboard shortcut / Toggle / Submenu / Submenu, Show label`, `AllStates` (enabled / disabled), `Figma matrix` (Type × Show label), `Options` (toggle on, multi-key, long label), play test `ToggleChanges`.

**Tests**: `menu-trailing-elements.test.tsx`, 8 passing.

## Fixed during audit
- Added an explicit Figma `type` prop. Inference from props still works, so the API is backwards compatible.
- Keyboard shortcut: 24px-tall right-aligned slot around the corrected `_KeyboardShortcut`
- Submenu: chevron is the default icon, 24px `icon-secondary` (was `text-secondary`). Label is 14/20 `text-secondary`, 8px gap.
- Toggle: uses the audited Figma-size Toggle (51.2×32) without value text, which matches the Figma Toggle instance exactly, so no Toggle change is needed. It previously had a hard-coded "Menu item toggle" label; that is now `toggleAriaLabel`.
- New `toggleInteractive={false}` renders the toggle as a visual only (aria-hidden, not focusable, clicks pass through). Menu items use this so the whole row is the `menuitemcheckbox`.
- New `disabled` (disabled colours, disabled Toggle); props extend `HTMLAttributes`

## Remaining deviations / Figma notes
- Figma's Submenu label layer uses style "Body/$tp-body-01" but is 14/20. Implemented 14/20.
- Figma has no disabled trailing element. Disabled colours are an extrapolation.
