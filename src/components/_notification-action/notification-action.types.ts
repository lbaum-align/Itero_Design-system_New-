import type { ReactNode } from 'react';

export type NotificationActionType = 'link' | 'button';

export interface NotificationActionProps {
  /** Visual type — mirrors the Figma "Type" variant property. */
  type?: NotificationActionType;

  /* ── Link variant props ── */

  /** Text content for the link (when type='link'). */
  linkText?: string;
  /** Href for the link (when type='link'). */
  linkHref?: string;
  /** Click handler for the link. */
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;

  /* ── Button variant props ── */

  /** Text for the primary (first) button (when type='button'). */
  primaryButtonText?: string;
  /** Click handler for the primary button. */
  onPrimaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Text for the secondary (second) button (when type='button'). */
  secondaryButtonText?: string;
  /** Click handler for the secondary button. */
  onSecondaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;

  /** Override children for full custom rendering. */
  children?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}
