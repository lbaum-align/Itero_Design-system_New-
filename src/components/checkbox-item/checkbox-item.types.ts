export type CheckboxSelection = 'unselected' | 'selected' | 'indeterminate';

export interface CheckboxItemProps {
  /** The checked/selection state. Boolean true maps to 'selected', false maps to 'unselected'. */
  checked?: CheckboxSelection | boolean;
  /** Visible label text */
  label?: string;
  /** Show or hide the label */
  showLabel?: boolean;
  /** Disables the checkbox */
  disabled?: boolean;
  /** Shows skeleton loading state */
  skeleton?: boolean;
  /** Controlled change handler */
  onChange?: (checked: boolean) => void;
  /** Name for form submission */
  name?: string;
  /** Value for form submission */
  value?: string;
  /** Additional CSS class names */
  className?: string;
  /** Accessible label (used when label is hidden or absent) */
  'aria-label'?: string;
}
