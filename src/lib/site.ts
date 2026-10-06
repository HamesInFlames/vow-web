// Site-wide helpers: review mode, built-route detection, navigation.
import business from '../data/business.json';

/** Review builds show yellow [confirm] chips; production builds hide them. `PUBLIC_REVIEW=1 npm run build`. */
export const REVIEW = import.meta.env.PUBLIC_REVIEW === '1';

// Every page file under src/pages, so links only render for routes that exist (no dead ends while phases land).
const pageFiles = Object.keys(import.meta.glob('/src/pages/**/*.{astro,ts,md}'));
const builtRoutes = new Set(
  pageFiles.map((f) =>
    f.replace(/^\/src\/pages/, '').replace(/\.(astro|ts|md)$/, '').replace(/\/index$/, '') || '/',
  ),
);
// /services/[slug] builds one page per visible service (same rule as lib/services.ts).
if (builtRoutes.has('/services/[slug]')) {
  const services = import.meta.glob<{ confirmed: boolean }>('/src/content/services/*.json', { eager: true, import: 'default' });
  for (const [file, s] of Object.entries(services)) {
    if (s.confirmed || REVIEW) builtRoutes.add(`/services/${file.split('/').pop()!.replace(/\.json$/, '')}`);
  }
}

/** True when `path` (e.g. "/book", "/services#winter") maps to a page in src/pages. */
export function routeExists(path: string): boolean {
  if (/^(https?:|tel:|sms:|mailto:)/.test(path)) return true;
  const clean = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return builtRoutes.has(clean);
}

export interface NavItem { label: string; href: string; external?: boolean; note?: string }

// Plan §3b. "Book service" is the header button, not a nav item.
export const primaryNav: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Parts', href: '/parts' },
  { label: 'Insurance claims', href: '/insurance-claims' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'About', href: '/about' },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Service',
    items: [
      { label: 'All services', href: '/services' },
      { label: 'Winterizing', href: '/services/winterizing' },
      { label: 'Book service', href: '/book' },
      { label: 'Pick-up', href: '/pick-up-and-delivery' },
    ],
  },
  {
    heading: 'Parts and claims',
    items: [
      { label: 'Parts', href: '/parts' },
      { label: 'Request a part', href: '/parts/request' },
      { label: 'Insurance claims', href: '/insurance-claims' },
      { label: 'Warranty', href: '/warranty' },
    ],
  },
  {
    heading: 'The shop',
    items: [
      { label: 'About us', href: '/about' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Contact', href: '/contact' },
      { label: `${business.sibling.name} (sales)`, href: business.sibling.url, external: true },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Site map', href: '/sitemap' },
];
