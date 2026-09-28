import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { ToolbarContext } from './toolbar-context';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';
import type { ToolbarProps } from './toolbar.types';

/**
 * Scanner Toolbar — a white bar of 60×60 icon buttons (48px icons, 8px radius,
 * 4px apart) with an optional expand/collapse button and divider at the start.
 *
 * Not a Figma component: sizes come from the product spec; every colour is a
 * semantic token, so it follows light and dark themes.
 *
 * Keyboard (WAI-ARIA toolbar pattern): one tab stop; Arrow keys move between
 * buttons, Home/End jump to the first/last.
 *
 * @example
 * <Toolbar collapsible aria-label="Scan tools">
 *   <ToolbarButton iconName="edit" label="Edit" />
 *   <ToolbarButton iconName="filter" label="Filter" selected />
 *   <ToolbarDivider />
 *   <ToolbarButton iconName="close" label="Delete" />
 * </Toolbar>
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      orientation = 'horizontal',
      collapsible = false,
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      collapseLabel = 'Collapse toolbar',
      expandLabel = 'Expand toolbar',
      layer = 1,
      children,
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const barRef = useRef<HTMLDivElement | null>(null);
    const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);
    const collapsed = collapsedProp ?? uncontrolled;
    const isHorizontal = orientation === 'horizontal';

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        barRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const toggleCollapsed = useCallback(() => {
      const next = !collapsed;
      if (collapsedProp === undefined) setUncontrolled(next);
      onCollapsedChange?.(next);
    }, [collapsed, collapsedProp, onCollapsedChange]);

    /* ── Roving focus: one tab stop, arrows move between buttons ── */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';
        const previous = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
        if (!['Home', 'End', next, previous].includes(event.key)) {
          onKeyDown?.(event);
          return;
        }

        const buttons = Array.from(
          barRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [],
        );
        if (buttons.length === 0) return;

        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        let index: number;
        if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = buttons.length - 1;
        else if (event.key === next) index = current < 0 ? 0 : (current + 1) % buttons.length;
        else index = current < 0 ? buttons.length - 1 : (current - 1 + buttons.length) % buttons.length;

        event.preventDefault();
        buttons[index]?.focus();
        onKeyDown?.(event);
      },
      [isHorizontal, onKeyDown],
    );

    const contextValue = useMemo(() => ({ orientation }), [orientation]);

    /* Chevron points the way the toolbar will move: collapsed → opens outward */
    const collapseIcon = isHorizontal
      ? collapsed
        ? 'chevron-right'
        : 'chevron-left'
      : collapsed
        ? 'chevron-down'
        : 'chevron-up';

    return (
      <ToolbarContext.Provider value={contextValue}>
        <div
          ref={setRef}
          role="toolbar"
          aria-orientation={orientation}
          data-orientation={orientation}
          data-collapsed={collapsed || undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            'inline-flex items-center',
            isHorizontal ? 'flex-row' : 'flex-col',
            'gap-[var(--scanner-spacing-2)] p-[var(--scanner-spacing-2)]',
            'rounded-[var(--scanner-radius-md)]',
            layer === 2
              ? 'bg-[var(--scanner-bg-layer-02)]'
              : 'bg-[var(--scanner-bg-layer-01)]',
            'shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
            className,
          )}
          {...rest}
        >
          {collapsible && (
            <>
              <ToolbarButton
                label={collapsed ? expandLabel : collapseLabel}
                aria-expanded={!collapsed}
                onClick={toggleCollapsed}
                data-part="collapse"
                icon={<Icon name={collapseIcon} size={24} />}
              />
              <ToolbarDivider />
            </>
          )}

          {!collapsed && children}
        </div>
      </ToolbarContext.Provider>
    );
  },
);

Toolbar.displayName = 'Toolbar';
