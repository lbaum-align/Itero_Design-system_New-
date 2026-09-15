import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { SplitButton } from '../split-button/SplitButton';
import type { ButtonGroupPosition, ButtonGroupProps, ButtonGroupSize } from './button-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Buttons group (node 36403:6370)
 * Size (Large, Medium, Small) × Position (Horizontal, Vertical) = 6 variants.
 *
 * Gap: Large + Horizontal = 16px; every other variant = 8px (spacing-02).
 * Buttons hug their width; in a horizontal group they fill the row height
 * (so a wrapped label makes its neighbours grow too).
 */

const gap: Record<ButtonGroupPosition, Record<ButtonGroupSize, string>> = {
  horizontal: {
    large: 'gap-[var(--scanner-spacing-5)]', // 16
    medium: 'gap-[var(--scanner-spacing-3)]', // 8
    small: 'gap-[var(--scanner-spacing-3)]', // 8
  },
  vertical: {
    large: 'gap-[var(--scanner-spacing-3)]', // 8
    medium: 'gap-[var(--scanner-spacing-3)]', // 8
    small: 'gap-[var(--scanner-spacing-3)]', // 8
  },
};

/** Child components that understand the group `size`. */
const SIZED_CHILDREN: unknown[] = [Button, SplitButton];

/**
 * Scanner ButtonGroup — lays out related buttons in a row or column.
 *
 * Figma props → React: Size → `size`, Position → `position`.
 *
 * @example
 * <ButtonGroup size="medium">
 *   <Button emphasis="secondary">Cancel</Button>
 *   <Button>Save</Button>
 * </ButtonGroup>
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, position, orientation, size = 'large', className, ...rest }, ref) => {
    const pos: ButtonGroupPosition = position ?? orientation ?? 'horizontal';

    return (
      <div
        ref={ref}
        role="group"
        data-position={pos}
        data-size={size}
        className={cn(
          'inline-flex',
          pos === 'vertical' ? 'flex-col items-start' : 'flex-row items-stretch',
          gap[pos][size],
          className,
        )}
        {...rest}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child) || !SIZED_CHILDREN.includes(child.type)) return child;
          const el = child as ReactElement<{ size?: ButtonGroupSize }>;
          return el.props.size ? el : cloneElement(el, { size });
        })}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
