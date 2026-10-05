// Today's open/closed status from business.json hours, in the shop's time zone.
// Pure functions so they can be unit tested and run in the browser (UtilityRow script).

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type Hours = Record<DayKey, [string, string] | null>;

export const DAY_KEYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY_NAMES: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
export const DAY_SHORT: Record<DayKey, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

/** "17:00" → "5:00 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Day of week and minutes since midnight for `now` in `timeZone`. */
export function localParts(now: Date, timeZone: string): { day: DayKey; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = get('weekday').slice(0, 3).toLowerCase() as DayKey;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export interface OpenStatus {
  open: boolean;
  /** Line for the utility row, e.g. "Open today until 5:00 PM". */
  text: string;
  /** Phone-width version, e.g. "Open until 5 PM". */
  short: string;
}

/** "17:00" → "5 PM", "17:30" → "5:30 PM" */
export const formatTimeShort = (hhmm: string) => formatTime(hhmm).replace(':00 ', ' ');

/** Next opening after the current moment, as "Mon 9:00 AM" or "today at 10:00 AM". */
function nextOpening(hours: Hours, day: DayKey, minutes: number, fmt = formatTime): string | null {
  const start = DAY_KEYS.indexOf(day);
  for (let i = 0; i < 7; i++) {
    const key = DAY_KEYS[(start + i) % 7];
    const span = hours[key];
    if (!span) continue;
    if (i === 0) {
      if (minutes < toMinutes(span[0])) return `today at ${fmt(span[0])}`;
      continue;
    }
    if (i === 1) return `tomorrow ${fmt(span[0])}`;
    return `${DAY_SHORT[key]} ${fmt(span[0])}`;
  }
  return null;
}

export function openStatus(hours: Hours, now: Date, timeZone: string): OpenStatus {
  const { day, minutes } = localParts(now, timeZone);
  const span = hours[day];
  if (span && minutes >= toMinutes(span[0]) && minutes < toMinutes(span[1])) {
    return { open: true, text: `Open today until ${formatTime(span[1])}`, short: `Open until ${formatTimeShort(span[1])}` };
  }
  const next = nextOpening(hours, day, minutes);
  const nextShort = nextOpening(hours, day, minutes, formatTimeShort);
  return {
    open: false,
    text: next ? `Closed now · opens ${next}` : 'Closed now',
    short: nextShort ? `Opens ${nextShort}` : 'Closed',
  };
}

/** Rows for an hours table, grouping consecutive days with the same hours: "Mon–Fri 9:00 AM–5:00 PM". */
export function hoursRows(hours: Hours, closedNote: Partial<Record<DayKey, string>> = {}) {
  const order: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const label = (k: DayKey) => {
    const s = hours[k];
    return s ? `${formatTime(s[0])}–${formatTime(s[1])}` : (closedNote[k] ?? 'Closed');
  };
  const rows: { days: DayKey[]; text: string }[] = [];
  for (const k of order) {
    const text = label(k);
    const last = rows[rows.length - 1];
    if (last && last.text === text) last.days.push(k);
    else rows.push({ days: [k], text });
  }
  return rows.map((r) => ({
    days: r.days,
    dayLabel: r.days.length === 1
      ? DAY_SHORT[r.days[0]]
      : `${DAY_SHORT[r.days[0]]}–${DAY_SHORT[r.days[r.days.length - 1]]}`,
    text: r.text,
  }));
}
