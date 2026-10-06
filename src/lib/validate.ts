// Lead form checks, shared by the form island and the unit tests. Messages say what to fix, in plain words.

export interface LeadInput {
  name?: string;
  phone?: string;
  email?: string;
  year?: string;
  /** The part request's "What part do you need?"; undefined on the other forms. */
  part?: string;
  /** The "OK to contact me" box; undefined skips the check. */
  consent?: boolean;
}

const MAX_YEAR = new Date().getFullYear() + 1;

export function validateLead(v: LeadInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!v.name?.trim()) errors.name = 'Please tell us your name.';
  const phone = (v.phone ?? '').replace(/\D/g, '');
  const email = (v.email ?? '').trim();
  if (!phone && !email) errors.phone = 'Please give us a phone number or an email so we can reply.';
  else if (phone && (phone.length < 10 || phone.length > 11)) errors.phone = 'That phone number doesn’t look right. Include the area code.';
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'That email address doesn’t look right.';
  const year = (v.year ?? '').trim();
  if (year && !(/^\d{4}$/.test(year) && +year >= 1950 && +year <= MAX_YEAR)) {
    errors.year = 'Please enter the year as four digits, like 2018.';
  }
  if (v.part !== undefined && !v.part.trim()) errors.part = 'Please tell us which part you need.';
  if (v.consent === false) errors.consent = 'Please tick this box so we can call you back.';
  return errors;
}
