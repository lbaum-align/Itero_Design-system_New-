import { useContext } from 'react';
import { ToastContext } from './toast-context';
import type { ToastContextValue } from './toast.types';

/**
 * Access the toast queue of the nearest `ToastProvider`.
 *
 * @example
 * const toast = useToast();
 * toast.show({ status: 'success', title: 'Saved', message: 'Your profile has been updated.' });
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a <ToastProvider>.');
  return ctx;
}
