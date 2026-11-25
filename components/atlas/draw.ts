import { evidence, STORE_IDS } from '../../lib/case';
import type { CaseFile, Command, StoreEvidence, StoreId } from '../../lib/case';
import type { Playback } from '../../lib/trace';
import { along, clamp, pathBetween, smooth } from './geometry';
import type { Plan, Point, Trail } from './geometry';
import { cypress, landmark, lot } from './landmarks';

type Brush = CanvasRenderingContext2D;
const mint = '#c8f4ce',
  amber = '#fad49a',
  ink = '#18241f';
export const TRACE_SECONDS = 2.6;

export function drawTerrain(c: Brush, plan: Plan) {
  const { width: w, height: h, scale: s } = plan;
  c.fillStyle = '#1e2b25';
  c.fillRect(0, 0, w, h);
  // Contour the ground around all four plots as one survey, in atlas coordinates.
  const step = 8,
    cols = Math.ceil(w / step) + 1,
    rows = Math.ceil(h / step) + 1;
  const elevations = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const x = i * step,
        y = j * step;
      let level = 0.08 * Math.sin(x * 0.018 + y * 0.027) + 0.035 * Math.cos(y * 0.053 - x * 0.014);
      for (const [px, py] of Object.values(plan.plots)) {
        level += Math.exp(-(((x - px) / (110 * s)) ** 2 + ((y - py) / (47 * s)) ** 2) * 0.7);
      }
      elevations[j * cols + i] = level;
    }
  for (let l = 1; l <= 15; l++) {
    const threshold = l * 0.064;
    c.beginPath();
    for (let j = 0; j < rows - 1; j++)
      for (let i = 0; i < cols - 1; i++) {
        const k = j * cols + i,
          v = [elevations[k], elevations[k + 1], elevations[k + cols + 1], elevations[k + cols]];
        const p: Point[] = [
          [i * step, j * step],
          [(i + 1) * step, j * step],
          [(i + 1) * step, (j + 1) * step],
          [i * step, (j + 1) * step]
        ];
        let first: Point | null = null;
        for (let a = 0; a < 4; a++) {
          const b = (a + 1) % 4;
          if (v[a] >= threshold === v[b] >= threshold) continue;
          const t = (threshold - v[a]) / (v[b] - v[a]);
          const at: Point = [p[a][0] + t * (p[b][0] - p[a][0]), p[a][1] + t * (p[b][1] - p[a][1])];
          if (first) {
            c.moveTo(...first);
            c.lineTo(...at);
            first = null;
          } else first = at;
        }
      }
    c.lineWidth = l % 4 === 0 ? 1 : 0.58;
    c.strokeStyle = l % 4 === 0 ? '#52614e' : '#3d4e40';
    c.stroke();
  }
  // Dry-brush specks follow a repeatable seed so the survey never shimmers.
  let seed = 173;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < (w * h) / 160; i++) {
    const x = random() * w,
      y = random() * h;
    c.fillStyle = i % 2 ? '#b5c3a51a' : '#17231d66';
    c.fillRect(x, y, random() * 2 + 0.35, 0.55);
  }
  // Registration ticks mark the edge of the drawn sheet.
  c.strokeStyle = '#8b9a80';
  c.lineWidth = 0.75;
  for (const [x, y, dx, dy] of [
    [11, 11, 1, 1],
    [w - 11, 11, -1, 1],
    [11, h - 11, 1, -1],
    [w - 11, h - 11, -1, -1]
  ]) {
    c.beginPath();
    c.moveTo(x + dx * 7, y);
    c.lineTo(x, y);
    c.lineTo(x, y + dy * 7);
    c.stroke();
  }
}

