import { createContext } from 'react';
import type { MenuItemSize } from '../_menu-items/menu-items.types';

export interface MenuContextValue {
  /** Size propagated from Menu container to children. */
  size?: MenuItemSize;
  /** `true` inside a `Menu` — items then use roving focus managed by the menu (tabIndex -1). */
  inMenu?: boolean;
  /** @deprecated Unused — kept for backwards compatibility. */
  registerItem?: (el: HTMLElement | null) => void;
  /** @deprecated Unused — kept for backwards compatibility. */
  unregisterItem?: (el: HTMLElement | null) => void;
}

export const MenuContext = createContext<MenuContextValue>({});
