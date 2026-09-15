# AccordionGroup — sign-off

**Figma**: `02 Accordion group` `36403:2957` (page Accordion `15305:6721`) · **Variants**: Style (Line, Background 01, Background 02, Border) = 4
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` · `Style: Line / Background 01 / Background 02 / Border` · `Figma matrix (all 4 variants)` · `AllStates` (enabled / expanded / disabled / disabled-expanded + skeleton per style) · `Multiple expand (default)` · `Single expand` · `Show swap content` · `Skeleton` · `Controlled` · play tests `ArrowKeyNavigation` (Down/Up wrap, skip disabled, Home/End), `MultipleExpandToggles`, `SingleExpandCollapsesOthers` (all passing in headless Edge).
Unit tests: `accordion-group.test.tsx` — 12 passing.

## Fixed during audit
- **Keyboard**: Arrow Up/Down (wrapping) + Home/End between headers of the group (Figma docs "Arrow up and down — navigate between accordion headers"); disabled headers and focusables inside panels are ignored.
- **Expand mode default**: Figma docs say "Users can independently expand each section … multiple sections open at once" → `allowMultiple` now defaults to `true` (was `false`). Single-expand still available with `allowMultiple={false}`.
- Item ids are prefixed with a group `useId` — two groups with the same item ids no longer produce duplicate DOM ids.
- HTML attribute passthrough (`aria-label`, `onKeyDown`…), `headingLevel`, `title`/`description` accept ReactNode.
- Inherits every `_AccordionItem` fix (typography, chevron colours, focus strokes, skeleton).
- Stories: `storybook/test` play tests, no hardcoded colours, Figma matrix with four collapsed "Title" items.

## Visual comparison
Group heights match Figma: Line 240px (no gap), Background 01/02 and Border 264px (8px gap); item rendering identical to the Figma screenshot.

## Remaining deviations / Figma inconsistencies
- Figma group instances contain 16 items, 12 of them hidden; the React group renders exactly the `items` passed.
- Behaviour change: default `allowMultiple` flipped to `true` (see above); no in-repo usages affected.
