import hex2rgb from 'pure-color/parse/hex';
import hsl2rgb from 'pure-color/convert/hsl2rgb';
import rgb2hsv from 'pure-color/convert/rgb2hsv';

import classnames from 'classnames';
import styles from './v-color.css';

export const clsn = (...names) => classnames(names.map(n => styles[n]));

export const extend = (a, ...args) => {
  args.forEach(arg => {
    if (arg && typeof arg === 'object') {
      Object.keys(arg).forEach(k => (k in a) || (a[k] = arg[k]));
    }
  });
  return a;
};

export const parseColor = (color) => {
  let match = null;
  let rgb = [255, 255, 255];
  let alpha = 1;

  match = color.match(/((#[a-fA-F0-9]{6})|(#[a-fA-F0-9]{3}))/);
  if (match && match[1]) {
    rgb = hex2rgb(match[1]);
  }

  match = color.match(/rgba?\(([^)]+)\)/);
  if (match && match[1]) {
    const [
      r = 0,
      g = 0,
      b = 0,
      a = 1
    ] = match[1].split(/\s*,\s*/);

    rgb = [+r || 0, +g || 0, +b || 0];
    alpha = a > 1 ? 1 : +a;
  }

  match = color.match(/hsla?\(([^)]+)\)/);
  if (match && match[1]) {
    const [
      h = 0,
      s = 0,
      l = 0,
      a = 1
    ] = match[1].split(/\s*,\s*/);
    rgb = hsl2rgb([
      +h || 0,
      parseFloat(s) / 100,
      parseFloat(l) / 100
    ]);
    alpha = a > 1 ? 1 : +a;
  }

  return rgb2hsv(rgb).concat(alpha);
};
