/**
 * @scanner/design-system
 * Scanner Design System — React component library
 *
 * Built from Figma file "06. Scanner core 1.0.0"
 */

// Utilities
export { cn } from './utils';

// Token types
export type {
  SpacingToken,
  RadiusToken,
  FontSizeToken,
  LineHeightToken,
  FontWeightToken,
  FontFamilyToken,
  BgColorToken,
  TextColorToken,
  BorderColorToken,
  IconColorToken,
  StatusToken,
  ShadowToken,
  TextStyle,
  PrimitiveColor,
} from './tokens/types';

// --- Components (Tier 1: Leaf atoms) ---

export { Spinner } from './components/spinner';
export type { SpinnerProps, SpinnerSize } from './components/spinner';

export { Toggle } from './components/toggle';
export type { ToggleProps } from './components/toggle';

export { Badge } from './components/badge';
export type { BadgeProps, BadgeStatus, BadgeLayout } from './components/badge';

export { Link } from './components/link';
export type { LinkProps, LinkType, LinkSize } from './components/link';

// --- Icons ---

export { Icon } from './icons';
export type { IconProps, IconName, IconSize } from './icons';

// --- Components (Tier 2: Simple atoms with icon deps) ---

export { Tag } from './components/tag';
export type { TagProps, TagSize } from './components/tag';

export { CheckboxItem } from './components/checkbox-item';
export type { CheckboxItemProps, CheckboxSelection } from './components/checkbox-item';

export { RadioButtonItem } from './components/radio-button-item';
export type { RadioButtonItemProps } from './components/radio-button-item';
