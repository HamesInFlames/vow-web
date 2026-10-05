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

/** "905-605-7056" → "sms:+19056057056" */
export const smsHref = (phone: string) => telHref(phone).replace(/^tel:/, 'sms:');
