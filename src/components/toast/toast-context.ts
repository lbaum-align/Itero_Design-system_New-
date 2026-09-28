import { createContext } from 'react';
import type { ToastContextValue } from './toast.types';

/** Toast queue context — provided by `ToastProvider`, consumed by `useToast`. */
export const ToastContext = createContext<ToastContextValue | null>(null);
