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

test('no sideways scroll; header controls stay on screen and on one line (320, 375, 1024, 1280 px)', async ({ page }) => {
  for (const w of [320, 375, 1024, 1280]) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const path of builtPages()) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${w}px ${path}`).toBeLessThanOrEqual(w);
      const overflow = await page.$$eval('body > header a, body > header summary', (els, vw) =>
        els.filter((el) => {
          if (el.closest('details:not([open]) > :not(summary)')) return false; // inside the closed phone menu
          const r = el.getBoundingClientRect();
          // Off the right edge, or squeezed so its label wraps onto several lines.
          return r.width > 0 && (r.right > vw || r.height > 64);
        })
          .map((el) => (el.textContent ?? '').trim().slice(0, 30)), w);
      expect(overflow, `${w}px ${path} header`).toEqual([]);
    }
  }
});

test('production build hides unconfirmed steps, plans lists and review placeholders', async ({ page }) => {
  await page.goto('/insurance-claims');
  await expect(page.getByText('You pay your deductible when you pick it up')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'What we repair' })).toBeVisible();
  await page.goto('/parts');
  await expect(page.getByRole('heading', { name: 'Onan generators' })).toHaveCount(0);
  await page.goto('/reviews');
  await expect(page.getByText('3–6 real Google reviews go here.')).toHaveCount(0);
  await page.goto('/terms');
  await expect(page.getByText('We will tell you before we do extra work.')).toHaveCount(0);
  for (const path of ['/insurance-claims', '/parts', '/reviews', '/about', '/warranty', '/terms']) {
    await page.goto(path);
    await expect(page.locator('.confirm-chip'), path).toHaveCount(0);
  }
});

test('every form page shows the call block when there is no form key', async ({ page }) => {
  for (const path of ['/book', '/parts/request', '/insurance-claims']) {
    await page.goto(path);
    await expect(page.locator('form[action*="web3forms"]'), path).toHaveCount(0);
    await expect(page.getByText('Our online form isn’t switched on yet.'), path).toBeVisible();
  }
});

test('print: a service page prints its FAQ answers and the shop phone, without buttons or chrome', async ({ page }) => {
  await page.goto('/services/winterizing');
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect(page.getByText('Before overnight temperatures start dropping below freezing.', { exact: false })).toBeVisible();
  await expect(page.locator('.print-only')).toContainText('905-738-1253');
  await expect(page.getByRole('link', { name: 'Book this service' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden();
  await expect(page.locator('footer')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await expect(page.locator('.print-only')).toBeHidden();
});
