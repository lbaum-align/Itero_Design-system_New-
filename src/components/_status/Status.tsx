import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { StatusProps, StatusSize, StatusType } from './status.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Status (node 20920:33)
 * One variant: State=Online — a 16px ellipse filled with `Icons interactive/icon-success`.
 * No stroke: inside Avatar the separation ring is a cut-out in the avatar itself.
 */

const statusColors: Record<StatusType, string> = {
  online: 'bg-[var(--scanner-icon-success)]',
  /* Code extensions (not in Figma) */
  offline: 'bg-[var(--scanner-icon-tertiary)]',
  away: 'bg-[var(--scanner-icon-warning)]',
  busy: 'bg-[var(--scanner-icon-error)]',
};

const sizeStyles: Record<StatusSize, string> = {
  6: 'size-[var(--scanner-avatar-status-size-xs)]',
  8: 'size-[var(--scanner-avatar-status-size-sm)]',
  10: 'size-[var(--scanner-avatar-status-size-md)]',
  12: 'size-[var(--scanner-avatar-status-size-lg)]',
  16: 'size-[var(--scanner-avatar-status-size-xl)]',
  /* Legacy names */
  small: 'size-[var(--scanner-avatar-status-size-sm)]',
  medium: 'size-[var(--scanner-avatar-status-size-lg)]',
  large: 'size-[var(--scanner-avatar-status-size-xl)]',
};

/**
 * _Status — presence indicator dot used on Avatar.
 *
 * @private Not exported from the package barrel.
 *
 * @example
 * <Status status="online" />
 * <Status status="busy" size={8} />
 */
export const Status = forwardRef<HTMLSpanElement, StatusProps>(
  ({ status = 'online', size = 16, label, className, ...rest }, ref) => {
    const accessibleLabel = label === null ? undefined : (label ?? status);
    return (
      <span
        ref={ref}
        role={accessibleLabel ? 'img' : undefined}
        aria-label={accessibleLabel}
        aria-hidden={accessibleLabel ? undefined : true}
        data-status={status}
        className={cn(
          'inline-block shrink-0 rounded-[var(--scanner-radius-full)]',
          statusColors[status],
          sizeStyles[size],
          className,
        )}
        {...rest}
      />
    );
  },
);

Status.displayName = 'Status';
