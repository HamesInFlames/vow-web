// node --experimental-strip-types --test tests/unit/*.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../../src/lib/validate.ts';
import { priceLine } from '../../src/lib/format.ts';

test('validateLead: a name and a phone is enough', () => {
  assert.deepEqual(validateLead({ name: 'Ana', phone: '905-738-1253' }), {});
  assert.deepEqual(validateLead({ name: 'Ana', email: 'ana@example.com' }), {});
});

test('validateLead: needs a name and a way to reply', () => {
  const e = validateLead({ name: '  ', phone: '', email: '' });
  assert.ok(e.name);
  assert.ok(e.phone);
});

test('validateLead: short phone, bad email, bad year', () => {
  assert.ok(validateLead({ name: 'A', phone: '738-1253' }).phone);
  assert.ok(validateLead({ name: 'A', phone: '9057381253', email: 'ana@' }).email);
  assert.ok(validateLead({ name: 'A', phone: '9057381253', year: '18' }).year);
  assert.ok(validateLead({ name: 'A', phone: '9057381253', year: '1890' }).year);
  assert.equal(validateLead({ name: 'A', phone: '9057381253', year: '2018' }).year, undefined);
});

test('validateLead: consent only checked on forms that have the box', () => {
  assert.ok(validateLead({ name: 'A', phone: '9057381253', consent: false }).consent);
  assert.equal(validateLead({ name: 'A', phone: '9057381253', consent: true }).consent, undefined);
  assert.equal(validateLead({ name: 'A', phone: '9057381253' }).consent, undefined);
});

test('validateLead: the part request needs the part', () => {
  assert.ok(validateLead({ name: 'A', phone: '9057381253', part: ' ' }).part);
  assert.equal(validateLead({ name: 'A', phone: '9057381253', part: 'Water pump' }).part, undefined);
  assert.equal(validateLead({ name: 'A', phone: '9057381253' }).part, undefined);
});

test('priceLine: a confirmed price, otherwise the note (never "Call for price")', () => {
  assert.equal(priceLine(129), 'From $129 + HST');
  assert.equal(priceLine(undefined), 'Quote after inspection');
  assert.equal(priceLine(undefined, 'Quote by phone'), 'Quote by phone');
});
