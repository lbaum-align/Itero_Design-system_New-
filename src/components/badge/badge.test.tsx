import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import type { BadgeStatus } from './badge.types';

const root = (text: string) => screen.getByText(text).parentElement as HTMLElement;

describe('Badge', () => {
  it('renders its label with neutral/default by default', () => {
    render(<Badge>New</Badge>);
    const badge = root('New');
    expect(badge).toHaveAttribute('data-status', 'neutral');
    expect(badge).toHaveAttribute('data-layout', 'default');
    expect(badge).toHaveClass('bg-[var(--scanner-bg-highlight-gray)]');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} className="custom">New</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveClass('custom');
  });

  it.each<[BadgeStatus, string, string]>([
    ['info', 'blue', 'text-on-highlight-blue'],
    ['success', 'green', 'text-on-highlight-green'],
    ['warning', 'orange', 'text-on-highlight-orange'],
    ['destructive', 'red', 'text-on-highlight-red'],
  ])('default layout %s uses highlight tokens', (status, hue, text) => {
    render(<Badge status={status}>X</Badge>);
    const badge = root('X');
    expect(badge).toHaveClass(`bg-[var(--scanner-bg-highlight-${hue})]`);
    expect(badge).toHaveClass(`shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-${hue})]`);
    expect(badge).toHaveClass(`text-[color:var(--scanner-${text})]`);
  });

  it.each<[BadgeStatus, string]>([
    ['neutral', 'text-primary'],
    ['info', 'text-link'],
    ['success', 'text-success'],
    ['warning', 'text-warning'],
    ['destructive', 'text-error'],
  ])('on-image %s uses elevated background and %s', (status, text) => {
    render(<Badge status={status} layout="on-image">X</Badge>);
    const badge = root('X');
    expect(badge).toHaveClass('bg-[var(--scanner-bg-elevated)]');
    expect(badge.className).not.toContain('shadow-');
    expect(badge).toHaveClass(`text-[color:var(--scanner-${text})]`);
  });

  describe('icon', () => {
    it('is hidden by default', () => {
      const { container } = render(<Badge>X</Badge>);
      expect(container.querySelector('[data-part="icon"]')).not.toBeInTheDocument();
    });

    it('shows the default Information icon at 28px with showIcon', () => {
      const { container } = render(<Badge showIcon status="destructive">X</Badge>);
      const icon = container.querySelector('[data-part="icon"]');
      expect(icon).toHaveClass('text-[color:var(--scanner-icon-on-highlight-red)]');
      expect(icon?.querySelector('svg')).toHaveAttribute('width', '28');
    });

    it('renders a registry icon via iconName', () => {
      const { container } = render(<Badge iconName="check">X</Badge>);
      const icon = container.querySelector('[data-part="icon"]');
      expect(icon).toHaveClass('size-[var(--scanner-badge-icon-size)]');
      expect(icon?.querySelector('svg')).toHaveClass('size-full');
    });

    it('renders a custom icon node', () => {
      render(<Badge icon={<svg data-testid="custom" />}>X</Badge>);
      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });
  });

  it('truncates long labels on one line', () => {
    render(<Badge>Long label</Badge>);
    expect(screen.getByText('Long label')).toHaveClass('truncate');
  });

  it('renders a hidden fixed-size placeholder when loading', () => {
    const { container } = render(<Badge loading>Hidden</Badge>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    const placeholder = container.querySelector('[data-skeleton]');
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(placeholder).toHaveClass('w-[var(--scanner-badge-skeleton-width)]');
  });

  it('passes through HTML attributes such as title', () => {
    render(<Badge title="Full text">Full…</Badge>);
    expect(root('Full…')).toHaveAttribute('title', 'Full text');
  });
});
