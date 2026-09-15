import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Link } from '../link';
import { Button } from '../button';
import type { NotificationActionProps } from './notification-action.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → .Notification action (node 34305:10071)
 * Type: Link, Button (2 variants). Used by Toast (34305:10008) below ".Notification text content".
 *
 * - Type=Link: 16px top padding, one Link (Type=Primary, Size=Medium), hugging its content.
 * - Type=Button: 16px top padding, two Buttons (Brand / Secondary / Large / Text only), 8px gap, wrapping.
 */

/**
 * _NotificationAction — the action area of a Toast / inline notification.
 * Private building block (not exported from the package barrel).
 *
 * Keyboard (Figma docs): Tab moves between the action(s) and the close icon; Enter/Space trigger the action.
 *
 * @example
 * <NotificationAction type="link" linkText="View details" linkHref="/details" />
 * <NotificationAction type="button" primaryButtonText="Retry" secondaryButtonText="Dismiss" />
 */
export const NotificationAction = forwardRef<HTMLDivElement, NotificationActionProps>(
  (
    {
      type = 'link',
      linkText = 'Link',
      linkHref,
      onLinkClick,
      linkExternal = false,
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
    const isButton = type === 'button';

    return (
      <div
        ref={ref}
        data-type={type}
        className={cn(
          'flex items-start pt-[var(--scanner-spacing-5)]',
          isButton && 'flex-wrap content-start gap-[var(--scanner-spacing-3)]',
          className,
        )}
        {...rest}
      >
        {children ??
          (isButton ? (
            <>
              <Button emphasis="secondary" size="large" onClick={onPrimaryButtonClick}>
                {primaryButtonText}
              </Button>
              {secondaryButtonText != null && (
                <Button emphasis="secondary" size="large" onClick={onSecondaryButtonClick}>
                  {secondaryButtonText}
                </Button>
              )}
            </>
          ) : (
            <Link type="primary" size="medium" href={linkHref} external={linkExternal} onClick={onLinkClick}>
              {linkText}
            </Link>
          ))}
      </div>
    );
  },
);

NotificationAction.displayName = 'NotificationAction';
