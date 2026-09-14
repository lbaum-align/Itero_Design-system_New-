import type { ReactNode } from 'react';

export type TagSize = 'large' | 'medium' | 'small' | 'extra-small';

export interface TagProps {
  /** Label content of the tag */
  children: ReactNode;
  /** Visual size variant */
  size?: TagSize;
  /** Disabled state — suppresses interaction and dims appearance */
  disabled?: boolean;
  /** Skeleton loading state — renders a fixed-dimension placeholder with no content */
  skeleton?: boolean;
  /** Called when the dismiss (×) button is activated */
  onDismiss?: () => void;
  /** Additional CSS class names */
  className?: string;
}
