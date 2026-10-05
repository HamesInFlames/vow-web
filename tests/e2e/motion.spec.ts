// Reduced motion (plan §3f): the OS setting and the footer toggle both stop every animation and transition.
import { test, expect, type Page } from '@playwright/test';
import { builtPages } from './pages';

async function motionReport(page: Page) {
  return page.evaluate(() => {
    const running = document.getAnimations().filter((a) => {
      const t = a.effect?.getComputedTiming();
      return t && Number(t.duration) > 1;
    }).length;
    const slowTransitions = [...document.querySelectorAll('*')].filter((el) =>
      getComputedStyle(el).transitionDuration.split(',').some((d) => parseFloat(d) > 0.01),
    ).length;
    return { running, slowTransitions };
  });
}

for (const path of builtPages()) {
  test(`prefers-reduced-motion: nothing moves on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(300);
    expect(await motionReport(page)).toEqual({ running: 0, slowTransitions: 0 });
  });
}

test('footer toggle reduces motion and is remembered', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#motion-toggle');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  expect(await motionReport(page)).toEqual({ running: 0, slowTransitions: 0 });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});
