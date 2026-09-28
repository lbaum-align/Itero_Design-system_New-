import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../../icons';

/** Figma "Color" */
export type DecorationColor = 'gray' | 'red' | 'magenta' | 'purple' | 'blue' | 'green' | 'orange';

export interface DecorationProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'color' | 'children'
> {
  /** Figma "Color" — highlight background + matching icon colour. @default 'gray' */
  color?: DecorationColor;
  /**
   * Figma "Icon" (instance swap, default "Gift"). A registry icon name renders at 24px in the
   * Figma icon colour; a node is rendered as-is inside the tile.
   * @default 'gift'
   */
  icon?: IconName | ReactNode;
  /**
   * Accessible name. Decorations are presentational by default (`aria-hidden`);
   * pass a label only when the icon conveys meaning on its own.
   */
  label?: string;
  /** Additional CSS class names */
  className?: string;
}
