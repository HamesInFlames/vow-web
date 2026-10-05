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

/** Service price line (AGENTS.md): "From $129 + HST" only once Paul confirms a price; otherwise the note. */
export function priceLine(fromPriceCad: number | undefined, note = 'Quote after inspection'): string {
  return fromPriceCad ? `From ${formatCad(fromPriceCad)} + HST` : note;
}

/** "905-605-7056" → "sms:+19056057056" */
export const smsHref = (phone: string) => telHref(phone).replace(/^tel:/, 'sms:');
