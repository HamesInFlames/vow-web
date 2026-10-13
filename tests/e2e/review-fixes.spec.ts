// Regression tests carried over from the RV Farm Oct 2 code review (the ones that apply to VOW).
import { test, expect } from '@playwright/test';
import { builtPages } from './pages';
import business from '../../src/data/business.json' with { type: 'json' };
import consign from '../../src/data/consign.json' with { type: 'json' };

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
  // Rae, Oct 8: warranty repair and pick-up/mobile service stay off; engine/electrical and insurance claims are on.
  expect((await request.get('/services/warranty-repair')).status()).toBe(404);
  expect((await request.get('/services/mobile-service-and-transport')).status()).toBe(404);
  expect((await request.get('/services/engine-and-electrical')).status()).toBe(200);
  expect((await request.get('/services/insurance-claim-repairs')).status()).toBe(200);
  await page.goto('/services');
  const list = page.getByRole('region', { name: 'Services' });
  await expect(list.getByRole('link', { name: 'Winterizing' })).toBeVisible();
  await expect(list.getByRole('link', { name: 'Engine and electrical' })).toBeVisible();
  await expect(list.getByRole('link', { name: 'Warranty repair' })).toHaveCount(0);
  await expect(list.getByRole('link', { name: 'Pick-up and mobile service' })).toHaveCount(0);
  await page.goto('/services/annual-inspection');
  await expect(page.getByText('safety standards certificate')).toHaveCount(0);
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
});

test('service pages: price line, pre-filled booking link, FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/services/winterizing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Winterizing');
  // Winterizing: trailers $199, motorhomes $249, plus parts and HST (Paul Oct 5, Rae Oct 8). Not "all-in": Rae didn't approve it.
  await expect(page.getByRole('complementary', { name: 'Price and booking' })).toContainText('Trailers $199, motorhomes $249, plus parts and HST');
  await expect(page.locator('main')).not.toContainText(/all-in/i);
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

