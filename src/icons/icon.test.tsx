import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { iconNames, iconRegistry, stepNumberIconName } from './registry';
import type { IconName } from './icon.types';

describe('Icon', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders every registry icon as an svg with currentColor paths', () => {
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg, name).not.toBeNull();
      expect(svg).toHaveAttribute('viewBox', iconRegistry[name].viewBox);
      expect(svg).toHaveAttribute('data-icon', name);
      const paths = svg!.querySelectorAll('path');
      expect(paths.length, name).toBeGreaterThan(0);
      paths.forEach((p) => expect(p).toHaveAttribute('fill', 'currentColor'));
      unmount();
    }
  });

  it('uses the Figma 32×32 drawing for Figma icons', () => {
    for (const name of iconNames) {
      const entry = iconRegistry[name];
      if (entry.source === 'legacy') continue;
      expect(entry.viewBox, name).toBe('0 0 32 32');
      expect(entry.figmaName, name).toBeTruthy();
    }
  });

  it('defaults to 20px and applies the size prop to width and height', () => {
    const { container, rerender } = render(<Icon name="add" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    rerender(<Icon name="add" size={32} />);
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('is decorative (aria-hidden, no role) without a label', () => {
    const { container } = render(<Icon name="search" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).not.toHaveAttribute('aria-label');
  });

  it('exposes role="img" and an accessible name with a label', () => {
    render(<Icon name="search" label="Search" />);
    const svg = screen.getByRole('img', { name: 'Search' });
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('merges className and forwards extra attributes and the ref', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<Icon ref={ref} name="close" className="custom" data-part="x" />);
    const svg = container.querySelector('svg')!;
    expect(ref.current).toBe(svg);
    expect(svg).toHaveClass('shrink-0', 'custom');
    expect(svg).toHaveAttribute('data-part', 'x');
  });

  it('shares one drawing between aliases', () => {
    expect(iconRegistry.close).toBe(iconRegistry['close-empty']);
    expect(iconRegistry.external).toBe(iconRegistry.launch);
    expect(iconRegistry.eye).toBe(iconRegistry.view);
    expect(iconRegistry['eye-off']).toBe(iconRegistry['view-off']);
    expect(iconRegistry.info).toBe(iconRegistry.information);
    expect(iconRegistry.minus).toBe(iconRegistry['subtract-empty']);
  });

  it('maps step numbers to the Figma number glyphs', () => {
    expect(stepNumberIconName(3, false)).toBe('number-outline-3');
    expect(stepNumberIconName(8, true)).toBe('number-filled-8');
    expect(iconRegistry['number-filled-8'].figmaName).toBe('Number filled / 8');
  });

  it('warns and renders nothing for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon name={'does-not-exist' as IconName} />);
    expect(container.firstChild).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'));
  });
});
