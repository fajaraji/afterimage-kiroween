export type Brush = CanvasRenderingContext2D;
export function cut(c: Brush, d: string, fill: string, edge?: string, width = 1) {
  const p = new Path2D(d);
  c.fillStyle = fill;
  c.fill(p);
  if (edge) {
    c.strokeStyle = edge;
    c.lineWidth = width;
    c.stroke(p);
  }
}
export function etch(c: Brush, d: string, ink: string, width = 1) {
  c.strokeStyle = ink;
  c.lineWidth = width;
  c.stroke(new Path2D(d));
}
export function oval(c: Brush, x: number, y: number, rx: number, ry: number, ink: string) {
  c.fillStyle = ink;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
}
export function lightPool(c: Brush, x: number, y: number, r: number, inner: string, outer: string) {
  const light = c.createRadialGradient(x, y, 0, x, y, r);
  light.addColorStop(0, inner);
  light.addColorStop(1, outer);
  c.fillStyle = light;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}
