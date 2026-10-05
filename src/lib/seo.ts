// JSON-LD builders. NAP comes only from business.json.
import business from '../data/business.json';
import type { Hours, DayKey } from './hours';

const SCHEMA_DAYS: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export function localBusinessJsonLd() {
  const d = business;
  const hours = d.hours as Hours;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${d.siteUrl}/#business`,
    name: d.brandName,
    legalName: d.legalName,
    url: d.siteUrl,
    description: d.description,
    telephone: `+1-${d.phones.main}`,
    ...(d.email ? { email: d.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: d.address.street,
      addressLocality: d.address.city,
      addressRegion: d.address.region,
      postalCode: d.address.postal,
      addressCountry: d.address.country,
    },
    openingHoursSpecification: (Object.keys(hours) as DayKey[])
      .filter((k) => hours[k])
      .map((k) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAYS[k],
        opens: hours[k]![0],
        closes: hours[k]![1],
      })),
    sameAs: Object.values(d.social),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.path, business.siteUrl).href,
    })),
  };
}
