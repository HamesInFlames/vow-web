// Lighthouse CI, mobile preset, against the built site (plan D13: performance ≥ 0.9).
// URLs come from dist/sitemap-0.xml: one page per page type (LH_ALL=1 for every page).
const { readFileSync } = require('node:fs');

const paths = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const kind = (p) => (/^\/services\/[^/]+$/.test(p) ? 'service' : p);
const picked = process.env.LH_ALL ? paths : paths.filter((p, i) => paths.findIndex((q) => kind(q) === kind(p)) === i);
const urls = picked.map((p) => `http://localhost:4322${p}`);

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx astro preview --port 4322',
      startServerReadyPattern: 'localhost:4322',
      url: urls,
      numberOfRuns: 3, // assertions use the median run
      // Mobile is Lighthouse's default form factor (Moto G Power emulation, slow 4G, 4× CPU).
      settings: { formFactor: 'mobile', throttlingMethod: 'simulate' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
        'categories:seo': ['warn', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1_500_000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'test-results/lighthouse' },
  },
};
