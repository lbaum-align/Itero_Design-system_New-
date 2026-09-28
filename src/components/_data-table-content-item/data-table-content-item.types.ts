import type { ReactNode, TdHTMLAttributes } from 'react';
import type { IconName } from '../../icons';
import type { AvatarProps } from '../avatar/avatar.types';
import type { BadgeStatus } from '../badge/badge.types';

/**
 * Figma "Size" — the row height the cell fills and how many text lines it allows.
 * Large (1 line) = 52px, X-large (2 lines) = 72px, 2X-large (3 lines) = 92px.
 */
export type DataTableContentItemSize = 'large' | 'x-large' | '2x-large';

/** Figma "Content". */
export type DataTableContentType =
  | 'text'
  | 'text-subtext'
  | 'link'
  | 'badge'
  | 'progress'
  | 'buttons'
  | 'slot';

/** Icon-only action button in a `content="buttons"` cell (Figma "Button 01" / "Button 02"). */
export interface DataTableContentAction {
  /** Icon from the Scanner registry (Figma uses "Edit" and "More horizontal"). */
  iconName: IconName;
  /** Accessible name — required, the buttons have no visible label. */
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

/** Segmented progress indicator of a `content="progress"` cell (Figma "indicator" → 3 × "Patch"). */
export interface DataTableContentProgress {
  /** Number of completed segments. @default 0 */
  value?: number;
  /** Total number of segments (Figma draws 3). @default 3 */
  segments?: number;
  /** Accessible name of the indicator. @default 'Progress' */
  label?: string;
}

export interface DataTableContentItemProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableContentItemSize;
  /** What the cell renders (Figma "Content"). @default 'text' */
  content?: DataTableContentType;
  /** Primary text (Figma "Cell item text"). Also the link label and the badge label. */
  text?: ReactNode;
  /** Secondary text (Figma "Cell item subtext"). Only rendered above Large — Figma's Large variant is one line. */
  subtext?: ReactNode;
  /**
   * Leading avatar (Figma "Show avatar", only defined for Content=Text and Text + subtext).
   * 28px at Large, 36px at X-large / 2X-large.
   */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Figma "Show avatar" — set automatically when `avatar` is given. */
  showAvatar?: boolean;
  /** `content="link"` — href of the link. */
  href?: string;
  /** `content="link"` — Figma Link "External". */
  external?: boolean;
  /** `content="link"` — click handler for links without an href. */
  onLinkClick?: () => void;
  /** `content="badge"` — Figma Badge "Status". @default 'neutral' */
  badgeStatus?: BadgeStatus;
  /** `content="badge"` — leading icon inside the badge. */
  badgeIconName?: IconName;
  /** `content="progress"` — the segmented indicator. */
  progress?: DataTableContentProgress;
  /** `content="buttons"` — trailing icon-only actions, right aligned. */
  actions?: DataTableContentAction[];
  /**
   * `content="slot"` — custom cell content (Figma "Slot content" placeholder when omitted).
   * Also replaces the rendered content of `progress` / `buttons` when you need something custom.
   */
  children?: ReactNode;
  /** Force a visual state for screenshots / Storybook (forwarded to the link / buttons). */
  'data-state'?: 'hovered' | 'focused' | 'pressed';
}
