import type { HTMLAttributes, ReactNode } from 'react';
import type { TooltipAlignment } from '../tooltip';

/** Figma "Position" — definition tooltips open above or below the text only. */
export type TextTriggerTooltipPosition = 'top' | 'bottom';

export interface TextTriggerTooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** Trigger text (Figma "Text value") — rendered with a dotted underline */
  children: ReactNode;
  /** Tooltip message */
  content: string;
  /** Figma "Position". @default 'bottom' */
  position?: TextTriggerTooltipPosition;
  /** Figma "Alignment". @default 'middle' */
  alignment?: TooltipAlignment;
  /** Controlled visibility (Figma "Show tooltip"). */
  open?: boolean;
  /** Called when hover / focus / blur / Escape request a visibility change. */
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms. @default 300 */
  delay?: number;
  /** Force the trigger's focus stroke for screenshots / Storybook. */
  'data-state'?: 'focused';
  /** Additional CSS class names on the wrapper */
  className?: string;
}
