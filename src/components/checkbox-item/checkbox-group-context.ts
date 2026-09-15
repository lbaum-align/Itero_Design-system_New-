import { createContext } from 'react';

/** Shared by the checkbox groups so a disabled / skeleton group applies to every item. */
export const CheckboxGroupContext = createContext<{ disabled: boolean; skeleton?: boolean }>({
  disabled: false,
  skeleton: false,
});
