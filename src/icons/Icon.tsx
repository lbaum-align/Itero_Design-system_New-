import { forwardRef } from 'react';
import { cn } from '../utils';
import { iconRegistry } from './registry';
import type { IconProps } from './icon.types';

/**
 * Icon — renders an SVG icon from the Scanner icon registry.
 *
 * Icons use `currentColor` for fills, inheriting from parent text/icon color.
 * The `size` prop controls the rendered pixel dimensions.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 20, label, className, ...rest }, ref) => {
    const entry = iconRegistry[name];

    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Scanner] Icon "${name}" not found in registry.`);
      }
      return null;
    }

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={entry.viewBox}
        width={size}
        height={size}
        fill="none"
        className={cn('shrink-0', className)}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? 'img' : undefined}
        {...rest}
      >
        {entry.paths}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
