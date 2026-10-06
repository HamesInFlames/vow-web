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

export interface NavItem { label: string; href: string; external?: boolean; note?: string; children?: NavItem[] }

// Plan §3b, with the VOW Phase 4 "Sell or consign" panel. "Book service" is the header button, not a nav item.
// Warranty sits in the Services panel so six top-level items don't crowd the header at 1024 px.
export const primaryNav: NavItem[] = [
  {
    label: 'Services', href: '/services', children: [
      { label: 'All services', href: '/services' },
      { label: 'Winterizing', href: '/services/winterizing' },
      { label: 'Power sports', href: '/power-sports' },
      { label: 'Pick-up', href: '/pick-up-and-delivery' },
      { label: 'Park home removal', href: '/park-home-removal' },
      { label: 'Warranty', href: '/warranty' },
    ],
  },
  {
    label: 'Sell or consign', href: '/consign', children: [
      { label: 'Sell it with us (consignment)', href: '/consign' },
      { label: 'Park home removal', href: '/park-home-removal' },
      { label: 'Financing', href: '/financing' },
    ],
  },
  {
    label: 'Parts', href: '/parts', children: [
      { label: 'Parts', href: '/parts' },
      { label: 'Request a part', href: '/parts/request' },
    ],
  },
  { label: 'Insurance claims', href: '/insurance-claims' },
  {
    label: 'About', href: '/about', children: [
      { label: 'About us', href: '/about' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/** Nav items whose page (or a child's page) is built, with unbuilt children dropped. */
export function builtNav(items: NavItem[]): NavItem[] {
  return items
    .map((n) => (n.children ? { ...n, children: n.children.filter((c) => c.external || routeExists(c.href)) } : n))
    .filter((n) => n.external || routeExists(n.href) || (n.children?.length ?? 0) > 0);
}

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Service',
    items: [
      { label: 'All services', href: '/services' },
      { label: 'Winterizing', href: '/services/winterizing' },
      { label: 'Book service', href: '/book' },
      { label: 'Pick-up', href: '/pick-up-and-delivery' },
      { label: 'Power sports', href: '/power-sports' },
    ],
  },
  {
    heading: 'Sell or consign',
    items: [
      { label: 'Sell it with us', href: '/consign' },
      { label: 'Park home removal', href: '/park-home-removal' },
      { label: 'Financing', href: '/financing' },
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
