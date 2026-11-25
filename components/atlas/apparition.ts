import { RETURN_SCENE } from '../../lib/haunting';
import { smooth } from './geometry';
import type { Plan } from './geometry';
import { cut, etch, oval } from './print';
import type { Brush } from './print';

const ink = '#130f19',
  shade = '#433641',
  cloth = '#716571',
  thread = '#c4b7b8',
  bone = '#e2d2bf';

function veil(c: Brush, t: number) {
  const lift = Math.sin(t * 2.3) * 3;
  cut(
    c,
    'M-53 -67Q-51 -112 -10 -126Q28 -132 50 -97C75 -65 64 -14 88 14Q107 43 126 48L114 52 130 68 102 58Q102 81 121 105L102 98 111 132 84 109 88 145 70 127 65 151 52 132 40 162 27 151 17 170 -4 151 -24 170 -28 147 -49 158 -43 134 -61 146 -62 119 -85 137 -77 112 -104 123 -94 95 -119 106 -106 75 -128 83 -103 59 -122 62Q-83 28 -79 0Z',
    shade,
    '#a79a99',
    1.6
  );
  cut(
    c,
    'M-71 15Q-65 -41 -47 -86Q-40 -108 -14 -119Q-44 -83 -43 -54L-55 -14 -50 24 -62 68 -57 119 -72 131 -67 108 -92 122 -79 77 -97 85Z',
    cloth
  );
  cut(
    c,
    'M11 -121Q40 -103 49 -70L51 -39 64 -9 60 -46Q70 -10 74 7L89 39 76 24 84 67 70 40 75 86 61 58 67 108 48 70 48 30 40 2 42 -26 34 -80Z',
    '#958991'
  );
  cut(
    c,
    'M-51 -29Q-36 -59 -28 -94Q-11 -119 6 -115Q35 -110 44 -67Q54 -38 48 -1Q48 25 67 51L76 73 52 58 60 91 40 81 46 112 24 103 4 136 -13 124 -40 143 -36 115 -59 122 -49 82 -70 91 -52 47Z',
    ink
  );
  for (let side = -1; side <= 1; side += 2) {
    c.save();
    c.scale(side, 1);
    for (let n = 0; n < 9; n++) {
      const x = 20 + n * 3.6,
        y = -118 + n * 4,
        end = 61 + n * 5.7;
      const sway = lift * (n / 6);
      etch(
        c,
        `M${x} ${y}C${x + 32} ${y + 39} ${35 + n * 3 + sway} ${-28 + n * 4} ${end - 13} ${8 + n * 6}Q${end - 1 + sway} ${40 + n * 5} ${end + sway} ${68 + n * 5.3}`,
        n % 3 === 0 ? '#c2b5b3' : '#8a7985',
        n % 3 === 0 ? 1.1 : 0.65
      );
    }
    c.restore();
  }
  etch(
    c,
    'M-108 74Q-82 63 -73 31M-91 94Q-67 69 -62 44M-55 116Q-46 74 -36 63M82 86Q70 58 66 39M97 92Q82 69 80 52',
    thread,
    0.85
  );
}

