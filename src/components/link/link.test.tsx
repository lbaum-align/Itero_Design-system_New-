import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from './Link';
import type { LinkType } from './link.types';

describe('Link', () => {
  it('renders an anchor with href and the 18/28 body text style', () => {
    render(<Link href="/patients">Patients</Link>);
    const link = screen.getByRole('link', { name: 'Patients' });
    expect(link).toHaveAttribute('href', '/patients');
    expect(link).toHaveClass('text-[length:var(--scanner-text-scanner-md)]', 'leading-[var(--scanner-leading-lg)]');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="#" className="custom">Go</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveClass('custom');
  });

  it.each<[LinkType, string]>([
    ['primary', 'text-link'],
    ['secondary', 'text-primary'],
    ['inversed', 'text-inverse-secondary'],
    ['on-color', 'text-on-color-secondary'],
  ])('type %s uses %s', (type, token) => {
    render(<Link type={type} href="#">Go</Link>);
    expect(screen.getByRole('link')).toHaveClass(`text-[color:var(--scanner-${token})]`);
  });

  it('calls onClick', () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<Link href="#" onClick={onClick}>Go</Link>);
    fireEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates with Space as well as Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<Link href="#" onClick={onClick}>Go</Link>);
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps a click-only link (no href) accessible and keyboard operable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Link onClick={onClick}>Forgot password?</Link>);
    const link = screen.getByRole('link', { name: 'Forgot password?' });
    expect(link).toHaveAttribute('tabindex', '0');
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  describe('external', () => {
    it('adds target/rel, the 20px Launch icon and a screen-reader hint', () => {
      const { container } = render(<Link href="https://x.com" external>Docs</Link>);
      const link = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(container.querySelector('[data-part="external-icon"]')).toHaveAttribute('width', '20');
    });

    it('uses a 16px icon and 4px gap for size small', () => {
      const { container } = render(<Link href="#" external size="small">Docs</Link>);
      expect(container.querySelector('[data-part="external-icon"]')).toHaveAttribute('width', '16');
      expect(screen.getByRole('link')).toHaveClass('gap-[var(--scanner-spacing-2)]');
    });

    it('respects explicit target and rel', () => {
      render(<Link href="#" external target="_self" rel="external">Docs</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
      expect(link).toHaveAttribute('rel', 'external');
    });
  });

  describe('disabled', () => {
    it.each([
      ['disabled prop', { disabled: true }],
      ['aria-disabled prop', { 'aria-disabled': true }],
    ])('via %s removes href, focusability and clicks', (_, props) => {
      const onClick = vi.fn();
      render(<Link href="/x" onClick={onClick} {...props}>Go</Link>);
      const link = screen.getByRole('link', { name: 'Go' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).toHaveClass('text-[color:var(--scanner-text-disabled)]');
      fireEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('passes data-state through for forced visual states', () => {
    render(<Link href="#" data-state="focused">Go</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('data-state', 'focused');
  });
});
