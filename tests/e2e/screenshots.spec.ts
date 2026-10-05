// Viewport-height screenshot tiles of each page type at 1440 and 375 px (DPR 1), for visual review.
// Saved to test-results/shots/<width>/<page>-<n>.png. Not an assertion; a human (or Claude) looks at them.
import { test } from '@playwright/test';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { pageTypes } from './pages';

const MAX_TILES = 8;

for (const [width, height] of [[1440, 900], [375, 812]] as const) {
  for (const path of pageTypes()) {
    test(`shots ${width}px ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const name = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '_');
      const dir = `test-results/shots/${width}`;
      mkdirSync(dir, { recursive: true });
      for (const f of readdirSync(dir)) if (f.startsWith(`${name}-`)) rmSync(`${dir}/${f}`);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const tiles = Math.min(MAX_TILES, Math.ceil(total / height));
      for (let i = 0; i < tiles; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * height);
        await page.waitForTimeout(100);
        await page.screenshot({ path: `${dir}/${name}-${i + 1}.png` });
      }
    });
  }
}
