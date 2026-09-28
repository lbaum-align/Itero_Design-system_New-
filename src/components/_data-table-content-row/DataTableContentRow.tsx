import { Children, Fragment, forwardRef, isValidElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { SlotContent } from '../slot-content';
import { DataTableCheckboxItem } from '../_data-table-checkbox-item';
import { DataTableDragItem } from '../_data-table-drag-item';
import { DataTableExpansionItem } from '../_data-table-expansion-item';
import type {
  DataTableContentRowProps,
  DataTableContentRowSize,
} from './data-table-content-row.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Rows / Data table content row (node 30539:50181)
 * Size (Large (1 line), X-large (2 lines), 2X-large (3 lines)) × Selection (None, Unselected,
 * Selected) × Expansion (None, Collapsed, Expanded, Indend) × Draggable (False, True) = 68 of the
 * 72 combinations (4 are missing from the Figma set — see the sign-off).
 *
 * Layout: fixed row height per size, 16px gap between cells (padding-left on every cell after the
 * first, so table columns still line up), 1px `border-subtle` rule under the row — under the
 * expanded content row when the row is expanded, exactly like Figma.
 * "Expandable content" is a second `<tr>`: the same leading spacer columns, then the slot content
 * in 16px vertical padding (92px tall).
 */

const heights: Record<DataTableContentRowSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

/* Figma's 16px gap becomes each cell's own padding-left (cells read the variable). */
const gapCells = '[&>*:first-child]:[--scanner-data-table-cell-gap:0px]';
/** The gap itself is inherited from the row, so every cell but the first picks it up. */
const gapStyle = { '--scanner-data-table-cell-gap': 'var(--scanner-spacing-5)' } as CSSProperties;
const borderCells =
  '[&>*]:shadow-[inset_0_calc(var(--scanner-data-table-row-border-width)*-1)_0_0_var(--scanner-border-subtle)]';

/** Counts the rendered cells, looking through fragments so `<>…</>` children span correctly. */
function countCells(children: ReactNode): number {
  return Children.toArray(children).reduce<number>((total, child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return total + countCells((child.props as { children?: ReactNode }).children);
    }
    return total + 1;
  }, 0);
}

const spacerCell = cn(
  'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] align-middle',
  /* box-content keeps the 16px cell gap outside Figma's fixed 24px control column */
  'box-content w-[var(--scanner-data-table-control-width)] min-w-[var(--scanner-data-table-control-width)]',
);

/**
 * Content row of a data table (private sub-component of `DataTable`).
 *
 * Renders a `<tr>` with the optional leading columns (drag handle, expander, checkbox) followed by
 * the `_DataTableContentItem` cells passed as `children`, plus a second `<tr>` holding the
 * expanded content when `expansion="expanded"`.
 *
 * @example
 * <tbody>
 *   <_DataTableContentRow
 *     size="large"
 *     selection={selected ? 'selected' : 'unselected'}
 *     onSelectionChange={setSelected}
 *     expansion={open ? 'expanded' : 'collapsed'}
 *     onExpandedChange={setOpen}
 *     expandedContent={<PatientDetails />}
 *   >
 *     <_DataTableContentItem text="Jane Doe" />
 *   </_DataTableContentRow>
 * </tbody>
 */
export const DataTableContentRow = forwardRef<HTMLTableRowElement, DataTableContentRowProps>(
  (
    {
      children,
      size = 'large',
      selection = 'none',
      onSelectionChange,
      selectLabel = 'Select row',
      expansion = 'none',
      onExpandedChange,
      expandedContent,
      expandedContentId,
      draggable = false,
      onDragHandleActivate,
      dragLabel,
      columnCount: columnCountProp,
      className,
      style,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const isExpanded = expansion === 'expanded';
    const hasExpander = expansion === 'collapsed' || isExpanded;
    const columnCount = Math.max(columnCountProp ?? countCells(children), 1);

    const leadingSpacers = (
      <>
        {draggable && <td aria-hidden="true" data-spacer="drag" className={spacerCell} />}
        {expansion !== 'none' && (
          <td aria-hidden="true" data-spacer="expansion" className={spacerCell} />
        )}
        {selection !== 'none' && (
          <td aria-hidden="true" data-spacer="checkbox" className={spacerCell} />
        )}
      </>
    );

    return (
      <>
        <tr
          ref={ref}
          data-state={dataState}
          style={{ ...gapStyle, ...style }}
          data-selection={selection}
          data-expansion={expansion}
          data-draggable={draggable || undefined}
          data-selected={selection === 'selected' || undefined}
          aria-selected={selection === 'none' ? undefined : selection === 'selected'}
          className={cn(
            heights[size],
            gapCells,
            !isExpanded && borderCells,
            /* Figma defines no row hover; this is the standard hovered-layer token (see sign-off). */
            'transition-colors duration-150',
            'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
            className,
          )}
          {...rest}
        >
          {draggable && (
            <DataTableDragItem
              size={size}
              label={dragLabel}
              onHandleActivate={onDragHandleActivate}
            />
          )}
          {hasExpander && (
            <DataTableExpansionItem
              size={size}
              expanded={isExpanded}
              onExpandedChange={onExpandedChange}
              aria-controls={isExpanded ? expandedContentId : undefined}
            />
          )}
          {expansion === 'indend' && (
            <td aria-hidden="true" data-spacer="expansion" className={cn(spacerCell, heights[size])} />
          )}
          {selection !== 'none' && (
            <DataTableCheckboxItem
              size={size}
              checked={selection === 'selected'}
              onChange={onSelectionChange}
              label={selectLabel}
            />
          )}
          {children}
        </tr>

        {isExpanded && (
          <tr
            id={expandedContentId}
            data-data-table-row="expanded-content"
            style={gapStyle}
            className={cn(gapCells, borderCells)}
          >
            {leadingSpacers}
            <td
              colSpan={columnCount}
              className="p-0 pl-[var(--scanner-data-table-cell-gap,0px)] pr-[var(--scanner-spacing-5)] align-middle"
            >
              <div className="flex min-h-[60px] items-center py-[var(--scanner-spacing-5)]">
                {expandedContent ?? <SlotContent />}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  },
);

DataTableContentRow.displayName = 'DataTableContentRow';
