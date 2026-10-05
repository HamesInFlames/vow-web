// "Every button leads somewhere": every <a> on every built page resolves (plan D13).
// Internal links must return 200; external links 2xx/3xx; tel:/sms:/mailto: must be well formed.
import { test, expect, request } from '@playwright/test';
import { builtPages } from './pages';

const EXTERNAL_TIMEOUT = 20_000;

test('every link on every page resolves', async ({ page, baseURL }) => {
  test.setTimeout(10 * 60_000);
  const hrefs = new Map<string, string>(); // href → first page it was found on
  for (const path of builtPages()) {
    const res = await page.goto(path);
    // The 404 page itself may be served with 200 when requested by name.
    if (path === '/404') expect([200, 404], '/404 itself').toContain(res?.status());
    else expect(res?.status(), `${path} itself`).toBe(200);
    const found = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')!));
    for (const h of found) if (!hrefs.has(h)) hrefs.set(h, path);
  }

  const api = await request.newContext({ ignoreHTTPSErrors: false });
  const failures: string[] = [];
  for (const [href, from] of hrefs) {
    if (/^tel:\+1\d{10}$/.test(href) || /^sms:\+1\d{10}$/.test(href)) continue;
    if (/^(tel|sms):/.test(href)) { failures.push(`${href} (malformed, on ${from})`); continue; }
    if (/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href)) continue;
    if (href.startsWith('#')) {
      await page.goto(from);
      const id = decodeURIComponent(href.slice(1));
      if (id && (await page.locator(`[id="${id}"]`).count()) === 0) failures.push(`${href} (no target on ${from})`);
      continue;
    }
    const url = new URL(href, new URL(from, baseURL));
    const internal = url.origin === new URL(baseURL!).origin;
    try {
      const r = internal
        ? await api.get(url.href, { maxRedirects: 0 })
        : await api.get(url.href, { timeout: EXTERNAL_TIMEOUT, maxRedirects: 5, headers: { 'user-agent': 'Mozilla/5.0 (link check)' } });
      const ok = internal ? r.status() === 200 : r.status() < 400;
      if (!ok) failures.push(`${href} → ${r.status()} (on ${from})`);
      if (internal && url.hash) {
        await page.goto(url.pathname);
        if ((await page.locator(`[id="${url.hash.slice(1)}"]`).count()) === 0) failures.push(`${href} (no #${url.hash.slice(1)} target)`);
      }
    } catch (e) {
      failures.push(`${href} → ${(e as Error).message.split('\n')[0]} (on ${from})`);
    }
  }
  console.log(`Checked ${hrefs.size} unique links on ${builtPages().length} pages.`);
  expect(failures, failures.join('\n')).toEqual([]);
});
