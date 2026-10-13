// Google listing, location and review links (Oct 13). The site shows no Google rating or review count while VOW
// works on its reviews: no rating text, no aggregateRating/review in JSON-LD, and an invitation to leave a review.
import { test, expect } from '@playwright/test';
import { builtPages } from './pages';
import business from '../../src/data/business.json' with { type: 'json' };

const g = business.google;
const RATING_TEXT = /\b[34]\.4\b|★|☆|out of 5|Rated \d|\d+ reviews/i;

test('no aggregateRating or review in any JSON-LD; AutoRepair has geo and hasMap', async ({ page }) => {
  for (const path of builtPages()) {
    await page.goto(path);
    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(raw, path).not.toMatch(/aggregateRating|"review"|ratingValue|reviewCount/);
      const ld = JSON.parse(raw);
      if (ld['@type'] === 'AutoRepair') {
        expect(ld.geo, path).toEqual({ '@type': 'GeoCoordinates', latitude: 43.8030407, longitude: -79.4857099 });
        expect(ld.hasMap, path).toBe(g.url);
      }
    }
  }
});

test('no rating or star text on /, /reviews, /contact', async ({ page }) => {
  for (const path of ['/', '/reviews', '/contact']) {
    await page.goto(path);
    await expect(page.locator('body'), path).not.toContainText(RATING_TEXT);
  }
});

test('/reviews invites a Google review and links to the listing', async ({ page }) => {
  await page.goto('/reviews');
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: /Leave us a Google review/ })).toHaveAttribute('href', g.reviewUrl);
  await expect(main.getByRole('link', { name: /Read our reviews on Google/ })).toHaveAttribute('href', g.url);
  await expect(page.locator('footer').getByRole('link', { name: /Review us on Google/ })).toHaveAttribute('href', g.reviewUrl);
});

test('directions and the exact listing on / and /contact; no Maps embed', async ({ page }) => {
  expect(business.address.mapsUrl).toContain(`destination_place_id=${g.placeId}`);
  for (const path of ['/', '/contact']) {
    await page.goto(path);
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: /Get directions/ }), path).toHaveAttribute('href', business.address.mapsUrl);
    await expect(main.getByRole('link', { name: /Find us on Google Maps/ }), path).toHaveAttribute('href', g.url);
    await expect(main, path).toContainText('1841 Hwy 7');
    await expect(page.locator('iframe'), path).toHaveCount(0);
  }
});
