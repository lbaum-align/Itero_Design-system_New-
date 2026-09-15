import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Patients', href: '/patients' },
  { label: 'Jane', href: '/patients/1' },
];

const dividers = (el: HTMLElement) => el.querySelectorAll('[data-divider]').length;

describe('Breadcrumbs', () => {
  it('renders a labelled nav with an ordered list of links', () => {
    render(<Breadcrumbs items={links} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(within(nav).getAllByRole('link')).toHaveLength(3);
  });

  it('Show current page=False: every item is a link, dividers between them only', () => {
    const { container } = render(<Breadcrumbs items={links} />);
    expect(screen.queryByText('Jane')).not.toHaveAttribute('aria-current');
    expect(dividers(container)).toBe(2);
  });

  it('Show current page=True: last item is plain text, no divider before it', () => {
    const { container } = render(
      <Breadcrumbs items={[...links, { label: 'Scan 12' }]} showCurrentPage />,
    );
    expect(screen.getByText('Scan 12')).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(dividers(container)).toBe(2);
  });

  it('infers the current page when the last item has no href (backwards compatible)', () => {
    render(<Breadcrumbs items={[links[0], { label: 'Widget' }]} />);
    expect(screen.getByText('Widget')).toHaveAttribute('aria-current', 'page');
  });

  it('Show overflow collapses the middle and expands on click, focusing the first revealed link', () => {
    const items = ['A', 'B', 'C', 'D', 'E', 'F'].map((l) => ({ label: l, href: `#${l}` }));
    render(<Breadcrumbs items={items} showOverflow maxVisibleItems={3} />);
    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(['A', 'E', 'F']);
    const more = screen.getByRole('button', { name: 'Show 3 more breadcrumbs' });
    fireEvent.click(more);
    expect(screen.getAllByRole('link')).toHaveLength(6);
    expect(screen.getByRole('link', { name: 'B' })).toHaveFocus();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does not collapse short trails', () => {
    render(<Breadcrumbs items={links} showOverflow />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('supports disabled items and skeleton', () => {
    const { container, rerender } = render(
      <Breadcrumbs items={[links[0], { ...links[1], disabled: true }]} />,
    );
    expect(screen.getByRole('link', { name: 'Patients' })).toHaveAttribute('aria-disabled', 'true');
    rerender(<Breadcrumbs items={links} skeleton />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(container.querySelectorAll('[data-skeleton]')).toHaveLength(3);
  });

  it('returns null for an empty trail', () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('forwards the ref, merges className, accepts a custom aria-label', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={links} className="custom" aria-label="Location" />);
    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current).toHaveClass('custom');
    expect(screen.getByRole('navigation', { name: 'Location' })).toBeInTheDocument();
  });
});
