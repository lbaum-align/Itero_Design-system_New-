import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TooltipContainerProps, TooltipPosition } from './tooltip-container.types';

/**
 * Arrow CSS classes by position.
 *
 * The arrow is a 6px CSS triangle rendered via borders on a pseudo-element.
 * "position" describes where the tooltip sits relative to its trigger,
 * so the arrow points away from the tooltip toward the trigger:
 *   position="top"    → arrow at the bottom, pointing down
 *   position="bottom" → arrow at the top, pointing up
 *   position="left"   → arrow on the right, pointing right
 *   position="right"  → arrow on the left, pointing left
 */
const arrowClasses: Record<TooltipPosition, string> = {
  top: [
    'after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full',
    'after:border-[6px] after:border-transparent',
    'after:border-t-[var(--scanner-bg-inverse)]',
  ].join(' '),
  bottom: [
    'after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-full',
    'after:border-[6px] after:border-transparent',
    'after:border-b-[var(--scanner-bg-inverse)]',
  ].join(' '),
  left: [
    'after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full',
    'after:border-[6px] after:border-transparent',
    'after:border-l-[var(--scanner-bg-inverse)]',
  ].join(' '),
  right: [
    'after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full',
    'after:border-[6px] after:border-transparent',
    'after:border-r-[var(--scanner-bg-inverse)]',
  ].join(' '),
};

/**
 * _TooltipContainer — visual shell for a tooltip.
 *
 * Renders the dark bubble, white text, and directional arrow.
 * This is a **private** sub-component (presentation only).
 * Positioning logic and show/hide behaviour belong in the
 * parent Tooltip component.
 *
 * @example
 * <TooltipContainer position="top">Helpful hint</TooltipContainer>
 */
export const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
  ({ children, position = 'top', className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="tooltip"
        className={cn(
          // Layout
          'relative inline-flex items-start justify-center',
          'max-w-[320px] min-w-[44px] overflow-hidden',
          // Spacing (Figma --spacing-02 = 8px → --scanner-spacing-3)
          'gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-3)]',
          // Background & radius
          'rounded-[var(--scanner-radius-md)] bg-[var(--scanner-bg-inverse)]',
          // Shadow for elevation
          'shadow-[var(--scanner-shadow-depth-01)]',
          // Typography (Figma Body/$tp-body-01: Roboto 16px/24px regular)
          'font-[family-name:var(--scanner-font-sans)]',
          'text-[length:var(--scanner-text-md)] leading-[var(--scanner-leading-md)]',
          'font-[number:var(--scanner-font-regular)]',
          // Text color
          'text-[color:var(--scanner-text-inverse)]',
          // Word-break for long strings
          '[word-break:break-word]',
          // Arrow pseudo-element
          "after:content-['']",
          arrowClasses[position],
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

TooltipContainer.displayName = 'TooltipContainer';
