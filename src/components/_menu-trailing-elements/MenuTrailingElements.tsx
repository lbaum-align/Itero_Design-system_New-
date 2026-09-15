import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { KeyboardShortcut } from '../_keyboard-shortcut';
import { Toggle } from '../toggle';
import type { MenuTrailingElementsProps, MenuTrailingType } from './menu-trailing-elements.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Menu trailing elements (node 31214:149912, page "Menu").
 * Type: Keyboard shortcut (24px tall, right-aligned _Keyboard shortcut) · Toggle (the regular 51.2×32 Toggle,
 * no value text) · Submenu (optional 14/20 text-secondary label + 24px chevron-right icon-secondary, 8px gap).
 */

/** Figma submenu chevron is 24×24 at every menu size. */
const SUBMENU_ICON_SIZE = 24;

function resolveType({
  type,
  shortcutKeys,
  toggle,
  icon,
}: Pick<MenuTrailingElementsProps, 'type' | 'shortcutKeys' | 'toggle' | 'icon'>): MenuTrailingType | null {
  if (type) return type;
  if (shortcutKeys && shortcutKeys.length > 0) return 'shortcut';
  if (toggle) return 'toggle';
  if (icon) return 'submenu';
  return null;
}

/**
 * _MenuTrailingElements — the trailing slot of a menu item: keyboard shortcut, toggle or submenu indicator.
 *
 * @private Private sub-component; not exported from the package barrel.
 *
 * @example
 * <MenuTrailingElements shortcutKeys={['⌘', 'X']} />
 * <MenuTrailingElements toggle toggleSelected={on} onToggleChange={setOn} />
 * <MenuTrailingElements type="submenu" label="PNG" showLabel />
 */
export const MenuTrailingElements = forwardRef<HTMLDivElement, MenuTrailingElementsProps>(
  (
    {
      type: typeProp,
      shortcutKeys,
      toggle,
      toggleSelected = false,
      onToggleChange,
      toggleAriaLabel = 'Toggle',
      toggleInteractive = true,
      icon,
      label,
      showLabel = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const type = resolveType({ type: typeProp, shortcutKeys, toggle, icon });
    if (!type) return null;

    return (
      <div
        ref={ref}
        data-type={type}
        className={cn(
          'inline-flex shrink-0',
          type === 'shortcut' && 'h-[var(--scanner-spacing-7)] items-center justify-end',
          type === 'toggle' && 'items-start',
          type === 'submenu' && 'items-center gap-[var(--scanner-spacing-3)]',
          className,
        )}
        {...rest}
      >
        {type === 'shortcut' && <KeyboardShortcut keys={shortcutKeys ?? []} disabled={disabled} />}

        {type === 'toggle' &&
          (toggleInteractive ? (
            <Toggle
              selected={toggleSelected}
              onChange={onToggleChange}
              disabled={disabled}
              aria-label={toggleAriaLabel}
            />
          ) : (
            <span aria-hidden="true" className="pointer-events-none inline-flex">
              <Toggle selected={toggleSelected} disabled={disabled} tabIndex={-1} aria-label={toggleAriaLabel} />
            </span>
          ))}

        {type === 'submenu' && (
          <>
            {showLabel && label && (
              <span
                className={cn(
                  'whitespace-nowrap font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                  'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
                  disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]',
                )}
              >
                {label}
              </span>
            )}
            <Icon
              name={icon ?? 'chevron-right'}
              size={SUBMENU_ICON_SIZE}
              className={disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-secondary)]'}
            />
          </>
        )}
      </div>
    );
  },
);

MenuTrailingElements.displayName = 'MenuTrailingElements';
