# TagGroup — sign-off

**Figma**: `02 Tag group` `33521:164887` (page "Tag" `22123:13333`)
**Variants**: Size (Large, Medium, Small, Extra small) = 4.

## Storybook coverage (`Components/TagGroup`)
`Default` · `Large` / `Medium` / `Small` / `Extra small` · `AllSizes` · `Figma matrix (all 4 variants)` · `AllStates` (enabled, forced focus, disabled, skeleton tags per size) ·
`Wrapping` · play test `RemoveTags` (click + keyboard removal). Unit tests: `tag-group.test.tsx` (5).

## Fixed during audit
- Group size now propagates to child `Tag`s without their own `size` (Figma group sets the tag size)
- Added `role="group"` + `data-size`, props extend `HTMLAttributes<HTMLDivElement>` (e.g. `aria-label`)
- `content-center` → `content-start` so wrapped rows stay top-aligned in taller containers
- Stories: added Figma matrix, per-size stories and an interaction test

Gaps were already correct: 8px row/column gap (spacing-02) for Large/Medium/Small, 4px (spacing-01) for Extra small.

## Remaining deviations / Figma inconsistencies
- Figma Large/Medium gaps are raw 8px (not variable-bound) while Extra small is bound to `spacing-01`; implemented with spacing tokens throughout.
- The Figma Large variant frame clips to one row (12 tags, 48px tall); implemented normal wrapping.
