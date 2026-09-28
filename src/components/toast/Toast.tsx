import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import { NotificationAction } from '../_notification-action';
import { NotificationTextContent } from '../_notification-text-content';
import type { ToastProps, ToastStatus, ToastType } from './toast.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Toast (node 34305:10008)
 * Type (Toast, Inline) × Status (Information, Success, Warning, Error) = 8 variants,
 * plus "Show action" and "Closable".
 *
 * Layout (all variants): 20px padding, 20px gap, 16px radius
 *   [Content + icon: 28px status icon · 8px · (.Notification text content + .Notification action)] [28px close]
 * - Toast: background-elevated + shadow "Depth 01", 296–400px wide.
 * - Inline: background-highlight-{colour} + 1px inside stroke border-highlight-{colour}, 296px min, fills its container.
 */

const statusConfig: Record<
  ToastStatus,
  { icon: IconName; iconColor: string; label: string; inlineSurface: string }
> = {
  information: {
    icon: 'information',
    iconColor: 'text-[color:var(--scanner-icon-link)]',
    label: 'Information',
    inlineSurface:
      'bg-[var(--scanner-bg-highlight-blue)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-blue)]',
  },
  success: {
    icon: 'checkmark',
    iconColor: 'text-[color:var(--scanner-icon-success)]',
    label: 'Success',
    inlineSurface:
      'bg-[var(--scanner-bg-highlight-green)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-green)]',
  },
  warning: {
    icon: 'warning',
    iconColor: 'text-[color:var(--scanner-icon-warning)]',
    label: 'Warning',
    inlineSurface:
      'bg-[var(--scanner-bg-highlight-orange)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-orange)]',
  },
  error: {
    icon: 'error',
    iconColor: 'text-[color:var(--scanner-icon-error)]',
    label: 'Error',
    inlineSurface:
      'bg-[var(--scanner-bg-highlight-red)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-red)]',
  },
};

const typeSurface: Record<ToastType, string> = {
  toast: 'max-w-[var(--scanner-toast-max-width)] bg-[var(--scanner-bg-elevated)] shadow-[var(--scanner-shadow-depth-01)]',
  inline: 'w-full',
};

/** Figma status icon and close icon are 28×28 instances. */
const ICON_SIZE = 28;

/**
 * Scanner Toast — a brief, non-modal notification (Figma "Notification").
 * `type="toast"` floats (use `ToastProvider` + `useToast`); `type="inline"` sits in the page flow.
 *
 * Figma props → React: Type → `type`, Status → `status`, Show action → `showAction` + `action`,
 * Closable → `closable` + `onClose`; text content → `title` / `message` / `showTitle`.
 *
 * ARIA: `role="status"` (polite) for information/success, `role="alert"` (assertive) for warning/error.
 * Keyboard (Figma docs): Tab moves between the action(s) and the close icon; Enter/Space activate them.
 *
 * @example
 * <Toast status="success" title="Saved" message="Your profile has been updated." onClose={hide} />
 * <Toast type="inline" status="error" title="Upload failed" message="Please try again."
 *   action={{ type: 'link', linkText: 'Retry', onLinkClick: retry }} />
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      type = 'toast',
      status = 'information',
      title,
      message,
      showTitle = true,
      showAction = true,
      action,
      closable = true,
      onClose,
      closeLabel = 'Close notification',
      statusLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const cfg = statusConfig[status];
    const isAlert = status === 'warning' || status === 'error';

    return (
      <div
        ref={ref}
        role={isAlert ? 'alert' : 'status'}
        aria-live={isAlert ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-type={type}
        data-status={status}
        className={cn(
          'flex items-start gap-[var(--scanner-spacing-6)] p-[var(--scanner-spacing-6)]', // 20 / 20
          'min-w-[var(--scanner-toast-min-width)] rounded-[var(--scanner-radius-xl)]', // 16
          'box-border font-[family-name:var(--scanner-font-sans)]',
          type === 'inline' ? cfg.inlineSurface : '',
          typeSurface[type],
          className,
        )}
        {...rest}
      >
        {/* Content + icon */}
        <div className="flex min-w-0 flex-1 items-start gap-[var(--scanner-spacing-3)]">
          <Icon name={cfg.icon} size={ICON_SIZE} label={statusLabel ?? cfg.label} className={cfg.iconColor} />
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <NotificationTextContent showTitle={showTitle} title={title} message={message} className="w-full" />
            {showAction && action && <NotificationAction {...action} />}
          </div>
        </div>

        {closable && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className={cn(
              'inline-flex size-[var(--scanner-toast-icon-size)] shrink-0 cursor-pointer items-center justify-center',
              'rounded-[var(--scanner-radius-sm)] border-0 bg-transparent p-0 outline-none',
              'text-[color:var(--scanner-icon-secondary)] transition-[background-color] duration-150',
              'hover:bg-[var(--scanner-bg-hover)] active:bg-[var(--scanner-bg-active)]',
              'focus-visible:shadow-[0_0_0_var(--scanner-toast-close-focus-width)_var(--scanner-border-focus)]',
            )}
          >
            <Icon name="close-empty" size={ICON_SIZE} />
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';
