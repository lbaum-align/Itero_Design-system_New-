import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TabItemProps } from './tab-item.types';

// ---------------------------------------------------------------------------
// Skeleton dimensions — matches Figma "Tab item" skeleton placeholder.
// ---------------------------------------------------------------------------
const SKELETON_WIDTH = 82;
const SKELETON_HEIGHT = 60;

// ---------------------------------------------------------------------------
// _TabItem component
// ---------------------------------------------------------------------------

/**
 * Scanner _TabItem — a single tab button used inside a TabBar / TabList.
 * Private sub-component (not exported from the package barrel).
 *
 * Implements every Figma state: Enabled, Hovered, Focused, Selected,
 * Disabled, and Skeleton.
 *
 * @example
 * <TabItem selected>Dashboard</TabItem>
 * <TabItem>Settings</TabItem>
 * <TabItem disabled>Billing</TabItem>
 */
export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  (
    {
      children,
      selected = false,
      disabled = false,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // ------------------------------------------------------------------
    // Skeleton state — fixed-dimension gray placeholder, no content.
    // ------------------------------------------------------------------
    if (skeleton) {
      return (
        <span
          style={{ width: SKELETON_WIDTH, height: SKELETON_HEIGHT }}
          className={cn(
            'inline-block animate-pulse bg-[var(--scanner-bg-tertiary)]',
            className,
          )}
          aria-hidden="true"
        />
      );
    }

    // ------------------------------------------------------------------
    // Rendered state
    // ------------------------------------------------------------------
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        className={cn(
          // Layout — 60px tall, centered content, bottom padding per Figma
          'inline-flex items-center justify-center',
          'h-[60px]',
          'gap-[var(--scanner-spacing-3)]',
          'pb-[var(--scanner-spacing-4)]',

          // Typography — Figma "$tp-heading-02": Roboto Medium 18px/28px.
          // NOTE: 18px font-size has no exact design token (falls between
          // --scanner-text-md 17px and --scanner-text-lg 20px). Using a
          // literal 18px until a dedicated token is added.
          'font-[family-name:var(--scanner-font-sans)]',
          'text-[length:18px]',
          'leading-[var(--scanner-leading-lg)]',
          'font-[var(--scanner-font-medium)]',
          'whitespace-nowrap text-center',

          // Reset native button chrome
          'bg-transparent p-0 m-0',
          'outline-none cursor-pointer',

          // Bottom border — always reserve 2px for the selected indicator
          // so toggling selected/unselected does not cause layout shift.
          'border-0 border-b-2 border-solid border-b-transparent',

          // Transition
          'transition-colors duration-150',

          // ----- Text color per state -----
          disabled
            ? [
                // Disabled: tertiary text, no pointer
                // Figma "disabled-states/text-disabled" = rgba(0,0,0,0.23)
                // maps to --scanner-text-tertiary in our token system.
                'text-[color:var(--scanner-text-tertiary)]',
                'cursor-not-allowed',
              ]
            : selected
              ? [
                  // Selected: prominent text (#121212)
                  // NOTE: No semantic --scanner-text-emphasis token exists;
                  // --scanner-icon-primary (#121212) is the closest semantic
                  // token and inverts correctly in dark mode.
                  'text-[color:var(--scanner-icon-primary)]',
                ]
              : [
                  // Default / Enabled: primary body text
                  'text-[color:var(--scanner-text-primary)]',
                  // Hover — promote to prominent text
                  'hover:text-[color:var(--scanner-icon-primary)]',
                  'data-[state=hovered]:text-[color:var(--scanner-icon-primary)]',
                ],

          // ----- Selected indicator (2px bottom border) -----
          selected &&
            !disabled &&
            'border-b-[color:var(--scanner-border-interactive)]',

          // ----- Focus — full outline, does not affect layout -----
          !disabled && [
            'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--scanner-border-focus)]',
            'focus-visible:text-[color:var(--scanner-icon-primary)]',
            // data-state for Storybook screenshot comparison
            'data-[state=focused]:outline data-[state=focused]:outline-1 data-[state=focused]:outline-[var(--scanner-border-focus)]',
            'data-[state=focused]:text-[color:var(--scanner-icon-primary)]',
          ],

          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

TabItem.displayName = 'TabItem';
