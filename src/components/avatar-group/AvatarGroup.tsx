import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../avatar';
import { toPixelSize } from '../avatar/avatar.utils';
import type { AvatarPixelSize } from '../avatar/avatar.types';
import type { AvatarGroupProps } from './avatar-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Avatars group (node 24505:108025)
 * Size: 28, 32, 36, 40, 44, 48, 52 — horizontal auto-layout with a negative gap,
 * each avatar wrapped in a 1px `border-on-color-strong` stroke drawn outside
 * (box-shadow, so it doesn't change layout), ending in a "+N" counter.
 */

type GroupSizeConfig = {
  /** Negative gap between items */
  overlap: string;
  /** Counter bubble size + padding */
  box: string;
  /** Counter text style */
  counter: string;
};

const groupSizeConfig: Record<AvatarPixelSize, GroupSizeConfig> = {
  28: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-4)*-1)]', // -12
    box: 'size-[var(--scanner-avatar-size-28)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
  },
  32: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-5)*-1)]', // -16
    box: 'size-[var(--scanner-avatar-size-32)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
  },
  36: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-5)*-1)]', // -16
    box: 'size-[var(--scanner-avatar-size-36)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
  },
  40: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-5)*-1)]', // -16
    box: 'size-[var(--scanner-avatar-size-40)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  44: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-6)*-1)]', // -20
    box: 'size-[var(--scanner-avatar-size-44)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  48: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-7)*-1)]', // -24
    box: 'size-[var(--scanner-avatar-size-48)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  52: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-7)*-1)]', // -24
    box: 'size-[var(--scanner-avatar-size-52)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  /* Not in Figma "02 Avatars group" — extrapolated */
  60: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-7)*-1)]', // -24
    box: 'size-[var(--scanner-avatar-size-60)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  80: {
    overlap: '[&>*+*]:ml-[calc(var(--scanner-spacing-8)*-1)]', // -32
    box: 'size-[var(--scanner-avatar-size-80)] px-[var(--scanner-spacing-2)]',
    counter: 'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
  },
};

const ring = 'relative rounded-[var(--scanner-radius-full)] shadow-[0_0_0_var(--scanner-avatar-group-ring-width)_var(--scanner-border-on-color-strong)]';

/**
 * AvatarGroup — overlapping avatars with an optional "+N" overflow counter.
 *
 * @example
 * <AvatarGroup size={40} max={4} avatars={[{ src: '/a.jpg', alt: 'Alice' }, { name: 'Bob Stone', alt: 'Bob Stone' }]} />
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = 36, className, 'aria-label': ariaLabel, ...rest }, ref) => {
    const px = toPixelSize(size);
    const cfg = groupSizeConfig[px];

    const visibleCount = Math.max(0, Math.min(max, avatars.length));
    const visibleAvatars = avatars.slice(0, visibleCount);
    const overflowCount = avatars.length - visibleCount;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel ?? `Group of ${avatars.length} avatars`}
        data-size={px}
        className={cn('inline-flex items-center', cfg.overlap, className)}
        {...rest}
      >
        {visibleAvatars.map((item, index) => (
          <div
            key={`${item.alt}-${index}`}
            data-slot="avatar-group-item"
            /* Opaque backing (not in Figma) so translucent Initials/Icon avatars don't show the one beneath */
            className={cn('flex shrink-0 bg-[var(--scanner-bg-layer-01)]', ring)}
          >
            <Avatar {...item} size={px} />
          </div>
        ))}

        {overflowCount > 0 && (
          <div
            role="img"
            aria-label={`${overflowCount} more`}
            data-slot="avatar-group-overflow"
            className={cn(
              'flex shrink-0 items-center justify-center bg-[var(--scanner-bg-inverse)]',
              ring,
              cfg.box,
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'min-w-px flex-1 select-none truncate text-center',
                'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                'text-[color:var(--scanner-text-inverse)]',
                cfg.counter,
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
