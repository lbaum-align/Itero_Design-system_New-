import type { HTMLAttributes, ReactNode } from 'react';

export interface SlotContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Placeholder label (Figma text "Swap me to any component").
   * @default 'Swap me to any component'
   */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
}
