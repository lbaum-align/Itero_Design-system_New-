import { createContext } from 'react';
import type { ToolbarOrientation } from './toolbar.types';

export interface ToolbarContextValue {
  orientation: ToolbarOrientation;
}

export const ToolbarContext = createContext<ToolbarContextValue>({ orientation: 'horizontal' });
