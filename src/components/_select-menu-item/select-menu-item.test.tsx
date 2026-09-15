import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectMenuItem } from './SelectMenuItem';
import { SelectMenu } from '../select-menu';

describe('SelectMenuItem', () => {
  it('renders an option with aria-selected=false by default', () => {
    render(<SelectMenuItem optionText="Canada" />);
    const option = screen.getByRole('option', { name: 'Canada' });
    expect(option).toHaveAttribute('aria-selected', 'false');
    expect(option).toHaveAttribute('tabindex', '-1');
    expect(option.id).not.toBe('');
  });

  it('forwards the ref to the option row and merges className on the wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<SelectMenuItem ref={ref} className="custom" />);
    expect(ref.current).toBe(screen.getByRole('option'));
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('Selected shows the checkmark (24px frame at X-Large, 20px otherwise)', () => {
    const { container, rerender } = render(<SelectMenuItem selected size="x-large" />);
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('[data-checkmark]')?.getAttribute('class')).toContain('check-size-xl');
    rerender(<SelectMenuItem selected size="small" />);
    expect(container.querySelector('[data-checkmark]')?.getAttribute('class')).not.toContain('check-size-xl');
    rerender(<SelectMenuItem selected={false} />);
    expect(container.querySelector('[data-checkmark]')).not.toBeInTheDocument();
  });

  it('disabled: aria-disabled, ignores clicks, disabled colours', () => {
    const onClick = vi.fn();
    const { container } = render(<SelectMenuItem optionText="Canada" disabled selected onClick={onClick} />);
    const option = screen.getByRole('option');
    expect(option).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(option);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Canada').className).toContain('--scanner-text-disabled');
    expect(container.querySelector('[data-checkmark]')?.getAttribute('class')).toContain('--scanner-icon-disabled');
  });

  it('uses 18/28 text at X-Large and 14/20 at other sizes', () => {
    const { rerender } = render(<SelectMenuItem optionText="Opt" size="x-large" />);
    expect(screen.getByText('Opt').className).toContain('--scanner-text-scanner-md');
    rerender(<SelectMenuItem optionText="Opt" size="medium" />);
    expect(screen.getByText('Opt').className).toContain('--scanner-text-sm');
  });

  it('shows headline, subtext and divider', () => {
    const { container } = render(
      <SelectMenuItem showHeadline headlineText="Europe" showSubtext subheadText="EU member" showDivider />,
    );
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('EU member').className).toContain('--scanner-text-secondary');
    expect(container.querySelector('[data-divider]')).toBeInTheDocument();
  });

  it('inside a SelectMenu, takes size + selection from context and selects on click', () => {
    const onChange = vi.fn();
    render(
      <SelectMenu size="small" value="b" onChange={onChange} aria-label="Letters">
        <SelectMenuItem value="a" optionText="A" />
        <SelectMenuItem value="b" optionText="B" />
      </SelectMenu>,
    );
    expect(screen.getByRole('option', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'A' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'A' }).parentElement).toHaveAttribute('data-size', 'small');
    fireEvent.click(screen.getByRole('option', { name: 'A' }));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('passes data-state through for forced visual states', () => {
    render(<SelectMenuItem data-state="hovered" />);
    expect(screen.getByRole('option')).toHaveAttribute('data-state', 'hovered');
  });
});
