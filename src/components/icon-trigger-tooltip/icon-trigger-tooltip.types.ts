import type { HTMLAttributes } from 'react';
import type { TooltipPosition } from '../_tooltip-container';
import type { TooltipAlignment, TooltipPlacement } from '../tooltip';
import type { IconName } from '../../icons';

export interface IconTriggerTooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** Tooltip message (Figma "Text value") */
  content: string;
  /** Figma "Placement". Takes precedence over `position`. */
  placement?: TooltipPlacement;
  /**
   * Legacy alias of `placement`.
   * @default 'bottom'
   */
  position?: TooltipPosition;
  /** Figma "Alignment". @default 'middle' */
  alignment?: TooltipAlignment;
  /** Trigger icon (Figma "Help outline"). @default 'help' */
  iconName?: IconName;
  /** Controlled visibility (Figma "Show tooltip"). */
  open?: boolean;
  /** Called when hover / focus / blur / Escape request a visibility change. */
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms. @default 300 */
  delay?: number;
  /**
   * Disabled trigger: `icon-disabled` colour, not focusable, tooltip never shows.
   * Not a Figma variant (field Disabled variants hide the explainer) — use inside disabled fields.
   */
  disabled?: boolean;
  /** Accessible name of the trigger button. @default `Help: ${content}` */
  triggerLabel?: string;
  /** Force the trigger's focus stroke for screenshots / Storybook. */
  'data-state'?: 'focused';
  /** Additional CSS class names on the wrapper */
  className?: string;
}
