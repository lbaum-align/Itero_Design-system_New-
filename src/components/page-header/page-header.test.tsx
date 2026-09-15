import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { Breadcrumbs } from '../breadcrumbs';
import { TabGroup } from '../tab-group';
import { TabItem } from '../_tab-item/TabItem';
import { Button } from '../button';

const crumbs = <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Patients', href: '/patients' }]} />;
const tabs = (
  <TabGroup aria-label="Sections">
    <TabItem>Overview</TabItem>
    <TabItem>Scans</TabItem>
  </TabGroup>
);

describe('PageHeader', () => {
  it('renders a header landmark with the title as h1', () => {
    const { container } = render(<PageHeader title="Patients" />);
    expect(container.firstChild?.nodeName).toBe('HEADER');
    expect(screen.getByRole('heading', { level: 1, name: 'Patients' })).toHaveClass('scanner-text-display-regular-01');
  });

  it('hides optional slots when not provided', () => {
    const { container } = render(<PageHeader title="T" />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders the subtitle with small (14/20) secondary text', () => {
    render(<PageHeader title="T" subtitle="Sub" />);
    expect(screen.getByText('Sub')).toHaveClass(
      'text-[length:var(--scanner-text-sm)]',
      'leading-[var(--scanner-leading-sm)]',
      'text-[color:var(--scanner-text-secondary)]',
    );
  });

  it('renders breadcrumbs, actions and tabs in Figma order', () => {
    render(<PageHeader title="T" breadcrumbs={crumbs} actions={<Button>Create</Button>} tabs={tabs} />);
    const nav = screen.getByRole('navigation');
    const heading = screen.getByRole('heading');
    const action = screen.getByRole('button', { name: 'Create' });
    const tablist = screen.getByRole('tablist');
    expect(nav.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(action.compareDocumentPosition(tablist) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  describe('spacing per Figma variant', () => {
    it('Show breadcrumbs=False, Show tabs=False → 48 top / 32 bottom / 24 gap', () => {
      const { container } = render(<PageHeader title="T" />);
      expect(container.firstChild).toHaveClass(
        'pt-[var(--scanner-spacing-10)]',
        'pb-[var(--scanner-spacing-8)]',
        'gap-[var(--scanner-spacing-7)]',
      );
    });

    it('Show breadcrumbs=True, Show tabs=True → 24 top / 0 bottom / 32 gap', () => {
      const { container } = render(<PageHeader title="T" breadcrumbs={crumbs} tabs={tabs} />);
      expect(container.firstChild).toHaveClass('pt-[var(--scanner-spacing-7)]', 'pb-0', 'gap-[var(--scanner-spacing-8)]');
      expect(container.firstChild).toHaveAttribute('data-breadcrumbs', 'true');
      expect(container.firstChild).toHaveAttribute('data-tabs', 'true');
    });
  });

  it('forwards the ref, merges className and spreads HTML attributes', () => {
    const ref = createRef<HTMLElement>();
    render(<PageHeader ref={ref} title="T" className="custom" aria-label="Page" />);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('aria-label', 'Page');
  });
});
