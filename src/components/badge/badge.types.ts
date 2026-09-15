import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../../icons';

/** Figma "Status" (Figma spells Neutral as "Netral"). */
export type BadgeStatus = 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
/** Figma "Layout" — `on-image` is only for badges placed directly on top of an image. */
export type BadgeLayout = 'default' | 'on-image';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Label (Figma "Text value"). Single line — long text is truncated with an ellipsis. */
  children: ReactNode;
  /** Semantic status colour (Figma "Status"). */
  status?: BadgeStatus;
  /** Layout placement (Figma "Layout"). */
  layout?: BadgeLayout;
  /** Custom leading icon node (Figma "Icon" instance swap). Coloured via `currentColor`. */
  icon?: ReactNode;
  /** Leading icon from the Scanner icon registry (Figma "Icon" instance swap). */
  iconName?: IconName;
  /**
   * Show the leading icon (Figma "Show icon"). With no `icon`/`iconName` the Figma default
   * "Information" icon is used. Passing `icon` or `iconName` implies `showIcon`.
   */
  showIcon?: boolean;
  /** Skeleton placeholder while the page loads (Figma State=Loading). */
  loading?: boolean;
  /** Additional CSS class names */
  className?: string;
}
