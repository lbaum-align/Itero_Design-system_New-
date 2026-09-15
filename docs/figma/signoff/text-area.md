# TextArea — sign-off

**Figma**: `Text area` `6176:2286` (page Text area `23885:186323`) · **Variants**: Layer set (Set 01, Set 02) × Filled (False, True) × State (Enabled, Focused, Disabled, Error, Skeleton) = 20 · Component props: Show label, Show helper, Show placeholder, Show explainer, Required, Show counter, Show scroll, label/helper/error/placeholder/counter/filled text
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/TextArea`)
`Default` (controls incl. Forced state) · `Layer set: Set 01 / Set 02` · `Filled: False / True` · `State: Focused / Disabled / Error / Skeleton` · `Required` · `Show explainer` · `Show counter` · `Show scroll (overflowing content)` · `Show label: False, Show helper: False` · `Clearable: false` · `Controlled: counter + required + explainer` · `AllStates` · `Figma matrix (all 20 variants)` · play tests `TypingUpdatesCounter`, `ClearButtonClears` (keyboard), `DisabledIgnoresInput`, `ErrorIsAnnounced`.
Unit tests: `text-area.test.tsx` — 15 passing.

## Fixed during audit
- **Stories**: removed `useState` calls inside `render` (oxlint rules-of-hooks errors) — hooks now live in the named `ControlledDemo` component.
- **Typography**: label 18/28 → **16/24**, value/placeholder 20/32 → **18/28**, helper/error 18/28 → **16/24**, counter 16/24 → **12/16**.
- **Field**: min-height 80 → Figma height **108px** (resizable, min 52px), padding 12/16, gap 8, radius 8; background `--scanner-bg-layer-01/02`.
- **Strokes** as inset shadows: Enabled `border-subtle`, Focused `border-focus` (`:focus-within` + `data-state="focused"`, which previously did nothing), Error `border-error`, Disabled none. Removed the non-Figma hover stroke.
- **Resize handle**: native textarea grip replaced by Figma's 8px glyph at the field corner (3px inset), `icon-secondary` / `icon-disabled`; the whole field resizes vertically, disabled can't resize.
- **Show scroll**: native scrollbar styled thin with `border-subtle`.
- **Clear button**: shown on every Filled non-disabled variant as in Figma (new `clearable`, default true — previously only with `onClear`); now clears uncontrolled content, fires `onChange` + `onClear`, refocuses, keyboard reachable.
- **Counter**: worked only for controlled values; now counts uncontrolled input too; explicit `counter` text supported.
- **Disabled**: explainer no longer hidden; label + counter `text-disabled`.
- **Skeleton**: `bg-disabled` → `bg-highlight-gray` + pulse; label bar 40×8, counter bar 28×8, helper bar 40×8.
- Explainer placement Top; clicking the field container focuses the textarea; `aria-disabled` added.

## Visual comparison
Rendered `AllStates` / `Figma matrix` vs Figma set screenshot (`6176:2286`): colours, strokes, close icon, resize handle, typography and spacing match.

## Remaining deviations / Figma inconsistencies
- Figma Set 01 Filled=False Focused/Disabled/Error placeholders are 14/20; every other variant is 18/28 — 18/28 implemented.
- Figma Skeleton field box is 124px tall vs the 108px field — code uses 108px so the layout doesn't jump when loading ends.
- The scrollbar sits at the textarea's right edge (left of the clear button) rather than at the field edge as in Figma.
- Firefox draws its own resize grip under the Figma glyph (`::-webkit-resizer` hiding is WebKit/Blink only).
- Figma defines no Hovered state; Error + focus keeps the error stroke.
- Dark-mode values not verified against Figma.
