import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Cursor } from './Cursor';
import { cursorAssets, cursorSvg } from './cursor-assets';
import { cursorStyle, cursorValue } from './cursor-value';
import type { CursorType } from './cursor.types';

const TYPES = Object.keys(cursorAssets) as CursorType[];

describe('Cursor', () => {
  it('covers all 11 Figma types', () => {
    expect(TYPES).toHaveLength(11);
    expect(TYPES.map((t) => cursorAssets[t].figmaName)).toEqual([
      'Pointer',
      'Pointer pressed',
      'Hand open',
      'Hand closed',
      'Text',
      'Text pressed',
      'Arrow',
      'Arrow not allowed',
      'Resize width',
      'Resize height',
      'Resize diagonal',
    ]);
  });

  it.each(TYPES)('renders the %s glyph as a 24×24 svg', (type) => {
    const { container } = render(<Cursor type={type} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('data-cursor', type);
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('defaults to Pointer and is decorative without a label', () => {
    const { container } = render(<Cursor />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('data-cursor', 'pointer');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes an img role with a label', () => {
    render(<Cursor type="text" label="Text cursor" />);
    expect(screen.getByRole('img', { name: 'Text cursor' })).toBeInTheDocument();
  });

  it('scopes filter ids per instance', () => {
    const { container } = render(
      <>
        <Cursor type="arrow" />
        <Cursor type="arrow" />
      </>,
    );
    const ids = [...container.querySelectorAll('filter')].map((f) => f.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    const [first] = container.querySelectorAll('g');
    expect(first.getAttribute('filter')).toBe(`url(#${ids[0]})`);
  });

  it('pressed types add the Figma press ring to the base glyph', () => {
    expect(cursorAssets['pointer-pressed'].markup.endsWith(cursorAssets.pointer.markup)).toBe(true);
    expect(cursorAssets['text-pressed'].markup.endsWith(cursorAssets.text.markup)).toBe(true);
    expect(cursorAssets['pointer-pressed'].markup).toContain('fill-opacity="0.12"');
  });

  it('builds a CSS cursor value with data URI, hotspot and fallback', () => {
    const v = cursorValue('resize-width');
    expect(v.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(v.endsWith('") 12 12, ew-resize')).toBe(true);
    expect(decodeURIComponent(v.slice(24, v.indexOf('")')))).toBe(cursorSvg('resize-width'));
    expect(cursorStyle('pointer')).toEqual({ cursor: cursorValue('pointer') });
    expect(cursorValue('pointer')).toMatch(/\) 8 4, pointer$/);
  });

  it('forwards ref, size and className', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Cursor ref={ref} size={48} className="custom" />);
    expect(ref.current).toHaveAttribute('width', '48');
    expect(ref.current).toHaveClass('custom');
  });
});
