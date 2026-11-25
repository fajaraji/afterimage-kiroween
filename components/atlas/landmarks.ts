import type { StoreId } from '../../lib/case';
import type { Point } from './geometry';

type Brush = CanvasRenderingContext2D;
const ink = '#17231f',
  light = '#c6c9ad',
  stone = '#949e86',
  side = '#606f61',
  shade = '#405247';
const project = (x: number, z: number, h = 0): Point => [x - z, (x + z) * 0.44 - h];
function polygon(c: Brush, points: Point[], fill: string, stroke = ink, weight = 1) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (weight) {
    c.strokeStyle = stroke;
    c.lineWidth = weight;
    c.stroke();
  }
}
function line(c: Brush, a: Point, b: Point, color: string, width = 0.9) {
  c.beginPath();
  c.moveTo(...a);
  c.lineTo(...b);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}
function block(
  c: Brush,
  x: number,
  z: number,
  w: number,
  d: number,
  base: number,
  h: number,
  top = light,
  front = stone,
  right = side
) {
  const roof = base + h;
  polygon(
    c,
    [
      project(x, z + d, base),
      project(x + w, z + d, base),
      project(x + w, z + d, roof),
      project(x, z + d, roof)
    ],
    front
  );
  polygon(
    c,
    [
      project(x + w, z, base),
      project(x + w, z + d, base),
      project(x + w, z + d, roof),
      project(x + w, z, roof)
    ],
    right
  );
  polygon(
    c,
    [project(x, z, roof), project(x + w, z, roof), project(x + w, z + d, roof), project(x, z + d, roof)],
    top
  );
}
function face(c: Brush, offset: number, isSide: boolean, draw: () => void) {
  c.save();
  c.transform(isSide ? -1 : 1, 0.44, 0, 1, isSide ? offset : -offset, offset * 0.44);
  draw();
  c.restore();
}
function arch(c: Brush, x: number, base: number, w: number, h: number, bars = 2, open = 0) {
  c.save();
  c.translate(x, -base);
  c.beginPath();
  c.moveTo(-w / 2, 0);
  c.lineTo(-w / 2, -h + w / 2);
  c.arc(0, -h + w / 2, w / 2, Math.PI, Math.PI * 2);
  c.lineTo(w / 2, 0);
  c.closePath();
  c.fillStyle = ink;
  c.fill();
  c.strokeStyle = '#b8bea5';
  c.lineWidth = 1.4;
  c.stroke();
  c.clip();
  for (let i = 1; i <= bars; i++) {
    const xx = -w / 2 + (w * i) / (bars + 1);
    const shift = (i <= (bars + 1) / 2 ? -1 : 1) * open * w * 0.55;
    line(c, [xx + shift, 0], [xx + shift, -h], side, 1.6);
  }
  line(c, [-w / 2, -h * 0.34], [w / 2, -h * 0.34], open > 0.5 ? ink : side, 1);
  c.restore();
}
function gable(c: Brush, x: number, z: number, w: number, d: number, eave: number, rise: number) {
  const ridge = x + w / 2;
  polygon(
    c,
    [
      project(x, z, eave),
      project(ridge, z, eave + rise),
      project(ridge, z + d, eave + rise),
      project(x, z + d, eave)
    ],
    '#8e9c88'
  );
  polygon(
    c,
    [
      project(ridge, z, eave + rise),
      project(x + w, z, eave),
      project(x + w, z + d, eave),
      project(ridge, z + d, eave + rise)
    ],
    '#536957'
  );
  for (let i = 3; i < d; i += 4)
    line(c, project(ridge, z + i, eave + rise), project(x + w, z + i, eave), '#93a28a', 0.7);
  polygon(
    c,
    [project(x, z + d, eave), project(ridge, z + d, eave + rise), project(x + w, z + d, eave)],
    light
  );
  line(c, project(x + 3, z + d, eave + 1), project(ridge, z + d, eave + rise - 3), side);
  line(c, project(ridge, z + d, eave + rise - 3), project(x + w - 3, z + d, eave + 1), side);
}
function chapel(c: Brush) {
  block(c, -27, -15, 52, 37, 0, 3);
  block(c, -25, -17, 48, 35, 3, 4);
  block(c, -20, -18, 40, 31, 7, 31);
  face(c, 13, false, () => {
    arch(c, 0, 7, 14, 24, 3);
  });
  face(c, 20, true, () => {
    [-11, 1, 9].forEach((z) => arch(c, z, 14, 3.8, 15, 0));
  });
  for (const x of [-20, -11, 11, 18]) {
    block(c, x, 13, 3.7, 3.7, 7, 3);
    block(c, x + 0.5, 13.5, 2.7, 2.7, 10, 25, light, '#c3c5a7', side);
    block(c, x, 13, 3.7, 3.7, 35, 3);
  }
  block(c, -23, -20, 46, 38, 38, 3);
  gable(c, -24, -20, 48, 39, 41, 14);
  block(c, -11, -12, 10, 10, 48, 11);
  gable(c, -12, -13, 12, 12, 59, 11);
  line(c, project(-6, -7, 67), project(-6, -7, 77), light, 1.2);
}
function dome(c: Brush) {
  block(c, -22, -18, 42, 36, 0, 4);
  block(c, -19, -16, 36, 30, 4, 3);
  c.fillStyle = side;
  c.beginPath();
  c.ellipse(0, -7, 25, 10, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(-25, -7);
  c.lineTo(-25, -29);
  c.ellipse(0, -29, 25, 10, 0, Math.PI, 0, true);
  c.lineTo(25, -7);
  c.ellipse(0, -7, 25, 10, 0, 0, Math.PI);
  c.fillStyle = stone;
  c.fill();
  c.strokeStyle = ink;
  c.stroke();
  for (let a = 0.16; a < Math.PI; a += Math.PI / 7) {
    const x = Math.cos(a) * 24,
      y = Math.sin(a) * 9;
    line(c, [x, -28 + y], [x, -8 + y], side, 1);
    if (a > 0.45) {
      line(c, [x + 1, -24 + y], [x + 1, -15 + y], ink, 2.1);
    }
  }
  c.beginPath();
  c.ellipse(0, -29, 27, 10, 0, 0, Math.PI * 2);
  c.fillStyle = side;
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(-26, -29);
  c.bezierCurveTo(-24, -71, 23, -72, 26, -29);
  c.ellipse(0, -29, 26, 9, 0, 0, Math.PI);
  c.fillStyle = '#93a792';
  c.fill();
  c.strokeStyle = ink;
  c.stroke();
  for (const off of [-20, -10, 0, 10, 20]) {
    c.beginPath();
    c.moveTo(0, -60);
    c.quadraticCurveTo(off * 0.8, -58, off, -29 + 8 * Math.sqrt(1 - (off / 26) ** 2));
    c.strokeStyle = '#425b50';
    c.stroke();
  }
  c.beginPath();
  c.ellipse(0, -33, 25, 9, 0, 0, Math.PI);
  c.strokeStyle = light;
  c.stroke();
  line(c, [0, -60], [0, -72], light, 1.4);
  polygon(
    c,
    [
      [0, -73],
      [7, -70],
      [0, -68]
    ],
    '#c6b788'
  );
}
function archive(c: Brush) {
  block(c, -26, -14, 53, 33, 0, 4);
  block(c, -21, -13, 43, 27, 4, 27);
  face(c, 14, false, () => {
    arch(c, -11, 9, 7, 13, 1);
    arch(c, 4, 4, 10, 19, 2);
    arch(c, 15, 12, 4, 10, 0);
  });
  face(c, 22, true, () => {
    [-7, 3, 10].forEach((z) => arch(c, z, 11, 4, 12, 0));
  });
  gable(c, -25, -15, 51, 32, 31, 17);
  block(c, 8, -11, 5, 5, 35, 15);
  block(c, 7, -12, 7, 7, 50, 2);
  for (let i = 0; i < 3; i++) block(c, -17 + i * 1.3, 17 + i, 14, 8, 1 + i * 1.7, 1.4, light, side, stone);
}
function vault(c: Brush, opening: number) {
  block(c, -26, -18, 53, 38, 0, 4);
  block(c, -24, -16, 49, 34, 4, 23, '#8c9985', '#adb196', side);
  face(c, 25, true, () => {
    for (let z = -13; z < 17; z += 7) line(c, [z, -5], [z, -25], shade, 1.8);
  });
  block(c, -26, -17, 53, 37, 26, 4);
  polygon(
    c,
    [project(-26, -17, 30), project(-18, -12, 39), project(-18, 14, 39), project(-26, 20, 30)],
    stone
  );
  polygon(
    c,
    [project(-18, -12, 39), project(17, -12, 39), project(17, 14, 39), project(-18, 14, 39)],
    light
  );
  polygon(c, [project(17, -12, 39), project(27, -17, 30), project(27, 20, 30), project(17, 14, 39)], side);
  polygon(c, [project(-26, 20, 30), project(-18, 14, 39), project(17, 14, 39), project(27, 20, 30)], stone);
  face(c, 19, false, () => {
    arch(c, 0, 4, 23, 22, 6, opening);
    for (const x of [-20, 17]) {
      c.fillStyle = side;
      c.fillRect(x, -25, 3, 20);
    }
  });
  for (let i = 0; i < 3; i++) block(c, -14, 20 + i * 2.5, 28, 3, 0, 3.8 - i);
}
export function cypress(c: Brush, x: number, y: number, height: number) {
  c.save();
  c.translate(x, y);
  const w = height * 0.14;
  line(c, [0, 0], [0, -height * 0.43], '#87917b', 1.5);
  polygon(
    c,
    [
      [0, -height],
      [-w * 0.45, -height * 0.7],
      [-w * 0.38, -height * 0.65],
      [-w, -height * 0.3],
      [-w * 0.76, -height * 0.18],
      [0, -height * 0.12],
      [w * 0.88, -height * 0.24],
      [w * 0.64, -height * 0.54],
      [w * 0.32, -height * 0.72]
    ],
    '#384f42',
    '#667664',
    0.8
  );
  polygon(
    c,
    [
      [0, -height * 0.94],
      [-w * 0.45, -height * 0.68],
      [-w * 0.3, -height * 0.65],
      [-w * 0.84, -height * 0.3],
      [-w * 0.55, -height * 0.26],
      [0, -height * 0.44]
    ],
    '#7b8e74',
    ink,
    0.3
  );
  c.restore();
}
const LOT: Point[] = [
  [-62, -9],
  [-39, -22],
  [-16, -26],
  [11, -24],
  [40, -20],
  [61, -9],
  [67, 2],
  [41, 17],
  [18, 23],
  [-7, 25],
  [-39, 16],
  [-65, 4]
];
export function lot(c: Brush, seed: number) {
  const rim = LOT.map(([x, y], i): Point => [x + Math.sin(i * 2 + seed) * 4, y + Math.cos(i + seed) * 3]);
  for (let i = 0; i < rim.length; i++) {
    const a = rim[i],
      b = rim[(i + 1) % rim.length];
    polygon(c, [a, b, [b[0], b[1] + 5], [a[0], a[1] + 5]], i % 2 ? '#506051' : '#354a3e', '#5b6957', 0.7);
  }
  polygon(c, rim, '#475846', '#94a18a', 0.9);
  for (let i = 0; i < 63; i++) {
    const x = Math.sin(i * 127.1 + seed * 2.7) * 57,
      y = Math.cos(i * 53.4 + seed) * 17;
    if (Math.abs(x) / 61 + Math.abs(y) / 26 > 1.15) continue;
    line(c, [x, y], [x + 2.5 + (i % 4), y - 1.1], i % 3 ? '#6a7b63' : '#263c31', 0.7);
  }
  // Fence posts make the boundary of each independently inspected plot legible.
  for (let i = 0; i < 8; i++) {
    const x = -55 + i * 5,
      y = -10 - i * 2.15;
    line(c, [x, y], [x, y - 8], ink, 1.2);
    line(c, [x - 1.4, y - 6.5], [x, y - 10], stone, 0.7);
    if (i < 7) line(c, [x, y - 4], [x + 5, y - 6.15], ink, 1.2);
  }
}
export function landmark(c: Brush, id: StoreId, opening = 0) {
  c.save();
  c.translate(-5, -2);
  if (id === 'primary') chapel(c);
  if (id === 'analytics') dome(c);
  if (id === 'export') archive(c);
  if (id === 'backup') vault(c, opening);
  c.restore();
}
