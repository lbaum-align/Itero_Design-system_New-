import type { AvatarSize } from '../avatar/avatar.types';

/**
 * Data for a single avatar within the group.
 * Mirrors the relevant subset of `AvatarProps` (size is controlled at
 * the group level, and status dots are omitted in grouped layout).
 */
export interface AvatarGroupItem {
  /** Image URL. When provided the avatar shows a photo. */
  src?: string;
  /** Accessible alt text (required). */
  alt: string;
  /** 1–2 letter initials fallback when `src` is absent. */
  initials?: string;
}

export interface AvatarGroupProps {
  /** Avatar data items to render in the group. */
  avatars: AvatarGroupItem[];
  /**
   * Maximum number of visible avatars before showing the "+N" overflow
   * indicator. When `avatars.length > max`, the component renders `max`
   * avatars and a count badge for the rest.
   *
   * @default 4
   */
  max?: number;
  /**
   * Size applied to every avatar in the group.
   * Maps 1-to-1 with `AvatarSize` from the Avatar component.
   *
   * Figma "02 Avatars group" defines variants for:
   * extra-small (28), small (32), medium (36), large (40),
   * extra-large (44), 2xl (48). Sizes 3xl and 4xl are supported
   * with extrapolated overlap values.
   *
   * @default 'medium'
   */
  size?: AvatarSize;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
}
