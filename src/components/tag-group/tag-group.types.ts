import type { HTMLAttributes, ReactNode } from 'react';
import type { TagSize } from '../tag/tag.types';

/** Figma "Size": Large · Medium · Small · Extra small */
export type TagGroupSize = TagSize;

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** `Tag` elements. Tags without their own `size` inherit the group size. */
  children: ReactNode;
  /**
   * Figma "Size" — sets the gap (8px for Large/Medium/Small, 4px for Extra small)
   * and the default size of child tags.
   */
  size?: TagGroupSize;
}
