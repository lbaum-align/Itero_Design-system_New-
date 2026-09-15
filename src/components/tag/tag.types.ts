import type { HTMLAttributes, ReactNode } from 'react';

/** Figma "Size": Large · Medium · Small · Extra small */
export type TagSize = 'large' | 'medium' | 'small' | 'extra-small';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma "Text" — label content of the tag. Long labels truncate with an ellipsis + tooltip. */
  children: ReactNode;
  /**
   * Figma "Size". Defaults to the enclosing `TagGroup` size, otherwise `medium`
   * (Figma docs: "Medium — default size when placed outside input fields").
   */
  size?: TagSize;
  /** Figma State=Disabled — dims the tag and disables the close icon */
  disabled?: boolean;
  /** Figma State=Skeleton — fixed-size loading placeholder with no content */
  skeleton?: boolean;
  /** Called when the close icon is activated (click, Enter or Space). The close icon renders only when set. */
  onDismiss?: () => void;
  /** Accessible name of the close icon button (default: `Remove <label>`) */
  dismissLabel?: string;
  /** Force a visual state for Storybook/screenshots: `focused` shows the close-icon focus ring */
  'data-state'?: 'focused';
}
