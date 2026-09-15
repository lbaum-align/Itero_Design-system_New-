import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Status } from './Status';

describe('_Status', () => {
  it('renders an online dot (Figma default) with an accessible label', () => {
    render(<Status />);
    const dot = screen.getByRole('img', { name: 'online' });
    expect(dot).toHaveAttribute('data-status', 'online');
    expect(dot.className).toContain('--scanner-icon-success');
    expect(dot.className).toContain('--scanner-avatar-status-size-xl');
  });

  it('maps pixel and legacy sizes to tokens', () => {
    const { rerender } = render(<Status size={6} />);
    expect(screen.getByRole('img').className).toContain('--scanner-avatar-status-size-xs');
    rerender(<Status size="small" />);
    expect(screen.getByRole('img').className).toContain('--scanner-avatar-status-size-sm');
  });

  it('can be hidden from assistive tech', () => {
    const { container } = render(<Status label={null} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Status ref={ref} className="custom" status="busy" />);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current?.className).toContain('--scanner-icon-error');
  });
});
