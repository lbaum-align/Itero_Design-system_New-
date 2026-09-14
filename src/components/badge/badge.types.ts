import type { ReactNode } from 'react';

export type BadgeStatus = 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
export type BadgeLayout = 'default' | 'on-image';

export interface BadgeProps {
  /** Text content of the badge */
  children: ReactNode;
  /** Semantic status color */
  status?: BadgeStatus;
  /** Layout variant */
  layout?: BadgeLayout;
  /** Show a leading icon */
  icon?: ReactNode;
  /** Show skeleton loading state */
  loading?: boolean;
  /** Additional CSS class names */
  className?: string;
}
