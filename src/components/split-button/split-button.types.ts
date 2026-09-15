import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { ButtonType, ButtonEmphasis, ButtonSize } from '../button';

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Main action label (Figma "Button text"). */
  children: ReactNode;
  /**
   * Colour intent passed to both segments. Figma only defines Brand for the
   * split button; Danger/Success reuse the matching `Button` colours.
   */
  variant?: ButtonType;
  /** Visual emphasis (Figma "Emphasis"). */
  emphasis?: ButtonEmphasis;
  /** Size preset (Figma "Size"). */
  size?: ButtonSize;
  /** Dropdown open state (Figma "Opened") — chevron up + `aria-expanded`. */
  opened?: boolean;
  /** Click handler for the main action segment. */
  onMainClick?: MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the dropdown trigger segment. */
  onDropdownClick?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the dropdown trigger. Default "More options". */
  dropdownLabel?: string;
  /** Disables both segments (not a Figma variant — uses `Button` disabled styles). */
  disabled?: boolean;
  /** Loading state on the main segment; the trigger is disabled meanwhile. */
  loading?: boolean;
  /** Skeleton placeholder for both segments. */
  skeleton?: boolean;
}
