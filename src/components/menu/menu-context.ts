import { createContext } from 'react';
import type { MenuItemSize } from '../_menu-items/menu-items.types';

export interface MenuContextValue {
  /** Size propagated from Menu container to children. */
  size?: MenuItemSize;
  /** Register a menu item ref for keyboard navigation. */
  registerItem?: (el: HTMLElement | null) => void;
  /** Unregister a menu item ref. */
  unregisterItem?: (el: HTMLElement | null) => void;
}

export const MenuContext = createContext<MenuContextValue>({});
