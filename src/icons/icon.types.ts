import type { SVGAttributes } from 'react';

export type IconSize = 12 | 16 | 20 | 24 | 28 | 32;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Icon name — must match a key in the icon registry */
  name: IconName;
  /** Pixel size (square). Defaults to 20. */
  size?: IconSize;
  /** Accessible label. When set, role="img" is applied; when absent, aria-hidden="true". */
  label?: string;
  className?: string;
}

/**
 * Each icon is a function that returns the inner SVG elements (paths, etc.)
 * The wrapper `<svg>` is provided by the Icon component.
 */
export type IconComponent = React.FC<SVGAttributes<SVGSVGElement>>;

/** Figma "Number outline / N" and "Number filled / N" step glyphs (1–8). */
export type IconStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Union of all registered icon names.
 * Keys of `iconRegistry` (`registry.tsx`) — the registry is typed `Record<IconName, IconEntry>`,
 * so this union and the registry cannot drift apart.
 */
export type IconName =
  | 'account'
  | 'add'
  | 'add-empty'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'calendar'
  | 'caret-down'
  | 'caret-left'
  | 'caret-right'
  | 'check'
  | 'checkmark'
  | 'checkmark-outline'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'close-empty'
  | 'close-fill'
  | 'copy'
  | 'drag'
  | 'edit'
  | 'error'
  | 'external'
  | 'eye'
  | 'eye-off'
  | 'filter'
  | 'gift'
  | 'help'
  | 'info'
  | 'information'
  | 'launch'
  | 'menu'
  | 'minus'
  | 'more-horizontal'
  | 'more-vertical'
  | 'notification-outline'
  | `number-filled-${IconStepNumber}`
  | `number-outline-${IconStepNumber}`
  | 'search'
  | 'settings'
  | 'sort'
  | 'sort-ascending'
  | 'sort-descending'
  | 'subtract-empty'
  | 'success'
  | 'user'
  | 'view'
  | 'view-off'
  | 'warning';
