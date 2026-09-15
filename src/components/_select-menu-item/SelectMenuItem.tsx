import { forwardRef, useContext, useId } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { SelectMenuContext, selectMenuOptionId } from '../select-menu/select-menu-context';
import type { SelectMenuItemProps, SelectMenuItemSize } from './select-menu-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Select menu Item (node 7149:1690, page "Dropdown").
 * Size (X-Large, Large, Medium, Small) × Type (Single) × Selected (False, True) × State (Enabled, Hovered, Focused,
 * Disabled) = 32 variants, plus Show divider / Show headline / Show subtext.
 *
 * Heights come from padding + line height: X-Large 16+28+16 = 60 (content centred), Large 12+20+12 = 44,
 * Medium 8+20+8 = 36, Small 4+20+4 = 28 (content top-aligned). Selected adds a trailing checkmark.
 */

const sizeConfig: Record<SelectMenuItemSize, { padding: string; align: string; option: string; check: string }> = {
  'x-large': {
    padding: 'px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-5)]', // 12 / 16
    align: 'items-center',
    option: 'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]', // Body 02 18/28
    check: 'size-[var(--scanner-select-menu-item-check-size-xl)]',
  },
  large: {
    padding: 'p-[var(--scanner-spacing-4)]', // 12
    align: 'items-start',
    option: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]', // 14/20
    check: 'size-[var(--scanner-select-menu-item-check-size)]',
  },
  medium: {
    padding: 'p-[var(--scanner-spacing-3)]', // 8
    align: 'items-start',
    option: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
    check: 'size-[var(--scanner-select-menu-item-check-size)]',
  },
  small: {
    padding: 'p-[var(--scanner-spacing-2)]', // 4
    align: 'items-start',
    option: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
    check: 'size-[var(--scanner-select-menu-item-check-size)]',
  },
};

const fontBase = 'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]';

/**
 * _SelectMenuItem — one option of a `SelectMenu` (`role="option"`).
 *
 * Inside a `SelectMenu`, pass `value`: clicking selects it, and the menu handles keyboard navigation
 * (roving focus or `aria-activedescendant`). Standalone, drive it with `selected` / `onClick`.
 *
 * @private Private sub-component; not exported from the package barrel.
 *
 * @example
 * <SelectMenu value={country} onChange={setCountry} aria-label="Country">
 *   <SelectMenuItem value="us" optionText="United States" />
 *   <SelectMenuItem value="ca" optionText="Canada" />
 * </SelectMenu>
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
      value,
      selected: selectedProp,
      disabled = false,
      size: sizeProp,
      id: idProp,
      className,
      onClick,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    const ctx = useContext(SelectMenuContext);
    const size = sizeProp ?? ctx.size ?? 'x-large';
    const cfg = sizeConfig[size];
    const autoId = useId();
    const id =
      idProp ??
      (ctx.idPrefix && value !== undefined ? selectMenuOptionId(ctx.idPrefix, value) : `select-menu-item-${autoId}`);

    const selected = selectedProp ?? (value !== undefined && ctx.value != null && ctx.value === value);
    const activeDescendant = ctx.focusMode === 'activedescendant';
    const active = activeDescendant && value !== undefined && ctx.activeValue === value;

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(event);
      if (!event.defaultPrevented && value !== undefined) ctx.onSelect?.(value);
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (value !== undefined && event.target === event.currentTarget) ctx.onActivate?.(value);
    };

    const disabledText = 'text-[color:var(--scanner-text-disabled)]';
    const focusRing = 'shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]';

    return (
      <div role="none" data-size={size} className={cn('flex w-full shrink-0 flex-col', className)}>
        {showHeadline && (
          <div
            role="presentation"
            className="flex w-full pt-[var(--scanner-spacing-4)] pr-[var(--scanner-spacing-3)] pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-3)]"
          >
            <span
              className={cn(
                'min-w-0 flex-1',
                fontBase,
                'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)] text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {headlineText}
            </span>
          </div>
        )}

        <div
          ref={ref}
          id={id}
          role="option"
          aria-selected={selected}
          aria-disabled={disabled || undefined}
          tabIndex={activeDescendant ? undefined : -1}
          data-value={value}
          data-selected={selected ? '' : undefined}
          data-active={active ? '' : undefined}
          onClick={handleClick}
          onFocus={handleFocus}
          className={cn(
            'flex w-full gap-[var(--scanner-spacing-3)] rounded-[var(--scanner-radius-sm)] outline-none',
            'transition-[background-color,box-shadow] duration-100',
            cfg.padding,
            cfg.align,
            disabled
              ? 'cursor-not-allowed'
              : cn(
                  'cursor-pointer',
                  'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
                  'focus-visible:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)] data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
                  active && focusRing,
                ),
          )}
          {...rest}
        >
          <span className="flex min-w-0 flex-1 flex-col items-start">
            <span
              className={cn(
                'w-full truncate',
                fontBase,
                cfg.option,
                disabled ? disabledText : 'text-[color:var(--scanner-text-primary)]',
              )}
            >
              {optionText}
            </span>
            {showSubtext && (
              <span
                className={cn(
                  'w-full',
                  fontBase,
                  'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
                  disabled ? disabledText : 'text-[color:var(--scanner-text-secondary)]',
                )}
              >
                {subheadText}
              </span>
            )}
          </span>

          {selected && (
            <svg
              aria-hidden="true"
              data-checkmark=""
              viewBox="0 0 20 20"
              fill="none"
              className={cn(
                'shrink-0',
                cfg.check,
                disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-primary)]',
              )}
            >
              {/* Figma "Checkmark empty" glyph (the 24×24 variant is the same glyph scaled) */}
              <path
                transform="translate(2.5 4.74)"
                d="M5.625 10.2587L0 4.63375L0.88375 3.75L5.625 8.49062L14.1163 0L15 0.88375L5.625 10.2587Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        {showDivider && (
          <div aria-hidden="true" data-divider="" className="relative h-[var(--scanner-spacing-3)] w-full shrink-0">
            <span className="absolute inset-x-0 top-[var(--scanner-select-menu-divider-offset)] h-px bg-[var(--scanner-border-subtle)]" />
          </div>
        )}
      </div>
    );
  },
);

SelectMenuItem.displayName = 'SelectMenuItem';
