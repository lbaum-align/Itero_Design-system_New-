import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { cn } from '../../utils/cn';
import { Toast } from './Toast';
import { ToastContext } from './toast-context';
import type { ToastContextValue, ToastOptions, ToastPlacement, ToastProviderProps } from './toast.types';

/*
 * Toast queue — Figma "Notification" docs → Placement:
 * "Toasts usually appear at the right top of the screen and disappear after seven seconds.
 *  They stack with $spacing-03 in-between. New toasts are displayed at the top of the list,
 *  causing older notifications to move down until they are dismissed."
 * $spacing-03 resolves to 16px in the Scanner spacing mode.
 */

const placementClass: Record<ToastPlacement, string> = {
  'top-right': 'top-[var(--scanner-spacing-7)] right-[var(--scanner-spacing-7)] items-end',
  'top-left': 'top-[var(--scanner-spacing-7)] left-[var(--scanner-spacing-7)] items-start',
  'top-center': 'top-[var(--scanner-spacing-7)] left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-[var(--scanner-spacing-7)] right-[var(--scanner-spacing-7)] items-end',
  'bottom-left': 'bottom-[var(--scanner-spacing-7)] left-[var(--scanner-spacing-7)] items-start',
  'bottom-center': 'bottom-[var(--scanner-spacing-7)] left-1/2 -translate-x-1/2 items-center',
};

type QueuedToast = ToastOptions & { id: string; duration: number | null; stamp: number };

let toastCounter = 0;

/* ------------------------------------------------------------------ */
/*  One queued toast — owns its auto-dismiss timer                    */
/* ------------------------------------------------------------------ */

function QueuedToastItem({ toast, onDismiss }: { toast: QueuedToast; onDismiss: (id: string) => void }) {
  const { id, duration, stamp, onClose: _onClose, ...toastProps } = toast;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  /* Time left on the timer; survives pauses */
  const remaining = useRef(duration);

  /* Showing a toast again with the same id restarts its timer */
  useEffect(() => {
    remaining.current = duration;
  }, [duration, stamp]);

  useEffect(() => {
    if (paused || remaining.current == null) return undefined;
    const startedAt = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      if (remaining.current != null) {
        remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
      }
    };
  }, [paused, id, onDismiss, duration, stamp]);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  return (
    <Toast
      {...toastProps}
      type="toast"
      data-toast-id={id}
      data-paused={paused || undefined}
      className={cn('pointer-events-auto w-full', toastProps.className)}
      onClose={() => onDismiss(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

/**
 * ToastProvider — owns the toast queue and renders the toast stack. Use `useToast()` below it.
 *
 * - Newest toast on top, 16px apart; at most `limit` toasts (oldest dropped).
 * - Auto-dismiss after `duration` (7 s); toasts with an `action` stay until closed.
 *   Timers pause while a toast is hovered or has focus.
 * - Information/success toasts announce politely (`role="status"`), warning/error assertively (`role="alert"`).
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * const toast = useToast();
 * toast.show({ status: 'error', title: 'Upload failed', message: 'Please try again.' });
 */
export function ToastProvider({
  children,
  placement = 'top-right',
  duration = 7000,
  limit = 5,
  label = 'Notifications',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<QueuedToast[]>([]);
  /* Source of truth for the queue, only touched in event handlers; `toasts` mirrors it for rendering. */
  const queue = useRef<QueuedToast[]>([]);

  const commit = useCallback((next: QueuedToast[], removed: QueuedToast[]) => {
    queue.current = next;
    setToasts(next);
    removed.forEach((t) => t.onClose?.());
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      const removed = queue.current.filter((t) => t.id === id);
      if (removed.length) commit(queue.current.filter((t) => t.id !== id), removed);
    },
    [commit],
  );

  const dismissAll = useCallback(() => commit([], queue.current), [commit]);

  const show = useCallback(
    (options: ToastOptions) => {
      toastCounter += 1;
      const id = options.id ?? `scanner-toast-${toastCounter}`;
      const queued: QueuedToast = {
        ...options,
        id,
        stamp: toastCounter,
        duration: options.duration !== undefined ? options.duration : options.action ? null : duration,
      };
      /* Replacing an id keeps it silent; toasts pushed past `limit` count as removed */
      const all = [queued, ...queue.current.filter((t) => t.id !== id)];
      const max = Math.max(1, limit);
      commit(all.slice(0, max), all.slice(max));
      return id;
    },
    [commit, duration, limit],
  );

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss, dismissAll }), [show, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label={label}
        data-placement={placement}
        className={cn(
          'pointer-events-none fixed z-50 flex flex-col gap-[var(--scanner-spacing-5)]', // 16
          'w-[var(--scanner-toast-max-width)] max-w-[calc(100vw_-_2_*_var(--scanner-spacing-7))]',
          placementClass[placement],
        )}
      >
        {toasts.map((t) => (
          <QueuedToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
