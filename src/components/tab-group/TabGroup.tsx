import { forwardRef, Children, isValidElement, cloneElement } from 'react';
import { cn } from '../../utils/cn';
import type { TabGroupProps } from './tab-group.types';

/**
 * Scanner TabGroup — renders TabItem children as a horizontal tab bar.
 *
 * Manages tab selection state and injects `selected` / `onClick` props
 * into each TabItem child via `cloneElement`.
 *
 * @example
 * <TabGroup activeIndex={0} onChange={setActiveTab}>
 *   <TabItem>Dashboard</TabItem>
 *   <TabItem>Settings</TabItem>
 *   <TabItem>Billing</TabItem>
 * </TabGroup>
 */
export const TabGroup = forwardRef<HTMLDivElement, TabGroupProps>(
  (
    {
      children,
      activeIndex = 0,
      onChange,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'inline-flex items-start',
          'gap-[var(--scanner-spacing-5)]',
          'border-b border-solid border-b-[var(--scanner-border-subtle)]',
          className,
        )}
        onKeyDown={(e) => {
          const tabs = Children.toArray(children).filter(isValidElement);
          const count = tabs.length;
          if (count === 0) return;

          let nextIndex = activeIndex;

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextIndex = (activeIndex + 1) % count;
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            nextIndex = (activeIndex - 1 + count) % count;
          } else if (e.key === 'Home') {
            e.preventDefault();
            nextIndex = 0;
          } else if (e.key === 'End') {
            e.preventDefault();
            nextIndex = count - 1;
          }

          if (nextIndex !== activeIndex) {
            onChange?.(nextIndex);
          }
        }}
        {...rest}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            selected: index === activeIndex,
            onClick: () => onChange?.(index),
            tabIndex: index === activeIndex ? 0 : -1,
          });
        })}
      </div>
    );
  },
);

TabGroup.displayName = 'TabGroup';
