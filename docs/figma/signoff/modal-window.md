# ModalWindow — sign-off

**Figma**: `Modal window` `13483:13690` (page Modal window `15305:6744`) · **Variants**: Size (Small, Medium, Large, X-large) = 4, plus booleans Show description, Show slot content, Show actions, Secondary action, Tertiary action, Closable and texts Title / Description
**Status**: ✅ Built 2026-09-15

## API
`open` / `onClose(reason: 'close-button' | 'escape' | 'overlay')` (controlled) · `size` · `title` · `description` + `showDescription` · `children` + `showSlotContent` · `showActions` · `primaryActionText` / `onPrimaryAction` / `primaryActionProps` · `secondaryAction` + `secondaryActionText` / `onSecondaryAction` / `secondaryActionProps` · `tertiaryAction` + `tertiaryActionText` / `onTertiaryAction` / `tertiaryActionProps` · `actions` (custom) · `closable` · `closeLabel` · `closeOnOverlayClick` (default false) · `initialFocusRef` · `inline` (window only, for docs/visual tests). Ref → the window `<div>`; rest props spread onto it.

## Implementation
- Native `<dialog>` + `showModal()` (falls back to the `open` attribute where unsupported): page behind is inert, overlay `--scanner-bg-overlay` painted on the full-viewport dialog, window centred with 28px padding.
- `aria-modal="true"`, `aria-labelledby` → `<h2>` title, `aria-describedby` → description (only when shown).
- Initial focus: `initialFocusRef` → first focusable (close icon when closable) → window. Tab / Shift+Tab wrap inside the window. Escape → `onClose('escape')` only when closable (native `cancel` is always prevented so `open` stays controlled; Escape already handled by a nested widget via `preventDefault` is ignored). Focus returns to the opener on close. Body scroll locked (ref-counted for nested modals).
- Actions: `ButtonGroup` (8px gap, wraps, right-aligned) with Large Buttons in Figma order Tertiary (secondary) · Secondary (secondary) · Primary (brand primary; `primaryActionProps={{ variant: 'danger' }}` for destructive).
- Long content: title truncates on one line (as Figma), description + slot scroll inside the window when it reaches the viewport height.

## Storybook coverage
`Default` (real modal, controls for every prop) · `Size: Small | Medium | Large | X-large` (inline) · `Figma matrix (all 4 variants)` · `AllSizes` (with slot) · `AllStates` (every boolean vs Figma defaults, danger+loading primary) · `Long content` · `Slot content: form` (initialFocusRef, overlay click) · play tests `OpenAndEscape`, `FocusTrap`, `CloseButtonAndActions`, `NotClosable` — all passing in headless Edge (checked via Storybook `storyFinished` status).
Unit tests: `modal-window.test.tsx` — 21 passing (jsdom `showModal`/`close` polyfilled).

## Tokens
`src/tokens/components/modal-window.css`: `--scanner-modal-window-width-sm|md|lg|xl` (432/656/880/1104), `--scanner-modal-window-spacing` (28px), `--scanner-modal-window-close-size` (36px), `--scanner-modal-window-close-focus-width` (2px). Everything else semantic/spacing tokens (`bg-layer-01`, `bg-overlay`, `radius-xl`, `spacing-7`/`-6`/`-3`, `text-lg`/`leading-xl`, `scanner-text-body-02`, `icon-secondary`).

## Visual comparison
Figma matrix screenshot vs Figma set: Small 432×264, Medium 656×240, X-large 1104×212 — identical sizes; Large 880×240 (Figma 248, see below). Title, close icon, description wrapping and button positions match. Opened modal in Chrome: `:modal` true, overlay `rgba(0,0,0,.63)`, focus on Close, body `overflow:hidden`. Dark theme checked.

## Remaining deviations / Figma inconsistencies
- Spacing variables resolve in the page's **"Scanner" mode** (`spacing-06` = 28px, `spacing-04` = 20px, `spacing-05` from "02 Spacing" = 24px). Implemented the rendered values; 28px has no global token → component token.
- Size=Large is the outlier: 28px top padding (others 24), Content gap 32 and Headline gap 16 (others 28 / 8), a white 32×32 "Frame 1" instead of the Close instance, and a "Depth 01" shadow on the window and overlay. Implemented the majority (24 top, 28 / 8 gaps, close icon, no shadow).
- Small has 24px padding on all sides; Medium/Large/X-large have 24 top and 28 elsewhere. Implemented per size.
- Radius variable "large" resolves to 16px in the Corner radius collection (our `--scanner-radius-lg` is 12) → `--scanner-radius-xl`.
- The Secondary-action button instance is stale (2px stroke, 100px min width); current Button spec used. Figma shows no close-icon states — hover `bg-hover`, pressed `bg-active`, 2px inset `border-focus` ring added.
- Slot content placeholder ("Swap me to any component", dashed border) is design-only; `children` render in the slot area without a border.
- A scrollable description with no focusable content can't be scrolled by keyboard (no tab stop is added on the scroll area).
