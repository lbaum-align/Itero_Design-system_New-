import type { StatusType } from '../_status/status.types';

/**
 * Avatar sizes — maps to Figma "01 Avatar" size variants.
 *
 * | Name        | px  | Figma size |
 * |-------------|-----|------------|
 * | extra-small | 28  | 28         |
 * | small       | 32  | 32         |
 * | medium      | 36  | 36         |
 * | large       | 40  | 40         |
 * | extra-large | 44  | 44         |
 * | 2xl         | 48  | 48         |
 * | 3xl         | 60  | 60         |
 * | 4xl         | 80  | 80         |
 */
export type AvatarSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | '2xl'
  | '3xl'
  | '4xl';

export interface AvatarProps {
  /** Image URL. When provided, renders a photo avatar. */
  src?: string;
  /** Accessible alt text for the avatar image (required for images). */
  alt: string;
  /** 1–2 letter initials fallback when `src` is absent. */
  initials?: string;
  /** Avatar size. Defaults to `'medium'`. */
  size?: AvatarSize;
  /** Online presence indicator, rendered as a _Status dot bottom-right. */
  status?: StatusType;
  /** Render a loading skeleton placeholder. */
  skeleton?: boolean;
  /** Additional CSS class names. */
  className?: string;
}
