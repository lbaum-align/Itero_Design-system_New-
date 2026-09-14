export type NumberInputSize = 'small' | 'medium' | 'large' | 'x-large';

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
  > {
  /** Current numeric value (controlled). */
  value?: number;
  /** Initial numeric value (uncontrolled). */
  defaultValue?: number;
  /** Called when the value changes via typing or stepper buttons. */
  onChange?: (value: number) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Step amount for increment / decrement. */
  step?: number;
  /** Size variant. */
  size?: NumberInputSize;
  /** Layer set for background theming (1 = primary, 2 = secondary). */
  layer?: 1 | 2;
  /** Label text displayed above the input. */
  label?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Error message displayed below the input when `error` is true. */
  errorText?: string;
  /** Puts the component in error state. */
  error?: boolean;
  /** Renders a skeleton loading placeholder. */
  skeleton?: boolean;
  /** Show increment / decrement stepper buttons (defaults to true). */
  showControls?: boolean;
  /** Show an explainer tooltip icon next to the label. */
  showExplainer?: boolean;
  /** Text content for the explainer tooltip. */
  explainerText?: string;
  /** Additional CSS class names on the root wrapper. */
  className?: string;
}
