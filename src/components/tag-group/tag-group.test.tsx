import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { TagGroup } from './TagGroup';
import { Tag } from '../tag';

describe('TagGroup', () => {
  it('renders a wrapping group with its tags', () => {
    render(
      <TagGroup aria-label="Filters">
        <Tag>One</Tag>
        <Tag>Two</Tag>
      </TagGroup>,
    );
    const group = screen.getByRole('group', { name: 'Filters' });
    expect(group).toHaveClass('flex-wrap');
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('defaults to Large (Figma default) with an 8px gap', () => {
    render(<TagGroup><Tag>One</Tag></TagGroup>);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-size', 'large');
    expect(group).toHaveClass('gap-[var(--scanner-spacing-3)]');
  });

  it('uses a 4px gap for Extra small', () => {
    render(<TagGroup size="extra-small"><Tag>One</Tag></TagGroup>);
    expect(screen.getByRole('group')).toHaveClass('gap-[var(--scanner-spacing-2)]');
  });

  it('passes its size to child tags', () => {
    render(
      <TagGroup size="small">
        <Tag onDismiss={() => {}}>One</Tag>
      </TagGroup>,
    );
    // Small tags use a 24px close icon and 4px gap/padding
    const tag = screen.getByText('One').parentElement!;
    expect(tag).toHaveClass('gap-[var(--scanner-spacing-2)]');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TagGroup ref={ref} className="custom"><Tag>One</Tag></TagGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
