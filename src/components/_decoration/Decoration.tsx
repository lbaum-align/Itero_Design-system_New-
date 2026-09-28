import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import type { DecorationColor, DecorationProps } from './decoration.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Decoration (node 32583:26851, page "Logos").
 * Color: Gray, Red, Magenta, Purple, Blue, Green, Orange = 7 variants, + Icon (instance swap, default Gift 24×24).
 *
 * Fixed 44×44 tile, padding spacing-03 (12px), radius medium (8px), centred 24px icon.
 * Fill `background-highlight-<color>`; icon `icon-on-highlight-<color>` (Gray uses `icon-primary`).
 */

const tone: Record<DecorationColor, { bg: string; icon: string }> = {
  gray: {
    bg: 'bg-[var(--scanner-bg-highlight-gray)]',
    icon: 'text-[color:var(--scanner-icon-primary)]',
  },
  red: {
    bg: 'bg-[var(--scanner-bg-highlight-red)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-red)]',
  },
  magenta: {
    bg: 'bg-[var(--scanner-bg-highlight-magenta)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-magenta)]',
  },
  purple: {
    bg: 'bg-[var(--scanner-bg-highlight-purple)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-purple)]',
  },
  blue: {
    bg: 'bg-[var(--scanner-bg-highlight-blue)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-blue)]',
  },
  green: {
    bg: 'bg-[var(--scanner-bg-highlight-green)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-green)]',
  },
  orange: {
    bg: 'bg-[var(--scanner-bg-highlight-orange)]',
    icon: 'text-[color:var(--scanner-icon-on-highlight-orange)]',
  },
};

/** Figma icon instance: 24×24 ("Icon size / medium"). */
const ICON_SIZE = 24;

/**
 * _Decoration — private coloured icon tile used as a visual accent (e.g. in cards, empty states, menus).
 *
 * Figma props → React: Color → `color`, Icon → `icon`.
 *
 * @example
 * <Decoration color="blue" icon="calendar" />
 */
export const Decoration = forwardRef<HTMLSpanElement, DecorationProps>(
  ({ color = 'gray', icon = 'gift', label, className, ...rest }, ref) => {
    const t = tone[color];
    return (
      <span
        ref={ref}
        data-color={color}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-clip',
          'size-[var(--scanner-decoration-size)] p-[var(--scanner-spacing-4)] rounded-[var(--scanner-radius-md)]',
          t.bg,
          t.icon,
          className,
        )}
        {...rest}
      >
        {typeof icon === 'string' ? (
          <Icon name={icon as IconName} size={ICON_SIZE} className="shrink-0" />
        ) : (
          icon
        )}
      </span>
    );
  },
);

Decoration.displayName = 'Decoration';
