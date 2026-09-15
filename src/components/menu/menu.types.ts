import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { MenuItemSize } from '../_menu-items/menu-items.types';

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'autoFocus'> {
  /** Figma "Size" — applied to the container and propagated to child `MenuItems`. */
  size?: MenuItemSize;
  /**
   * Figma "Scroll" — the list scrolls vertically (thin `border-subtle` scrollbar) once it exceeds `maxHeight`.
   */
  scroll?: boolean;
  /** Maximum height of the panel (number = px). Use with `scroll`. */
  maxHeight?: CSSProperties['maxHeight'];
  /** Move focus into the menu on mount: `true`/`'first'` → first enabled item, `'last'` → last. */
  autoFocus?: boolean | 'first' | 'last';
  /** Additional class names. */
  className?: string;
  /** `MenuItems` / `MenuDivider` children. */
  children?: ReactNode;
  /** Called when Escape is pressed. */
  onClose?: () => void;
}

export interface MenuDividerProps {
  /** Additional class names. */
  className?: string;
}
