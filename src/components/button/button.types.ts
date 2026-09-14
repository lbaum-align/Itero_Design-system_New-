import type { IconName } from '../../icons';

export type ButtonType = 'brand' | 'danger' | 'success';
export type ButtonEmphasis = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonContent = 'text-only' | 'text-icon' | 'icon-only';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual colour intent. */
  variant?: ButtonType;
  /** Visual emphasis level. */
  emphasis?: ButtonEmphasis;
  /** Size preset. */
  size?: ButtonSize;
  /** Leading icon (shown before text). Accepts an IconName string. */
  iconName?: IconName;
  /** Render icon-only (no text). Requires `iconName` and an `aria-label`. */
  iconOnly?: boolean;
  /** Show loading spinner in place of content. */
  loading?: boolean;
  /** Show skeleton placeholder. */
  skeleton?: boolean;
  /** HTML button type attribute (renamed from native `type` to avoid collision). */
  htmlType?: 'button' | 'submit' | 'reset';
}
