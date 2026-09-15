# DateInput — sign-off

**Figma**: `Date input` `25493:22854` (page Date input `25493:21708`) · **Variants**: Layer set (Set 01, Set 02) × Filled (False, True) × State (Enabled, Focused, Disabled, Error, Skeleton) × Size (Large, Medium, Small) = 60 · Component props: Show label, Required field, Show helper, Show explainer, Date / Label / Helper / Error text value
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/DateInput`)
`Default` (controls for every prop incl. Forced state) · `Size: Large / Medium / Small` · `Layer set: Set 01 / Set 02` · `Filled: False / True` · `State: Focused / Disabled / Error / Skeleton` · `Required field` · `Show explainer` · `Show label: False, Show helper: False` · `AllSizes` · `AllStates` · `Figma matrix (all 60 variants)` · `LongContent` · play tests `TypingFiresOnChange`, `TabFocusesField`, `DisabledIgnoresInput`, `ErrorIsAnnounced` (all run to `finished` in the browser).
Unit tests: `date-input.test.tsx` — 16 passing.

## Fixed during audit
- **Sizes**: field heights 60 / 60 / 52 now fixed via component tokens (Large/Medium relied on content height, which broke with the 17px text; raw `h-[52px]`/`h-[60px]` removed); padding 16·16 / 16·12 / 4·8 unchanged.
- **Typography**: label/helper/error 16/24 (`Label/$tp-label-01`, was 17/24) and value/placeholder 18/28 (`Body/$tp-body-02`, was 17/28); placeholder `text-tertiary`, disabled `text-disabled`.
- **Layer set**: `bg-primary/secondary` → `--scanner-bg-layer-01/02`; strokes inside (inset shadow) instead of a 1px transparent border; Focused via `:focus-within` **and** `data-state="focused"` (the old Focused stories relied on `autoFocus`, so only one could show).
- **Error**: `aria-invalid` + separate error message id in `aria-describedby`; error message replaces helper.
- **Skeleton**: `bg-disabled` → `bg-highlight-gray`; label box / field box (size height) / helper box.
- **Explainer** placement bottom → top (shared `FieldHeader`); required asterisk 12/16 `text-error`, `aria-required`.
- Clicking the field container focuses the input (Figma interaction docs); consumer `aria-describedby` is merged instead of replacing the helper id; `data-layer` on the root.
- Label / helper / error use the shared field parts (`text-input/field-parts.tsx`, `field-styles.ts`).
- Default `label` / `helperText` / `errorText` were the Figma placeholder strings ("Label", "Optional helper text", "Error text message"); they are now unset by default (`showLabel`/`showHelper` still default to `true`).

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot: heights, padding, radius, backgrounds per layer set, placeholder vs filled colours, focus/error strokes, disabled colours and skeleton boxes match for all 60 variants.

## Remaining deviations / Figma inconsistencies
- Figma Small skeleton label/helper boxes have arbitrary widths (81/115 and 116/188px); Large/Medium use 40px. Implemented 40px everywhere.
- Small field is 52px tall with 4px vertical padding (taller than its 28px content); implemented as drawn.
- Explainer: Disabled variants keep the Explainer bound to "Show explainer" (not hidden), so the explainer still renders in disabled fields. Instance is `Placement=Top, Alignment=Start`; the shared `FieldHeader` uses middle alignment.
- Filled is derived from the value (no prop); the input is a plain text field (no masking/validation) per Figma docs.
- Dark mode not verified against Figma.
