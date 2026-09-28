import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Button } from '../button';
import { Logo } from '../logo';
import { Menu } from '../menu';
import { MenuItems } from '../_menu-items';
import type {
  HeaderActionProps,
  HeaderDividerProps,
  HeaderNavItemData,
  HeaderNavItemProps,
  HeaderProps,
} from './header.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Header (node 34193:2652, page "Header").
 * Menu = Visible | Hidden (2 variants).
 *
 * Row: 1920 × 72, padding 6px / 16px (spacing-04), space-between, background-subtle-01,
 * 1px inside bottom stroke border-subtle (drawn as an inset box-shadow so it never changes the height).
 * Left group (gap 16): hamburger "Menu" 24×24 icon (Menu=Hidden only) · Logo (iTero, 70×28) ·
 * navigation = ghost Large Buttons (gap 4) + a "More horizontal" ghost Large Button (Menu=Visible only).
 * Right group (gap 4): ghost Large icon-only Buttons (60×60, 32px icon-secondary icons) with
 * 1px × 60 border-accent dividers between groups.
 */

/** Figma icon-only header buttons carry a 32px icon tinted `icon-secondary` (the Button default is 24px / icon-primary). */
const headerIconButton = cn(
  '[&_svg]:size-[var(--scanner-header-action-icon-size)]',
  '[&:not(:disabled)_svg]:text-[color:var(--scanner-icon-secondary)]',
);

/** Selected/current surface — Figma defines no "current page" state for the header (see signoff). */
const currentSurface = cn(
  'bg-[var(--scanner-bg-layer-selected)]',
  'hover:bg-[var(--scanner-bg-layer-selected-hover)] data-[state=hovered]:bg-[var(--scanner-bg-layer-selected-hover)]',
  'active:bg-[var(--scanner-bg-layer-selected-active)] data-[state=pressed]:bg-[var(--scanner-bg-layer-selected-active)]',
);

/* ------------------------------------------------------------------ */
/*  Divider                                                           */
/* ------------------------------------------------------------------ */

/**
 * Vertical 1px divider between groups of header actions (Figma "Divaider", 1 × 60, `border-accent`).
 *
 * @example
 * <HeaderAction icon="search" label="Search" />
 * <HeaderDivider />
 * <HeaderAction icon="settings" label="Settings" />
 */
export const HeaderDivider = forwardRef<HTMLSpanElement, HeaderDividerProps>(
  ({ className, ...rest }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-header-divider=""
      className={cn(
        'h-[var(--scanner-header-row-height)] w-px shrink-0 self-center bg-[var(--scanner-border-default)]',
        className,
      )}
      {...rest}
    />
  ),
);

HeaderDivider.displayName = 'HeaderDivider';

/* ------------------------------------------------------------------ */
/*  Action                                                            */
/* ------------------------------------------------------------------ */

/**
 * One icon-only header action — a ghost Large `Button` with a 32px icon (Figma right "Buttons" row).
 *
 * @example
 * <HeaderAction icon="notification-outline" label="Notifications" onClick={openPanel} />
 */
export const HeaderAction = forwardRef<HTMLButtonElement, HeaderActionProps>(
  ({ icon, label, selected = false, className, ...rest }, ref) => (
    <Button
      ref={ref}
      emphasis="ghost"
      size="large"
      iconOnly
      iconName={icon}
      aria-label={label}
      aria-pressed={selected || undefined}
      className={cn(headerIconButton, selected && currentSurface, className)}
      {...rest}
    />
  ),
);

HeaderAction.displayName = 'HeaderAction';

/* ------------------------------------------------------------------ */
/*  Navigation item                                                   */
/* ------------------------------------------------------------------ */

/*
 * Figma lays the header out on a 1920px canvas and documents no responsive behaviour. Entries keep the
 * Figma Button metrics but may shrink down to the Button min-width (72px), truncating their label, so a
 * narrow viewport never makes the navigation overlap the actions.
 */
const navItemBase = cn(
  'group relative inline-flex items-center justify-center align-middle',
  'min-h-[var(--scanner-header-row-height)] min-w-[var(--scanner-button-min-width)]',
  'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)] rounded-[var(--scanner-radius-md)]',
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
  'whitespace-nowrap no-underline select-none outline-none',
  'transition-[background-color,box-shadow] duration-150',
);

const navItemInteractive = cn(
  'cursor-pointer text-[color:var(--scanner-text-primary)]',
  'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
  'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
  'focus-visible:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)] data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
);

const navItemDisabled = 'cursor-not-allowed text-[color:var(--scanner-text-disabled)]';

