import type { HTMLAttributes } from 'react';

/**
 * Presence value. Figma `_Status` defines only **State=Online**; `offline`, `away` and `busy`
 * are code extensions (Avatar docs: "green for online, red for busy").
 */
export type StatusType = 'online' | 'offline' | 'away' | 'busy';

/** Dot diameter in px — the sizes Figma uses inside `01 Avatar` (6/8/10) plus extrapolated 12/16. */
export type StatusPixelSize = 6 | 8 | 10 | 12 | 16;

/**
 * Dot size. Numeric values are Figma pixel sizes (preferred).
 * Legacy names: `small` = 8px, `medium` = 12px, `large` = 16px.
 */
export type StatusSize = StatusPixelSize | 'small' | 'medium' | 'large';

export interface StatusProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Current status (Figma "State"). @default 'online' */
  status?: StatusType;
  /** Dot diameter. @default 16 (Figma `_Status` component size) */
  size?: StatusSize;
  /** Accessible label. Defaults to the status name; pass `null` to hide the dot from assistive tech. */
  label?: string | null;
}
