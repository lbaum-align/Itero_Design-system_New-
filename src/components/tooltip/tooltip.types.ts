import type { ReactNode } from 'react';
import type { TooltipPosition } from '../_tooltip-container';

export type { TooltipPosition };

export interface TooltipProps {
  /** Trigger element that activates the tooltip on hover / focus */
  children: ReactNode;
  /** Tooltip content — text string or rich content */
  content: ReactNode;
  /** Tooltip placement relative to the trigger element */
  position?: TooltipPosition;
  /** Delay in milliseconds before the tooltip appears (default 0) */
  delay?: number;
  /** Additional CSS class names on the wrapper */
  className?: string;
}
