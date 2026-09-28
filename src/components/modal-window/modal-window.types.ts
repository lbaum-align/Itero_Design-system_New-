import type { HTMLAttributes, ReactNode, RefObject } from 'react';
import type { ButtonProps } from '../button';

/** Figma "Size". */
export type ModalWindowSize = 'small' | 'medium' | 'large' | 'x-large';

/** Why the modal asked to close. */
export type ModalWindowCloseReason = 'close-button' | 'escape' | 'overlay';

/** Extra props for an action button (label and click handler have their own props). */
export type ModalWindowActionProps = Omit<ButtonProps, 'children' | 'onClick'>;

export interface ModalWindowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClose'> {
  /** Controlled open state. Ignored when `inline`. @default false */
  open?: boolean;
  /**
   * Called when the user asks to close: close icon, Escape, or an overlay click (`closeOnOverlayClick`).
   * Update `open` in response. Action buttons don't close the modal on their own.
   */
  onClose?: (reason: ModalWindowCloseReason) => void;

  /** Figma "Size" — window width 432 / 656 / 880 / 1104px. @default 'medium' */
  size?: ModalWindowSize;
  /** Title (Figma "Title text"). Labels the dialog. Single line, truncated with an ellipsis. */
  title: ReactNode;
  /** Description (Figma "Description text value"). Describes the dialog. */
  description?: ReactNode;
  /** Figma "Show description". @default true */
  showDescription?: boolean;
  /** Slot content (Figma "Slot content" — "Swap me to any component"): forms, messages, media. */
  children?: ReactNode;
  /** Figma "Show slot content". @default true (renders `children` when provided) */
  showSlotContent?: boolean;

  /** Figma "Show actions". @default true */
  showActions?: boolean;
  /** Primary action label (brand primary Button, rightmost). @default 'Button text' */
  primaryActionText?: ReactNode;
  onPrimaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Extra Button props for the primary action, e.g. `{ variant: 'danger' }` or `{ loading: true }`. */
  primaryActionProps?: ModalWindowActionProps;
  /** Figma "Secondary action" — a second secondary Button left of the primary one. @default false */
  secondaryAction?: boolean;
  /** @default 'Button text' */
  secondaryActionText?: ReactNode;
  onSecondaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  secondaryActionProps?: ModalWindowActionProps;
  /** Figma "Tertiary action" — the leftmost secondary Button (typically "Cancel"). @default true */
  tertiaryAction?: boolean;
  /** @default 'Button text' */
  tertiaryActionText?: ReactNode;
  onTertiaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  tertiaryActionProps?: ModalWindowActionProps;
  /** Custom actions — replaces the built-in buttons but keeps the action bar layout. */
  actions?: ReactNode;

  /** Figma "Closable" — shows the close icon and lets Escape close the modal. @default true */
  closable?: boolean;
  /** Accessible name of the close icon button. @default 'Close' */
  closeLabel?: string;
  /** Also close on a click on the overlay (requires `closable`). @default false */
  closeOnOverlayClick?: boolean;
  /** Element to focus when the modal opens. Defaults to the first focusable element (the close icon when closable). */
  initialFocusRef?: RefObject<HTMLElement | null>;

  /**
   * Render only the window, in the page flow — no overlay, no focus trap, `open` ignored.
   * For documentation and visual tests.
   */
  inline?: boolean;
}
