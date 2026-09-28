# Popover — sign-off

**Figma**: `Popover` component set `33048:29710` (page "Popover" `24156:42899`, Documentation frame `33039:17626`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 12 — Placement: Bottom (default), Top, Right, Left × Alignment: Start (default), Middle, End · Show carret (boolean) · Slot content (instance). Docs states: Hidden (default) / Visible.

**Figma values** (all 12 variants identical apart from layout direction):
- Container ("Tooltip" frame): `background-elevated`, padding spacing-04 (16px), gap 16px, radius medium (8px), hugs content 44–320px, content centred, clip content. **No shadow, no stroke.**
- Caret ("Carret"): 8×4 triangle in `background-elevated`, centred in a 52×4 frame with spacing-03 (12px) side padding → 22px from the container edge for Start/End, centred for Middle.
- Docs examples: caret tip 4px from the trigger; Start/End container edge 26px from the trigger centre (caret points at trigger centre).

**Implementation** (`src/components/popover/`):
- `PopoverBubble` — visual container + caret (`placement`, `alignment`, `showCaret`, `containerClassName`), same structure as `TooltipBubble`.
- `Popover` — trigger (`children`, single element) + `content`. Positioning mirrors `Tooltip`: absolute inside a `relative inline-flex` wrapper, 4px gap (`spacing-2`) as padding, Start/End via `--scanner-popover-anchor-offset` (26px).
- Behaviour: controlled (`open` + `onOpenChange`) / uncontrolled (`defaultOpen`); `triggerMode` `click` (default: trigger click / Enter / Space toggles) or `hover` (pointer hover or keyboard focus of the trigger; Figma docs "Interactions"). Escape closes (`closeOnEscape`), outside pointer-down closes (`closeOnOutsideClick`), Tab-away closes.
- Focus: click mode moves focus to the first focusable element in the content, else to the dialog (`tabIndex=-1`); Escape / trigger close return focus to the trigger; a programmatic close while focus is inside returns it too; outside click and Tab-away leave focus where the user put it. Opening via `defaultOpen` doesn't steal focus. Hover mode never moves focus.
- ARIA: `role="dialog"` `aria-modal="false"` with `label` / `labelledBy`; trigger gets `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`. The trigger's own `onClick` can `preventDefault()` to keep it closed.
- Tokens (`popover.css`): `--scanner-popover-min-width` 44px, `-max-width` 320px, `-caret-width` 8px, `-caret-height` 4px, `-caret-inset` 22px, `-anchor-offset` 26px, `-shadow` none.

**Storybook** (`Components/Popover`): `Default` (controls for every prop), `State: Visible` / `State: Hidden`, per Placement (`Bottom`, `Top`, `Right`, `Left`), per Alignment (`Start`, `Middle`, `End`), `Show carret: false`, `AllStates` (Hidden + Visible × alignment × placement, anchored to a trigger like the Figma docs), `FigmaMatrix` (12 variants × Show carret), `ControlledWithForm`, `Trigger mode: hover`, `LongContentWraps`; play tests `ClickOpensAndMovesFocus`, `KeyboardEscapeReturnsFocus`, `OutsideClickCloses`, `HoverOpensAndCloses`. Uses `SlotContent` as content.

**Tests**: `popover.test.tsx`, 29 passing.

**Visual check**: `FigmaMatrix`, `AllStates`, `Bottom`, `Left` and the `ClickOpensAndMovesFocus` play story vs Figma set + docs "Placement"/"Alignment" screenshots — container padding/radius, caret size and inset, 4px gap and caret-on-trigger-centre match.

## Deviations / Figma notes
- **No shadow in Figma**: a white `background-elevated` container with no shadow or stroke is invisible on white pages (the Figma docs examples show exactly that). Implemented as Figma (`--scanner-popover-shadow: none`) with a token override point; recommend design confirm `Depth 01` like Menu.
- Bottom/Start container has `max-width: 528px` in Figma; the other 11 variants and the docs sizing rule ("within four columns") use 320px — used 320px.
- Figma docs mention "auto" placement that flips to stay in the viewport; not implemented (placement is explicit, like Tooltip). No portal: the popover is positioned inside its wrapper, so `overflow: hidden` ancestors can clip it.
- The container centres its content (Figma `counterAxisAlignItems: CENTER`); pass `containerClassName="items-stretch"` for full-width forms.
- The caret doesn't get the shadow if `--scanner-popover-shadow` is overridden.
