import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingRange, validateBooking } from '../lib/booking.ts';

const now = new Date(2026, 8, 10, 12);
const valid = { doctorId: 'nadia', alias: 'Nama Contoh', date: '2026-09-11', time: '09:00' };
test('accepts a valid demo choice and both booking-window boundaries', () => {
  assert.equal(validateBooking(valid, now), null);
  assert.equal(validateBooking({ ...valid, date: '2026-10-10' }, now), null);
});
test('rejects unknown doctors and time slots belonging to another doctor', () => {
  assert.ok(validateBooking({ ...valid, doctorId: 'missing' }, now));
  assert.ok(validateBooking({ ...valid, time: '15:00' }, now));
});
test('rejects today, past dates, and dates beyond the booking window', () => {
  for (const date of ['2026-09-10', '2026-09-01', '2026-10-11']) assert.ok(validateBooking({ ...valid, date }, now));
});
test('rejects malformed or impossible calendar dates', () => {
  for (const date of ['', 'not-a-date', '2026-09-31', '2026-02-30']) assert.ok(validateBooking({ ...valid, date }, now));
});
test('trims names before checking length and rejects oversized names', () => {
  assert.ok(validateBooking({ ...valid, alias: '  ' }, now));
  assert.ok(validateBooking({ ...valid, alias: 'A' }, now));
  assert.ok(validateBooking({ ...valid, alias: 'a'.repeat(61) }, now));
  assert.equal(validateBooking({ ...valid, alias: '  Budi  ' }, now), null);
});
test('computes local calendar ranges correctly across year boundaries', () => {
  assert.deepEqual(bookingRange(new Date(2026, 11, 31, 23)), { min: '2027-01-01', max: '2027-01-30' });
});
