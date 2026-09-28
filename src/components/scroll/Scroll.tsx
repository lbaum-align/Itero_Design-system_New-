import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { ScrollPosition, ScrollProps } from './scroll.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Scroll (node 34025:182957, page "Logos").
 * Position: Horizontal (108×4), Vertical (4×84) = 2 variants.
 *
 * Track: 4px thick, `border-subtle` (Figma: 4px inside stroke), min length 84px, radius full.
 * Thumb "Scroll": 52px long, `border-subtle` on top of the track, radius full.
 */

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Figma thumb/track proportions per position (52/84 vertical, 52/108 horizontal). */
const FIGMA_THUMB: Record<ScrollPosition, number> = { vertical: 52 / 84, horizontal: 52 / 108 };

const trackClass: Record<ScrollPosition, string> = {
  vertical: 'w-[var(--scanner-scroll-thickness)] h-full min-h-[var(--scanner-scroll-min-length)]',
  horizontal: 'h-[var(--scanner-scroll-thickness)] w-full min-w-[var(--scanner-scroll-min-length)]',
};

const thumbClass: Record<ScrollPosition, string> = {
  vertical: 'inset-x-0',
  horizontal: 'inset-y-0',
};

/**
 * Scroll — the Figma scroll bar indicator (track + thumb). Use it for custom scroll containers
 * (virtualised lists, canvases) where the native bar can't be used; for normal overflow use `ScrollArea`.
 *
 * @example
 * <Scroll position="vertical" thumbSize={0.4} value={0.25} controls="list" />
 */
export const Scroll = forwardRef<HTMLDivElement, ScrollProps>(
  ({ position = 'horizontal', thumbSize, value = 0, controls, className, style, ...rest }, ref) => {
    const size = clamp(thumbSize ?? FIGMA_THUMB[position]);
    const progress = clamp(value);
    const offset = `${progress * (1 - size) * 100}%`;
    const length = `${size * 100}%`;
    const vertical = position === 'vertical';

    return (
      <div
        ref={ref}
        data-position={position}
        role={controls ? 'scrollbar' : undefined}
        aria-controls={controls}
        aria-orientation={controls ? position : undefined}
        aria-valuenow={controls ? Math.round(progress * 100) : undefined}
        aria-valuemin={controls ? 0 : undefined}
        aria-valuemax={controls ? 100 : undefined}
        aria-hidden={controls ? undefined : true}
        className={cn(
          'relative shrink-0 overflow-clip rounded-[var(--scanner-radius-full)] bg-[var(--scanner-border-subtle)]',
          trackClass[position],
          className,
        )}
        style={style}
        {...rest}
      >
        <div
          data-thumb=""
          className={cn(
            'absolute rounded-[var(--scanner-radius-full)] bg-[var(--scanner-border-subtle)]',
            thumbClass[position],
          )}
          style={vertical ? { top: offset, height: length } : { left: offset, width: length }}
        />
      </div>
    );
  },
);

Scroll.displayName = 'Scroll';
