import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MenuTrailingElements } from './MenuTrailingElements';

describe('MenuTrailingElements', () => {
  it('renders nothing without a type or type-defining props', () => {
    const { container } = render(<MenuTrailingElements />);
    expect(container).toBeEmptyDOMElement();
  });

  it('infers the type from props (shortcut > toggle > icon)', () => {
    const { container, rerender } = render(<MenuTrailingElements shortcutKeys={['⌘', 'X']} toggle icon="chevron-right" />);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'shortcut');
    rerender(<MenuTrailingElements toggle icon="chevron-right" />);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'toggle');
    rerender(<MenuTrailingElements icon="chevron-right" />);
    expect(container.firstElementChild).toHaveAttribute('data-type', 'submenu');
  });

  it('renders the keyboard shortcut', () => {
    render(<MenuTrailingElements type="shortcut" shortcutKeys={['⌘', 'X']} />);
    expect(screen.getByText('Command')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('renders submenu chevron (24px) and the label only when showLabel', () => {
    const { container, rerender } = render(<MenuTrailingElements type="submenu" label="PNG" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '24');
    expect(screen.queryByText('PNG')).not.toBeInTheDocument();
    rerender(<MenuTrailingElements type="submenu" label="PNG" showLabel />);
    expect(screen.getByText('PNG')).toBeInTheDocument();
  });

  it('renders an interactive toggle that reports changes', () => {
    const onToggleChange = vi.fn();
    render(<MenuTrailingElements type="toggle" toggleAriaLabel="Wi-Fi" onToggleChange={onToggleChange} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Wi-Fi' }));
    expect(onToggleChange).toHaveBeenCalledWith(true);
  });

  it('renders a presentational toggle when toggleInteractive is false', () => {
    const { container } = render(<MenuTrailingElements type="toggle" toggleSelected toggleInteractive={false} />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    const sw = container.querySelector('[role="switch"]');
    expect(sw).toHaveAttribute('tabindex', '-1');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('passes disabled to its content', () => {
    const { container, rerender } = render(<MenuTrailingElements type="toggle" disabled toggleAriaLabel="Wi-Fi" />);
    expect(screen.getByRole('switch')).toBeDisabled();
    rerender(<MenuTrailingElements type="submenu" disabled label="PNG" showLabel />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('--scanner-icon-disabled');
    expect(screen.getByText('PNG').className).toContain('--scanner-text-disabled');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MenuTrailingElements ref={ref} type="submenu" className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});
