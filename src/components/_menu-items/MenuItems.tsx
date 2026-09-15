import { forwardRef, useContext, useId } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { resolveGlyph } from '../_keyboard-shortcut';
import { MenuTrailingElements } from '../_menu-trailing-elements';
import type { MenuTrailingType } from '../_menu-trailing-elements';
import { MenuContext } from '../menu/menu-context';
import type { MenuItemSize, MenuItemsProps } from './menu-items.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Menu items (node 30413:41882, page "Menu").
 * Size (Large, Medium, Small) × Type (Neutral, Destructive) × State (Enabled, Hovered, Focused, Disabled) = 24 variants,
 * plus Show divider / Show headline / Show subtext / Indented / Selected / Show trailing element.
 *
 * Every variant has a fixed height (60 / 58 / 52) that holds the item row and the optional 8px divider;
 * the row fills it and centres its content. The headline sits above that block.
 */

const sizeConfig: Record<
  MenuItemSize,
  { height: string; padding: string; radius: string; option: string; headline: string }
> = {
  large: {
    height: 'min-h-[var(--scanner-menu-item-height-lg)]',
    padding: 'p-[var(--scanner-spacing-4)]', // 12
    radius: 'rounded-[var(--scanner-radius-md)]', // 8
    option: 'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]', // Body 02 18/28
    headline:
      'pt-[var(--scanner-spacing-4)] pr-[var(--scanner-spacing-4)] pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-4)]', // 12/12/8/12
  },
  medium: {
    height: 'min-h-[var(--scanner-menu-item-height-md)]',
    padding: 'p-[var(--scanner-spacing-3)]', // 8
    radius: 'rounded-[var(--scanner-radius-sm)]', // 4
    option: 'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]', // Body 01 16/24
    headline: 'p-[var(--scanner-spacing-3)]', // 8
  },
  small: {
    height: 'min-h-[var(--scanner-menu-item-height-sm)]',
    padding: 'p-[var(--scanner-spacing-2)]', // 4
    radius: 'rounded-[var(--scanner-radius-sm)]', // 4
    option: 'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]', // Body 01 16/24
    headline:
      'pt-[var(--scanner-spacing-3)] pr-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-2)] pl-[var(--scanner-spacing-2)]', // 8/4/4/4
  },
};

const fontBase = 'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]';

/** Figma "Checkmark empty / Size=20x20" glyph. */
const Checkmark = ({ disabled }: { disabled: boolean }) => (
  <svg
    aria-hidden="true"
    data-checkmark=""
    viewBox="0 0 20 20"
    fill="none"
    className={cn(
      'size-[var(--scanner-menu-item-icon-size)] shrink-0',
      disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-primary)]',
    )}
  >
    <path
      transform="translate(2.5 4.74)"
      d="M5.625 10.2587L0 4.63375L0.88375 3.75L5.625 8.49062L14.1163 0L15 0.88375L5.625 10.2587Z"
      fill="currentColor"
    />
  </svg>
);

const ARIA_KEY: Record<string, string> = { command: 'Meta', option: 'Alt', shift: 'Shift', erase: 'Backspace' };

/** `['⌘', 'X']` → `"Meta+X"` for `aria-keyshortcuts`. */
function toAriaKeyShortcuts(keys: string[]): string {
  return keys.map((k) => (resolveGlyph(k) ? ARIA_KEY[resolveGlyph(k) as string] : k.toUpperCase())).join('+');
}

