import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import { logoLabels } from './logo-labels';
import { logoArtwork } from './logo-artwork';
import type { LogoVariation } from './logo.types';

const VARIATIONS = Object.keys(logoArtwork) as LogoVariation[];

describe('Logo', () => {
  it('has artwork for all 8 Figma variations', () => {
    expect(VARIATIONS).toHaveLength(8);
    for (const v of VARIATIONS) {
      expect(logoArtwork[v].paths.length).toBe(logoArtwork[v].tones.length);
      expect(logoArtwork[v].height).toBe(28);
    }
  });

  it.each(VARIATIONS)('renders %s as an img with its brand name', (variation) => {
    const { container } = render(<Logo variation={variation} />);
    const svg = screen.getByRole('img', { name: logoLabels[variation] });
    expect(svg).toHaveAttribute('data-variation', variation);
    expect(svg).toHaveAttribute('height', '28');
    expect(container.querySelectorAll('path')).toHaveLength(logoArtwork[variation].paths.length);
  });

  it('defaults to the Figma default variation (Align)', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'Align' })).toBeInTheDocument();
  });

  it('colours regions with the Figma-bound tokens', () => {
    const { container } = render(<Logo variation="all-logos" />);
    const paths = [...container.querySelectorAll('path')];
    const classOf = (i: number) => paths[i].getAttribute('class');
    expect(classOf(0)).toContain('--scanner-icon-primary');
    expect(classOf(2)).toContain('--scanner-icon-link');
    expect(
      paths.filter((p) => p.getAttribute('class')?.includes('--scanner-icon-secondary')),
    ).toHaveLength(8);
    expect(
      paths.filter((p) => p.getAttribute('class')?.includes('--scanner-icon-tertiary')),
    ).toHaveLength(8);
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it('scales width with height', () => {
    render(<Logo variation="itero" height={14} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('height', '14');
    expect(svg).toHaveAttribute('width', '28');
  });

  it('supports a custom label and decorative mode', () => {
    const { container, rerender } = render(<Logo label="Home" />);
    expect(screen.getByRole('img', { name: 'Home' })).toBeInTheDocument();
    rerender(<Logo decorative />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Logo ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current).toHaveClass('custom');
  });
});
