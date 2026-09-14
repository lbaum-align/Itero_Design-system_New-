import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { SpinnerProps, SpinnerSize } from './spinner.types';

const sizeMap: Record<SpinnerSize, { box: string; stroke: number; radius: number }> = {
  mini: { box: 'size-5', stroke: 2, radius: 8 },        // 20px
  small: { box: 'size-6', stroke: 2, radius: 10 },       // 24px
  medium: { box: 'size-8', stroke: 2.5, radius: 13 },    // 32px
  large: { box: 'size-12', stroke: 3, radius: 20 },      // 48px
  xl: { box: 'size-[80px]', stroke: 4, radius: 34 },     // 80px
  '2xl': { box: 'size-24', stroke: 4, radius: 42 },      // 96px
};

/**
 * Scanner Spinner — loading indicator.
 *
 * @example
 * <Spinner size="medium" />
 * <Spinner size="small" onColor />
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'medium', onColor = false, className, 'aria-label': ariaLabel = 'Loading', ...rest }, ref) => {
    const { box, stroke, radius } = sizeMap[size];
    const viewBox = radius * 2 + stroke;
    const center = viewBox / 2;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn('inline-flex items-center justify-center', box, className)}
        {...rest}
      >
        <svg
          className="animate-spin"
          viewBox={`0 0 ${viewBox} ${viewBox}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className={onColor ? 'text-white/20' : 'text-[var(--scanner-gray-alpha-10)]'}
          />
          {/* Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${radius * Math.PI * 0.75} ${radius * Math.PI * 1.25}`}
            className={onColor ? 'text-white' : 'text-[var(--scanner-icon-primary)]'}
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
