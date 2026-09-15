import { Children, cloneElement, forwardRef, isValidElement, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { cn } from '../../utils/cn';
import type { TabItemProps } from '../_tab-item/tab-item.types';
import type { TabGroupProps } from './tab-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Tab group (node 25501:14769)
 * Scrollable=False · Show previews · Show next.
 *
 * A row of `_Tab item`s with a 16px gap (spacing-04), no container stroke.
 * Keyboard (Figma docs + WAI-ARIA tabs pattern): Tab enters the group on the selected tab;
 * Left/Right move between tabs (wrapping, skipping disabled); Home/End jump to first/last.
 */

type TabElement = ReactElement<TabItemProps>;

/**
 * Scanner TabGroup — switches between related views without leaving the page.
 *
 * @example
 * <TabGroup activeIndex={tab} onChange={setTab} aria-label="Patient sections">
 *   <TabItem>Overview</TabItem>
 *   <TabItem>Scans</TabItem>
 *   <TabItem disabled>Billing</TabItem>
 * </TabGroup>
 */
export const TabGroup = forwardRef<HTMLDivElement, TabGroupProps>(
  (
    {
      children,
      activeIndex,
      defaultActiveIndex = 0,
      onChange,
      activationMode = 'automatic',
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
    const selectedIndex = activeIndex ?? internalIndex;

    const tabs = Children.toArray(children).filter(isValidElement) as TabElement[];
    const isDisabled = (i: number) => !!tabs[i]?.props.disabled;

    const select = (i: number) => {
      if (i === selectedIndex || isDisabled(i)) return;
      if (activeIndex === undefined) setInternalIndex(i);
      onChange?.(i);
    };

    /* Roving tabindex target: the selected tab, or the first enabled one */
    const tabStop = !isDisabled(selectedIndex) && selectedIndex < tabs.length
      ? selectedIndex
      : tabs.findIndex((_, i) => !isDisabled(i));

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      const count = tabs.length;
      /* Each TabItem renders exactly one root element, so DOM children line up with `tabs` */
      const elements = Array.from(e.currentTarget.children) as HTMLElement[];
      const current = elements.findIndex((el) => el === document.activeElement);
      if (count === 0 || current === -1) return;

      const step = (from: number, dir: 1 | -1) => {
        let i = from;
        for (let n = 0; n < count; n++) {
          i = (i + dir + count) % count;
          if (!isDisabled(i)) return i;
        }
        return from;
      };

      let next: number;
      switch (e.key) {
        case 'ArrowRight': next = step(current, 1); break;
        case 'ArrowLeft': next = step(current, -1); break;
        case 'Home': next = step(-1 + count, 1); break; // first enabled
        case 'End': next = step(0, -1); break; // last enabled
        default: return;
      }
      e.preventDefault();
      elements[next]?.focus();
      if (activationMode === 'automatic') select(next);
    };

    let tabIndexCounter = -1;
    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        className={cn('inline-flex items-start gap-[var(--scanner-spacing-5)]', className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const index = ++tabIndexCounter;
          const tab = child as TabElement;
          return cloneElement(tab, {
            selected: index === selectedIndex,
            tabIndex: index === tabStop ? 0 : -1,
            onClick: (e: MouseEvent<HTMLButtonElement>) => {
              tab.props.onClick?.(e);
              if (!e.defaultPrevented) select(index);
            },
          } as Partial<TabItemProps>);
        })}
      </div>
    );
  },
);

TabGroup.displayName = 'TabGroup';
