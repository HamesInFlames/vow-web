// Display formatting: CAD, phone links, units.

const cad0 = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const cad2 = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 });
const num = new Intl.NumberFormat('en-CA');

/** 8494 → "$8,494" */
export const formatCad = (n: number) => cad0.format(Math.round(n));
/** 6.5 → "$6.50" */
export const formatCadCents = (n: number) => cad2.format(n);
export const formatNumber = (n: number) => num.format(n);

/** "905-605-7056" → "tel:+19056057056" */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.length === 10 ? '1' + digits : digits}`;
}

/** "1841 Hwy 7, Concord, ON L4K 1V4" from business.json's address. */
export const addressLine = (a: { street: string; city: string; region: string; postal: string }) =>
  `${a.street}, ${a.city}, ${a.region} ${a.postal}`;

/** Service price line (AGENTS.md): only once Paul confirms a price; otherwise the note.
 *  'from' → "From $129 + HST"; 'plus-parts' → "$199 plus parts and HST" (a fixed labour price, parts extra). */
export function priceLine(fromPriceCad: number | undefined, note = 'Quote after inspection', format: 'from' | 'plus-parts' = 'from'): string {
  if (!fromPriceCad) return note;
  return format === 'plus-parts' ? `${formatCad(fromPriceCad)} plus parts and HST` : `From ${formatCad(fromPriceCad)} + HST`;
}

/** "905-605-7056" → "sms:+19056057056" */
export const smsHref = (phone: string) => telHref(phone).replace(/^tel:/, 'sms:');
