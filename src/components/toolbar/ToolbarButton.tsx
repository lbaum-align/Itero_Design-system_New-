import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { ToolbarButtonProps } from './toolbar.types';

/**
 * A single icon button inside a `Toolbar`: 60×60 with a 48px icon and an 8px radius.
 *
 * States use the same tokens as Button: hover / pressed layer backgrounds, a 2px
 * focus ring 4px outside the button, and disabled icon colour. `selected` renders
 * the selected layer background and sets `aria-pressed`.
 *
 * @example
 * <ToolbarButton iconName="edit" label="Edit" onClick={edit} />
 * <ToolbarButton iconName="filter" label="Filter" selected={filtering} />
 */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ iconName, icon, label, selected = false, disabled = false, className, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        'group relative inline-flex shrink-0 items-center justify-center',
        'size-[var(--scanner-toolbar-button-size)]',
        'rounded-[var(--scanner-radius-md)]',
        'outline-none transition-[background-color] duration-150',

        /* Surface */
        selected ? 'bg-[var(--scanner-bg-layer-selected)]' : 'bg-transparent',
        !disabled &&
          (selected
            ? cn(
                'hover:bg-[var(--scanner-bg-layer-selected-hover)] data-[state=hovered]:bg-[var(--scanner-bg-layer-selected-hover)]',
                'active:bg-[var(--scanner-bg-layer-selected-active)] data-[state=pressed]:bg-[var(--scanner-bg-layer-selected-active)]',
              )
            : cn(
                'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
                'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
              )),

        /* Icon colour */
        disabled
          ? 'text-[color:var(--scanner-icon-disabled)] cursor-not-allowed'
          : 'text-[color:var(--scanner-icon-primary)] cursor-pointer',

        className,
      )}
      {...rest}
    >
      {icon ?? (iconName && <Icon name={iconName} size={48} />)}

      {/* Focus ring — 2px, 4px outside the button */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute hidden',
          'inset-[calc(var(--scanner-toolbar-focus-offset)*-1)]',
          'border-[length:var(--scanner-toolbar-focus-width)] border-solid border-[color:var(--scanner-border-focus)]',
          'rounded-[var(--scanner-radius-lg)]',
          'group-focus-visible:block group-data-[state=focused]:block',
        )}
      />
    </button>
  ),
);

ToolbarButton.displayName = 'ToolbarButton';
