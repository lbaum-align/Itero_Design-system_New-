export type StatusType = 'online' | 'offline' | 'away' | 'busy';
export type StatusSize = 'small' | 'medium' | 'large';

export interface StatusProps {
  /** Current status to display */
  status?: StatusType;
  /** Size of the status indicator dot */
  size?: StatusSize;
  /** Additional CSS class names */
  className?: string;
}
