// Regression tests carried over from the RV Farm Oct 2 code review (the ones that apply to VOW).
import { test, expect } from '@playwright/test';
import { builtPages } from './pages';

test('canonical and og:url are clean URLs (no .html, no /index)', async ({ page }) => {
  for (const path of builtPages().filter((p) => p !== '/404')) {
    await page.goto(path);
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
    const og = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(canonical, path).not.toMatch(/\.html$|\/index$/);
    expect(new URL(canonical!).pathname, path).toBe(path);
    expect(og, path).toBe(canonical);
  }
});

test('production build hides unverified claims', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
  await expect(page.getByText('Certified technicians.')).toHaveCount(0);
});

test('production build hides unconfirmed services and FAQ answers', async ({ page, request }) => {
  expect((await request.get('/services/engine-and-electrical')).status()).toBe(404);
  expect((await request.get('/services/insurance-claim-repairs')).status()).toBe(404);
  await page.goto('/services');
  await expect(page.getByRole('region', { name: 'Services' }).getByRole('link', { name: 'Winterizing' })).toBeVisible();
  await expect(page.getByText('Engine and electrical')).toHaveCount(0);
  await page.goto('/services/annual-inspection');
  await expect(page.getByText('safety standards certificate')).toHaveCount(0);
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
});

test('service pages: price line, pre-filled booking link, FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/services/winterizing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Winterizing');
  await expect(page.getByRole('complementary', { name: 'Price and booking' })).toContainText('Quote after inspection');
  await expect(page.getByRole('link', { name: 'Book this service' })).toHaveAttribute('href', '/book?service=winterizing');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = ld.map((t) => JSON.parse(t)['@type']);
  expect(types).toEqual(expect.arrayContaining(['AutoRepair', 'BreadcrumbList', 'FAQPage']));
});

test('without a form key the booking form is replaced by a call block (no lead can be lost)', async ({ page }) => {
  await page.goto('/book');
  await expect(page.locator('form[action*="web3forms"]')).toHaveCount(0);
  await expect(page.getByText('Our online form isn’t switched on yet.')).toBeVisible();
});

test('phones: no sideways scroll and the header Menu button stays on screen (320 and 375 px)', async ({ page }) => {
  for (const w of [320, 375]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const path of builtPages()) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${w}px ${path}`).toBeLessThanOrEqual(w);
      const menu = await page.locator('header summary').boundingBox();
      if (menu) expect(menu.x + menu.width, `${w}px ${path} Menu button`).toBeLessThanOrEqual(w);
    }
  }
});
