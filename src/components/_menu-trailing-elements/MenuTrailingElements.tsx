import { forwardRef, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { KeyboardShortcut } from '../_keyboard-shortcut';
import { Toggle } from '../toggle';
import { Icon } from '../../icons';
import type { MenuTrailingElementsProps, MenuTrailingType } from './menu-trailing-elements.types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/**
 * Infer the trailing element type from the provided props.
 * Priority: shortcutKeys > toggle > icon (submenu).
 */
function resolveType(props: MenuTrailingElementsProps): MenuTrailingType | null {
  if (props.shortcutKeys && props.shortcutKeys.length > 0) return 'shortcut';
  if (props.toggle) return 'toggle';
  if (props.icon) return 'submenu';
  return null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * _MenuTrailingElements — the trailing section of a menu item.
 *
 * Conditionally renders a keyboard shortcut, a toggle switch, or
 * a submenu indicator (icon with optional label) based on which
 * props are provided.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <MenuTrailingElements shortcutKeys={['⌘', 'X']} />
 * <MenuTrailingElements toggle toggleSelected={isOn} onToggleChange={setIsOn} />
 * <MenuTrailingElements icon="chevron-right" label="More" showLabel />
 */
export const MenuTrailingElements = forwardRef<HTMLDivElement, MenuTrailingElementsProps>(
  (
    {
      shortcutKeys,
      toggle,
      toggleSelected = false,
      onToggleChange,
      icon,
      label,
      showLabel = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const type = useMemo(
      () => resolveType({ shortcutKeys, toggle, icon }),
      [shortcutKeys, toggle, icon],
    );

    if (!type) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex shrink-0',
          type === 'submenu' && 'items-center gap-[var(--scanner-spacing-3)]',
          type === 'shortcut' && 'items-center justify-end',
          type === 'toggle' && 'items-start',
          className,
        )}
        {...rest}
      >
        {/* Keyboard shortcut */}
        {type === 'shortcut' && shortcutKeys && (
          <KeyboardShortcut keys={shortcutKeys} />
        )}

        {/* Toggle switch */}
        {type === 'toggle' && (
          <Toggle
            selected={toggleSelected}
            onChange={onToggleChange}
            aria-label="Menu item toggle"
          />
        )}

        {/* Submenu indicator */}
        {type === 'submenu' && (
          <>
            {showLabel && label && (
              <span
                className={cn(
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[length:var(--scanner-text-sm)] font-normal',
                  'leading-[var(--scanner-leading-sm)]',
                  'text-[color:var(--scanner-text-secondary)]',
                  'whitespace-nowrap',
                )}
              >
                {label}
              </span>
            )}
            {icon && (
              <Icon
                name={icon}
                size={24}
                className="shrink-0 text-[color:var(--scanner-text-secondary)]"
              />
            )}
          </>
        )}
      </div>
    );
  },
);

MenuTrailingElements.displayName = 'MenuTrailingElements';
