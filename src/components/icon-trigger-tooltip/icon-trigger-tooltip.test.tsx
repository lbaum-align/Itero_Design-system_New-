import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { IconTriggerTooltip } from './IconTriggerTooltip';

describe('IconTriggerTooltip', () => {
  it('renders a 16px help button named after the content (legacy name kept)', () => {
    render(<IconTriggerTooltip content="Why we ask" />);
    const button = screen.getByRole('button', { name: 'Help: Why we ask' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelector('svg')).toHaveAttribute('width', '16');
    expect(button).toHaveClass('text-[color:var(--scanner-icon-secondary)]');
  });

  it('accepts a custom trigger label', () => {
    render(<IconTriggerTooltip content="Why" triggerLabel="More information" />);
    expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();
  });

  it('shows the tooltip on focus with aria-describedby and hides on Escape', () => {
    render(<IconTriggerTooltip content="Why we ask" />);
    const button = screen.getByRole('button');
    act(() => button.focus());
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Why we ask');
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('defaults to Placement=Bottom, Alignment=Middle; legacy position and new placement/alignment work', () => {
    const { rerender } = render(<IconTriggerTooltip content="x" open />);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'bottom');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-alignment', 'middle');
    rerender(<IconTriggerTooltip content="x" open position="top" />);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'top');
    rerender(<IconTriggerTooltip content="x" open position="top" placement="left" alignment="start" />);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'left');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-alignment', 'start');
  });

  it('disabled: icon-disabled colour, native disabled and never shows the tooltip', () => {
    const onOpenChange = vi.fn();
    const { container } = render(<IconTriggerTooltip content="x" disabled onOpenChange={onOpenChange} delay={0} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('text-[color:var(--scanner-icon-disabled)]');
    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('passes data-state to the trigger for the forced focus stroke', () => {
    render(<IconTriggerTooltip content="x" data-state="focused" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'focused');
  });

  it('merges className on the wrapper and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<IconTriggerTooltip ref={ref} content="x" className="custom" />);
    expect(ref.current).toHaveClass('relative', 'inline-flex', 'shrink-0', 'custom');
  });
});
