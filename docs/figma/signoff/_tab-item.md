# _TabItem — sign-off

**Figma**: `_Tab item` `28:1602` (page Tab `15305:6750`) · **Variants**: State (Enabled, Hovered, Focused, Selected, Disabled) · Show badge · Text value · Private (not in `src/index.ts`)
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Private/_TabItem`, was `Components/_TabItem`)
`Default` (controls incl. Forced state) · `Enabled` · `Hovered` · `Focused` · `Selected` · `Disabled` · `Show badge: True` · `Skeleton (code-only)` · `AllStates` (+ Selected+Focused) · `Figma matrix (all variants)` (State × Show badge) · play tests `ClickAndKeyboard`, `DisabledIgnoresClick`.
Unit tests: `tab-item.test.tsx` — 7 passing.

## Fixed during audit
- Enabled colour text-primary → **text-secondary**; Hovered/Focused/Selected → text-primary (used `icon-primary` as a stand-in).
- Disabled text-tertiary → **text-disabled**; added `aria-disabled`.
- Typography: hardcoded `text-[length:18px]` + invalid weight class → `.scanner-text-heading-02`.
- Hardcoded `h-[60px]` → `--scanner-tab-item-height`.
- Selected indicator: 2px bottom border → inset box-shadow (Figma stroke is inside); focus 1px outline → outside box-shadow; both combine for Selected+Focused.
- `data-state="hovered|focused"` now works for both (focused previously only via outline classes).
- Added `badge` slot (Figma "Show badge"), 8px gap.
- Skeleton: inline-style 82×60 grey block with `bg-tertiary` → label-sized `bg-highlight-gray` pulse (code-only).

## Visual comparison
Tab group measured 70×60 per item (Figma 71×60), text top 10px, 18/28/500, indicator 2px `#009ace`; screenshot of matrix matches Figma screenshot.

## Remaining deviations / Figma inconsistencies
- Figma Focused variant is a fixed 82px wide with centred text (others hug 71px); implemented hug width for all states.
- "Show badge" has no layer bound to it in Figma; badge slot placement (after the label, 8px gap) follows the item's auto-layout gap.
- Skeleton isn't a Figma state (kept for backwards compatibility).
