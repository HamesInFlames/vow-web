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
