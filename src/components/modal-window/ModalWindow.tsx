import { forwardRef, useCallback, useId, useLayoutEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import type { ModalWindowProps, ModalWindowSize } from './modal-window.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Modal window (node 13483:13690)
 * Size: Small, Medium, Large, X-large (4 variants) × Show description / Show slot content /
 * Show actions / Secondary action / Tertiary action / Closable booleans + Title / Description text.
 *
 * Values are the ones Figma renders in the "Scanner" spacing mode set on the page:
 * - Overlay: background-overlay, 28px padding, window centred.
 * - Window: background-layer-01, 16px radius; Small 24px padding, other sizes 24px top / 28px sides + bottom.
 * - Header (title 20/32 Medium + 36px close icon) · 8px · description 18/28 (text-secondary)
 *   · 28px · slot content · 28px · actions (Large Buttons, 8px gap, right-aligned).
 */

const sizeConfig: Record<ModalWindowSize, { width: string; padding: string }> = {
  small: {
    width: 'w-[var(--scanner-modal-window-width-sm)]', // 432
    padding: 'p-[var(--scanner-spacing-7)]', // 24
  },
  medium: {
    width: 'w-[var(--scanner-modal-window-width-md)]', // 656
    padding: 'px-[var(--scanner-modal-window-spacing)] pt-[var(--scanner-spacing-7)] pb-[var(--scanner-modal-window-spacing)]', // 24 / 28
  },
  large: {
    width: 'w-[var(--scanner-modal-window-width-lg)]', // 880
    padding: 'px-[var(--scanner-modal-window-spacing)] pt-[var(--scanner-spacing-7)] pb-[var(--scanner-modal-window-spacing)]',
  },
  'x-large': {
    width: 'w-[var(--scanner-modal-window-width-xl)]', // 1104
    padding: 'px-[var(--scanner-modal-window-spacing)] pt-[var(--scanner-spacing-7)] pb-[var(--scanner-modal-window-spacing)]',
  },
};

/* ------------------------------------------------------------------ */
/*  Focus + scroll helpers                                            */
/* ------------------------------------------------------------------ */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden],[inert],[aria-hidden="true"]'),
  );
}

/* Body scroll lock, shared by nested modals */
let scrollLocks = 0;
let savedOverflow = '';

