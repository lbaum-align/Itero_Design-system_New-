import type { HTMLAttributes } from 'react';
import type { AvatarProps, AvatarSize } from '../avatar/avatar.types';

/**
 * Data for a single avatar within the group.
 * Size is controlled by the group; status dots are not shown in a group (Figma).
 */
export type AvatarGroupItem = Pick<AvatarProps, 'src' | 'alt' | 'initials' | 'name' | 'variant'>;

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Avatar data items to render in the group. */
  avatars: AvatarGroupItem[];
  /**
   * Maximum number of visible avatars. When `avatars.length > max`, `max` avatars are
   * rendered followed by a "+N" counter (Figma shows 4 avatars + counter).
   * @default 4
   */
  max?: number;
  /**
   * Size applied to every avatar (Figma "Size": 28, 32, 36, 40, 44, 48, 52).
   * 60 / 80 (and their legacy names `3xl` / `4xl`) are supported with extrapolated overlap.
   * @default 36 ('medium')
   */
  size?: AvatarSize;
}
