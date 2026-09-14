import type { ReactNode } from 'react';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupSize = 'large' | 'medium' | 'small';

export interface ButtonGroupProps {
  /** Button elements to render in the group */
  children: ReactNode;
  /** Layout direction */
  orientation?: ButtonGroupOrientation;
  /** Size of the button group — controls gap spacing */
  size?: ButtonGroupSize;
  /** Additional CSS class names */
  className?: string;
}
