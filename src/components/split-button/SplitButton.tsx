import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import type { ButtonSize } from '../button';
import type { SplitButtonProps } from './split-button.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Split button (node 36407:15124)
 * Emphasis (Primary, Secondary, Ghost) × Size (Large, Medium, Small) × Opened (False, True) = 18 variants.
 *
 * Built from two `01 Button` instances, exactly like Figma:
 * - main:    Content=Text only, outer corners rounded only on the left
 * - trigger: Content=Icon only (chevron), outer corners rounded only on the right,
 *            width hugs padding + icon (not square): 12/8/4px padding, 24/24/20px icon
 * separated by a 1px gap.
 */

const triggerSize: Record<ButtonSize, string> = {
  large: 'p-[var(--scanner-spacing-4)]', // 12 → 48 × 60
  medium: 'p-[var(--scanner-spacing-3)]', // 8 → 40 × 48
  small: 'p-[var(--scanner-spacing-2)] [&_svg]:size-[var(--scanner-split-button-icon-size-sm)]', // 4 + 20px icon → 28 × 36
};

/**
 * Scanner SplitButton — a primary action plus a dropdown trigger for related actions.
 *
 * Figma props → React: Emphasis → `emphasis`, Size → `size`, Opened → `opened`.
 * The consumer owns the menu: toggle `opened` from `onDropdownClick` and render the menu.
 *
 * @example
 * <SplitButton onMainClick={save} onDropdownClick={() => setOpen(!open)} opened={open}>
 *   Save
 * </SplitButton>
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      variant = 'brand',
      emphasis = 'primary',
      size = 'large',
      opened = false,
      onMainClick,
      onDropdownClick,
      dropdownLabel = 'More options',
      disabled = false,
      loading = false,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const shared = { variant, emphasis, size, skeleton };

    return (
      <div
        ref={ref}
        role={skeleton ? undefined : 'group'}
        aria-hidden={skeleton || undefined}
        data-opened={opened}
        className={cn('inline-flex items-stretch gap-[var(--scanner-split-button-gap)]', className)}
        {...rest}
      >
        <Button
          {...shared}
          disabled={disabled}
          loading={loading}
          onClick={onMainClick}
          className="rounded-r-none"
        >
          {children}
        </Button>
        <Button
          {...shared}
          iconName={opened ? 'chevron-up' : 'chevron-down'}
          iconOnly
          aria-label={dropdownLabel}
          aria-haspopup="menu"
          aria-expanded={opened}
          disabled={disabled || loading}
          onClick={onDropdownClick}
          className={cn('w-auto rounded-l-none', triggerSize[size])}
        />
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
