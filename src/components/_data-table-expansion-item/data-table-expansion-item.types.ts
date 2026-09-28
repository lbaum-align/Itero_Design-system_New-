import type { TdHTMLAttributes } from 'react';

/**
 * Figma "Size" — the row height the item fills.
 * Large = 52px, X-large = 72px, 2X-large = 92px.
 */
export type DataTableExpansionItemSize = 'large' | 'x-large' | '2x-large';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). */
export type DataTableExpansionItemForcedState = 'hovered' | 'focused' | 'pressed';

export interface DataTableExpansionItemProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'children' | 'onChange'> {
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableExpansionItemSize;
  /** Whether the row this cell belongs to is expanded. Drives `aria-expanded` and the chevron. */
  expanded?: boolean;
  /** Called with the next expanded value when the button is activated. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Accessible name of the button. @default 'Expand row' / 'Collapse row' */
  label?: string;
  /** `id` of the element the button controls (the expanded content row). */
  'aria-controls'?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: DataTableExpansionItemForcedState;
}
