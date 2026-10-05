// Services from the content collection. Unconfirmed services and unconfirmed FAQ answers exist only in
// review builds (PUBLIC_REVIEW=1), the same rule as claims.json.
import { getCollection, type CollectionEntry } from 'astro:content';
import { REVIEW } from './site';

export type Service = CollectionEntry<'services'>;

/** Services this build shows, in display order. */
export async function visibleServices(): Promise<Service[]> {
  const all = await getCollection('services', (s) => s.data.confirmed || REVIEW);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const serviceHref = (s: Service) => `/services/${s.id}`;
export const bookHref = (s?: Service) => (s ? `/book?service=${s.id}` : '/book');

/** FAQ entries this build shows. */
export const visibleFaq = (s: Service) => s.data.faq.filter((f) => !f.confirm || REVIEW);
