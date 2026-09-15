import type { HTMLAttributes, ReactNode } from 'react';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Page heading — rendered as an `<h1>` (Figma "Title"). */
  title: ReactNode;

  /** Text below the title (Figma "Show subtitle" + "Subtitle"). Hidden when omitted. */
  subtitle?: ReactNode;

  /**
   * Breadcrumb trail above the title, typically `<Breadcrumbs />` (Figma "Show breadcrumbs").
   * With breadcrumbs the top padding is 24px and the vertical gap 32px; without, 48px and 24px.
   */
  breadcrumbs?: ReactNode;

  /**
   * Tab navigation below the title, typically `<TabGroup />` (Figma "Show tabs").
   * With tabs the bottom padding is 0 so the tabs sit on the dashed divider; without, 32px.
   */
  tabs?: ReactNode;

  /** Buttons to the right of the title, typically `<Button />`s (Figma "Show actions"). 8px gap. */
  actions?: ReactNode;
}
