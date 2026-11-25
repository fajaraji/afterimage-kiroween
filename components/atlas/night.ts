import { cut, etch, lightPool, oval } from './print';
import type { Brush } from './print';
import type { Plan } from './geometry';

const night = '#100b16';
function deadTree(c: Brush, x: number, y: number, size: number, flipped = false) {
  c.save();
  c.translate(x, y);
  c.scale(flipped ? -size : size, size);
  cut(
    c,
    'M-20 5 Q-4 -13 -7 -35 L-19 -58 -21 -81 -40 -98 -51 -100 -64 -113 -48 -104 -39 -106 -52 -123 -56 -143 -48 -125 -29 -109 -36 -133 -31 -154 -30 -131 -19 -107 -22 -93 -12 -79 -7 -57 3 -78 3 -101 -4 -118 0 -136 4 -118 10 -111 9 -134 18 -149 27 -161 18 -141 15 -122 22 -126 38 -152 31 -128 18 -111 14 -91 29 -100 46 -104 53 -116 52 -129 57 -117 66 -129 61 -113 52 -101 34 -92 58 -96 77 -110 71 -97 56 -87 33 -85 13 -74 3 -50 7 -37 21 -49 45 -56 50 -68 42 -79 54 -70 60 -84 59 -67 53 -55 72 -59 88 -69 84 -61 68 -53 49 -49 32 -40 14 -25 12 -10 24 4 7 0 -1 5Z',
    night
  );
  etch(
    c,
    'M-8 -4 Q4 -21 -1 -41L7 -66M-4 -47L-14 -63 -17 -83M11 -77L30 -92 45 -96M7 -91L11 -110',
    '#71464b',
    1
  );
  c.restore();
}

function bat(c: Brush, x: number, y: number, s: number, turn = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(turn);
  c.scale(s, s);
  cut(
    c,
    'M0 3Q-4 -3 -16 -7Q-13 -3 -14 0Q-9 -2 -7 2Q-3 0 0 6Q4 0 7 2Q9 -2 15 0Q13 -3 17 -7Q6 -5 2 1L2 -2 0 0 -2 -2Z',
    '#180c17'
  );
  c.restore();
}

export function lantern(c: Brush, x: number, y: number, size: number) {
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  lightPool(c, 0, -8, 31, '#ff8d354d', '#ff721900');
  oval(c, 0, 1, 17, 3, '#100a10');
  cut(c, 'M-1 -18 Q-4 -24 2 -27L6 -26Q1 -24 3 -18Z', '#827555', '#302a24');
  cut(
    c,
    'M0 -18C-14 -25 -21 -9 -13 -2Q-8 3 -1 0Q8 4 14 -3C21 -13 12 -23 3 -19Z',
    '#b84c24',
    '#3c1e23',
    1.2
  );
  etch(c, 'M-6 -17Q-14 -10 -9 -2M6 -17Q15 -12 10 -3M-1 -17Q-5 -12 -4 -8', '#e27834', 0.9);
  cut(
    c,
    'M-11 -12L-4 -10 -10 -7Z M4 -10L12 -14 10 -7Z M-1 -8L2 -5 -3 -5Z M-12 -5L-7 -3 -5 -4 -3 -2 1 -3 3 -2 7 -5 8 -4 13 -7Q7 4 0 -1Q-7 1 -12 -5Z',
    '#ffe093'
  );
  c.restore();
}

