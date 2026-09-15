import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';
import { TooltipBubble } from './TooltipBubble';

const renderTooltip = (props: Partial<React.ComponentProps<typeof Tooltip>> = {}) =>
  render(
    <Tooltip content="Hint" delay={0} {...props}>
      <button type="button">Trigger</button>
    </Tooltip>,
  );

afterEach(() => vi.useRealTimers());

describe('Tooltip', () => {
  it('is hidden by default and wires aria-describedby on the trigger', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('keeps an existing aria-describedby on the trigger', () => {
    render(
      <Tooltip content="Hint">
        <button type="button" aria-describedby="helper">
          Trigger
        </button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', `helper ${tooltip.id}`);
  });

  it('shows on hover and hides on mouse leave', () => {
    const { container } = renderTooltip();
    const wrapper = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hint');
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('waits for the hover delay (300ms by default)', () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('shows immediately on focus, hides on blur and on Escape', () => {
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    act(() => button.focus());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => button.blur());
    act(() => button.focus());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    act(() => button.blur());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('supports controlled open (Figma "Show tooltip") and reports changes', () => {
    const onOpenChange = vi.fn();
    const { container } = renderTooltip({ open: true, onOpenChange });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(container.firstElementChild as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('never shows when disabled', () => {
    const { container } = renderTooltip({ disabled: true, open: true });
    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('maps placement / legacy position and alignment to data attributes', () => {
    const { rerender } = renderTooltip({ open: true, position: 'left' });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'left');
    rerender(
      <Tooltip content="Hint" open position="left" placement="bottom" alignment="end">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-placement', 'bottom');
    expect(tooltip).toHaveAttribute('data-alignment', 'end');
  });

  it('keeps the relative inline-flex wrapper, merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip ref={ref} content="Hint" className="min-w-px flex-1">
        text
      </Tooltip>,
    );
    expect(ref.current).toHaveClass('relative', 'inline-flex', 'min-w-px', 'flex-1');
    // Non-element children: the wrapper is described instead
    expect(ref.current).toHaveAttribute('aria-describedby');
  });
});

describe('TooltipBubble', () => {
  it('renders the caret unless showCaret is false', () => {
    const { container, rerender } = render(<TooltipBubble>Text message</TooltipBubble>);
    expect(container.querySelector('[data-caret]')).toBeInTheDocument();
    rerender(<TooltipBubble showCaret={false}>Text message</TooltipBubble>);
    expect(container.querySelector('[data-caret]')).not.toBeInTheDocument();
  });

  it('orders caret before the container for bottom/right and after for top/left', () => {
    const { container, rerender } = render(<TooltipBubble placement="bottom">x</TooltipBubble>);
    expect(container.firstElementChild).toHaveClass('flex-col');
    rerender(<TooltipBubble placement="top">x</TooltipBubble>);
    expect(container.firstElementChild).toHaveClass('flex-col-reverse');
    rerender(<TooltipBubble placement="right">x</TooltipBubble>);
    expect(container.firstElementChild).toHaveClass('flex-row');
    rerender(<TooltipBubble placement="left" alignment="start">x</TooltipBubble>);
    expect(container.firstElementChild).toHaveClass('flex-row-reverse', 'items-start');
  });
});
