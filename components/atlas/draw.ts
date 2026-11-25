import { evidence, STORE_IDS } from '../../lib/case';
import type { CaseFile, Command, StoreEvidence, StoreId } from '../../lib/case';
import type { RestoreRoute } from '../../lib/investigation';
import type { Playback } from '../../lib/trace';
import { along, clamp, pathBetween, smooth } from './geometry';
import type { Plan, Trail } from './geometry';
import { landmark, lot } from './landmarks';
import { disturbedBats, foreground, groundMist } from './night';
import { cut, etch, lightPool, oval } from './print';
export { cemeteryFloor as drawTerrain } from './night';

type Brush = CanvasRenderingContext2D;
const spectral = '#d1bbf3',
  amber = '#ffbc80',
  ink = '#1c1321';
export const TRACE_SECONDS = 2.6;

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
  c.save();
  c.rotate(-0.09);
  cut(c, 'M-11 3L-10 -16Q-10 -24 -2 -26L2 -27 4 -24 7 -25Q12 -22 11 -16L11 4Z', '#a697a0', ink, 1.4);
  cut(c, 'M5 -24L9 -22 9 1 5 1Z', '#796676');
  etch(c, 'M-1 -21V-12M-5 -18H3M-6 -7L4 -7M-4 -4H2M6 -12L4 -9 7 -6 5 -2', '#44353f', 1.3);
  cut(c, 'M-14 2L12 1 15 4 9 6 -12 6Z', '#796a76', ink, 1);
  c.restore();
}

function phantom(c: Brush, returned: boolean) {
  const edge = returned ? '#ffbe86' : '#d5c9ed';
  const fabric = returned ? '#a45a53' : '#8d7da5';
  const lining = returned ? '#643746' : '#51425e';
  // The negative space inside the cowl stays black even over a lit window.
  lightPool(c, 1, -23, 30, returned ? '#f77c493b' : '#c4a7ff38', '#20152600');
  cut(
    c,
    'M-10 -33Q-12 -45 -4 -52L4 -58 3 -53Q13 -50 15 -39L13 -33Q17 -28 22 -24L28 -28 25 -21 30 -24 27 -18 19 -17 11 -23Q9 -11 21 5L10 0 14 10 4 3 4 12 -3 4 -9 10 -9 3 -19 8Q-14 0 -14 -13L-18 -17 -24 -14 -29 -17 -33 -24 -27 -21 -30 -28 -24 -23 -20 -23Z',
    fabric,
    '#211624',
    1.4
  );
  cut(c, 'M-9 -34Q-7 -48 2 -52Q10 -46 10 -37L7 -29 1 -24 -6 -29Z', '#170f1e', edge, 1.1);
  // An elongated death mask sits behind the cowl. The sockets and open jaw are cut away.
  cut(
    c,
    'M-6 -40Q-5 -46 2 -47Q8 -46 8 -42L7 -36 4 -33 3 -29 1 -27 -2 -30 -3 -34 -6 -35Z',
    returned ? '#eac3aa' : '#d8ced8'
  );
  cut(
    c,
    'M-5 -41L0 -40 -1 -37 -4 -37Z M2 -40L7 -43 6 -38 3 -37Z M0 -36L2 -37 3 -34 0 -34Z M-1 -32Q0 -36 3 -33L2 -29 0 -29Z',
    '#281c2a'
  );
  cut(c, 'M-8 -48L0 -53 -3 -49 -9 -41Z M6 -50Q15 -43 13 -33L10 -31Q13 -41 6 -50Z', edge);
  cut(
    c,
    'M-8 -29L-1 -23 7 -29 3 -22 -4 -18Z M-12 -19L-6 -10 -10 4 -13 6Z M5 -18Q8 -7 14 2L9 -1 9 4 3 -3Z',
    lining
  );
  etch(c, 'M-16 -26L-21 -21 -26 -19M12 -29L19 -22 24 -23M-8 -21Q-3 -13 -5 -5M1 -15L3 -4', edge, 1.15);
  cut(
    c,
    'M18 -20Q22 -23 23 -31L22 -36 24 -41 25 -40 25 -36 27 -35 29 -42 31 -44 30 -38 29 -34 32 -36 35 -41 36 -40 33 -34 27 -29 25 -20 21 -17Z',
    fabric,
    ink,
    0.8
  );
  etch(
    c,
    'M-23 -18L-28 -18 -32 -23M-22 -20L-26 -22 -29 -27M22 -21L25 -28 26 -32M25 -34L24 -38 25 -41M28 -34L30 -41M30 -34L34 -39',
    '#e7d5cc',
    0.95
  );
}

