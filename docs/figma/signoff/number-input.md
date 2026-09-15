# NumberInput — sign-off

**Figma**: `Number input` `36634:12646` (page Number input `15305:6746`) · **Variants**: Layer set (Set 01, Set 02) × State (Enabled, Focused, Disabled, Error, Skeleton) × Size (X- Large, Large, Medium, Small) = 40 · Component props: Show label, Show helper, Show controls, Show explainer, Number / Label / Helper / Error text value
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/NumberInput`)
`Default` (controls for every prop incl. Forced state) · `Size: X-Large / Large / Medium / Small` · `Layer set: Set 01 / Set 02` · `State: Focused / Disabled / Error / Skeleton` · `Show explainer` · `Show controls: False` · `Show label: False, Show helper: False` · `Min / max / decimal step` · `Controlled` · `AllSizes` · `AllStates` · `Figma matrix (all 40 variants)` · `LongContent` · play tests `ControlsStepValue`, `KeyboardStepping`, `TypingClampsOnBlur`, `DisabledIgnoresInput`, `ErrorIsAnnounced` (all run to `finished` in the browser).
Unit tests: `number-input.test.tsx` — 24 passing.

## Fixed during audit
- **Sizes**: heights 60/44/36/28 as component tokens (was `h-[28px]`… and X-Large `min-h-44 max-h-60`); padding per Figma 16·8·16·16 / 8·8·8·16 / 4·4·4·12 / 4·0·4·8; radius 8 at every size.
- **Typography**: X-Large label/helper 16/24 + value 18/28 (was raw `text-[16px]`/`text-[18px]`); Large/Medium/Small 12/16 + 14/20.
- **Controls**: now the Figma ghost `Button` (hover/pressed/disabled from Button) resized to 32px/24px icon (X-Large) and 28px/20px icon, 4px gap, 16px `border-subtle` divider; Figma "Subtract empty" / "Add empty" glyphs (registry `minus`/`add` were different icons, `add` is a circled plus).
- **Layer set**: `bg-primary/secondary` → `--scanner-bg-layer-01/02`; strokes drawn inside (inset shadow) instead of a 1px transparent border; Focused via `:focus-within` **and** `data-state="focused"`.
- **Skeleton**: `bg-disabled` → `bg-highlight-gray` + pulse, label box / field box / helper box as in Figma.
- **Bugs**: `{...rest}` overrode the internal `onBlur`/`onKeyDown` (clamp-on-blur and arrow keys broke when a consumer passed handlers); the field could not be cleared and `-`/`.` could not be typed (value snapped back); typing towards a value outside `min` was clamped per keystroke; decimal steps produced `0.30000000000000004`.
- **Behaviour**: draft text while typing, in-range values emitted immediately, out-of-range clamped on blur/Enter, empty text reverts; PageUp/PageDown (×10); readOnly blocks stepping; controls keep focus in the input; clicking the field container focuses the input; `aria-describedby` merges consumer ids; error message only when `errorText` is set (shared `FieldMessage`, `role="alert"`).
- Label / explainer / helper / error use the shared field parts (`text-input/field-parts.tsx`, `field-styles.ts`) for consistency with TextInput / TextArea / PasswordInput. New props: `decrementLabel`, `incrementLabel`, `data-state`.

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot: field heights, padding, radii, layer backgrounds, focus/error strokes, disabled colours, control sizes/glyphs/divider and skeleton boxes match for all 40 variants.

## Remaining deviations / Figma inconsistencies
- X-Large **Focused** variants use 48px Large ghost buttons (inside a 60px field); all other X-Large states use 32px. Implemented 32px.
- Medium / Small **Disabled** variants keep the controls in State=Enabled; X-Large / Large disable them. Implemented disabled controls at every size.
- **Show explainer** exists as a component property but is not bound to the Explainer layer (hidden in all 40 variants). Implemented per the documentation (explainer next to the label); it is not hidden when Disabled — Figma gives no Disabled rule for this component.
- Explainer instance is `Placement=Top, Alignment=Start`; the shared `FieldHeader` renders `position="top"` with the default middle alignment (owned by the TextInput folder).
- Small field has 0 right padding in Figma (controls flush); kept even when `showControls={false}`.
- `errorText` no longer defaults to the Figma placeholder "Error text message" (consistent with TextInput).
- Dark mode not verified against Figma.
