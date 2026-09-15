import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { SpinnerPhase, SpinnerProps, SpinnerSize } from './spinner.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Spinner (node 25:1124)
 * 6 Sizes × On color (False/True) × Phase 1–4 = 48 designed frames (the set holds 56 with duplicates).
 *
 * Each size is a full-circle track (border-subtle) with an arc (border-strong) on top.
 * The arc starts at 9 o'clock and runs clockwise; Phases 1–4 rotate it in 90° steps.
 */

interface Geometry {
  /** Outer box (token) */
  box: string;
  /** Box size in px — SVG user units */
  size: number;
  /** Outer diameter of the ring (Figma ellipse size) */
  diameter: number;
  /** Stroke width (drawn inside the ellipse in Figma) */
  stroke: number;
  /** Arc length in degrees */
  arc: number;
}

const geometry: Record<SpinnerSize, Geometry> = {
  mini: { box: 'size-[var(--scanner-spinner-size-mini)]', size: 20, diameter: 17.5, stroke: 2, arc: 270 },
  small: { box: 'size-[var(--scanner-spinner-size-small)]', size: 24, diameter: 21.5, stroke: 2, arc: 270 },
  medium: { box: 'size-[var(--scanner-spinner-size-medium)]', size: 32, diameter: 29.5, stroke: 2, arc: 270 },
  large: { box: 'size-[var(--scanner-spinner-size-large)]', size: 48, diameter: 45.5, stroke: 2, arc: 270 },
  xl: { box: 'size-[var(--scanner-spinner-size-xl)]', size: 80, diameter: 77.5, stroke: 8, arc: 302.4 },
  '2xl': { box: 'size-[var(--scanner-spinner-size-2xl)]', size: 96, diameter: 96, stroke: 8, arc: 302.4 },
};

const phaseRotation: Record<SpinnerPhase, string> = {
  1: 'rotate-0',
  2: 'rotate-90',
  3: 'rotate-180',
  4: 'rotate-270',
};

/**
 * Scanner Spinner — indeterminate loading indicator for short waits.
 * Use a progress bar when progress can be measured.
 *
 * Figma props → React: Size → `size`, On color → `onColor`, Phase → `phase` (static frame; omit to animate).
 *
 * @example
 * <Spinner size="medium" />
 * <Spinner size="small" onColor />
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'medium', onColor = false, phase, className, 'aria-label': ariaLabel = 'Loading', ...rest }, ref) => {
    const g = geometry[size];
    const center = g.size / 2;
    const radius = g.diameter / 2 - g.stroke / 2;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        data-size={size}
        className={cn('inline-flex shrink-0 items-center justify-center', g.box, className)}
        {...rest}
      >
        <svg
          aria-hidden="true"
          className={cn('block size-full', phase ? phaseRotation[phase] : 'animate-spin')}
          viewBox={`0 0 ${g.size} ${g.size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track */}
          <circle
            data-part="track"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={g.stroke}
            className={
              onColor
                ? 'stroke-[color:var(--scanner-border-on-color-subtle)]'
                : 'stroke-[color:var(--scanner-border-subtle)]'
            }
          />
          {/* Arc — pathLength 360 lets the dash array be expressed in degrees */}
          <circle
            data-part="arc"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={g.stroke}
            pathLength={360}
            strokeDasharray={`${g.arc} 360`}
            transform={`rotate(180 ${center} ${center})`}
            className={
              onColor
                ? 'stroke-[color:var(--scanner-border-on-color-strong)]'
                : 'stroke-[color:var(--scanner-border-strong)]'
            }
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';
