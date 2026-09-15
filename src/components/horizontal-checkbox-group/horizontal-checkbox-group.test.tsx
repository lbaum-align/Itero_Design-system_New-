import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { HorizontalCheckboxGroup } from './HorizontalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';

const renderGroup = (props: Partial<React.ComponentProps<typeof HorizontalCheckboxGroup>> = {}) =>
  render(
    <HorizontalCheckboxGroup label="Jaws" {...props}>
      <CheckboxItem label="Upper" />
      <CheckboxItem label="Lower" />
    </HorizontalCheckboxGroup>,
  );

describe('HorizontalCheckboxGroup', () => {
  it('renders a labelled group with items in a 16px-gap row', () => {
    renderGroup();
    const group = screen.getByRole('group', { name: 'Jaws' });
    const row = screen.getByRole('checkbox', { name: 'Upper' }).closest('label')!.parentElement!;
    expect(group).toContainElement(row);
    expect(row).toHaveClass('gap-[var(--scanner-spacing-5)]');
  });

  it('supports showLabel, required and explainer', () => {
    const { rerender } = renderGroup({ required: true, tooltipContent: 'Why' });
    expect(screen.getByRole('group', { name: 'Jaws (required)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help: Why' })).toBeInTheDocument();
    rerender(
      <HorizontalCheckboxGroup label="Jaws" showLabel={false}>
        <CheckboxItem label="Upper" />
      </HorizontalCheckboxGroup>,
    );
    expect(screen.queryByText('Jaws')).not.toBeInTheDocument();
  });

  it('error string is shown and marks the group invalid', () => {
    renderGroup({ error: 'Pick one', helperText: 'Help' });
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Pick one');
  });

  it('disabled disables every item', () => {
    renderGroup({ disabled: true });
    for (const cb of screen.getAllByRole('checkbox')) expect(cb).toBeDisabled();
  });

  it('skeleton renders items as skeletons', () => {
    const { container } = renderGroup({ skeleton: true });
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(container.querySelectorAll('[data-skeleton]')).toHaveLength(2);
  });

  it('arrow keys move focus between checkboxes', () => {
    renderGroup();
    const upper = screen.getByRole('checkbox', { name: 'Upper' });
    const lower = screen.getByRole('checkbox', { name: 'Lower' });
    upper.focus();
    fireEvent.keyDown(upper, { key: 'ArrowRight' });
    expect(lower).toHaveFocus();
    fireEvent.keyDown(lower, { key: 'ArrowUp' });
    expect(upper).toHaveFocus();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <HorizontalCheckboxGroup ref={ref} className="custom">
        <CheckboxItem label="One" />
      </HorizontalCheckboxGroup>,
    );
    expect(ref.current).toHaveClass('custom');
  });
});
