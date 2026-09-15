import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/** Figma "Type". */
export type NotificationActionType = 'link' | 'button';

export interface NotificationActionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Action style (Figma "Type"): a primary medium `Link`, or two secondary large `Button`s.
   * @default 'link'
   */
  type?: NotificationActionType;

  /* ── Type=Link ── */

  /** Link label (Figma Link "Text value"). */
  linkText?: ReactNode;
  /** Link URL. Without it the link still is focusable and fires `onLinkClick`. */
  linkHref?: string;
  /** Click handler for the link. */
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Open the link in a new tab with the external icon (Link "External"). */
  linkExternal?: boolean;

  /* ── Type=Button ── */

  /** Label of the first button. */
  primaryButtonText?: ReactNode;
  /** Click handler for the first button. */
  onPrimaryButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /** Label of the second button. Pass `null` to render a single button. */
  secondaryButtonText?: ReactNode;
  /** Click handler for the second button. */
  onSecondaryButtonClick?: MouseEventHandler<HTMLButtonElement>;

  /** Custom action content — replaces the built-in link/buttons but keeps the action spacing. */
  children?: ReactNode;
}
