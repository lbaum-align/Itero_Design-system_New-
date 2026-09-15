import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Side of the trigger the tooltip appears on (Figma "Placement": Left, Right, Top, Bottom).
 * Shared by Tooltip, IconTriggerTooltip, TextTriggerTooltip and the form-group explainers.
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip message (Figma "Text value") — text or rich content */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
}