function route(c: Brush, tr: Trail, color: string, width: number, dashes: number[] = []) {
  c.beginPath();
  c.moveTo(...tr.start);
  c.bezierCurveTo(...tr.c1, ...tr.c2, ...tr.end);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.setLineDash(dashes);
  c.stroke();
  c.setLineDash([]);
}
function arrow(c: Brush, tr: Trail, t: number, color: string) {
  const [x, y] = along(tr, t),
    [x2, y2] = along(tr, Math.min(0.999, t + 0.01));
  c.save();
  c.translate(x, y);
  c.rotate(Math.atan2(y2 - y, x2 - x));
  c.beginPath();
  c.moveTo(-3.7, -2.7);
  c.lineTo(1, 0);
  c.lineTo(-3.7, 2.7);
  c.strokeStyle = color;
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();
}
function paper(c: Brush, x: number, y: number, size: number, color: string) {
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  c.rotate(-0.13);
  c.beginPath();
  c.moveTo(-5, -7);
  c.lineTo(2, -7);
  c.lineTo(5, -4);
  c.lineTo(5, 7);
  c.lineTo(-5, 7);
  c.closePath();
  c.fillStyle = color;
  c.fill();
  c.strokeStyle = ink;
  c.lineWidth = 1.05;
  c.stroke();
  c.beginPath();
  c.moveTo(-2.5, -1.5);
  c.lineTo(2.3, -1.5);
  c.moveTo(-2.5, 1.7);
  c.lineTo(1.2, 1.7);
  c.stroke();
  c.restore();
}
function travel(c: Brush, tr: Trail, progress: number, color: string, size = 1) {
  if (progress < 0 || progress > 1) return;
  const t = smooth(progress);
  c.save();
  c.lineCap = 'round';
  for (let j = 1; j <= 13; j++) {
    const a = Math.max(0, t - (j - 1) * 0.011),
      b = Math.max(0, t - j * 0.011);
    c.beginPath();
    c.moveTo(...along(tr, a));
    c.lineTo(...along(tr, b));
    c.strokeStyle = color;
    c.globalAlpha = (14 - j) / 16;
    c.lineWidth = (3 * (14 - j)) / 13 + 0.6;
    c.stroke();
  }
  c.globalAlpha = 1;
  const [x, y] = along(tr, t);
  paper(c, x, y, size, color);
  c.restore();
}
function headstone(c: Brush) {
  c.beginPath();
  c.moveTo(-7, 3);
  c.lineTo(-7, -6);
  c.bezierCurveTo(-7, -15, 6, -16, 7, -7);
  c.lineTo(7, 3);
  c.closePath();
  c.fillStyle = '#a5af9b';
  c.fill();
  c.strokeStyle = ink;
  c.lineWidth = 1.2;
  c.stroke();
  c.fillStyle = '#667866';
  c.fillRect(-8, 2, 16, 3);
  c.fillStyle = ink;
  c.fillRect(-3, -7, 6, 1);
  c.fillRect(-2, -4, 4, 1);
}
function phantom(c: Brush, color: string) {
  c.beginPath();
  c.moveTo(-10, 1);
  c.bezierCurveTo(-10, -5, -13, -9, -9, -16);
  c.bezierCurveTo(-6, -24, 5, -25, 9, -17);
  c.bezierCurveTo(12, -10, 7, -5, 15, 0);
  c.quadraticCurveTo(11, 2, 7, -2);
  c.quadraticCurveTo(10, 8, 3, 5);
  c.quadraticCurveTo(1, 2, -1, 1);
  c.quadraticCurveTo(-3, 9, -7, 5);
  c.quadraticCurveTo(-7, 1, -10, 1);
  c.fillStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 6;
  c.fill();
  c.shadowBlur = 0;
  c.strokeStyle = '#203a30';
  c.lineWidth = 1.1;
  c.stroke();
  c.fillStyle = '#27483b';
  c.beginPath();
  c.ellipse(-4.5, -12, 1.5, 2.6, -0.12, 0, 2 * Math.PI);
  c.ellipse(2.3, -13, 1.5, 2.5, 0, 0, 2 * Math.PI);
  c.fill();
}
function marker(c: Brush, item: StoreEvidence, lift = 1) {
  if (item.finding === 'clear' && !item.pendingCheck) {
    headstone(c);
    return;
  }
  if (item.finding === 'found' || item.finding === 'returned') {
    c.save();
    c.translate(0, -11 * lift);
    c.globalAlpha *= item.pendingCheck ? 0.6 : lift;
    phantom(c, item.finding === 'returned' ? amber : mint);
    c.restore();
  } else {
    c.save();
    c.strokeStyle = item.finding === 'unreachable' ? '#e0bc84' : '#b4bea5';
    c.lineWidth = 1;
    c.setLineDash([2, 2]);
    c.beginPath();
    c.ellipse(0, 1, 8, 3.5, 0, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }
  if (item.pendingCheck) {
    c.fillStyle = '#e1c08d';
    c.fillRect(8, -6, 1.6, 5);
    c.fillRect(8, 0.8, 1.6, 1.6);
  }
}
function readRing(c: Brush, t: number) {
  if (t < 0 || t > 1) return;
  c.save();
  c.globalAlpha = 1 - t * 0.8;
  c.strokeStyle = mint;
  c.lineWidth = 1.7;
  c.beginPath();
  c.ellipse(0, 0, 12 + 56 * t, 5 + 22 * t, 0, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.ellipse(0, 0, 70, 28, 0, -Math.PI + t * 6.3, -Math.PI + t * 6.3 + 0.68);
  c.stroke();
  c.restore();
}
function erasure(c: Brush, t: number) {
  if (t < 0 || t > 1) return;
  c.save();
  c.globalAlpha = 1 - clamp((t - 0.73) / 0.27);
  c.fillStyle = '#101b16';
  c.beginPath();
  c.ellipse(0, 1, 10, 3, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.rect(-18, -45, 36, 46);
  c.clip();
  paper(c, 0, -21 + 27 * smooth(t), 1.15, '#e6d6ac');
  for (let j = 0; j < 5; j++) {
    c.fillStyle = '#dac69e';
    c.fillRect(-7 + j * 3, 2 - 9 * Math.sin(Math.PI * t + j * 0.2), 1.1, 2.5);
  }
  c.restore();
}
const planted = {
  primary: [
    [-36, -9, 39],
    [-52, -3, 28]
  ],
  analytics: [
    [35, -8, 30],
    [47, -3, 21]
  ],
  export: [
    [-38, -11, 33],
    [34, -10, 26]
  ],
  backup: [
    [26, -16, 46],
    [47, -8, 31]
  ]
} as const;

function drawPlot(
  c: Brush,
  plan: Plan,
  id: StoreId,
  file: CaseFile,
  selected: StoreId | null,
  play: Playback | null,
  t: number,
  busy: Command | null
) {
  const p = plan.plots[id],
    s = plan.scale,
    item = evidence(file, id);
  const trace = play?.trace,
    order = trace?.targets.indexOf(id) ?? -1;
  const returning = trace?.kind === 'restore' && trace.confirmedReturn && id === 'primary';
  const reading = trace?.kind === 'inspect' && order >= 0;
  const old = play?.before.find((b) => b.id === id);
  const reveal = reading
    ? smooth((t - 0.2 - order * 0.25) / 0.48)
    : returning
      ? smooth((t - 1.38) / 0.7)
      : 1;
  c.save();
  c.translate(...p);
  c.scale(s, s);
  lot(c, STORE_IDS.indexOf(id));
  planted[id].forEach(([x, y, h]) => cypress(c, x, y, h));
  const door =
    trace?.kind === 'restore' && trace.source === id
      ? smooth(t / 0.38) * (1 - smooth((t - 1.65) / 0.55))
      : 0;
  landmark(c, id, door);
  if (
    selected === id ||
    (busy &&
      (busy.type === 'scan' ||
        ('store' in busy && busy.store === id) ||
        (busy.type === 'erase-primary' && id === 'primary') ||
        (busy.type === 'restore' && id === 'backup')))
  ) {
    c.beginPath();
    c.ellipse(0, 3, 65, 25, 0, 0.36, 2.84);
    c.strokeStyle = selected === id ? '#c7d6b9' : '#b5d6b8';
    c.lineWidth = 1.8;
    c.stroke();
  }
  if (reading) readRing(c, (t - order * 0.25) / 0.83);
  c.translate(28, 8);
  if (reveal < 1 && old) {
    c.save();
    c.globalAlpha = 1 - reveal;
    marker(c, old);
    c.restore();
  }
  if (reveal > 0) {
    c.save();
    c.globalAlpha = reveal;
    marker(c, item, reveal);
    c.restore();
  }
  if (trace?.kind === 'erase' && order >= 0) erasure(c, t / 1.25);
  c.restore();
}
export function drawAtlas(
  c: Brush,
  plan: Plan,
  file: CaseFile,
  selected: StoreId | null,
  paths: boolean,
  play: Playback | null,
  t: number,
  busy: Command | null
) {
  const trace = play?.trace;
  for (const item of file.stores) {
    if (!item.sourceId || item.sourceId === item.id) continue;
    const tr = pathBetween(plan, item.sourceId, item.id);
    if (paths) {
      route(c, tr, '#18261f', 6.5);
      route(c, tr, '#73846e', 2.5);
      route(c, tr, '#27392c', 1.1, [2, 3.6]);
      arrow(c, tr, 0.6, '#c0c9ae');
    }
  }
  const primary = evidence(file, 'primary');
  if (paths && primary.finding === 'returned' && primary.sourceId && primary.sourceId !== 'primary') {
    const sourceLine = pathBetween(plan, primary.sourceId, 'primary');
    route(c, sourceLine, '#e9c78e', 2, [4, 3]);
    arrow(c, sourceLine, 0.61, amber);
  }
  if (trace?.kind === 'restore' && trace.source && t < 2.35) {
    const tr = pathBetween(plan, trace.source, 'primary');
    c.save();
    c.globalAlpha = 0.82 * (1 - clamp((t - 1.8) / 0.55));
    route(c, tr, amber, 1.6, [2, 3]);
    c.restore();
  }
  for (const id of [...STORE_IDS].sort((a, b) => plan.plots[a][1] - plan.plots[b][1]))
    drawPlot(c, plan, id, file, selected, play, t, busy);
  if (trace?.kind === 'seed' && trace.source) {
    trace.targets.forEach((id, i) =>
      travel(
        c,
        pathBetween(plan, trace.source!, id),
        (t - 0.13 - i * 0.26) / 1.03,
        '#d5e7bb',
        0.85 * plan.scale
      )
    );
  }
  if (trace?.kind === 'restore' && trace.source) {
    travel(c, pathBetween(plan, trace.source, 'primary'), (t - 0.35) / 1.08, amber, 1.3 * plan.scale);
  }
}
