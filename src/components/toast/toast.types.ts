import type { HTMLAttributes, ReactNode } from 'react';
import type { NotificationActionProps } from '../_notification-action';

/** Figma "Type": floating `toast` or `inline` notification in the page flow. */
export type ToastType = 'toast' | 'inline';
/** Figma "Status". */
export type ToastStatus = 'information' | 'success' | 'warning' | 'error';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClose'> {
  /** Figma "Type". @default 'toast' */
  type?: ToastType;
  /** Figma "Status" — icon, colours and ARIA role (`status` for information/success, `alert` for warning/error). @default 'information' */
  status?: ToastStatus;
  /** Title (".Notification text content" → "Title text value"). */
  title?: ReactNode;
  /** Message (".Notification text content" → "Subtitle text value" / "Text value"). */
  message: ReactNode;
  /** Show the title line (".Notification text content" → "Show title"). @default true */
  showTitle?: boolean;
  /** Figma "Show action". The action renders when this is true and `action` is set. @default true */
  showAction?: boolean;
  /** Props for the ".Notification action" area (a Link, or up to two Buttons). */
  action?: NotificationActionProps;
  /** Figma "Closable" — shows the close icon button. @default true */
  closable?: boolean;
  /** Called when the close icon button is activated. */
  onClose?: () => void;
  /** Accessible name of the close button. @default 'Close notification' */
  closeLabel?: string;
  /** Accessible name of the status icon. Defaults to the status name ("Information", "Success", …). */
  statusLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Toast queue                                                       */
/* ------------------------------------------------------------------ */

/** Where the toast stack sits in the viewport (Figma docs: "usually … at the right top"). */
export type ToastPlacement = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface ToastOptions extends Omit<ToastProps, 'type' | 'onClose'> {
  /** Stable id — showing a toast with an existing id replaces it. Generated when omitted. */
  id?: string;
  /**
   * Auto-dismiss delay in ms; `null` keeps the toast until it is closed.
   * Defaults to the provider `duration` (7000 ms), or `null` when the toast has an `action`
   * (users need time to reach it). The timer pauses while the toast is hovered or focused.
   */
  duration?: number | null;
  /** Called after the toast is removed (close button, timeout or `dismiss`). */
  onClose?: () => void;
}

export interface ToastContextValue {
  /** Show a toast (newest on top). Returns its id. */
  show: (options: ToastOptions) => string;
  /** Remove one toast. */
  dismiss: (id: string) => void;
  /** Remove every toast. */
  dismissAll: () => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Stack position. @default 'top-right' */
  placement?: ToastPlacement;
  /** Default auto-dismiss delay in ms (Figma docs: seven seconds). @default 7000 */
  duration?: number;
  /** Maximum number of toasts kept on screen; the oldest are dropped. @default 5 */
  limit?: number;
  /** Accessible name of the toast region. @default 'Notifications' */
  label?: string;
}
