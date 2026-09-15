import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { VerticalCheckboxGroup } from './VerticalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';

const renderGroup = (props: Partial<React.ComponentProps<typeof VerticalCheckboxGroup>> = {}) =>
  render(
    <VerticalCheckboxGroup label="Jaws" {...props}>
      <CheckboxItem label="Upper" />
      <CheckboxItem label="Lower" />
      <CheckboxItem label="Bite" />
    </VerticalCheckboxGroup>,
  );

describe('VerticalCheckboxGroup', () => {
  it('renders a group labelled by the label text', () => {
    renderGroup();
    expect(screen.getByRole('group', { name: 'Jaws' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('hides the label with showLabel=false', () => {
    renderGroup({ showLabel: false });
    expect(screen.queryByText('Jaws')).not.toBeInTheDocument();
  });

  it('shows the required asterisk and exposes "required" to assistive tech', () => {
    const { container } = renderGroup({ required: true });
    expect(screen.getByRole('group', { name: 'Jaws (required)' })).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('*');
  });

  it('renders the explainer tooltip trigger', () => {
    renderGroup({ tooltipContent: 'Pick the jaws' });
    expect(screen.getByRole('button', { name: 'Help: Pick the jaws' })).toBeInTheDocument();
  });

  it('levels=2 nests every item after the first', () => {
    const { container } = renderGroup({ levels: 2 });
    const nested = container.querySelector('[data-sub-items]')!;
    expect(nested).toHaveClass('pl-[var(--scanner-spacing-8)]');
    expect(nested.querySelectorAll('input')).toHaveLength(2);
  });

  it('disabled disables every item', () => {
    renderGroup({ disabled: true });
    expect(screen.getByRole('group')).toHaveAttribute('aria-disabled', 'true');
    for (const cb of screen.getAllByRole('checkbox')) expect(cb).toBeDisabled();
  });

  it('skeleton renders every item as a skeleton', () => {
    const { container } = renderGroup({ skeleton: true });
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(container.querySelectorAll('[data-skeleton]')).toHaveLength(3);
  });

  it('error message replaces helper text and is linked via aria-describedby', () => {
    renderGroup({ helperText: 'Help', error: true, errorMessage: 'Required' });
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Required');
  });

  it('ArrowDown / ArrowUp move focus between enabled checkboxes', () => {
    render(
      <VerticalCheckboxGroup label="Jaws">
        <CheckboxItem label="Upper" />
        <CheckboxItem label="Lower" disabled />
        <CheckboxItem label="Bite" />
      </VerticalCheckboxGroup>,
    );
    const upper = screen.getByRole('checkbox', { name: 'Upper' });
    upper.focus();
    fireEvent.keyDown(upper, { key: 'ArrowDown' });
    expect(screen.getByRole('checkbox', { name: 'Bite' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(screen.getByRole('checkbox', { name: 'Bite' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(upper).toHaveFocus();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <VerticalCheckboxGroup ref={ref} className="custom" label="A">
        <CheckboxItem label="One" />
      </VerticalCheckboxGroup>,
    );
    expect(ref.current).toHaveClass('custom');
  });
});
