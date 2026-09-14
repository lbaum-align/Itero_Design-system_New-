import type { SVGAttributes } from 'react';

export type IconSize = 12 | 16 | 20 | 24 | 32;

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

/**
 * Union of all registered icon names.
 * Expanded as icons are extracted from Figma.
 */
export type IconName =
  | 'add'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'calendar'
  | 'check'
  | 'checkmark'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'close-empty'
  | 'copy'
  | 'drag'
  | 'edit'
  | 'error'
  | 'external'
  | 'eye'
  | 'eye-off'
  | 'filter'
  | 'help'
  | 'info'
  | 'menu'
  | 'minus'
  | 'more-horizontal'
  | 'more-vertical'
  | 'search'
  | 'sort'
  | 'sort-ascending'
  | 'sort-descending'
  | 'success'
  | 'user'
  | 'warning';
