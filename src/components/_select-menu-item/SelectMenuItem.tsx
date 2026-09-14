import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { SelectMenuItemProps, SelectMenuItemSize } from './select-menu-item.types';

/* ------------------------------------------------------------------ */
/*  Size → token mappings                                              */
/* ------------------------------------------------------------------ */

const paddingBySize: Record<SelectMenuItemSize, string> = {
  small: 'p-[var(--scanner-spacing-2)]',       // 4px
  medium: 'p-[var(--scanner-spacing-3)]',      // 8px
  large: 'p-[var(--scanner-spacing-4)]',       // 12px
  'x-large': 'px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-5)]', // 12px h / 16px v
};

const checkIconSize: Record<SelectMenuItemSize, 20 | 24> = {
  small: 20,
  medium: 20,
  large: 20,
  'x-large': 24,
};

const alignBySize: Record<SelectMenuItemSize, string> = {
  small: 'items-start',
  medium: 'items-start',
  large: 'items-start',
  'x-large': 'items-center',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * _SelectMenuItem — a single option within a select/dropdown menu.
 *
 * Renders label text, optional headline & subtext, and a checkmark
 * indicator when selected. Supports four sizes and all interactive
 * states defined in Figma (enabled, hovered, focused, disabled).
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <SelectMenuItem optionText="Option A" />
 * <SelectMenuItem optionText="Option B" selected size="large" />
 * <SelectMenuItem optionText="Option C" disabled />
 */
export const SelectMenuItem = forwardRef<HTMLDivElement, SelectMenuItemProps>(
  (
    {
      optionText = 'Option',
      headlineText = 'Headline',
      subheadText = 'Subhead',
      showHeadline = false,
      showSubtext = false,
      showDivider = false,
      selected = false,
      disabled = false,
      size = 'x-large',
      className,
      ...rest
    },
    ref,
  ) => {
    const isXLarge = size === 'x-large';

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        className={cn(
          'group/item flex w-full flex-col items-start overflow-clip',
          className,
        )}
        {...rest}
      >
        {/* ── Headline ── */}
        {showHeadline && (
          <div className="flex w-full items-start px-[var(--scanner-spacing-3)] pb-[var(--scanner-spacing-3)] pt-[var(--scanner-spacing-4)]">
            <p
              className={cn(
                'min-w-[1px] flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[length:var(--scanner-text-xs)]',
                'font-[var(--scanner-font-regular)]',
                'leading-[var(--scanner-leading-xs)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {headlineText}
            </p>
          </div>
        )}

        {/* ── Item row ── */}
        <div
          className={cn(
            'flex w-full gap-[var(--scanner-spacing-3)]',
            'rounded-[var(--scanner-radius-sm)]',
            paddingBySize[size],
            alignBySize[size],
            /* Hover state — CSS native + data-state on parent */
            !disabled && [
              'hover:bg-[var(--scanner-bg-hover)] hover:cursor-pointer',
              'group-data-[state=hovered]/item:bg-[var(--scanner-bg-hover)] group-data-[state=hovered]/item:cursor-pointer',
            ],
            /* Focus state — CSS native + data-state on parent */
            !disabled && [
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scanner-border-focus)]',
              'group-data-[state=focused]/item:ring-1 group-data-[state=focused]/item:ring-[var(--scanner-border-focus)]',
            ],
          )}
          tabIndex={disabled ? undefined : -1}
        >
          {/* ── Content (text column) ── */}
          <div className="flex min-w-[1px] flex-1 items-start">
            <div
              className={cn(
                'flex min-w-[1px] flex-1 flex-col items-start whitespace-nowrap',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                !isXLarge && 'leading-[var(--scanner-leading-sm)]',
              )}
            >
              {/* Option text */}
              <p
                className={cn(
                  'min-w-full overflow-hidden text-ellipsis',
                  isXLarge
                    ? [
                        // NOTE: 18px font-size has no exact design token
                        // (falls between --scanner-text-md 17px and
                        // --scanner-text-lg 20px). Using literal 18px to
                        // match Figma until a dedicated token is added.
                        'text-[length:18px]',
                        'leading-[var(--scanner-leading-lg)]',
                      ]
                    : [
                        'h-[var(--scanner-leading-sm)]',
                        'text-[length:var(--scanner-text-sm)]',
                      ],
                  disabled
                    ? 'text-[color:var(--scanner-text-tertiary)]'
                    : 'text-[color:var(--scanner-icon-primary)]',
                )}
              >
                {optionText}
              </p>

              {/* Subtext */}
              {showSubtext && (
                <p
                  className={cn(
                    'text-[length:var(--scanner-text-sm)]',
                    'leading-[var(--scanner-leading-sm)]',
                    disabled
                      ? 'text-[color:var(--scanner-text-tertiary)]'
                      : 'text-[color:var(--scanner-text-primary)]',
                  )}
                >
                  {subheadText}
                </p>
              )}
            </div>
          </div>

          {/* ── Checkmark indicator ── */}
          {selected && (
            <Icon
              name="check"
              size={checkIconSize[size]}
              className={cn(
                'shrink-0',
                disabled
                  ? 'text-[color:var(--scanner-icon-disabled)]'
                  : 'text-[color:var(--scanner-icon-primary)]',
              )}
            />
          )}
        </div>

        {/* ── Divider ── */}
        {showDivider && (
          <div className="relative h-[var(--scanner-spacing-3)] w-full overflow-clip">
            <div className="absolute inset-x-0 top-[3px] h-px border border-solid border-[var(--scanner-border-subtle)]" />
          </div>
        )}
      </div>
    );
  },
);

SelectMenuItem.displayName = 'SelectMenuItem';
