// The list of built pages, read from the sitemap in dist/ (plus the 404 page once it exists).
import { readFileSync, existsSync } from 'node:fs';

export function builtPages(): string[] {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (existsSync('dist/404.html')) paths.push('/404');
  return [...new Set(paths)];
}

/** One representative page per page type, for screenshots. Falls back to every page. */
export function pageTypes(): string[] {
  const pages = builtPages();
  const seen = new Map<string, string>();
  for (const p of pages) {
    const type = /^\/services\/[^/]+$/.test(p) ? 'service' : p;
    if (!seen.has(type)) seen.set(type, p);
  }
  return [...seen.values()];
}
