import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { CheckboxItem } from '../checkbox-item';
import type {
  DataTableCheckboxItemProps,
  DataTableCheckboxItemSize,
} from './data-table-checkbox-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Items / Data table checkbox item (node 30570:39080)
 * Size (Large, X-large, 2X-large) = 3 variants.
 *
 * Each variant is a 24px-wide, full-row-height cell holding a "01 Checkbox item" instance with
 * Show value = false (indicator only, 28×28). Figma's instance keeps the checkbox's own 16px
 * vertical padding (60px tall) inside a 52/72/92px cell, so the padding is dropped here and the
 * 28px indicator is centred in the row instead — visually identical, no row growth.
 * The indicator is 4px wider than the 24px column, exactly as in Figma (it overflows into the gap).
 */

const heights: Record<DataTableCheckboxItemSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

/**
 * Selection cell of a data table row (private sub-component of `DataTable`).
 *
 * Renders a `<td>` wrapping the shared `CheckboxItem` (value text hidden). Keyboard: Tab to focus,
 * Space or Enter to toggle.
 *
 * @example
 * <_DataTableCheckboxItem checked={selected} onChange={setSelected} label="Select patient 1" />
 */
export const DataTableCheckboxItem = forwardRef<
  HTMLTableCellElement,
  DataTableCheckboxItemProps
>(
  (
    {
      size = 'large',
      checked = false,
      onChange,
      label = 'Select row',
      disabled = false,
      skeleton = false,
      className,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => (
    <td
      ref={ref}
      data-data-table-item="checkbox"
      className={cn(
        'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] align-middle',
        /* box-content keeps the 16px cell gap outside Figma's fixed 24px control column */
          'box-content w-[var(--scanner-data-table-control-width)] min-w-[var(--scanner-data-table-control-width)]',
        heights[size],
        className,
      )}
      {...rest}
    >
      <span className={cn('flex items-center', heights[size])}>
        <CheckboxItem
          checked={checked}
          onChange={onChange}
          showLabel={false}
          aria-label={label}
          disabled={disabled}
          skeleton={skeleton}
          data-state={dataState}
          className="py-0"
        />
      </span>
    </td>
  ),
);

DataTableCheckboxItem.displayName = 'DataTableCheckboxItem';
