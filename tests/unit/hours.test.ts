// node --experimental-strip-types --test tests/unit/*.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openStatus, hoursRows, formatTime, type Hours } from '../../src/lib/hours.ts';

const hours: Hours = {
  mon: ['09:00', '17:00'], tue: ['09:00', '17:00'], wed: ['09:00', '17:00'],
  thu: ['09:00', '17:00'], fri: ['09:00', '17:00'], sat: ['10:00', '17:00'], sun: null,
};
const TZ = 'America/Toronto';
// Oct 2026 is EDT (UTC-4). Oct 5, 2026 is a Monday.
const at = (iso: string) => new Date(iso);

test('formatTime', () => {
  assert.equal(formatTime('09:00'), '9:00 AM');
  assert.equal(formatTime('17:00'), '5:00 PM');
  assert.equal(formatTime('12:30'), '12:30 PM');
  assert.equal(formatTime('00:15'), '12:15 AM');
});

test('open mid-day on a weekday', () => {
  assert.deepEqual(openStatus(hours, at('2026-10-05T14:00:00-04:00'), TZ),
    { open: true, text: 'Open today until 5:00 PM', short: 'Open until 5 PM' });
});

test('before opening on a weekday', () => {
  assert.deepEqual(openStatus(hours, at('2026-10-05T08:15:00-04:00'), TZ),
    { open: false, text: 'Closed now · opens today at 9:00 AM', short: 'Opens today at 9 AM' });
});

test('closing time is closed', () => {
  assert.equal(openStatus(hours, at('2026-10-05T17:00:00-04:00'), TZ).open, false);
});

test('Friday evening points to Saturday 10', () => {
  assert.equal(openStatus(hours, at('2026-10-09T18:00:00-04:00'), TZ).text, 'Closed now · opens tomorrow 10:00 AM');
});

test('Saturday evening skips closed Sunday to Monday', () => {
  assert.equal(openStatus(hours, at('2026-10-10T18:00:00-04:00'), TZ).text, 'Closed now · opens Mon 9:00 AM');
  assert.equal(openStatus(hours, at('2026-10-10T18:00:00-04:00'), TZ).short, 'Opens Mon 9 AM');
});

test('Sunday says tomorrow', () => {
  assert.equal(openStatus(hours, at('2026-10-11T12:00:00-04:00'), TZ).text, 'Closed now · opens tomorrow 9:00 AM');
});

test('uses the dealer time zone, not the machine', () => {
  // 13:30 UTC on Monday = 9:30 AM in Toronto (open), regardless of where the test runs.
  assert.equal(openStatus(hours, at('2026-10-05T13:30:00Z'), TZ).open, true);
  // 02:00 UTC Tuesday = 10 PM Monday in Toronto (closed).
  assert.equal(openStatus(hours, at('2026-10-06T02:00:00Z'), TZ).text, 'Closed now · opens tomorrow 9:00 AM');
});

test('winter time (EST) also works', () => {
  // Jan 5, 2027 is a Tuesday; 14:30 UTC = 9:30 AM EST.
  assert.equal(openStatus(hours, at('2027-01-05T14:30:00Z'), TZ).open, true);
});

test('hoursRows groups equal days and uses the closed note', () => {
  assert.deepEqual(
    hoursRows(hours, { sun: 'By appointment' }).map((r) => [r.dayLabel, r.text]),
    [['Mon–Fri', '9:00 AM–5:00 PM'], ['Sat', '10:00 AM–5:00 PM'], ['Sun', 'By appointment']],
  );
});