/**
 * _MenuItems — one option row of a `Menu`: optional headline, leading checkmark/indent, option text + subtext,
 * trailing keyboard shortcut / toggle / submenu chevron, optional divider.
 *
 * Role: `menuitem`; `menuitemcheckbox` when `selected` is a boolean or the trailing element is a toggle;
 * submenu items get `aria-haspopup="menu"`. Enter / Space activate (click); ArrowRight activates submenu items.
 *
 * @private Private sub-component; not exported from the package barrel.
 *
 * @example
 * <MenuItems label="Copy" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }} />
 * <MenuItems label="Delete" type="destructive" />
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
      selected,
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
    const ctx = useContext(MenuContext);
    const size = sizeProp ?? ctx.size ?? 'large';
    const cfg = sizeConfig[size];
    const uid = useId();
    const labelId = `${uid}-label`;
    const subtextId = `${uid}-subtext`;

    const isNeutral = type === 'neutral';
    const showCheck = selected === true && isNeutral;

    const trailing = showTrailingElement ? trailingElementProps : undefined;
    const trailingType: MenuTrailingType | undefined = trailing
      ? (trailing.type ??
        (trailing.shortcutKeys?.length ? 'shortcut' : trailing.toggle ? 'toggle' : trailing.icon ? 'submenu' : undefined))
      : undefined;
    const isToggle = trailingType === 'toggle';
    const isSubmenu = trailingType === 'submenu';

    const role = isToggle || selected !== undefined ? 'menuitemcheckbox' : 'menuitem';
    const checked = isToggle ? !!trailing?.toggleSelected : selected;

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(event);
      if (!event.defaultPrevented && isToggle) trailing?.onToggleChange?.(!trailing.toggleSelected);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || event.target !== event.currentTarget) return;
      if (event.key === 'Enter' || event.key === ' ' || (isSubmenu && event.key === 'ArrowRight')) {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    const optionColor = disabled
      ? 'text-[color:var(--scanner-text-disabled)]'
      : isNeutral
        ? 'text-[color:var(--scanner-text-primary)]'
        : 'text-[color:var(--scanner-text-error)]';

    return (
      <div role="none" data-size={size} className={cn('flex w-full shrink-0 flex-col', className)}>
        {showHeadline && (
          <div role="none" className={cn('flex w-full', cfg.headline)}>
            <span
              className={cn(
                'min-w-0 flex-1',
                fontBase,
                'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)] text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {headline}
            </span>
          </div>
        )}

        <div role="none" className={cn('flex w-full flex-col', cfg.height)}>
          <div
            ref={ref}
            role={role}
            tabIndex={ctx.inMenu || disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-checked={role === 'menuitemcheckbox' ? !!checked : undefined}
            aria-haspopup={isSubmenu ? 'menu' : undefined}
            aria-labelledby={labelId}
            aria-describedby={showSubtext ? subtextId : undefined}
            aria-keyshortcuts={
              trailingType === 'shortcut' && trailing?.shortcutKeys?.length
                ? toAriaKeyShortcuts(trailing.shortcutKeys)
                : undefined
            }
            data-type={type}
            data-selected={showCheck ? '' : undefined}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex w-full flex-1 items-center gap-[var(--scanner-spacing-3)] outline-none',
              'transition-[background-color,box-shadow] duration-100',
              cfg.padding,
              cfg.radius,
              disabled
                ? 'cursor-not-allowed'
                : cn(
                    'cursor-pointer',
                    'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
                    'focus-visible:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)] data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
                  ),
            )}
            {...rest}
          >
            {showCheck ? (
              <Checkmark disabled={disabled} />
            ) : (
              indented && (
                <span aria-hidden="true" data-indent="" className="size-[var(--scanner-menu-item-icon-size)] shrink-0" />
              )
            )}

            <span className="flex min-w-0 flex-1 flex-col items-start gap-[var(--scanner-spacing-2)]">
              <span id={labelId} className={cn('w-full truncate', fontBase, cfg.option, optionColor)}>
                {label}
              </span>
              {showSubtext && (
                <span
                  id={subtextId}
                  className={cn(
                    'w-full',
                    fontBase,
                    'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
                    disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]',
                  )}
                >
                  {subtext}
                </span>
              )}
            </span>

            {trailing && (
              <MenuTrailingElements
                {...trailing}
                disabled={disabled || trailing.disabled}
                toggleInteractive={false}
              />
            )}
          </div>

          {showDivider && (
            <div role="separator" className="relative h-[var(--scanner-spacing-3)] w-full shrink-0">
              <span className="absolute inset-x-0 top-[var(--scanner-menu-divider-offset)] h-px bg-[var(--scanner-border-subtle)]" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

MenuItems.displayName = 'MenuItems';
