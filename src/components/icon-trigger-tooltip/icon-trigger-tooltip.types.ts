import type { TooltipPosition } from '../_tooltip-container';
import type { IconName } from '../../icons';

export interface IconTriggerTooltipProps {
  /** Tooltip content — text string */
  content: string;
  /** Tooltip placement relative to the icon trigger */
  position?: TooltipPosition;
  /** Icon to display as the trigger (defaults to 'help') */
  iconName?: IconName;
  /** Additional CSS class names on the wrapper */
  className?: string;
}
