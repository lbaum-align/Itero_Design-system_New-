import type { IconName } from '../../icons';

export type MenuTrailingType = 'shortcut' | 'toggle' | 'submenu';

export interface MenuTrailingElementsProps {
  /** Array of key labels to display as keyboard shortcut (e.g., ['⌘', 'K']). */
  shortcutKeys?: string[];
  /** Show a toggle switch. */
  toggle?: boolean;
  /** Whether the toggle is selected/on. */
  toggleSelected?: boolean;
  /** Callback when toggle value changes. */
  onToggleChange?: (selected: boolean) => void;
  /** Icon name for submenu trailing icon (shows a chevron-right). */
  icon?: IconName;
  /** Optional label text displayed next to the submenu icon. */
  label?: string;
  /** Whether to show the label (for submenu type). */
  showLabel?: boolean;
  /** Additional CSS class names. */
  className?: string;
}
