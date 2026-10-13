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
 *  'from' → "From $129 + HST"; 'plus-parts' → "$199 plus parts and HST" (a fixed labour price, parts extra),
 *  or with a motorhome price "Trailers $199, motorhomes $249, plus parts and HST";
 *  'hourly' (with both rates) → "$199 an hour for trailers, $249 for motorhomes, plus parts and HST". */
export function priceLine(
  fromPriceCad: number | undefined,
  note = 'Quote after inspection',
  format: 'from' | 'plus-parts' | 'hourly' = 'from',
  motorhomeCad?: number,
): string {
  if (!fromPriceCad) return note;
  if (format === 'hourly') {
    return motorhomeCad
      ? `${formatCad(fromPriceCad)} an hour for trailers, ${formatCad(motorhomeCad)} for motorhomes, plus parts and HST`
      : `${formatCad(fromPriceCad)} an hour, plus parts and HST`;
  }
  if (format === 'plus-parts') {
    return motorhomeCad
      ? `Trailers ${formatCad(fromPriceCad)}, motorhomes ${formatCad(motorhomeCad)}, plus parts and HST`
      : `${formatCad(fromPriceCad)} plus parts and HST`;
  }
  return `From ${formatCad(fromPriceCad)} + HST`;
}

/** "905-605-7056" → "sms:+19056057056" */
export const smsHref = (phone: string) => telHref(phone).replace(/^tel:/, 'sms:');

/** business.json `social` → labelled links in a fixed order (Instagram, TikTok, Facebook, YouTube). */
const SOCIAL_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', youtube: 'YouTube' };
export const socialLinks = (social: Record<string, string | undefined>) =>
  Object.keys(SOCIAL_LABELS)
    .filter((k) => social[k])
    .map((k) => ({ label: SOCIAL_LABELS[k], href: social[k] as string }));
