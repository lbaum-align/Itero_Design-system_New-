export interface ToggleProps {
  /** Whether the toggle is checked/on */
  selected?: boolean;
  /** Controlled change handler */
  onChange?: (selected: boolean) => void;
  /** Disables the toggle */
  disabled?: boolean;
  /** Shows skeleton loading state */
  skeleton?: boolean;
  /** Accessible label */
  'aria-label'?: string;
  /** Additional CSS class names */
  className?: string;
  /** Name for form submission */
  name?: string;
}