function ridge(c: Brush, w: number, h: number, base: number, depth: number, ink: string) {
  c.fillStyle = ink;
  c.beginPath();
  c.moveTo(0, h);
  for (let x = 0; x <= w + 6; x += 6) {
    const y =
      base +
      (Math.sin(x * 0.017 + depth) * 0.45 +
        Math.cos(x * 0.036 + depth) * 0.22 +
        Math.sin(x * 0.007) * 0.35) *
        depth;
    c.lineTo(x, y);
  }
  c.lineTo(w, h);
  c.closePath();
  c.fill();
}
function sky(c: Brush, plan: Plan) {
  const { width: w, height: h } = plan,
    small = w < 500;
  const sky = c.createLinearGradient(0, 0, 0, h * 0.62);
  sky.addColorStop(0, '#2e1728');
  sky.addColorStop(0.54, '#873b46');
  sky.addColorStop(1, '#352332');
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);
  const mx = w * (small ? 0.51 : 0.492),
    my = small ? 48 : 55,
    r = small ? 36 : 48;
  lightPool(c, mx, my, r * 2.05, '#ec754354', '#e94c3500');
  const moon = c.createLinearGradient(0, my - r, 0, my + r);
  moon.addColorStop(0, '#ffb16b');
  moon.addColorStop(0.55, '#ef714c');
  moon.addColorStop(1, '#aa3c42');
  c.fillStyle = moon;
  c.beginPath();
  c.arc(mx, my, r, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.clip();
  c.translate(mx, my);
  c.scale(r / 43, r / 43);
  cut(
    c,
    'M-33 -23Q-17 -36 -10 -29L-15 -26 -5 -25 -11 -20 -25 -18Z M9 -36L24 -26 19 -22 27 -19 15 -17 6 -21Z M4 0L14 -8 26 -3 23 4 34 7 19 10 12 4Z M-24 12L-15 7 -5 13 -12 21 -21 19Z',
    '#b44d414a'
  );
  cut(c, 'M-39 -16Q-35 -34 -15 -39L-6 -39Q-27 -34 -39 -16Z M19 -33Q28 -27 34 -15L30 -19Z', '#ffca854f');
  for (let i = 0; i < 110; i++) {
    const x = Math.sin(i * 53.1) * 42,
      y = Math.cos(i * 67.2) * 43;
    etch(c, 'M' + x + ' ' + y + 'h' + (1 + (i % 5)), '#a54a391e', 0.65);
  }
  c.restore();
  for (let i = 0; i < 3; i++) {
    const cy = 24 + i * 23,
      cx = mx - r * (i % 2 ? 1.9 : 0.6),
      len = r * (i % 2 ? 3.5 : 2.7);
    c.save();
    c.translate(cx, cy);
    c.scale(len / 100, 0.7);
    cut(c, 'M0 2Q19 0 29 -1Q49 -5 69 -1L100 1 79 2 69 3 46 2 24 4Z', '#4a233541');
    c.restore();
  }
  bat(c, mx - r * 0.8, my - r * 0.25, 0.53, -0.16);
  bat(c, mx + r * 0.51, my + 0.07 * r, 0.73, 0.13);
  bat(c, mx + r * 1.17, my - 0.48 * r, 0.42, -0.24);
  ridge(c, w, h, 82, 20, '#53303d');
  // Black cutouts of distant burial crosses read as part of the skyline.
  for (let i = 0; i < 24; i++) {
    const x = w * (((i * 43) % 127) / 127),
      y = 106 + Math.sin(i * 2.78) * 7;
    c.save();
    c.translate(x, y);
    c.rotate(Math.sin(i * 7) * 0.18);
    c.fillStyle = '#322331';
    c.fillRect(-1, -9 - (i % 7), 2, 18);
    c.fillRect(-4, -7 - (i % 7), 8, 2);
    c.restore();
  }
  ridge(c, w, h, 109, 14, '#352633');
  for (const a of [
    [0.08, 105, 0.38],
    [0.23, 109, 0.24],
    [0.72, 111, 0.27],
    [0.96, 112, 0.4]
  ]) {
    c.save();
    c.globalAlpha = 0.68;
    deadTree(c, w * a[0], a[1], a[2], a[0] > 0.5);
    c.restore();
  }
  ridge(c, w, h, 122, 13, '#201925');
}
export function cemeteryFloor(c: Brush, plan: Plan) {
  const { width: w, height: h } = plan;
  sky(c, plan);
  const ground = c.createLinearGradient(0, 108, 0, h);
  ground.addColorStop(0, '#21192500');
  ground.addColorStop(0.16, '#251c2c');
  ground.addColorStop(0.62, '#1a1824');
  ground.addColorStop(1, '#0c0d16');
  c.fillStyle = ground;
  c.fillRect(0, 108, w, h - 108);
  // Cross-hatched soil and torn ribbons of ground fog leave the routes readable.
  let randomState = 1777;
  function random() {
    randomState = (randomState * 16807) % 2147483647;
    return randomState / 2147483647;
  }
  for (let i = 0; i < w * 2.3; i++) {
    const x = random() * w,
      y = 110 + random() * (h - 110),
      s = random() * 5;
    etch(c, 'M' + x + ' ' + y + 'l' + s + ' ' + -s * 0.29, i % 4 ? '#a68d9c13' : '#7552674d', 0.65);
  }
  for (let i = 0; i < 10; i++) {
    const x = random() * w,
      y = 103 + random() * (h * 0.52),
      length = 40 + random() * 95;
    c.save();
    c.translate(x, y);
    c.scale(length / 100, 0.8);
    cut(c, 'M-30 2Q-4 -3 12 -1Q31 1 47 -3Q69 -5 98 -1Q73 -2 54 2Q34 5 13 2Q-3 1 -30 2Z', '#b1a3b317');
    c.restore();
  }
  // A pair of crooked trunks frames the scene from outside the four active plots.
  deadTree(c, -5, h * 0.68, w < 500 ? 0.72 : 1.3);
  deadTree(c, w + 3, h * 0.54, w < 500 ? 0.65 : 1.08, true);
}
function gate(c: Brush, x: number, y: number, scale: number, mirror: boolean) {
  c.save();
  c.translate(x, y);
  c.scale(mirror ? -scale : scale, scale);
  cut(
    c,
    'M-8 0L-8 -45 -10 -46 -10 -50 -6 -51 -5 -60 -2 -67 2 -60 4 -51 9 -50 9 -46 6 -45 6 0Z',
    '#120e17',
    '#69434e',
    1
  );
  for (let i = 0; i < 7; i++) {
    const xx = 7 + i * 7.2,
      bottom = -i * 1.55,
      top = -36 - i * 2.65;
    etch(c, 'M' + xx + ' ' + bottom + 'V' + top, '#0a0910', 2.1);
    cut(c, 'M' + xx + ' ' + (top - 5) + 'l-2.2 6 2.2 -1 2.2 1Z', '#93808a');
  }
  etch(c, 'M6 -26Q30 -25 52 -44M6 -7L52 -17', '#584451', 2.6);
  c.restore();
}
// Low fog shifts with the action, then settles back into the same resting scene.
export function groundMist(c: Brush, plan: Plan, time: number) {
  const breeze = Math.sin(Math.PI * time);
  c.save();
  for (const [x, y, span, direction] of [
    [0.25, 0.51, 0.34, 1],
    [0.77, 0.58, 0.33, -1],
    [0.43, 0.84, 0.38, 1]
  ]) {
    c.save();
    c.translate(plan.width * x + breeze * 24 * direction, plan.height * y);
    c.scale((plan.width * span) / 150, plan.width < 500 ? 0.74 : 1);
    cut(
      c,
      'M-75 3Q-53 -3 -29 -2Q-9 0 7 -4Q23 -10 40 -6Q53 -3 76 -4Q57 0 40 -1Q27 -3 12 2Q-4 7 -18 4Q-43 0 -75 3Z',
      '#c5abc31c'
    );
    etch(c, 'M-51 6Q-34 3 -21 6T11 5M33 -8Q48 -6 64 -8', '#e3cce321', 0.8);
    c.restore();
  }
  c.restore();
}

