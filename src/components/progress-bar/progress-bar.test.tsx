import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

const fill = (container: HTMLElement) => container.querySelector('[data-fill]') as HTMLElement;

describe('ProgressBar', () => {
  it('renders an accessible progressbar labelled by the label and described by the helper', () => {
    render(<ProgressBar value={25} label="Uploading" helperText="25%" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAccessibleDescription('25%');
  });

  it('accepts any numeric value and a custom max; clamps out-of-range values', () => {
    const { container, rerender } = render(<ProgressBar value={42} max={256} />);
    expect(fill(container).style.width).toBe(`${(42 / 256) * 100}%`);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '256');
    rerender(<ProgressBar value={-5} />);
    expect(fill(container).style.width).toBe('0%');
    rerender(<ProgressBar value={33.3} />);
    expect(fill(container).style.width).toBe('33.3%');
    rerender(<ProgressBar value={150} status="default" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('uses border-interactive fill while in progress', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(fill(container)).toHaveClass('bg-[var(--scanner-border-interactive)]');
    expect(container.firstElementChild).toHaveAttribute('data-status', 'default');
  });

  it('becomes success at 100%: green full fill + checkmark', () => {
    const { container } = render(<ProgressBar value={100} />);
    expect(container.firstElementChild).toHaveAttribute('data-status', 'success');
    expect(fill(container)).toHaveClass('bg-[var(--scanner-border-success)]');
    expect(screen.getByRole('img', { name: 'Completed' })).toBeInTheDocument();
  });

  it('error: full red fill, error text replaces helper, retry link calls onRetry', () => {
    const onRetry = vi.fn();
    const { container } = render(
      <ProgressBar value={30} status="error" helperText="helper" errorText="Upload failed" onRetry={onRetry} />,
    );
    expect(fill(container).style.width).toBe('100%');
    expect(fill(container)).toHaveClass('bg-[var(--scanner-border-error)]');
    expect(screen.queryByText('helper')).not.toBeInTheDocument();
    expect(screen.getByText('Upload failed')).toHaveClass('text-[color:var(--scanner-text-error)]');
    fireEvent.click(screen.getByRole('link', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides the retry link without onRetry', () => {
    render(<ProgressBar status="error" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('Show label / Show helper text toggle their rows; label still names the bar', () => {
    render(<ProgressBar value={10} label="Exporting" showLabel={false} helperText="help" showHelperText={false} />);
    expect(screen.queryByText('Exporting')).not.toBeInTheDocument();
    expect(screen.queryByText('help')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Exporting' })).toBeInTheDocument();
  });

  it('uses Figma typography tokens for label and helper', () => {
    render(<ProgressBar label="L" helperText="H" />);
    expect(screen.getByText('L')).toHaveClass('text-[length:var(--scanner-text-scanner-md)]', 'leading-[var(--scanner-leading-lg)]');
    expect(screen.getByText('H')).toHaveClass('text-[length:var(--scanner-text-base)]', 'leading-[var(--scanner-leading-md)]');
  });

  it('indeterminate omits aria-valuenow', () => {
    render(<ProgressBar indeterminate />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('aria-busy', 'true');
  });

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressBar ref={ref} className="custom" />);
    expect(ref.current).toHaveClass('custom', 'flex');
  });
});
