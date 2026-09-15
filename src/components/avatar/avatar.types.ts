import type { HTMLAttributes } from 'react';
import type { StatusType } from '../_status/status.types';

/** Figma "Size" values (px). 28 → 80 in base-4 steps; 80 is the maximum. */
export type AvatarPixelSize = 28 | 32 | 36 | 40 | 44 | 48 | 52 | 60 | 80;

/**
 * Legacy size names (kept for backwards compatibility).
 *
 * | Name        | px |
 * |-------------|----|
 * | extra-small | 28 |
 * | small       | 32 |
 * | medium      | 36 |
 * | large       | 40 |
 * | extra-large | 44 |
 * | 2xl         | 48 |
 * | 3xl         | 60 |
 * | 4xl         | 80 |
 *
 * Figma's 52px size has no name — use `size={52}`.
 */
export type AvatarSizeName =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | '2xl'
  | '3xl'
  | '4xl';

/** Avatar size — Figma pixel value (preferred) or a legacy name. */
export type AvatarSize = AvatarPixelSize | AvatarSizeName;

/** Figma "Variant". */
export type AvatarVariant = 'image' | 'initials' | 'icon';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image URL. When provided (and it loads), renders Figma Variant=Image. */
  src?: string;
  /** Accessible name for the avatar (the person or role it represents). */
  alt: string;
  /** Explicit initials (1–2 letters). Figma Variant=Initials. */
  initials?: string;
  /**
   * User name used to derive initials when `initials` is not given:
   * first letter of the first two words ("Jane Doe" → "JD", "Jane" → "J").
   */
  name?: string;
  /**
   * Force a Figma "Variant". By default it is derived:
   * `src` → image, `initials`/`name` → initials, otherwise icon.
   * A broken image falls back to initials (if available) or icon.
   */
  variant?: AvatarVariant;
  /** Size (Figma "Size"). @default 36 ('medium') */
  size?: AvatarSize;
  /** Presence dot bottom-right (Figma "Show status"; Figma defines Online only). */
  status?: StatusType;
  /** Shorthand for `status="online"` — mirrors Figma "Show status". */
  showStatus?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
}
