import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { SearchInput } from '../search-input';
import type { DataTableToolbarAction, DataTableToolbarsProps } from './data-table-toolbars.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Bars / Data table toolbars (node 34038:306507, page "Data table")
 * Bulk actions: False, True = 2 variants. Private — composed by DataTable ("Show toolbar").
 *
 * Row (fill width, space-between, gap 32):
 * - "Search + filter" (fill, gap 8): Search input Large Set 01, fixed 288 wide.
 * - Bulk actions=False → "Buttons group" (gap 8): 3× Button Brand/Secondary/Large/Icon only + Button Brand/Primary/Large/Text only.
 * - Bulk actions=True → gap 16: "2 items selected" (Heading 02 18/28 Medium, text-primary) · "Actions" (gap 8):
 *   3× Button Secondary/Large/Text only · "Cancel" (padding-left 16): Button Secondary/Large + dashed 1px
 *   border-subtle divider on its left edge (dash 4 / gap 4).
 */

const dashedDivider = cn(
  'pointer-events-none absolute inset-y-0 left-0 w-[var(--scanner-data-table-bars-divider-width)]',
  'bg-[image:repeating-linear-gradient(to_bottom,var(--scanner-border-subtle)_0_var(--scanner-data-table-bars-divider-dash),transparent_var(--scanner-data-table-bars-divider-dash)_var(--scanner-data-table-bars-divider-period))]',
);

const defaultSelectedLabel = (count: number) => `${count} ${count === 1 ? 'item' : 'items'} selected`;

function renderAction(action: DataTableToolbarAction) {
  const { id, label, iconName, iconOnly = false, emphasis = 'secondary', variant = 'brand', disabled, loading, onClick } = action;
  const isIconOnly = iconOnly && !!iconName;
  return (
    <Button
      key={id}
      size="large"
      variant={variant}
      emphasis={emphasis}
      iconName={iconName}
      iconOnly={isIconOnly}
      aria-label={isIconOnly ? label : undefined}
      title={isIconOnly ? label : undefined}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {isIconOnly ? undefined : label}
    </Button>
  );
}

/**
 * Data table toolbar — search / filters on the left, table actions (or, with a selection, bulk actions) on the right.
 *
 * Figma props → React: Bulk actions → `bulkActions` (default `selectedCount > 0`).
 * Content: Search input → `showSearch` + `searchProps`, filters → `filters`, Buttons group → `actions`,
 * "2 items selected" → `selectedCount` / `selectedLabel`, Actions → `bulkActionItems`, Cancel → `onCancel` / `cancelLabel`.
 *
 * Accessibility: the selection summary is a polite live region; bulk actions are a labelled `group`.
 *
 * @example
 * <DataTableToolbars
 *   searchProps={{ value: query, onChange: (e) => setQuery(e.target.value) }}
 *   actions={[{ id: 'add', label: 'Add patient', emphasis: 'primary', onClick: add }]}
 *   selectedCount={selected.length}
 *   bulkActionItems={[{ id: 'delete', label: 'Delete', onClick: remove }]}
 *   onCancel={() => setSelected([])}
 * />
 */
export const DataTableToolbars = forwardRef<HTMLDivElement, DataTableToolbarsProps>(
  (
    {
      bulkActions,
      showSearch = true,
      searchProps,
      filters,
      actions = [],
      selectedCount = 0,
      selectedLabel = defaultSelectedLabel,
      bulkActionItems = [],
      onCancel,
      cancelLabel = 'Cancel',
      className,
      ...rest
    },
    ref,
  ) => {
    const isBulk = bulkActions ?? selectedCount > 0;
    const { className: searchClassName, ...search } = searchProps ?? {};

    return (
      <div
        ref={ref}
        data-bulk-actions={isBulk ? 'true' : 'false'}
        className={cn(
          'flex w-full items-start justify-between gap-[var(--scanner-spacing-8)]',
          'font-[family-name:var(--scanner-font-sans)]',
          className,
        )}
        {...rest}
      >
        <div data-part="search" className="flex min-w-0 flex-1 items-center gap-[var(--scanner-spacing-3)]">
          {showSearch && (
            <SearchInput
              {...search}
              size="large"
              /* Figma width 288; shrinks (never overlaps the actions) when the toolbar is narrower */
              className={cn('w-[var(--scanner-data-table-toolbar-search-width)] max-w-full shrink', searchClassName)}
            />
          )}
          {filters}
        </div>

        {isBulk ? (
          <div data-part="bulk-actions" className="flex shrink-0 items-center gap-[var(--scanner-spacing-5)]">
            <span
              role="status"
              aria-live="polite"
              className={cn(
                'whitespace-nowrap text-[color:var(--scanner-text-primary)]',
                'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)] font-[number:var(--scanner-font-medium)]',
              )}
            >
              {selectedLabel(selectedCount)}
            </span>
            {bulkActionItems.length > 0 && (
              <div role="group" aria-label="Bulk actions" className="flex items-center gap-[var(--scanner-spacing-3)]">
                {bulkActionItems.map(renderAction)}
              </div>
            )}
            {onCancel && (
              <div data-part="cancel" className="relative flex items-center self-stretch pl-[var(--scanner-spacing-5)]">
                <span aria-hidden="true" className={dashedDivider} />
                <Button size="large" emphasis="secondary" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              </div>
            )}
          </div>
        ) : (
          actions.length > 0 && (
            <div data-part="actions" className="flex shrink-0 items-center justify-end gap-[var(--scanner-spacing-3)]">
              {actions.map(renderAction)}
            </div>
          )
        )}
      </div>
    );
  },
);

DataTableToolbars.displayName = 'DataTableToolbars';
