import type { HTMLAttributes, ReactNode } from 'react';

/** Figma "Size" — only Large (52px) exists for the header row. */
export type DataTableHeaderRowSize = 'large';

/**
 * Figma "Selection":
 * - `none` — no select-all checkbox column
 * - `unselected` / `selected` / `indeterminate` — checkbox column, reflecting the rows below
 */
export type DataTableHeaderRowSelection = 'none' | 'unselected' | 'selected' | 'indeterminate';

/**
 * Figma "Expansion":
 * - `none` — no expansion column
 * - `indend` (Figma's spelling of "indent") — an empty column that lines the header up with
 *   expandable rows below
 */
export type DataTableHeaderRowExpansion = 'none' | 'indend';

export interface DataTableHeaderRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  /** `_DataTableHeaderItem` cells. */
  children?: ReactNode;
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableHeaderRowSize;
  /** Figma "Selection". @default 'none' */
  selection?: DataTableHeaderRowSelection;
  /** Called with the next value when the select-all checkbox is toggled. */
  onSelectionChange?: (checked: boolean) => void;
  /** Accessible name of the select-all checkbox. @default 'Select all rows' */
  selectAllLabel?: string;
  /** Figma "Expansion". @default 'none' */
  expansion?: DataTableHeaderRowExpansion;
  /** Figma "Draggable" — reserves the drag-handle column so the header lines up with the rows. */
  draggable?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: 'hovered' | 'focused';
}
