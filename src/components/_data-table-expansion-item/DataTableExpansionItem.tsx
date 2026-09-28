import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type {
  DataTableExpansionItemProps,
  DataTableExpansionItemSize,
} from './data-table-expansion-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Items / Data table expansion item (node 30570:39079)
 * Size (Large, X-large, 2X-large) = 3 variants.
 *
 * Each variant is a 24px-wide, full-row-height cell holding the 24×24 "Chevron down" icon
 * (Icons main/icon-primary), vertically centred. The expanded row in
 * "Rows / Data table content row" shows the same chevron pointing up, so the glyph is rotated
 * 180° when `expanded`. Figma defines no interactive states; hover/pressed feedback and the focus
 * ring are code additions (see docs/figma/signoff/_data-table-expansion-item.md).
 */

const heights: Record<DataTableExpansionItemSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

/** Figma uses the 24×24 icon artboard ("medium") at every size. */
const ICON_SIZE = 24;

/**
 * Expand/collapse cell of a data table row (private sub-component of `DataTable`).
 *
 * Renders a `<td>` containing a button with `aria-expanded` (and `aria-controls` when the
 * expanded content row has an `id`). Keyboard: Tab to focus, Enter/Space to toggle.
 *
 * @example
 * <_DataTableExpansionItem expanded={open} onExpandedChange={setOpen} aria-controls="row-1-details" />
 */
export const DataTableExpansionItem = forwardRef<
  HTMLTableCellElement,
  DataTableExpansionItemProps
>(
  (
    {
      size = 'large',
      expanded = false,
      onExpandedChange,
      label,
      disabled = false,
      className,
      'aria-controls': ariaControls,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => (
    <td
      ref={ref}
      data-data-table-item="expansion"
      data-expanded={expanded || undefined}
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
          aria-expanded={expanded}
          aria-controls={ariaControls}
          aria-label={label ?? (expanded ? 'Collapse row' : 'Expand row')}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          onClick={() => onExpandedChange?.(!expanded)}
          data-state={dataState}
          className={cn(
            'group relative inline-flex size-[24px] items-center justify-center',
            'rounded-[var(--scanner-radius-sm)] outline-none',
            'text-[color:var(--scanner-icon-primary)]',
            'transition-transform duration-150',
            expanded && 'rotate-180',
            disabled
              ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
              : cn(
                  'cursor-pointer',
                  'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
                  'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
                ),
          )}
        >
          <Icon name="chevron-down" size={ICON_SIZE} />
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
  ),
);

DataTableExpansionItem.displayName = 'DataTableExpansionItem';
