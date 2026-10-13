// Site photo pipeline (plan V11; adapted from buro-rvfarm-web scripts/photos.mjs at Oct 12).
// For every photo in src/data/photos.json (only photos Rae confirmed as VOW's own):
//   source = vault PHOTOS-TO-ENHANCE/enhanced/vacationsonwheels/<file> if it exists, else PHOTOS-TO-ENHANCE/vacationsonwheels/<file>
//   output = src/assets/photos/<out>  (1,600 px long edge, JPEG q80, VOW badge watermark bottom right)
// Originals in the vault are only read, never written. Re-runs skip outputs newer than their source; --force redoes all.
// Usage: node scripts/photos.mjs [--force] [--vault "../Buro Enterprise"]
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const force = args.includes('--force');
const vaultArg = args.indexOf('--vault');
const VAULT = resolve(vaultArg >= 0 ? args[vaultArg + 1] : '../Buro Enterprise');
const SRC_ENHANCED = join(VAULT, 'PHOTOS-TO-ENHANCE/enhanced/vacationsonwheels');
const SRC_ORIGINAL = join(VAULT, 'PHOTOS-TO-ENHANCE/vacationsonwheels');
const OUT = resolve('src/assets/photos');
const LOGO = resolve('src/assets/brand/vow-logo.png');

const LONG_EDGE = 1600;
const MARK_WIDTH = 0.09; // the source photos are wide (2048 × 853), so a smaller share than RV Farm's 0.14
const MARK_MARGIN = 0.02;
const MARK_OPACITY = 0.85;

if (!existsSync(SRC_ORIGINAL)) {
  console.error(`Vault photos not found at ${SRC_ORIGINAL}. Pass --vault <path>.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const { photos } = JSON.parse(readFileSync('src/data/photos.json', 'utf8'));

/** The VOW badge on a rounded white plate at MARK_OPACITY, `w` px wide. */
async function watermark(w) {
  const meta = await sharp(LOGO).metadata();
  const h = Math.round((w * meta.height) / meta.width);
  const pad = Math.round(w * 0.08);
  const plate = Buffer.from(
    `<svg width="${w + pad * 2}" height="${h + pad * 2}"><rect width="100%" height="100%" rx="${pad}" ry="${pad}" fill="#fff" fill-opacity="${MARK_OPACITY}"/></svg>`,
  );
  const logo = await sharp(LOGO).resize(w, h).png().toBuffer();
  return sharp(plate).composite([{ input: logo, left: pad, top: pad }]).png().toBuffer();
}

let made = 0, skipped = 0, enhanced = 0, missing = 0;
for (const p of photos) {
  const enhancedPath = join(SRC_ENHANCED, p.file);
  const src = existsSync(enhancedPath) ? enhancedPath : join(SRC_ORIGINAL, p.file);
  if (!existsSync(src)) { console.warn(`missing: ${p.file}`); missing++; continue; }
  if (src === enhancedPath) enhanced++;
  const out = join(OUT, p.out);
  if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs) { skipped++; continue; }

  const { data, info } = await sharp(src).rotate()
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const mark = await watermark(Math.round(info.width * MARK_WIDTH));
  const markMeta = await sharp(mark).metadata();
  const margin = Math.round(info.width * MARK_MARGIN);
  await sharp(data)
    .composite([{ input: mark, left: info.width - markMeta.width - margin, top: info.height - markMeta.height - margin }])
    .jpeg({ quality: 80, mozjpeg: true })
    .withMetadata({ exif: { IFD0: { Copyright: `© ${new Date().getFullYear()} Vacations on Wheels Inc.`, Artist: 'Vacations on Wheels' } } })
    .toFile(out);
  made++;
}
console.log(`photos: ${made} written, ${skipped} up to date, ${enhanced} from enhanced/, ${missing} missing`);
if (missing) process.exit(1);