function face(c: Brush, jaw: number) {
  c.save();
  c.rotate(-0.1);
  // High cheekbones and hollow temples are carved out of one warm bone plate.
  const plate = new Path2D(
    'M-36 -72Q-29 -103 -6 -102Q15 -104 32 -83L36 -57 32 -37 38 -19 33 -12 27 -11 24 10 12 24 -4 25 -20 14 -24 -3 -35 -12 -38 -24 -34 -39 -40 -54Z'
  );
  const sidelight = c.createLinearGradient(-35, -67, 38, -30);
  sidelight.addColorStop(0, '#9c8791');
  sidelight.addColorStop(0.27, '#d4c4b7');
  sidelight.addColorStop(0.55, bone);
  sidelight.addColorStop(0.85, '#a38b80');
  sidelight.addColorStop(1, '#5e4d55');
  c.fillStyle = sidelight;
  c.fill(plate);
  c.strokeStyle = ink;
  c.lineWidth = 1.8;
  c.stroke(plate);
  c.save();
  c.clip(plate);
  for (let n = 0; n < 13; n++) {
    const x = -38 + n * 2.7;
    etch(c, `M${x} -100q10 14 7 33 M${20 + n * 1.9} -47q-4 22 -12 30`, '#5946526b', 0.6);
  }
  c.restore();
  cut(
    c,
    'M-35 -70Q-30 -93 -15 -96L-22 -78 -20 -66 -26 -55 -24 -46 -34 -41 -38 -54Z M7 -97Q26 -95 31 -79L33 -63 24 -76 16 -77Z',
    '#a99a90'
  );
  cut(
    c,
    'M-35 -50Q-27 -62 -13 -56L-6 -49 -9 -36 -16 -28 -27 -30 -32 -36Z M3 -53Q17 -71 29 -67L33 -60 29 -47 18 -39 7 -41Z',
    ink
  );
  etch(
    c,
    'M-34 -55Q-20 -65 -6 -51M3 -57Q14 -73 31 -71M-29 -39Q-24 -31 -18 -32M11 -43Q20 -41 29 -53',
    '#75666b',
    1.4
  );
  oval(c, -17, -44, 1.65, 1.25, '#f2e7cf');
  etch(c, 'M15 -51Q19 -56 24 -55', '#cab5a3', 0.9);
  cut(c, 'M-6 -48L1 -54 4 -35 9 -28 6 -23 1 -26 -2 -22 -9 -25 -7 -31Z', '#726367');
  cut(c, 'M1 -34L4 -27 1 -26 -2 -23 -6 -25 -2 -29Z', ink);
  cut(
    c,
    'M-33 -26Q-20 -23 -13 -27L-17 -18 -9 -12 -17 -2 -26 -10Z M12 -34L30 -43 29 -32 34 -24 29 -17 20 -19 11 -11 7 -17 16 -25Z',
    '#8a7978'
  );
  for (let k = 0; k < 5; k++) {
    etch(
      c,
      `M${-36 + k * 1.5} ${-19 + k * 1.3}q8 3 13 12 M${16 + k * 1.5} ${-30 + k * 0.5}q8 -4 12 -9 M${-27 + k * 4} ${-79 - k * 2}l3 -6`,
      shade,
      0.8
    );
  }
  c.save();
  c.translate(0, 2 + jaw * 9);
  cut(
    c,
    'M-22 -10Q-18 -5 -13 -7Q-3 -17 9 -18L21 -20 25 -12 18 10 9 21 -4 25 -14 18 -20 5Z',
    '#baa99c',
    ink,
    1.2
  );
  cut(c, 'M-14 -4Q-9 -15 4 -16L15 -18 19 -15 14 -6Q14 4 7 14L0 17 -7 13 -12 5Z', ink);
  cut(c, 'M-11 -8Q-3 -16 12 -16L7 -12 4 -13 1 -10 -2 -11 -6 -8Z', '#e3d7c5');
  etch(c, 'M-12 11Q-4 24 5 20M15 -1L20 -12M-7 -6l3 -4M0 -10l2 -3', '#766366', 1.0);
  c.restore();
  // The torn edge of a funeral veil crosses one eye. Each diagonal follows the sag of the cloth.
  c.save();
  const gauze = new Path2D(
    'M-32 -100Q-13 -119 15 -111L20 -102Q6 -83 -2 -60L-13 -23 -16 -6 -20 -14 -25 9 -25 -4 -34 17 -31 -5 -41 12 -36 -18 -41 -6 -38 -42Z'
  );
  c.fillStyle = '#29232d8c';
  c.fill(gauze);
  c.clip(gauze);
  for (let n = -104; n <= 84; n += 5) {
    etch(c, `M${n} -116q34 69 40 156 M${n + 20} -116q-7 67 -68 154`, '#bfb1ae9c', 0.66);
  }
  c.restore();
  etch(c, 'M20 -103Q2 -77 -10 -37L-16 -9M-24 -13L-31 9', '#d1c1ba', 0.8);
  cut(
    c,
    'M-38 -51Q-40 -87 -16 -108Q-2 -120 16 -114Q-9 -103 -17 -89L-23 -66 -31 -46 -35 -22 -40 -12Z',
    '#625562',
    ink,
    1
  );
  etch(c, 'M-36 -39Q-33 -83 -8 -102M-34 -58Q-25 -90 -2 -108M24 -94Q44 -74 42 -43L49 -11', thread, 1.05);
  c.restore();
}

