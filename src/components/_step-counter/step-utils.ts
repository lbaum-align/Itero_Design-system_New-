/** Clamp to the 1–8 steps drawn in Figma (_Step counter "Step"). */
export function clampStep(step: number): number {
  return Math.min(8, Math.max(1, Math.round(Number.isFinite(step) ? step : 1)));
}
