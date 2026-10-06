import { defineConfig, devices } from '@playwright/test';
import { SITE_ORIGIN, FORMS_ORIGIN } from './tests/e2e/origins';

// Runs against the built site (`npm run build` first) served by `astro preview`.
// The `forms` project builds its own copy with a test Web3Forms key (dist-forms), so the real form renders;
// the tests intercept the POST to Web3Forms, so nothing is ever sent.
// Projects split by file: `site` + `forms` are the verify gate (npm run test:e2e); `shots` (npm run shots)
// and `android` (npm run test:android) run on request.
const port = (origin: string) => new URL(origin).port;

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
  },
  projects: [
    { name: 'site', testIgnore: /(forms|screenshots|android)\.spec\.ts/, use: { baseURL: SITE_ORIGIN } },
    { name: 'forms', testMatch: /forms\.spec\.ts/, use: { baseURL: FORMS_ORIGIN } },
    { name: 'shots', testMatch: /screenshots\.spec\.ts/, use: { baseURL: SITE_ORIGIN } },
    { name: 'android', testMatch: /android\.spec\.ts/, use: { baseURL: SITE_ORIGIN } },
  ],
  webServer: [
    {
      command: `npx astro preview --port ${port(SITE_ORIGIN)}`,
      url: SITE_ORIGIN,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: `npx astro build && npx astro preview --port ${port(FORMS_ORIGIN)} --ignore-lock`,
      url: FORMS_ORIGIN,
      env: { VOW_OUT_DIR: 'dist-forms', PUBLIC_WEB3FORMS_KEY: 'test-key-not-real', PUBLIC_SITE_ORIGIN: FORMS_ORIGIN },
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
