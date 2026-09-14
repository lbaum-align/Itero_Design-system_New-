import { forwardRef, useCallback, useRef, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { MenuContext } from './menu-context';
import type { MenuProps, MenuDividerProps } from './menu.types';

/* ------------------------------------------------------------------ */
/*  MenuDivider — standalone divider between item groups              */
/* ------------------------------------------------------------------ */

/**
 * A horizontal divider for separating groups of menu items.
 *
 * @example
 * <Menu>
 *   <MenuItems label="Copy" />
 *   <MenuDivider />
 *   <MenuItems label="Delete" type="destructive" />
 * </Menu>
 */
export const MenuDivider = ({ className }: MenuDividerProps) => (
  <div
    role="separator"
    className={cn('h-2 w-full overflow-clip relative', className)}
    aria-hidden="true"
  >
    <div
      className="absolute left-0 right-0 top-[3px] h-px border-t border-[var(--scanner-border-subtle)]"
    />
  </div>
);

MenuDivider.displayName = 'MenuDivider';

/* ------------------------------------------------------------------ */
/*  Menu — the dropdown panel container                               */
/* ------------------------------------------------------------------ */

/**
 * Scanner Menu — a dropdown menu panel that wraps `_MenuItems`.
 *
 * Provides:
 * - `role="menu"` with keyboard navigation (ArrowUp/Down, Home/End, Enter, Escape)
 * - Size context propagated to child items
 * - Elevated background, shadow, and border styling
 *
 * @example
 * <Menu size="large">
 *   <MenuItems label="Edit" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'E'] }} />
 *   <MenuItems label="Copy" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }} />
 *   <MenuDivider />
 *   <MenuItems label="Delete" type="destructive" />
 * </Menu>
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      size = 'large',
      scroll = false,
      children,
      className,
      onClose,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const menuRef = useRef<HTMLDivElement | null>(null);

    /* Merge external + internal refs */
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        menuRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    /* ── Keyboard navigation ── */
    const getMenuItems = useCallback((): HTMLElement[] => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])',
        ),
      );
    }, []);

    const focusItem = useCallback((items: HTMLElement[], index: number) => {
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      items[clamped]?.focus();
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = getMenuItems();
        if (items.length === 0) return;

        const current = document.activeElement as HTMLElement;
        const currentIndex = items.indexOf(current);

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            const next = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
            focusItem(items, next);
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            const prev =
              currentIndex < 0
                ? items.length - 1
                : (currentIndex - 1 + items.length) % items.length;
            focusItem(items, prev);
            break;
          }
          case 'Home': {
            e.preventDefault();
            focusItem(items, 0);
            break;
          }
          case 'End': {
            e.preventDefault();
            focusItem(items, items.length - 1);
            break;
          }
          case 'Escape': {
            e.preventDefault();
            onClose?.();
            break;
          }
          default:
            break;
        }

        onKeyDown?.(e);
      },
      [getMenuItems, focusItem, onClose, onKeyDown],
    );

    /* ── Context value ── */
    const ctxValue = useMemo(() => ({ size }), [size]);

    const isLarge = size === 'large';

    return (
      <MenuContext.Provider value={ctxValue}>
        <div
          ref={setRef}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={cn(
            /* Layout */
            'relative flex flex-col items-start',
            'min-w-[120px] max-w-[288px]',
            'p-[var(--scanner-spacing-2)]',
            'rounded-[var(--scanner-radius-md)]',

            /* Background + elevation */
            'bg-[var(--scanner-bg-elevated)]',
            'shadow-[var(--scanner-shadow-depth-01)]',

            /* Border — large only */
            isLarge && 'border border-[var(--scanner-border-subtle)]',

            className,
          )}
          {...rest}
        >
          {children}

          {/* Decorative scroll indicator */}
          {scroll && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute w-1 rounded-[var(--scanner-radius-sm)]',
                'bg-[var(--scanner-border-subtle)]',
                isLarge
                  ? 'right-[3px] top-[11px] h-[116px]'
                  : 'right-1 top-3 h-[116px]',
              )}
            />
          )}
        </div>
      </MenuContext.Provider>
    );
  },
);

Menu.displayName = 'Menu';
