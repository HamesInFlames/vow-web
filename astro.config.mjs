// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import business from './src/data/business.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: business.siteUrl,
  output: 'static',
  // The form tests build a second copy with a test Web3Forms key into dist-forms (playwright.config.ts).
  outDir: process.env.VOW_OUT_DIR || 'dist',
  // Test builds run in parallel (playwright.config.ts), so each gets its own cache and content store.
  ...(process.env.VOW_OUT_DIR ? { cacheDir: `./node_modules/.astro-${process.env.VOW_OUT_DIR}` } : {}),
  trailingSlash: 'never',
  build: { format: 'file' },
  // /thanks is noindex, so it stays out of the sitemap.
  integrations: [react(), sitemap({ filter: (page) => !page.endsWith('/thanks') })],
  // Self-hosted at build time (no Google request from the browser); plan D8.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Public Sans',
      cssVariable: '--font-public-sans',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
