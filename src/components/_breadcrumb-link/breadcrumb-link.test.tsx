import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BreadcrumbLink } from './BreadcrumbLink';

describe('_BreadcrumbLink', () => {
  it('renders an enabled link (text-secondary) with a "|" divider by default', () => {
    const { container } = render(<BreadcrumbLink href="/a">Page name</BreadcrumbLink>);
    const link = screen.getByRole('link', { name: 'Page name' });
    expect(link).toHaveAttribute('href', '/a');
    expect(link).toHaveClass('scanner-text-body-02', 'text-[color:var(--scanner-text-secondary)]');
    const divider = container.querySelector('[data-divider]');
    expect(divider).toHaveTextContent('|');
    expect(divider).toHaveAttribute('aria-hidden', 'true');
    expect(divider).toHaveClass('text-[color:var(--scanner-text-tertiary)]');
  });

  it('hides the divider with showDivider={false} (and the deprecated showSeparator)', () => {
    const { container, rerender } = render(<BreadcrumbLink href="#" showDivider={false}>A</BreadcrumbLink>);
    expect(container.querySelector('[data-divider]')).toBeNull();
    rerender(<BreadcrumbLink href="#" showSeparator={false}>A</BreadcrumbLink>);
    expect(container.querySelector('[data-divider]')).toBeNull();
  });

  it('passes data-state for forced hovered/focused states', () => {
    render(<BreadcrumbLink href="#" data-state="focused">A</BreadcrumbLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-state', 'focused');
    expect(link.className).toContain('data-[state=focused]:shadow-');
    expect(link.className).toContain('data-[state=hovered]:underline');
  });

  it('activates on Space as well as click', () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<BreadcrumbLink href="#" onClick={onClick}>A</BreadcrumbLink>);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('disabled: no href, aria-disabled, not focusable, ignores clicks', () => {
    const onClick = vi.fn();
    render(<BreadcrumbLink href="/a" disabled onClick={onClick}>A</BreadcrumbLink>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveClass('text-[color:var(--scanner-text-disabled)]');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('skeleton: hidden placeholder bar, no link', () => {
    const { container } = render(<BreadcrumbLink href="#" skeleton>Page name</BreadcrumbLink>);
    expect(screen.queryByRole('link')).toBeNull();
    const placeholder = container.querySelector('[data-skeleton]');
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(placeholder?.querySelector('.bg-\\[var\\(--scanner-bg-highlight-gray\\)\\]')).not.toBeNull();
  });

  it('current page renders plain text with aria-current', () => {
    render(<BreadcrumbLink isCurrent>Here</BreadcrumbLink>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Here')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards the ref to the anchor and merges className on the wrapper', () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(<BreadcrumbLink ref={ref} href="#" className="custom">A</BreadcrumbLink>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