/** Focus ring — 2px, 4px outside the item (identical to `Button`). */
const FocusRing = () => (
  <span
    aria-hidden="true"
    className={cn(
      'pointer-events-none absolute hidden',
      'inset-[calc(var(--scanner-button-focus-offset)*-1)] rounded-[var(--scanner-radius-lg)]',
      'border-[length:var(--scanner-button-focus-width)] border-solid border-[color:var(--scanner-border-focus)]',
      'group-focus-visible:block group-data-[state=focused]:block',
    )}
  />
);

/**
 * One header navigation entry. Renders an `<a>` when the item has an `href`, otherwise a `<button>`.
 * Visuals mirror the Figma ghost Large Button used in the header's navigation row.
 */
const HeaderNavItem = forwardRef<HTMLElement, HeaderNavItemProps>(
  ({ item, current = false, onSelect, className, ...rest }, ref) => {
    const disabled = !!item.disabled;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      item.onClick?.(event);
      onSelect?.(item, event);
    };

    const shared = {
      'data-state': item['data-state'],
      'data-nav-item': item.id,
      'aria-current': current ? ('page' as const) : undefined,
      onClick: handleClick,
      className: cn(
        navItemBase,
        disabled ? navItemDisabled : navItemInteractive,
        !disabled && current && currentSurface,
        className,
      ),
      ...rest,
    };

    if (item.href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : item.href}
          target={item.target}
          rel={item.rel}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          {...shared}
        >
          <span className="min-w-0 truncate">{item.label}</span>
          <FocusRing />
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        {...shared}
      >
        <span className="min-w-0 truncate">{item.label}</span>
        <FocusRing />
      </button>
    );
  },
);

HeaderNavItem.displayName = 'HeaderNavItem';

/* ------------------------------------------------------------------ */
/*  Overflow menu                                                     */
/* ------------------------------------------------------------------ */

interface OverflowMenuProps {
  items: HeaderNavItemData[];
  activeId?: string;
  label: string;
  onSelect: (item: HeaderNavItemData, event: MouseEvent<HTMLElement>) => void;
}

/** "More horizontal" trigger + `Menu` holding the navigation entries that don't fit. */
const HeaderOverflowMenu = ({ items, activeId, label, onSelect }: OverflowMenuProps) => {
  const [open, setOpen] = useState(false);
  const [autoFocus, setAutoFocus] = useState<boolean | 'first' | 'last'>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const containsActive = items.some((item) => item.id === activeId);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setAutoFocus(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  /* Click outside closes the menu without stealing focus back */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setAutoFocus(event.key === 'ArrowDown' ? 'first' : 'last');
      setOpen(true);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      close();
    }
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <Button
        ref={triggerRef}
        emphasis="ghost"
        size="large"
        iconOnly
        iconName="more-horizontal"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        data-overflow-trigger=""
        onClick={() => {
          setAutoFocus(false);
          setOpen((value) => !value);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          '[&_svg]:size-[var(--scanner-header-action-icon-size)]',
          containsActive && currentSurface,
        )}
      />

      {open && (
        <Menu
          id={menuId}
          aria-label={label}
          autoFocus={autoFocus}
          onClose={close}
          className="absolute right-0 top-full z-10 mt-[var(--scanner-spacing-2)]"
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <MenuItems
                key={item.id}
                label={item.label}
                disabled={item.disabled}
                selected={isActive || undefined}
                indented={!isActive && containsActive}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  if (item.disabled) return;
                  item.onClick?.(event);
                  onSelect(item, event);
                  close();
                }}
              />
            );
          })}
        </Menu>
      )}
    </div>
  );
};

HeaderOverflowMenu.displayName = 'HeaderOverflowMenu';

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */

