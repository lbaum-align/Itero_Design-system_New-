import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TextTriggerTooltip } from './TextTriggerTooltip';

describe('TextTriggerTooltip', () => {
  it('renders a focusable term with a dotted underline in Body 14/20 text-primary', () => {
    render(<TextTriggerTooltip content="A unique identifier">Patient ID</TextTriggerTooltip>);
    const term = screen.getByRole('button', { name: 'Patient ID' });
    expect(term).toHaveClass(
      'underline',
      'decoration-dotted',
      'text-[length:var(--scanner-text-sm)]',
      'text-[color:var(--scanner-text-primary)]',
    );
  });

  it('shows on hover and focus, hides on Escape and blur', () => {
    const { container } = render(
      <TextTriggerTooltip content="A unique identifier" delay={0}>
        Patient ID
      </TextTriggerTooltip>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole('tooltip')).toHaveTextContent('A unique identifier');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.mouseLeave(wrapper);

    const term = screen.getByRole('button');
    act(() => term.focus());
    expect(term).toHaveAttribute('aria-describedby', screen.getByRole('tooltip').id);
    act(() => term.blur());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('maps Position and Alignment (defaults Bottom / Middle)', () => {
    const { rerender } = render(<TextTriggerTooltip content="x" open>Term</TextTriggerTooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'bottom');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-alignment', 'middle');
    rerender(
      <TextTriggerTooltip content="x" open position="top" alignment="end">
        Term
      </TextTriggerTooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', 'top');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-alignment', 'end');
  });

  it('passes data-state to the trigger', () => {
    render(<TextTriggerTooltip content="x" data-state="focused">Term</TextTriggerTooltip>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'focused');
  });

  it('merges className on the wrapper and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TextTriggerTooltip ref={ref} content="x" className="custom">
        Term
      </TextTriggerTooltip>,
    );
    expect(ref.current).toHaveClass('relative', 'inline-flex', 'custom');
  });
});
