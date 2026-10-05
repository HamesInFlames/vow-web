// axe on every built page, desktop and phone width, menu closed and open. Zero violations (plan D13).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { builtPages } from './pages';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const summarize = (v: { id: string; nodes: { target: unknown }[]; help: string }[]) =>
  v.map((x) => `${x.id}: ${x.help} → ${x.nodes.map((n) => JSON.stringify(n.target)).join(', ')}`).join('\n');

for (const width of [1440, 375]) {
  for (const path of builtPages()) {
    test(`axe ${width}px ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(results.violations, summarize(results.violations)).toEqual([]);

      // Phone menu open state, where the page has one.
      const menu = page.locator('header details summary');
      if (width === 375 && (await menu.count())) {
        await menu.click();
        const open = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(open.violations, summarize(open.violations)).toEqual([]);
      }
    });
  }
}

test('tap targets are at least 44px on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const small: string[] = [];
  for (const path of builtPages()) {
    await page.goto(path);
    const found = await page.$$eval('a, button, summary, input, select, textarea', (els) =>
      els
        .filter((el) => {
          // A radio or checkbox inside its <label> is tapped through the label.
          const target = el.matches('input[type=radio], input[type=checkbox]') && el.closest('label') ? el.closest('label')! : el;
          const r = target.getBoundingClientRect();
          const s = getComputedStyle(el);
          if (r.width === 0 || s.visibility === 'hidden' || el.closest('.sr-only')) return false;
          // Stretched links (::after covering a card) take the whole card as their target.
          if (getComputedStyle(el, '::after').position === 'absolute') return false;
          // Inline links inside running text are exempt (WCAG 2.5.8 inline exception).
          if (el.tagName === 'A' && s.display === 'inline' && el.parentElement && /^(P|LI|TD|SPAN)$/.test(el.parentElement.tagName)
            && (el.parentElement.textContent ?? '').trim().length > (el.textContent ?? '').trim().length + 10) return false;
          return r.height < 44;
        })
        .map((el) => `${el.tagName.toLowerCase()}${el.getAttribute('type') ? `[${el.getAttribute('type')}]` : ''} "${(el.textContent || el.getAttribute('name') || '').trim().slice(0, 40)}" ${Math.round(el.getBoundingClientRect().height)}px`),
    );
    small.push(...found.map((f) => `${path}: ${f}`));
  }
  expect(small, small.join('\n')).toEqual([]);
});

test('body text is at least 17px on phones and 18px on desktop', async ({ page }) => {
  for (const [width, min] of [[375, 17], [1440, 18]] as const) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of builtPages()) {
      await page.goto(path);
      const size = await page.$eval('body', (b) => parseFloat(getComputedStyle(b).fontSize));
      expect(size, `${path} at ${width}px`).toBeGreaterThanOrEqual(min);
    }
  }
});
