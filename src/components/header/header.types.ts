import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import type { IconName } from '../../icons';
import type { LogoVariation } from '../logo';

/** Figma "Menu" — `visible`: horizontal navigation in the header; `hidden`: hamburger trigger instead. */
export type HeaderMenu = 'visible' | 'hidden';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). */
export type HeaderForcedState = 'hovered' | 'focused' | 'pressed';

/** One entry of the header navigation (Figma: a ghost Large Button in the "Buttons" row). */
export interface HeaderNavItemData {
  /** Stable id — used for `activeItemId` and as the React key. */
  id: string;
  /** Visible label (Figma "Button text"). */
  label: ReactNode;
  /** Renders the item as a link. Without it the item is a `<button>`. */
  href?: string;
  /** Anchor target — only used together with `href`. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Anchor rel — only used together with `href`. */
  rel?: string;
  /** Disabled item — not focusable, not activatable. */
  disabled?: boolean;
  /** Per-item click handler. Called before `onNavItemSelect`. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: HeaderForcedState;
}

export interface HeaderNavItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'onSelect'> {
  /** The item to render. */
  item: HeaderNavItemData;
  /** Marks the item as the current page (`aria-current="page"`). */
  current?: boolean;
  /** Activation handler (click, Enter/Space). */
  onSelect?: (item: HeaderNavItemData, event: MouseEvent<HTMLElement>) => void;
}

export interface HeaderActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Icon shown in the button (Figma: 32px icon inside a 60×60 ghost Large Button). */
  icon: IconName;
  /** Accessible name — icon-only buttons have no visible label. */
  label: string;
  /** Renders the action with the "current/selected" background. */
  selected?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: HeaderForcedState;
}

export interface HeaderDividerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Additional CSS class names */
  className?: string;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  /** Figma "Menu". `visible` renders the navigation, `hidden` renders the hamburger trigger. @default 'visible' */
  menu?: HeaderMenu;

  /* ---- Logo ---- */
  /** Figma `Logo` "Variation". @default 'itero' (the variation used in the Figma header) */
  logoVariation?: LogoVariation;
  /** Rendered logo height in px. @default 28 (Figma) */
  logoHeight?: number;
  /** Replaces the default `Logo` entirely (e.g. a routed link wrapping a `Logo`). */
  logo?: ReactNode;
  /** Wraps the logo in a link to the application home. */
  logoHref?: string;
  /** Accessible name of the logo link. @default 'Home' */
  logoLabel?: string;

  /* ---- Navigation ---- */
  /** Navigation entries, rendered left-to-right after the logo (Figma "Menu=Visible"). */
  navItems?: HeaderNavItemData[];
  /** Id of the active entry (controlled). */
  activeItemId?: string;
  /** Id of the initially active entry (uncontrolled). */
  defaultActiveItemId?: string;
  /** Called when an entry is activated. Call `event.preventDefault()` to handle routing yourself. */
  onNavItemSelect?: (id: string, item: HeaderNavItemData, event: MouseEvent<HTMLElement>) => void;
  /**
   * Entries beyond this count move into the overflow `Menu` behind the "…" trigger
   * (Figma shows 7 entries + the "More horizontal" trigger). @default 7
   */
  maxVisibleNavItems?: number;
  /** Accessible name of the `<nav>` landmark. @default 'Main' */
  navLabel?: string;
  /** Accessible name of the overflow menu trigger. @default 'More' */
  overflowLabel?: string;

  /* ---- Hamburger (Figma "Menu=Hidden") ---- */
  /** Open state of the navigation panel the hamburger controls (controlled). */
  menuOpen?: boolean;
  /** Initial open state of the navigation panel (uncontrolled). @default false */
  defaultMenuOpen?: boolean;
  /** Called when the hamburger is activated. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Accessible name of the hamburger button. @default 'Main menu' */
  menuButtonLabel?: string;
  /** Id of the navigation panel the hamburger controls (`aria-controls`). */
  menuControls?: string;

  /* ---- Right-hand side ---- */
  /** Action slot — `HeaderAction` buttons and `HeaderDivider`s (Figma right "Buttons" row). */
  actions?: ReactNode;
  /** User slot rendered after the actions (e.g. an `Avatar` or an account `HeaderAction`). */
  user?: ReactNode;
}
