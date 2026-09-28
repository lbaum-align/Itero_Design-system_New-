import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { NotificationTextContentProps } from './notification-text-content.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → .Notification text content (node 34305:10065)
 * Show title: True, False (2 variants). Used by Toast (34305:10008).
 *
 * Every Toast instance overrides the main component to Title 18/28 Medium (text-primary) +
 * Message 18/28 Regular (text-secondary) with a 16px gap — implemented here. The main
 * component itself still shows 20/32 text with an 18px gap (stale; see sign-off).
 * Show title=False: a single 18/28 Regular message in text-primary.
 */

/**
 * _NotificationTextContent — title + message block of a Toast / inline notification.
 * Private building block (not exported from the package barrel).
 *
 * @example
 * <NotificationTextContent title="Upload failed" message="Your file could not be uploaded." />
 * <NotificationTextContent showTitle={false} message="Changes saved." />
 */
export const NotificationTextContent = forwardRef<HTMLDivElement, NotificationTextContentProps>(
  ({ showTitle = true, title, message, titleId, messageId, className, ...rest }, ref) => {
    const hasTitle = showTitle && title != null && title !== false;

    return (
      <div
        ref={ref}
        data-show-title={hasTitle}
        className={cn(
          'flex min-w-0 flex-col items-start gap-[var(--scanner-spacing-5)]', // 16
          'break-words [word-break:break-word]',
          className,
        )}
        {...rest}
      >
        {hasTitle && (
          <p
            id={titleId}
            className="scanner-text-heading-02 m-0 w-full text-[color:var(--scanner-text-primary)]"
          >
            {title}
          </p>
        )}
        <p
          id={messageId}
          className={cn(
            'scanner-text-body-02 m-0 w-full',
            hasTitle ? 'text-[color:var(--scanner-text-secondary)]' : 'text-[color:var(--scanner-text-primary)]',
          )}
        >
          {message}
        </p>
      </div>
    );
  },
);

NotificationTextContent.displayName = 'NotificationTextContent';
