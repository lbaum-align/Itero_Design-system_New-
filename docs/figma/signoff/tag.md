# Tag — sign-off

**Figma**: `01 Tag` `22123:13334` (page "Tag" `22123:13333`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Size (Large, Medium, Small, Extra small) × State (Enabled, Disabled, Skeleton) = 12, + Text property.

## Storybook coverage (`Components/Tag`)
`Default` (controls incl. Forced state) · `Large` / `Medium` / `Small` / `Extra small` · `Enabled` / `Disabled` / `Skeleton` /
`Close icon focused (forced)` · `AllSizes` · `AllStates` · `Figma matrix (all 12 variants)` · `Overflow: truncates with tooltip` ·
`Without close icon` · play tests `ClickDismisses`, `KeyboardDismisses`, `DisabledIgnoresDismiss`.
Unit tests: `tag.test.tsx` (11).

## Fixed during audit
- Stroke was a CSS `border` (tags 2px too big) → 1px inset shadow (`border-subtle` / `border-disabled`), sizes now 48/40/32/24
- Label typography body-02 (18/28) → Figma `Body/$tp-body-01` 16/24
- Small close icon 20px → 24px (only Extra small uses 20px)
- Padding/gap used Tailwind numeric utilities → spacing tokens
- Skeleton: `bg-tertiary` + inline px styles → `bg-highlight-gray`, Figma fixed sizes as component tokens, radius per size
- Removed invented hover colour on the close icon (Figma has none); focus ring now `border-focus` 2px (was `--scanner-focus-ring` outline utility)
- Overflow (Figma docs): label truncates with ellipsis and shows the full text in a `Tooltip` when truncated
- Close button accessible name `Remove` → `Remove <label>` (override with new `dismissLabel`)
- Tags inherit size from `TagGroup` (context) when `size` is not set
- Props now extend `HTMLAttributes<HTMLSpanElement>`; `data-state="focused"` forces the close-icon focus ring

## Component tokens (`src/tokens/components/tag.css`)
`--scanner-tag-min-width`, `--scanner-tag-skeleton-width-{lg,md,sm,xs}`, `--scanner-tag-height-{lg,md,sm,xs}`, `--scanner-tag-close-focus-width`.

## Remaining deviations / Figma inconsistencies
- Figma doc "Sizing" says "three sizes" and lists Medium 36px / Small 28px / Extra small 20px; the component set has four sizes at 48/40/32/24px. Implemented the component set.
- Figma component default Size is Large; React default stays `medium` (backwards compatible, and docs call Medium the default outside inputs).
- Figma always shows the close icon; React renders it only when `onDismiss` is set (existing API).
- Close-icon focus ring is not drawn in Figma (docs only say Tab focuses it); implemented a 2px `border-focus` ring like Button. On Extra small it overlaps the label edge slightly.
- The Tag "Overflow" doc section also contains a copy-pasted checkbox wrap rule ("wrap beneath the checkbox"); ignored.
- Dark-mode values not visually verified against Figma.
