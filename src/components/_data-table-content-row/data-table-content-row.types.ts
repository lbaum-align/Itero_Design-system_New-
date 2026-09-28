import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Figma "Size" — Large (1 line) = 52px, X-large (2 lines) = 72px, 2X-large (3 lines) = 92px.
 * The expanded content adds 92 / 92 / 92px below the row (144 / 164 / 184px total).
 */
export type DataTableContentRowSize = 'large' | 'x-large' | '2x-large';

/**
 * Figma "Selection":
 * - `none` — the table has no selection column
 * - `unselected` / `selected` — checkbox column, reflecting this row
 */
export type DataTableContentRowSelection = 'none' | 'unselected' | 'selected';

/**
 * Figma "Expansion":
 * - `none` — no expansion column
 * - `collapsed` / `expanded` — expander button; `expanded` also renders the expanded content row
 * - `indend` (Figma's spelling of "indent") — an empty column that lines a non-expandable row up
 *   with expandable siblings
 */
export type DataTableContentRowExpansion = 'none' | 'collapsed' | 'expanded' | 'indend';

export interface DataTableContentRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  /** `_DataTableContentItem` cells. */
  children?: ReactNode;
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableContentRowSize;
  /** Figma "Selection". @default 'none' */
  selection?: DataTableContentRowSelection;
  /** Called with the next value when the row checkbox is toggled. */
  onSelectionChange?: (checked: boolean) => void;
  /** Accessible name of the row checkbox. @default 'Select row' */
  selectLabel?: string;
  /** Figma "Expansion". @default 'none' */
  expansion?: DataTableContentRowExpansion;
  /** Called with the next value when the expander is activated. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Content of the expanded row (Figma "Expandable content" → "Slot content" placeholder). */
  expandedContent?: ReactNode;
  /** `id` of the expanded content row — also used for `aria-controls` on the expander. */
  expandedContentId?: string;
  /** Figma "Draggable" — shows the drag handle column. */
  draggable?: boolean;
  /** Fired when the drag handle is activated with the keyboard. */
  onDragHandleActivate?: () => void;
  /** Accessible name of the drag handle. @default 'Drag to reorder row' */
  dragLabel?: string;
  /**
   * Number of content columns the expanded content row spans.
   * Derived from `children` (fragments are looked through); set it when the cells are rendered
   * by a component that hides their count.
   */
  columnCount?: number;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: 'hovered' | 'focused' | 'pressed';
}