test('no sideways scroll; header controls stay on screen and on one line (320, 375, 1024, 1280, 1440 px)', async ({ page }) => {
  for (const w of [320, 375, 1024, 1280, 1440]) {
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
  // The claim steps were confirmed on Oct 8 and now show in production.
  await expect(page.getByText('You pay your deductible when you pick it up')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What we repair' })).toBeVisible();
  await expect(page.locator('main')).toContainText('We work with any insurance company.');
  await page.goto('/parts');
  await expect(page.getByRole('heading', { name: 'Onan generators' })).toHaveCount(0);
  await expect(page.locator('a[href*="rvflipbook"]')).toHaveCount(0); // NTP link removed (Rae, Oct 8)
  await expect(page.getByRole('heading', { name: 'Browse the catalogue' })).toHaveCount(0); // Atlas: no URL yet
  await page.goto('/reviews');
  await expect(page.getByText('3–6 real Google reviews go here.')).toHaveCount(0);
  await page.goto('/terms');
  await expect(page.locator('main')).toContainText('we do no work beyond the estimate without your OK');
  await page.goto('/warranty');
  await expect(page.getByRole('heading', { name: 'Warranty repairs' })).toHaveCount(0);
  await expect(page.getByText('Platinum cargo and utility trailer coverage')).toHaveCount(0);
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
  const answer = page.locator('main details p').first();
  await expect(answer).toBeHidden();
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect(answer).toBeVisible();
  await expect(page.locator('.print-only')).toContainText(business.phones.main);
  await expect(page.getByRole('link', { name: 'Book this service' })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden();
  await expect(page.locator('footer')).toBeHidden();
  // After printing, the accordions go back to how the visitor left them.
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await page.emulateMedia({ media: 'screen' });
  await expect(answer).toBeHidden();
  await expect(page.locator('.print-only')).toBeHidden();
});

test('consignment in production: no lawyer-gated types, no unconfirmed terms, cost sentence present', async ({ page }) => {
  await page.goto('/consign');
  const main = page.locator('main');
  for (const t of consign.types.filter((x) => x.lawyer)) await expect(main.getByText(t.label)).toHaveCount(0);
  for (const t of consign.terms.filter((x) => 'confirm' in x)) await expect(main.getByText(t.text)).toHaveCount(0);
  await expect(main.locator('[data-cost-sentence]')).toHaveText(consign.costSentence);
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
  // Production wording never invites a motorhome trade.
  await expect(main).not.toContainText(/motorhome/i);
});

test('desktop menu panels open on click, one at a time, and close on Escape or an outside click', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  const warranty = nav.getByRole('link', { name: 'Warranty' });
  const reviews = nav.getByRole('link', { name: 'Reviews' });
  await expect(warranty).toBeHidden();
  await nav.locator('summary', { hasText: 'Services' }).click();
  await expect(warranty).toBeVisible();
  await nav.locator('summary', { hasText: 'About' }).click();
  await expect(warranty).toBeHidden();
  await expect(reviews).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(reviews).toBeHidden();
  await nav.locator('summary', { hasText: 'Services' }).click();
  await page.locator('main h1').click();
  await expect(warranty).toBeHidden();
});

test('park home removal in production: rate shown, unproven claims hidden', async ({ page }) => {
  await page.goto('/park-home-removal');
  const main = page.locator('main');
  await expect(main).toContainText('$6.50 per km, plus HST');
  await expect(main).toContainText('One way, measured from where the home is picked up');
  await expect(main).toContainText('8 to 16 feet wide and up to 80 feet long');
  for (const t of ['Fully insured', 'MTO oversize permits', 'every park']) await expect(main).not.toContainText(t);
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
});

test('power sports in production: book links for all four, sell links only where not lawyer-gated', async ({ page }) => {
  await page.goto('/power-sports');
  for (const id of ['motorcycle', 'atv', 'snowmobile', 'boat']) {
    await expect(page.locator(`a[href="/book?vehicle=${id}"]`)).toHaveCount(1);
  }
  for (const t of consign.types.filter((x) => ['motorcycle', 'atv', 'snowmobile', 'boat'].includes(x.id))) {
    await expect(page.locator(`a[href^="/consign?type=${t.id}"]`), t.id).toHaveCount(t.lawyer ? 0 : 1);
  }
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
});

test('financing in production: no lender line, no rates or payment examples', async ({ page }) => {
  await page.goto('/financing');
  const main = page.locator('main');
  await expect(main).not.toContainText(/approved credit|\bOAC\b|\bAPR\b|\b0%|per month|a month|\/mo\b|bi-?weekly/i);
  await expect(main).toContainText('This isn’t a credit application');
  await expect(page.locator('.confirm-chip')).toHaveCount(0);
});

test('services without a confirmed price say "Quote after inspection"; /services shows the shop rates', async ({ page }) => {
  await page.goto('/services/annual-inspection');
  await expect(page.getByRole('complementary', { name: 'Price and booking' })).toContainText('Quote after inspection');
  await page.goto('/services');
  const rates = page.getByRole('region', { name: 'Shop rates' });
  await expect(rates).toContainText(`$${business.rates.labourTrailersPerHourCad} an hour for trailers`);
  await expect(rates).toContainText(`$${business.rates.labourMotorhomesPerHourCad} an hour for motorhomes`);
  // Estimate fee told before booking (Ontario CPA): 4 h at the unit's rate.
  await expect(rates).toContainText(`A written estimate has a fee: ${business.rates.estimateFeeHours} hours of labour`);
  await expect(rates).toContainText('$796 for a trailer, $996 for a motorhome');
  await page.goto('/book');
  await expect(page.locator('[data-estimate-fee]')).toContainText('A written estimate has a fee');
  await page.goto('/services/preventative-maintenance');
  await expect(page.getByRole('complementary', { name: 'Price and booking' })).toContainText('$199 an hour for trailers, $249 for motorhomes');
});

test('consignment raw HTML in production: no lawyer-gated labels or hidden FAQ answers anywhere (props, JSON-LD, meta)', async ({ request }) => {
  const html = await (await request.get('/consign')).text();
  for (const t of consign.types.filter((x) => x.lawyer)) expect(html, t.label).not.toContain(t.label);
  for (const f of consign.faq.filter((x) => 'confirm' in x)) {
    expect(html, f.q).not.toContain(f.q);
    expect(html, f.q).not.toContain(f.a);
  }
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faqPage = ld.find((x) => x['@type'] === 'FAQPage');
  expect(faqPage.mainEntity.map((q: { name: string }) => q.name)).toEqual(consign.faq.filter((x) => !('confirm' in x)).map((x) => x.q));
  expect(html).not.toMatch(/OMVIC|licensed dealer|registered dealer|2,495/i);
});

test('business details from Rae (Oct 8): email, socials, Saturday by appointment, no Text button', async ({ page }) => {
  await page.goto('/contact');
  const main = page.locator('main');
  await expect(main.locator('a[href="mailto:vacationsonwheels@gmail.com"]')).toHaveCount(1);
  await expect(main.locator('a[href="https://www.instagram.com/vacations__on__wheels"]')).toHaveCount(1);
  await expect(main.locator('a[href="https://www.tiktok.com/@vacations_on_wheels"]')).toHaveCount(1);
  await expect(main.locator('[data-appointment-note]')).toContainText('No walk-ins');
  const html = await page.content();
  expect(html).not.toMatch(/facebook\.com|vacationsonwheelsinc|vacationsonwheel@/i);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
  const biz = ld.find((x) => x['@type'] === 'AutoRepair');
  expect(biz.legalName).toBe('Vacations on Wheels Inc.');
  expect(biz.address.streetAddress).toBe('1841 Hwy 7');
  expect(biz.address.postalCode).toBe('L4K 1V4');
  expect(biz.sameAs).toEqual(['https://www.instagram.com/vacations__on__wheels', 'https://www.tiktok.com/@vacations_on_wheels']);
  expect(biz.openingHoursSpecification.map((d: { dayOfWeek: string }) => d.dayOfWeek)).not.toContain('Saturday');
  await page.setViewportSize({ width: 375, height: 800 });
  await expect(page.getByRole('navigation', { name: 'Quick actions' }).getByRole('link', { name: 'Text' })).toHaveCount(0);
});

test('team facts (Rae, Oct 8) show; Spanish and "certified" wording is gone', async ({ page }) => {
  await page.goto('/about');
  const main = page.locator('main');
  for (const t of ['30 years in business.', '45 years of combined experience.', 'A team of 4 and 7 service bays.', 'A multicultural team with international experience.']) {
    await expect(main).toContainText(t);
  }
  await expect(main).not.toContainText(/spanish|certified/i);
  await page.goto('/warranty');
  await expect(page.locator('[data-warranty-price]')).toHaveText('$2,495 plus HST, for up to 3 years');
  await expect(page.locator('main')).toContainText('Tires are not covered');
});
