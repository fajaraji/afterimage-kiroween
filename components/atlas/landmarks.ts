import type { StoreId } from '../../lib/case';
import { cut, etch, lightPool, oval } from './print';
import type { Brush } from './print';
import { lantern } from './night';

const black = '#15101a',
  shadow = '#332431',
  stone = '#715b68',
  rim = '#ae8991',
  ember = '#ffac63';
function slit(c: Brush, x: number, y: number, w: number, h: number, lit = true) {
  c.save();
  c.translate(x, y);
  c.scale(w / 8, h / 16);
  cut(c, 'M-4 0V-10Q-3 -14 0 -16Q4 -13 4 -10V0Z', lit ? '#e98a4b' : black, '#37232c', 0.8);
  if (lit) {
    etch(c, 'M0 -15V1M-4 -5H4', black, 1.1);
    cut(c, 'M-3 -1V-6L-1 -9 -1 -1Z', '#ffd392');
  }
  c.restore();
}
function cross(c: Brush, x: number, y: number, s: number) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  cut(
    c,
    'M-1.6 1L-1 -10 -6 -10 -6 -13 -1 -12 -1 -18 1.5 -18 1.5 -12 6 -13 6 -10 1.2 -10 2 1Z',
    '#b29ca0',
    black,
    0.8
  );
  c.restore();
}
function chapel(c: Brush) {
  cut(c, 'M-41 2L-35 -3 10 -10 43 0 39 7 -5 17Z', '#483543', black, 1.3);
  cut(c, 'M-39 -2L-38 -35 -13 -53 5 -39 6 -1 -9 10Z', stone, black, 1.5);
  cut(c, 'M5 -39L29 -48 38 -37 36 -2 5 10Z', shadow, black, 1.3);
  cut(c, 'M-43 -34L-35 -43 -27 -51 -15 -70 -12 -74 -5 -53 10 -37 5 -39 -12 -57 -36 -34Z', black, rim, 1);
  cut(c, 'M-12 -74L17 -79 25 -58 39 -43 8 -35 -4 -51Z', '#503747', black, 1.5);
  etch(c, 'M-9 -70L10 -39M-4 -72L16 -42M3 -73L23 -44M10 -75L31 -46', rim, 0.65);
  cut(c, 'M12 -32L11 -65 19 -76 27 -65 28 -32 21 -29Z', '#70545e', black, 1.4);
  cut(c, 'M9 -64L16 -77 20 -98 23 -86 25 -73 31 -64 22 -66 18 -70Z', black, rim, 0.95);
  cross(c, 20, -96, 0.45);
  cross(c, -12, -70, 0.65);
  etch(
    c,
    'M-37 -28l7 -2m-4 2v5m-3 0 9 -2m19 -8 8 1m-3 -1v-4m-29 19 6 -2m22 -6 7 2m4 -8 7 -2m-4 2v4',
    '#49363f',
    0.9
  );
  slit(c, 19, -48, 5, 13);
  slit(c, -12, -32, 10, 17);
  cut(c, 'M-23 6L-22 -8Q-18 -22 -13 -24Q-6 -18 -5 -9L-5 9Z', black, rim, 1.1);
  etch(c, 'M-18 5L-18 -11M-13 7L-13 -18M-9 8L-10 -11', '#7b5555', 0.95);
  slit(c, 14, -5, 5, 12, false);
  slit(c, 31, -11, 4, 14);
  etch(c, 'M-34 1L-33 -11 -28 -15 -30 -20M1 2L0 -5 -5 -9M21 -35L23 -40 21 -44', '#332733', 1.25);
  cut(c, 'M-28 7L-10 13 -3 11 -20 6Z', '#c3978e');
  cut(c, 'M-30 10L-13 16 -6 14 -23 9Z', '#85646b');
}
function belfry(c: Brush) {
  cut(c, 'M-35 3L-25 -6 21 -10 38 -2 26 7 -14 14Z', '#493645', black);
  cut(
    c,
    'M-21 3L-18 -39 -24 -47 -20 -50 -16 -69 4 -72 19 -66 17 -47 23 -40 17 6 -3 12Z',
    '#705664',
    black,
    1.4
  );
  cut(c, 'M1 9L2 -36 8 -43 4 -69 19 -66 17 -47 23 -40 17 6Z', '#392934', black);
  cut(
    c,
    'M-28 -69L-18 -81 -15 -93 -11 -90 -4 -109 -1 -106 -3 -93 5 -93 10 -81 23 -67 11 -66 0 -72 -19 -65Z',
    '#291b2c',
    rim,
    1
  );
  etch(c, 'M-5 -98L-11 -76 -19 -69M-1 -90L4 -76 15 -69', '#916a7d', 0.8);
  cut(c, 'M-16 -47V-56Q-11 -66 -6 -62L-5 -48Z', black);
  cut(c, 'M-15 -50L-13 -53Q-14 -59 -10 -59Q-7 -58 -8 -53L-6 -50Z', '#bfa497');
  oval(c, -10, -49, 1.4, 1.5, '#e0b89c');
  slit(c, 9, -49, 5, 14);
  cut(c, 'M-26 -42L-19 -48 3 -42 22 -46 26 -40 3 -35Z', '#9a7681', black);
  etch(c, 'M-17 -33l11 2m-5 -2v-3m14 9 11 -3m-4 2v4m-25 7 6 1m4 10 5 1m5 -19 6 -2', '#493641', 0.9);
  slit(c, -9, -11, 6, 15);
  slit(c, 12, -14, 4, 12, false);
  etch(c, 'M-17 -34L-10 -29 -14 -22 -9 -17M-3 -1L-5 3 -2 7M7 -28L10 -25 8 -18', '#372832', 1);
  cross(c, -4, -103, 0.48);
}
function recordsHouse(c: Brush) {
  cut(c, 'M-39 -1L-39 -28 -14 -46 6 -30 12 6 -9 12Z', '#7c626b', black, 1.3);
  cut(c, 'M6 -30L33 -40 37 -4 12 7Z', '#45303f', black, 1.4);
  cut(
    c,
    'M-47 -28L-35 -40Q-23 -52 -26 -72L-16 -64 -10 -55Q-4 -43 14 -31L7 -25 -16 -44 -39 -25Z',
    '#261a29',
    rim,
    1
  );
  cut(c, 'M-26 -72L5 -68Q6 -55 20 -47L42 -42 11 -28Q-11 -42 -18 -55Z', '#654858', black, 1.4);
  etch(
    c,
    'M-20 -65Q-14 -48 11 -34M-13 -63Q-6 -48 17 -36M-5 -63Q1 -50 24 -39M2 -59L11 -51 29 -42',
    '#ac8690',
    0.8
  );
  cut(c, 'M16 -48L11 -61 9 -60 6 -68 16 -71 20 -64 17 -63 26 -51Z', shadow, rim, 0.8);
  slit(c, -23, -6, 10, 16);
  cut(c, 'M-9 9L-11 -10 -2 -15 3 5Z', black, rim, 1);
  slit(c, 23, -12, 8, 15);
  etch(c, 'M-34 -9L-15 -14M-34 -15L-16 -20M17 -14L28 -20', black, 2.4);
  cut(c, 'M-32 -2L-22 1 -17 -2 -27 -5Z M-37 1L-26 5 -21 3 -32 0Z', '#cfbcb2', black, 0.5);
}
function ossuary(c: Brush, open: number) {
  cut(c, 'M-42 2L-39 -14 -27 -30 -8 -36 21 -36 43 -19 42 1 15 12 -17 13Z', '#59414e', black, 1.6);
  cut(c, 'M-6 -35L21 -36 43 -19 42 1 15 12 12 -10Z', '#382938', black);
  cut(
    c,
    'M-41 -12L-32 -33 -20 -44 -6 -47 17 -45 28 -35 31 -25 12 -24 -6 -29 -29 -18Z',
    '#90727d',
    black,
    1.3
  );
  // The skull is carved into the crypt. Its jaw is the actual snapshot gate.
  c.save();
  c.translate(-6, -15 - open * 4);
  cut(
    c,
    'M-18 -3Q-24 -8 -21 -20Q-18 -33 -5 -35Q11 -38 20 -27Q26 -15 18 -6L14 -4 14 1 9 4 7 1 3 4 0 2 -4 5 -8 2 -12 4 -12 0Z',
    '#bf9ca0',
    '#362330',
    1.4
  );
  cut(
    c,
    'M-17 -18Q-12 -22 -4 -17L-6 -10Q-13 -7 -16 -12Z M3 -18Q14 -25 17 -19L14 -11Q8 -8 4 -12Z M-2 -10L1 -12 4 -5 -4 -4Z',
    black
  );
  etch(c, 'M-9 -32L-5 -27 -8 -24 -2 -20M8 -31L12 -28M-17 -5L-11 -7', '#73545e', 1.2);
  if (open > 0.12) {
    lightPool(c, 0, -12, 19, '#ff6a3f66', '#ff6a3f00');
    oval(c, -11, -15, 2, 1.2, '#ffc48d');
    oval(c, 10, -16, 2, 1.2, '#ffc48d');
  }
  c.restore();
  cut(c, 'M-22 5L-21 -4Q-9 -17 4 -7L7 4 -8 9Z', black, '#85626c', 1);
  for (let i = 0; i < 6; i++) {
    const x = -19 + i * 4;
    etch(c, 'M' + x + ' ' + (-5 - Math.sin(i * 0.65) * 3) + 'v' + (9 - open * 8), '#ae8489', 1.5);
  }
  etch(c, 'M22 -25L18 -18 22 -14 20 -4M-36 -10L-30 -7 -32 -1', black, 1.7);
  lantern(c, -36, 6, 0.56 + open * 0.06);
}
export function lot(c: Brush, seed: number) {
  oval(c, 3, 8, 65, 19, '#100c17ab');
  cut(
    c,
    'M-63 -3L-50 -13 -25 -20 -5 -22 19 -18 44 -14 61 -3 53 6 28 13 7 17 -16 16 -48 9Z',
    '#362b39',
    '#68515d',
    0.7
  );
  for (let i = 0; i < 28; i++) {
    const x = Math.sin(i * 31 + seed) * 45,
      y = Math.cos(i * 19 + seed) * 10;
    etch(c, 'M' + x + ' ' + y + 'l5 -1', '#87657455', 0.8);
  }
  for (let i = 0; i < 5; i++) {
    const x = -48 + i * 5,
      y = -4 - i * 2;
    etch(c, 'M' + x + ' ' + y + 'v-8l-1.4 2.3m1.4 -3.5l1.5 3', '#9c7c87', 0.8);
  }
  etch(c, 'M-48 -8L-28 -16', '#8f7681', 1);
}
export function landmark(c: Brush, id: StoreId, opening = 0) {
  c.save();
  c.translate(-6, 0);
  if (id === 'primary') chapel(c);
  if (id === 'analytics') belfry(c);
  if (id === 'export') recordsHouse(c);
  if (id === 'backup') ossuary(c, opening);
  c.restore();
}
