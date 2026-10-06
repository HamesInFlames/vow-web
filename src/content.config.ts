// Content collections (plan §3c). One JSON file per service in src/content/services/.
// Unconfirmed services (and unconfirmed FAQ answers) render only in review builds; see lib/services.ts.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
  /** Set when the answer isn't verified yet: hidden in production, [confirm] chip in review builds. */
  confirm: z.string().optional(),
});

const service = z
  .object({
    name: z.string().min(1),
    /** Sort order on /services and the home tiles. */
    order: z.number().int(),
    summary: z.string().min(1).max(160),
    vehicleTypes: z.array(z.string()).default([]),
    /** Only once Paul confirms a price: shown as "From $X + HST". */
    fromPriceCad: z.number().int().positive().optional(),
    priceNote: z.string().default('Quote after inspection'),
    /** How a confirmed price reads: "From $X + HST", or "$X plus parts and HST" for a fixed labour price. */
    priceFormat: z.enum(['from', 'plus-parts']).default('from'),
    /** Usual time in the shop, only once confirmed. */
    turnaround: z.string().optional(),
    includes: z.array(z.string()).min(1),
    bring: z.array(z.string()).default([]),
    faq: z.array(faq).default([]),
    related: z.array(reference('services')).default([]),
    season: z.enum(['fall', 'spring']).optional(),
    /** What the "Photo coming" block on the page should eventually show. */
    photo: z.string().min(1),
    /** true = on VOW's own current site or confirmed by Paul/Rae. false = hidden in production. */
    confirmed: z.boolean(),
    /** Open questions for Rae, collected by scripts/confirm-report.mjs. */
    confirm: z.array(z.string()).default([]),
  })
  .refine((s) => !/call for price|contact for price/i.test(s.priceNote), {
    message: 'Never "Call for price" (AGENTS.md): use "Quote after inspection"',
  });

export const collections = {
  services: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/services' }),
    schema: service,
  }),
};
