import type { ReactNode } from 'react';
import type { IconName } from '../../icons';

export type ToolbarOrientation = 'horizontal' | 'vertical';

/** Interactive states that can be forced for screenshots / Storybook. */
export type ToolbarForcedState = 'hovered' | 'focused' | 'pressed';

export interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  /** Layout direction. The collapse button sits at the start (left / top). */
  orientation?: ToolbarOrientation;
  /** Render the expand/collapse button and its divider at the start of the bar. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean;
  /** Called with the next collapsed value. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name of the collapse button while expanded. */
  collapseLabel?: string;
  /** Accessible name of the collapse button while collapsed. */
  expandLabel?: string;
  /** Background layer: 1 → layer-01 (white), 2 → layer-02. */
  layer?: 1 | 2;
  /** Toolbar buttons — use `ToolbarButton` and `ToolbarDivider`. */
  children?: ReactNode;
}

export interface ToolbarButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Icon from the registry. */
  iconName?: IconName;
  /** Custom icon node, used instead of `iconName`. */
  icon?: ReactNode;
  /** Accessible name — required, the button shows no text. */
  label: string;
  /** Toggle state; renders the selected background and sets `aria-pressed`. */
  selected?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: ToolbarForcedState;
}

export interface ToolbarDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Defaults to the toolbar's cross axis. */
  orientation?: ToolbarOrientation;
}
