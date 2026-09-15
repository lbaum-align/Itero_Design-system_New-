import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { MenuContext } from './menu-context';
import type { MenuDividerProps, MenuProps } from './menu.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Menu (node 30413:43333, page "Menu").
 * Size (Large, Medium, Small) + Scroll. 180px wide (min 120 / max 288), 4px padding, radius 8,
 * background-elevated, "Depth 01" shadow. Large adds a 1px border-subtle stroke inside the box.
 */

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"]),[role="menuitemcheckbox"]:not([aria-disabled="true"]),[role="menuitemradio"]:not([aria-disabled="true"])';

/**
 * Divider between groups of menu items (same 8px divider as `MenuItems` "Show divider").
 *
 * @example
 * <Menu>
 *   <MenuItems label="Copy" />
 *   <MenuDivider />
 *   <MenuItems label="Delete" type="destructive" />
 * </Menu>
 */
export const MenuDivider = ({ className }: MenuDividerProps) => (
  <div role="separator" className={cn('relative h-[var(--scanner-spacing-3)] w-full shrink-0', className)}>
    <span className="absolute inset-x-0 top-[var(--scanner-menu-divider-offset)] h-px bg-[var(--scanner-border-subtle)]" />
  </div>
);

MenuDivider.displayName = 'MenuDivider';

/**
 * Scanner Menu — a panel of actions (`role="menu"`) built from `MenuItems`.
 *
 * Keyboard (Figma docs + WAI-ARIA menu pattern): Tab focuses the menu (first item), ArrowUp/ArrowDown move
 * between enabled items (wrapping), Home/End jump to the first/last item, Enter/Space activate the focused item,
 * ArrowRight opens a submenu item, Escape calls `onClose`. Items use roving focus, so Tab leaves the menu.
 *
 * @example
 * <Menu size="large" aria-label="Edit">
 *   <MenuItems label="Cut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />
 *   <MenuDivider />
 *   <MenuItems label="Delete" type="destructive" />
 * </Menu>
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      size = 'large',
      scroll = false,
      maxHeight,
      autoFocus = false,
      children,
      className,
      style,
      onClose,
      onKeyDown,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [focusWithin, setFocusWithin] = useState(false);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        menuRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const getItems = useCallback(
      (): HTMLElement[] => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []),
      [],
    );

    const focusAt = useCallback(
      (index: number) => {
        const items = getItems();
        if (items.length === 0) return;
        items[(index + items.length) % items.length]?.focus();
      },
      [getItems],
    );

    /* Only on mount — later `autoFocus` changes must not steal focus */
    const initialAutoFocus = useRef(autoFocus);
    useEffect(() => {
      const mode = initialAutoFocus.current;
      if (mode) focusAt(mode === 'last' ? -1 : 0);
    }, [focusAt]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const items = getItems();
      const current = items.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusAt(current < 0 ? 0 : current + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusAt(current < 0 ? -1 : current - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusAt(0);
          break;
        case 'End':
          event.preventDefault();
          focusAt(-1);
          break;
        case 'Escape':
          if (onClose) {
            event.preventDefault();
            onClose();
          }
          break;
        default:
          break;
      }
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      setFocusWithin(true);
      /* Tabbing onto the container forwards focus to the first item */
      if (event.target === event.currentTarget) focusAt(0);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
    };

    const ctxValue = useMemo(() => ({ size, inMenu: true }), [size]);

    return (
      <MenuContext.Provider value={ctxValue}>
        <div
          ref={setRef}
          role="menu"
          aria-orientation="vertical"
          tabIndex={focusWithin ? -1 : 0}
          data-size={size}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={maxHeight !== undefined ? { maxHeight, ...style } : style}
          className={cn(
            'relative flex flex-col items-stretch outline-none',
            'w-[var(--scanner-menu-width)] min-w-[var(--scanner-menu-min-width)] max-w-[var(--scanner-menu-max-width)]',
            'p-[var(--scanner-spacing-2)] rounded-[var(--scanner-radius-md)]',
            'bg-[var(--scanner-bg-elevated)] shadow-[var(--scanner-shadow-depth-01)]',
            size === 'large' && 'ring-1 ring-inset ring-[var(--scanner-border-subtle)]',
            scroll && 'overflow-y-auto [scrollbar-color:var(--scanner-border-subtle)_transparent] [scrollbar-width:thin]',
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </MenuContext.Provider>
    );
  },
);

Menu.displayName = 'Menu';
