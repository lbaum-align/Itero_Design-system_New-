export type PageEntry = number | 'ellipsis';

/**
 * Pages (and "…" markers) to render — always at most 7 slots, as in Figma (1 2 3 4 5 … 10).
 *
 * - 7 or fewer pages → all pages
 * - Near the start  → 1 2 3 4 5 … N
 * - Near the end    → 1 … N-4 N-3 N-2 N-1 N
 * - In the middle   → 1 … P-1 P P+1 … N
 */
export function getVisiblePages(current: number, total: number): PageEntry[] {
  const count = Math.max(0, Math.floor(total));
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', count];
  if (current >= count - 3) return [1, 'ellipsis', count - 4, count - 3, count - 2, count - 1, count];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', count];
}
