import type { MenuItemSize } from '../_menu-items/menu-items.types';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size variant applied to the container and propagated to child MenuItems. */
  size?: MenuItemSize;
  /** Show a decorative scroll indicator. */
  scroll?: boolean;
  /** Additional class names. */
  className?: string;
  /** Menu item children. */
  children?: React.ReactNode;
  /** Callback fired when Escape is pressed. */
  onClose?: () => void;
}

export interface MenuDividerProps {
  /** Additional class names. */
  className?: string;
}
