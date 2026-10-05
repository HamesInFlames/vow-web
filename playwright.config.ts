import { defineConfig, devices } from '@playwright/test';

// Runs against the built site (`npm run build` first) served by `astro preview`.
// The `forms` project builds its own copy with a test Web3Forms key (dist-forms, port 4322), so the real
// form renders; the tests intercept the POST to Web3Forms, so nothing is ever sent.
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
    { name: 'site', testIgnore: /forms\.spec\.ts/, use: { baseURL: 'http://localhost:4321' } },
    { name: 'forms', testMatch: /forms\.spec\.ts/, use: { baseURL: 'http://localhost:4322' } },
  ],
  webServer: [
    {
      command: 'npx astro preview --port 4321',
      url: 'http://localhost:4321',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npx astro build && npx astro preview --port 4322 --ignore-lock',
      url: 'http://localhost:4322',
      env: { VOW_OUT_DIR: 'dist-forms', PUBLIC_WEB3FORMS_KEY: 'test-key-not-real', PUBLIC_SITE_ORIGIN: 'http://localhost:4322' },
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
