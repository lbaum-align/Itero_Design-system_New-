import type { ReactNode } from 'react';

export type TextTriggerTooltipPosition = 'top' | 'bottom';

export interface TextTriggerTooltipProps {
  /** Trigger text — rendered with dotted underline */
  children: ReactNode;
  /** Tooltip content — text string */
  content: string;
  /** Tooltip placement relative to the text trigger (top or bottom only) */
  position?: TextTriggerTooltipPosition;
  /** Additional CSS class names on the wrapper */
  className?: string;
}
