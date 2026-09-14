import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../avatar';
import type { AvatarSize } from '../avatar/avatar.types';
import type { AvatarGroupProps } from './avatar-group.types';

/* ------------------------------------------------------------------ */
/*  Per-size configuration — values from Figma "02 Avatars group"     */
/* ------------------------------------------------------------------ */

type GroupSizeConfig = {
  /** CSS dimension class for the avatar wrapper and overflow indicator */
  dimension: string;
  /** Negative right margin to create the overlap between items */
  overlap: string;
  /** Font size class for the "+N" overflow text */
  overflowFontSize: string;
  /** Line height class for the "+N" overflow text */
  overflowLineHeight: string;
  /** Whether to add horizontal padding inside the overflow indicator */
  overflowPaddingX: boolean;
};

const groupSizeConfig: Record<AvatarSize, GroupSizeConfig> = {
  /* --- Figma-defined sizes --- */
  'extra-small': {
    dimension: 'size-[28px]',
    overlap: 'mr-[-12px]',
    overflowFontSize: 'text-[length:var(--scanner-text-xs)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-xs)]',
    overflowPaddingX: false,
  },
  small: {
    dimension: 'size-[32px]',
    overlap: 'mr-[-16px]',
    overflowFontSize: 'text-[length:var(--scanner-text-xs)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-xs)]',
    overflowPaddingX: true,
  },
  medium: {
    dimension: 'size-[36px]',
    overlap: 'mr-[-16px]',
    overflowFontSize: 'text-[length:var(--scanner-text-xs)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-xs)]',
    overflowPaddingX: true,
  },
  large: {
    dimension: 'size-[40px]',
    overlap: 'mr-[-16px]',
    overflowFontSize: 'text-[length:var(--scanner-text-sm)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-sm)]',
    overflowPaddingX: true,
  },
  'extra-large': {
    dimension: 'size-[44px]',
    overlap: 'mr-[-20px]',
    overflowFontSize: 'text-[length:var(--scanner-text-sm)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-sm)]',
    overflowPaddingX: true,
  },
  '2xl': {
    dimension: 'size-[48px]',
    overlap: 'mr-[-24px]',
    overflowFontSize: 'text-[length:var(--scanner-text-sm)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-sm)]',
    overflowPaddingX: true,
  },
  /* --- Extrapolated sizes (not explicitly in Figma) --- */
  '3xl': {
    dimension: 'size-[60px]',
    overlap: 'mr-[-28px]',
    overflowFontSize: 'text-[length:var(--scanner-text-sm)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-sm)]',
    overflowPaddingX: true,
  },
  '4xl': {
    dimension: 'size-[80px]',
    overlap: 'mr-[-36px]',
    overflowFontSize: 'text-[length:var(--scanner-text-md)]',
    overflowLineHeight: 'leading-[var(--scanner-leading-md)]',
    overflowPaddingX: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * AvatarGroup — horizontally stacked, overlapping avatars with an
 * optional "+N" overflow indicator.
 *
 * Renders up to `max` avatars from the `avatars` array. When there
 * are more items than `max`, the excess is collapsed into a dark
 * count badge at the end of the row.
 *
 * @example
 * <AvatarGroup
 *   size="large"
 *   max={3}
 *   avatars={[
 *     { src: '/a.jpg', alt: 'Alice' },
 *     { src: '/b.jpg', alt: 'Bob' },
 *     { src: '/c.jpg', alt: 'Carol' },
 *     { src: '/d.jpg', alt: 'Dave' },
 *     { src: '/e.jpg', alt: 'Eve' },
 *   ]}
 * />
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = 'medium', className, ...rest }, ref) => {
    const cfg = groupSizeConfig[size];

    const visibleAvatars = avatars.slice(0, max);
    const overflowCount = avatars.length - max;
    const hasOverflow = overflowCount > 0;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Group of ${avatars.length} avatars`}
        className={cn('inline-flex items-center', className)}
        {...rest}
      >
        {visibleAvatars.map((item, index) => (
          <div
            key={index}
            className={cn(
              /* White border ring around each avatar for visual separation */
              'flex shrink-0 items-center rounded-[var(--scanner-radius-full)]',
              'border border-[var(--scanner-border-inverse)]',
              /* Negative margin pulls the next item leftward to overlap */
              (hasOverflow || index < visibleAvatars.length - 1) &&
                cfg.overlap,
            )}
          >
            <Avatar
              src={item.src}
              alt={item.alt}
              initials={item.initials}
              size={size}
            />
          </div>
        ))}

        {/* "+N" overflow indicator */}
        {hasOverflow && (
          <div
            aria-label={`${overflowCount} more`}
            className={cn(
              'flex shrink-0 items-center justify-center',
              'rounded-[var(--scanner-radius-full)]',
              'border border-[var(--scanner-border-inverse)]',
              'bg-[var(--scanner-bg-inverse)]',
              cfg.dimension,
              cfg.overflowPaddingX && 'px-[var(--scanner-spacing-2)]',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'min-w-px flex-1 select-none truncate text-center',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                'text-[color:var(--scanner-text-inverse)]',
                cfg.overflowFontSize,
                cfg.overflowLineHeight,
              )}
            >
              +{overflowCount}
            </span>
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';
