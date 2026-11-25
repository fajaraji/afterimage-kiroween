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
  height: 416,
  scale: 1.12,
  plots: { primary: [225, 174], analytics: [615, 157], export: [157, 307], backup: [541, 306] }
};
export const NARROW: Plan = {
  width: 430,
  height: 424,
  scale: 0.84,
  plots: { primary: [111, 154], analytics: [325, 149], export: [90, 303], backup: [310, 305] }
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
  // Neighbours in the same column share an outside path, clear of their captions.
  if (Math.abs(dy) > Math.abs(dx) * 1.15) {
    const side = a[0] + b[0] < plan.width ? -1 : 1;
    const start: Point = [a[0] + side * xpad, a[1] + plan.scale * 3];
    const end: Point = [b[0] + side * xpad, b[1] + plan.scale * 3];
    const bow = 39 * plan.scale * side;
    const c1: Point = [start[0] + bow, start[1] + dy * 0.28];
    const c2: Point = [end[0] + bow, end[1] - dy * 0.28];
    return { start, end, c1, c2 };
  }
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
