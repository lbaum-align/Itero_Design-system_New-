import type { AvatarPixelSize, AvatarSize, AvatarSizeName } from './avatar.types';

const legacySizes: Record<AvatarSizeName, AvatarPixelSize> = {
  'extra-small': 28,
  small: 32,
  medium: 36,
  large: 40,
  'extra-large': 44,
  '2xl': 48,
  '3xl': 60,
  '4xl': 80,
};

/** Resolve a legacy size name to its Figma pixel size. */
export const toPixelSize = (size: AvatarSize): AvatarPixelSize =>
  typeof size === 'number' ? size : legacySizes[size];

/** "Jane Doe" → "JD", "jane" → "J" (Figma content guideline: first letter of up to two words). */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