function fissure(c: Brush, opened: number) {
  c.save();
  c.scale(0.65 + opened * 0.44, 0.55 + opened * 0.45);
  cut(
    c,
    'M-32 4L-18 0 -11 1 -4 -3 5 -2 16 -6 13 -3 26 -5 18 -1 8 1 4 4 -8 4 -17 7 -16 4Z',
    '#210e19',
    '#d88756',
    1
  );
  etch(c, 'M-19 3L-9 2 -3 0 5 0 16 -4', amber, 1.4);
  c.restore();
}

function marker(c: Brush, item: StoreEvidence, lift = 1) {
  if (item.finding === 'clear' && !item.pendingCheck) {
    headstone(c);
    return;
  }
  if (item.finding === 'found' || item.finding === 'returned') {
    const returned = item.finding === 'returned';
    if (returned) fissure(c, lift);
    c.save();
    if (lift < 1) {
      c.beginPath();
      c.rect(-49, -81, 96, 88);
      c.clip();
    }
    c.translate(0, 44 * (1 - lift) - 5 * lift);
    if (item.pendingCheck) c.globalAlpha *= 0.6;
    phantom(c, returned);
    c.restore();
  } else {
    c.save();
    c.strokeStyle = item.finding === 'unreachable' ? amber : '#c0aabb';
    c.lineWidth = 1.25;
    c.setLineDash([2, 2]);
    oval(c, 0, 1, 8, 3.5, '#201724');
    c.stroke();
    c.restore();
  }
  if (item.pendingCheck) {
    c.fillStyle = amber;
    c.fillRect(13, -7, 2, 6);
    c.fillRect(13, 1, 2, 2);
  }
}
function readRing(c: Brush, t: number) {
  if (t < 0 || t > 1) return;
  c.save();
  c.globalAlpha = 1 - t * 0.8;
  c.strokeStyle = spectral;
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
  const swell = Math.sin(Math.PI * t);
  c.save();
  c.scale(1 + 0.6 * swell, 1);
  etch(c, 'M-18 2L-8 -2 0 0 6 -3 15 -2 M-13 4L-5 3 4 4', '#ae8291', 1.35);
  c.restore();
  c.fillStyle = '#140c18';
  c.beginPath();
  c.ellipse(0, 1, 10, 3, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.rect(-18, -45, 36, 46);
  c.clip();
  paper(c, 0, -27 + 38 * smooth(t), 1.65, '#e6d6ac');
  for (let j = 0; j < 5; j++) {
    c.fillStyle = '#dac69e';
    c.fillRect(-7 + j * 3, 2 - 9 * Math.sin(Math.PI * t + j * 0.2), 1.1, 2.5);
  }
  c.restore();
}
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
    c.strokeStyle = selected === id ? '#efc6b6' : '#bba1c4';
    c.lineWidth = 1.8;
    c.stroke();
  }
  if (reading) readRing(c, (t - order * 0.25) / 0.83);
  c.translate(28, 8);
  if (returning && t > 1.15 && t < 2.1) fissure(c, smooth((t - 1.15) / 0.65));
  if (reveal < 1 && old) {
    c.save();
    c.globalAlpha = 1 - reveal;
    if (returning && old.finding === 'clear') c.rotate(-0.6 * reveal);
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
  recovery: RestoreRoute | null,
  selected: StoreId | null,
  paths: boolean,
  play: Playback | null,
  t: number,
  busy: Command | null
) {
  const trace = play?.trace;
  const weatherTime = play ? clamp(t / TRACE_SECONDS) : 0;
  groundMist(c, plan, weatherTime);
  for (const item of file.stores) {
    if (item.id === 'primary' || !item.sourceId || item.sourceId === item.id) continue;
    const tr = pathBetween(plan, item.sourceId, item.id);
    if (paths) {
      route(c, tr, '#160f1d', 6.5);
      route(c, tr, '#946f86', 2.5);
      route(c, tr, '#3c2a3e', 1.1, [2, 3.6]);
      arrow(c, tr, 0.6, '#d5bdc7');
    }
  }
  if (paths && recovery) {
    const tr = pathBetween(plan, recovery.source, 'primary', true);
    const possible = recovery.kind === 'possible';
    const visible = possible || trace?.kind !== 'restore' || t >= 1.38;
    if (visible) {
      route(c, tr, '#211524', 4.6);
      route(c, tr, possible ? spectral : amber, 2.2, possible ? [5, 5] : []);
      arrow(c, tr, 0.61, possible ? spectral : amber);
    }
  }
  if (paths && trace?.kind === 'restore' && trace.source && t < 2.35) {
    const tr = pathBetween(plan, trace.source, 'primary', true);
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
        '#eddacd',
        0.85 * plan.scale
      )
    );
  }
  if (trace?.kind === 'restore' && trace.source) {
    if (trace.source === 'backup') disturbedBats(c, plan, t);
    travel(c, pathBetween(plan, trace.source, 'primary', true), (t - 0.35) / 1.08, amber, 1.3 * plan.scale);
  }
  foreground(c, plan, weatherTime);
}
