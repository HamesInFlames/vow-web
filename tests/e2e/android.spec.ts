// Emulated Android pass (plan §3g Phase 3): Pixel 7 viewport and touch, 4× CPU slowdown, slow 4G
// (150 ms RTT, 1.6 Mbps down). Not a real phone: it doesn't cover the real dialer, Samsung Internet or
// real touch feel. Run with `npm run test:android` (its own project, outside `verify`: it's slow).
import { test, expect, devices, type Page } from '@playwright/test';
import { builtPages } from './pages';
import { FORMS_ORIGIN } from './origins';
import business from '../../src/data/business.json' with { type: 'json' };
import { telHref } from '../../src/lib/format';

const { defaultBrowserType: _, ...pixel7 } = devices['Pixel 7'];
test.use({ ...pixel7 });
test.describe.configure({ mode: 'serial' });

async function throttle(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
}

test('android: every page loads fast enough, fits the screen and keeps the phone number in reach', async ({ page }) => {
  test.setTimeout(10 * 60_000);
  await throttle(page);
  const problems: string[] = [];
  for (const path of builtPages()) {
    const t0 = Date.now();
    await page.goto(path, { waitUntil: 'load' });
    const ms = Date.now() - t0;
    if (ms > 6000) problems.push(`${path}: load took ${ms} ms`);
    const vw = page.viewportSize()!.width;
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > vw) problems.push(`${path}: sideways scroll (${sw} > ${vw})`);
    // The sticky bar is on screen, at the bottom, with Call first.
    const bar = page.getByRole('navigation', { name: 'Quick actions' });
    const box = await bar.boundingBox();
    if (!box || Math.abs(box.y + box.height - page.viewportSize()!.height) > 2) problems.push(`${path}: sticky bar not at the bottom`);
    if ((await bar.getByRole('link').first().textContent())?.trim() !== 'Call') problems.push(`${path}: sticky bar doesn't start with Call`);
    // The bar never hides the end of the page: scrolled to the bottom, the last footer line is above it.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const lastLine = await page.evaluate(() => {
      const els = [...document.querySelectorAll('footer p, footer a')].filter((e) => (e as HTMLElement).offsetParent);
      return els.length ? els[els.length - 1].getBoundingClientRect().bottom : 0;
    });
    if (box && lastLine > box.y + 1) problems.push(`${path}: sticky bar covers the end of the footer`);
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('android: the phone menu opens by tap and every link in it is reachable', async ({ page }) => {
  await throttle(page);
  await page.goto('/');
  await page.locator('header summary').tap();
  const menu = page.getByRole('navigation', { name: 'Main menu' });
  await expect(menu).toBeVisible();
  for (const link of await menu.getByRole('link').all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport();
  }
});

test('android: tel links dial the shop', async ({ page }) => {
  await page.goto('/');
  const tels = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  expect(tels).toContain(telHref(business.phones.main));
  for (const t of tels) expect(t).toMatch(/^tel:\+1\d{10}$/);
});

test('android: the booking form can be filled and sent by touch (test-key build, send intercepted)', async ({ page }) => {
  test.setTimeout(120_000);
  await throttle(page);
  let sent = false;
  await page.route('https://api.web3forms.com/submit', (route) => {
    sent = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.goto(`${FORMS_ORIGIN}/book?service=winterizing`);
  await expect(page.getByRole('checkbox', { name: 'Winterizing' })).toBeChecked();
  await page.getByRole('textbox', { name: 'Your name' }).tap();
  await page.keyboard.type('Touch Test');
  await page.getByRole('textbox', { name: 'Phone', exact: true }).tap();
  await page.keyboard.type('9055550100');
  await page.getByText(/Please pick it up/).tap();
  await expect(page.getByLabel(/Where should we pick it up/)).toBeVisible();
  await page.getByText(/OK to contact me/).tap();
  await page.getByRole('button', { name: 'Send booking request' }).tap();
  await expect(page.getByRole('status')).toContainText('We’ll call you to confirm.');
  expect(sent).toBe(true);
});
