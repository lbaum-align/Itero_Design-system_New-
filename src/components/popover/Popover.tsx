import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { PopoverBubble } from './PopoverBubble';
import type { PopoverAlignment, PopoverPlacement, PopoverProps } from './popover.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Popover page (24156:42899), component set Popover (33048:29710).
 * Docs "Placement" / "Alignment" examples: the caret tip is 4px (spacing-01) from the trigger edge and points at
 * the trigger centre; Start/End put the container edge 26px before/after the trigger centre.
 * Docs "States": hidden by default, visible when triggered by click, hover or focus.
 * Positioning mirrors `Tooltip` (absolute, relative to an inline wrapper).
 */

/** Main axis: which side, with the 4px gap as padding so a hovering pointer can cross it. */
const placementClasses: Record<PopoverPlacement, string> = {
  bottom: 'top-full pt-[var(--scanner-spacing-2)]',
  top: 'bottom-full pb-[var(--scanner-spacing-2)]',
  right: 'left-full pl-[var(--scanner-spacing-2)]',
  left: 'right-full pr-[var(--scanner-spacing-2)]',
};

/** Cross axis for Top/Bottom. */
const verticalAlignment: Record<PopoverAlignment, string> = {
  start: 'left-[calc(50%_-_var(--scanner-popover-anchor-offset))]',
  middle: 'left-1/2 -translate-x-1/2',
  end: 'right-[calc(50%_-_var(--scanner-popover-anchor-offset))]',
};

/** Cross axis for Left/Right. */
const horizontalAlignment: Record<PopoverAlignment, string> = {
  start: 'top-[calc(50%_-_var(--scanner-popover-anchor-offset))]',
  middle: 'top-1/2 -translate-y-1/2',
  end: 'bottom-[calc(50%_-_var(--scanner-popover-anchor-offset))]',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

type CloseReason = 'trigger' | 'escape' | 'outside' | 'focusout' | 'hover';

interface TriggerProps {
  'aria-haspopup'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'data-popover-trigger'?: string;
}

/**
 * Popover — floating container with richer, interactive content anchored to a trigger
 * (quick editing, section filters). Non-modal `role="dialog"`.
 *
 * Figma props → React: Placement → `placement`, Alignment → `alignment`, Show carret → `showCaret`,
 * Slot content → `content`.
 *
 * Keyboard: Enter/Space on the trigger opens it and moves focus to the first focusable element in the popover
 * (or the popover itself); Escape closes and returns focus to the trigger; Tab past the content closes it.
 *
 * @example
 * <Popover content={<FiltersForm />} placement="bottom" alignment="start" label="Filters">
 *   <Button iconName="filter" iconOnly aria-label="Filters" />
 * </Popover>
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      content,
      placement = 'bottom',
      alignment = 'start',
      showCaret = true,
      open,
      defaultOpen = false,
      onOpenChange,
      triggerMode = 'click',
      label,
      labelledBy,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      popoverClassName,
      containerClassName,
      className,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const popoverId = useId();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const visible = isControlled ? open : internalOpen;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const visibleRef = useRef(visible);
    const closeReasonRef = useRef<CloseReason | null>(null);
    const focusInsideRef = useRef(false);

    const setRefs = (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const getTrigger = () =>
      wrapperRef.current?.querySelector<HTMLElement>(':scope > [data-popover-trigger]') ?? null;

    const setOpen = useCallback(
      (next: boolean, reason?: CloseReason) => {
        if (next === visibleRef.current) return;
        closeReasonRef.current = next ? null : (reason ?? null);
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    /* ---- Focus management on open / close ---- */
    useLayoutEffect(() => {
      const wasVisible = visibleRef.current;
      visibleRef.current = visible;
      if (visible === wasVisible) return;

      if (visible) {
        if (triggerMode !== 'click') return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        const first = dialog.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? dialog).focus({ preventScroll: true });
        return;
      }

      const reason = closeReasonRef.current;
      closeReasonRef.current = null;
      /* Escape / trigger always return focus; a programmatic close (e.g. a "Done" button in the content)
         returns it only if focus was inside. Outside clicks and Tab-away leave focus where the user put it. */
      const shouldRestore =
        reason === 'escape' || reason === 'trigger' || (reason === null && focusInsideRef.current);
      focusInsideRef.current = false;
      if (shouldRestore) getTrigger()?.focus({ preventScroll: true });
    }, [visible, triggerMode]);

    /* ---- Escape + outside click ---- */
    useEffect(() => {
      if (!visible) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) setOpen(false, 'escape');
      };
      const onPointerDown = (e: PointerEvent) => {
        if (!closeOnOutsideClick) return;
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
          setOpen(false, 'outside');
      };
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('pointerdown', onPointerDown);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('pointerdown', onPointerDown);
      };
    }, [visible, closeOnEscape, closeOnOutsideClick, setOpen]);

    /* ---- Hover mode ---- */
    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
      if (triggerMode === 'hover') setOpen(true);
    };
    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      if (triggerMode === 'hover') setOpen(false, 'hover');
    };

    /* ---- Focus tracking (both modes) ---- */
    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
      onFocus?.(e);
      if (dialogRef.current?.contains(e.target as Node)) focusInsideRef.current = true;
      if (triggerMode === 'hover' && e.target === getTrigger()) setOpen(true);
    };
    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
      onBlur?.(e);
      const next = e.relatedTarget as Node | null;
      if (!dialogRef.current?.contains(next)) focusInsideRef.current = false;
      /* Focus moved somewhere outside the trigger + popover (Tab away, click elsewhere) */
      if (
        next &&
        !e.currentTarget.contains(next) &&
        (closeOnOutsideClick || triggerMode === 'hover')
      ) {
        setOpen(false, 'focusout');
      } else if (!next && triggerMode === 'hover') setOpen(false, 'focusout');
    };

    /* ---- Trigger ---- */
    /* The trigger's own onClick runs first (it bubbles here), so it can call preventDefault() to keep it closed */
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || triggerMode !== 'click') return;
      if (getTrigger()?.contains(e.target as Node)) setOpen(!visible, 'trigger');
    };
    const trigger = isValidElement<TriggerProps>(children)
      ? cloneElement(children, {
          'aria-haspopup': 'dialog',
          'aria-expanded': visible,
          'aria-controls': popoverId,
          'data-popover-trigger': '',
        })
      : children;

    const isVertical = placement === 'top' || placement === 'bottom';

    return (
      <div
        ref={setRefs}
        className={cn('relative inline-flex', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        {...rest}
      >
        {trigger}

        <div
          ref={dialogRef}
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-label={label}
          aria-labelledby={labelledBy}
          tabIndex={-1}
          hidden={!visible}
          data-placement={placement}
          data-alignment={alignment}
          data-state={visible ? 'open' : 'closed'}
          className={cn(
            'absolute z-50 w-max outline-none',
            placementClasses[placement],
            isVertical ? verticalAlignment[alignment] : horizontalAlignment[alignment],
            popoverClassName,
          )}
        >
          <PopoverBubble
            placement={placement}
            alignment={alignment}
            showCaret={showCaret}
            containerClassName={containerClassName}
          >
            {content}
          </PopoverBubble>
        </div>
      </div>
    );
  },
);

Popover.displayName = 'Popover';
