// The review build (PUBLIC_REVIEW=1, dist-review): what Rae and the lawyer see that customers don't.
// Pairs with the production checks in review-fixes.spec.ts.
import { test, expect } from '@playwright/test';
import consign from '../../src/data/consign.json' with { type: 'json' };

const lawyerTypes = consign.types.filter((t) => t.lawyer);

test('lawyer-gated consignment types show with a "lawyer to review" chip', async ({ page }) => {
  expect(lawyerTypes.length).toBeGreaterThan(0);
  await page.goto('/consign');
  const tiles = page.getByRole('region', { name: 'What we take' });
  for (const t of lawyerTypes) {
    const tile = tiles.getByRole('listitem').filter({ has: page.getByRole('link', { name: t.label, exact: true }) });
    await expect(tile).toBeVisible();
    await expect(tile.locator('.confirm-chip')).toHaveText(/lawyer to review/);
  }
});

test('unconfirmed consignment terms show with a [confirm] chip', async ({ page }) => {
  await page.goto('/consign');
  for (const term of consign.terms.filter((t) => 'confirm' in t)) {
    const row = page.getByRole('region', { name: 'What it costs' }).locator('dl > div').filter({ hasText: term.label });
    await expect(row).toContainText(term.text);
    await expect(row.locator('.confirm-chip')).toBeVisible();
  }
});

test('review build shows no Google rating either (Oct 13)', async ({ page }) => {
  for (const path of ['/', '/reviews']) {
    await page.goto(path);
    await expect(page.locator('body'), path).not.toContainText(/\b[34]\.4\b|★|out of 5|Rated \d/);
    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(raw, path).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
    }
  }
  await expect(page.getByRole('link', { name: /Leave us a Google review/ }).first()).toBeVisible();
});
