import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { StatusProps, StatusType, StatusSize } from './status.types';

const statusColors: Record<StatusType, string> = {
  online: 'bg-[var(--scanner-status-success)]',
  offline: 'bg-[var(--scanner-text-tertiary)]',
  away: 'bg-[var(--scanner-status-warning)]',
  busy: 'bg-[var(--scanner-status-danger)]',
};

const sizeStyles: Record<StatusSize, string> = {
  small: 'size-2',
  medium: 'size-3',
  large: 'size-4',
};

/**
 * _Status — online/offline/away/busy indicator dot used on Avatar.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <Status status="online" size="medium" />
 * <Status status="busy" size="small" />
 */
export const Status = forwardRef<HTMLSpanElement, StatusProps>(
  ({ status = 'online', size = 'medium', className, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={status}
        className={cn(
          'inline-block shrink-0 rounded-[var(--scanner-radius-full)]',
          'border-2 border-solid border-[var(--scanner-bg-primary)]',
          statusColors[status],
          sizeStyles[size],
          className
        )}
        {...rest}
      />
    );
  }
);

Status.displayName = 'Status';
