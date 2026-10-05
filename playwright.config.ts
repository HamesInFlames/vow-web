import { defineConfig, devices } from '@playwright/test';

// Runs against the built site (`npm run build` first) served by `astro preview`.
export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
  },
  webServer: {
    command: 'npx astro preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
