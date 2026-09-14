export type DateInputSize = 'large' | 'medium' | 'small';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Size preset. */
  size?: DateInputSize;
  /** Layer set for background variation. */
  layer?: 1 | 2;
  /** Whether the input is in an error state. */
  error?: boolean;
  /** Show skeleton loading placeholder. */
  skeleton?: boolean;
  /** Label text displayed above the input. */
  label?: string;
  /** Whether to show the label. */
  showLabel?: boolean;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Error message displayed below the input when `error` is true. */
  errorText?: string;
  /** Whether to show helper or error text below the input. */
  showHelper?: boolean;
  /** Show an explainer tooltip icon next to the label. */
  showExplainer?: boolean;
  /** Tooltip content for the explainer icon. */
  explainerText?: string;
}
