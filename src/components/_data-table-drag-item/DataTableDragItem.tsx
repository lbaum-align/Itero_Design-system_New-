import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { DataTableDragItemProps, DataTableDragItemSize } from './data-table-drag-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Items / Data table drag item (node 34019:66971)
 * Size (Large, X-large, 2X-large) = 3 variants.
 *
 * Each variant is a 24px-wide, full-row-height cell holding the 24×24 "Drag drop" icon
 * (Icons main/icon-tertiary), vertically centred. Figma defines no interactive states;
 * hover/pressed feedback and the focus ring below are code additions so the handle is operable
 * by keyboard (see docs/figma/signoff/_data-table-drag-item.md).
 */

const heights: Record<DataTableDragItemSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

/** Figma uses the 24×24 icon artboard ("medium") at every size. */
const ICON_SIZE = 24;

/**
 * Drag handle cell of a data table row (private sub-component of `DataTable`).
 *
 * Renders a `<td>` so it can sit directly inside a `<tr>`; the handle itself is a button, so the
 * row can be reordered with the keyboard (Space/Enter → `onHandleActivate`) as well as by pointer
 * drag (spread your drag library's listeners onto the component).
 *
 * @example
 * <_DataTableDragItem size="large" onHandleActivate={startKeyboardDrag} {...dragListeners} />
 */
export const DataTableDragItem = forwardRef<HTMLTableCellElement, DataTableDragItemProps>(
  (
    {
      size = 'large',
      label = 'Drag to reorder row',
      disabled = false,
      onHandleActivate,
      className,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || !onHandleActivate) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onHandleActivate();
      }
    };

    return (
      <td
        ref={ref}
        data-state={dataState}
        data-data-table-item="drag"
        className={cn(
          'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] align-middle',
          /* box-content keeps the 16px cell gap outside Figma's fixed 24px control column */
          'box-content w-[var(--scanner-data-table-control-width)] min-w-[var(--scanner-data-table-control-width)]',
          heights[size],
          className,
        )}
        {...rest}
      >
        <span className={cn('flex items-center justify-center', heights[size])}>
          <button
            type="button"
            aria-label={label}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            onKeyDown={handleKeyDown}
            className={cn(
              'group relative inline-flex size-[24px] items-center justify-center',
              'rounded-[var(--scanner-radius-sm)] outline-none',
              'text-[color:var(--scanner-icon-tertiary)]',
              disabled
                ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
                : cn(
                    'cursor-grab active:cursor-grabbing',
                    'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
                    'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
                  ),
            )}
            data-state={dataState}
          >
            <Icon name="drag" size={ICON_SIZE} />
            {/* Focus ring — 1px border-focus, drawn outside the glyph so it never shifts layout */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute -inset-[2px] hidden rounded-[var(--scanner-radius-sm)]',
                'border border-solid border-[color:var(--scanner-border-focus)]',
                'group-focus-visible:block group-data-[state=focused]:block',
              )}
            />
          </button>
        </span>
      </td>
    );
  },
);

DataTableDragItem.displayName = 'DataTableDragItem';
