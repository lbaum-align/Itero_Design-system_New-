import { forwardRef, useContext } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { MenuTrailingElements } from '../_menu-trailing-elements';
import { MenuContext } from '../menu/menu-context';
import type { MenuItemsProps, MenuItemSize } from './menu-items.types';

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<
  MenuItemSize,
  {
    /** Padding for the interactive item row. */
    itemPad: string;
    /** Border radius for the item row. */
    radius: string;
    /** Headline section padding. */
    headlinePad: string;
    /** Option text typography classes. */
    optionText: string;
  }
> = {
  large: {
    itemPad: 'p-[var(--scanner-spacing-4)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    headlinePad:
      'pt-[var(--scanner-spacing-4)] pb-[var(--scanner-spacing-3)] px-[var(--scanner-spacing-4)]',
    /* Figma body-02: 18px / 28px line-height */
    optionText: 'text-[18px] leading-[var(--scanner-leading-lg)]',
  },
  medium: {
    itemPad: 'p-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    headlinePad: 'p-[var(--scanner-spacing-3)]',
    /* Figma body-01: 16px / 24px line-height */
    optionText: 'text-[16px] leading-[var(--scanner-leading-md)]',
  },
  small: {
    itemPad: 'p-[var(--scanner-spacing-2)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    headlinePad:
      'pt-[var(--scanner-spacing-3)] pb-[var(--scanner-spacing-2)] px-[var(--scanner-spacing-2)]',
    /* Figma body-01: 16px / 24px line-height */
    optionText: 'text-[16px] leading-[var(--scanner-leading-md)]',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * _MenuItems — a single menu item row with label, optional headline,
 * subtext, selected checkmark, and trailing elements.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <MenuItems label="Edit" />
 * <MenuItems label="Delete" type="destructive" />
 * <MenuItems label="Copy" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }} />
 */
export const MenuItems = forwardRef<HTMLDivElement, MenuItemsProps>(
  (
    {
      size: sizeProp,
      type = 'neutral',
      showDivider = false,
      showHeadline = false,
      showSubtext = false,
      label = 'Option',
      headline = 'Headline',
      subtext = 'Subhead',
      indented = false,
      selected = false,
      showTrailingElement = false,
      trailingElementProps,
      disabled = false,
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    /* Resolve size from Menu context or prop */
    const ctx = useContext(MenuContext);
    const size = sizeProp ?? ctx.size ?? 'large';
    const cfg = sizeConfig[size];

    const isNeutral = type === 'neutral';

    /* ── Text colour ── */
    const optionColorClass = disabled
      ? 'text-[color:var(--scanner-text-disabled)]'
      : type === 'destructive'
        ? 'text-[color:var(--scanner-text-error)]'
        : 'text-[color:var(--scanner-text-primary)]';

    const subtextColorClass = disabled
      ? 'text-[color:var(--scanner-text-disabled)]'
      : 'text-[color:var(--scanner-text-secondary)]';

    /* ── Keyboard handler ── */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    return (
      <div
        className={cn('flex flex-col items-start w-full', className)}
        data-size={size}
      >
        {/* ── Headline ── */}
        {showHeadline && (
          <div className={cn('flex items-start w-full', cfg.headlinePad)}>
            <span
              className={cn(
                'flex-1 min-w-px',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[length:var(--scanner-text-xs)] font-normal',
                'leading-[var(--scanner-leading-xs)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {headline}
            </span>
          </div>
        )}

        {/* ── Interactive item row ── */}
        <div
          ref={ref}
          role="menuitem"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          data-type={type}
          className={cn(
            'flex flex-1 items-center w-full min-h-px',
            'gap-[var(--scanner-spacing-3)]',
            cfg.itemPad,
            cfg.radius,
            'transition-colors duration-100',

            /* Cursor */
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',

            /* Hover (CSS + data-state for Storybook) */
            !disabled && 'hover:bg-[var(--scanner-bg-hover)]',
            !disabled && 'data-[state=hovered]:bg-[var(--scanner-bg-hover)]',

            /* Focus (CSS + data-state for Storybook) */
            !disabled && [
              'focus-visible:outline focus-visible:outline-2',
              'focus-visible:outline-offset-[-2px]',
              'focus-visible:outline-[var(--scanner-border-focus)]',
            ],
            'data-[state=focused]:outline data-[state=focused]:outline-2',
            'data-[state=focused]:outline-offset-[-2px]',
            'data-[state=focused]:outline-[var(--scanner-border-focus)]',
          )}
          onClick={disabled ? undefined : onClick}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {/* Indent spacer */}
          {indented && <div className="shrink-0 size-5" aria-hidden="true" />}

          {/* Selected checkmark (neutral only) */}
          {selected && isNeutral && (
            <Icon
              name="check"
              size={20}
              className={cn(
                'shrink-0',
                disabled
                  ? 'text-[color:var(--scanner-icon-disabled)]'
                  : 'text-[color:var(--scanner-icon-primary)]',
              )}
            />
          )}

          {/* Content */}
          <div className="flex flex-1 gap-[var(--scanner-spacing-3)] items-start min-w-px">
            <div className="flex flex-1 flex-col gap-[var(--scanner-spacing-2)] items-start min-w-px">
              {/* Option text */}
              <span
                className={cn(
                  'w-full overflow-hidden text-ellipsis whitespace-nowrap',
                  'font-[family-name:var(--scanner-font-sans)] font-normal',
                  cfg.optionText,
                  optionColorClass,
                )}
              >
                {label}
              </span>

              {/* Subtext */}
              {showSubtext && (
                <span
                  className={cn(
                    'w-full',
                    'font-[family-name:var(--scanner-font-sans)] font-normal',
                    'text-[length:var(--scanner-text-sm)]',
                    'leading-[var(--scanner-leading-sm)]',
                    subtextColorClass,
                  )}
                >
                  {subtext}
                </span>
              )}
            </div>
          </div>

          {/* Trailing element */}
          {showTrailingElement && trailingElementProps && (
            <MenuTrailingElements
              {...trailingElementProps}
              className={cn(
                'h-6 shrink-0',
                disabled && 'opacity-40 pointer-events-none',
              )}
            />
          )}
        </div>

        {/* ── Divider ── */}
        {showDivider && (
          <div
            className="h-2 w-full overflow-clip relative"
            role="separator"
            aria-hidden="true"
          >
            <div className="absolute left-0 right-0 top-[3px] h-px border-t border-[var(--scanner-border-subtle)]" />
          </div>
        )}
      </div>
    );
  },
);

MenuItems.displayName = 'MenuItems';
