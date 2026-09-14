import type { InputHTMLAttributes, MouseEvent } from 'react';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text displayed above the input. Default: "Password" */
  label?: string;
  /** Whether to show the label. Default: true */
  showLabel?: boolean;
  /** Helper text shown below the input (hidden in error state). Default: "Optional helper text" */
  helperText?: string;
  /** Whether to show the helper text. Default: true */
  showHelper?: boolean;
  /** Error message text shown below the input when error is true. Default: "Error text message" */
  errorText?: string;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Whether to show the "Forgot password?" link. Default: true */
  showLink?: boolean;
  /** Text for the link. Default: "Forgot password?" */
  linkText?: string;
  /** URL for the link */
  linkHref?: string;
  /** Callback when the link is clicked */
  onLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Whether to show the explainer tooltip icon next to the label */
  showExplainer?: boolean;
  /** Content for the explainer tooltip */
  explainerContent?: string;
  /** Layer set for background variation (1 = white, 2 = gray). Default: 1 */
  layer?: 1 | 2;
  /** Whether to show as a skeleton loading state */
  skeleton?: boolean;
  /** Whether the password is currently visible (controlled mode) */
  passwordVisible?: boolean;
  /** Callback when password visibility is toggled */
  onPasswordVisibleChange?: (visible: boolean) => void;
  /** Additional class name */
  className?: string;
}