function hand(c: Brush, side: number, reach: number) {
  c.save();
  c.scale(side, 1);
  if (side === -1) {
    c.translate(63 + 4 * reach, 77 - 11 * reach);
    c.rotate(-1.13 + 0.1 * reach);
    c.scale(0.76, 0.84);
  } else {
    c.translate(78 + 14 * reach, 38 - 16 * reach);
    c.rotate(-0.57 + 0.25 * reach);
    c.scale(1 + 0.12 * reach, 1 + 0.1 * reach);
  }
  cut(
    c,
    'M-17 70L-13 31 -20 9 -27 -1 -29 -17 -25 -22 -19 -13 -17 -5 -13 -2 -16 -24 -12 -46 -8 -51 -6 -46 -7 -25 -5 -13 -3 -16 -2 -38 4 -56 8 -58 8 -51 5 -36 5 -16 8 -20 12 -39 18 -49 22 -48 20 -42 16 -30 15 -11 20 -17 25 -32 30 -38 33 -35 31 -29 27 -21 23 -3 17 9 10 18 9 44 15 72Z',
    '#b2a4a0',
    ink,
    1.6
  );
  cut(
    c,
    'M-15 6L-7 12 0 8 7 -6 11 -4 7 10 1 17 -3 38 -7 46 -6 14Z M-13 -23L-10 -44 -7 -48 -10 -25Z M1 -36L5 -51 7 -54 3 -34Z M15 -29L19 -43 21 -46 18 -30Z',
    shade
  );
  etch(
    c,
    'M-25 -17L-20 -7 -18 -1M-11 -18L-8 -7M1 -32L0 -18M10 -19L8 -9M20 -13L16 0M-1 19L5 12M-3 26L-6 56M7 25L7 52',
    ink,
    0.95
  );
  cut(c, 'M-23 63L-10 41 -4 55 2 46 9 52 14 40 22 63 28 86 -27 87Z', cloth, ink, 1.2);
  c.restore();
}

function portrait(c: Brush, t: number, reach: number) {
  veil(c, t);
  cut(
    c,
    'M-28 4Q-27 33 -41 48L-67 60 -88 94 -75 102 -47 81 -39 113 -20 142 2 151 28 125 40 90 59 112 80 118 92 107 64 66 34 49 22 26 20 2Z',
    shade,
    ink,
    1.7
  );
  cut(c, 'M-17 13L-7 30 -6 43 -18 54 -32 60 -21 60 0 53 20 62 36 63 16 49 11 30 17 14Z', '#988a88');
  etch(
    c,
    'M-47 76Q-27 60 -9 57M10 58Q33 62 48 76M-34 84Q-21 72 -14 72M16 72L39 88M-16 86L-10 108M-1 75L2 110M10 86L8 105',
    thread,
    1
  );
  c.save();
  c.translate(0, -4 + Math.sin(t * 2.4) * 1.3);
  face(c, 0.46 + 0.48 * Math.sin(t * 3.9));
  c.restore();
  for (let i = 0; i < 12; i++) {
    const offset = i * 2.6;
    etch(
      c,
      `M${-77 + offset} ${80 - i}q15 10 22 43 M${30 + offset} ${72 + i * 0.6}q12 19 18 46`,
      i % 3 === 0 ? '#a797a0' : '#71636f',
      0.8
    );
  }
  hand(c, -1, reach);
  hand(c, 1, 0.8 * reach);
}

// A second plate approaches from the primary grave and withdraws into the same plot.
export function drawHaunting(c: Brush, plan: Plan, t: number) {
  const { width: w, height: h, plots } = plan;
  const dim = smooth((t - 0.42) / 1.0) * (1 - smooth((t - RETURN_SCENE.retreatAt) / 1.25));
  if (dim <= 0) return;
  c.save();
  c.fillStyle = `rgba(13,8,18,${dim * 0.79})`;
  c.fillRect(0, 0, w, h);
  const appearance =
    smooth((t - RETURN_SCENE.voiceAt) / 0.32) * (1 - smooth((t - RETURN_SCENE.retreatAt) / 1.04));
  if (appearance > 0) {
    const approach = smooth((t - RETURN_SCENE.voiceAt) / 0.78);
    const retreat = smooth((t - RETURN_SCENE.retreatAt) / 1.13);
    const travel = approach * (1 - retreat);
    const origin = plots.primary;
    const x = origin[0] + (w * 0.515 - origin[0]) * travel;
    const y = origin[1] - 8 + (h * 0.55 - origin[1]) * travel;
    const size = (0.18 + 1.06 * travel) * Math.min(w / 282, h / 286);
    const halo = c.createRadialGradient(x, y - 55 * size, 4, x, y - 35 * size, 121 * size);
    halo.addColorStop(0, `rgba(199,171,163,${appearance * 0.34})`);
    halo.addColorStop(1, 'rgba(100,72,92,0)');
    c.fillStyle = halo;
    c.fillRect(0, 0, w, h);
    c.globalAlpha = appearance;
    c.translate(x, y);
    c.scale(size, size);
    c.rotate(-0.025 + 0.024 * Math.sin(t * 1.8));
    portrait(c, t, travel);
  }
  c.restore();
}

export function drawMoonWitness(c: Brush, plan: Plan) {
  const small = plan.width < 500;
  c.save();
  c.translate(plan.width * (small ? 0.51 : 0.492), small ? 58 : 69);
  c.scale(small ? 0.224 : 0.295, small ? 0.224 : 0.295);
  c.globalAlpha = 0.78;
  portrait(c, 2.8, 0.18);
  c.restore();
}
