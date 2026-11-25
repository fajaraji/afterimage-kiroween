import type { StoreId } from '../../lib/case';

export type Point = readonly [number, number];
export interface Plan {
  width: number;
  height: number;
  scale: number;
  plots: Record<StoreId, Point>;
}
export const WIDE: Plan = {
  width: 800,
  height: 359,
  scale: 1.12,
  plots: { primary: [260, 134], analytics: [609, 103], export: [143, 264], backup: [534, 264] }
};
export const NARROW: Plan = {
  width: 430,
  height: 360,
  scale: 0.84,
  plots: { primary: [111, 103], analytics: [324, 113], export: [90, 258], backup: [311, 259] }
};
export const NARROW_WIDTH = 550;

// The same cubic drives the inked path, direction mark and travelling record.
export function pathBetween(plan: Plan, from: StoreId, to: StoreId) {
  const a = plan.plots[from],
    b = plan.plots[to];
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  const length = Math.hypot(dx, dy),
    ux = dx / length,
    uy = dy / length;
  const xpad = 56 * plan.scale,
    ypad = 21 * plan.scale;
  const bend = (from < to ? 1 : -1) * Math.min(34, length * 0.13);
  const start: Point = [a[0] + ux * xpad, a[1] + uy * ypad];
  const end: Point = [b[0] - ux * xpad, b[1] - uy * ypad];
  const c1: Point = [start[0] + dx * 0.24 - uy * bend, start[1] + dy * 0.24 + ux * bend];
  const c2: Point = [end[0] - dx * 0.24 - uy * bend, end[1] - dy * 0.24 + ux * bend];
  return { start, end, c1, c2 };
}
export type Trail = ReturnType<typeof pathBetween>;
export function along({ start, c1, c2, end }: Trail, t: number): Point {
  const u = 1 - t;
  return [
    u * u * u * start[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * end[0],
    u * u * u * start[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * end[1]
  ];
}
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
