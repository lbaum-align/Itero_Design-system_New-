import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioButtonsVerticalGroup } from './RadioButtonsVerticalGroup';
import type { RadioButtonsVerticalGroupProps, RadioOption } from './radio-buttons-vertical-group.types';

const items: RadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'SMS', value: 'sms', disabled: true },
  { label: 'Mail', value: 'mail' },
];

const Controlled = (props: Partial<RadioButtonsVerticalGroupProps>) => {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <RadioButtonsVerticalGroup
      label="Contact"
      items={items}
      {...props}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
};

describe('RadioButtonsVerticalGroup', () => {
  it('renders a labelled radiogroup with one radio per item sharing a name', () => {
    render(<RadioButtonsVerticalGroup label="Contact" name="contact" items={items} />);
    const group = screen.getByRole('radiogroup', { name: 'Contact' });
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    radios.forEach((r) => expect(r).toHaveAttribute('name', 'contact'));
  });

  it('generates a shared name when none is given', () => {
    render(<RadioButtonsVerticalGroup label="Contact" items={items} />);
    const names = new Set(screen.getAllByRole('radio').map((r) => r.getAttribute('name')));
    expect(names.size).toBe(1);
    expect([...names][0]).toBeTruthy();
  });

  it('uses the label as aria-label when Show label is false', () => {
    render(<RadioButtonsVerticalGroup label="Contact" showLabel={false} items={items} />);
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Contact' })).toBeInTheDocument();
  });

  it('shows the required asterisk and sets aria-required', () => {
    render(<RadioButtonsVerticalGroup label="Contact" required items={items} />);
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
  });

  it('renders the explainer tooltip trigger when tooltipContent is set', () => {
    render(<RadioButtonsVerticalGroup label="Contact" tooltipContent="Why we ask" items={items} />);
    expect(screen.getByRole('button', { name: /why we ask/i })).toBeInTheDocument();
  });

  it('links helper text and marks errors', () => {
    render(<RadioButtonsVerticalGroup label="Contact" error helperText="Pick one" items={items} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Pick one');
  });

  it('calls onChange with the clicked value', () => {
    const onChange = vi.fn();
    render(<RadioButtonsVerticalGroup label="Contact" items={items} value="email" onChange={onChange} />);
    fireEvent.click(screen.getByText('Phone'));
    expect(onChange).toHaveBeenCalledWith('phone');
  });

  it('works uncontrolled with defaultValue', () => {
    render(<RadioButtonsVerticalGroup label="Contact" items={items} defaultValue="phone" />);
    expect(screen.getByRole('radio', { name: 'Phone' })).toBeChecked();
    fireEvent.click(screen.getByText('Mail'));
    expect(screen.getByRole('radio', { name: 'Mail' })).toBeChecked();
  });

  describe('keyboard', () => {
    it('uses a roving tabindex on the selected radio', () => {
      render(<RadioButtonsVerticalGroup label="Contact" items={items} value="phone" />);
      const tabbable = screen.getAllByRole('radio').filter((r) => r.getAttribute('tabindex') === '0');
      expect(tabbable).toEqual([screen.getByRole('radio', { name: 'Phone' })]);
    });

    it('makes the first enabled radio tabbable when nothing is selected', () => {
      render(<RadioButtonsVerticalGroup label="Contact" items={items} value="" />);
      expect(screen.getByRole('radio', { name: 'Email' })).toHaveAttribute('tabindex', '0');
    });

    it('moves focus and selection with arrow keys, skipping disabled items and wrapping', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Controlled value="phone" onChange={onChange} />);
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Phone' })).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Mail' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Mail' })).toBeChecked();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Mail' })).toBeChecked();

      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
      expect(onChange).toHaveBeenLastCalledWith('email');
    });

    it('selects the focused radio with Space', async () => {
      const user = userEvent.setup();
      render(<Controlled value="" />);
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Email' })).toHaveFocus();
      await user.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
    });
  });

  describe('disabled', () => {
    it('disables every radio and ignores clicks', () => {
      const onChange = vi.fn();
      render(<RadioButtonsVerticalGroup label="Contact" items={items} disabled onChange={onChange} />);
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
      screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
      fireEvent.click(screen.getByText('Email'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('renders every item as a skeleton', () => {
    const { container } = render(<RadioButtonsVerticalGroup label="Contact" items={items} skeleton />);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[data-skeleton]').length).toBe(1 + items.length);
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadioButtonsVerticalGroup ref={ref} label="Contact" items={items} className="custom" />);
    expect(ref.current).toBe(screen.getByRole('radiogroup'));
    expect(ref.current).toHaveClass('custom');
  });
});
