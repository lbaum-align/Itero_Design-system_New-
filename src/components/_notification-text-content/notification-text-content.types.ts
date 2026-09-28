import type { HTMLAttributes, ReactNode } from 'react';

export interface NotificationTextContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Show the title line (Figma "Show title"). The title only renders when `title` is also set.
   * @default true
   */
  showTitle?: boolean;
  /** Title (Figma "Title text value"). */
  title?: ReactNode;
  /**
   * Message (Figma "Subtitle text value" when the title is shown, "Text value" when it is hidden).
   * Secondary text colour under a title; primary text colour on its own.
   */
  message: ReactNode;
  /** `id` for the title element (e.g. to label a surrounding region). */
  titleId?: string;
  /** `id` for the message element (e.g. for `aria-describedby`). */
  messageId?: string;
}
