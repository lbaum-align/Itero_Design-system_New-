import type { IconName } from '../../icons';

/** Figma "Type" */
export type ButtonType = 'brand' | 'danger' | 'success';
/** Figma "Emphasis" */
export type ButtonEmphasis = 'primary' | 'secondary' | 'ghost';
/** Figma "Size" */
export type ButtonSize = 'large' | 'medium' | 'small';
/** Figma "Content" — derived from `iconName` + `iconOnly`. */
export type ButtonContent = 'text-only' | 'text-icon' | 'icon-only';
/**
 * Interactive states that can be forced via `data-state` (Storybook / visual tests).
 * Disabled, Loading and Skeleton are driven by their own props.
 */
export type ButtonForcedState = 'hovered' | 'focused' | 'pressed';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual colour intent (Figma "Type"). */
  variant?: ButtonType;
  /** Visual emphasis level (Figma "Emphasis"). */
  emphasis?: ButtonEmphasis;
  /** Size preset (Figma "Size"). */
  size?: ButtonSize;
  /** Leading icon. With `iconOnly` → Figma "Icon only"; otherwise "Text + icon". */
  iconName?: IconName;
  /** Render icon-only (no text). Requires `iconName` and an `aria-label`. */
  iconOnly?: boolean;
  /** Loading state — spinner replaces content, clicks are ignored, focus is kept. */
  loading?: boolean;
  /** Skeleton placeholder state. */
  skeleton?: boolean;
  /** HTML button type attribute (renamed from native `type` to avoid collision). */
  htmlType?: 'button' | 'submit' | 'reset';
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: ButtonForcedState;
}
