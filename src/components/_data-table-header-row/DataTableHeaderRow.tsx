import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { DataTableCheckboxItem } from '../_data-table-checkbox-item';
import type { DataTableHeaderRowProps } from './data-table-header-row.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Rows / Data table header row (node 30601:6315)
 * Size (Large) × Selection (None, Unselected, Selected, Indeterminate) × Expansion (None, Indend)
 * × Draggable (False, True) = 16 variants.
 *
 * Layout: 52px tall, 16px gap between every cell (rendered as padding-left on each cell after the
 * first so real table columns still line up), 1px `border-subtle` bottom rule.
 * Draggable and Expansion=Indend only reserve empty leading columns — the header itself has no
 * drag handle and no expander.
 */

/*
 * Gap + separator are applied to the cells, because a `tr` owns neither padding nor a border box:
 * every cell after the first gets Figma's 16px gap as its own padding-left (through the
 * `--scanner-data-table-cell-gap` variable the cells read), and every cell draws the 1px rule.
 */
const rowCells = cn(
  '[&>*:first-child]:[--scanner-data-table-cell-gap:0px]',
  '[&>*]:shadow-[inset_0_calc(var(--scanner-data-table-row-border-width)*-1)_0_0_var(--scanner-border-subtle)]',
);

const spacerCell = cn(
  'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] align-middle h-[var(--scanner-data-table-row-height-lg)]',
  /* box-content keeps the 16px cell gap outside Figma's fixed 24px control column */
  'box-content w-[var(--scanner-data-table-control-width)] min-w-[var(--scanner-data-table-control-width)]',
);

/**
 * Header row of a data table (private sub-component of `DataTable`).
 *
 * Renders a `<tr>` with the optional leading columns (drag spacer, expansion spacer, select-all
 * checkbox) followed by the `_DataTableHeaderItem` cells passed as `children`.
 *
 * @example
 * <thead>
 *   <_DataTableHeaderRow selection="indeterminate" onSelectionChange={selectAll} draggable>
 *     <_DataTableHeaderItem sorted="ascending" onSortChange={sort}>Patient</_DataTableHeaderItem>
 *   </_DataTableHeaderRow>
 * </thead>
 */
export const DataTableHeaderRow = forwardRef<HTMLTableRowElement, DataTableHeaderRowProps>(
  (
    {
      children,
      size = 'large',
      selection = 'none',
      onSelectionChange,
      selectAllLabel = 'Select all rows',
      expansion = 'none',
      draggable = false,
      className,
      style,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => (
    <tr
      ref={ref}
      data-state={dataState}
      style={{ '--scanner-data-table-cell-gap': 'var(--scanner-spacing-5)', ...style } as CSSProperties}
      data-selection={selection}
      data-expansion={expansion}
      data-draggable={draggable || undefined}
      className={cn('h-[var(--scanner-data-table-row-height-lg)]', rowCells, className)}
      {...rest}
    >
      {draggable && <td aria-hidden="true" data-spacer="drag" className={spacerCell} />}
      {expansion === 'indend' && (
        <td aria-hidden="true" data-spacer="expansion" className={spacerCell} />
      )}
      {selection !== 'none' && (
        <DataTableCheckboxItem
          size={size}
          checked={selection === 'unselected' ? false : selection}
          onChange={onSelectionChange}
          label={selectAllLabel}
        />
      )}
      {children}
    </tr>
  ),
);

DataTableHeaderRow.displayName = 'DataTableHeaderRow';
