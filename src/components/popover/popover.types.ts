import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

/** Figma "Placement" — side of the trigger the popover appears on. */
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Figma "Alignment" — where the container sits along the trigger edge. The caret always points at the trigger centre:
 * - `start`: container starts 26px before the trigger centre
 * - `middle`: container centred on the trigger
 * - `end`: container ends 26px after the trigger centre
 */
export type PopoverAlignment = 'start' | 'middle' | 'end';

/** How the popover opens (Figma docs "Interactions": click, or hover / keyboard focus). */
export type PopoverTriggerMode = 'click' | 'hover';

/** Visual popover (Figma `Popover` component): container + caret, without trigger or behaviour. */
export interface PopoverBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Popover body (Figma "Slot content"). */
  children?: ReactNode;
  /** Figma "Placement". The caret sits on the side facing the trigger. @default 'bottom' */
  placement?: PopoverPlacement;
  /** Figma "Alignment". @default 'start' (Figma default) */
  alignment?: PopoverAlignment;
  /** Figma "Show carret". @default true */
  showCaret?: boolean;
  /** Class names for the container (the Figma "Tooltip" frame). */
  containerClassName?: string;
  /** Additional CSS class names on the outer element */
  className?: string;
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /**
   * Trigger element — must accept `onClick`, `aria-*` props and focus (e.g. `Button`).
   * It receives `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.
   */
  children: ReactElement;
  /** Popover body (Figma "Slot content"). */
  content: ReactNode;
  /** Figma "Placement". @default 'bottom' */
  placement?: PopoverPlacement;
  /** Figma "Alignment". @default 'start' */
  alignment?: PopoverAlignment;
  /** Figma "Show carret". @default true */
  showCaret?: boolean;
  /** Controlled visibility. When set, trigger / Escape / outside click only call `onOpenChange`. */
  open?: boolean;
  /** Initial visibility when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called whenever the popover requests to open or close. */
  onOpenChange?: (open: boolean) => void;
  /**
   * `click` (default): trigger click toggles; focus moves into the popover and returns to the trigger on Escape.
   * `hover`: opens on pointer hover or keyboard focus of the trigger, closes on leave / blur; focus stays on the trigger.
   */
  triggerMode?: PopoverTriggerMode;
  /** Accessible name of the dialog (use when the content has no visible heading). */
  label?: string;
  /** Id of the element naming the dialog (e.g. a heading inside `content`). */
  labelledBy?: string;
  /** Close when clicking outside. @default true */
  closeOnOutsideClick?: boolean;
  /** Close on Escape. @default true */
  closeOnEscape?: boolean;
  /** Class names for the floating dialog element. */
  popoverClassName?: string;
  /** Class names for the container (Figma "Tooltip" frame). */
  containerClassName?: string;
  /** Additional CSS class names on the wrapper (`relative inline-flex`). */
  className?: string;
}
