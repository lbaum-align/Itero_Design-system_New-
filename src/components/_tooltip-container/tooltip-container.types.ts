import type { ReactNode } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipContainerProps {
  /** Tooltip content — text string or rich content */
  children: ReactNode;
  /** Arrow direction relative to the trigger element */
  position?: TooltipPosition;
  /** HTML id attribute — used for aria-describedby association */
  id?: string;
  /** Additional CSS class names */
  className?: string;
}
