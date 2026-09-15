import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  it('renders a group with a main button and a dropdown trigger', () => {
    render(<SplitButton>Save</SplitButton>);
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'More options' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('reflects opened via aria-expanded and data-opened', () => {
    render(<SplitButton opened>Save</SplitButton>);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group')).toHaveAttribute('data-opened', 'true');
  });

  it('routes clicks to the matching handler', () => {
    const onMainClick = vi.fn();
    const onDropdownClick = vi.fn();
    render(
      <SplitButton onMainClick={onMainClick} onDropdownClick={onDropdownClick}>
        Save
      </SplitButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onMainClick).toHaveBeenCalledTimes(1);
    expect(onDropdownClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(onDropdownClick).toHaveBeenCalledTimes(1);
  });

  it('uses a custom dropdown label', () => {
    render(<SplitButton dropdownLabel="Save options">Save</SplitButton>);
    expect(screen.getByRole('button', { name: 'Save options' })).toBeInTheDocument();
  });

  it('disables both segments', () => {
    const onMainClick = vi.fn();
    render(<SplitButton disabled onMainClick={onMainClick}>Save</SplitButton>);
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onMainClick).not.toHaveBeenCalled();
  });

  it('loading keeps the main button busy and disables the trigger', () => {
    render(<SplitButton loading>Save</SplitButton>);
    expect(screen.getByRole('button', { name: /save/i })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
  });

  it('skeleton renders hidden placeholders', () => {
    const { container } = render(<SplitButton skeleton>Save</SplitButton>);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(container.querySelectorAll('[data-skeleton]')).toHaveLength(2);
  });

  it('uses the 20px chevron token at small size and 24px otherwise', () => {
    const { container, rerender } = render(<SplitButton size="small">Save</SplitButton>);
    const trigger = () => screen.getByRole('button', { name: 'More options' });
    expect(trigger().className).toContain('[&_svg]:size-[var(--scanner-split-button-icon-size-sm)]');
    rerender(<SplitButton size="large">Save</SplitButton>);
    expect(trigger().className).not.toContain('icon-size-sm');
    expect(container.querySelector('svg')).toHaveAttribute('width', '24');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SplitButton ref={ref} className="custom">Save</SplitButton>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
