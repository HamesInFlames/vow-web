// Checks every text/background token pair used on the site against its contrast target.
// Body text targets 7:1 (plan §3d); large/bold display text and UI states need 4.5:1.
// Exit 1 if any pair fails. Keep the hexes in sync with src/styles/global.css (@theme).
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --color-${name} not found in global.css`);
  return m[1];
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum, where it's used]
const pairs = [
  ['slate', 'mist', 7, 'body text on page'],
  ['slate', 'paper', 7, 'body text on cards'],
  ['slate', 'white', 7, 'body text in header'],
  ['slate-60', 'mist', 7, 'secondary text on page'],
  ['slate-60', 'paper', 7, 'secondary text on cards'],
  ['slate-60', 'sand', 7, '"Photo coming" placeholder text'],
  ['white', 'red', 7, 'buttons'],
  ['white', 'red-pressed', 7, 'pressed buttons'],
  ['white', 'ink', 7, 'utility row'],
  ['red', 'mist', 7, 'links on page'],
  ['red', 'paper', 7, 'links on cards'],
  ['red', 'white', 7, 'links in header'],
  ['on-accent', 'accent', 4.5, 'bold display text on the logo-red accent (large text only)'],
  ['accent', 'mist', 3, 'accent rules and bars (non-text)'],
  ['mist', 'slate', 7, 'footer text'],
  ['ink', 'confirm', 7, '[confirm] review chip'],
];

let failed = 0;
for (const [fg, bg, min, where] of pairs) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${min})  ${fg} on ${bg}  — ${where}`);
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) below target`);
  process.exit(1);
}
console.log('\nAll contrast pairs pass.');
