import type { TdHTMLAttributes } from 'react';
import type { CheckboxSelection } from '../checkbox-item/checkbox-item.types';

export type { CheckboxSelection };

/**
 * Figma "Size" — the row height the item fills.
 * Large = 52px, X-large = 72px, 2X-large = 92px.
 */
export type DataTableCheckboxItemSize = 'large' | 'x-large' | '2x-large';

export interface DataTableCheckboxItemProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'children' | 'onChange'> {
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableCheckboxItemSize;
  /**
   * Selection state of the row. `true`/`false` map to `selected`/`unselected`;
   * `indeterminate` is used by the header row when only some rows are selected.
   */
  checked?: CheckboxSelection | boolean;
  /** Called with the next checked value when the checkbox is toggled. */
  onChange?: (checked: boolean) => void;
  /** Accessible name of the checkbox. @default 'Select row' */
  label?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Skeleton placeholder (inherited from the checkbox component). */
  skeleton?: boolean;
  /** Force the checkbox's focused state for screenshots / Storybook. */
  'data-state'?: 'focused';
}
