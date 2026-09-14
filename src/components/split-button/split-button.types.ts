import type { ButtonType, ButtonEmphasis, ButtonSize } from '../button';

export interface SplitButtonProps {
  /** Main button text content. */
  children: React.ReactNode;
  /** Visual colour intent. */
  variant?: ButtonType;
  /** Visual emphasis level. */
  emphasis?: ButtonEmphasis;
  /** Size preset. */
  size?: ButtonSize;
  /** Whether the dropdown is currently open (flips chevron). */
  opened?: boolean;
  /** Click handler for the main action button. */
  onMainClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the dropdown trigger. */
  onDropdownClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disables both buttons. */
  disabled?: boolean;
  /** Show loading state on the main button. */
  loading?: boolean;
  /** Show skeleton placeholder. */
  skeleton?: boolean;
  /** Additional CSS class names for the wrapper. */
  className?: string;
}
