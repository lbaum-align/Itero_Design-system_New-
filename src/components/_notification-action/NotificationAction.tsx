import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Link } from '../link';
import { Button } from '../button';
import type { NotificationActionProps } from './notification-action.types';

/**
 * _NotificationAction — the action area of a notification / toast.
 *
 * Renders either a single Link or up to two secondary Buttons,
 * matching the Figma ".Notification action" component set.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <NotificationAction type="link" linkText="View details" linkHref="/details" />
 * <NotificationAction
 *   type="button"
 *   primaryButtonText="Confirm"
 *   secondaryButtonText="Dismiss"
 * />
 */
export const NotificationAction = forwardRef<HTMLDivElement, NotificationActionProps>(
  (
    {
      type = 'link',
      linkText = 'Link',
      linkHref,
      onLinkClick,
      primaryButtonText = 'Button text',
      onPrimaryButtonClick,
      secondaryButtonText = 'Button text',
      onSecondaryButtonClick,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    /* ── Custom children override ── */
    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-start pt-[var(--scanner-spacing-5)]',
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      );
    }

    /* ── Link variant ── */
    if (type === 'link') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-stretch',
            'pt-[var(--scanner-spacing-5)]',
            className,
          )}
          {...rest}
        >
          <Link
            href={linkHref}
            size="medium"
            type="primary"
            onClick={onLinkClick}
          >
            {linkText}
          </Link>
        </div>
      );
    }

    /* ── Button variant ── */
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-start content-start',
          'gap-[var(--scanner-spacing-3)]',
          'pt-[var(--scanner-spacing-5)]',
          className,
        )}
        {...rest}
      >
        <Button
          emphasis="secondary"
          size="large"
          onClick={onPrimaryButtonClick}
        >
          {primaryButtonText}
        </Button>
        <Button
          emphasis="secondary"
          size="large"
          onClick={onSecondaryButtonClick}
        >
          {secondaryButtonText}
        </Button>
      </div>
    );
  },
);

NotificationAction.displayName = 'NotificationAction';
