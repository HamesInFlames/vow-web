// robots.txt. Preview and review deploys stay out of search results until launch:
// set PUBLIC_ALLOW_INDEX=1 on the production build only (when the domain is live and James approves).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const allow = import.meta.env.PUBLIC_ALLOW_INDEX === '1';
  const body = allow
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
