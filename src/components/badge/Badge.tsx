import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { BadgeProps, BadgeStatus } from './badge.types';

const statusStyles: Record<BadgeStatus, { bg: string; border: string; text: string }> = {
  neutral: {
    bg: 'bg-[var(--scanner-gray-alpha-5)]',
    border: 'border-[var(--scanner-gray-alpha-5)]',
    text: 'text-[var(--scanner-text-primary)]',
  },
  info: {
    bg: 'bg-[var(--scanner-bg-highlight-blue)]',
    border: 'border-[var(--scanner-blue-100)]',
    text: 'text-[var(--scanner-blue-900)]',
  },
  success: {
    bg: 'bg-[var(--scanner-bg-highlight-green)]',
    border: 'border-[var(--scanner-green-100)]',
    text: 'text-[var(--scanner-green-800)]',
  },
  warning: {
    bg: 'bg-[var(--scanner-bg-highlight-orange)]',
    border: 'border-[var(--scanner-orange-100)]',
    text: 'text-[var(--scanner-orange-900)]',
  },
  destructive: {
    bg: 'bg-[var(--scanner-bg-highlight-red)]',
    border: 'border-[var(--scanner-red-100)]',
    text: 'text-[var(--scanner-red-800)]',
  },
};

/**
 * Scanner Badge — a small label for status or categorization.
 *
 * @example
 * <Badge status="success">Active</Badge>
 * <Badge status="warning" icon={<WarningIcon />}>Pending</Badge>
 * <Badge layout="on-image">3 new</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, status = 'neutral', layout = 'default', icon, loading = false, className, ...rest }, ref) => {
    if (loading) {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-block h-8 w-[67px] animate-pulse rounded-[var(--scanner-radius-sm)]',
            'bg-[var(--scanner-gray-alpha-5)]',
            className
          )}
          aria-hidden="true"
          {...rest}
        />
      );
    }

    const isOnImage = layout === 'on-image';
    const styles = statusStyles[status];

    return (
      <span
        ref={ref}
        className={cn(
          // Base
          'inline-flex min-w-6 items-center justify-center gap-1 overflow-hidden',
          'rounded-[var(--scanner-radius-sm)] px-2 py-1',
          'font-[family-name:var(--scanner-font-sans)] text-sm font-normal leading-[var(--scanner-leading-sm)]',
          'border border-solid',
          // Status styling
          isOnImage
            ? 'border-transparent bg-[var(--scanner-bg-elevated)]'
            : [styles.bg, styles.border],
          // Text color: on-image uses interactive color; default uses highlight-on color
          isOnImage
            ? getOnImageTextColor(status)
            : styles.text,
          className
        )}
        {...rest}
      >
        {icon && (
          <span className="inline-flex shrink-0 size-5 items-center justify-center">
            {icon}
          </span>
        )}
        <span className="min-w-px text-center">{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';

function getOnImageTextColor(status: BadgeStatus): string {
  switch (status) {
    case 'info':
      return 'text-[var(--scanner-text-link)]';
    case 'success':
      return 'text-[var(--scanner-text-success)]';
    case 'warning':
      return 'text-[var(--scanner-text-warning)]';
    case 'destructive':
      return 'text-[var(--scanner-text-error)]';
    default:
      return 'text-[var(--scanner-text-primary)]';
  }
}
