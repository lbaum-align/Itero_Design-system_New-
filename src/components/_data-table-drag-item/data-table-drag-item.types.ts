import type { ThHTMLAttributes } from 'react';

/**
 * Figma "Size" — the row height the item fills.
 * Large = 52px, X-large = 72px, 2X-large = 92px.
 */
export type DataTableDragItemSize = 'large' | 'x-large' | '2x-large';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). */
export type DataTableDragItemForcedState = 'hovered' | 'focused' | 'pressed';

export interface DataTableDragItemProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableDragItemSize;
  /** Accessible name of the drag handle. @default 'Drag to reorder row' */
  label?: string;
  /** Disables the handle (no Figma state — used by `_DataTableContentRow` when the row is locked). */
  disabled?: boolean;
  /** Fired when the handle is activated with the keyboard (Space/Enter) — start a keyboard drag here. */
  onHandleActivate?: () => void;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: DataTableDragItemForcedState;
}
