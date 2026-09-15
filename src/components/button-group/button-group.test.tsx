import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button';
import { SplitButton } from '../split-button';

describe('ButtonGroup', () => {
  it('renders a role="group" with its children', () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Actions' });
    expect(group.querySelectorAll('button')).toHaveLength(2);
  });

  it('defaults to Size=Large, Position=Horizontal with a 16px gap', () => {
    render(<ButtonGroup><Button>One</Button></ButtonGroup>);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-position', 'horizontal');
    expect(group).toHaveAttribute('data-size', 'large');
    expect(group).toHaveClass('flex-row', 'gap-[var(--scanner-spacing-5)]');
  });

  it.each([
    ['large', 'vertical'],
    ['medium', 'horizontal'],
    ['medium', 'vertical'],
    ['small', 'horizontal'],
    ['small', 'vertical'],
  ] as const)('uses an 8px gap for Size=%s, Position=%s', (size, position) => {
    render(<ButtonGroup size={size} position={position}><Button>One</Button></ButtonGroup>);
    const group = screen.getByRole('group');
    expect(group).toHaveClass('gap-[var(--scanner-spacing-3)]');
    expect(group).toHaveClass(position === 'vertical' ? 'flex-col' : 'flex-row');
  });

  it('supports the deprecated orientation alias', () => {
    render(<ButtonGroup orientation="vertical"><Button>One</Button></ButtonGroup>);
    expect(screen.getByRole('group')).toHaveAttribute('data-position', 'vertical');
  });

  it('passes size to Button and SplitButton children without their own size', () => {
    render(
      <ButtonGroup size="small">
        <Button>Inherit</Button>
        <Button size="large">Own</Button>
        <SplitButton>Split</SplitButton>
        <span data-testid="plain">plain</span>
      </ButtonGroup>,
    );
    expect(screen.getByRole('button', { name: 'Inherit' })).toHaveClass('min-h-[var(--scanner-button-height-sm)]');
    expect(screen.getByRole('button', { name: 'Own' })).toHaveClass('min-h-[var(--scanner-button-height-lg)]');
    expect(screen.getByRole('button', { name: 'Split' })).toHaveClass('min-h-[var(--scanner-button-height-sm)]');
    expect(screen.getByTestId('plain')).not.toHaveAttribute('size');
  });

  it('forwards the ref, merges className and passes HTML attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ButtonGroup ref={ref} className="custom" id="g1">
        <Button>One</Button>
      </ButtonGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('id', 'g1');
  });
});
