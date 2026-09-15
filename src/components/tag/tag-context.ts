import { createContext } from 'react';
import type { TagSize } from './tag.types';

/** Size provided by `TagGroup` so child tags inherit Figma's group size. */
export const TagSizeContext = createContext<TagSize | undefined>(undefined);
