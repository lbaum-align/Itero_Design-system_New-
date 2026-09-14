import type { ReactNode } from 'react';

export type TagGroupSize = 'large' | 'medium' | 'small' | 'extra-small';

export interface TagGroupProps {
  /** Tag elements to render in the group */
  children: ReactNode;
  /** Size variant — controls gap spacing between tags */
  size?: TagGroupSize;
  /** Additional CSS class names */
  className?: string;
}
