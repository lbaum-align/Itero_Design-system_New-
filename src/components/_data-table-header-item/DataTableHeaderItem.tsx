import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type {
  DataTableHeaderItemProps,
  DataTableSortDirection,
} from './data-table-header-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Items / Data table header item (node 30601:2824)
 * Sorted (None, Ascending, Descending) × Filterable (bool) × Show divider (bool) = 3 variants
 * + 2 boolean properties.
 *
 * Layout: 52px tall, padding 16 top/right/bottom (left 0), 16px gap; label "Body/$tp-body-02"
 * (18/28) in `text-secondary`; 24×24 sort arrow ("Arrow up" / "Arrow down" = registry
 * `sort-ascending` / `sort-descending`); 20×20 "Filter" icon; 1×28 `border-subtle` divider last.
 * Figma binds the vertical padding but fixes the height at 52px, so the content is centred in
 * 52px instead of adding 16+28+16 = 60px.
 */

/** Figma's 24×24 sort arrow and 20×20 filter icon. */
const SORT_ICON_SIZE = 24;
const FILTER_ICON_SIZE = 20;

const sortIcon: Record<Exclude<DataTableSortDirection, 'none'>, 'sort-ascending' | 'sort-descending'> = {
  ascending: 'sort-ascending',
  descending: 'sort-descending',
};

/** none → ascending → descending → none */
const nextSort: Record<DataTableSortDirection, DataTableSortDirection> = {
  none: 'ascending',
  ascending: 'descending',
  descending: 'none',
};

const label = cn(
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
  'text-[color:var(--scanner-text-secondary)] text-left [word-break:break-word]',
);

const iconButton = cn(
  'group relative inline-flex shrink-0 items-center justify-center',
  'rounded-[var(--scanner-radius-sm)] outline-none',
);

const focusRing = cn(
  'pointer-events-none absolute -inset-[2px] hidden rounded-[var(--scanner-radius-sm)]',
  'border border-solid border-[color:var(--scanner-border-focus)]',
  'group-focus-visible:block group-data-[state=focused]:block',
);

const interactive = cn(
  'cursor-pointer',
  'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
  'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
);

/**
 * Header cell of a data table (private sub-component of `DataTable`).
 *
 * Renders a `<th scope="col">` carrying `aria-sort`. When the column is sortable the label becomes
 * a button that cycles none → ascending → descending → none; the optional filter button sits after
 * the arrow. Keyboard: Tab to the label/filter buttons, Enter/Space to activate.
 *
 * @example
 * <_DataTableHeaderItem sorted="ascending" onSortChange={setSort} filterable onFilterClick={openFilter}>
 *   Patient
 * </_DataTableHeaderItem>
 */
export const DataTableHeaderItem = forwardRef<HTMLTableCellElement, DataTableHeaderItemProps>(
  (
    {
      children,
      size = 'large',
      sorted = 'none',
      sortable,
      onSortChange,
      filterable = false,
      onFilterClick,
      filterLabel,
      showDivider = false,
      disabled = false,
      className,
      scope = 'col',
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const isSortable = (sortable ?? !!onSortChange) && !disabled;
    const textLabel = typeof children === 'string' ? children : 'column';

    const labelContent = (
      <>
        <span className={cn(label, 'min-w-0 flex-1')}>{children}</span>
        {sorted !== 'none' && (
          <Icon
            name={sortIcon[sorted]}
            size={SORT_ICON_SIZE}
            className="shrink-0 text-[color:var(--scanner-icon-secondary)]"
          />
        )}
      </>
    );

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={sorted}
        data-state={dataState}
        data-sorted={sorted}
        data-size={size}
        className={cn(
          'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] pr-[var(--scanner-spacing-5)] align-middle font-[number:var(--scanner-font-regular)]',
          'h-[var(--scanner-data-table-row-height-lg)]',
          className,
        )}
        {...rest}
      >
        <div
          className={cn(
            'flex h-[var(--scanner-data-table-row-height-lg)] items-center gap-[var(--scanner-spacing-5)]',
          )}
        >
          {isSortable ? (
            <button
              type="button"
              onClick={() => onSortChange?.(nextSort[sorted])}
              data-state={dataState}
              className={cn(
                'group relative flex min-w-0 flex-1 items-center gap-[var(--scanner-spacing-5)]',
                'rounded-[var(--scanner-radius-sm)] outline-none text-left',
                interactive,
              )}
            >
              {labelContent}
              <span aria-hidden="true" className={focusRing} />
            </button>
          ) : (
            <span className="flex min-w-0 flex-1 items-center gap-[var(--scanner-spacing-5)]">
              {labelContent}
            </span>
          )}

          {filterable && (
            <button
              type="button"
              aria-label={filterLabel ?? `Filter ${textLabel}`}
              disabled={disabled}
              aria-disabled={disabled || undefined}
              onClick={onFilterClick}
              data-state={dataState}
              className={cn(
                iconButton,
                'size-[20px]',
                disabled
                  ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
                  : cn('text-[color:var(--scanner-icon-secondary)]', interactive),
              )}
            >
              <Icon name="filter" size={FILTER_ICON_SIZE} />
              <span aria-hidden="true" className={focusRing} />
            </button>
          )}

          {showDivider && (
            <span
              aria-hidden="true"
              data-divider=""
              className={cn(
                'block shrink-0',
                'w-[var(--scanner-data-table-divider-width)] h-[var(--scanner-data-table-divider-height)]',
                'bg-[var(--scanner-border-subtle)]',
              )}
            />
          )}
        </div>
      </th>
    );
  },
);

DataTableHeaderItem.displayName = 'DataTableHeaderItem';