function lockScroll() {
  if (scrollLocks === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLocks += 1;
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = savedOverflow;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner ModalWindow — a modal dialog for critical decisions or short tasks.
 * Rendered in a native `<dialog>` (`showModal()`): the page behind is inert, the overlay dims it.
 *
 * Figma props → React: Size → `size`, Title text → `title`, Description text value → `description`,
 * Show description → `showDescription`, Show slot content → `showSlotContent` + `children`,
 * Show actions → `showActions`, Secondary action → `secondaryAction`, Tertiary action → `tertiaryAction`,
 * Closable → `closable`.
 *
 * Accessibility: `aria-modal`, labelled by the title, described by the description; focus moves into the
 * window on open (first focusable or `initialFocusRef`), Tab/Shift+Tab are trapped, Escape closes when
 * `closable`, focus returns to the opener on close, body scroll is locked.
 *
 * @example
 * <ModalWindow
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   size="small"
 *   title="Delete scan?"
 *   description="This can't be undone."
 *   tertiaryActionText="Cancel"
 *   onTertiaryAction={() => setOpen(false)}
 *   primaryActionText="Delete"
 *   primaryActionProps={{ variant: 'danger' }}
 *   onPrimaryAction={deleteScan}
 * />
 */
export const ModalWindow = forwardRef<HTMLDivElement, ModalWindowProps>(
  (
    {
      open = false,
      onClose,
      size = 'medium',
      title,
      description,
      showDescription = true,
      children,
      showSlotContent = true,
      showActions = true,
      primaryActionText = 'Button text',
      onPrimaryAction,
      primaryActionProps,
      secondaryAction = false,
      secondaryActionText = 'Button text',
      onSecondaryAction,
      secondaryActionProps,
      tertiaryAction = true,
      tertiaryActionText = 'Button text',
      onTertiaryAction,
      tertiaryActionProps,
      actions,
      closable = true,
      closeLabel = 'Close',
      closeOnOverlayClick = false,
      initialFocusRef,
      inline = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const descriptionId = `${baseId}-description`;

    const dialogRef = useRef<HTMLDialogElement>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const unmountingRef = useRef(false);
    const pointerDownOnOverlay = useRef(false);

    const setPanelRef = useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const active = open && !inline;
    const hasDescription = showDescription && description != null && description !== false;
    const hasSlot = showSlotContent && children != null && children !== false;
    const cfg = sizeConfig[size];

    /* ── Open: showModal, initial focus, scroll lock; close: restore focus ── */
    useLayoutEffect(() => {
      if (!active) return undefined;
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (!dialog || !panel) return undefined;

      unmountingRef.current = false;
      const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      }
      (initialFocusRef?.current ?? getFocusable(panel)[0] ?? panel).focus();
      lockScroll();

      return () => {
        unmountingRef.current = true;
        unlockScroll();
        if (dialog.open) {
          if (typeof dialog.close === 'function') dialog.close();
          else dialog.removeAttribute('open');
        }
        if (opener?.isConnected) opener.focus();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per open
    }, [active]);

    /* ── Keyboard: Escape + focus trap ── */
    const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
      const panel = panelRef.current;
      if (!panel) return;

      if (e.key === 'Escape') {
        if (e.defaultPrevented) return; // handled by a nested widget (menu, select…)
        e.preventDefault(); // also stops the native dialog "cancel"
        if (closable) onClose?.('escape');
        return;
      }

      if (e.key !== 'Tab') return;
      const items = getFocusable(panel);
      const current = document.activeElement;
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !panel.contains(current);
      if (e.shiftKey && (current === first || current === panel || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    /* Native cancel (Escape outside React's keydown) is always controlled by `open`. */
    const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault();
    };

    /* The browser closed the dialog on its own (e.g. repeated Escape) while `open` is still true. */
    const handleNativeClose = () => {
      if (unmountingRef.current || !open) return;
      if (closable) onClose?.('escape');
      else if (dialogRef.current && typeof dialogRef.current.showModal === 'function') dialogRef.current.showModal();
    };

    const handleOverlayMouseDown = (e: MouseEvent<HTMLDialogElement>) => {
      pointerDownOnOverlay.current = e.target === e.currentTarget;
    };

    const handleOverlayClick = (e: MouseEvent<HTMLDialogElement>) => {
      const onOverlay = e.target === e.currentTarget && pointerDownOnOverlay.current;
      pointerDownOnOverlay.current = false;
      if (onOverlay && closable && closeOnOverlayClick) onClose?.('overlay');
    };

    /* ── Window ── */
    const panel = (
      <div
        ref={setPanelRef}
        tabIndex={-1}
        data-size={size}
        {...(inline
          ? {
              role: 'dialog',
              'aria-labelledby': titleId,
              'aria-describedby': hasDescription ? descriptionId : undefined,
            }
          : {})}
        className={cn(
          'relative box-border flex max-h-full max-w-full flex-col items-end outline-none',
          'rounded-[var(--scanner-radius-xl)] bg-[var(--scanner-bg-layer-01)] text-left', // 16
          'font-[family-name:var(--scanner-font-sans)] text-[color:var(--scanner-text-primary)]',
          cfg.width,
          cfg.padding,
          className,
        )}
        {...rest}
      >
        {/* Header */}
        <div className="flex w-full shrink-0 items-center gap-[var(--scanner-spacing-6)]">
          <h2
            id={titleId}
            className={cn(
              'm-0 min-w-0 flex-1 truncate',
              'text-[length:var(--scanner-text-lg)] leading-[var(--scanner-leading-xl)] font-[number:var(--scanner-font-medium)]', // 20/32
              'text-[color:var(--scanner-text-primary)]',
            )}
          >
            {title}
          </h2>
          {closable && (
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => onClose?.('close-button')}
              className={cn(
                'inline-flex size-[var(--scanner-modal-window-close-size)] shrink-0 cursor-pointer items-center justify-center',
                'rounded-[var(--scanner-radius-md)] border-0 bg-transparent p-0 outline-none',
                'text-[color:var(--scanner-icon-secondary)] transition-[background-color] duration-150',
                'hover:bg-[var(--scanner-bg-hover)] active:bg-[var(--scanner-bg-active)]',
                'focus-visible:shadow-[inset_0_0_0_var(--scanner-modal-window-close-focus-width)_var(--scanner-border-focus)]',
              )}
            >
              <Icon name="close-empty" size={32} className="size-[var(--scanner-modal-window-close-size)]" />
            </button>
          )}
        </div>

        {/* Description + slot content (scrolls when the window hits the viewport height) */}
        {(hasDescription || hasSlot) && (
          <div
            className={cn(
              'flex min-h-0 w-full flex-col gap-[var(--scanner-modal-window-spacing)] overflow-y-auto',
              hasDescription ? 'mt-[var(--scanner-spacing-3)]' : 'mt-[var(--scanner-modal-window-spacing)]', // 8 / 28
            )}
          >
            {hasDescription && (
              <p
                id={descriptionId}
                className="scanner-text-body-02 m-0 break-words text-[color:var(--scanner-text-secondary)]"
              >
                {description}
              </p>
            )}
            {hasSlot && <div className="w-full min-w-0">{children}</div>}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <ButtonGroup
            size="medium"
            className="mt-[var(--scanner-modal-window-spacing)] shrink-0 flex-wrap justify-end"
          >
            {actions ?? [
              tertiaryAction && (
                <Button
                  key="tertiary"
                  emphasis="secondary"
                  size="large"
                  {...tertiaryActionProps}
                  onClick={onTertiaryAction}
                >
                  {tertiaryActionText}
                </Button>
              ),
              secondaryAction && (
                <Button
                  key="secondary"
                  emphasis="secondary"
                  size="large"
                  {...secondaryActionProps}
                  onClick={onSecondaryAction}
                >
                  {secondaryActionText}
                </Button>
              ),
              <Button key="primary" size="large" {...primaryActionProps} onClick={onPrimaryAction}>
                {primaryActionText}
              </Button>,
            ]}
          </ButtonGroup>
        )}
      </div>
    );

    if (inline) return panel;
    if (!open) return null;

    return (
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        data-scanner-modal-overlay=""
        onKeyDown={handleKeyDown}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onMouseDown={handleOverlayMouseDown}
        onClick={handleOverlayClick}
        className={cn(
          'fixed inset-0 m-0 box-border h-full max-h-none w-full max-w-none overflow-hidden border-0',
          'items-center justify-center open:flex',
          'bg-[var(--scanner-bg-overlay)] p-[var(--scanner-modal-window-spacing)]', // 28
          'backdrop:bg-transparent',
        )}
      >
        {panel}
      </dialog>
    );
  },
);

ModalWindow.displayName = 'ModalWindow';
