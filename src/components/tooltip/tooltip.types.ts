import type { HTMLAttributes, ReactNode } from 'react';
import type { TooltipPosition } from '../_tooltip-container';

export type { TooltipPosition };

/** Figma "Placement" — side of the trigger the tooltip appears on. */
export type TooltipPlacement = TooltipPosition;

/**
 * Figma "Alignment" — where the bubble sits along the trigger edge.
 * The caret always points at the trigger centre:
 * - `start`: bubble starts 16px before the trigger centre (caret near its start edge)
 * - `middle`: bubble centred on the trigger
 * - `end`: bubble ends 16px after the trigger centre (caret near its end edge)
 */
export type TooltipAlignment = 'start' | 'middle' | 'end';

/** Visual tooltip (Figma `01 Tooltip`): container + caret, without trigger or behaviour. */
export interface TooltipBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip message (Figma "Text value") */
  children: ReactNode;
  /** Figma "Placement". The caret sits on the opposite side. @default 'bottom' */
  placement?: TooltipPlacement;
  /** Figma "Alignment". @default 'middle' */
  alignment?: TooltipAlignment;
  /** Figma "Show carret". @default true */
  showCaret?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** Trigger element. A single element receives `aria-describedby`; otherwise the wrapper does. */
  children: ReactNode;
  /** Tooltip message (Figma "Text value") */
  content: ReactNode;
  /** Figma "Placement". Takes precedence over `position`. */
  placement?: TooltipPlacement;
  /**
   * Legacy alias of `placement`.
   * @default 'top'
   */
  position?: TooltipPosition;
  /** Figma "Alignment". @default 'middle' */
  alignment?: TooltipAlignment;
  /** Figma "Show carret". @default true */
  showCaret?: boolean;
  /**
   * Controlled visibility (Figma "Show tooltip"). When set, hover/focus/Escape only call `onOpenChange`.
   */
  open?: boolean;
  /** Initial visibility when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when hover, focus, blur or Escape request a visibility change. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Hover delay in ms before the tooltip appears (Figma: "appear after a brief delay").
   * Keyboard focus shows it immediately.
   * @default 300
   */
  delay?: number;
  /** Never show the tooltip. */
  disabled?: boolean;
  /** Class names for the floating tooltip element. */
  tooltipClassName?: string;
  /** Additional CSS class names on the wrapper (`relative inline-flex`). */
  className?: string;
}
