// Consignment data (src/data/consign.json), validated at build time like the content collections.
// Visibility rules: `confirm` items and `lawyer` types render only in review builds (PUBLIC_REVIEW=1).
import { z } from 'astro/zod';
import raw from '../data/consign.json';
import { REVIEW } from './site';

const item = z.object({ confirm: z.string().optional() });
const schema = z.object({
  types: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
        label: z.string().min(1),
        powered: z.boolean(),
        /** Lawyer-gated (OMVIC risk): review builds only, with a "Lawyer to review" chip. */
        lawyer: z.boolean(),
        confirmed: z.boolean(),
        confirm: z.array(z.string()).default([]),
      }),
    )
    .min(1),
  lawyerNote: z.string().min(1),
  costSentence: z.string().regex(/^No upfront cost\./),
  steps: z.array(item.extend({ title: z.string().min(1), text: z.string().min(1) })).min(1),
  terms: z.array(item.extend({ id: z.string(), label: z.string().min(1), text: z.string().min(1) })),
  faq: z.array(item.extend({ q: z.string().min(1), a: z.string().min(1) })),
});

export const consign = schema.parse(raw);
export type ConsignType = (typeof consign.types)[number];

const shown = (x: { confirm?: string }) => !x.confirm || REVIEW;

/** Unit types this build offers (lawyer-gated and unconfirmed types only in review builds). */
export const consignTypes = consign.types.filter((t) => (t.confirmed || REVIEW) && (!t.lawyer || REVIEW));
export const consignTerms = consign.terms.filter(shown);
export const consignFaq = consign.faq.filter(shown);
export const consignSteps = consign.steps.filter(shown);