/**
 * Scanner Header — the application header: logo, primary navigation and global actions.
 *
 * Figma props → React:
 * - Menu = Visible → `menu="visible"` (navigation rendered inline)
 * - Menu = Hidden → `menu="hidden"` (hamburger trigger instead; the panel it opens is the consumer's)
 *
 * Accessibility: renders a `<header>` landmark containing a `<nav>` landmark; the active entry carries
 * `aria-current="page"`; the hamburger exposes `aria-expanded` / `aria-controls`; the overflow trigger
 * exposes `aria-haspopup="menu"` / `aria-expanded` and opens a `Menu` (ArrowDown/ArrowUp open it with the
 * first/last item focused, Escape closes it and returns focus to the trigger).
 *
 * @example
 * <Header
 *   navItems={[{ id: 'home', label: 'Home', href: '/' }, { id: 'orders', label: 'Orders', href: '/orders' }]}
 *   defaultActiveItemId="home"
 *   actions={<>
 *     <HeaderAction icon="search" label="Search" />
 *     <HeaderDivider />
 *     <HeaderAction icon="notification-outline" label="Notifications" />
 *   </>}
 *   user={<HeaderAction icon="account" label="Account" />}
 * />
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      menu = 'visible',
      logoVariation = 'itero',
      logoHeight = 28,
      logo,
      logoHref,
      logoLabel = 'Home',
      navItems = [],
      activeItemId,
      defaultActiveItemId,
      onNavItemSelect,
      maxVisibleNavItems = 7,
      navLabel = 'Main',
      overflowLabel = 'More',
      menuOpen,
      defaultMenuOpen = false,
      onMenuOpenChange,
      menuButtonLabel = 'Main menu',
      menuControls,
      actions,
      user,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [uncontrolledActive, setUncontrolledActive] = useState(defaultActiveItemId);
    const activeId = activeItemId !== undefined ? activeItemId : uncontrolledActive;

    const [uncontrolledMenuOpen, setUncontrolledMenuOpen] = useState(defaultMenuOpen);
    const isMenuOpen = menuOpen !== undefined ? menuOpen : uncontrolledMenuOpen;

    const handleSelect = (item: HeaderNavItemData, event: MouseEvent<HTMLElement>) => {
      onNavItemSelect?.(item.id, item, event);
      if (activeItemId === undefined) setUncontrolledActive(item.id);
    };

    const handleMenuToggle = () => {
      const next = !isMenuOpen;
      if (menuOpen === undefined) setUncontrolledMenuOpen(next);
      onMenuOpenChange?.(next);
    };

    const visibleItems = navItems.slice(0, Math.max(0, maxVisibleNavItems));
    const overflowItems = navItems.slice(Math.max(0, maxVisibleNavItems));

    const logoNode = logo ?? <Logo variation={logoVariation} height={logoHeight} />;

    return (
      <header
        ref={ref}
        data-menu={menu}
        className={cn(
          'flex w-full items-center justify-between gap-[var(--scanner-spacing-5)]',
          'px-[var(--scanner-spacing-5)] py-[var(--scanner-header-padding-y)]',
          /* Figma "background-subtle-01" — identical values to "background-layer-01" (see header.css) */
          'bg-[var(--scanner-bg-layer-01)]',
          /* Figma draws the 1px border-subtle stroke inside the box — an inset shadow keeps the height at 72px */
          'shadow-[inset_0_-1px_0_0_var(--scanner-border-subtle)]',
          className,
        )}
        {...rest}
      >
        {/* ── Left: hamburger + logo + navigation ── */}
        <div className="flex min-w-0 items-center gap-[var(--scanner-spacing-5)]">
          {menu === 'hidden' && (
            <button
              type="button"
              aria-label={menuButtonLabel}
              aria-expanded={isMenuOpen}
              aria-controls={menuControls}
              data-menu-trigger=""
              onClick={handleMenuToggle}
              className={cn(
                'group relative inline-flex shrink-0 cursor-pointer items-center justify-center',
                'size-[var(--scanner-header-menu-icon-size)] rounded-[var(--scanner-radius-sm)]',
                'text-[color:var(--scanner-icon-primary)] outline-none',
              )}
            >
              <Icon name="menu" size={24} />
              <FocusRing />
            </button>
          )}

          <span
            className={cn(
              'flex shrink-0 items-center',
              'px-[var(--scanner-header-logo-inset)] pb-[var(--scanner-spacing-2)]',
            )}
          >
            {logoHref ? (
              <a
                href={logoHref}
                aria-label={logoLabel}
                className="group relative inline-flex rounded-[var(--scanner-radius-sm)] outline-none"
              >
                {logoNode}
                <FocusRing />
              </a>
            ) : (
              logoNode
            )}
          </span>

          {menu === 'visible' && navItems.length > 0 && (
            <nav
              aria-label={navLabel}
              className="flex min-w-0 items-center gap-[var(--scanner-spacing-2)]"
            >
              {visibleItems.map((item) => (
                <HeaderNavItem
                  key={item.id}
                  item={item}
                  current={item.id === activeId}
                  onSelect={handleSelect}
                />
              ))}
              {overflowItems.length > 0 && (
                <HeaderOverflowMenu
                  items={overflowItems}
                  activeId={activeId}
                  label={overflowLabel}
                  onSelect={handleSelect}
                />
              )}
            </nav>
          )}

          {children}
        </div>

        {/* ── Right: actions + user ── */}
        {(actions || user) && (
          <div className="flex shrink-0 items-center gap-[var(--scanner-spacing-2)]">
            {actions}
            {user}
          </div>
        )}
      </header>
    );
  },
);

Header.displayName = 'Header';