function hangingLamp(c: Brush, plan: Plan, time: number) {
  const size = plan.width < 500 ? 0.72 : 1.3;
  // The hook attaches to the last upward tine on the left foreground tree.
  c.save();
  c.translate(-5 + 68 * size, plan.height * 0.68 - 54 * size);
  c.scale(size * 0.82, size * 0.82);
  c.rotate(0.13 * Math.sin(time * Math.PI * 4) * Math.sin(time * Math.PI));
  etch(c, 'M0 0V20M0 19Q-5 22 -2 25Q0 26 2 23', '#9e8086', 0.95);
  lightPool(c, 0, 35, 17, '#ff943b38', '#e7733200');
  cut(c, 'M-8 28L-3 23 3 23 8 28 6 40 1 44 -5 40Z', '#261722', '#a38383', 1);
  cut(c, 'M-5 29L4 29 3 39 -3 39Z', '#bf6a41');
  cut(c, 'M-2 39Q-4 36 0 32L0 29Q5 35 2 39Z', '#ffd694');
  etch(c, 'M0 29L-1 40M-7 28H7M-3 42H3', '#40242b', 0.9);
  c.restore();
}

export function foreground(c: Brush, plan: Plan, time: number) {
  const { width: w, height: h } = plan,
    small = w < 500;
  c.save();
  c.fillStyle = '#100b14';
  cut(
    c,
    'M0 ' +
      (h - 8) +
      'Q' +
      w * 0.2 +
      ' ' +
      (h - 20) +
      ' ' +
      w * 0.47 +
      ' ' +
      (h - 6) +
      'T' +
      w +
      ' ' +
      (h - 13) +
      'V' +
      h +
      'H0Z',
    '#100b14'
  );
  hangingLamp(c, plan, time);
  gate(c, 3, h + 3, small ? 0.58 : 0.9, false);
  gate(c, w - 4, h + 2, small ? 0.57 : 0.9, true);
  lantern(c, small ? 16 : 29, h - 5, small ? 0.65 : 1.03);
  lantern(c, w - (small ? 17 : 28), h - 9, small ? 0.82 : 1.17);
  if (!small) lantern(c, w - 55, h - 6, 0.63);
  c.restore();
}
export function disturbedBats(c: Brush, plan: Plan, t: number) {
  if (t < 0.08 || t > 1.85) return;
  const p = (t - 0.08) / 1.77;
  c.save();
  c.globalAlpha = Math.min(1, p * 8, (1 - p) * 7);
  const [x, y] = plan.plots.backup;
  for (let i = 0; i < 4; i++) {
    const bx = x - 11 + i * 4 + Math.sin(i + 1) * 36 * p + 54 * p,
      by = y - 27 - p * (54 + i * 8) - Math.sin(p * 7 + i) * 5;
    c.save();
    c.translate(bx, by);
    c.scale(1, 0.68 + 0.3 * Math.cos(p * 23 + i));
    bat(c, 0, 0, 0.32 + i * 0.035, -0.2);
    c.restore();
  }
  c.restore();
}
