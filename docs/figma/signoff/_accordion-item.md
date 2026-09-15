# _AccordionItem — sign-off

**Figma**: `_01 Accordion item` `36403:3026` (page Accordion `15305:6721`) · **Variants**: Style (Background 01, Background 02, Border, Line) × State (Enabled, Hovered, Focused, Disabled, Skeleton) × Expanded (False, True) = 40 · Title / Description text · Show swap content · Swap content
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (controls for every prop incl. "Forced state") · `Expanded: False` / `Expanded: True` · `Style: Background 01 / Background 02 / Border / Line` · `Hovered` · `Focused` · `Disabled` · `Skeleton` · `AllStates` (style × state, Expanded control) · `Figma matrix (all 40 variants)` · `Show swap content` · `LongTitleWraps` · play tests `ClickToggles`, `KeyboardToggles` (Tab, Enter, Space), `DisabledIgnoresClick` (all passing in headless Edge).
Unit tests: `accordion-item.test.tsx` — 16 passing.

## Fixed during audit
- Title 17px → Heading/$tp-headling-02 (18/28 medium); description 17px → Body/$tp-body-02 (18/28). Weight classes were `font-[var(...)]` (not compiled as font-weight).
- Chevron colour: `icon-secondary` → `icon-tertiary`, and **Hovered/Focused turn it `icon-primary`**; chevron swaps down/up like Figma.
- Removed the hover background — Figma Hovered only changes the chevron.
- Focus: 2px `outline` with an invalid token (`--scanner-focus-ring` as outline colour) → 1px `border-focus` stroke: inside the whole item (Background/Border, collapsed) or the header (expanded, top radius only); outside the item (Line, collapsed — replaces the divider) or outside the header (Line, expanded).
- Border style used a CSS `border` (+2px size); now an inset 1px `border-subtle` stroke (stays `border-subtle` when disabled, as in Figma). Line divider `border-disabled` when disabled/skeleton.
- Skeleton: placeholders used `bg-disabled` + hardcoded px → `background-highlight-gray`; chevron shown in `icon-disabled`; 6 content lines (16px, 8px gap, last 96px); `ref`/`className` now applied.
- Hardcoded `h-[60px]` removed — height comes from 16px padding + 28px line height (measured 60 / 328 / 212px = Figma).
- Show swap content: `children` used to *replace* the description; now rendered below it with the 16px gap (Figma slot).
- A11y: header button wrapped in a heading (`headingLevel`, default h3); panel always rendered with `hidden` so `aria-controls` always resolves; `aria-disabled`.
- API (backwards compatible): `id` optional (auto `useId`), uncontrolled mode (`defaultExpanded`), `onToggle(nextExpanded)`, `title`/`description` accept ReactNode, HTML attribute passthrough, `data-state` (hovered | focused) forwarded to the header.
- Stories: removed hardcoded `#e8e8e8`/`#666` colours and hover/focus columns that rendered the enabled state.

## Visual comparison
Figma matrix screenshot vs. Storybook `FigmaMatrix`: sizes identical (288×60 collapsed, 288×328 expanded, 288×212 skeleton), colours, strokes and chevrons match for all 40 variants.

## Remaining deviations / Figma inconsistencies
- Line + Focused: Figma keeps the chevron `icon-tertiary`; the other three styles use `icon-primary`. Implemented `icon-primary` for all.
- Line + Expanded: header gap is 16px in Figma (8px in every other variant). Implemented 8px (only visible with very long titles).
- Skeleton + Expanded: Background 01/02/Border show a *down* chevron, Line shows *up*. Implemented: chevron follows `expanded` for all styles.
- Line style: the hidden "Slot content" is 288px wide (overflows the 16px side padding); other styles 256px. Implemented within the padding.
- Figma radius variable is named "large" but is 16px → `--scanner-radius-xl`.
