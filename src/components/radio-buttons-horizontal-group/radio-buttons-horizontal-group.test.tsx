import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioButtonsHorizontalGroup } from './RadioButtonsHorizontalGroup';
import type { RadioButtonOption } from './radio-buttons-horizontal-group.types';

const options: RadioButtonOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const Controlled = ({ onChange }: { onChange?: (v: string) => void }) => {
  const [value, setValue] = useState('a');
  return (
    <RadioButtonsHorizontalGroup
      label="Plan"
      options={options}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
    />
  );
};

describe('RadioButtonsHorizontalGroup', () => {
  it('renders a horizontal labelled radiogroup', () => {
    render(<RadioButtonsHorizontalGroup label="Plan" name="plan" options={options} />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('calls onChange on click', () => {
    const onChange = vi.fn();
    render(<RadioButtonsHorizontalGroup label="Plan" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('moves selection with Left/Right arrows and wraps', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Option C' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('c');
  });

  it('keeps legacy tooltipPosition / helperText / error props', () => {
    render(
      <RadioButtonsHorizontalGroup
        label="Plan"
        options={options}
        tooltipContent="Info"
        tooltipPosition="bottom"
        helperText="Required"
        error
      />,
    );
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Required');
    expect(screen.getByText('Required').className).toContain('--scanner-text-error');
  });

  it('renders a skeleton', () => {
    const { container } = render(<RadioButtonsHorizontalGroup label="Plan" options={options} skeleton />);
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-skeleton');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadioButtonsHorizontalGroup ref={ref} label="Plan" options={options} className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});
