export interface RadioButtonItemProps {
  selected?: boolean;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  skeleton?: boolean;
  onChange?: (selected: boolean) => void;
  name?: string;
  value?: string;
  className?: string;
  'aria-label'?: string;
}
